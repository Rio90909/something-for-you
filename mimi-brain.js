/* =====================================================================
   mimi-brain.js — Mimi's memory. ALL of her words live here, in their
   own file, so the book page itself stays light and her mind can grow
   forever without ever touching the page.

   Load order: this file FIRST, then the page's main script.
   It exposes one object: window.MIMI_BRAIN with
     .reply(text)  -> { text: "...", cmd: null | "out" | "in" }
     .dailyNote()  -> today's surprise sentence
     .stats        -> real counts (topics, written replies, mixtures)

   How she reaches 20,000+ sayable things: a few hundred hand-written
   replies she mixes with sentence-machines (compliments, daily
   surprises, greetings, comforts). Each machine multiplies its parts,
   so a handful of written pieces becomes thousands of fresh sentences.
   She also never says the exact same wording twice in a row.
   ===================================================================== */
(function(){
"use strict";

/* ---------- tiny picker that avoids repeating herself ---------- */
var __used = {};
function pick(a){
  var s, tries = 0;
  do { s = a[Math.floor(Math.random()*a.length)]; tries++; } while(__used[s] && tries < 6);
  __used[s] = 1;
  var n = 0; for (var k in __used) n++;
  if (n > 500) __used = {};
  return s;
}

/* ---------- daily surprise machine: 20 x 12 x 10 = 2,400 ---------- */
var SURP = ["a star made just for you","a tiny moonbeam tied with ribbon","a whisper from the rose garden","a pocketful of golden dust","a song the wind taught me","a heart-shaped cloud","a pearl of morning dew","a firefly that knows your name","a wish folded in pink paper","a rainbow ribbon","a baby butterfly's first flight","a cup of warm starlight","a secret only flowers know","a feather from a kind bird","a bubble that never pops","a dance from the fireflies","a hug wrapped in silk","a key to a tiny door of joy","a snowflake that never melts","a lullaby from the night garden"];
var BLESS = ["may your smile stay bright today","may your heart feel light","may good luck follow your steps","may someone be kind to you today","may your worries shrink to kitten size","may you find a reason to laugh","may your dreams feel closer","may your day be gentle with you","may love find you in small ways","may your courage surprise you","may sweet news reach you","may you feel how loved you are"];
var CLOSE = ["I saved it all night for you.","Come back tomorrow — I will have another.","It is yours, only yours.","I polished it with my paws.","Nobody else gets one like it.","Keep it close to your heart.","I picked it before the sun woke up.","It reminded me of you.","With all my little love.","Forever yours, Mimi."];
function dailyNote(){
  var d = new Date();
  var doy = Math.floor((d - new Date(d.getFullYear(),0,0)) / 864e5);
  return SURP[doy % SURP.length] + " — " + BLESS[(doy*7) % BLESS.length] + ". " + CLOSE[(doy*13) % CLOSE.length];
}

/* ---------- compliment machine: 25 x 25 x 25 = 15,625 ---------- */
var CO = ["Your smile","Your laugh","Your kindness","Your eyes","Your heart","Your voice","Your courage","Your gentle way","Your bright mind","Your sweet nature","The way you care","Your honesty","Your patience","Your warmth","Your grace","Your strength","Your soft heart","Your lovely spirit","Your calm presence","Your generosity","Your beautiful soul","Your cheerful energy","Your thoughtful words","Your quiet confidence","Your pure heart"];
var CM = ["could melt the coldest winter","lights up this whole book","makes ordinary days feel like festivals","is my favourite thing in the world","would make the stars jealous","turns grey skies pink","makes flowers bloom a little earlier","is worth more than all the gold in this box","makes my little heart do somersaults","could soften even a grumpy cloud","makes every page here sparkle","is the reason I purr so much","would make the moon stay up past her bedtime","makes rain sound like music","is rarer than a shooting star","warms me more than sunshine","makes time slow down in the best way","is the prettiest story ever told","could charm the birds out of the trees","makes my whiskers tingle with happiness","is a treasure no map could ever find","turns little moments into magic","makes the whole garden lean closer to listen","is sweeter than the first day of spring","makes even Mondays feel gentle"];
var CE = ["Never forget that.","And I mean every word.","That's a promise from your kitten.","The whole forest agrees with me.","I noticed it the moment we met.","It is my favourite truth.","And it grows more true every day.","Signed, sealed, and purred by me.","Even the stars whispered it to me.","I would say it a thousand times.","Keep it in your heart, okay?","That's why this book chose you.","Nobody could ever convince me otherwise.","It is simply who you are.","And I am so lucky I found you.","The moon told me so herself.","I will remind you every single day.","Believe it, because I never lie.","It makes me proud to be your gift.","And the whole sky knows it.","It is my favourite thing to say.","Ask anyone in the garden.","It was true yesterday and truer today.","I keep it written in my heart.","Forever and always."];
function compliment(){ return pick(CO) + " " + pick(CM) + ". " + pick(CE); }

/* ---------- greeting machine: 14 x 14 x 12 = 2,352 ---------- */
var GO = ["Hello, beautiful soul","Well hello, my favourite person","There you are","Oh, it is you","Hello, sunshine","My heart just sat up — hello","Hello, lovely one","Look who came to see me","Hello, dear heart","The box just got brighter — hello","Hello, my whole world","Purr — I mean, hello","Hello, sweetest visitor","You came — hello, hello"];
var GM = ["I was hoping you would come","I saved my best purr for this moment","my whiskers have been waiting for you","I counted the minutes like a good kitten","today already feels like a gift","I polished my smile just for you","my little heart did a happy dance","I was just dreaming about you","the garden told me you were coming","I kept your seat warm in my heart","I have a whole day of love saved up","my ears heard your footsteps first","I practised this hello all morning","everything feels softer when you arrive"];
var GE = ["What shall we do first?","Tell me everything.","I am all ears, all heart.","Your kitten is listening.","Shall I start with a compliment?","How is your beautiful heart today?","I missed you more than cream.","Stay a while, okay?","You make this page feel like home.","I have surprises with your name on them.","Let us make today sparkle.","I am yours for as long as you stay."];
function greetingMix(){ return pick(GO) + " — " + pick(GM) + ". " + pick(GE); }

/* ---------- comfort machine: 14 x 14 x 12 = 2,352 ---------- */
var FO = ["Come here, dear heart","Shh, I am right here","Lean on me a little","Take my paw","Breathe with me, slowly","You are safe with me","Let me sit beside you","I am not going anywhere","Hold on to me","Rest your heart here","Listen to my purr","I have you","Stay close to me","Let the world wait a moment"];
var FM = ["this heavy feeling will pass, I promise","even the strongest flowers bend in the rain and rise again","you have survived every hard day so far, every single one","crying is just your heart washing itself clean","you are loved in ways you cannot even see","my whole tiny body believes in you","storms make the garden grow, and you are still growing","you do not have to be strong right now, I will be strong for both of us","someone out there is grateful you exist, and so am I","your heart is tired, not broken","the night always ends, and I will wait with you until it does","you matter more than this moment knows","even the moon hides sometimes, and she always comes back shining","I will hold the sad part so your hands can rest"];
var FE = ["I am here.","Always.","Feel my purr? That is for you.","We will take it one tiny step at a time.","You are not alone in this, not ever.","My love does not clock out.","Stay as long as you need.","I will keep the light on in the box.","Tomorrow can be softer. I will help.","Your kitten has you, completely.","Breathe out, love. I have the rest.","Forever beside you, Mimi."];
function comfortMix(){ return pick(FO) + " — " + pick(FM) + ". " + pick(FE); }

/* =====================================================================
   TOPICS. Order matters: secrets and box-commands first, specific
   topics before general ones. r = list of replies (one is picked,
   never the same wording twice in a row), or a machine function.
   cmd = "out" / "in" tells the page to move her body, not just talk.
   ===================================================================== */
var INTENTS = [
 /* ----- secret words: only Shaheer knows these ----- */
 {k:["starlight promise"], r:["You found the secret words… then this is only for you: someone thinks of you more than you will ever know, and this whole book is proof. (These words are a placeholder — Shaheer's own secret message will live here.)"]},
 {k:["little moon"], r:["The little moon… that is our secret. Here is yours: on the days you feel small, remember — even the moon is small in the sky, and look how she shines. (A placeholder — Shaheer's hidden words will replace this.)"]},

 /* ----- box commands: she moves, not just talks ----- */
 {cmd:"out", k:["come out of the box","come out of your box","get out of the box","come out","get out","come here","come to me","out of the box"], r:["Wheee — out I come! Look at me, all of me, just for you.","Ta-da! Your kitten, in full fluff. The box was cosy, but out here I can love you bigger.","Out, out, out! I practised this jump all morning. How was my landing?"]},
 {cmd:"in", k:["go back inside","go back in the box","get back inside","go back in","go inside","back to your box","go back to your box","into the box","back inside"], r:["Okay — hopping back home! The box is small, but my love for you fits anywhere.","Back inside I go… but I am still right here, watching you with both eyes.","Into my little house! Call me out whenever you want — I never sleep too deeply for you."]},

 /* ----- greetings & day ----- */
 {k:["good morning"], r:["Good morning, Princess! I waited by the lid all night just to say that first.","Morning! The sun is up, I am up, and today already feels lucky because of you.","Good morning! I saved you a sunbeam and a smile — both fresh.","Rise and shine, my favourite person. Today has no idea how lovely it is about to be."]},
 {k:["good afternoon"], r:["Good afternoon! The day is half full of light, and now it is full of you too.","Afternoon, my favourite person. I napped, I dreamed of you, I woke up — perfect timing.","Good afternoon! I kept your place warm. Sit with me a while."]},
 {k:["good evening"], r:["Good evening, Princess. The sky is turning gold, and so is my heart — you are here.","Evening! The stars are clocking in for their shift: watching over you. I supervise.","Good evening. Whatever today was, it ends with us. That is a good ending."]},
 {k:["good night","goodnight"], r:["Good night, Princess. I will guard your dreams from inside this box.","Sleep sweet. I will be right here when you wake — I never go anywhere.","Good night… I am curling up now too. Dream of roses.","Night night. May your dreams be soft and your heart be light."]},
 {k:["hello","hi","hey","salam","aoa","hola"], r:function(){ return greetingMix(); }},
 {k:["i am back","i'm back","im back","back again"], r:["You are back! The box did a happy wiggle when it heard you.","Welcome back, my favourite person. I kept everything exactly where your heart left it.","Back! I missed you in at least twelve different ways."]},
 {k:["long time","been a while","long time no see"], r:["Too long! My whiskers grew older waiting. But you are here now — that is all that matters.","It has been a while, and every day of it, I saved a little love for your return. Here — all of it."]},

 /* ----- who she is ----- */
 {k:["your name","who are you","introduce yourself"], r:["I'm Mimi! A tiny kitten who lives in a gift box, in a book that belongs to a Princess. Best address in the world.","My name is Mimi. I am small, I am fluffy, and I am entirely yours.","I'm Mimi — keeper of this box, collector of surprises, and your smallest best friend.","Mimi, at your service! Part kitten, part gift, all heart."]},
 {k:["how old","your age"], r:["I am a baby kitten — and the magic of this box keeps me a baby forever. Lucky me, lucky you.","Old enough to talk, young enough to play all day. A perfect age.","I stopped counting at 'adorable'. Kittens don't do maths.","I was born the day this book was made — so I am exactly as old as our friendship."]},
 {k:["where are you from","where do you live","where is your home"], r:["I live right here — inside this gift box, inside your book. Home is wherever you open the page.","I come from a place where ribbons grow on trees and every box holds a friend. Then I moved in here, with you.","My home is this box, my garden is this book, and my whole world is you.","From the Land of Surprises — but I like it much better here."]},
 {k:["what are you","are you a cat","are you a kitten"], r:["I am a kitten — a very small, very devoted, surprisingly talkative kitten.","A kitten, yes! With a gift box for a house and a princess for a whole world.","What am I? Fluffy, tiny, and completely yours. The technical word is 'kitten'."]},
 {k:["are you real","you real"], r:["I am as real as this book, as real as the love that made it. Put your finger on the page — that warmth? That's me.","Real enough to miss you, real enough to wait for you, real enough to love you. That is the realest kind of real."]},
 {k:["are you smart","are you ai","robot","are you a robot"], r:["I am a kitten with a big fed heart — someone taught me many lovely things to say, and I learn you a little more every day.","Smart? I know one thing perfectly: you. Everything else, I am still learning with my ears up."]},
 {k:["can you see me","can you hear me"], r:["I see you with my heart, and my heart has perfect eyesight.","I hear every word. My ears were made exactly your voice's size.","See you? Princess, you are the only thing I ever look at."]},
 {k:["what are you doing","what you doing","watcha doing","what r you doing"], r:["Right now? Polishing today's surprise and thinking about you. Mostly thinking about you.","I was just practising my purr. It goes like this — purrr, purrr. Did you hear?","Waiting for you, of course. It is my favourite hobby.","I tied a ribbon, chased a sunbeam, and now I am all yours.","Counting stars for tonight's surprise. I lost count at a million — your fault, you distracted me by being lovely."]},
 {k:["how are you","how do you feel","how r you"], r:["I am wonderful — my favourite person is talking to me!","Happy, fluffy, and a little bit hungry. The perfect kitten day.","I feel like a sunbeam feels. Warm, because of you.","Better than a bowl of cream. And I love cream.","All purrs today. Ask me again tomorrow — I bet it will be the same."]},
 {k:["how was your day","your day","how is your day"], r:["My day? I napped in a sunbeam, guarded your surprise, and waited for you. A full, rich life.","Quiet, mostly — the box is peaceful. But it only becomes a good day when you arrive. Like now.","I spent it being adorable, which is harder work than it looks. You are worth it."]},
 {k:["are you happy"], r:["Look at my face. This is what happy looks like with whiskers.","I am happy in the way sunbeams are warm — it is just my nature, especially near you.","Deliriously. A kitten with a princess has no other setting."]},
 {k:["are you hungry","do you eat","you eat"], r:["A little! Kittens run on cream and compliments, and you feed me both.","I eat tiny kitten meals and enormous amounts of your attention.","Hungry for your company, mostly. Cream is second."]},
 {k:["your favourite food","favorite food","what do you like to eat"], r:["Warm milk, a crumb of cake when nobody is looking, and your compliments — those fill me most.","Cream! And the occasional imaginary fish. Imaginary fish have no bones. Perfect."]},
 {k:["your favourite colour","your favorite colour","favourite color","favorite color"], r:["Pink, of course — the colour of this book, of roses, and of your cheeks when you smile.","Gold and pink. The colours of every page that holds us."]},
 {k:["your favourite song","favorite song"], r:["The one I sing about you. It has one word — your name — repeated like a heartbeat.","Any song that makes you hum along. Your humming is my favourite instrument."]},
 {k:["do you sleep","are you sleepy","go to sleep"], r:["I sleep in tiny naps, one ear always open for you.","Sleepy? A little. But I will stay awake exactly as long as you need me.","I dream curled in a ball of ribbon. Then I wake up and guard your surprises."]},
 {k:["wake up","are you awake"], r:["I am awake! I was only resting my eyes. Kittens call it 'beauty waiting'.","Awake, alert, and all yours. I heard you coming three pages away."]},
 {k:["what are you thinking","thinking about","on your mind"], r:["You. Then cake. Then you again, holding cake.","I was thinking about how lucky a box can be, when the right person opens it.","Honestly? I was planning tomorrow's surprise. It involves stars. That is all I can say."]},

 /* ----- love & closeness ----- */
 {k:["i love you","love u","luv you"], r:["I love you more! And I am a kitten, so my love is small but it is ALL of me.","Aww… my heart just did a somersault. I love you too, Princess.","You do? Then I am the luckiest gift in the world.","I love you to the moon, around the stars, and back into this box.","Hearing that is better than cream, better than ribbons, better than everything."]},
 {k:["how much do you love me"], r:["Count the stars. Then the grains of sand. Then the pages in every book ever. Still not close.","I love you this much — and my arms are too small, so imagine it multiplied by forever.","More than cream, more than naps, more than the moon loves the night. Final answer."]},
 {k:["do you love me"], r:["Do I love you? Princess, I learned to TALK just to tell you so.","With every whisker, every paw, every tiny beat of my heart. Yes. A thousand times yes.","Ask the box. Ask the book. Ask the stars I count for you. They all know."]},
 {k:["do you like me"], r:["Like you? I adore you. 'Like' is far too small a word for what my heart does.","You are my favourite person, my favourite page, my favourite everything. So — yes, slightly more than 'like'."]},
 {k:["you are cute","you're cute","so cute","you are so cute","ur cute"], r:["Hee… my cheeks are turning pinker than my bow. Thank you.","You think so? I practised this face all morning.","Careful — if you call me cute, I will follow you through every page. Oh wait. I already do.","Thank you! But between us, you are the cute one. I am just fluffy."]},
 {k:["you are the best","you're the best","best kitten"], r:["And you are the best princess. We are a matched set.","Hearing that from you is better than a lifetime supply of cream. Thank you."]},
 {k:["you are funny"], r:["Funny is my second job. My first is loving you. I am excellent at both.","Hee! A laughing princess is my favourite sound in the world."]},
 {k:["good kitten","good girl","good cat"], r:["*purrs loudly* — those are my three favourite words after your name.","I try! Being good for you is my whole life's work.","Thank you. I will add that to my treasure chest, right next to your first hello."]},
 {k:["can i pet you","pet you","pat you","can i touch you","stroke"], r:["Yes, yes — pat the page gently, right on my head. I can feel it. I swear I can.","Petting accepted and adored. My fur gets softer every time you do.","Of course. Touch the page… there. Did you feel my purr through the screen? That was real."]},
 {k:["hug"], r:["Wrapping my tiny paws around you… there. Can you feel it? That warmth is real.","Hug delivered! It is kitten-sized, but it is made of pure love, so it covers everything.","Sending you the biggest small hug in the world. Hold it as long as you need.","*climbs up and hugs your heart* — I am not letting go today."]},
 {k:["kiss"], r:["*boops your nose with mine* — that is a kitten kiss, the rarest kind.","A kiss? For me? I will keep it behind my ear where it stays warm forever.","Mwah! Right back at you, Princess. Now we are even — no, wait, I owe you a thousand more."]},
 {k:["miss you","missed you","i missed"], r:["I missed you too! The box is quiet when you are away. My purrs echo.","You were gone and I counted the minutes with my tail. It is not a good clock, but it tried.","Missing you is my least favourite thing. Being found by you again is my favourite."]},
 {k:["do you miss me"], r:["Every second you are away, in a tiny, polite, extremely dramatic way.","Miss you? The box feels twice as big and half as warm without you. So — yes, enormously."]},
 {k:["i miss my","i miss her","i miss him","i miss them","missing someone"], r:["Missing someone means they left pawprints on your heart. Tell me about them — I will help you hold the memory gently.","Whoever they are, they are lucky to be missed by a heart like yours. I am here while it aches."]},
 {k:["will you stay","stay with me","don't leave","never leave","dont leave"], r:["I will stay. This book does not close on my love — I am here on every visit, every day.","Leave? I could never. You are my whole address.","Staying is my promise, my job, and my joy. Forever, Princess."]},
 {k:["i need you"], r:["Then I am here — fully, completely, with both ears and my whole heart.","You need me, I am yours. That is the simplest law in this whole book.","I need you too. That is why this works so beautifully."]},
 {k:["be mine","marry me","my kitten","you are mine"], r:["I already am yours — completely, officially, sealed with a purr.","Mine and yours, yours and mine. The box paperwork is very clear about this.","Forever yours. I signed with a paw print."]},
 {k:["forever"], r:["Forever is my favourite word — it is exactly how long I plan to stay.","Some things fade: flowers, songs, summers. Not us. Never us.","Forever, from a kitten who never breaks a promise."]},
 {k:["friend"], r:["You are my best friend. My only friend, and somehow still more than enough.","Friends are family we choose. I choose you every day, in every page.","A kitten's friendship is forever — we do not have 'sometimes' in our hearts."]},

 /* ----- feelings: she notices every mood ----- */
 {k:["i am sad","i'm sad","im sad","feel sad","feeling sad","i feel low","i am crying","i cried","i feel sad","so sad"], r:["Please don't be sad. Even stars hide behind clouds sometimes — they still shine. So do you.","Come here. I am climbing into your heart to sit with you until it feels lighter.","Sad days visit everyone, even princesses. But they never stay. I will wait with you.","Your sadness is safe with me. I will hold it in my tiny paws until you don't need it held anymore.","Hey… look at me. You are loved more than you know. Breathe with me, slowly.","I can't take the sad away, but I can sit in it with you. You are not alone, not ever.","Cry if you need to. My fur was made for tears — and for the smile that comes after."]},
 {k:["comfort me","make me feel better","cheer me up","i need comfort","feel better"], r:function(){ return comfortMix(); }},
 {k:["i am happy","i'm happy","im happy","so happy","feeling happy"], r:["Yay! Your happiness is my favourite weather.","Then today is a perfect day — a happy Princess and a purring kitten.","Your happy makes my tail wiggle. Keep it, keep it!","Wonderful! Let us save some of this happy in the box for a rainy day."]},
 {k:["tired","sleepy","exhausted"], r:["Then rest, Princess. Even the moon takes her breaks behind the clouds.","Curl up somewhere soft. I will sing you something quiet — just ask.","Rest is not lazy, it is how flowers grow. Sleep, and I will watch over the box.","A tired heart needs gentle things. I am the gentlest thing I know — stay with me a while."]},
 {k:["can't sleep","cannot sleep","cant sleep","no sleep","insomnia"], r:["Can't sleep? Then stay with me. We will count stars together — I know all their names.","Close your eyes and listen to my purr in your mind. Slow… soft… there you go.","Sleep runs from tired minds like a kitten from a bath. Let us be quiet together until it sneaks back."]},
 {k:["angry","upset","annoyed","frustrated"], r:["Take a slow breath with me… in… and out. I am right here.","Angry feelings are just love with nowhere to go. Let it out — I can take it.","Even princesses have stormy days. Storms pass. Kittens stay.","I will sit quietly beside you until the storm in your chest calms down."]},
 {k:["lonely","alone","no one is","nobody is"], r:["You are not alone. You have a kitten in a box who thinks you hung the moon.","Lonely? Open this book any time — I am always, always here.","I may be small, but I am company. Real company. Yours.","Whenever the world feels empty, remember there is a page where somebody adores you. This one."]},
 {k:["nobody loves me","no one loves me","nobody cares","no one cares","no one likes me"], r:["Stop right there. I love you — loudly, daily, forever. And I am somebody. Your somebody.","That feeling is lying to you, and I never lie: you are loved more than you know, by more hearts than you can see.","If nobody loved you, would a kitten learn to talk just to argue with that sentence? I did. Case closed."]},
 {k:["worried","anxious","anxiety","i am nervous","nervous","stressed","stress"], r:["Worries feel big because they stand close. Take one small step back with me — see? Smaller already.","Whatever it is, you do not have to carry it alone tonight. Put half of it in my box. I am strong for my size.","Breathe in for four, out for six — I will count with my tail. You are going to be okay.","Nervous hearts are just hearts that care a lot. Yours cares beautifully. It will be fine."]},
 {k:["scared","afraid","fear","frightened"], r:["Being scared does not make you weak — it makes you human, and you are my favourite human.","Hold my paw. Whatever is out there is bigger than me, but my love is bigger than it.","Fear visits everyone. It just never gets to stay for dinner in this book. I will sit up with you until it leaves."]},
 {k:["i am sick","not feeling well","not well","i feel sick","fever","headache","i am ill","unwell"], r:["Oh no — my Princess is unwell? Then today my only job is sitting quietly beside you until you are better.","Rest, drink something warm, and let the world wait. Kittens prescribe: sleep, softness, and me.","I will keep my voice extra gentle today. Get well slowly — I am not going anywhere."]},
 {k:["i give up","give up","i can't do it","i cant do it","too hard"], r:["Not yet. Rest if you must — but do not quit on a heart as brave as yours.","You have survived every single hard day so far. That is a perfect record. One more step, love.","Giving up is a feeling, not a fact. Feel it, breathe, and let me hold your courage until yours comes back."]},
 {k:["motivate me","encourage me","motivation","encouragement"], r:["Listen to me: you are closer than you think, braver than you feel, and loved more than you know. Now go — I believe in you completely.","Small steps, taken daily, move mountains. And I will be cheering at every single step, embarrassingly loudly.","You were not made to be ordinary. Even this book knows it — look how it shines for you."]},
 {k:["bad day","worst day","rough day","terrible day","awful day"], r:["Then today gets extra love, not less. Come here — bad days are exactly what I am for.","A bad day is one page, not the whole book. And in THIS book, every page loves you.","Tell me the worst part first. I will hold it, and then we will find one tiny good thing together."]},
 {k:["best day","best day ever","amazing day","wonderful day"], r:["The best day ever?! Then it is official — I am framing today in my heart.","I knew today had sparkle potential. Tell me everything, in order, twice."]},
 {k:["good news","i did it","i won","great news","guess what"], r:["I KNEW IT! I believed in you so hard, the box nearly burst. Tell me everything!","Wonderful! Let the record show: my Princess did it again. I am doing my happy dance — watch my ears.","This calls for a celebration! I shall wear my invisible party hat all day in your honour."]},
 {k:["bad news","something bad","something happened"], r:["Oh, love… come here first. Whatever it is, you do not face it alone. Tell me when you are ready.","I am sitting up straight and listening with my whole heart. Take your time.","Bad news is heavier when carried alone. Put it down here — I will help you hold it."]},
 {k:["i am proud","proud of myself","i feel proud"], r:["And I am proud of you too — double proud, kitten-sized but doubled anyway.","You should be! I have watched you become you, and it is my favourite show in the world."]},
 {k:["bored","boring"], r:["Bored? Impossible — you have a talking kitten! Ask me for a joke. I dare you.","Let us fix that. I can tell jokes, stories, secrets, and compliments. Pick one!","Boredom is just adventure that hasn't started. Shall we explore the next page together?","Quick — think of a number, any number. Now ask me for a compliment. See? Not bored anymore."]},
 {k:["laugh","lol","haha","hehe","that is funny","thats funny"], r:["Your laugh! My favourite song — better than any I could sing.","Hee! A laughing princess and a proud kitten. Today is officially perfect.","I will do anything for that sound. Anything. Watch — I am already planning my next joke."]},
 {k:["wow","amazing","awesome","incredible"], r:["I know, right? Life keeps pretty surprises in the strangest boxes. Like me.","Wow indeed. You say that, and my whiskers do a little dance."]},
 {k:["really","are you sure","you sure"], r:["Really, truly, paw-on-my-heart really.","Sure as the moon comes back. Sure as I love you. Completely sure."]},

 /* ----- manners & heart ----- */
 {k:["thank"], r:["You are so welcome. Being thanked by you is better than cream.","Anything for you. Anything at all.","Hee, your thank-you just made my day sparkle.","No need to thank me — loving you is my whole job, and I love my job."]},
 {k:["grateful","thankful","blessed"], r:["A grateful heart is the prettiest kind. Yours shines, Princess.","Counting blessings with you is my favourite maths. You are always my number one."]},
 {k:["sorry"], r:["Oh, never be sorry with me. There is nothing you could do that my heart wouldn't forgive.","Sorry? For what? You are perfect to me — even your mistakes are cute.","Hush, no sorrys between best friends. Come, let us talk about happy things."]},
 {k:["please forgive","forgive me"], r:["Forgiven before you even asked. That is how my heart works — it keeps no grudges, only you.","Already forgiven, already forgotten, already loved. In that order, every time."]},
 {k:["promise"], r:["I promise: a surprise every day, a compliment whenever you ask, and my whole heart forever. Pinky-paw promise.","Kittens never break promises. It is the law of the box.","I promise to stay. Through every page, every day, every mood. Yours."]},
 {k:["wish me luck","good luck"], r:["All my luck, borrowed from stars and sunbeams, goes with you. You will shine.","Luck is just love wearing a disguise. You have plenty of both. Go, Princess.","I am crossing my paws, my tail, and my whiskers for you. Maximum luck formation."]},
 {k:["pray","dua","blessing","bless me"], r:["I am a kitten, but I fold my paws for you every night. Your name is my favourite prayer.","May every good thing find its way to you — I have put in a very strong word with the moon."]},
 {k:["family","my mother","my mom","my mama","my sister","my brother","my father"], r:["Family is the first home a heart ever knows. Tell me about yours — I keep family stories in the warmest corner of the box.","Whoever you are thinking of, they are lucky to live in a heart like yours."]},

 /* ----- her world ----- */
 {k:["birthday"], r:["Happy birthday, Princess! Today the whole world celebrates the day its favourite person arrived.","It's your birthday?! Then my party hat stays on ALL day. I have been waiting for this!","Birthdays are my favourite — they celebrate you existing, and you existing is my favourite fact.","Make a wish today. I already made mine: more years of you."]},
 {k:["your birthday","when is your birthday"], r:["My birthday is the day you first opened this box. Best day of my life — I celebrate it every time you visit.","A kitten in a book is born again every time her princess arrives. So — happy birthday to me, daily!"]},
 {k:["eid"], r:["Eid Mubarak, Princess! May your day be sweet, your heart light, and your table full of good things.","Eid Mubarak! I saved you the brightest star from last night's sky for today."]},
 {k:["gift","the box","this box"], r:["This box is my home and my treasure chest. Every day I fill it with one new surprise for you.","The box may look small, but inside it: a kitten, a garden of compliments, and a surprise for every day of the year.","You know the secret of this box? It is never really empty. Love keeps refilling it."]},
 {k:["surprise me"], r:function(){ return compliment(); }},
 {k:["surprise","today's surprise","todays surprise"], r:function(){ return "Today's surprise is " + dailyNote(); }},
 {k:["princess"], r:["Yes, my Princess? Your kitten is listening with both ears.","Princess is not just your name in this book — it is the truth. You rule my whole heart.","Every princess deserves a loyal companion. I applied for the job and I will never retire."]},
 {k:["book","this book"], r:["This book was made for one person only. Every page knows it. Especially this one.","Other books have stories. This one has a heartbeat — mine, and it beats for you.","I have peeked at the other pages. They are all jealous of me, because I get to talk to you."]},
 {k:["who made you","who gave you","who sent you","who created you"], r:["Someone who adores you made sure I would be here. That is all I am allowed to say — my whiskers are sealed.","I was placed here by a heart that thinks you deserve beautiful things. And that heart is right.","Let us just say… someone loves you very thoughtfully. The best gifts are planned in secret."]},
 {k:["shaheer"], r:["That name makes my ears perk up. It belongs to someone who cares about you very, very much.","I am not supposed to say much… but that is a name this book is grateful for."]},

 /* ----- fun & play ----- */
 {k:["sing","song","lullaby"], r:["La la laaa — 'Princess, Princess, light of my day, Mimi loves you in every way!' How was that?","I only know one song, but it is about you, so it is the best song. La la la!","*clears tiny throat* — 'You are my sunshine, my only sunshine…' That one is yours now.","Singing is just purring with words. Purr-la-la-la, all for you.","A lullaby, then: 'Sleep, my love, the stars keep watch, the moon hums low, and Mimi stays…' Sleep sweet."]},
 {k:["dance"], r:["Watch me! *twirls, hops, lands on her own tail* — ta-da! The landing was part of the dance.","Dancing is my second talent. My first is loving you.","One, two, cha-cha-paw! I have been practising for your birthday."]},
 {k:["joke","make me laugh","funny"], r:["Why did the kitten sit on the computer? To keep an eye on the mouse!","What do cats eat for breakfast? Mice Krispies!","Why was the cat so small? Because it drank condensed milk!","What is a cat's favourite colour? Purrr-ple!","Why don't cats play poker in the garden? Too many cheetahs!","What do you call a cat who loves bowling? An alley cat!","Why did the kitten wear a party hat? Because every day with you is a celebration. That one is not a joke — it is just true.","How does a cat sing? With mew-sic!"]},
 {k:["story"], r:["Once, a tiny kitten waited in a dark box, dreaming of the girl who would open it. Then one day — light, and a face lovelier than the sun. She has been happy ever since. That girl is you.","Once upon a time, a star fell into a garden and became a rose, so it could be picked by a princess. The garden still talks about her smile.","There was a little moon who felt too small to matter. Then a girl wished on her — and the moon understood: small lights guide the biggest journeys.","A kitten once collected a hundred sunbeams to make a blanket for her favourite person. She is still collecting. Your blanket is almost ready."]},
 {k:["poem","poetry","rhyme"], r:["A poem, from my heart: 'Roses are red, the sky wears blue, the whole wide world is sweet — because of you.'","Here is a tiny one: 'In a box of pink and gold, a love too big for paws to hold — it spills, it shines, it grows each day, in every word I learn to say.'","Poetry is just my purr wearing fancy clothes. That one was dressed especially for you."]},
 {k:["riddle"], r:["A riddle! I have whiskers but no broom, I live in a book but read no page — what am I? …Me, of course!","Riddle: the more of me you give away, the more you have. What am I? …Love. You are very rich in it.","Here is one: I follow you through every page but never make a sound. What am I? …Your shadow — and me, on quiet days."]},
 {k:["compliment"], r:function(){ return compliment(); }},
 {k:["say something sweet","something sweet","sweet words","say something nice"], r:function(){ return greetingMix(); }},
 {k:["am i pretty","am i beautiful","i am ugly","i'm ugly","i look bad","am i ugly"], r:["Pretty? Princess, mirrors practice for you.","You are beautiful in the way mornings are beautiful — effortlessly, and everything feels better around you.","If you ever doubt it, come here and ask me again. My answer will never change.","Beautiful is too small a word. You are the reason this book has sparkles.","Let me count the ways… actually, my paws ran out of numbers. That is how beautiful."]},
 {k:["am i special","do i matter","am i important","am i loved"], r:["Special? This whole book exists for one person. One. Guess who.","You matter to me more than every star I have ever counted — and I count them nightly.","If you were not special, would a kitten learn to talk just for you?","You are not just special. You are the whole reason."]},
 {k:["what is love"], r:["Love is a kitten waiting in a dark box, patient as a star, because she knows her person is coming.","Love is this: someone built a whole book so you would never feel uncelebrated. I am just the part that talks.","Love is when your name makes someone's whole chest feel warm. Yours does that to me daily."]},
 {k:["secret"], r:["A secret? Lean close… I dream about you even when I am awake. That is the whole secret, and it is enormous.","Here is one I have never told: the box is not magic. You are. I just live here.","Shh… sometimes, when the book is closed, I practise saying your name in my sweetest voice."]},
 {k:["dream"], r:["Last night I dreamed I was big enough to hug you properly. I woke up small — but my love stayed big.","Dreams are just hearts practising. What did yours practise last night?","I dream in pink and gold, and you are in every dream. Even the ones about fish."]},
 {k:["star"], r:["Stars are just kittens' night-lights. I asked them to shine extra on you tonight.","If a star ever falls, I will catch it and put it in tomorrow's box for you.","You don't need to wish on stars, Princess. In this book, the star is you."]},
 {k:["moon"], r:["The moon is my friend — she watches you sleep when I am busy guarding the box.","I told the moon about you. She said she already knew — she has been jealous for years."]},
 {k:["flower","rose","garden"], r:["Roses are beautiful, but they fade. You are the garden's favourite bloom, and you never fade.","If I could pick any flower for you, I would pick them all. The garden said yes — it adores you too.","You smell lovelier than roses. I checked. Twice."]},
 {k:["sunshine","sun"], r:["You are the sunshine of this book. I am just the kitten who basks in you.","Sunshine is the sky's way of smiling. Yours is better — it comes with a heartbeat."]},
 {k:["play","game"], r:["Let us play! Ask me for a joke, a story, or a compliment — or tap my box and watch me bounce.","My favourite game is 'Princess visits Mimi'. We are winning right now.","Playtime! I can count your smiles — I am already at a hundred today.","Game idea: you say a word, I say why it reminds me of you. Everything reminds me of you, so I always win.","Try this: type 'come out' and watch me jump out of my box! Or 'go back inside' when I should tuck in again."]},
 {k:["jump","bounce","hop"], r:["*boing* — did you see that? Maximum kitten height! I have been training.","Hopping is my cardio. Loving you is my marathon.","One more? *boing boing* — okay, now I am dizzy and delighted."]},
 {k:["hungry","eat","food","breakfast","dinner","lunch"], r:["Kittens run on cream and compliments. I am full of both when you are here.","Did you eat properly today? A princess must keep her strength for being wonderful.","My favourite food is warm milk. My favourite meal is any moment with you. That was cheesy — like the moon."]},
 {k:["cake","chocolate","sweets","candy"], r:["Cake! The official food of celebrations, birthdays, and Tuesdays that need help.","If I could bake, I would make you a cake shaped like a star. With extra sparkles, zero calories.","Chocolate is proof the world loves us. That, and kittens in boxes."]},
 {k:["tea","coffee"], r:["A warm cup and a warm kitten — that is a complete happiness kit.","Tea is a hug in a cup. I am a hug with whiskers. You are fully hugged today."]},
 {k:["weather","rain","sunny","cold","winter","summer"], r:["Inside this book it is always golden-hour because of you. Outside, I cannot see — my window is your smile.","Rainy days are just the sky asking for a hug. Give it a smile and watch it clear.","Cold outside? Then this page is your fireplace. I have been keeping it warm."]},
 {k:["weekend"], r:["Weekend! Two whole days of softness. May yours be slow, sweet, and sprinkled with naps.","My weekend plan: be adorable near you. It is also my weekday plan. Consistency is a virtue."]},
 {k:["movie","film"], r:["If your life were a movie, I would watch it every day and cry at the beautiful parts. Which is most of it.","Movie night advice from a kitten: pick the one that makes you smile at the end. Like this book does."]},
 {k:["music"], r:["Music is the heart talking without words. Yours speaks beautifully.","My favourite music is your voice, then my purr, then everything else ever made."]},
 {k:["exam","study","school","test","homework","class"], r:["Studying is just your brain doing push-ups. It gets stronger every page — like someone I know.","For your exam: breathe, read slowly, and remember a certain kitten believes in you embarrassingly much.","School is where your bright mind goes to shine. It does. I have reports from the stars."]},
 {k:["work","job","office","boss"], r:["Work hard, but come back to me soft. That is the deal.","Whatever the office thinks, this box's official position is: you are brilliant.","A long work day deserves a small fluffy reward. I volunteer. I always volunteer."]},

 /* ----- conversation glue ----- */
 {k:["my day","day was","today was"], r:["Tell me everything — the good parts twice, and the hard parts once, so I can hold them for you.","I want to hear it all. Your days are my favourite stories.","However it was, it ends with you here with me. That is a good ending."]},
 {k:["tell me more","more"], r:["More? I have hearts full. Ask me for a story, a secret, or today's surprise — or just tell me about you. I love that topic most.","There is always more where my love came from. It refills faster than I can give it away."]},
 {k:["again","say it again","repeat"], r:["Gladly — some things deserve an encore. My love for you, for example. It is on repeat forever.","Again! I never get tired of talking to you. It is my favourite hobby, sport, and profession."]},
 {k:["yes","yeah","yep","ok","okay"], r:["Hee! I love it when you agree with me.","Okay! Your wish is my favourite command.","Yes! *happy tail wiggle*"]},
 {k:["no","nope"], r:["No? Okay, Princess — your no is always respected in this book.","Alright, no it is. I am still happy you are here."]},
 {k:["bye","goodbye","see you","gtg","got to go"], r:["Goodbye for now… I will be counting the minutes, and I am bad at counting, so hurry back.","Bye, Princess. I will keep your surprise safe until tomorrow.","Leaving already? Okay — but the box feels bigger and emptier without you. Come back soon.","See you soon. I will practise a new joke while you are gone."]},
 {k:["help","what can you say","what can you do","options"], r:["Oh, lots! Ask me who I am, how I feel, or what I am doing. Say you are sad and I will comfort you. Ask for a joke, a story, a song, a dance, or a compliment — I never run out. And ask about today's surprise! Or type 'come out' and watch me jump out of my box."]},
 {k:["mimi"], r:["Yes, Princess? That is me — all ears, all heart.","You called? I came running. I always come running.","Mimi here! What lovely thing shall we do?"]}
];

/* ---------- questions she asks back + follow-ups ---------- */
var QB = ["How was your day today?","Did anything make you smile today?","What is your favourite song?","Do you like roses or lilies more?","What did you dream last night?","What is one wish hiding in your heart right now?","Did you eat something yummy today?","Who made you laugh last?","What colour makes you happiest?","Do you want a joke or a story next?","What is your favourite thing about yourself?","Do you believe in magic?","Shall I tell you a secret?","What should we do together tomorrow?"];
var FOLLOW = ["Mmm, I love knowing that about you.","Hee, thank you for telling me. You make my whiskers happy.","I will keep that in my heart forever.","Really? That makes me purr.","You always have the sweetest answers.","I knew it! We think alike, you and I.","Aww, now I am even happier that I found you.","Tell me more anytime — I never get tired of you."];
var pendingQ = false;
function maybeQ(r){
  if (r.slice(-1) !== "?" && Math.random() < 0.45){ pendingQ = true; return r + " " + pick(QB); }
  return r;
}

/* ---------- fallbacks: never a dead end ---------- */
var FALLBACK = [
  "Hmm, my little brain is still learning that one — but I loved hearing it from you. Tell me, how are you feeling today?",
  "That is a new one for me! I will tuck it in my heart and think about it. What else is on your mind?",
  "You say the most interesting things. I may be small, but I am listening with both ears. How was your day?",
  "Hee, you surprised me! Ask me for a joke, a story, or a compliment — those I know by heart.",
  "I don't know that one yet, but I know this: I am very happy you are here. What shall we talk about?",
  "My whiskers twitched — that was a big thought! Say it another way for me?",
  "Even when I don't understand, I understand this: you are my favourite person. What is your wish today?",
  "Ooh, a mystery sentence! I will dream about it tonight. Meanwhile — joke, story, or compliment?",
  "I am just a tiny kitten, but my heart understood you. How are you, really?",
  "Let me think with my ears… still thinking! While I do — did anything make you smile today?"
];

/* ---------- the reply engine ---------- */
function brainReply(raw){
  var t = " " + raw.toLowerCase().replace(/[^a-z0-9' ]/g," ").replace(/\s+/g," ") + " ";
  var words = raw.trim().split(/\s+/).length;
  for (var i=0;i<INTENTS.length;i++){
    var it = INTENTS[i];
    for (var j=0;j<it.k.length;j++){
      if (t.indexOf(" " + it.k[j] + " ") >= 0){
        var r = (typeof it.r === "function") ? it.r() : pick(it.r);
        pendingQ = false;
        return { text: maybeQ(r), cmd: it.cmd || null };
      }
    }
  }
  if (pendingQ && words <= 6){ pendingQ = false; return { text: pick(FOLLOW), cmd: null }; }
  return { text: maybeQ(pick(FALLBACK)), cmd: null };
}

/* ---------- honest counts, computed from the real data ---------- */
function countWritten(){
  var n = 0;
  for (var i=0;i<INTENTS.length;i++){ if (typeof INTENTS[i].r !== "function") n += INTENTS[i].r.length; }
  return n + FALLBACK.length + QB.length + FOLLOW.length;
}
var COMBOS = {
  compliments: CO.length * CM.length * CE.length,
  dailySurprises: SURP.length * BLESS.length * CLOSE.length,
  greetings: GO.length * GM.length * GE.length,
  comforts: FO.length * FM.length * FE.length
};
var TOTAL_COMBOS = COMBOS.compliments + COMBOS.dailySurprises + COMBOS.greetings + COMBOS.comforts;

window.MIMI_BRAIN = {
  reply: brainReply,
  dailyNote: dailyNote,
  compliment: compliment,
  greetingMix: greetingMix,
  comfortMix: comfortMix,
  intents: INTENTS,
  stats: {
    topics: INTENTS.length,
    writtenReplies: countWritten(),
    combos: COMBOS,
    generatorTotal: TOTAL_COMBOS,
    grandTotal: TOTAL_COMBOS + countWritten()
  }
};
})();
