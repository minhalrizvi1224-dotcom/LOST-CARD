// LOST CARD - Simulation Engine
// JavaScript mirror of main.cpp (C++17) by S. M. Minhal Abbas Rizvi
// BSSE | Data Structures & Algorithms | The Bet of Belief

'use strict';

// ─── Dialogue Pools ─────────────────────────────────────────────────────────

const P1_SOFT = [
  "I know. I miss the way things used to feel between us too.",
  "You're right. I've been more absent than I realized.",
  "Tell me what you actually need from me. I want to hear it.",
  "I hear you. That was real, and it matters.",
  "I'm sorry I made you feel like that. You didn't deserve it.",
  "That took courage to say. Thank you for trusting me with it.",
  "I think about that too. More than you know.",
  "I'm here now. Whatever you need to say - I'm listening.",
  "You're not wrong. And I hate that you're not wrong.",
  "I've been carrying that too. We should have talked sooner.",
  "You've been more patient with me than I deserved.",
  "I want to fix this. Tell me where to start.",
  "That's fair. I can't argue with that.",
  "I didn't know it looked that way from your side. I'm glad you told me.",
  "I think we both let it get here. Let's not let it go further.",
  "You still matter to me. More than I've been showing.",
  "I should have checked in more. I knew something was off.",
  "I'm not going anywhere. You don't have to keep wondering that.",
  "Say more. I want to understand what you've been through.",
  "That's on me. I'll do better.",
  "I didn't realize how much this was affecting you. I'm sorry.",
  "That's an honest thing to say. I respect it.",
  "I value what we have. I need to start acting like it.",
  "You deserve someone who shows up. I want to be that.",
  "I've missed this - actually talking to you.",
  "I'm not making excuses. You're right.",
  "What would help right now? Tell me.",
  "I see you. I just haven't been very good at showing it.",
  "Let's not lose this. It's worth fighting for.",
  "I hear the loneliness in that. I put it there. I want to take it back.",
  "That photo means something to me too. I didn't realize how much until you brought it up.",
  "I want to be honest - I think I've been coasting and calling it comfortable.",
  "You noticing that, and still being here - that's not nothing. That's everything.",
  "I'll be real: I haven't been showing up the way this deserves.",
  "I'm not going to pretend that's not a valid thing to feel.",
  "Tell me what you're actually thinking. Not the edited version.",
  "I needed to hear that even though it was hard.",
  "I want to understand what I've been missing. Walk me through it.",
  "I know I've been hard to reach lately. That's real and I want to fix it.",
  "The fact that you're still here saying this - that means something.",
  "I've been showing up in body but not in presence. You felt that because it was true.",
  "You didn't make this up. I've been different and I know it.",
  "That's a fair read of what's been happening. I won't argue it.",
  "I want to ask - what would actually help right now? Not guess. Ask.",
  "I care about this. I know my actions haven't been saying that.",
  "You're the person I'd want to call if something went wrong. I should act like it.",
  "I've been treating something important like it could wait. It couldn't.",
  "I'm not going to deflect. You're saying something real.",
  "Something shifted and I didn't address it. That was on me.",
  "I want you to know you can say the hard thing. I'm not going anywhere.",
  "What happened between us - I want to understand it from your side.",
  "I didn't show up the way you deserved. I know that now.",
  "You've been giving this more than I have. I want to change that.",
  "I don't want to lose the version of us that used to exist.",
  "The gap grew while I wasn't paying attention. That's my fault.",
  "You said something real just now. I want to sit with it, not rush past it.",
  "I'm here right now, fully. Say whatever you need to say.",
  "That picture you found - I've been thinking about that time too.",
  "I owe you more than I've been giving. Let's start over from here.",
  "This matters to me. I should have made that clearer a long time ago."
];

const P1_AGGR = [
  "You're making this bigger than it needs to be.",
  "I've been busy. That's not a crime.",
  "Why does everything have to become a whole conversation.",
  "I don't have the energy for this right now.",
  "You're being oversensitive.",
  "This is exactly why I don't bring things up.",
  "Can we not do this today.",
  "I'm not going to apologize for having a life outside of this.",
  "You always make me feel like I'm doing something wrong.",
  "This isn't fair. I've been dealing with a lot.",
  "You don't get to decide how much effort is enough.",
  "I said I'm sorry. What more do you want.",
  "Stop keeping score. It's exhausting.",
  "Not everything is about you, Hani.",
  "You're the one who's been distant lately, not me.",
  "This feels like an ambush.",
  "I didn't realize you were this fragile about it.",
  "We're adults. We don't have to talk every day.",
  "I'm not going to sit here and be guilt-tripped.",
  "You knew what I was like when we became friends.",
  "I give a lot too. You just don't notice.",
  "Maybe you expect too much.",
  "I can't be your everything, Hani.",
  "Why are you bringing this up now.",
  "That's not how I remember it.",
  "You sound like you've been saving this up.",
  "I don't owe you a daily check-in.",
  "You're making me feel terrible for no reason.",
  "I'm here right now, aren't I. What else do you want.",
  "This is a lot to unload on someone.",
  "I don't think you're being entirely fair about this.",
  "You've been pulling away too. You just don't see it.",
  "I think we've both contributed to where we are.",
  "That's one way to read it. It's not the only way.",
  "I'm not the only one who's been inconsistent lately.",
  "I've had things going on too. You didn't ask.",
  "We're both adults. We don't owe each other everything.",
  "That photo is from years ago. People change.",
  "I'm not sure why you're framing it like I did something wrong.",
  "You're holding me to a standard that I don't think you're meeting either.",
  "I'm being honest - this feels like it's coming from a place of frustration, not clarity.",
  "I think you're projecting some of this.",
  "I came here, didn't I? That has to count for something.",
  "Not everyone expresses care the same way. That doesn't make it absent.",
  "This is the first time I'm hearing this. You can't expect me to have fixed something I didn't know about.",
  "I understand you feel that way, but I genuinely don't think you're reading this right.",
  "I've been under a lot of pressure. That's not an excuse, it's context.",
  "I don't appreciate being made to feel guilty for having other things in my life.",
  "People drift. That's normal. Not everything means something.",
  "I think you're expecting a version of closeness that isn't realistic.",
  "I'm here right now talking to you. That's more than a lot of people get.",
  "Maybe we just need some space instead of picking at everything.",
  "You're framing this like it's all on me. That's not fair.",
  "I don't know what you want me to say to that.",
  "That picture doesn't mean what you think it means.",
  "I'm not going to apologize for who I am.",
  "This conversation is making me feel attacked and I don't think that's productive.",
  "I've been trying. Maybe it just doesn't look like what you expected.",
  "You're building a narrative that I'm not sure is entirely accurate.",
  "I have my own life. I thought you respected that."
];

const P1_SILE = [
  "...",
  "Mm.",
  "Yeah.",
  "Okay.",
  "[sets the phone down]",
  "Sure.",
  "Right.",
  "I know.",
  "[long pause]",
  "Alright.",
  "[typing indicator appears, then disappears]",
  "Yeah, okay.",
  "Noted.",
  "Fine.",
  "[seen]",
  "Yeah I get it.",
  "Mm-hm.",
  "[no response]",
  "K.",
  "I hear you.",
  "[closes the chat]",
  "True.",
  "Got it.",
  "[reads it twice, says nothing]",
  "[puts the phone face down]",
  "I'll think about it.",
  "[scrolls up, doesn't respond]",
  "We can talk about this later.",
  "There's a lot there.",
  "Hm.",
  "I hear what you're saying.",
  "[looks away for a moment]",
  "That's a lot to process right now.",
  "Let me think.",
  "Yeah, I get what you mean.",
  "Okay. Sure.",
  "[a pause, then nothing]",
  "I mean... yeah.",
  "I don't know what to say to that.",
  "Mm, okay.",
  "[read receipt appears]",
  "Right, okay.",
  "We'll talk.",
  "I'll get back to you on that.",
  "Yeah, I'll think about it."
];

