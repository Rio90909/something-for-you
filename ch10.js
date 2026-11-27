/* Chapter 10 — Reasons You Are Special (mist). Transplanted verbatim
   from the standalone demo 5 + bigger heart (stroke 1.6, cap 63),
   adapted for the book: c10- ids, no demo mute button, no filming
   finger, book interface window.__ch10. Loaded lazily on first
   arrival at page 10; the book owns the music handoff. */

(function(){
'use strict';
/* ================================================================
   CHAPTER 10 — "Reasons You Are Special" (mist demo 5, standalone)
   TRANSPLANT NOTE (for the book, page 10):
   - The mist pane OWNS its touch: pane has touch-action:none and the
     handlers below call preventDefault. In the book, the page-turn swipe
     (horizontal >= 80px) must be suppressed while a pointer is down on
     the pane: set window.__c10Wiping = true on pointerdown and false on
     pointerup/pointercancel; the book's swipe handler checks that flag
     first and ignores the swipe. Same family as page 5's 190px rule.
   - enter()/exit() start/stop the single rAF loop and the audio.
     Wire them to the page enter/exit like __ch12 / __letter13.
   - Motion = transform/opacity only. No blur, no backdrop-filter,
     no mix-blend-mode, no animated box-shadows. The mist is painted
     pixels on ONE canvas (#mist); droplets live on a second small
     transparent particle canvas (#drops) — the book already does the
     same (petals canvas + hearts canvas on ch5).
   - DEMO 5 changes (user-approved three-way review of demo 4, 2026-11-27;
     ratings Muse 8.5 / ChatGPT 8.2 / Gemini 7.8; base = demo 4):
     * NO BLUR on the words at all (user agreed with Gemini): the blur /
       ghost is deleted entirely — the text is 100% sharp underneath
       from the start and ONLY the fully-opaque frost layer hides it.
       No blurry word-ghost before wiping, just mist; wiped words are
       instantly crisp. No blur filter anywhere.
     * SMOOTH CONTINUOUS WIPE: the stamped rimmed circles and the
       champagne edge-ring are gone — the finger draws one continuous
       path (strokeSeg: feather pass under a clear core pass, round
       caps/joins). No rings, no gold outlines, no bright blobs; the
       cleared region is genuinely transparent. Trail narrower (BRUSH 18).
     * AUTO-MELT SOONER (Gemini's fix): the trigger measures only the
       centre text zone and melts at ~50% cleared — a few good swipes
       over the words, instead of 25–30s of rubbing.
     * MIST TEXTURE: stronger gentle variation — rose-tinted blotches,
       more condensation blobs, faint baked-in drip streaks — so the
       pane never reads as a plain white card. Still only 2–3 beads.
     * COMPLETED REASON: bigger heart (cap 63, ~70x63, stroke 1.6)
       with 20px spacing below the words — user order 2026-11-27.
     * Everything else kept from demo 4: small heart below the words,
       airy hush + plink, chord, breath reset, 10s auto-advance.
   - DEMO 4 changes (user voice order, 2026-11-27; base = demo 2):
     * NO glass shine: demo 3's specular streak is gone entirely.
     * NO auto-melt / auto-wipe: the whole pane never clears itself.
       She wipes MANUALLY — but the wipe is GENEROUS: the grid marks a
       wide radius (MARK_R) around her fingertip, and the reveal keys
       on the WORDS (~88% of the text cells uncovered), so two or three
       strokes over the words uncover them and the whole glass clears.
       The visible trail stays a narrow fingertip (BRUSH 22) — the
       generosity is in the clearing, not the look.
     * NO mode choice (it existed only for the auto-wipe).
     * Auto-advance: 10s of doing nothing after a reason is revealed
       moves to the next reason by itself. Any touch restarts the
       10s timer. Next stays for sooner. Last reason never auto-advances.
     * Ghost: the frost is tuned so the words show as a faint unreadable
       blur — she can tell words are written there, but cannot read them
       before wiping. (Demo 2's 0.93 frost hid them completely.)
     * Heart: small hairline heart BELOW the words, as in demo 2.
   - DEMO 2 changes (unified Muse + ChatGPT + Gemini review of demo 1):
     * Words live UNDER the frost from the start: .reason is always
       visible; the frost veils it until her finger wipes it crisp.
       No pop-in at a threshold. (Demo 5: frost is now fully opaque
       and the faint ghost is deleted — no blur at all.)
     * Wipe is a real fingertip: hard-core brush (BRUSH 24), no beige
       halo; a thin champagne wet-edge ring is left at the wipe edge.
     * Heart: SMALL hairline heart BELOW the words (fitHeartBelow).
       A framing heart was proven impossible for this text width by QA
       pixel checks, so the heart is kept as a small 1.2px gold heart
       under the text — same completion moment, never touches a letter.
       Draws only after the words are fully readable; Next appears
       only after the heart finishes.
     * Sound: NO low hum at all — airy filtered-noise hush only, plus
       a delicate two-tone plink when a bead rolls. Chord + exhale kept.
     * Reset hides the old words INSTANTLY (visibility) and brings the
       fresh frost back fully opaque before the new words may show.
     * Drops: max 10, max 3 heavy beads, crisp highlight + rim sprite.
   ================================================================ */
var REASONS = [
  "Because your smile turns an ordinary day into a celebration.",
  "Because you listen with your whole heart \u2014 and everyone feels it.",
  "Because your kindness is quiet, and it changes every room you enter.",
  "Because you dream out loud \u2014 and you make others believe too.",
  "Because you are you. That is the whole reason."
];
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var pane = document.getElementById('c10pane');
var mist = document.getElementById('c10mist');
var drops = document.getElementById('c10drops');
var mctx = mist.getContext('2d');
var dctx = drops.getContext('2d');
var reasonEl = document.getElementById('c10reason');
var idxEl = document.getElementById('c10idx');
var hintEl = document.getElementById('c10hint');
var nextBtn = document.getElementById('c10nextBtn');
var heartSvg = document.getElementById('c10heartSvg');
var heartPath = document.getElementById('c10heartPath');
var breathEl = document.getElementById('c10breath');

var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
var W = 0, H = 0;                 // pane size in CSS px
var COLS = 20, ROWS = 28;
var grid = new Uint8Array(COLS * ROWS);
var cleared = 0, totalCells = COLS * ROWS;
/* Text-area cells: the grid cells whose centres fall inside the reason's
   text rect. The reveal keys on the TEXT, not the whole pane. */
var textMask = new Uint8Array(COLS * ROWS);
var textCells = 0, textCleared = 0;
var TEXT_AT = 50;                 // % of CENTRE TEXT-zone cells cleared -> auto-melt
                                  // (demo 5, Gemini's fix): measure only the words'
                                  // own cells, not the whole tall pane, and melt at
                                  // ~50% — a few good swipes over the words clear
                                  // the glass, instead of 25–30s of rubbing.
var BRUSH = 18;                   // erase radius, CSS px — narrower, a real fingertip
var MARK_R = 24;                  // demo 5: grid-mark radius close to the visible
                                  // trail, so the measured % matches what she sees

var S = {
  idx: 0, revealed: false, wiping: false, muted: false,
  droplets: [], heavy: 0, beadsRolled: 0, plinkedPane: false,
  plinks: 0, chords: 0, exhales: 0, hushStarts: 0,
  revealSeq: 0, everWiped: false, distHeavy: 0,
  advTimer: 0, advArmedAt: 0, last: null, speed: 0,
  raf: 0, loopOn: false, lastT: 0, awake: true
};

/* ---------- frost sprite (pre-rendered once per size) ---------- */
var frost = document.createElement('canvas');
/* Demo 5: the stamp sprites are GONE. Demo 4 stamped a rimmed circle on
   every touch move, which made the 'caterpillar / stacked-coins' rings
   all three reviewers flagged. The finger now draws ONE smooth
   continuous path (strokeSeg below) — no stamps, no rings. */
var dropSprite = (function(){
  var c = document.createElement('canvas'); c.width = c.height = 40;
  var g = c.getContext('2d');
  var gr = g.createRadialGradient(17, 15, 1, 20, 20, 19);
  gr.addColorStop(0, 'rgba(255,255,255,0.75)');
  gr.addColorStop(0.5, 'rgba(226,236,244,0.38)');
  gr.addColorStop(0.85, 'rgba(200,215,228,0.20)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(20, 20, 19, 0, 7); g.fill();
  g.strokeStyle = 'rgba(120,100,112,0.22)'; g.lineWidth = 1.4;   // faint bottom rim
  g.beginPath(); g.arc(20, 20, 17.5, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.95)';                        // specular highlight
  g.beginPath(); g.arc(14.5, 13.5, 4.6, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.beginPath(); g.arc(25, 26, 2.2, 0, 7); g.fill();
  return c;
})();
function sizeCanvases(){
  var r = pane.getBoundingClientRect();
  W = Math.max(10, Math.round(r.width)); H = Math.max(10, Math.round(r.height));
  mist.width = drops.width = frost.width = Math.round(W * DPR);
  mist.height = drops.height = frost.height = Math.round(H * DPR);
  mctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  dctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
function buildFrost(){
  var c = frost.getContext('2d');
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.clearRect(0, 0, W, H);
  c.fillStyle = 'rgba(245,233,237,1)'; c.fillRect(0, 0, W, H); // demo 5: FULLY OPAQUE mist — the sharp words underneath must not bleed through at all; the frost alone does the hiding (no blur anywhere)
  var i, x, y, rr, a;
  for (i = 0; i < 54; i++){           // soft blotches — white and warm rose, for gentle unevenness
    x = Math.random() * W; y = Math.random() * H; rr = 18 + Math.random() * 78;
    var g = c.createRadialGradient(x, y, 0, x, y, rr);
    if (Math.random() < 0.45){
      g.addColorStop(0, 'rgba(226,188,200,' + (0.06 + Math.random() * 0.08) + ')');
      g.addColorStop(1, 'rgba(226,188,200,0)');
    } else {
      g.addColorStop(0, 'rgba(255,255,255,' + (0.07 + Math.random() * 0.08) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
    }
    c.fillStyle = g; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
  }
  for (i = 0; i < 2400; i++){         // fine condensation speckle
    x = Math.random() * W; y = Math.random() * H; rr = 0.5 + Math.random() * 1.2;
    a = 0.05 + Math.random() * 0.1;
    c.fillStyle = Math.random() < 0.6 ? 'rgba(255,255,255,' + a + ')' : 'rgba(214,170,185,' + a + ')';
    c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
  }
  for (i = 0; i < 16; i++){           // bigger soft condensation blobs
    x = Math.random() * W; y = Math.random() * H; rr = 6 + Math.random() * 20;
    var g2 = c.createRadialGradient(x, y, 0, x, y, rr);
    g2.addColorStop(0, 'rgba(255,255,255,0.2)'); g2.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g2; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
  }
  for (i = 0; i < 3; i++){            // faint vertical drip streaks baked into the mist — glass, not a white card
    x = W * (0.15 + Math.random() * 0.7);
    var w = 2 + Math.random() * 3, h = H * (0.25 + Math.random() * 0.4);
    var y0 = Math.random() * H * 0.3;
    var g3 = c.createLinearGradient(0, y0, 0, y0 + h);
    g3.addColorStop(0, 'rgba(255,255,255,0.10)');
    g3.addColorStop(0.7, 'rgba(255,255,255,0.05)');
    g3.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g3; c.fillRect(x - w / 2, y0, w, h);
  }
  var v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
  v.addColorStop(0, 'rgba(216,178,190,0)'); v.addColorStop(1, 'rgba(216,178,190,0.18)');
  c.fillStyle = v; c.fillRect(0, 0, W, H);
}
function paintFrost(){
  mctx.save(); mctx.globalCompositeOperation = 'source-over';
  mctx.clearRect(0, 0, W, H); mctx.drawImage(frost, 0, 0, W, H); mctx.restore();
}

/* ---------- erase / grid / halo ---------- */
function mark(x, y, r){
  var c0 = Math.max(0, Math.floor((x - r) / W * COLS)), c1 = Math.min(COLS - 1, Math.floor((x + r) / W * COLS));
  var r0 = Math.max(0, Math.floor((y - r) / H * ROWS)), r1 = Math.min(ROWS - 1, Math.floor((y + r) / H * ROWS));
  for (var j = r0; j <= r1; j++) for (var i = c0; i <= c1; i++){
    var cx = (i + 0.5) * W / COLS, cy = (j + 0.5) * H / ROWS;
    var dx = cx - x, dy = cy - y;
    if (dx * dx + dy * dy < r * r * 0.81){
      var k = j * COLS + i;
      if (!grid[k]){ grid[k] = 1; cleared++; if (textMask[k]) textCleared++; }
    }
  }
}
/* Which grid cells belong to the current reason's words (for the reveal
   trigger). Recomputed whenever the reason text or the pane size changes. */
function computeTextMask(){
  textMask = new Uint8Array(COLS * ROWS); textCells = 0; textCleared = 0;
  var range = document.createRange();
  range.selectNodeContents(reasonEl);
  var rb = range.getBoundingClientRect();
  var pr = pane.getBoundingClientRect();
  var tx = rb.left - pr.left, ty = rb.top - pr.top, tw = rb.width, th = rb.height;
  for (var j = 0; j < ROWS; j++) for (var i = 0; i < COLS; i++){
    var cx = (i + 0.5) * W / COLS, cy = (j + 0.5) * H / ROWS;
    if (cx >= tx && cx <= tx + tw && cy >= ty && cy <= ty + th){
      textMask[j * COLS + i] = 1; textCells++;
    }
  }
}
/* Demo 5 auto-melt trigger: ~50% of the CENTRE TEXT-zone cells cleared
   by hand — a few good swipes over the words melt the whole glass.
   The melt is reveal()'s own mist fade; no separate animation. */
function checkReveal(){
  if (S.revealed) return;
  if (textCells > 0 && textCleared / textCells * 100 >= TEXT_AT) reveal();
}
function eraseAt(x, y, r, a){
  /* Only rolling beads use this now: one small soft dot that clears a
     faint trail behind a bead. The finger's wipe uses strokeSeg. */
  mctx.save();
  mctx.globalCompositeOperation = 'destination-out';
  mctx.globalAlpha = a;
  mctx.beginPath(); mctx.arc(x, y, r, 0, 7); mctx.fill();
  mctx.restore();
  /* eraseAt never marks the grid — only the finger's wipe does;
     rolling beads clear a trail visually but must not count
     toward the reveal. */
}
function strokeSeg(x0, y0, x1, y1){
  /* Demo 5: ONE smooth continuous path (lineCap/lineJoin 'round'),
     two passes — a soft feather pass under a clear core pass.
     No stamps, no outer ring, no gold outlines: the cleared glass
     is genuinely transparent with one subtle soft boundary. */
  mctx.save();
  mctx.globalCompositeOperation = 'destination-out';
  mctx.lineCap = 'round'; mctx.lineJoin = 'round';
  mctx.strokeStyle = 'rgba(0,0,0,0.32)';
  mctx.lineWidth = BRUSH * 2 + 14;
  mctx.beginPath(); mctx.moveTo(x0, y0); mctx.lineTo(x1, y1); mctx.stroke();
  mctx.strokeStyle = 'rgba(0,0,0,0.95)';
  mctx.lineWidth = BRUSH * 2;
  mctx.beginPath(); mctx.moveTo(x0, y0); mctx.lineTo(x1, y1); mctx.stroke();
  mctx.restore();
}
function wipeTo(x, y){
  var p = S.last;
  if (!p){ strokeSeg(x, y, x, y); mark(x, y, MARK_R); S.last = {x: x, y: y}; return; }
  var dx = x - p.x, dy = y - p.y, d = Math.sqrt(dx * dx + dy * dy);
  var steps = Math.max(1, Math.ceil(d / 4));
  for (var i = 1; i <= steps; i++){
    var px = p.x + dx * (i - 1) / steps, py = p.y + dy * (i - 1) / steps;
    var sx = p.x + dx * i / steps, sy = p.y + dy * i / steps;
    strokeSeg(px, py, sx, sy);   // continuous path — never a chain of stamps
    mark(sx, sy, MARK_R);
    var sd = d / steps;
    S.dist = (S.dist || 0) + sd;
    if (S.dist > 30){ S.dist = 0; spawnDrop(sx, sy + BRUSH * 0.55, false); }
    S.distHeavy = (S.distHeavy || 0) + sd;
    if (S.distHeavy > 90){ S.distHeavy = 0; spawnDrop(sx, sy + BRUSH * 0.55, true); }
  }
  S.last = {x: x, y: y};
  checkReveal();
}

/* ---------- droplets ---------- */
function spawnDrop(x, y, wantHeavy){
  if (S.droplets.length >= 10) return;   // restrained: a few beads, never a crowd
  var heavy = !!wantHeavy && S.heavy < 3;
  if (heavy) S.heavy++;
  S.droplets.push({
    x: x + (Math.random() * 10 - 5), y: y,
    r: heavy ? 4.5 + Math.random() * 1.5 : 1.2 + Math.random() * 1.0,
    heavy: heavy, vy: 0, rolling: false, born: performance.now(),
    rolled: 0, plinked: false, seed: Math.random() * 6.28, life: 6000, static: false
  });
}
/* Two beads already sit on the glass when the pane opens; they hold still
   until her first wipe, then roll. */
function seedBeads(){
  for (var i = 0; i < 2; i++){
    if (S.heavy >= 3) break;
    S.heavy++;
    S.droplets.push({
      x: W * (0.25 + Math.random() * 0.5), y: H * (0.12 + Math.random() * 0.3),
      r: 4.5 + Math.random() * 1.5, heavy: true, vy: 0, rolling: false,
      born: performance.now(), rolled: 0, plinked: false, seed: Math.random() * 6.28,
      life: 9000, static: true
    });
  }
  drawDrops();
}
function drawDrops(){
  dctx.clearRect(0, 0, W, H);
  for (var i = 0; i < S.droplets.length; i++){
    var d = S.droplets[i], a = d.heavy ? 0.85 : 0.5;
    if (!d.heavy) a *= Math.max(0.25, 1 - (performance.now() - d.born) / d.life);
    var s = d.r * 2.3;
    dctx.globalAlpha = a;
    dctx.drawImage(dropSprite, d.x - s / 2, d.y - s / 2, s, s);
  }
  dctx.globalAlpha = 1;
}
function updateDrops(dt, now){
  for (var i = S.droplets.length - 1; i >= 0; i--){
    var d = S.droplets[i];
    if (d.static){ if (S.everWiped){ d.static = false; d.born = now; } continue; }
    if (d.heavy && !REDUCED){
      if (!d.rolling && now - d.born > 700){ d.rolling = true; }
      if (d.rolling){
        d.vy = Math.min(d.vy + 260 * dt, 110);
        var nx = d.x + Math.sin(now / 380 + d.seed) * 6 * dt;
        var ny = d.y + d.vy * dt;
        d.rolled += Math.abs(ny - d.y);
        eraseAt(nx, ny, 4, 0.6);             // clear trail behind the bead
        d.x = nx; d.y = ny;
        if (d.rolled > 40 && !d.plinked){
          d.plinked = true; S.beadsRolled++;
          if (!S.plinkedPane){ S.plinkedPane = true; playPlink(); } // ONE quiet plink per pane
        }
        if (d.y > H + 10){ S.droplets.splice(i, 1); continue; }
      }
    } else if (!d.heavy && now - d.born > d.life){
      S.droplets.splice(i, 1);
    }
  }
}

/* ---------- audio (all synthesized, WebAudio) ---------- */
var AC = null, master = null, hushGain = null, noiseBuf = null;
function audioInit(){
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = S.muted ? 0 : 0.9; master.connect(AC.destination);
    var len = AC.sampleRate;
    noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
    var ch = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    var src = AC.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    /* Demo 2: airy filtered-noise hush ONLY — no low synth hum at all. */
    var bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1250; bp.Q.value = 0.55;
    hushGain = AC.createGain(); hushGain.gain.value = 0;
    src.connect(bp); bp.connect(hushGain); hushGain.connect(master); src.start();
  } catch (e){ AC = null; }
}
function setHush(v){ if (AC && hushGain) hushGain.gain.setTargetAtTime(v, AC.currentTime, 0.08); }
function tone(freq, t0, dur, peak, type){
  if (!AC) return;
  var o = AC.createOscillator(), g = AC.createGain();
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.1);
}
function playPlink(){
  if (!AC) return; S.plinks++;
  var t = AC.currentTime;
  var o = AC.createOscillator(), g = AC.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(1568, t);
  o.frequency.exponentialRampToValueAtTime(1180, t + 0.4);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.6);
  var o2 = AC.createOscillator(), g2 = AC.createGain();   // crystalline overtone
  o2.type = 'sine'; o2.frequency.setValueAtTime(3136, t);
  o2.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
  g2.gain.setValueAtTime(0.0001, t);
  g2.gain.exponentialRampToValueAtTime(0.012, t + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o2.connect(g2); g2.connect(master); o2.start(t); o2.stop(t + 0.5);
}
function playChord(){
  if (!AC) return; S.chords++;
  var t = AC.currentTime + 0.05;
  tone(523.25, t, 2.8, 0.045); tone(659.25, t + 0.08, 2.8, 0.04); tone(783.99, t + 0.16, 2.8, 0.04);
}
function playExhale(){
  if (!AC) return; S.exhales++;
  var t = AC.currentTime;
  var src = AC.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
  var g = AC.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.45);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
  src.connect(lp); lp.connect(g); g.connect(master); src.start(t); src.stop(t + 1.5);
}

/* ---------- heart (demo 2) ----------
   A framing heart around this text is geometrically impossible: the
   heart's lower sides converge toward its point and its top dip sits
   31% down, so at this text width (258px of a 316px pane) the outline
   crosses the letters at every size — proven by QA pixel checks
   (330 gold px inside the text rect at 360px, same at 393/320).
   So the heart is kept as a SMALL hairline heart BELOW the words:
   same gold, same draw-once completion moment, guaranteed clear of
   every letter. If the user ever wants a framing heart, the text
   column would have to narrow to ~200px first — his call.
   User order 2026-11-27: bigger + more visible (cap 63px, ~70x63,
   stroke 1.6) with 20px of clear space below the words. */
var heartLen = 0;
function fitHeartBelow(){
  var pr = pane.getBoundingClientRect();
  var range = document.createRange();
  range.selectNodeContents(reasonEl);
  var rb = range.getBoundingClientRect();
  var cx = rb.left - pr.left + rb.width / 2;
  var top = rb.bottom - pr.top + 20;   // demo 5: more deliberate clear space below the last line
  var avail = pr.height - top - 8;
  var h = Math.max(28, Math.min(63, avail));   // user order 2026-11-27: a little bigger + more visible (~70x63)
  var w = h * 200 / 180;
  heartSvg.style.left = (cx - w / 2) + 'px';
  heartSvg.style.top = top + 'px';
  heartSvg.style.width = w + 'px';
  heartSvg.style.height = h + 'px';
  heartSvg.style.transform = 'none';
  heartLen = heartPath.getTotalLength();
  heartPath.style.strokeDasharray = String(heartLen);
  heartPath.style.strokeDashoffset = String(heartLen);
}

/* ---------- reveal / reset ---------- */
function reveal(){
  if (S.revealed) return;
  S.revealed = true; S.wiping = false; setHush(0);
  var tok = ++S.revealSeq;   // guards the delayed heart / Next steps
  mist.style.opacity = '0'; drops.style.opacity = '0';
  hintEl.textContent = '';
  setTimeout(function(){
    mist.style.display = 'none'; drops.style.display = 'none';
  }, 750);
  playChord();
  /* Order: words readable (mist melted) -> thin heart draws -> Next appears. */
  setTimeout(function(){
    if (tok !== S.revealSeq || !S.revealed) return;
    fitHeartBelow();
    heartSvg.style.opacity = '1';
    void heartPath.getBoundingClientRect();
    heartPath.style.transition = 'stroke-dashoffset 1.2s ease';
    heartPath.style.strokeDashoffset = '0';
    setTimeout(function(){
      if (tok !== S.revealSeq || !S.revealed) return;
      nextBtn.textContent = S.idx >= REASONS.length - 1 ? 'Read again \u21BA' : 'Next reason \u2192';
      nextBtn.classList.add('on');
      /* Book: the corner Next (to Chapter 12) appears only once the 5th
         reason is revealed — unlock it here. */
      if (S.idx >= REASONS.length - 1){
        var nb10 = document.getElementById('nextBtn10');
        if (nb10) nb10.classList.add('on');
      }
      /* Demo 4: 10s of doing nothing after the reveal moves on by itself.
         Any touch restarts the 10s. Last reason never auto-advances. */
      if (S.idx < REASONS.length - 1) armAdv();
    }, REDUCED ? 250 : 1250);
  }, REDUCED ? 150 : 850);
}
function resetPane(nextIdx){
  S.revealSeq++;   // cancel any pending heart / Next timeouts from the last reveal
  disarmAdv();     // never auto-advance a gone reason
  S.idx = nextIdx;
  S.revealed = false; S.wiping = false; S.last = null; S.dist = 0; S.distHeavy = 0;
  S.droplets = []; S.heavy = 0; S.plinkedPane = false;
  grid = new Uint8Array(COLS * ROWS); cleared = 0;
  idxEl.textContent = String(nextIdx + 1);
  /* Hide the old words INSTANTLY (no fade) and keep the new words hidden
     behind fresh frost until the mist is fully back — no ghosting, no
     crossfade, the next reason is unreadable until she wipes it. */
  reasonEl.style.visibility = 'hidden';
  reasonEl.textContent = REASONS[nextIdx];
  computeTextMask();   // fresh mask for the new reason's words
  hintEl.textContent = 'RUB THE GLASS';
  nextBtn.classList.remove('on');
  var nb10 = document.getElementById('nextBtn10');
  if (nb10) nb10.classList.remove('on');   /* book: corner Next locks again */
  heartPath.style.transition = 'none';
  heartPath.style.strokeDashoffset = String(heartLen);
  heartSvg.style.opacity = '0';
  breathEl.classList.add('on');
  playExhale();
  paintFrost();
  dctx.clearRect(0, 0, W, H);
  seedBeads();
  mist.style.display = 'block'; drops.style.display = 'block';
  /* Frost back to fully opaque INSTANTLY (no fade-in): the new words must
     be behind solid mist before they are allowed to show. */
  mist.style.transition = 'none'; drops.style.transition = 'none';
  mist.style.opacity = '1'; drops.style.opacity = '1';
  void mist.offsetWidth;
  mist.style.transition = ''; drops.style.transition = '';
  setTimeout(function(){
    reasonEl.style.visibility = 'visible';
    breathEl.classList.remove('on');
  }, 650);
  ensureLoop();
}
nextBtn.addEventListener('click', function(){
  if (!S.revealed) return;
  audioInit();
  resetPane((S.idx + 1) % REASONS.length);
});
/* Book mute hook: the book's stage mute calls __ch10.setMuted(m) like __ch12. */
function setMuted(m){
  S.muted = !!m;
  if (master) master.gain.value = S.muted ? 0 : 0.9;
}

/* ---------- auto-advance (demo 4) ----------
   After a reason is revealed, 10s of doing nothing moves to the next
   reason by itself. Any touch/tap anywhere restarts the 10s timer.
   Next stays tappable to go sooner; the last reason never advances. */
function armAdv(){
  disarmAdv();
  S.advArmedAt = performance.now();
  S.advTimer = setTimeout(function(){
    if (S.revealed) nextBtn.click();
  }, 10000);
}
function disarmAdv(){
  if (S.advTimer){ clearTimeout(S.advTimer); S.advTimer = 0; }
  S.advArmedAt = 0;
}
document.addEventListener('pointerdown', function(e){
  if (!window.__c10On) return;   /* book: only while page 10 is the live page */
  if (S.revealed && S.advTimer && e.target !== nextBtn){
    armAdv();   // a touch restarts the 10s of doing nothing
  }
}, true);

/* ---------- pointer input (the mist owns the touch) ---------- */
function localPos(e){
  var r = pane.getBoundingClientRect();
  return {x: e.clientX - r.left, y: e.clientY - r.top};
}
pane.addEventListener('pointerdown', function(e){
  if (S.revealed) return;
  e.preventDefault();
  audioInit();
  if (AC && AC.state === 'suspended') AC.resume();
  S.wiping = true; S.everWiped = true; window.__c10Wiping = true;   // book: page-turn swipe ignores this
  S.hushStarts++;
  var p = localPos(e);
  try { pane.setPointerCapture(e.pointerId); } catch (err){}
  wipeTo(p.x, p.y);
  setHush(0.015);   // soft airy hush starts the moment the finger lands
  ensureLoop();
});
pane.addEventListener('pointermove', function(e){
  if (!S.wiping || S.revealed) return;
  e.preventDefault();
  var p = localPos(e);
  var now = performance.now();
  if (S.lastT) S.speed = Math.min(1, (Math.abs(p.x - S.last.x) + Math.abs(p.y - S.last.y)) / Math.max(1, now - S.lastT) / 1.2);
  S.lastT = now;
  setHush(0.05 * S.speed);   // airy hush, follows the finger's speed
  wipeTo(p.x, p.y);
});
function endWipe(){
  /* Always clear the flag: reveal() sets S.wiping=false mid-stroke, so an
     early return here would leave window.__c10Wiping stuck true and the
     book would never turn pages from this pane again. The flag stays true
     for the whole stroke (the book's capture-phase pointerup runs before
     this bubble handler), and is cleared the moment the finger lifts. */
  S.wiping = false; window.__c10Wiping = false; S.last = null; S.lastT = 0;
  setHush(0);
}
pane.addEventListener('pointerup', endWipe);
pane.addEventListener('pointercancel', endWipe);

/* ---------- single rAF loop (only while something moves) ---------- */
function loop(ts){
  if (!S.awake){ S.loopOn = false; return; }
  var now = performance.now();
  var dt = S.lastT ? Math.min(0.05, (now - S.lastT) / 1000) : 0.016;
  S.lastT = now;
  var busy = false;   // demo 5: no melt queue — the melt is reveal()'s own mist fade
  var anyLive = false;
  for (var k = 0; k < S.droplets.length; k++) if (!S.droplets[k].static){ anyLive = true; break; }
  if (anyLive){ updateDrops(dt, now); drawDrops(); busy = true; }
  if (S.wiping) busy = true;
  if (busy){ S.raf = requestAnimationFrame(loop); }
  else { S.loopOn = false; }
}
function ensureLoop(){
  if (!S.loopOn && S.awake){ S.loopOn = true; S.lastT = performance.now(); S.raf = requestAnimationFrame(loop); }
}

/* ---------- book interface ---------- */
window.__c10On = false;   /* true only while page 10 is the live page */
var enteredOnce = false;
function enter10(){
  /* First arrival: init() (script load) already set up reason 1.
     Re-entry: fresh reason 1, corner Next locked again. */
  window.__c10On = true;
  S.awake = true;
  if (enteredOnce) resetPane(0);
  enteredOnce = true;
  ensureLoop();
}
function leave10(){
  /* Own cleanup only — the book's nav handlers own the book-music
     fade/resume (this file runs outside the book's main scope). */
  window.__c10On = false;
  S.awake = false;
  disarmAdv();
  if (S.raf) cancelAnimationFrame(S.raf);
  S.loopOn = false;
  setHush(0);
}
window.__ch10 = {
  enter: enter10,
  exit: function(){ leave10(); },       /* Back -> Chapter Six */
  exitNext: function(){ leave10(); },   /* Next -> Chapter Twelve */
  exitClose: function(){ leave10(); },  /* book closing onto its cover */
  setMuted: setMuted,
  next: function(){ nextBtn.click(); },
  state: function(){
    return {
      idx: S.idx, total: REASONS.length,
      clearedPct: Math.round(cleared / totalCells * 100),
      textClearedPct: textCells ? Math.round(textCleared / textCells * 100) : 0,
      revealed: S.revealed, droplets: S.droplets.length, beadsRolled: S.beadsRolled,
      audio: {hush: S.hushStarts, plink: S.plinks, chord: S.chords, exhale: S.exhales},
      mistVisible: mist.style.display !== 'none',
      heartDrawn: heartPath.style.strokeDashoffset === '0',
      muted: S.muted, wiping: S.wiping,
      advArmed: !!S.advTimer, advArmedAt: S.advArmedAt
    };
  }
};

/* ---------- init ---------- */
function init(){
  reasonEl.textContent = REASONS[0];
  sizeCanvases();
  buildFrost();
  paintFrost();
  computeTextMask();
  heartLen = heartPath.getTotalLength();
  heartPath.style.strokeDasharray = String(heartLen);
  heartPath.style.strokeDashoffset = String(heartLen);
  seedBeads();
  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt);
    rt = setTimeout(function(){
      sizeCanvases(); buildFrost(); paintFrost();
      grid = new Uint8Array(COLS * ROWS); cleared = 0;
      computeTextMask();
      S.droplets = [];
      if (!S.revealed){ mist.style.display = 'block'; mist.style.opacity = '1'; }
    }, 200);
  });
  ensureLoop();
}
init();
})();
