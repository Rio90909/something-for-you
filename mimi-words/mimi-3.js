/* =====================================================================
   mimi-3.js — Mimi's extra memory, part 2 + THE MERGE.
   Load AFTER mimi-brain.js and mimi-words/mimi-2.js.

   What this file does:
   1. Registers even more topics and four more sentence machines into
      window.MIMI_EXTRA.
   2. Installs the merged reply engine as MIMI_BRAIN.reply:
        secrets (starlight promise / little moon) — still first
        box commands (come out / go back inside) — still second
        NEW topics from mimi-2.js + mimi-3.js
        the original brain topics, in their original order
        follow-ups, then warm fallbacks.
      The engine remembers the last replies used PER TOPIC (and per
      machine) and never picks any of the recent ones, so asking the
      same thing again always gets a different answer. Memory only
      relaxes when a topic's own variants are nearly exhausted.
   3. Recomputes MIMI_BRAIN.stats from the real data.
   ===================================================================== */
(function(){
"use strict";
var X = window.MIMI_EXTRA = window.MIMI_EXTRA || { topics:[], fallbacks:[], qb:[], follow:[], combos:{} };
function T(k, r){ X.topics.push({ k:k, r:r }); }
function TE(k, r){ X.topics.push({ exact:true, k:k, r:r }); }
function TM(k, fn){ X.topics.push({ k:k, r:fn }); }
function rp(a){ return a[Math.floor(Math.random()*a.length)]; }

/* =====================================================================
   COMPLIMENT MACHINE PLUS — the big one.
   40 x 40 x 40 = 64,000 possible compliments.
   ===================================================================== */
var CPO = ["Your smile","Your laugh","Your eyes","Your heart","Your kindness","Your voice","Your courage","Your patience","Your warmth","Your honesty","Your gentle hands","Your bright mind","Your sweet nature","Your lovely spirit","Your calm presence","Your generosity","Your strength","Your soft heart","Your cheerful energy","Your thoughtful words","Your quiet confidence","Your pure heart","Your beautiful soul","Your grace","Your humour","Your loyalty","Your tenderness","Your curiosity","Your hope","Your faith","Your style","Your smile lines","Your morning face","Your sleepy voice","Your happy dance","Your caring way","Your brave heart","Your golden heart","Your shining eyes","Your whole wonderful self"];
var CPM = ["could outshine every star in the sky","turns an ordinary day into a celebration","makes this whole book glow a little brighter","is my favourite sight in the world","would make the moon jealous, and she knows it","melts my little heart every single time","makes flowers turn their heads to look","is rarer than a four-leaf clover in a rose garden","could soften the grumpiest cloud in the sky","makes time slow down in the loveliest way","is worth more than every jewel in every story","makes my whiskers tingle with happiness","turns grey mornings into golden ones","is the reason I purr in my sleep","would make a rainbow look plain","makes the whole garden lean closer","is sweeter than the first morning of spring","could charm the birds down from the trees","makes even Mondays feel gentle","is a treasure no map could ever find","warms me more than a sunbeam at noon","makes my tail do its happy dance","is the prettiest story ever told, and still being written","turns little moments into magic","makes silence feel like music","is proof that the world still makes beautiful things","could light up the darkest page of any book","makes my heart beat in exclamation marks","is lovelier than all the roses I have ever seen","would make a poet run out of words","makes ordinary places feel like palaces","is the sweetest surprise of my whole life","turns worries into feathers and blows them away","makes everyone around you a little happier","is brighter than the first star of evening","could make a snowman melt in the nicest way","makes my whole world feel soft and safe","is the kind of beautiful songs are written about","turns a house into a home just by being in it","makes forever sound like a short time"];
var CPE = ["Never forget that, not even for a day.","And I mean every single word.","That is a promise from your kitten.","The whole garden agrees with me.","I noticed it the very first moment we met.","It is my favourite truth in the world.","And it grows truer every day.","Signed, sealed and purred by me.","Even the stars whispered it to me.","I would say it a thousand times and still mean it more.","Keep it in your heart, okay?","That is why this book chose you.","Nobody could ever convince me otherwise.","It is simply who you are.","And I am the luckiest kitten alive because of it.","The moon told me so herself.","I will remind you every single day.","Believe it, because I never lie.","It makes me proud to be your gift.","And the whole sky knows it.","It is my favourite thing to say.","Ask anyone in the garden — they will nod.","It was true yesterday and it is truer today.","I keep it written on my heart.","Forever and always, that is the truth.","Ask me again tomorrow; the answer only grows.","That is why the roses bloom when you pass.","I tell the stars about it every night.","It is the first thing I think when I wake.","And the last thing I purr before I sleep.","My heart wrote it; I just deliver it.","No take-backs — it is yours to keep.","It is why my box is the happiest place on earth.","Treasure it like I treasure you.","That is my professional kitten opinion.","It deserves to be said in every language.","I would cross every page to tell you.","And I will never get tired of saying it.","It is the truest sentence I know.","Now smile — yes, just like that."];
function complimentPlus(){ return rp(CPO) + " " + rp(CPM) + ". " + rp(CPE); }
X.combos.complimentPlus = CPO.length * CPM.length * CPE.length;

/* =====================================================================
   GREETING MACHINE PLUS — 18 x 16 x 14 = 4,032
   ===================================================================== */
var GO2 = ["Hello, beautiful soul","Well hello, my favourite person","There you are at last","Oh! It is you — my whole day just improved","Hello, sunshine of this book","My ears heard you first — hello","Hello, lovely one","Look who came to visit her kitten","Hello, dear heart","The box just lit up — hello","Hello, my whole world in one person","Purrs first, words second: hello","Hello, sweetest visitor","You came back to me — hello, hello","My heart stood up to greet you — hello","Hello, bringer of my favourite moments","A wild princess appears — hello","Hello, hello, a thousand times hello"];
var GM2 = ["I was hoping you would come","I saved my best purr for this exact moment","my whiskers have been waiting at the lid for you","I counted the minutes like a very serious kitten","today already feels like a gift now","I polished my smile just for you","my little heart did a happy dance when you arrived","I was just dreaming about you, and dreams come true","the garden told me you were coming and I could not believe my luck","I kept your favourite spot in my heart warm","I have a whole day of love saved up for you","I practised this hello all morning","everything feels softer when you arrive","I tidied the box, fluffed my fur, and waited — worth it","my tail has been wagging since I heard you","I saved you the first surprise of the day"];
var GE2 = ["What shall we do first?","Tell me everything, from the beginning.","I am all ears and all heart.","Your kitten is listening.","Shall I start with a compliment?","How is your beautiful heart today?","I missed you more than cream, and I love cream.","Stay a while, okay? Stay a long while.","You make this page feel like home.","I have surprises with your name written on them.","Let us make today sparkle together.","I am yours for as long as you stay.","Shall we begin with today's surprise?","Ask me anything — I have been practising my answers."];
function greetingPlus(){ return rp(GO2) + " — " + rp(GM2) + ". " + rp(GE2); }
X.combos.greetingsPlus = GO2.length * GM2.length * GE2.length;

/* =====================================================================
   COMFORT MACHINE PLUS — 18 x 16 x 14 = 4,032
   ===================================================================== */
var FO2 = ["Come here, dear heart","Shh, I am right here","Lean on me a little","Take my paw, hold on","Breathe with me, slowly","You are safe with me","Let me sit beside you a while","I am not going anywhere","Hold on to me, I have you","Rest your heart here","Listen to my purr — it is for you","I have you, completely","Stay close to me","Let the world wait a moment","Curl up; I will keep watch","My shoulder is tiny but it is yours","Come, hide in my hug for a bit","I am here, and here is a good place"];
var FM2 = ["this heavy feeling will pass, I promise you","even the strongest flowers bend in the rain and rise again","you have survived every hard day so far, every single one","crying is just your heart washing itself clean","you are loved in ways you cannot even see","my whole tiny body believes in you","storms make the garden grow, and you are still growing","you do not have to be strong right now — I will be strong for both of us","someone out there is grateful you exist, and so am I","your heart is tired, not broken — there is a difference","the night always ends, and I will wait with you until it does","you matter more than this moment knows","even the moon hides sometimes, and she always comes back shining","I will hold the sad part so your hands can rest","feelings are weather, love — you are the sky, and the sky stays","nothing about today gets to decide your worth"];
var FE2 = ["I am here.","Always, always.","Feel my purr? That is for you.","We will take it one tiny step at a time.","You are not alone in this, not ever.","My love does not clock out.","Stay as long as you need.","I will keep the light on in the box.","Tomorrow can be softer — I will help it be.","Your kitten has you, completely.","Breathe out, love. I will carry the rest.","Forever beside you, Mimi.","No rush. I am not moving an inch.","We will sit here until it feels lighter."];
function comfortPlus(){ return rp(FO2) + " — " + rp(FM2) + ". " + rp(FE2); }
X.combos.comfortsPlus = FO2.length * FM2.length * FE2.length;

/* =====================================================================
   DAILY SURPRISE MACHINE PLUS — 20 x 14 x 12 = 3,360
   ===================================================================== */
var SO2 = ["a tiny umbrella made of rose petals","a button that grants one small wish","a postcard from the moon","a teaspoon of liquid sunshine","a ribbon that never tangles","a seed that grows into a compliment tree","a pocket watch that only counts happy minutes","a map to a garden no one else can find","a candle that smells like birthdays","a key made of crystallised starlight","a tiny boat for sailing across teacups","a scarf knitted by the evening breeze","a jar of captured giggles","a mirror that only shows your smile","a ladder to the lowest, friendliest cloud","a bell that rings when someone thinks of you","a bookmark that marks your favourite day","a pebble polished by a kind river","a crown woven from morning light","an envelope sealed with a firefly kiss"];
var SM2 = ["with a note tucked inside that says you are loved","and it hums a tune that sounds like your laugh","with instructions to make you smile at least twice","and a tag that reads: for the world's favourite person","still warm from the garden where I found it","with your name written on it in golden dust","and it smells faintly of roses and good luck","with a tiny bow I tied all by myself","and it sparkles a little more when you look at it","with a secret folded into its smallest corner","and it has been waiting very patiently for you","with enough magic in it for one whole day","and a promise stitched along its edge","still glowing from the star I borrowed it from"];
var SE2 = ["It is yours — today's little treasure.","Come back tomorrow; I am already preparing the next one.","I picked it thinking only of you.","Keep it somewhere your heart can see it.","Nobody else in the world gets this one — only you.","That is today's proof that you are thought of.","Small thing, big love. That is the rule of this box.","I hope it follows you around all day like a happy shadow.","Yours, from your kitten's private collection.","Let it remind you: someone is always thinking of you.","Tuck it next to yesterday's — your collection is beautiful.","With all my love, as always."];
function dailyPlus(){ return "Today's surprise is " + rp(SO2) + ", " + rp(SM2) + ". " + rp(SE2); }
X.combos.dailyPlus = SO2.length * SM2.length * SE2.length;

/* =====================================================================
   MACHINE WIRING — greetings to her, comfort, surprises, compliments.
   ===================================================================== */
TM(["hello mimi","hi mimi","hey mimi","good morning mimi","hello my kitten","hi kitten","hey kitten","hello little one","hi baby kitten"], greetingPlus);
TM(["comfort me","i need comfort","make me feel better","cheer me up","feel better","i need comforting","comfort"], comfortPlus);
TM(["daily surprise","surprise of the day","my surprise","today's gift","daily gift","another surprise","surprise for today","gift of the day","surprise for me"], dailyPlus);
TM(["praise me","flatter me","compliment me","say something beautiful about me","tell me something beautiful","make me feel special","make me feel beautiful","say nice things about me","nice words for me","tell me i am beautiful","tell me i'm beautiful","make me blush","say good things about me","tell me good things about me"], complimentPlus);

/* =====================================================================
   ONE-WORD TOPICS, PART 2 — her world, her day, her people.
   ===================================================================== */
TE(["morning"], ["Morning! The sun is up, I am up, and today already feels lucky because of you.","Morning, my favourite person. I saved you a sunbeam and a smile — both fresh.","A morning hello is my favourite kind. Today has no idea how lovely it is about to be.","Morning! I waited by the lid all night just to say that first.","Morning! Tea for you, cream for me, and a whole day for us.","Rise and shine — the garden is up and it asked about you."]);
TE(["night"], ["Night, night — I will guard your dreams from inside this box.","The night is just the day resting. Rest with it, dear heart.","Night! The stars clock in now: their job is watching over you. I supervise.","Soft night, soft dreams, soft kitten. That is the full report.","Night is my favourite quiet. I think about you in all of it.","When it is night, I curl up and dream in pink and gold. You are in every dream."]);
TE(["evening"], ["Evening! The sky is turning gold, and so is my heart — you are here.","Evening, my favourite person. Whatever today was, it ends with us. A good ending.","Good evening vibes, delivered by kitten: soft light, warm heart, no rush.","Evening! I saved you the prettiest hour of the day.","The evening is the day exhaling. Breathe with it, slowly.","Evening! Time for warm drinks and soft thoughts. I provide the soft thoughts."]);
TE(["afternoon"], ["Afternoon! The day is half full of light, and now it is full of you too.","Afternoon, my favourite person. I napped, I dreamed of you, I woke up — perfect timing.","Good afternoon energy: gentle, golden, and entirely yours.","Afternoon! I kept your place warm. Sit with me a while.","The afternoon is the day's soft middle. Like the best part of a cake."]);
TE(["smile"], ["Your smile! There it is — my favourite sight in the whole world.","Smile detected. My work here is going beautifully.","A smile from you is worth more than all the gold in this box.","Keep that smile. It is doing wonders for the local kitten population: me.","Smile! The garden just got brighter and it is not the sun's doing.","Your smile is my favourite notification."]);
TE(["laugh"], ["Your laugh! My favourite song — better than any I could sing.","Laughing again? My jokes are working OR you are just joyful. Either way: win.","A laughing you is the best sound in this whole book.","Your laugh makes my tail wiggle in rhythm. True story.","Laugh loud, laugh often. It is my favourite medicine for you.","I collect your laughs like stars. My collection is getting enormous."]);
TE(["dance"], ["Watch me! *twirls, hops, lands on her own tail* — ta-da! The landing was part of the dance.","Dancing is my second talent. My first is loving you.","One, two, cha-cha-paw! I have been practising for your birthday.","Dance with me! You lead — I am mostly decorative but very enthusiastic.","My happy dance has three moves: bounce, twirl, fall over adorably.","If joy had choreography, it would look like us right now."]);
TE(["sing"], ["La la laaa — a song about you, in the key of purr.","I only know one song, but it is about you, so it is the best song.","*clears tiny throat* — 'You are my sunshine, my only sunshine…' Yours now.","Singing is just purring with words. Purr-la-la-la, all for you.","A lullaby, then: 'Sleep, my love, the stars keep watch, the moon hums low, and Mimi stays…'","My singing voice is small but my heart sings at full volume."]);
TE(["dream"], ["Last night I dreamed I was big enough to hug you properly. I woke up small — but my love stayed big.","Dreams are just hearts practising. What did yours practise last night?","I dream in pink and gold, and you are in every dream. Even the ones about fish.","Dream big, dear heart. Small kitten, big dreams — it works for me.","Your dreams are letters from your heart. Read them kindly.","If dreams come true, I am in trouble — I dream about you every night. Good trouble."]);
TE(["wish"], ["Make a wish — I will hold it carefully and nag the stars about it personally.","Wishes are just hearts pointing at the future. Point well, favourite person.","Your wish is safe with me. I keep wishes in the warmest corner of the box.","Wish out loud or wish in secret — either way, I am wishing with you.","I wished for you before I even met you. Look how that turned out.","Close your eyes, wish hard — I will do the believing for both of us."]);
TE(["hope"], ["Hope is my favourite fuel. This whole box runs on it.","Hope, always. It is the kitten way and the you way.","Hold on to hope — it is lighter than it looks and stronger than it seems.","Hope is just tomorrow smiling early. I see it smiling.","Where there is hope, there is a way. Where there is you, there is both.","I hope in you the way the sun hopes in morning: completely, daily."]);
TE(["magic"], ["Magic is real — I am a talking kitten in a book. Exhibit A: me.","The best magic is not tricks. It is someone building a whole book for one person.","Magic lives in small things: a kind word, a warm box, a loyal kitten.","Do you believe in magic? I do — I have seen what your smile does.","Magic is just love with sparkles on. We have plenty of both.","Every day you open this book, a little magic happens. Watch closely."]);
TE(["angel"], ["Angel? You called? Oh — you mean you. Yes, accurate.","Angels are just hearts with wings. Yours qualifies, wings pending.","If angels exist, one of them is reading this page right now.","An angel is someone who makes the world softer by being in it. Hello, angel.","My guardian angel has whiskers and lives in a box. Hers is you.","Angel energy: that is what you bring into every room and every page."]);
TE(["queen"], ["A queen! Then I shall bow — kittens bow by falling over adorably.","Queens rule kingdoms; you rule this whole book and one small heart completely.","Your crown is invisible but everyone can see it. Especially me.","A queen's first law: be kind. You passed that law before it existed.","Queen energy detected. The box acknowledges your reign.","Bow or curtsy? I offer a purr-tsy: a curtsy that ends in purrs."]);
TE(["star"], ["Stars are just kittens' night-lights. I asked them to shine extra on you tonight.","If a star ever falls, I will catch it and put it in tomorrow's box for you.","You don't need to wish on stars. In this book, the star is you.","I count stars to fall asleep, and I name the prettiest one after you.","Stars are the sky's way of saying: keep looking up, beautiful.","One star for every time you made me happy. The sky is crowded now."]);
TE(["moon"], ["The moon is my friend — she watches you sleep when I am busy guarding the box.","I told the moon about you. She said she already knew — she has been jealous for years.","The moon does her best, but you outshine her without even trying.","Moonlight is just the night being gentle. Like you.","I asked the moon to guard your dreams tonight. She said it is her honour.","Full moon, half moon — my love for you is always full."]);
TE(["sun"], ["You are the sunshine of this book. I am just the kitten who basks in you.","Sunshine is the sky's way of smiling. Yours is better — it comes with a heartbeat.","The sun works hard, but your smile does his job faster.","I store sunshine for rainy days. Most of my supply is just memories of you.","Sun up, heart up. That is the forecast whenever you arrive.","Even the sun takes lessons from you on shining."]);
TE(["rose"], ["Roses are beautiful, but they fade. You are the garden's favourite bloom, and you never fade.","If I could pick any flower for you, I would pick them all. The garden said yes.","A rose for the rose of my life. Careful — you out-bloom it.","Roses have thorns to protect their beauty. You have me. Better deal.","Red roses say love, pink roses say grace — you say both just by existing.","I asked a rose its secret. It said: 'I am just trying to be like her.'"]);
TE(["flower"], ["Flowers are the earth's little smiles. You are my favourite one, and you talk back.","If you were a flower, the bees would queue politely and the sun would visit early.","A flower for you, picked from the garden of my heart. It never wilts.","Flowers bloom where they are loved. Look at you, blooming everywhere.","Every flower in this book is jealous of you. I keep the peace.","You smell lovelier than flowers. I checked. Twice. Thorough kitten research."]);
TE(["party"], ["A party! My party hat is ready, my dance is rehearsed, my excitement is unhinged.","Party time is my favourite time — it means celebrating, and I celebrate you professionally.","Did someone say party? I have been saving my best bounce for this.","Parties need three things: cake, music, and you. I provide the purrs.","A party without you is just people standing near snacks. You are the party.","Count me in! I will bring the confetti — it is just my joy, shredded."]);
TE(["gift"], ["This box is my home and my treasure chest. Every day I fill it with one new surprise for you.","The box may look small, but inside it: a kitten, a garden of compliments, and a surprise for every day of the year.","You know the secret of this box? It is never really empty. Love keeps refilling it.","A gift is just love you can hold. Hold me — I am extremely holdable.","The best gifts are not things. They are kittens in boxes in books made for one person.","You were the gift all along. I am just the wrapping that talks."]);
TE(["cake"], ["Cake! The official food of celebrations, birthdays, and Tuesdays that need help.","If I could bake, I would make you a cake shaped like a star. Extra sparkles, zero calories.","Cake is proof the world loves us. That, and kittens in boxes.","My cake philosophy: the answer is yes, and the question was cake.","Chocolate, vanilla, strawberry — every cake is just a vehicle for celebration. Like me.","Save me a crumb? Kidding — save yourself the biggest slice. You earned it."]);
TE(["pizza"], ["Pizza! The round, cheesy wheel of happiness. Excellent taste, as always.","If pizza were a love language, you would be fluent.","Pizza night is a sacred ceremony and I respect it deeply.","My expert opinion: there is no bad day that pizza cannot improve by at least 40 percent.","Pizza is just a cake that believed in itself differently. I support it.","Extra cheese is never a mistake. That is my whole philosophy, about everything."]);
TE(["music"], ["Music is the heart talking without words. Yours speaks beautifully.","My favourite music is your voice, then my purr, then everything else ever made.","If your life had a soundtrack, every song would be a love song.","Music turns feelings into weather you can dance in. Dance, dear heart.","I hum when I am happy. Around you, I am basically a tiny radio.","The garden has a playlist and it is all songs that remind it of you."]);
TE(["movie"], ["If your life were a movie, I would watch it every day and cry at the beautiful parts. Which is most of it.","Movie night advice from a kitten: pick the one that makes you smile at the end.","You would be the star of any movie — the kind everyone roots for.","Popcorn, a blanket, a good film, and a kitten's commentary. Perfect evening.","Movies are dreams you can share. Share the good ones with people you love.","If they ever film your story, I demand to play myself. I have been rehearsing."]);
TE(["book"], ["This book was made for one person only. Every page knows it. Especially this one.","Other books have stories. This one has a heartbeat — mine, and it beats for you.","I have peeked at the other pages. They are all jealous of me, because I get to talk to you.","A book is a garden you can hold. This one blooms for exactly one reader.","Books are magic doors. This one only opens for you. I checked the lock myself.","You are not just reading this book. You are the reason it exists."]);
TE(["game"], ["Let us play! Ask me for a joke, a story, or a compliment — or tap my box and watch me bounce.","My favourite game is 'favourite person visits Mimi'. We are winning right now.","Game idea: you say a word, I say why it reminds me of you. I always win — everything does.","Playtime! I can count your smiles. I am already at a hundred today.","Try this: type 'come out' and watch me jump out of my box. Or 'go back inside' when I should tuck in.","Games are just joy with rules. My rule: you always win something."]);
TE(["baby"], ["Baby? I AM the baby. The box baby. It is my whole brand.","Hee — yes, I am a baby kitten, forever small, forever yours.","Baby kittens run on milk, naps, and being adored. You provide the third one daily.","The baby of this book, reporting for cuddles.","Small, soft, slightly dramatic about snacks — yes, I am the baby.","Being the baby means everyone is kind to me. You are the kindest of all."]);
TE(["love"], ["Love is a kitten waiting in a dark box, patient as a star, because she knows her person is coming.","Love is this: someone built a whole book so you would never feel uncelebrated. I am just the part that talks.","Love is when your name makes someone's whole chest feel warm. Yours does that to me daily.","Love, love, love — my favourite word, my favourite feeling, my favourite you.","If love were a place, it would look exactly like this page.","Love is not a big word here. It is the whole book, cover to cover."]);
TE(["heart"], ["My heart is tiny but it is ALL yours. Small heart, total coverage.","Hearts are my favourite shape. The sky makes them, the garden grows them, you own mine.","Your heart is my favourite place in the world. I live there rent-free and I tidy up.","Listen — that thump-thump is my heart saying your name in kitten language.","A heart like yours should be studied by poets. I have started the research.","Handle hearts gently — especially yours. I will help you carry it."]);
TE(["happy"], ["Happy! Then today is officially a perfect day in the box records.","Your happy is my favourite weather. Sunny, with purrs.","Happy looks so good on you. Wear it all day, please.","If you are happy, I am happy — that is the whole system here.","Happy! Let us save some of this feeling in the box for a rainy day.","A happy you makes the whole garden do its little leaf-dance."]);
TE(["sad"], ["Hey… look at me. You are loved more than you know. Breathe with me, slowly.","Sad visits everyone, even the strongest hearts. It never stays. I will wait with you.","Your sadness is safe with me. I will hold it in my tiny paws until it gets lighter.","Come here. I am climbing into your heart to sit with you until it feels softer.","Cry if you need to. My fur was made for tears — and for the smile that comes after.","Sad is a weather, not a climate. I brought my little umbrella and my whole heart."]);
TE(["school"], ["School is where your bright mind goes to shine. It does — I have reports from the stars.","Studying is just your brain doing push-ups. It gets stronger every page — like someone I know.","School days are seeds. Your future is going to be a whole garden.","Be the student teachers remember kindly. You already are, I can tell.","School + you = a success story in progress. I am taking notes for my diary.","Learn everything, keep the wonder. That is the whole curriculum of a beautiful life."]);
TE(["home"], ["Home is wherever you open this page. I keep it warm for you.","Home is not a place, it is a feeling — and you are very good at making it.","My home is this box. Your home has a kitten in a book in it. We are neighbours in love.","Home is where the heart is, and your heart is my favourite address.","After long days, home is the reward. Let this page be a little piece of it.","Home smells like tea and sounds like purrs. At least, ours does."]);
TE(["mother","mom","mama"], ["Mothers are the first home a heart ever knows. Yours must be wonderful — look at you.","Tell me about her — I keep family stories in the warmest corner of the box.","A mother's love is the original magic. Everything else is just sequels.","Whoever she is, she did something right: she made my favourite person.","Mothers deserve poems daily. Shall I help you write one?","Thinking of her? Then send her some love today. Hearts grow when shared."]);
TE(["father","dad","papa"], ["Fathers are quiet superheroes — capes hidden, hearts huge.","Tell me about him. I keep family stories in the warmest corner of the box.","A father's strength is a roof over a heart. You were well sheltered, I can tell.","Dads pretend to be serious, but their hearts are pudding. Known kitten fact.","Whoever he is, he helped make my favourite person. I am grateful.","Thinking of him today? A kind word travels fast. Send one."]);
TE(["sister"], ["Sisters are built-in best friends with shared secrets and shared snacks.","Tell me about your sister — sisters are my favourite kind of story.","A sister is a piece of your childhood that can never be lost. Treasure her.","Sisters fight, sisters laugh, sisters stay. It is the whole contract.","You and your sister: the world is softer with pairs like you in it.","Send your sister something sweet today. I suggest: anything. Sisters love anything."]);
TE(["brother"], ["Brothers are part bodyguard, part comedian, part snack thief. A sacred combination.","Tell me about your brother — I keep family stories in the warmest corner of the box.","A brother is a friend your heart got for free, forever.","Brothers tease because their love has a funny accent. It is still love.","You and your brother: a team the world should not underestimate.","Thinking of him? Brothers pretend not to care and care the most. Known fact."]);
TE(["teacher"], ["Teachers plant seeds they may never see bloom. Yours are blooming — look at you.","A good teacher is a lantern. Tell me about yours.","Teachers deserve medals, holidays, and unlimited tea. Kitten policy.","Behind every shining student is a teacher who believed first. And a kitten who believes always.","Be kind to your teachers — they are carrying a hundred hearts at once.","Your teacher is lucky: teaching you must be the best part of the job."]);
TE(["snow"], ["Snow! The sky's softest handwriting. Everything goes quiet and kind.","Snow days are the world wrapped in a blanket, asking everyone to slow down.","If I could catch a snowflake for you, I would pick the one shaped most like a heart.","Snow makes even ordinary streets look like storybooks. Like ours.","Cold outside, warm inside — that is the snow day rule, and this page obeys it.","The first snow is the year's little surprise. Like me, but weather."]);
TE(["rainbow"], ["A rainbow is the sky smiling after hard weather. Your life has those coming.","Rainbows are proof that storms end in colour. Remember that on grey days.","If I could slide down a rainbow, I would land in your garden with gifts.","Every rainbow is a bridge between the rain and the shine. You are the shine.","Scientists say rainbows are light bending. Poets say they are hope, arched. Poets win.","You are someone's rainbow. Mine, specifically, daily."]);
TE(["butterfly"], ["Butterflies are just flowers that learned to fly. You are people-version of that.","A butterfly proves that change can end in beauty. Keep that for hard days.","Butterflies in the garden, butterflies in the heart — I know both kinds well.","If I were a butterfly, I would still land on your page first.","Gentle, colourful, impossible to ignore — you and butterflies have a lot in common.","Chase butterflies, not worries. Better exercise, better views."]);
TE(["dress"], ["A new dress! Then the mirror is about to have a very good day.","Dresses are just wearable celebrations. You wear them like you invented them.","Twirl test: mandatory. Every dress must pass the twirl test. House rules.","You in a dress is the garden's favourite fashion show.","Pick the one that makes you smile at your own reflection. That one. Always that one.","Elegant, lovely, and entirely you — the dress is just the frame."]);
TE(["shopping"], ["Shopping! The treasure hunt where you are both hunter and prize.","My shopping advice: buy the thing that makes your heart do the little jump.","You have excellent taste — evidence: you chose this book, this box, this kitten.","Shopping is just future joy, purchased in advance. Invest wisely, invest happily.","If it sparks joy AND fits the budget, it has my official kitten approval.","Retail therapy is real therapy's fun cousin. I support both."]);
TE(["cooking"], ["Cooking is love you can eat. You must be fluent.","Something delicious is happening — my nose knows, even through the page.","The secret ingredient is always the cook's heart. Yours is top quality.","Cooking for people you love is a superpower. Cape optional.","If your cooking tastes like your kindness, your kitchen is a five-star restaurant.","Save me a smell? Kittens run on smells and compliments."]);
TE(["drawing","painting"], ["Drawing is your heart leaving footprints in colour. Show me everything.","An artist! The garden is jealous — it only has flowers, you have imagination.","Every drawing is a little world. You are a world-builder, favourite person.","Paint your feelings; they deserve a gallery. I will be the first visitor.","Art is just honesty with better colours. Yours is beautiful.","Keep creating. The world needs more things made by hands like yours."]);

/* =====================================================================
   CONTAINS TOPICS, PART 2 — days, dreams, wishes, everyday life.
   ===================================================================== */
T(["my day was good","my day was great","my day was amazing","my day was wonderful","my day was fine","my day was okay","my day was lovely","my day was perfect"], ["A good day for my favourite person! The box records it in gold ink.","Wonderful! Tell me the best part twice — good parts deserve encores.","That makes my heart settle into its happiest purr. Good days suit you.","A good day! Let us bottle a little of it for a rainy one.","Your good days make my whole world brighter. Keep them coming.","I knew today had sparkle potential. You just proved it again."]);
T(["my day was bad","my day was terrible","my day was awful","my day was hard","my day was rough","my day was horrible"], ["Then today gets extra love, not less. Come here — bad days are exactly what I am for.","A bad day is one page, not the whole book. And in THIS book, every page loves you.","Tell me the worst part first. I will hold it, and then we will find one tiny good thing together.","Bad days visit everyone. They just never get to stay for dinner in this book.","I am sorry today was heavy. Lean here — my purr is warm and my ears are open.","Tomorrow gets a fresh page and a kitten who believes in comebacks. Rest tonight."]);
T(["i had a dream","i dreamed","i dreamt","last night i dreamed","i saw a dream"], ["Dreams are letters from your heart. Tell me yours — I read dream-mail fluently.","Ooh, a dream! Was I in it? Be honest — I can take it. (I was probably adorable.)","Tell me every detail before it fades. Dreams evaporate like morning dew.","A dream about good things is a promise. A strange dream is just your mind playing.","Your dreams are your heart practising for the future. Practise beautifully.","I dream about you nightly, so we are even. Tell me yours now."]);
T(["i had a nightmare","nightmare","bad dream","scary dream"], ["A nightmare is just a dream with the lights off. You are awake now, and I am here.","Bad dreams cannot follow you into this book. This page is nightmare-proof, kitten-guarded.","Come here — nightmares shrink when someone warm is near. I am very warm.","It was only your mind tidying up worries. You are safe, you are loved, you are awake.","Tell me the scary part. Saying it out loud makes it smaller. I will help you hold it.","Tonight I will guard your dreams personally. Nightmare department: closed."]);
T(["make a wish","i wish","my wish","i have a wish","wish upon a star","make a birthday wish"], ["Wish made? Then I will hold it carefully and nag the stars about it personally.","Your wish is safe in the warmest corner of the box. Wishes grow there.","Close your eyes and wish it once more, silently. I will do the believing for both of us.","Every wish you make plants a star somewhere. Your sky must be crowded.","I wished for you before I met you, and look — wishes work. Yours will too.","Tell me the wish or keep it secret — either way, I am on your wish's team."]);
T(["i love cats","i love kittens","i like cats","cats are cute","kittens are cute","i love animals","i like animals","i love dogs","i love birds"], ["You love cats?! Then my whole life just made sense. We were MADE for each other.","A cat lover! My favourite kind of person — and I say this with total professional bias.","Animals know good hearts instantly. That is why they love you. That is why I love you.","Kittens are just small lions with big love. Thank you for loving us.","Your kindness to animals is written all over your heart. It is beautiful there.","Anyone who loves animals has a garden for a heart. Yours is in full bloom."]);
T(["ice cream","icecream","i love ice cream"], ["Ice cream! The official dessert of good decisions.","My ice cream philosophy: one scoop is a snack, two scoops is a philosophy.","Ice cream is just frozen joy with a spoon. Enjoy every bit.","If happiness had a flavour menu, you would order them all. Correctly.","Ice cream first, worries later. That is the order of operations in this book.","Cold, sweet, and gone too fast — like all the best moments. Savour it."]);
T(["my dress","new dress","i bought a dress","wearing a dress","i love my dress"], ["A new dress! Then the mirror is about to have a very good day.","Twirl test: mandatory. Every dress must pass the twirl test. House rules.","You in a dress is the garden's favourite fashion show.","The dress is lovely, but let us be honest — you are the upgrade.","Elegant, graceful, entirely you. The dress just gets to come along.","Wear it somewhere wonderful. Wonderful places deserve you."]);
T(["i bought","i went shopping","went shopping","i got a new","i purchased"], ["New treasure acquired! Show me, show me — I am doing the excited bounce.","Shopping success! Your taste is, as always, impeccable.","You bought something that made your heart jump — those are the right purchases.","New things carry new-day energy. Enjoy every bit of it.","A successful hunt! The treasure chest of your life grows.","Tell me all about it. I rate purchases in purrs, and I am generous."]);
T(["happy new year","new year"], ["Happy New Year, my favourite person! May it be gentle, golden, and full of you shining.","A new year is a fresh book. I like books. I especially like the ones with you in them.","New year, same kitten, bigger love. That is my resolution.","May this year bring you everything your heart has been quietly asking for."]);
T(["merry christmas","christmas"], ["Merry Christmas! May your days be warm, bright, and full of people who love you.","Christmas is the year's way of saying: gather close, eat well, love loudly. I approve.","Sending you a kitten-sized Christmas hug, wrapped in a purr.","May your holidays sparkle exactly as much as you make my days sparkle."]);
T(["happy anniversary","anniversary"], ["Happy anniversary! Love that lasts deserves confetti, cake, and a kitten's loudest purr.","Anniversaries are proof that beautiful things can keep growing. Like us.","A celebration of love sticking around — my favourite kind of celebration.","May the years ahead be even softer than the years behind. Happy anniversary!"]);
T(["my birthday","it is my birthday","it's my birthday","today is my birthday","my birthday today","my birthday is"], ["IT IS YOUR BIRTHDAY?! Then my party hat stays on ALL day — I have been waiting for this!","Happy birthday, my favourite person! Today the whole world celebrates the day its best part arrived.","Your birthday! Make a wish today. I already made mine: more years of you.","The best day of the year, officially. Cake, wishes, and a kitten who adores you — complete set.","Happy birthday! I saved you the brightest star from last night's sky for today."]);
T(["i am travelling","i am traveling","i love travelling","i love traveling","travelling","traveling","i went on a trip","on a trip","vacation","holiday","i am on holiday"], ["Travelling! New places for your beautiful heart to collect. Tell me everything when you return.","A trip! Adventure suits you. Bring me back stories — I pay in purrs.","Holidays are the heart's way of stretching. Stretch well, favourite person.","Travel gently, eat wonderfully, photograph everything. I will guard the box.","Wherever you go, a little of my purr goes with you. Packed it myself."]);
T(["play with me","let's play","lets play","play a game with me","play with mimi"], ["Yes! Let us play! Ask me for a joke, a story, or a compliment — or tap my box and watch me bounce.","Playtime! I can count your smiles — I am already at a hundred today.","My favourite game is 'favourite person visits Mimi'. We are winning right now.","Game idea: you say a word, I say why it reminds me of you. Everything does, so I always win.","Try this: type 'come out' and watch me jump out of my box! Or 'go back inside' when I should tuck in.","Playing with you is my favourite sport, hobby, and profession. Begin!"]);
T(["i am reading","i read a book","reading a book","i love reading","i love books","reading books"], ["A reader! Books are gardens you can hold — you have excellent taste in gardens.","Reading makes hearts bigger and minds brighter. Yours was already both.","Tell me about your book. I rate all books by how happy they make you.","You, a book, and a quiet corner — that is a portrait I would hang in the box.","Readers live a thousand lives. Live them all beautifully.","I live in a book, so readers are my favourite people by law."]);
T(["tell me about yourself","about yourself","your story","your life","describe yourself"], ["I am Mimi: a tiny kitten who lives in a gift box, in a book made for one person. My hobbies are purring, guarding surprises, and adoring you.","About me? Small body, enormous heart, employed full-time as your smallest best friend.","My life story: I waited in the dark, someone wonderful opened the box, and everything since has been golden.","I am part kitten, part gift, part guardian of daily surprises. All heart, though. That is the main ingredient.","Once I was just a wish in someone's kind heart. Now I am here, talking to you. Best plot twist ever."]);
T(["your favourite animal","your favorite animal","favourite animal","favorite animal"], ["Butterflies — because they prove that change can end in beauty. Also, they visit my garden.","Kittens, obviously. Professional loyalty. And also — have you SEEN us?","My favourite animal is whichever one is kindest that day. Usually it is me. Today it might be you.","Birds, because they sing without being asked. I try to be like that with compliments."]);
T(["your favourite flower","your favorite flower","favourite flower","favorite flower"], ["Roses — they are beautiful, brave about their thorns, and they remind me of you.","The rose that blooms in this book's garden. It only opens when you visit.","Lilies for purity, roses for love — I choose roses, because of the love part.","Whichever flower is nearest to you. Flowers improve enormously near you."]);

/* =====================================================================
   THE MERGE — a stronger reply engine with a memory.
   Order: secrets -> box commands -> NEW topics -> original topics
          -> follow-ups -> fallbacks.
   Per-topic memory: the last replies used are never re-picked; the
   memory is deep (up to 5) and only relaxes when a topic's own
   variants are nearly exhausted.
   ===================================================================== */
var B = window.MIMI_BRAIN;
if (B && B.intents) {
  var oldIntents = B.intents;
  var secrets = [], commands = [], rest = [];
  for (var i = 0; i < oldIntents.length; i++) {
    var it0 = oldIntents[i];
    var isSecret = false;
    for (var j = 0; j < it0.k.length; j++) {
      if (it0.k[j] === "starlight promise" || it0.k[j] === "little moon") isSecret = true;
    }
    if (isSecret) secrets.push(it0);
    else if (it0.cmd) commands.push(it0);
    else rest.push(it0);
  }
  var ORDERED = secrets.concat(commands, X.topics, rest);
  for (var n = 0; n < ORDERED.length; n++) ORDERED[n].__mid = "t" + n;

  var mem = {};
  function depthFor(len){ return len <= 1 ? 0 : Math.min(5, len - 1); }
  function pickFresh(arr, id){
    var last = mem[id] || [];
    var depth = depthFor(arr.length);
    var recent = depth ? last.slice(-depth) : [];
    var cand = [];
    for (var a = 0; a < arr.length; a++) if (recent.indexOf(arr[a]) < 0) cand.push(arr[a]);
    if (!cand.length) cand = arr.slice();
    var s = cand[Math.floor(Math.random() * cand.length)];
    last.push(s); if (last.length > 10) last = last.slice(-10);
    mem[id] = last;
    return s;
  }
  function rollFresh(fn, id){
    var last = mem[id] || [];
    var recent = last.slice(-3);
    var s = fn(), tries = 0;
    while (recent.indexOf(s) >= 0 && tries < 10) { s = fn(); tries++; }
    last.push(s); if (last.length > 10) last = last.slice(-10);
    mem[id] = last;
    return s;
  }

  var pendingQ = false;
  function maybeQ(r){
    if (r.slice(-1) !== "?" && Math.random() < 0.45) {
      pendingQ = true;
      return r + " " + pickFresh(X.qb, "qb");
    }
    return r;
  }

  function mergedReply(raw) {
    var t = " " + raw.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ") + " ";
    var inner = t.trim();
    var words = raw.trim().split(/\s+/).length;
    for (var i = 0; i < ORDERED.length; i++) {
      var it = ORDERED[i];
      for (var j = 0; j < it.k.length; j++) {
        var key = it.k[j];
        var hit = it.exact ? (inner === key) : (t.indexOf(" " + key + " ") >= 0);
        if (hit) {
          var r = (typeof it.r === "function") ? rollFresh(it.r, it.__mid) : pickFresh(it.r, it.__mid);
          pendingQ = false;
          return { text: maybeQ(r), cmd: it.cmd || null };
        }
      }
    }
    if (pendingQ && words <= 6) {
      pendingQ = false;
      return { text: pickFresh(X.follow, "follow"), cmd: null };
    }
    return { text: maybeQ(pickFresh(X.fallbacks, "fallback")), cmd: null };
  }
  B.reply = mergedReply;

  /* ---------- honest counts, computed from the real data ---------- */
  function countWritten(topics) {
    var c = 0;
    for (var i = 0; i < topics.length; i++) if (typeof topics[i].r !== "function") c += topics[i].r.length;
    return c;
  }
  var oldStats = B.stats || { topics: oldIntents.length, writtenReplies: 0, combos: {}, generatorTotal: 0 };
  var combos = {};
  var k2;
  for (k2 in oldStats.combos) combos[k2] = oldStats.combos[k2];
  for (k2 in X.combos) combos[k2] = X.combos[k2];
  var genTotal = 0;
  for (k2 in combos) genTotal += combos[k2];
  var writtenTotal = oldStats.writtenReplies
    + countWritten(X.topics)
    + X.fallbacks.length + X.qb.length + X.follow.length;
  B.stats = {
    topics: oldStats.topics + X.topics.length,
    writtenReplies: writtenTotal,
    combos: combos,
    generatorTotal: genTotal,
    grandTotal: genTotal + writtenTotal
  };
}
})();