const P2_SOFT = [
  "I've been thinking about that night too. I'm sorry I wasn't there.",
  "You're not overthinking it. I've been pulling away. That's real.",
  "I don't want to lose what we have. I'm going to try harder.",
  "That hurt to hear. And it should - because it's true.",
  "You've been carrying that alone for too long. I'm sorry.",
  "Tell me what the friendship feels like from your end. I need to know.",
  "I knew something was wrong. I just didn't want to be the one to name it.",
  "I'm scared to admit how much I've been checked out. But I have been.",
  "You deserved better than what I've been giving. I know that.",
  "I want to understand how we got here. Walk me through it.",
  "The fact that you still want to talk to me - that means everything.",
  "I've been confusing being around with being present. They're not the same.",
  "Whatever distance you felt - it was real. It wasn't in your head.",
  "I see how much this has cost you. I haven't been paying attention to that.",
  "I don't want to be the person who made you feel like this.",
  "I'm listening. Not defensively. Just - listening.",
  "You were right to bring this up. I was hoping you wouldn't have to.",
  "That's on me. I built this wall without realizing it.",
  "I think about what you said a lot. More than you know.",
  "You don't deserve someone who shows up halfway. I want to change that.",
  "I've been protecting myself from a conversation I should have started.",
  "You gave me more chances than I earned. I know that.",
  "I hear the exhaustion in that. I put it there.",
  "You've been trying to reach me and I've been just - elsewhere.",
  "I should have asked how you were long before you had to tell me.",
  "What I gave you wasn't enough. I'm not defending that.",
  "You deserved the full version of me. I kept giving you the edited one.",
  "I know what you needed. I just kept choosing not to give it.",
  "I didn't realize I was making you feel invisible. I'm sorry.",
  "You kept showing up. I didn't. That's the truth.",
  "I've been running from this conversation for weeks. That was wrong.",
  "The loneliness you described - I contributed to that. I own that.",
  "I want to understand what withdrawal looked like from where you were standing.",
  "That night you mentioned - I knew something was wrong and I let it sit. I shouldn't have.",
  "You gave me the benefit of the doubt longer than you should have. I know that.",
  "I've been prioritizing the wrong things. This should have come first.",
  "I don't want to be someone you used to be close to. I want to be someone you still are.",
  "The fact that you held on this long says more about you than it does about me.",
  "I didn't give you a reason to reach out. That was a failure on my part.",
  "You deserved to have your messages answered. I'm sorry I didn't.",
  "I've been half-present for too long. That's not what you signed up for.",
  "You said you stopped telling me things. I want to know when that changed.",
  "I think I let distance become the default because I didn't know how to close it.",
  "The worst part is I noticed something was off and still didn't act. That's on me.",
  "You've been more forgiving of this than I deserved.",
  "I want to be the person who shows up for you. Let me try from here.",
  "I know an apology doesn't undo any of it. But I mean it.",
  "I don't want the last version of us to be the current one.",
  "You've been doing the emotional labor of this friendship for too long alone.",
  "I see the pattern now. I just wish I'd seen it before you had to lay it out like this.",
  "Whatever I was protecting myself from - it wasn't worth this.",
  "You called. I didn't answer. Not once, but repeatedly. I have no good reason for that.",
  "I want to know what you actually need. Not what I assume. What you need.",
  "There's a version of this where I do better. I want to find it.",
  "The distance between us right now - I built most of it. Let me start dismantling it.",
  "You were honest with me just now. The least I can do is be honest back.",
  "I've been absent in the way that's harder to explain than being physically gone.",
  "I'm not going to make excuses. What you described is accurate.",
  "That took trust to say. I don't want to waste it.",
  "I want to be worth the chance you're still giving me."
];

const P2_AGGR = [
  "I've apologized. I don't know what else you want.",
  "You keep bringing this back up. That's not fair.",
  "Maybe we just have different friendship styles.",
  "I've been dealing with things too. This isn't one-sided.",
  "You make it sound like I've been terrible.",
  "You can't expect me to read your mind.",
  "I didn't know this was such a big deal to you.",
  "You never said anything. So how was I supposed to know.",
  "This is starting to feel like an attack.",
  "I've been trying. You just don't see it.",
  "It's not like you've been perfect either.",
  "Maybe we're just growing apart. That happens.",
  "You're holding onto this too tightly.",
  "Not every silence means something.",
  "I have a life. I can't be available 24/7.",
  "You're being dramatic about this.",
  "I don't think it's as bad as you're making it.",
  "I'm allowed to have off periods.",
  "You're making me feel guilty for things I can't control.",
  "Maybe your expectations are just too high.",
  "I came today didn't I. What more do you want.",
  "You knew this about me when we became close.",
  "I'm not going to keep apologizing for who I am.",
  "Sometimes people drift. It's not a betrayal.",
  "I've given a lot to this friendship too.",
  "You're focusing on the negatives.",
  "That's not a fair summary of what happened.",
  "Maybe we both need some space from this conversation.",
  "I don't think you're being reasonable right now.",
  "I'm starting to feel like nothing I do will be enough.",
  "I feel like you've already decided how this conversation ends.",
  "You're speaking about this like I've been cruel. I haven't been cruel.",
  "I'm a person, not a support system you can call whenever you need.",
  "This isn't the first time you've made me feel like I'm failing you.",
  "I think you're asking for a kind of presence that isn't sustainable.",
  "I didn't know you needed that. That's not the same as not caring.",
  "You built up a story about this without giving me a chance to respond.",
  "There were things going on in my life too. You didn't ask.",
  "I can acknowledge your feelings without agreeing with your interpretation.",
  "I'm not responsible for every feeling you have about our friendship.",
  "This is starting to feel less like a conversation and more like a verdict.",
  "If you'd told me you needed more, I could have responded to that.",
  "You're making this sound intentional. It wasn't.",
  "I'm not perfect. I never claimed to be.",
  "Friendship isn't a transaction. You can't track it like a ledger.",
  "I think you're conflating distance with abandonment.",
  "Maybe the problem is that your definition of closeness is too rigid.",
  "I've been going through my own things. I can't always be available.",
  "You're entitled to your feelings but they're not necessarily accurate.",
  "I'm not going to sit here and absorb this without pushing back.",
  "If this is about one missed call - I think you're overreacting.",
  "I've never claimed to be someone who's good at staying in touch.",
  "You're holding a version of me from years ago. People change.",
  "I'm not the only one in this friendship who's been inconsistent.",
  "I think you need to ask yourself what you actually want from this.",
  "Maybe we've both been taking this for granted. That's not just me.",
  "I'm sitting here trying but it doesn't feel like it's landing.",
  "You're asking me to account for something I didn't know was a problem.",
  "The way you're framing this makes it feel like I've been malicious. I haven't.",
  "I hear what you're saying. I just don't entirely agree with it."
];

const P2_SILE = [
  "...",
  "[long silence]",
  "Yeah.",
  "[stares at the wall]",
  "I guess.",
  "[doesn't respond]",
  "[quietly] I know.",
  "[nods once]",
  "Mm.",
  "[takes a breath, says nothing]",
  "[types, deletes it]",
  "Okay.",
  "[says nothing]",
  "[nods slowly]",
  "[stares at the table]",
  "[quietly] Yeah.",
  "[no words come]",
  "Fine.",
  "[a long silence]",
  "Right.",
  "[just sits there]",
  "I don't know what to say.",
  "[looks down]",
  "Sure.",
  "[the silence says everything]",
  "[doesn't move]",
  "Yeah, okay.",
  "...",
  "That's... yeah.",
  "I need a second.",
  "[exhales slowly]",
  "I'll respond to this properly later.",
  "[eyes the exit]",
  "Mm-hm. Yeah.",
  "[long pause before answering anything]",
  "I don't have words for this right now.",
  "[shifts in seat, says nothing]",
  "Sure, okay.",
  "[quiet] Okay.",
  "There's a lot there. I need to think.",
  "[reads the message twice, puts the phone away]",
  "I mean... I hear you.",
  "Right. Yeah.",
  "[silence that goes on too long]",
  "I'll get back to you on this."
];

const P3_SOFT = [
  "I'm not letting this be the end. Not without fighting for it first.",
  "You matter too much to me for me to walk away from this conversation.",
  "I hear the exhaustion in that. I want to be the reason it gets lighter.",
  "I'm not giving up on us just because it's gotten hard.",
  "Tell me what you need. Specifically. I'll do it.",
  "I'm still here. I want to be here. That hasn't changed.",
  "Don't close this yet. Give me one more chance to show up correctly.",
  "I know I've been inconsistent. I'm asking for the chance to not be.",
  "You're worth showing up for. I should have been doing that all along.",
  "I don't want to be the person you used to trust. I want to be the person you still do.",
  "Whatever form this takes from here - I want to be part of it.",
  "I know this is fragile right now. I'll be careful with it.",
  "You said 'slowly'. Okay. Slowly. I can do slowly.",
  "I don't need it to go back to how it was. I just need it to go forward.",
  "The fact that you're still talking to me is a gift. I know that.",
  "I'm not the same either. But I think we can figure out who we are now together.",
  "I won't pretend it hasn't been damaged. But damaged isn't the same as done.",
  "I want to be someone worth staying for. Let me try.",
  "You didn't give up when things got hard. I owe you the same.",
  "We've both changed. Let's find out if we still fit.",
  "I know I've made this hard. I'm asking for the chance to make it easier.",
  "You said you can't do another fall. I don't want to be your falling point.",
  "I'll be consistent. Not perfectly - but genuinely.",
  "I hear you saying goodbye in that. I'm saying: not yet.",
  "Whatever trust is left - I'll protect it. I promise.",
  "I want to know the version of you that exists now. Will you let me?",
  "The roof photo. The way things felt then. I want to find our way back to something like that.",
  "I'm not ready to let this be a memory. I think you aren't either.",
  "Slowly means I'm still in this. And I am.",
  "Tell me we still have something to work with. I believe we do.",
  "You've been carrying the weight of this for both of us. Let me take some of it.",
  "I'm not asking for everything to be forgiven tonight. I'm asking for one more try.",
  "The distance between us right now isn't permanent unless we let it be.",
  "I know I don't deserve certainty right now. I'm not asking for that. Just a chance.",
  "Whatever I have to do to earn this back - I want to know. Tell me.",
  "I'm not going to make the same mistake again. I understand what it costs now.",
  "I want to show you what different looks like. Not tell you. Show you.",
  "You're still here. That means something. I don't want to waste it.",
  "I'm scared of losing this. That fear is real. It should have shown up sooner.",
  "The version of us I remember - I think we can find our way back to something like it.",
  "I've been thinking about what you said since you said it. I want to respond to all of it.",
  "You kept reaching. I want to be the person who finally meets you halfway.",
  "I don't want this to be a post-mortem. I want it to be a beginning.",
  "I'll prove it. Not with words right now. With what I do next.",
  "You're right that I've been distant. The question is whether that's the whole story.",
  "I want to rebuild this the right way. Carefully. With you leading.",
  "You deserve consistency. I'm going to give you that.",
  "Not because I have to. Because I want to. Because this matters.",
  "We've been close before. That doesn't just disappear. I won't let it.",
  "Whatever it takes - I'm willing. I just need you to tell me what that is.",
  "I know words don't fix this. But I mean every one of them.",
  "You asked if I'm still invested. Yes. Fully. Completely. More than I've shown.",
  "I don't want to look back on this as the moment I let something real end.",
  "You still matter to me. That sentence is the whole story.",
  "I want to earn back the version of you that trusted me. I know it takes time.",
  "The door you're still holding open - I want to walk through it.",
  "Tell me what slowly looks like to you. I'll match it.",
  "I'm asking you to give this one more chapter before you write the ending.",
  "You said you'd try. I'm saying I will too. Let's mean it.",
  "Whatever has broken - I want to be part of fixing it. Not fixing it for you. With you."
];

const P3_AGGR = [
  "Maybe this is just how things end.",
  "I can't keep trying if you've already decided.",
  "Then maybe we want different things.",
  "I'm tired of feeling like I'm never enough.",
  "If that's how you feel, I can't change that.",
  "So this is it then.",
  "You've made your decision. I can see that.",
  "There's nothing I can say that you'll accept right now.",
  "I don't know what you want from me.",
  "Fine. If that's the version of this you want.",
  "I'm not going to keep proving myself to you.",
  "You've already written this off. I don't know why we're talking.",
  "Maybe you're right. Maybe this has run its course.",
  "I'm not going to chase something that doesn't want to be caught.",
  "If you're done, just say it plainly.",
  "You're speaking in past tense. That tells me everything.",
  "I gave a lot to this too. You don't see that.",
  "I'm not going to beg.",
  "Maybe what we were isn't something we can get back.",
  "I don't know what you need me to say.",
  "You've decided this already. I can tell.",
  "Then stop talking to me like there's still something here.",
  "You're protecting yourself. I get it. But so am I.",
  "If this is goodbye, just say goodbye.",
  "I'm tired of being in this uncertain space.",
  "Maybe some things just don't recover.",
  "I've tried. I don't know what else I can do.",
  "This hurts. But if you need to go, go.",
  "You've been letting go for a while. I just didn't see it.",
  "Fine. Then we're done.",
  "I'm not sure there's anything left to save here.",
  "You've been pulling away for months. This just makes it official.",
  "I can see it in the way you're talking. You've already left.",
  "I don't want to keep pretending there's something to fight for.",
  "Maybe the version of this that worked is gone.",
  "I'm not going to keep showing up for something that isn't there.",
  "You're asking me to rebuild something while you're still deciding whether to stay.",
  "That's a very honest thing to say. I guess I respect it.",
  "I can't keep making myself available for someone who's this uncertain.",
  "If you need more time - that's fine. But I'm not going to wait indefinitely.",
  "I've put a lot into this. I'm tired of feeling like it doesn't register.",
  "You keep saying slowly like it's a promise. It sounds more like a goodbye.",
  "I don't know if I have the energy left to start over.",
  "Maybe we've grown into different people and that's no one's fault.",
  "I'm not angry. I'm just exhausted from trying to hold this together alone.",
  "You're honest when you say you're unsure. I'm honest when I say that hurts.",
  "I think we both know where this is going.",
  "I can't want this more than you do. That's not how it works.",
  "If you're still deciding, I think you've already decided.",
  "I'm not going to fight for something you're already letting go of.",
  "I guess at some point two people just stop aligning. Maybe that's us.",
  "Saying slowly doesn't make it less of an ending.",
  "I've been holding on to something you're already further from than I realized.",
  "You can be honest with me. If this is over, I'd rather know.",
  "I don't need it to be dramatic. If it's done, it's done.",
  "I think I've been more invested in this than you have for a while.",
  "I'm not the person who keeps trying when the other person has checked out.",
  "Maybe we should just acknowledge what this already is.",
  "It's okay. Not everything lasts. I understand that.",
  "I'm releasing you from this. If that's what you need, take it."
];

const P3_SILE = [
  "...",
  "[can't find the words]",
  "[a silence that goes on too long]",
  "[nods once]",
  "[looks at them for a moment, then away]",
  "[doesn't respond]",
  "Yeah.",
  "[the air between them is still]",
  "[quietly] Okay.",
  "[eyes close briefly]",
  "[sits with it]",
  "[shakes head slightly]",
  "[the silence is an answer]",
  "[doesn't move for a long moment]",
  "Mm.",
  "[stares at nothing]",
  "[hands in lap, still]",
  "[the weight of it settles]",
  "[no response]",
  "[a breath, then nothing]",
  "[doesn't look up]",
  "[the conversation ends without an ending]",
  "...",
  "[something passes across their face]",
  "[lets out a slow breath]",
  "[doesn't disagree]",
  "[long pause, then nothing]",
  "[remains very still]",
  "[leans back, says nothing]",
  "[a long quiet before answering]",
  "[the pause stretches]",
  "[quietly] I need a minute.",
  "[nothing comes out]",
  "[stares at the floor for a long time]",
  "[swallows, still silent]",
  "[looks away slowly]",
  "[the pause itself is a response]",
  "[closes their eyes for a moment]",
  "I don't have an answer to that right now.",
  "[the silence between them fills the room]",
  "[nods, barely]",
  "[doesn't speak for a very long time]",
  "I'll have to think about that.",
  "[slowly sets the phone down]",
  "[stays very quiet]"
];

// ─── Scenarios (23 Hani dialogues, mirrors buildScenarios() in C++) ─────────

const SCENARIOS = [
  { hani: "Hey. You free this evening? I found that old photo. The one from the roof.", subtext: "(He's been looking at it for twenty minutes before texting. He won't say that.)", conflict: "Dismissing a memory", salvation: false },
  { hani: "I was just cleaning up and it came up. We looked so - I don't know. Less complicated.", subtext: "(He almost said 'happy'. He stopped himself. He doesn't know why.)", conflict: "Invalidating nostalgia", salvation: false },
  { hani: "I called you three times last week. You picked up once, said you'd call back in five minutes. That was three weeks ago.", subtext: "(He counted. He wasn't going to say that. He just did.)", conflict: "Being called out on absence", salvation: true },
  { hani: "It's not about the calls. I don't need you to call me every day. I just - when I actually reach out, I want it to mean something.", subtext: "(He's been rehearsing this. Not the words - the courage to say them.)", conflict: "Minimizing his need", salvation: true },
  { hani: "Do you remember what you said the last time we actually talked - properly talked? You said things were going to be different.", subtext: "(He believed it when she said it. That's the part that hurts.)", conflict: "Broken promise unaddressed", salvation: false },
  { hani: "I'm not trying to make you feel bad. I just think I've been pretending everything is fine for a while now. And it's - tiring.", subtext: "(He's been waiting to say this. Not to punish her. Just to stop carrying it alone.)", conflict: "Deflecting his honesty", salvation: true },
  { hani: "I think I've been lonely. Not in general. Specifically when I'm talking to you.", subtext: "(He said it. He didn't plan to say it today. He can't take it back.)", conflict: "Contradicting his experience", salvation: true },
  { hani: "I used to tell you things I didn't tell anyone else. I stopped. I'm not sure exactly when.", subtext: "(He knows exactly when. He's protecting her from knowing.)", conflict: "Dismissing trust erosion", salvation: false },
  { hani: "There was a night - I don't remember the exact date - where I was genuinely not okay. And I opened your chat and just closed it again.", subtext: "(That night was six months ago. He remembers the exact date.)", conflict: "Blaming him for his own silence", salvation: true },
  { hani: "Because I'd done it before. Reached out. And you were - you were there, but not there. Physically responding, emotionally somewhere else.", subtext: "(He's never said this to anyone. He's terrified she's going to get defensive.)", conflict: "Defending unavailability", salvation: false },
  { hani: "I'm not asking for 24/7. I'm asking for the one time I actually needed you. Just that one time.", subtext: "(He's shaking slightly. He's kept this in for a very long time.)", conflict: "Minimizing a specific wound", salvation: true },
  { hani: "The thing is - I still wanted to talk to you. After everything. That's what I can't explain.", subtext: "(He's trying to say: I still chose you. He doesn't know if that's strength or stupidity.)", conflict: "Missing the weight of his loyalty", salvation: false },
  { hani: "I just need to know if this is still something you're invested in. Because I can't keep guessing.", subtext: "(He's asked himself this question fifty times. He's finally asking her.)", conflict: "Demanding proof without giving it", salvation: true },
  { hani: "Because I stopped assuming. That's what happens when things shift and no one acknowledges it.", subtext: "(He's watched too many people leave without ever saying they were leaving.)", conflict: "Excusing drift as inevitable", salvation: false },
  { hani: "I just - I wish you'd told me you were drifting instead of making me feel like I was imagining it.", subtext: "(He felt crazy for a while. He's only recently understood he wasn't.)", conflict: "Gaslighting response", salvation: true },
  { hani: "What would it take. Actually. For this to be what it used to be.", subtext: "(He doesn't think it's possible. He's asking anyway. For closure if nothing else.)", conflict: "Closing the door on repair", salvation: true },
  { hani: "I'm not sure I believe that anymore. Not because of you - because of how many times I've believed it.", subtext: "(He's not angry. He's tired. That's worse.)", conflict: "Confirming hopelessness", salvation: false },
  { hani: "Maybe some friendships just have a natural end. Maybe this is it.", subtext: "(He doesn't believe this. He's testing if she does.)", conflict: "Accepting dissolution", salvation: true },
  { hani: "You know what I keep thinking about? That moment on the roof. Before all of this. We didn't need to say anything.", subtext: "(He's grieving something that is still technically alive.)", conflict: "Erasing the memory", salvation: false },
  { hani: "I'm going to be honest. If we stop talking now - I don't think I'd reach out again. I've done the reaching.", subtext: "(He means it. He's not saying it to hurt her. He's saying it so she understands the weight.)", conflict: "Conceding the loss", salvation: true },
  { hani: "I want to believe you. I genuinely do. I just don't know how much of that is hope and how much is habit.", subtext: "(He's distinguishing between them for the first time. It scares him.)", conflict: "Dismissing his doubt", salvation: false },
  { hani: "Okay. I'll try. But I need you to understand - I'm not the same person I was when we started. Some of that is gone.", subtext: "(He's giving her one last opening. He doesn't know if she'll walk through it.)", conflict: "Acknowledging change without engaging", salvation: true },
  { hani: "Then - okay. Let's try. But slowly. I can't do another fall.", subtext: "(He means: I can't survive losing this twice.)", conflict: "Final rejection", salvation: true }
];

// ─── Scenario 2: Ayla & Reza (ex-couple trying friendship) ──────────────────
const SCENARIOS_REZA = [
  { hani: "Hey. Thanks for agreeing to meet. I wasn't sure you would.", subtext: "(He's been rehearsing this moment for three weeks. He didn't expect her to actually say yes.)", conflict: "Dismissing his gratitude", salvation: false },
  { hani: "I know this is weird. I'm not going to pretend it isn't.", subtext: "(He's trying to name the awkwardness before she can use it against him.)", conflict: "Weaponizing the awkwardness", salvation: false },
  { hani: "I've been thinking about a lot of things. Not about us — about how I handled things. I think I owe you an honest conversation.", subtext: "(He's been journaling about this for months. He won't say that.)", conflict: "Dismissing his accountability", salvation: true },
  { hani: "You were always better at remembering the good parts. I'd get stuck in what wasn't working. I think that was unfair.", subtext: "(He's said this to a therapist already. This is the first time he's said it to her.)", conflict: "Minimizing his acknowledgment", salvation: true },
  { hani: "I don't want to reopen everything. I just — I missed talking to you. Not the way we were. Just — talking.", subtext: "(He's terrified this sounds like he wants her back. He doesn't. He thinks.)", conflict: "Misreading his intention", salvation: false },
  { hani: "You were my best friend before everything else. I think I forgot that. I think we both did.", subtext: "(He's not sure she sees it this way. He hopes she does.)", conflict: "Denying the friendship foundation", salvation: true },
  { hani: "Can I ask you something? And you don't have to answer if you don't want to.", subtext: "(He has a specific question. He's been building to it since they sat down.)", conflict: "Shutting down the question", salvation: false },
  { hani: "Were you okay? After. Because I told myself you were, and I'm not sure I actually checked.", subtext: "(He didn't check. He knows that. He's saying it because the guilt became too loud.)", conflict: "Dismissing his concern as guilt", salvation: true },
  { hani: "I think I made myself into the villain in the story because it was easier than admitting I just — stopped knowing how to be with you.", subtext: "(This is the most honest he's been with anyone about this. His hands are steady but his voice isn't.)", conflict: "Using his honesty against him", salvation: true },
  { hani: "I'm not asking you to forgive me. I'm not even sure that's the right word for what I'm asking.", subtext: "(He went through four different words before this conversation. Forgive. Understand. Release. None of them fit.)", conflict: "Demanding clarity he can't give", salvation: false },
  { hani: "There were things I should have said while it was still something I could fix. I didn't. That's on me.", subtext: "(He had the conversations in his head a hundred times. They never made it out.)", conflict: "Refusing to acknowledge the gap", salvation: true },
  { hani: "I'm not the same person who ended things. I don't know if that matters to you. I think it matters to me.", subtext: "(He's been in therapy for seven months. He hasn't told anyone that either.)", conflict: "Dismissing his growth", salvation: false },
  { hani: "I keep thinking about that drive back from the mountains. We didn't talk the whole two hours and it wasn't uncomfortable. I miss that.", subtext: "(He's shared this memory with no one. He's been protecting it.)", conflict: "Turning the memory into a weapon", salvation: true },
  { hani: "I'm not trying to make this about what we were. I'm trying to figure out what we could still be.", subtext: "(He means it. He's not romanticizing it. He's genuinely asking.)", conflict: "Collapsing the distinction", salvation: false },
  { hani: "I think you're still angry. Which is fair. I just want to know if there's space underneath that for something else.", subtext: "(He can read her. He always could. That's part of what made it hard.)", conflict: "Denying the anger or weaponizing it", salvation: true },
  { hani: "Because I don't want to keep carrying the version of this that ended badly as the only version I have of us.", subtext: "(He's been carrying it. It's heavier than he expected.)", conflict: "Refusing to offer a different version", salvation: true },
  { hani: "Okay. I hear you. I think what I'm understanding is that maybe I'm not the only one who still needs to figure some things out.", subtext: "(He's not accusing. He's observing. The difference matters to him.)", conflict: "Taking it as an accusation", salvation: false },
  { hani: "I didn't come here to fight. I came here because I thought we were both tired of the version of this that's been playing on loop.", subtext: "(He's right. He knows he's right. He's waiting to see if she does too.)", conflict: "Continuing the loop", salvation: true },
  { hani: "I think friendship is possible. But not if one of us is still hoping for something the other one can't give.", subtext: "(He's talking about her. He's also a little bit talking about himself.)", conflict: "Refusing to name what you're hoping for", salvation: true },
  { hani: "Say it. Whatever you're not saying. I'd rather have the real conversation than this one.", subtext: "(He's been watching her hold something back since they sat down.)", conflict: "Continuing to hold back", salvation: true },
  { hani: "I think we're both scared of what happens if we're completely honest. But I think we're more scared of staying stuck here.", subtext: "(He made a decision before this meeting: he would rather lose her clearly than keep her vaguely.)", conflict: "Choosing vagueness", salvation: false },
  { hani: "I still think about you as someone I can call when something important happens. I don't know if that's earned yet. I'm asking if we can earn it back.", subtext: "(He's offering something real. He doesn't know if she'll take it.)", conflict: "Dismissing the offer", salvation: true },
  { hani: "Then — okay. I'm not going anywhere. Neither are you, apparently. So — let's just see what this actually is.", subtext: "(He's terrified and relieved in equal measure. He doesn't let either show.)", conflict: "Final withdrawal", salvation: true }
];

// ─── Scenario registry ───────────────────────────────────────────────────────
const ALL_SCENARIOS = {
  hani: SCENARIOS,
  reza: SCENARIOS_REZA
};

const SCENARIO_META = {
  hani: {
    id: 'hani', character: 'Hani', you: 'Umm-e-Laila',
    title: 'Umm-e-Laila & Hani',
    relationship: 'Best Friends',
    description: 'A friendship that slowly lost its footing. You have 23 moves to find it again — or understand why you couldn\'t.',
    cardAtRisk: 'PRESENCE',
    difficulty: 'Medium',
    accent: '#C678DD',
    emoji: '🫂'
  },
  reza: {
    id: 'reza', character: 'Reza', you: 'Ayla',
    title: 'Ayla & Reza',
    relationship: 'Ex-couple → Trying Friendship',
    description: 'He ended it 8 months ago. Now he wants to be friends. You have 23 moves to decide what this is — and what it costs.',
    cardAtRisk: 'ROMANCE',
    difficulty: 'Hard',
    accent: '#F0883E',
    emoji: '💔'
  }
};

// ─── Move types ─────────────────────────────────────────────────────────────
const SOFT = 0, AGGRESSIVE = 1, SILENT = 2;

// ─── NeurologicalState (mirrors struct NeurologicalState in C++) ─────────────
class NeurologicalState {
  constructor() {
    this.pfcLoad   = 0.10;
    this.cortisol  = 0.05;
    this.dopamine  = 0.80;
    this.amygdala  = 0.10;
    this.mirrorInt = 0.90;
    this.nli       = 0.0;
    this.computeNLI();
  }
  computeNLI() {
    this.nli = (this.pfcLoad * 0.4) + (this.cortisol * 0.4) + (1.0 - this.dopamine) * 0.2;
    this.nli = Math.max(0.0, Math.min(1.0, this.nli));
    return this.nli;
  }
  applyChoice(type, d = 0.09) {
    if (type === SOFT) {
      // Soft repairs — but much less than damage accumulates. Presence costs energy too.
      this.pfcLoad   = Math.max(0, this.pfcLoad   - d * 0.45);
      this.cortisol  = Math.max(0, this.cortisol  - d * 0.30);
      this.dopamine  = Math.min(1, this.dopamine  + d * 0.55);
      this.amygdala  = Math.max(0, this.amygdala  - d * 0.50);
      this.mirrorInt = Math.min(1, this.mirrorInt + d * 0.40);
    } else if (type === AGGRESSIVE) {
      // Aggressive causes severe neurological damage
      this.pfcLoad   = Math.min(1, this.pfcLoad   + d * 2.8);
      this.cortisol  = Math.min(1, this.cortisol  + d * 2.8);
      this.dopamine  = Math.max(0, this.dopamine  - d * 1.8);
      this.amygdala  = Math.min(1, this.amygdala  + d * 2.5);
      this.mirrorInt = Math.max(0, this.mirrorInt - d * 1.6);
    } else {
      // Silent is deeply damaging — absence is not neutral
      this.pfcLoad   = Math.min(1, this.pfcLoad   + d * 1.6);
      this.cortisol  = Math.min(1, this.cortisol  + d * 2.0);
      this.dopamine  = Math.max(0, this.dopamine  - d * 1.2);
      this.amygdala  = Math.min(1, this.amygdala  + d * 1.0);
      this.mirrorInt = Math.max(0, this.mirrorInt - d * 2.0);
    }
    this.computeNLI();
  }
  getStateLabel() {
    if (this.nli < 0.30) return 'HARMONY';
    if (this.nli < 0.70) return 'FRACTURE';
    if (this.nli < 0.85) return 'COLLAPSE';
    return 'OVERRIDE';
  }
  getStateColor() {
    if (this.nli < 0.30) return '#98C379';
    if (this.nli < 0.70) return '#E5C07B';
    if (this.nli < 0.85) return '#E06C75';
    return '#FF0000';
  }
}

// ─── CollisionStack (mirrors CollisionStack in C++) ──────────────────────────
class CollisionStack {
  constructor() {
    this.items = [];
    this.totalPushes = 0;
    this.totalPops = 0;
    this.popRejections = 0;
    this.maxDepth = 0;
  }
  push(label) {
    if (this.items.length >= 7) return false;
    this.items.push(label);
    this.totalPushes++;
    if (this.items.length > this.maxDepth) this.maxDepth = this.items.length;
    return true;
  }
  pop(nli) {
    if (this.items.length === 0) return false;
    if (nli >= 0.35) { this.popRejections++; return false; } // need to be very calm to resolve
    this.items.pop();
    this.totalPops++;
    return true;
  }
  size() { return this.items.length; }
  overflow() { return this.items.length >= 7; }
  chessPenalty() { return this.items.length * -0.08; }
}

// ─── CardState ───────────────────────────────────────────────────────────────
class CardState {
  constructor() {
    this.devotionIn   = true; this.devotionLost   = -1;
    this.excitementIn = true; this.excitementLost = -1;
    this.presenceIn   = true; this.presenceLost   = -1;
  }
  allLost() { return !this.devotionIn && !this.excitementIn && !this.presenceIn; }
  lostCount() {
    return (!this.devotionIn ? 1 : 0) + (!this.excitementIn ? 1 : 0) + (!this.presenceIn ? 1 : 0);
  }
}

// ─── FriendshipDAG (simplified Dijkstra mirror) ──────────────────────────────
class FriendshipDAG {
  constructor() {
    this.N = 22;
    this.labels = [
      "Origin","First Laugh","The Quiet Walk","Library Morning",
      "Late Night Call","Birthday Message","First Argument",
      "Apology Accepted","The Shared Secret","Distance Begins",
      "Unanswered Text","Awkward Silence","Last Good Day",
      "The Confession","The Misread","Defensive Wall",
      "The Apology Refused","Ghosted Weekend","Final Reach Out",
      "The Waiting Room","Decoupling Point","Exit"
    ];
    this.locked = new Array(22).fill(false);
    this.leaked = new Array(22).fill(false);
    this.lockedCount = 0; this.leakedCount = 0;
    this.dijkstraCalls = 0; this.edgeDegradations = 0;
    this.lastExitDist = 999;
    this.adj = Array.from({length:22}, () => []);
    const ae = (u,v,w) => this.adj[u].push({to:v, val:w});
    ae(0,1,+.9);ae(0,2,+.7);ae(1,3,+.8);ae(1,4,+.6);ae(2,3,+.5);ae(2,5,+.4);
    ae(3,6,+.3);ae(3,7,+.6);ae(4,5,+.7);ae(4,8,+.5);ae(5,8,+.4);ae(5,9,-.2);
    ae(6,9,-.4);ae(6,10,-.6);ae(7,10,+.2);ae(7,11,+.1);ae(8,11,+.3);ae(8,12,+.5);
    ae(9,12,-.3);ae(9,13,-.1);ae(10,13,-.5);ae(10,14,-.4);ae(11,14,+.1);ae(11,15,-.2);
    ae(12,15,+.2);ae(12,16,-.3);ae(13,16,-.6);ae(13,17,-.5);ae(14,17,-.4);ae(14,18,-.6);
    ae(15,18,-.2);ae(15,19,-.3);ae(16,19,-.7);ae(16,20,-.8);ae(17,20,-.6);ae(17,21,-.9);
    ae(18,21,-.7);ae(19,21,-.8);ae(20,21,-1.0);
  }
  edgeCost(v) { return Math.max(0, 1.0 + v); }
  degradeEdges(d) { for (const row of this.adj) for (const e of row) { e.val = Math.max(-1.0, e.val - d); this.edgeDegradations++; } }
  recoverEdges(d) { for (const row of this.adj) for (const e of row) e.val = Math.min(1.0, e.val + d); }
  lockNodes(pfcLoad) {
    const toLock = Math.floor(pfcLoad * 4);
    let cnt = 0;
    for (let i = this.N-1; i >= 0 && cnt < toLock; i--)
      if (!this.locked[i] && !this.leaked[i]) { this.locked[i]=true; this.lockedCount++; cnt++; }
  }
  lockDevotionNodes() {
    let c=0;
    for (let i=1; i<this.N && c<6; i++)
      if (!this.locked[i]) { this.locked[i]=true; this.lockedCount++; c++; }
  }
  severExcitementBridges() { for (const b of [7,8,11,12]) this.adj[b]=[]; }
  dijkstra() {
    this.dijkstraCalls++;
    const INF = 1e9;
    const dist = new Array(this.N).fill(INF);
    dist[0] = 0;
    // Simple priority queue with array (small graph, acceptable)
    const pq = [{d:0, u:0}];
    while (pq.length) {
      // O(n) min extraction — faster than full sort for this tiny graph
      let minI = 0;
      for (let k = 1; k < pq.length; k++) if (pq[k].d < pq[minI].d) minI = k;
      const {d, u} = pq[minI]; pq.splice(minI, 1);
      if (d > dist[u] || this.locked[u]) continue;
      for (const e of this.adj[u]) {
        if (this.locked[e.to]) continue;
        const nd = dist[u] + this.edgeCost(e.val);
        if (nd < dist[e.to]) { dist[e.to]=nd; pq.push({d:nd, u:e.to}); }
      }
    }
    this.lastExitDist = dist[this.N-1];
    return this.lastExitDist;
  }
  reachableCount() { return this.locked.filter((l,i)=>!l&&!this.leaked[i]).length; }
}

// ─── HaniChessEngine (mirrors HaniChessEngine in C++) ────────────────────────
class HaniChessEngine {
  constructor() {
    this.game = [
      {w:"e4",b:"e5",wp:"Pawn",br:"mirror center"},
      {w:"f4",b:"exf4",wp:"Pawn",br:"gambit accepted"},
      {w:"Bc4",b:"Qh4+",wp:"Bishop",br:"queen enters with check"},
      {w:"Kf1",b:"b5",wp:"King",br:"queenside flank thrust"},
      {w:"Bxb5",b:"Nf6",wp:"Bishop",br:"knight pressures queen"},
      {w:"Nf3",b:"Qh6",wp:"Knight",br:"queen repositions"},
      {w:"d3",b:"Nh5",wp:"Pawn",br:"knight advances to rim"},
      {w:"Nh4",b:"Qg5",wp:"Knight",br:"queen holds center"},
      {w:"Nf5",b:"c6",wp:"Knight",br:"pawn challenges knight"},
      {w:"g4",b:"Nf6",wp:"Pawn",br:"knight forced back"},
      {w:"Rg1",b:"cxb5",wp:"Rook",br:"pawn recapture"},
      {w:"h4",b:"Qg6",wp:"Pawn",br:"queen sidesteps"},
      {w:"h5",b:"Qg5",wp:"Pawn",br:"queen holds position"},
      {w:"Qf3",b:"Ng8",wp:"Queen",br:"knight retreats - lost tempo"},
      {w:"Bxf4",b:"Qf6",wp:"Bishop",br:"queen activates"},
      {w:"Nc3",b:"Bc5",wp:"Knight",br:"bishop joins attack"},
      {w:"Nd5",b:"Qxb2",wp:"Knight",br:"queen raids queenside"},
      {w:"Bd6",b:"Bxg1",wp:"Bishop",br:"exchange sacrifice"},
      {w:"e5",b:"Qxa1+",wp:"Pawn",br:"queen delivers check"},
      {w:"Ke2",b:"Na6",wp:"King",br:"knight enters the board"},
      {w:"Nxg7+",b:"Kd8",wp:"Knight",br:"king forced to flee"},
      {w:"Qf6+",b:"Nxf6",wp:"Queen",br:"knight interposes"},
      {w:"Be7#",b:"",wp:"Bishop",br:"CHECKMATE - bishop delivers finality"}
    ];
    this.moveIndex = 0;
    this.positionEval = 0;
    this.totalMoves = 0;
    this.amygdalaOverrides = 0;
    this.softCount = 0; this.aggressiveCount = 0; this.silentCount = 0;
  }
  minimax(base, depth, maximizing) {
    if (depth === 0) return base;
    return maximizing ? this.minimax(base+0.18, depth-1, false) : this.minimax(base-0.16, depth-1, true);
  }
  respond(choiceType, nli, stackPenalty) {
    this.totalMoves++;
    let eff = choiceType;
    if (nli >= 0.72) { eff = AGGRESSIVE; this.amygdalaOverrides++; } // override triggers earlier
    const idx = Math.min(this.moveIndex, 22);
    const mv = this.game[idx];
    let base = this.positionEval;
    let wr = '';
    if (eff === SOFT) {
      wr = 'controlled, deliberate'; this.softCount++;
      this.positionEval = this.minimax(base+0.06, 2, false) + stackPenalty; // softer gains
    } else if (eff === AGGRESSIVE) {
      wr = 'sharp, tactical'; this.aggressiveCount++;
      this.positionEval = this.minimax(base-0.55-(nli>=0.72?0.60:0), 2, true) + stackPenalty; // much heavier penalty
    } else {
      wr = 'passive, tempo loss'; this.silentCount++;
      this.positionEval = this.minimax(base-0.28, 2, false) + stackPenalty; // silence hurts more
    }
    this.positionEval = Math.max(-9.99, Math.min(9.99, this.positionEval));
    this.moveIndex++;
    return { ...mv, wr, eval: this.positionEval };
  }
  isCheckmate() { return this.positionEval <= -3.5; } // triggers much sooner
  evalLabel() {
    if (this.positionEval > 2.0)  return 'comfortable';
    if (this.positionEval > 0.5)  return 'slight edge';
    if (this.positionEval > -0.5) return 'balanced';
    if (this.positionEval > -2.0) return 'losing';
    if (this.positionEval > -5.0) return 'critical';
    return 'TERMINAL';
  }
}

// ─── Terminal Conditions ─────────────────────────────────────────────────────
const TC_NONE=0, TC_SALVATION=1, TC_CHECKMATE=2, TC_AMYGDALA=3,
      TC_STACK_OVERFLOW=4, TC_TRUST_FLOOR=5, TC_ALL_CARDS_LOST=6, TC_MAX_MOVES=7,
      TC_FLATLINE=8; // Conversation died from silence/disengagement — not conflict

function checkTerminal(cards, chess, ns, stack, trust, move) {
  if (cards.allLost())             return TC_ALL_CARDS_LOST;
  if (ns.nli >= 0.75)              return TC_AMYGDALA;   // triggers at 0.75 not 0.80
  if (stack.overflow())            return TC_STACK_OVERFLOW;
  if (trust < 0.28)                return TC_TRUST_FLOOR; // higher floor
  if (chess.isCheckmate())         return TC_CHECKMATE;
  if (move >= 23)                  return cards.lostCount() === 0 ? TC_SALVATION : TC_MAX_MOVES;
  return TC_NONE;
}

// ─── Main simulation class ───────────────────────────────────────────────────
class LostCardSim {
  constructor(scenarioId = 'hani') {
    this.scenarioId = scenarioId;
    this._scenes    = ALL_SCENARIOS[scenarioId] || SCENARIOS;
    this._meta      = SCENARIO_META[scenarioId] || SCENARIO_META.hani;
    this.reset();
  }

  reset() {
    this.ns     = new NeurologicalState();
    this.stack  = new CollisionStack();
    this.cards  = new CardState();
    this.dag    = new FriendshipDAG();
    this.chess  = new HaniChessEngine();
    this.trust  = 0.80;
    this.move   = 0;
    this.silentTotal      = 0;
    this.softTotal        = 0;
    this.softConsec       = 0;
    this.aggressiveConsec = 0;
    this.highNliConsec    = 0;
    this.phaseLog        = ['HARMONY'];
    this.terminalCondition = TC_NONE;
    this.lostMemories    = [];
    this.moveHistory     = [];
  }

  getChoices() {
    const phase = this.move < 6 ? 0 : this.move < 16 ? 1 : 2;
    const pools = [[P1_SOFT,P1_AGGR,P1_SILE],[P2_SOFT,P2_AGGR,P2_SILE],[P3_SOFT,P3_AGGR,P3_SILE]];
    const [sp, ap, np] = pools[phase];
    const ri = (arr) => Math.floor(Math.random() * arr.length);
    let choices = [
      { text: sp[ri(sp)], type: SOFT },
      { text: ap[ri(ap)], type: AGGRESSIVE },
      { text: np[ri(np)], type: SILENT }
    ];
    // Shuffle (mirrors std::shuffle in C++)
    for (let i = choices.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }

  getCurrentScenario() { return this._scenes[Math.min(this.move, 22)]; }

  processMove(choiceType) {
    if (this.terminalCondition !== TC_NONE) return null;
    const sc = this._scenes[this.move];
    const result = { move: this.move+1, choiceType, scenario: sc, events: [], cardDrops: [] };

    // Chess engine
    const chessResult = this.chess.respond(choiceType, this.ns.nli, this.stack.chessPenalty());
    result.chess = chessResult;

    // DAG updates
    if (choiceType === AGGRESSIVE)    this.dag.degradeEdges(0.06);
    else if (choiceType === SILENT)   this.dag.degradeEdges(0.04);
    else                              this.dag.recoverEdges(0.03);
    this.dag.lockNodes(this.ns.pfcLoad);
    this.dag.dijkstra();

    // Trust — drops hard, barely repairs
    if (choiceType === SOFT)          this.trust = Math.min(1, this.trust + 0.01);
    else if (choiceType===AGGRESSIVE) this.trust = Math.max(0, this.trust - 0.14);
    else                              this.trust = Math.max(0, this.trust - 0.08);

    // Passive neurological cost — compounds with each move (relationship strain is cumulative)
    const passiveMult = 1 + (this.move * 0.04); // gets worse each move
    this.ns.pfcLoad  = Math.min(1, this.ns.pfcLoad  + 0.022 * passiveMult);
    this.ns.cortisol = Math.min(1, this.ns.cortisol + 0.018 * passiveMult);
    this.ns.computeNLI();

    // Stack — silent moves also push conflict
    if (choiceType === AGGRESSIVE || choiceType === SILENT) this.stack.push(sc.conflict);
    else this.stack.pop(this.ns.nli);

    // Neurological
    this.ns.applyChoice(choiceType);

    // Counters
    if (choiceType === SOFT) {
      this.softConsec++;
      this.softTotal++;
      this.aggressiveConsec = 0;
    } else if (choiceType === AGGRESSIVE) {
      this.aggressiveConsec++;
      this.softConsec = 0;
    } else {
      this.silentTotal++;
      this.softConsec = 0;
      this.aggressiveConsec = 0;
    }
    if (this.ns.nli > 0.62)  this.highNliConsec++;
    else                      this.highNliConsec = 0;

    // FSM phase
    const prevLabel = this.phaseLog[this.phaseLog.length-1];
    const newLabel  = this.ns.getStateLabel();
    if (newLabel !== prevLabel) this.phaseLog.push(newLabel);

    // ── Card drop checks ─────────────────────────────────────────────
    if (this.cards.devotionIn) {
      // d1: low-NLI aggression = habitual aggression (coldest form)
      const d1 = (choiceType === AGGRESSIVE && this.ns.nli < 0.55);
      // d2: trust already eroding while dopamine still high = emotional blindspot
      const d2 = (this.trust < 0.70 && this.ns.dopamine > 0.48);
      // d3: over-investment — 5 consecutive soft moves = losing yourself in the relationship
      const d3 = (this.softConsec >= 5);
      // d4: staying soft while trust is very low = devotion without foundation
      const d4 = (choiceType === SOFT && this.trust < 0.45 && this.move >= 4);
      if (d1 || d2 || d3 || d4) {
        this.cards.devotionIn = false;
        this.cards.devotionLost = this.move+1;
        this.dag.lockDevotionNodes();
        this.lostMemories.push(this.dag.labels[3]);
        result.cardDrops.push({
          card:'DEVOTION', color:'#C678DD', move:this.move+1,
          reason: d3 ? "Five consecutive soft moves. You over-invested before the foundation could hold it."
                     : d4 ? "You kept giving while trust had already collapsed. Devotion without foundation breaks first."
                     : d1 ? "Low-stress aggression. You hurt without pressure — that is habit, not reaction."
                           : "Dopamine high while trust eroded. The blindspot closed before you noticed."
        });
      }
    }
    if (this.cards.excitementIn) {
      // d1: 2+ unresolved conflicts AND aggression
      const d1 = (this.stack.size() >= 2 && choiceType === AGGRESSIVE);
      // d2: consecutive aggression
      const d2 = (this.aggressiveConsec >= 2);
      // d3: high NLI aggression — stress turns excitement into reactivity
      const d3 = (this.ns.nli > 0.55 && choiceType === AGGRESSIVE);
      if (d1 || d2 || d3) {
        this.cards.excitementIn = false;
        this.cards.excitementLost = this.move+1;
        this.dag.severExcitementBridges();
        this.lostMemories.push(this.dag.labels[4]);
        result.cardDrops.push({
          card:'EXCITEMENT', color:'#56B6C2', move:this.move+1,
          reason: d2 ? "Two consecutive aggressive moves. Impulse fully replaced judgment."
                     : d3 ? "Aggression under stress. Excitement became pure reactivity — there was nothing left to engage with."
                           : "Two unresolved conflicts met another aggressive move. The stack tipped."
        });
      }
    }
    if (this.cards.presenceIn) {
      // d1: 2 silent moves total = withdrawal pattern established
      const d1 = (this.silentTotal >= 2);
      // d2: 2 consecutive high-NLI moves = sustained overload kills availability
      const d2 = (this.highNliConsec >= 2);
      // d3: NLI above collapse threshold = can't be present when overwhelmed
      const d3 = (this.ns.nli >= 0.70 && this.move >= 3);
      if (d1 || d2 || d3) {
        this.cards.presenceIn = false;
        this.cards.presenceLost = this.move+1;
        this.lostMemories.push(this.dag.labels[4]);
        result.cardDrops.push({
          card:'PRESENCE', color:'#98C379', move:this.move+1,
          reason: d1 ? "Two silences. You were physically there — psychologically you had already left."
                     : d3 ? "NLI crossed 0.70. When the nervous system is in collapse, presence is physically impossible."
                           : "Two consecutive moves under extreme neurological load. Presence cannot exist under that weight."
        });
      }
    }

    result.nli      = this.ns.nli;
    result.trust    = this.trust;
    result.state    = this.ns.getStateLabel();
    result.stateColor = this.ns.getStateColor();
    result.cards    = { ...this.cards };
    result.stackSize = this.stack.size();
    result.exitDist  = this.dag.lastExitDist;

    this.move++;
    this.moveHistory.push(result);

    // Periodic memory leak
    if (this.move % 7 === 0 && this.move > 0) {
      for (let i=1; i<this.dag.N-1; i++) {
        if (!this.dag.locked[i] && !this.dag.leaked[i] && i>0 && i<10) {
          this.dag.leaked[i]=true;
          this.dag.leakedCount++;
          this.lostMemories.push(this.dag.labels[i]);
          break;
        }
      }
    }

    // Terminal check
    const tc = checkTerminal(this.cards, this.chess, this.ns, this.stack, this.trust, this.move);
    if (tc !== TC_NONE) {
      this.terminalCondition = tc;
      result.terminal = tc;
      result.terminalLabel = this.getTerminalLabel(tc);
      result.terminalMessage = this.getTerminalMessage(tc);
    }

    return result;
  }

  getTerminalLabel(tc) {
    switch(tc) {
      case TC_SALVATION:     return 'HAND FULL - ALL CARDS INTACT';
      case TC_CHECKMATE:     return 'CHECKMATE - THE GAME IS OVER';
      case TC_AMYGDALA:      return 'AMYGDALA OVERRIDE - RATIONAL MIND OFFLINE';
      case TC_STACK_OVERFLOW:return 'CORTISOL BUFFER FULL - STACK OVERFLOW';
      case TC_TRUST_FLOOR:   return 'TRUST FLOOR REACHED';
      case TC_ALL_CARDS_LOST:return 'HAND EMPTY - ALL CARDS LOST';
      case TC_MAX_MOVES:     return '23 MOVES COMPLETE';
      default: return '';
    }
  }

  getTerminalMessage(tc) {
    switch(tc) {
      case TC_SALVATION:     return 'You kept every card.\nProbability: 0.0000001.';
      case TC_CHECKMATE:     return 'Final move: Be7#\nThe bishop delivers the last blow.\nThe Immortal Game ends. So does this.';
      case TC_AMYGDALA:      return 'NLI exceeded 0.850. The prefrontal cortex went dark.\nYour last choice was not your choice.';
      case TC_STACK_OVERFLOW:return '7 unresolved conflicts. The stack cannot hold more.\nThe relationship collapsed under accumulated weight.';
      case TC_TRUST_FLOOR:   return 'Trust dropped below 0.15. The shortest path to decoupling is one move.';
      case TC_ALL_CARDS_LOST:return 'The game was played. No cards remain.\nThe relationship did not end because of one mistake.\nIt ended because the manual was lost long before the last move.';
      case TC_MAX_MOVES:     return `You played all 23 moves. ${this.cards.lostCount()} card(s) lost.`;
      default: return '';
    }
  }

  isOver() { return this.terminalCondition !== TC_NONE; }

  getSessionSummary() {
    return {
      outcome: this.getTerminalLabel(this.terminalCondition),
      moves: this.move,
      cardsLost: this.cards.lostCount(),
      devotion: this.cards.devotionIn ? 'RETAINED' : `LOST at Move ${this.cards.devotionLost}`,
      excitement: this.cards.excitementIn ? 'RETAINED' : `LOST at Move ${this.cards.excitementLost}`,
      presence: this.cards.presenceIn ? 'RETAINED' : `LOST at Move ${this.cards.presenceLost}`,
      finalNLI: this.ns.nli.toFixed(3),
      finalTrust: this.trust.toFixed(3),
      finalState: this.ns.getStateLabel(),
      phaseLog: this.phaseLog,
      stackMaxDepth: this.stack.maxDepth,
      chessEval: this.chess.positionEval.toFixed(2),
      amygdalaOverrides: this.chess.amygdalaOverrides,
      lostMemories: this.lostMemories,
      terminalCondition: this.terminalCondition,
      moveLog: this.moveHistory.map(r => ({
        move: r.move,
        type: r.choiceType === 0 ? 'SOFT' : r.choiceType === 1 ? 'AGGRESSIVE' : 'SILENT',
        nli:   (r.nli   ?? 0).toFixed(3),
        trust: (r.trust ?? 0).toFixed(3),
        state: r.state,
        cards: r.cardDrops?.length ? r.cardDrops.map(c => `${c.card} LOST`).join(', ') : '',
        chess: r.chess?.w ? `${r.chess.w}/${r.chess.b||'…'}` : ''
      }))
    };
  }
}
