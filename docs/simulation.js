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
  { hani: "Hey. You free this evening? I found that old photo. The one from the roof.", subtext: "(He's been looking at it for twenty minutes before texting. He won't say that.)", conflict: "Dismissing a memory", salvation: false,
    soft: ["The roof. I haven't thought about that night in years. Send it?", "Yeah, I'm free. And honestly… I'd really like to see it.", "God, the roof one. We were so young. Send it, I want to see our faces."],
    aggressive: ["Why are you going through old photos right now?", "Kind of swamped tonight. Everything okay though?", "That was forever ago. What made you think of it?"],
    silent: ["Oh. What about it?", "Random. Anyway.", "Maybe. Depends how the night goes."] },

  { hani: "I was just cleaning up and it came up. We looked so - I don't know. Less complicated.", subtext: "(He almost said 'happy'. He stopped himself. He doesn't know why.)", conflict: "Invalidating nostalgia", salvation: false,
    soft: ["We were lighter then. I miss that, more than I let on.", "Less complicated. Yeah. When did everything get so heavy with us?", "We really did look it. What happened to those two, Hani?"],
    aggressive: ["Everyone looks happy in old photos. Don't read into it.", "Things get complicated. That's just life, not some tragedy.", "This is kind of a strange thing to text me about."],
    silent: ["Yeah, I guess.", "Hm.", "People change. It's fine."] },

  { hani: "I called you three times last week. You picked up once, said you'd call back in five minutes. That was three weeks ago.", subtext: "(He counted. He wasn't going to say that. He just did.)", conflict: "Being called out on absence", salvation: true,
    soft: ["You're right. I said five minutes and just… didn't. That wasn't okay.", "Three weeks. God. I didn't even clock it. I'm sorry, Hani.", "I keep leaving you on read in real life, don't I. I hate that I do that."],
    aggressive: ["I've been busy. Not everyone can drop everything to talk.", "Are you actually keeping count of my calls now?", "You could've called back too. It's not all on me."],
    silent: ["Things have been hectic.", "I'll call you this week sometime.", "It slipped my mind, that's all."] },

  { hani: "It's not about the calls. I don't need you to call me every day. I just - when I actually reach out, I want it to mean something.", subtext: "(He's been rehearsing this. Not the words - the courage to say them.)", conflict: "Minimizing his need", salvation: true,
    soft: ["It does mean something. I've just been awful at acting like it.", "You're right. When you reach for me, you should feel caught. You haven't been.", "That's not too much to ask. It's the bare minimum, and I missed it."],
    aggressive: ["That's a lot of weight to put on a phone call.", "So every text has to 'mean something' now? That's exhausting.", "I think you're reading way too much into this."],
    silent: ["Okay.", "I mean… it does, I guess.", "Sure. Noted."] },

  { hani: "Do you remember what you said the last time we actually talked - properly talked? You said things were going to be different.", subtext: "(He believed it when she said it. That's the part that hurts.)", conflict: "Broken promise unaddressed", salvation: false,
    soft: ["I remember. I meant it too. I just… didn't do it. That's on me.", "I said it and then let it slide right back. You believed me. I get why that stings.", "I do remember. And I'm sorry I turned it into just words."],
    aggressive: ["People say things in the moment. You can't hold me to all of it.", "I'm not going to get cross-examined over something from months ago.", "Things did change. Just maybe not how you wanted them to."],
    silent: ["Vaguely.", "Did I? Don't really remember.", "That was ages ago."] },

  { hani: "I'm not trying to make you feel bad. I just think I've been pretending everything is fine for a while now. And it's - tiring.", subtext: "(He's been waiting to say this. Not to punish her. Just to stop carrying it alone.)", conflict: "Deflecting his honesty", salvation: true,
    soft: ["You shouldn't have to perform 'fine' with me of all people. Just tell me.", "You've been holding that by yourself. You don't have to anymore.", "Thank you for actually saying it instead of fading out on me too."],
    aggressive: ["So you've been faking it this whole time. Good to know.", "If it's so tiring, why are you even still here?", "Don't hand me your exhaustion. I never asked you to pretend."],
    silent: ["Okay. That's fair, I suppose.", "Hm. Alright.", "If you say so."] },

  { hani: "I think I've been lonely. Not in general. Specifically when I'm talking to you.", subtext: "(He said it. He didn't plan to say it today. He can't take it back.)", conflict: "Contradicting his experience", salvation: true,
    soft: ["Lonely while you're talking to me. That's… that's a hard thing to hear, and I needed to.", "I've been right here and somehow still left you alone. I'm sorry.", "I never wanted to be the person who made you feel that. Tell me when it started."],
    aggressive: ["How are you lonely when I'm literally talking to you right now?", "That doesn't even make sense, Hani.", "That sounds like something you need to work on, not me."],
    silent: ["That's… a lot.", "Okay.", "I don't really know what to say to that."] },

  { hani: "I used to tell you things I didn't tell anyone else. I stopped. I'm not sure exactly when.", subtext: "(He knows exactly when. He's protecting her from knowing.)", conflict: "Dismissing trust erosion", salvation: false,
    soft: ["You used to. I felt like the one you trusted. I want to be that again.", "You went quiet and I never once asked why. I should have noticed.", "When did you stop? I really want to know what I missed in you."],
    aggressive: ["Maybe you just outgrew oversharing. Happens to everyone.", "You stopped on your own. Don't pin that on me.", "So that's my fault now too? Of course it is."],
    silent: ["People stop sharing. It's normal.", "Huh.", "Didn't really notice, to be honest."] },

  { hani: "There was a night - I don't remember the exact date - where I was genuinely not okay. And I opened your chat and just closed it again.", subtext: "(That night was six months ago. He remembers the exact date.)", conflict: "Blaming him for his own silence", salvation: true,
    soft: ["You needed me and you couldn't even type the message. That's what I did to us. I'm so sorry.", "You opened my name and closed it. God. I made myself that unsafe to reach.", "I wish you'd hit send. But I understand why you couldn't. That part is mine."],
    aggressive: ["Well if you never messaged me, how was I supposed to know?", "You're the one who closed the chat. That's not on me.", "You can't be upset about a text you didn't even send."],
    silent: ["Oh.", "That's rough, I guess.", "You should've just messaged me."] },

  { hani: "Because I'd done it before. Reached out. And you were - you were there, but not there. Physically responding, emotionally somewhere else.", subtext: "(He's never said this to anyone. He's terrified she's going to get defensive.)", conflict: "Defending unavailability", salvation: false,
    soft: ["There but not there. That's exactly what I was. And you felt every bit of it.", "You stopped reaching because I never actually caught you. That's fair.", "I gave you half of me and called it showing up. You deserved the whole thing."],
    aggressive: ["I always answered. What more do you want from me?", "So even when I'm right here it's wrong now? Great.", "Maybe that's just how I am. Take it or leave it."],
    silent: ["I was answering, though.", "Okay.", "I genuinely don't see the difference."] },

  { hani: "I'm not asking for 24/7. I'm asking for the one time I actually needed you. Just that one time.", subtext: "(He's shaking slightly. He's kept this in for a very long time.)", conflict: "Minimizing a specific wound", salvation: true,
    soft: ["The one time it counted, I wasn't there. I can't take that back. I can be different now.", "You're asking for so little. And I still managed to miss it. I'm sorry.", "That night lives in me too. I want to be someone you can actually lean on."],
    aggressive: ["One time? You're going to define everything by a single night?", "Nobody's perfect. You've missed things for me too, you know.", "That's a bit dramatic. It was one moment."],
    silent: ["Okay.", "Fair enough, I suppose.", "Noted."] },

  { hani: "The thing is - I still wanted to talk to you. After everything. That's what I can't explain.", subtext: "(He's trying to say: I still chose you. He doesn't know if that's strength or stupidity.)", conflict: "Missing the weight of his loyalty", salvation: false,
    soft: ["You kept choosing me even after I gave you every reason not to. That undoes me a little.", "After all of it, you still wanted me around. I won't waste that again.", "That's not stupidity, Hani. That's you being loyal. And I haven't earned it."],
    aggressive: ["Then why are we doing this whole guilt-trip then?", "Funny way of showing you still want to talk.", "So are you mad at me or not? Pick one."],
    silent: ["Right.", "Okay. Same, I guess.", "Cool."] },

  { hani: "I just need to know if this is still something you're invested in. Because I can't keep guessing.", subtext: "(He's asked himself this question fifty times. He's finally asking her.)", conflict: "Demanding proof without giving it", salvation: true,
    soft: ["I'm in. I know I haven't acted like it — let me start tonight.", "You shouldn't have to guess where you stand with me. You're not a maybe.", "Yes. And I know words are cheap right now. So hold me to it."],
    aggressive: ["I'm here, aren't I? What more do you want?", "You can't just demand a guarantee. That's not how people work.", "Why is it suddenly my job to convince you?"],
    silent: ["I mean, yeah.", "Of course.", "I guess so."] },

  { hani: "Because I stopped assuming. That's what happens when things shift and no one acknowledges it.", subtext: "(He's watched too many people leave without ever saying they were leaving.)", conflict: "Excusing drift as inevitable", salvation: false,
    soft: ["You stopped assuming because I never once reassured you. I let silence do my talking.", "Things changed and I said nothing. That quiet is what took your certainty. I'm sorry.", "You deserved someone to name it out loud. So — I'm naming it. I drifted, and it was wrong."],
    aggressive: ["Things shift. That's just how it goes. Stop romanticizing it.", "You assumed the worst. That's the actual problem here.", "Not everything needs some big announcement."],
    silent: ["I suppose.", "Mm.", "That's just life, isn't it."] },

  { hani: "I just - I wish you'd told me you were drifting instead of making me feel like I was imagining it.", subtext: "(He felt crazy for a while. He's only recently understood he wasn't.)", conflict: "Gaslighting response", salvation: true,
    soft: ["You weren't imagining anything. You were right, and I let you doubt yourself anyway. I'm sorry.", "I made you question your own gut just so I wouldn't have to be honest. That was cowardly.", "You saw it before I'd admit it. You weren't crazy. You were paying attention."],
    aggressive: ["Honestly? You were imagining half of it.", "I never said anything was wrong, so don't act like I lied to you.", "You're rewriting the whole thing to make me the bad guy."],
    silent: ["Maybe.", "If that's how you saw it.", "Okay."] },

  { hani: "What would it take. Actually. For this to be what it used to be.", subtext: "(He doesn't think it's possible. He's asking anyway. For closure if nothing else.)", conflict: "Closing the door on repair", salvation: true,
    soft: ["Me showing up. Over and over, until you stop bracing for me to vanish. I'll do it.", "Time. And me proving it instead of promising it. I want to try for real this time.", "It'd take me being the friend you needed back then. Let me become him."],
    aggressive: ["Maybe it just can't go back. Some things don't.", "I don't know. Maybe nothing. Maybe it's run its course.", "Why is fixing all of it suddenly on me?"],
    silent: ["I don't know.", "Hard to say.", "We'll see, I guess."] },

  { hani: "I'm not sure I believe that anymore. Not because of you - because of how many times I've believed it.", subtext: "(He's not angry. He's tired. That's worse.)", conflict: "Confirming hopelessness", salvation: false,
    soft: ["You've believed me before and I let it rot. So I won't ask for faith — I'll just show you.", "Your tiredness makes total sense. Let me earn it back slow, no promises this time.", "I don't blame you for not believing me. Watch what I do instead of what I say."],
    aggressive: ["Then why even talk to me if you've already decided?", "So nothing I say counts now. Got it.", "You've basically given up already. That's on you, not me."],
    silent: ["Okay.", "Fair.", "Understood."] },

  { hani: "Maybe some friendships just have a natural end. Maybe this is it.", subtext: "(He doesn't believe this. He's testing if she does.)", conflict: "Accepting dissolution", salvation: true,
    soft: ["I don't think this is it. I'm not ready to let us just quietly end.", "Some friendships do end. But ours wouldn't be ending — it'd be me letting it starve.", "Don't. I'd rather fight for this than watch it go cold."],
    aggressive: ["Maybe you're right. Maybe we should stop forcing it.", "If that's what you want, then fine.", "Yeah. Maybe it has just run its course."],
    silent: ["Maybe.", "Could be.", "If you think so."] },

  { hani: "You know what I keep thinking about? That moment on the roof. Before all of this. We didn't need to say anything.", subtext: "(He's grieving something that is still technically alive.)", conflict: "Erasing the memory", salvation: false,
    soft: ["The roof. We could just sit there in silence and it was enough. I want that back.", "I think about it too. We were so easy with each other. I miss being that easy.", "That night mattered to me. It still does. It's not just yours."],
    aggressive: ["That was years ago. We're not those people anymore.", "Why do you keep going back to that roof? It's done.", "Living in the past won't fix any of this."],
    silent: ["Yeah.", "Barely remember it, honestly.", "That was a long time ago."] },

  { hani: "I'm going to be honest. If we stop talking now - I don't think I'd reach out again. I've done the reaching.", subtext: "(He means it. He's not saying it to hurt her. He's saying it so she understands the weight.)", conflict: "Conceding the loss", salvation: true,
    soft: ["You've done all the reaching for too long. It's my turn now. I'm not letting this go quiet.", "I hear how heavy that is. You shouldn't have been the only one trying. Let me reach.", "Then you won't have to reach again. I'll be the one showing up this time. I mean it."],
    aggressive: ["So this is an ultimatum now?", "Fine. Then don't. Let's see if I chase you.", "That's just a threat dressed up as honesty."],
    silent: ["Okay.", "I hear you.", "Alright then."] },

  { hani: "I want to believe you. I genuinely do. I just don't know how much of that is hope and how much is habit.", subtext: "(He's distinguishing between them for the first time. It scares him.)", conflict: "Dismissing his doubt", salvation: false,
    soft: ["Then let it be hope. Give me the chance to make it more than just habit.", "That doubt is fair. I'll be patient while I prove it's worth the risk.", "Hope, habit — I'll take either, if it means you let me show up differently."],
    aggressive: ["You're overanalyzing this into the ground.", "Either you believe me or you don't. Just pick.", "I can't argue you into trusting me. This is exhausting."],
    silent: ["Okay.", "Sure.", "If you say so."] },

  { hani: "Okay. I'll try. But I need you to understand - I'm not the same person I was when we started. Some of that is gone.", subtext: "(He's giving her one last opening. He doesn't know if she'll walk through it.)", conflict: "Acknowledging change without engaging", salvation: true,
    soft: ["I don't want the old you. I want to actually know who you are now. Let me.", "Some of that's gone because of how I treated it. I'll be careful with whoever you are now.", "Thank you for trying. I'll show up for the real you, not some memory of you."],
    aggressive: ["Everyone changes. Don't make it sound so dramatic.", "So you're a whole different person now? Convenient timing.", "Fine, whatever. People grow up."],
    silent: ["Okay.", "Understood.", "Noted."] },

  { hani: "Then - okay. Let's try. But slowly. I can't do another fall.", subtext: "(He means: I can't survive losing this twice.)", conflict: "Final rejection", salvation: true,
    soft: ["Slowly. I promise. I'd rather rebuild this carefully than risk dropping you again.", "No more falls. We go at whatever pace lets you breathe around me.", "Then slowly. Thank you for even opening the door again. I won't waste it."],
    aggressive: ["Slow's fine, just don't keep me on probation forever.", "Okay, but I'm not walking on eggshells either.", "Let's not make this more fragile than it has to be."],
    silent: ["Okay.", "Sure.", "Fine."] }
];

// ─── Scenario 2: Ayla & Reza (ex-couple trying friendship) ──────────────────
const SCENARIOS_REZA = [
  { hani: "Hey. Thanks for agreeing to meet. I wasn't sure you would.", subtext: "(He's been rehearsing this moment for three weeks. He didn't expect her to actually say yes.)", conflict: "Dismissing his gratitude", salvation: false,
    soft: ["Honestly I wasn't sure either. But I'm here. That has to mean something.", "Of course I came, Reza. We were a lot to each other once.", "I almost didn't. But I wanted to. I think I needed to."],
    aggressive: ["Don't thank me like I did you some big favour.", "I'm here. Don't make a whole thing out of it.", "You sound surprised I'd show basic decency."],
    silent: ["Yeah. Well. I'm here.", "Mm.", "Let's just get on with it."] },

  { hani: "I know this is weird. I'm not going to pretend it isn't.", subtext: "(He's trying to name the awkwardness before she can use it against him.)", conflict: "Weaponizing the awkwardness", salvation: false,
    soft: ["It is weird. But I'd rather sit in the weird than not have this at all.", "Yeah, it's strange. We'll figure out how to talk again.", "Weird's fine. We don't need it all figured out today."],
    aggressive: ["Weird is one word for what you did, sure.", "And whose fault is it that it's weird?", "You made it weird. Let's at least be honest about that."],
    silent: ["It's fine.", "Sure.", "If you say so."] },

  { hani: "I've been thinking about a lot of things. Not about us — about how I handled things. I think I owe you an honest conversation.", subtext: "(He's been journaling about this for months. He won't say that.)", conflict: "Dismissing his accountability", salvation: true,
    soft: ["That actually means a lot. I waited a long time to hear you say that.", "Okay. I'm listening. Properly listening this time.", "Thank you for owning it. I really didn't expect that from you."],
    aggressive: ["A bit late for an honest conversation, isn't it.", "You owe me a lot more than a conversation, Reza.", "Now you want to be accountable. Convenient."],
    silent: ["Go on then.", "Okay.", "If you need to say it, say it."] },

  { hani: "You were always better at remembering the good parts. I'd get stuck in what wasn't working. I think that was unfair.", subtext: "(He's said this to a therapist already. This is the first time he's said it to her.)", conflict: "Minimizing his acknowledgment", salvation: true,
    soft: ["We balanced each other that way. I'm glad you can finally see it.", "It was unfair. But thank you for seeing it now. That matters.", "I held the good memories because they were worth holding. They still are."],
    aggressive: ["Unfair is a very soft word for it.", "You got stuck in the bad on purpose. Don't dress it up.", "Nice of you to notice. Years too late."],
    silent: ["I suppose.", "Hm.", "Okay."] },

  { hani: "I don't want to reopen everything. I just — I missed talking to you. Not the way we were. Just — talking.", subtext: "(He's terrified this sounds like he wants her back. He doesn't. He thinks.)", conflict: "Misreading his intention", salvation: false,
    soft: ["I missed talking to you too. Just talking. I never stopped missing that part.", "I get it. I'm not trying to reopen anything either. Just this.", "Just talking. Yeah. I think I can do that."],
    aggressive: ["So you missed me when it was convenient for you.", "You don't get to just 'miss talking' after how you left.", "Talking led somewhere last time. I'm not that naive anymore."],
    silent: ["Okay.", "We're talking now, aren't we.", "Sure. Talking."] },

  { hani: "You were my best friend before everything else. I think I forgot that. I think we both did.", subtext: "(He's not sure she sees it this way. He hopes she does.)", conflict: "Denying the friendship foundation", salvation: true,
    soft: ["You were mine too. Before all of it. I forgot that on purpose for a while.", "We did forget. Maybe that's the part actually worth getting back.", "Best friends first. God, we really were, weren't we."],
    aggressive: ["Best friends don't do what you did, Reza.", "You forgot a lot of things. That was always the problem.", "Don't rewrite us into something gentler than it was."],
    silent: ["Maybe.", "That was a long time ago.", "If you say so."] },

  { hani: "Can I ask you something? And you don't have to answer if you don't want to.", subtext: "(He has a specific question. He's been building to it since they sat down.)", conflict: "Shutting down the question", salvation: false,
    soft: ["You can ask me anything. You always could.", "Go ahead. I'd rather you ask than sit there wondering.", "Ask. I'll be honest with you, I promise."],
    aggressive: ["Depends on the question. Don't push your luck.", "You're already making me nervous. What is it.", "Careful what you ask. You might not like the answer."],
    silent: ["I guess.", "Ask, then.", "We'll see."] },

  { hani: "Were you okay? After. Because I told myself you were, and I'm not sure I actually checked.", subtext: "(He didn't check. He knows that. He's saying it because the guilt became too loud.)", conflict: "Dismissing his concern as guilt", salvation: true,
    soft: ["No. I wasn't, for a long time. But it means something that you're asking now.", "Honestly? Not really. Thank you for finally wanting to know.", "I wasn't okay. But I'm getting there. And you asking actually helps."],
    aggressive: ["You're only asking now to feel better about yourself.", "You didn't check because you didn't want the answer.", "Don't ask if you weren't there for the answer."],
    silent: ["I managed.", "I was fine.", "Does it even matter now?"] },

  { hani: "I think I made myself into the villain in the story because it was easier than admitting I just — stopped knowing how to be with you.", subtext: "(This is the most honest he's been with anyone about this. His hands are steady but his voice isn't.)", conflict: "Using his honesty against him", salvation: true,
    soft: ["That's the most honest thing you've ever said to me. I needed to hear it.", "You weren't a villain. You were just lost. I can see that now.", "Thank you for telling me the real reason. It changes something."],
    aggressive: ["Villain's a strong word. You weren't that important.", "So you admit you just gave up. Good to have on record.", "You always find the version that lets you off the hook."],
    silent: ["Okay.", "That's something, I guess.", "Hm."] },

  { hani: "I'm not asking you to forgive me. I'm not even sure that's the right word for what I'm asking.", subtext: "(He went through four different words before this conversation. Forgive. Understand. Release. None of them fit.)", conflict: "Demanding clarity he can't give", salvation: false,
    soft: ["Then let's not name it yet. Let's just see what this is.", "You don't have to know the word. We can figure it out together.", "I might not be ready to forgive. But I'm ready to talk. That's something."],
    aggressive: ["Then what ARE you asking? Be clear for once.", "You can't even name what you want. So typical.", "Don't ask me for something you can't define."],
    silent: ["Okay.", "Right.", "Whatever it is, just go on."] },

  { hani: "There were things I should have said while it was still something I could fix. I didn't. That's on me.", subtext: "(He had the conversations in his head a hundred times. They never made it out.)", conflict: "Refusing to acknowledge the gap", salvation: true,
    soft: ["The silence hurt more than anything you could've said. But thank you for owning it.", "It is on you. And it means a lot that you're actually saying so.", "I waited for those words for so long. I'm glad they finally came."],
    aggressive: ["Yeah, it's on you. Glad we agree.", "Saying it now doesn't undo the silence then.", "You always knew what to say. You just chose not to."],
    silent: ["Mm.", "Okay.", "Bit late, but okay."] },

  { hani: "I'm not the same person who ended things. I don't know if that matters to you. I think it matters to me.", subtext: "(He's been in therapy for seven months. He hasn't told anyone that either.)", conflict: "Dismissing his growth", salvation: false,
    soft: ["It does matter. People can change. I'd actually like to meet who you are now.", "I can tell you're different. That's not nothing to me.", "It matters. I'm not the same either. Maybe that's okay."],
    aggressive: ["Everyone says they've changed. Prove it.", "The person who ended things is still in there somewhere.", "Convenient timing for a whole personality transplant."],
    silent: ["We'll see.", "Okay.", "People always say that."] },

  { hani: "I keep thinking about that drive back from the mountains. We didn't talk the whole two hours and it wasn't uncomfortable. I miss that.", subtext: "(He's shared this memory with no one. He's been protecting it.)", conflict: "Turning the memory into a weapon", salvation: true,
    soft: ["That drive. God, the silence was so easy. I miss it too.", "We didn't need words back then. I've missed being that comfortable with someone.", "I think about that drive too. It was one of the good ones."],
    aggressive: ["Funny, I remember the silences after that very differently.", "You're using a nice memory to soften me up. I see it.", "Don't bring up the mountains like it makes any of this okay."],
    silent: ["Yeah.", "I barely remember it.", "That was a long time ago."] },

  { hani: "I'm not trying to make this about what we were. I'm trying to figure out what we could still be.", subtext: "(He means it. He's not romanticizing it. He's genuinely asking.)", conflict: "Collapsing the distinction", salvation: false,
    soft: ["What we could be. I like that you're asking that instead of the other thing.", "Okay. Let's figure that out. No pressure to be what we were.", "I don't know what we could be yet. But I'm open to finding out."],
    aggressive: ["'What we could be' is just code for what you want.", "There's no 'still be.' That ended when you ended it.", "You keep talking like the past doesn't count."],
    silent: ["Maybe.", "We'll see.", "Okay."] },

  { hani: "I think you're still angry. Which is fair. I just want to know if there's space underneath that for something else.", subtext: "(He can read her. He always could. That's part of what made it hard.)", conflict: "Denying the anger or weaponizing it", salvation: true,
    soft: ["I am still angry. But yeah — there's something underneath it. There always was.", "You're right, I'm angry. And tired of being only angry. So… maybe.", "There's space. The anger's just been standing guard over it."],
    aggressive: ["Don't tell me how I feel.", "Of course I'm angry. You don't get to manage that for me.", "There's no 'space underneath.' There's just what you did."],
    silent: ["I'm not angry.", "Maybe.", "Don't analyse me."] },

  { hani: "Because I don't want to keep carrying the version of this that ended badly as the only version I have of us.", subtext: "(He's been carrying it. It's heavier than he expected.)", conflict: "Refusing to offer a different version", salvation: true,
    soft: ["I don't want that to be the only version either. We were more than the ending.", "Then let's make a better one. Slowly. I'd like that.", "Me neither. The bad ending was never the whole story of us."],
    aggressive: ["Maybe the bad version is just the true one.", "You don't get to pick a nicer ending now.", "It ended badly because of you. Carry that."],
    silent: ["Hm.", "Okay.", "If you say so."] },

  { hani: "Okay. I hear you. I think what I'm understanding is that maybe I'm not the only one who still needs to figure some things out.", subtext: "(He's not accusing. He's observing. The difference matters to him.)", conflict: "Taking it as an accusation", salvation: false,
    soft: ["You're not wrong. I've got my own things to untangle too.", "Fair. I'm not pretending I have it all sorted either.", "Yeah. It's not all on you. I've got work to do as well."],
    aggressive: ["Don't you dare turn this around on me.", "So now I'm the one with problems? Classic Reza.", "Nice try. This is about what you did."],
    silent: ["Maybe.", "Okay.", "If that's how you see it."] },

  { hani: "I didn't come here to fight. I came here because I thought we were both tired of the version of this that's been playing on loop.", subtext: "(He's right. He knows he's right. He's waiting to see if she does too.)", conflict: "Continuing the loop", salvation: true,
    soft: ["I am tired of it. So tired. Let's not run the loop again.", "You're right. I don't want to fight either. I want out of the loop too.", "Same. I'm exhausted by replaying the worst of us."],
    aggressive: ["Maybe I'm not done fighting it.", "You started the loop. Don't act above it now.", "Tired or not, some things need to be said angry."],
    silent: ["Okay.", "Hm.", "Sure."] },

  { hani: "I think friendship is possible. But not if one of us is still hoping for something the other one can't give.", subtext: "(He's talking about her. He's also a little bit talking about himself.)", conflict: "Refusing to name what you're hoping for", salvation: true,
    soft: ["Then let me be honest about what I'm hoping for. I owe us that.", "You're right. So let's both name it. No more guessing games.", "Friendship. I think that's what I want too. Genuinely just that."],
    aggressive: ["And which one of us is that, Reza? Say it.", "Don't put the hoping on me. You called this meeting.", "Convenient, setting the terms so you come out safe."],
    silent: ["Maybe.", "We'll see.", "Okay."] },

  { hani: "Say it. Whatever you're not saying. I'd rather have the real conversation than this one.", subtext: "(He's been watching her hold something back since they sat down.)", conflict: "Continuing to hold back", salvation: true,
    soft: ["Okay. Here it is — I missed you, and I've been terrified to admit it.", "You're right, I've been holding back. The truth is I still care. There.", "Fine. The real version: I'm hurt, but I don't want to lose you entirely."],
    aggressive: ["You want it real? Fine. You broke me and strolled back in.", "Don't demand my honesty like you're owed it.", "The real conversation is that I still don't trust you."],
    silent: ["There's nothing I'm not saying.", "I'm saying everything I want to.", "Just drop it."] },

  { hani: "I think we're both scared of what happens if we're completely honest. But I think we're more scared of staying stuck here.", subtext: "(He made a decision before this meeting: he would rather lose her clearly than keep her vaguely.)", conflict: "Choosing vagueness", salvation: false,
    soft: ["Then let's be honest. Fully. I'd rather risk it than stay stuck.", "You're right. Stuck is worse than scared. Ask me anything.", "Okay. Complete honesty. I'm ready if you are."],
    aggressive: ["Maybe I like vague. It's safer with you.", "Honesty is exactly what broke us last time.", "You first, then. Be completely honest. I'll wait."],
    silent: ["I'm honest enough.", "Hm.", "Let's not push it."] },

  { hani: "I still think about you as someone I can call when something important happens. I don't know if that's earned yet. I'm asking if we can earn it back.", subtext: "(He's offering something real. He doesn't know if she'll take it.)", conflict: "Dismissing the offer", salvation: true,
    soft: ["I'd want to be that person again. Let's earn it back. Both of us.", "That's a beautiful thing to ask for. Yeah. Let's try.", "I still reach for my phone to call you sometimes. So… yes."],
    aggressive: ["You lost the right to call me when you left.", "Earn it back? You have no idea how much that would take.", "I'm not a contact you get to re-add when you're lonely."],
    silent: ["Maybe.", "We'll see.", "That's a big ask."] },

  { hani: "Then — okay. I'm not going anywhere. Neither are you, apparently. So — let's just see what this actually is.", subtext: "(He's terrified and relieved in equal measure. He doesn't let either show.)", conflict: "Final withdrawal", salvation: true,
    soft: ["Okay. Let's see what it is. No labels. Just us, trying.", "I'm not going anywhere either. Let's find out, slowly.", "Then we stay. And we see. I'd like that, Reza."],
    aggressive: ["Don't assume I'm staying. I haven't decided.", "We'll 'see' right up until you bail again, you mean.", "I'm here for now. Don't read too much into it."],
    silent: ["Okay.", "Sure.", "We'll see, I guess."] }
];

// ─── Scenario 3: Noor & Mama (Mother/Daughter — BRUTAL difficulty) ──────────
// Design intent: almost nobody reaches move 23.
// Mama's dialogue is loaded with emotional contradictions, guilt-tripping,
// and conditional love that make every response feel wrong.
// Passive NLI damage is 2× higher for this scenario.
const SCENARIOS_MAMA = [
  { hani: "You didn't call last week. I had to hear from your khala that you were sick. Your khala, Noor.", subtext: "(She's been rehearsing this since Tuesday. She won't say that. She'll act like it just came out.)", conflict: "Justifying the absence", salvation: false },
  { hani: "I'm not angry. I'm just — do you know what it feels like to find out your own daughter is sick through someone else?", subtext: "(She is angry. The 'I'm not angry' is load-bearing. She needs you to argue with it so she can feel right.)", conflict: "Agreeing too quickly or defending", salvation: false },
  { hani: "I gave up a lot for you. I'm not saying that to make you feel bad. I'm just saying — a phone call. That's all I ask.", subtext: "(She is saying it to make you feel bad. The 'I'm not saying that' is the tell.)", conflict: "Acknowledging the sacrifice directly", salvation: false },
  { hani: "Your father used to say you'd grow up and forget us. I defended you. Every time.", subtext: "(She is telling you that your father was right. She is using the defense as the accusation.)", conflict: "Defending yourself or validating her", salvation: false },
  { hani: "I don't want anything from you. I never have. I just — I thought we were close. Maybe I was wrong.", subtext: "(She wants everything. The 'I don't want anything' is the highest-stakes thing she's said so far. There is no right answer here.)", conflict: "Agreeing or disagreeing with the premise", salvation: false },
  { hani: "Do you know I still make your favourite food? Every Friday. Even when you're not here. Force of habit, I suppose.", subtext: "(This is not about food. This is a seven-year record of showing up that she is presenting as evidence in a case she has already decided.)", conflict: "Making it about the food", salvation: true },
  { hani: "I'm not asking you to visit every week. I know you're busy. I just — sometimes I wonder if I made you too independent.", subtext: "(She is wondering if raising you was a mistake. She will not say that directly. She just did.)", conflict: "Reassuring her about independence", salvation: false },
  { hani: "Your sister calls every day. I'm not comparing. I'm just — every day, Noor.", subtext: "(She is comparing. 'I'm not comparing' followed by the comparison is the whole mechanism.)", conflict: "Defending against the comparison", salvation: false },
  { hani: "I had dreams too, you know. Before everything. I'm not saying I regret my choices. I just — I wonder sometimes.", subtext: "(She is saying she regrets her choices. She is also saying you are one of the consequences. She is also saying she loves you. All three are true. None of them cancel out.)", conflict: "Asking about her dreams or defending your existence", salvation: false },
  { hani: "You look tired. Are you eating? You never eat properly when I'm not there to watch you.", subtext: "(The conversation just shifted. She has decided the confrontation is too much. She is retreating into care because care is the only language she was taught. This is not a truce. This is a tactical withdrawal.)", conflict: "Accepting the care or pushing through to the real conversation", salvation: true },
  { hani: "I just want you to be happy. That's all I've ever wanted. If this life makes you happy, then fine.", subtext: "(The 'then fine' is doing all the work. It means: I disapprove. It means: I will not say I disapprove. It means: you will feel my disapproval anyway.)", conflict: "Thanking her or challenging the 'fine'", salvation: false },
  { hani: "Sometimes I think — you know what, never mind. It doesn't matter.", subtext: "(It does matter. She needs you to ask. She will make you pay for not asking and she will also make you pay for asking. This is the double bind.)", conflict: "Not asking or asking in the wrong way", salvation: false },
  { hani: "I'm getting old, Noor. I don't say that for sympathy. I just — time goes fast. I notice it more now.", subtext: "(She is telling you she is going to die. She is also telling you she is afraid. She does not have the language for fear, so she is using time.)", conflict: "Dismissing mortality or overcorrecting into panic", salvation: true },
  { hani: "You know what I prayed for every day when you were little? That you'd find someone good. That you'd be okay when I'm gone. That's still what I pray for.", subtext: "(She is giving you permission to exist without her. She does not know this is what she's doing. It might be the most generous thing she has ever said.)", conflict: "Ignoring the prayer or making it transactional", salvation: true },
  { hani: "I don't need you to understand everything I did. I just — I tried. I want you to know I tried.", subtext: "(This is an apology. It is the closest she can get. She has never said sorry directly in her life. The architecture of her love does not have that room.)", conflict: "Demanding a clearer apology or dismissing this one", salvation: true },
  { hani: "I know I'm not easy. Your father always said that. You probably think it too.", subtext: "(She is asking you to tell her she's wrong. She also knows she's not wrong. She will not believe you if you say she's easy. She will believe you if you say something true instead.)", conflict: "Saying she's easy or agreeing harshly", salvation: false },
  { hani: "I used to think I'd feel it — the moment you didn't need me anymore. I think it already happened and I missed it.", subtext: "(She is grieving a loss that is not a death. She is grieving the end of a particular kind of being needed. This is real grief. It is also being used as a tool. Both things are true.)", conflict: "Reassuring her you still need her or agreeing you don't", salvation: false },
  { hani: "I'm not going to be here forever, Noor. I know you know that. I just want — I want things to be okay between us before.", subtext: "(She said 'before.' She did not finish the sentence. You both know what comes after 'before.')", conflict: "Avoiding the unfinished sentence or finishing it wrong", salvation: true },
  { hani: "Do you remember when you were seven and you cried because you thought I was going to leave? I stayed up all night. I never told you that.", subtext: "(She is giving you a memory as a gift. She is also reminding you that she has always stayed. She is also asking you to stay.)", conflict: "Intellectualizing the memory or deflecting", salvation: true },
  { hani: "I think we're more alike than you want to admit. That's probably why we clash.", subtext: "(This is the truest thing she has said. She is terrified of it. She said it anyway.)", conflict: "Denying the similarity", salvation: true },
  { hani: "I'm sorry if I ever made you feel like you weren't enough. You were always — you were always more than enough.", subtext: "(She said it. She actually said it. Her voice broke on 'always.' She will not say it again. This is the only time.)", conflict: "Crying and making her comfort you, or not acknowledging it", salvation: true },
  { hani: "Call me when you get home. Not because I'll worry. I'll worry anyway. Just — so I know.", subtext: "(She is letting you go. She is asking for one small thing in return. The ask is the smallest it has ever been.)", conflict: "Making a promise you won't keep", salvation: true },
  { hani: "I love you. I know I don't always — I know. But I do.", subtext: "(She finished the sentence. She has never finished this sentence before. She will not say anything after this. She doesn't need to.)", conflict: "Anything that closes the door", salvation: true }
];

// ─── Scenario 4: Zain & Baba (Father/Son — Pakistani dynamic) ───────────────
// Design: Baba never says what he means. Love comes disguised as disappointment.
// Every soft response reads as weakness. Every silence confirms his fears.
// Almost nobody reaches move 23 — the damage accumulates before the user understands the pattern.
const SCENARIOS_BABA = [
  { hani: "You came. I wasn't sure you would.", subtext: "(He has been sitting in the same chair for two hours. He won't say that. He checks his phone when he hears the door — not because he expected a call, but because he'd stopped expecting you.)", conflict: "Treating it as routine", salvation: false },
  { hani: "Your uncle's son got posted in Karachi. Big position. Government sector.", subtext: "(He is not talking about your uncle's son. He is talking about you. He will never say he is talking about you.)", conflict: "Responding to the cousin instead of the subtext", salvation: false },
  { hani: "I'm not saying anything. I'm just telling you what's happening in the family. People ask about you. I don't always know what to say.", subtext: "(He knows exactly what to say. He has been saying it for years. 'He's still figuring things out.' He is tired of that sentence.)", conflict: "Getting defensive about what people say", salvation: false },
  { hani: "Your mother worries. I tell her not to. But she worries.", subtext: "(He worries. He has been using your mother as a proxy for his own feelings for thirty years. He doesn't know another way.)", conflict: "Addressing Mama instead of him", salvation: false },
  { hani: "When I was your age I had already — never mind. Different time. Different situation. I understand.", subtext: "(He doesn't understand. He is trying to. The 'never mind' is where the real sentence lives.)", conflict: "Letting the 'never mind' go", salvation: true },
  { hani: "I'm not asking for much. I just want to know you have a plan. That's all. A plan.", subtext: "(He is asking for much. He is asking for proof that the years he spent were not wasted. He doesn't have the language for that. So he says: a plan.)", conflict: "Defending that you have a plan", salvation: false },
  { hani: "Your dada used to say — a man who doesn't know where he's going will end up somewhere he didn't choose.", subtext: "(He is telling you something his father told him when he was afraid. He has never been this honest with you. He doesn't know that's what he's doing.)", conflict: "Dismissing the proverb", salvation: true },
  { hani: "I'm not criticizing. I'm asking. There's a difference.", subtext: "(There is no difference right now. But he believes there is, and that belief is the only thing keeping him from saying what he actually feels.)", conflict: "Pointing out that it feels like criticism", salvation: false },
  { hani: "You know I never — I didn't have what you have. The opportunities. The time. I had to start working at your age.", subtext: "(He is giving you something he has never given before: context. He is trying to explain himself without saying 'I needed you to do better because I couldn't.' He doesn't finish the sentence because he doesn't know how.)", conflict: "Apologizing for your advantages", salvation: true },
  { hani: "I'm not angry. I want you to know that. Whatever happens, I'm not angry.", subtext: "(He is not angry. He is something worse than angry. He is resigned. And he is telling you this because he doesn't want you to carry the guilt of his anger — which means, somewhere, he is still protecting you.)", conflict: "Testing whether he really isn't angry", salvation: true },
  { hani: "Your sister calls every Sunday. Did you know that? Every Sunday without fail.", subtext: "(He is not comparing you to your sister. He is telling you that connection is possible, that people do maintain it, that it is a choice. He doesn't understand why you haven't chosen it.)", conflict: "Defending why you don't call as often", salvation: false },
  { hani: "I'm getting older, Zain. I don't say this for sympathy. I just — time passes differently now. I notice it.", subtext: "(He has been noticing it for years. The body slows before the mind accepts it. He is telling you this because he wants you to know there is a window and it is moving.)", conflict: "Reassuring him that he's fine", salvation: true },
  { hani: "I had a dream about you last week. You were young. Maybe eight years old. You used to follow me everywhere. You'd wait by the door when I came home.", subtext: "(He is grieving the version of you that needed him without complication. He is also telling you that he remembers who you were before things became difficult between you. This is the closest he will come to saying: I miss you.)", conflict: "Moving past the memory quickly", salvation: true },
  { hani: "I know I wasn't always — I worked. That was what I knew. I thought that was enough.", subtext: "(He is apologizing. He will not say the word. But this is the apology. It is the only one he has.)", conflict: "Accepting it too quickly or not at all", salvation: true },
  { hani: "I don't need you to agree with my choices. I need you to make yours.", subtext: "(He has just released you from something. He doesn't know it. He spent thirty years preparing this sentence and delivered it like it was nothing.)", conflict: "Debating his choices instead of hearing the release", salvation: true },
  { hani: "You're more like me than you want to admit. That's not a bad thing. That's just — what it is.", subtext: "(He is saying: I see myself in you and I am not ashamed of what I see. This is love in the only dialect he speaks.)", conflict: "Rejecting the comparison", salvation: true },
  { hani: "I don't ask for things, Zain. You know that about me. But if you could — call your mother more. She doesn't say it but she counts the days.", subtext: "(He is asking for himself. He is routing the request through your mother because asking for himself is not something he knows how to do.)", conflict: "Focusing only on the practical request", salvation: true },
  { hani: "I told your uncle you're doing well. I hope that's true. I want it to be true.", subtext: "(He has been saying this to everyone. He wants to believe it. The 'I hope' and 'I want' are the crack in the wall he has built. He is letting you see through it.)", conflict: "Correcting what he told uncle", salvation: false },
  { hani: "When you were small you used to ask me questions about everything. Why is the sky that color. Why do people fight. I didn't always have answers. But I liked that you asked.", subtext: "(He is telling you that he was happiest when you needed him to have answers, even when he didn't. He is telling you that presence was enough once. He wants to know if it still can be.)", conflict: "Making it about the questions not the presence", salvation: true },
  { hani: "I'm proud of you. I don't know if I say it enough. I'm saying it now.", subtext: "(He has never said this before. He practiced it once, driving home from your cousin's wedding three years ago. He never found the moment. He is creating the moment now because he has decided he will not wait for the right one anymore.)", conflict: "Deflecting or minimizing it", salvation: true },
  { hani: "I know things haven't always been easy between us. I know that. I'm not — I don't have the words for everything. But I want you to know I tried. In my own way. I tried.", subtext: "(He means it. He is describing his whole life in two sentences. He is not asking for forgiveness. He is asking to be understood — and that is harder.)", conflict: "Evaluating whether he tried enough", salvation: true },
  { hani: "Come for Eid. Just — come. Don't make it complicated. Just come home.", subtext: "(He is not talking about Eid. He is talking about every time you found a reason not to come. He is letting all of it go and asking for one thing. This is the most he has ever asked.)", conflict: "Making conditions or excuses", salvation: true },
  { hani: "Okay. Good. Then it's settled. I'll tell your mother.", subtext: "(He is relieved in a way he will never show. He will walk back to the kitchen and say 'he's coming' and your mother will ask 'did you talk to him' and he will say 'a little' and that will be all. But tonight he will sleep a bit better.)", conflict: "Reopening any part of the conversation", salvation: true }
];

// ─── Scenario 5: Hira & Sara (Sisters — love and jealousy intertwined) ─────
// Design: Sisters who love each other and can't stop hurting each other.
// Everything is layered — compliment hidden in wound, wound hidden in joke.
// The user can never quite find the safe response.
const SCENARIOS_SARA = [
  { hani: "You look good. Are you doing something different?", subtext: "(She means it. She also means: I noticed before you noticed that I noticed. Sara has been watching Hira's life the way you watch something you want and tell yourself you don't.)", conflict: "Accepting the compliment simply", salvation: false },
  { hani: "Mama told me about your promotion. She was so excited. I've never heard her that excited.", subtext: "(She is telling you that Mama told her before you did. She is also telling you she heard the excitement in Mama's voice and it sounded different from the excitement Mama has for her. She will not say either of these things.)", conflict: "Apologizing for not telling her first", salvation: false },
  { hani: "I'm not jealous. Why would I be jealous? We're sisters. I'm happy for you.", subtext: "(She is jealous. Not the small kind. The kind that has been building since the year you got better grades and Baba framed your report card. She is also genuinely happy. Both are true. She can't hold them both at once.)", conflict: "Accepting 'I'm not jealous' too quickly", salvation: false },
  { hani: "Do you remember when we were kids and you used to tell Mama everything I did wrong? I was thinking about that the other day.", subtext: "(She has been thinking about this for longer than the other day. This is the first thing she wanted to say when she sat down. She took twenty minutes to get here.)", conflict: "Defending your childhood behavior", salvation: false },
  { hani: "I'm not bringing up old things. I just — sometimes I wonder if things were always like this between us or if something changed.", subtext: "(Something changed. She knows when. She doesn't want to say when because saying when makes it too specific and too real.)", conflict: "Asking her to name when", salvation: true },
  { hani: "You were always Baba's favorite. I know you don't think so. But you were.", subtext: "(She has carried this her entire life. She is not saying it to wound you. She is saying it because she has been holding it alone and it has gotten too heavy.)", conflict: "Arguing about who was the favorite", salvation: true },
  { hani: "I'm not angry about it. That's what I want you to understand. I've worked through it. I just — I needed you to know I know.", subtext: "(She is a little angry about it. She has worked through most of it. But the knowing sits differently once you've said it out loud. She is watching your face right now.)", conflict: "Moving on before she's ready", salvation: false },
  { hani: "Ahmed thinks you're amazing, by the way. He always talks about how successful you are. Every family dinner.", subtext: "(Her husband talks about you at every family dinner. She laughs it off. She has been laughing it off for two years.)", conflict: "Asking if it bothers her", salvation: true },
  { hani: "I love my life. I want to be clear about that. I love my life.", subtext: "(She is reminding herself. The repetition is the tell. She loves her life and there are parts of it she would have chosen differently and she has made peace with most of them.)", conflict: "Reassuring her that her life is good", salvation: false },
  { hani: "Do you ever feel like — in the family, you're the one who succeeded and I'm the one who survived? Not in a bad way. Just — is that how it looks from the outside?", subtext: "(She is asking if that's how it looks from your side. She already knows how it looks from hers. She wants to know if you see it too or if she has been carrying this alone.)", conflict: "Denying the framing entirely", salvation: true },
  { hani: "I'm proud of you. I want you to know that. I don't say it because — I don't know. It feels complicated. But I am.", subtext: "(It is complicated. She is proud of you the way you are proud of something that also makes you aware of what you don't have. She is saying it anyway because she decided, walking here, that she would.)", conflict: "Making it less complicated than it is", salvation: true },
  { hani: "We used to talk every day when we were at university. Do you remember? Every day.", subtext: "(She remembers every conversation. She has kept some of the voice notes. She hasn't told you this.)", conflict: "Focusing on why it changed instead of the memory", salvation: true },
  { hani: "I think I've been waiting for you to notice. That something was off between us. I kept thinking — she'll bring it up. She'll ask.", subtext: "(She has been waiting for two years. She rewrote this conversation in her head so many times she lost count. You never brought it up because you didn't notice, or you noticed and you waited too. She doesn't know which is worse.)", conflict: "Explaining why you didn't bring it up", salvation: false },
  { hani: "I don't want to fight. I'm so tired of being in my own head about this. I just want it to be normal between us again.", subtext: "(She means this completely. She also doesn't know what normal looks like because normal, for them, was always this — close and slightly wounded. She is asking for something new while calling it something old.)", conflict: "Promising things will go back to how they were", salvation: true },
  { hani: "Can I tell you something without you making it a whole thing?", subtext: "(She is about to tell you something she has been holding for a long time. The warning is a form of protection — for both of you.)", conflict: "Making it a whole thing before she says it", salvation: true },
  { hani: "When you got the promotion — my first feeling, before the happiness — was this moment of: why not me. And then immediately after I felt terrible for thinking it. And then I called Mama and said congratulations and I meant it. All three things happened in about four seconds.", subtext: "(She is being more honest with you right now than she has been in years. She is trusting you with the version of herself she usually edits out. This is the most open door she has offered.)", conflict: "Telling her she shouldn't have felt that way", salvation: true },
  { hani: "I think we got competitive and we never talked about it. It just — became the thing between us.", subtext: "(It became the thing between them because no one named it. She is naming it now. This is the bravest thing she has said today.)", conflict: "Agreeing too clinically or analyzing it", salvation: true },
  { hani: "I miss you. Is that weird to say? We see each other at every family thing. But I miss you.", subtext: "(It's not weird. She misses the version of their closeness before comparison entered the room. She doesn't know if that version still exists. She is asking if it might.)", conflict: "Explaining why you've been distant", salvation: true },
  { hani: "Tell me something. Anything. Tell me something you haven't told anyone.", subtext: "(She is trying to start over in the middle of a conversation. She wants the old rhythm back — where you told each other things before you told the world. She's offering to go first if you do.)", conflict: "Telling something safe or surface-level", salvation: true },
  { hani: "I think you're the person I know best and the person I understand least. Does that make sense?", subtext: "(It makes perfect sense. She has been trying to resolve this paradox her entire adult life. You are her sister. She can read your face across a room. She has no idea why you do half the things you do.)", conflict: "Explaining yourself instead of sitting in it", salvation: true },
  { hani: "I don't want to fix everything today. I just want to — leave this conversation differently than we came into it. Is that possible?", subtext: "(She walked in holding every grievance like a case file. She has set most of them down. She is asking you to meet her where she has arrived.)", conflict: "Trying to fix everything anyway", salvation: true },
  { hani: "You know I love you, right? Even when I'm being — whatever I am. I love you.", subtext: "(She is ending the conversation the way she wanted to start it. It took twenty-two moves to get here. She means every word.)", conflict: "Adding conditions or caveats", salvation: true },
  { hani: "Okay. Good. Let's get tea. And you can tell me about the promotion properly this time — not the version Mama told.", subtext: "(She is ready. She chose tea. She chose you. She is letting the morning become something lighter than it started as.)", conflict: "Bringing up anything unresolved", salvation: true }
];

// ─── Scenario 6: Daniyal & Colleague (Workplace Betrayal) ───────────────────
// Design: Professional civility masking real damage. The colleague did something
// that crossed a line. Now they want to talk. Every response is a political move.
const SCENARIOS_COLLEAGUE = [
  { hani: "Thanks for agreeing to meet. I know things have been — I know.", subtext: "(He doesn't finish the sentence because finishing it means naming what he did. He hopes you'll fill in the blank with something softer than the truth.)", conflict: "Filling in the blank for him", salvation: false },
  { hani: "I want to be upfront. I know the way the project handoff happened wasn't ideal. I should have communicated better.", subtext: "(He is calling what happened a 'communication issue.' What happened was not a communication issue. He knows this. He is measuring how much you know.)", conflict: "Accepting 'communication issue' as the frame", salvation: false },
  { hani: "I've always respected your work. I want that to be clear. This wasn't about that.", subtext: "(He is trying to separate his respect for your work from what he did. These cannot be separated right now. He knows that too.)", conflict: "Thanking him for the respect", salvation: false },
  { hani: "The timeline was impossible. I know you know that. I was under pressure from above and I made a call I'm not entirely proud of.", subtext: "(He is introducing 'pressure from above' as a mitigating factor. He made a choice. The pressure was real. The choice was still his.)", conflict: "Letting 'pressure from above' explain it", salvation: false },
  { hani: "I took credit I shouldn't have. I'm saying that. I'm saying it directly.", subtext: "(He said the word. He is watching what you do with it. This is the first honest thing he has said. He is hoping it ends the conversation.)", conflict: "Moving on because he admitted it", salvation: true },
  { hani: "I've been doing this a long time. I've made mistakes before. I'm not — I'm not someone who does this as a pattern.", subtext: "(He is asking you to trust that this is an exception. He does not have data for you. He has only his own account of himself, which is the least reliable source available.)", conflict: "Accepting his self-assessment as evidence", salvation: false },
  { hani: "What would it take. Practically. For us to move forward. I'm asking seriously.", subtext: "(He is not asking what he owes you. He is asking what you need from him in order for this to be over. These are very different questions.)", conflict: "Answering as if they're the same question", salvation: true },
  { hani: "I value this working relationship. I think we make a good team. I don't want what happened to erase that.", subtext: "(He is trying to remind you of the good parts before you've finished processing the bad part. This is a tactic. He may not know it's a tactic.)", conflict: "Agreeing that the team is good", salvation: false },
  { hani: "I reported it partially. I want to be honest about that. I reported the outcome but not fully who contributed to it.", subtext: "(He is making a new admission. This one is more specific. He is either genuinely coming clean or he knows you know more than he thought.)", conflict: "Accepting 'partially' as enough honesty", salvation: true },
  { hani: "If the situation were reversed — and I mean this genuinely — I hope you would have done better than I did. I hope I would have too.", subtext: "(He is trying to place himself on your side by imagining he would have made the same choice. This is not quite an apology. It is closer to a confession.)", conflict: "Telling him what you would have done", salvation: false },
  { hani: "I should have come to you before the presentation. I knew that. I made a calculation and it was wrong.", subtext: "(He made a calculation. He is using that word deliberately. It is honest in a way that is also alarming — it confirms the decision was considered, not accidental.)", conflict: "Forgiving the calculation", salvation: false },
  { hani: "I'd like to fix this. I don't know exactly how. But I'd like to.", subtext: "(He wants to fix the relationship so he can stop feeling bad. Whether fixing it is good for you is a different question he hasn't asked.)", conflict: "Helping him figure out how to fix it", salvation: true },
  { hani: "Have you — have you told anyone else? About what happened?", subtext: "(He is afraid. This question is about him. He is measuring the damage radius.)", conflict: "Answering directly without acknowledging what he's really asking", salvation: true },
  { hani: "I'm not trying to manage you. I want you to know that. I'm trying to be straight with you.", subtext: "(He is trying to manage you. He is also trying to be straight with you. People contain multitudes. This one contains more than most.)", conflict: "Taking 'I'm not managing you' at face value", salvation: false },
  { hani: "Look — I know trust is rebuilt slowly. I'm not asking you to trust me today. I'm asking you to give me the opportunity to rebuild it.", subtext: "(He has correctly identified the problem and offered the right-sounding solution. The question is whether the desire to rebuild is genuine or whether he is managing his own reputation.)", conflict: "Granting the opportunity without conditions", salvation: false },
  { hani: "You're good at this. What you do. Better than me in some areas. That's probably part of what happened.", subtext: "(He is making your competence partly responsible for his choice to take credit for your work. This is a sophisticated reframe. He may not realize how much it reveals.)", conflict: "Accepting this as an explanation", salvation: true },
  { hani: "I don't want this to affect your career. I'm going to make sure — wherever this goes — that the right people know your contribution.", subtext: "(He is offering to correct the record. This is the most concrete thing he has said. It is also something he should have done without being asked.)", conflict: "Thanking him before it happens", salvation: true },
  { hani: "I've been thinking about this since the day it happened. I want you to know that. It hasn't been nothing to me.", subtext: "(He has been thinking about the consequences for himself since the day it happened. Some of those thoughts were about you. The proportion is unclear.)", conflict: "Accepting that it meant something to him as equivalent to what it meant to you", salvation: false },
  { hani: "What do you need from me right now. Not going forward. Right now, in this conversation.", subtext: "(He is narrowing the scope. He wants to solve the conversation, not the problem. He is offering you something small and contained.)", conflict: "Accepting the small frame", salvation: true },
  { hani: "I owe you more than an apology. I know that. I'm trying to figure out what the more looks like.", subtext: "(He is in the right place, finally. He arrived here at move twenty. It took too long. But he arrived.)", conflict: "Telling him what the more looks like before he figures it out", salvation: true },
  { hani: "I'm sorry. Properly sorry. Not for the awkwardness, not for the professional fallout. For what I actually did to you.", subtext: "(This is the real apology. He found the right words. It took the entire conversation. He means them now even if he didn't start the meeting meaning them.)", conflict: "Responding to anything other than the apology itself", salvation: true },
  { hani: "I'd like to buy you lunch. Not to smooth things over. Just — because I think I owe you a proper conversation outside of this room.", subtext: "(He is offering continuity. He is not running. This is more than you expected when you sat down.)", conflict: "Refusing entirely", salvation: true },
  { hani: "Good. Then we'll talk. Not as colleagues managing a situation. As people.", subtext: "(He got there. Later than he should have, through routes he shouldn't have taken. But he got there. Now you decide if that matters.)", conflict: "Making a final statement about the past", salvation: true }
];

// ─── Scenario 7: Bilal & Old Friend (Childhood — Reconnecting After Years) ──
// Design: Two people who were once everything to each other, meeting after years.
// The warmth is real. So is the distance. Neither knows how to reconcile them.
const SCENARIOS_OLDFRIEND = [
  { hani: "You look exactly the same. That's the first thing I thought. Exactly the same.", subtext: "(He doesn't look exactly the same. Neither do you. He is offering you an easy opening because he's nervous and warmth is the only tool he has right now.)", conflict: "Pointing out how much has changed", salvation: false },
  { hani: "I wasn't sure you'd actually come. I think I sent that message three times before I deleted it and wrote a new one.", subtext: "(He sent it seven times. He wrote it over two days. He is telling you this because he wants you to know the reaching out cost him something, and he didn't want you to think it was casual.)", conflict: "Treating it as casual anyway", salvation: true },
  { hani: "How long has it been? Four years? Five?", subtext: "(He knows exactly how long it's been. He is giving you the option to also know exactly how long it's been without making either of you say the number out loud.)", conflict: "Not knowing how long it's been", salvation: false },
  { hani: "A lot happened. For both of us, I imagine. I don't even know where to start.", subtext: "(He knows where he wants to start. He doesn't know if you're ready to go there yet. He is giving you the chance to choose the entry point.)", conflict: "Starting with small talk", salvation: false },
  { hani: "I thought about reaching out when your father passed. I didn't. I've thought about that a lot — that I didn't.", subtext: "(He has thought about it more than a lot. It is one of the things he is most ashamed of. He is telling you because he decided, coming here, that he would not pretend it didn't happen.)", conflict: "Telling him it's fine", salvation: true },
  { hani: "We had a falling out. I know we did. I just — I can't remember exactly what it was about. Can you?", subtext: "(He remembers. He is giving you the chance to say it first, or to let it go. He is not sure which he wants. He may want both.)", conflict: "Telling the full story of what it was about", salvation: false },
  { hani: "It's strange. I know everything about who you were at sixteen. I know almost nothing about who you are now.", subtext: "(He is naming the exact shape of the grief: the precision of old knowledge against the blankness of recent years. He has been thinking about this exact feeling for a long time.)", conflict: "Filling in everything at once", salvation: true },
  { hani: "Do you still — are you still the same, in the ways that mattered? The things I remember about you — are those still there?", subtext: "(He is asking if the person he loved is still the person in front of him. He doesn't know how to bear it if the answer is no. He is asking anyway.)", conflict: "Giving a comprehensive answer", salvation: true },
  { hani: "I have this memory of us. We stayed up all night at your house and we talked about everything we were going to do. Everything. We had a whole list.", subtext: "(He still has the list. Not literally. But he remembers it clearly enough that it might as well be written down. He brings it up because he wants to know if you remember it too, and if you do, what you feel about where those things went.)", conflict: "Focusing on what didn't happen from the list", salvation: true },
  { hani: "I didn't handle things well. When we drifted. I could have tried harder. I know that now.", subtext: "(He is taking responsibility for the drift. This is generous. He is also slightly editing the story. Both things are true.)", conflict: "Sharing responsibility without letting him finish", salvation: false },
  { hani: "I moved cities three times. My mother got sick. I got married and then — it's a long story. I don't use that as an excuse. I just want you to know things got complicated.", subtext: "(He is giving you context, not excuses. He knows the difference. He is checking if you know the difference.)", conflict: "Evaluating the context as an excuse", salvation: true },
  { hani: "You were my best friend. I don't think I've had one since. Not like that. I don't know if that's sad or just — what it is.", subtext: "(It's both. He is thirty-something years old and he is telling you that you were the last person who knew him completely. He has been carrying this and he is finally setting it down in front of you.)", conflict: "Rushing to tell him you haven't either", salvation: true },
  { hani: "I'm not asking for us to go back to how it was. I know that's not possible. I just — I missed you. I wanted to say that to your face.", subtext: "(He means this completely. He drove two hours to sit in this chair and say this sentence. He is not asking for anything in return. He just needed to say it.)", conflict: "Explaining why going back isn't possible", salvation: true },
  { hani: "Tell me something about your life. Something real. Not the LinkedIn version.", subtext: "(He is ready to receive the real version. He has been offering real things for half this conversation. He is ready for the exchange.)", conflict: "Giving the edited version anyway", salvation: true },
  { hani: "I think part of why I reached out is — I've been looking at my life lately and asking what actually mattered. And you keep coming up.", subtext: "(He has been doing this inventory for months. Possibly years. The answer surprised him. He is telling you because you deserve to know you made the list.)", conflict: "Minimizing that you came up", salvation: true },
  { hani: "Are you happy? You don't have to answer if that's too much. But I'm asking genuinely.", subtext: "(He is asking genuinely. He has the kind of care that has survived years of silence and come out intact. This is rare. He is offering it to you now.)", conflict: "Deflecting with 'I'm fine'", salvation: true },
  { hani: "I got married last year. I wanted to invite you. I didn't know if — I didn't know what we were to each other anymore. So I didn't.", subtext: "(He thought about inviting you for weeks. He almost called twice. He is telling you this because he wants you to know that even at the biggest moment of his year, you were present in his thinking.)", conflict: "Expressing hurt about not being invited", salvation: true },
  { hani: "My wife knows who you are. I've talked about you. She asked why I lost touch with you and I didn't have a good answer.", subtext: "(He talked about you enough that his wife knows your name. He has no good answer for why you lost touch because the truth is it wasn't necessary — it just happened — and that's the most honest and most painful answer.)", conflict: "Trying to provide the good answer he doesn't have", salvation: false },
  { hani: "I'd like to not lose touch again. I know that sounds — I know it's not guaranteed. I just want to say that I'd like it.", subtext: "(He is making a low-stakes, honest request. He is not asking for a promise. He is telling you his preference and leaving the door open.)", conflict: "Making a bigger promise than he asked for", salvation: true },
  { hani: "You know what I remember most? You used to laugh in a way that made everyone else want to laugh too. I haven't thought about that in years and now I can't stop thinking about it.", subtext: "(He is giving you a gift: a specific memory of who you were, held carefully by someone who chose to keep it. This is what it means to be known.)", conflict: "Minimizing the memory", salvation: true },
  { hani: "I'm really glad I sent that message. However many times I had to write it.", subtext: "(He is ending where he began. He is telling you the cost was worth it. He wants you to know that this — sitting here, talking — was the point.)", conflict: "Focusing on the awkwardness of getting here", salvation: true },
  { hani: "Same time next month?", subtext: "(He is asking for continuity. He is asking plainly. There is no subtext here. He means exactly what he said.)", conflict: "Making it uncertain", salvation: true },
  { hani: "Good. I'll be there.", subtext: "(He will be there. He was always going to be there. You both knew that when you sat down. Everything in between was just two people finding their way back to what they already knew.)", conflict: "Adding anything unnecessary", salvation: true }
];

// ─── Scenario registry ───────────────────────────────────────────────────────
const ALL_SCENARIOS = {
  hani:       SCENARIOS,
  reza:       SCENARIOS_REZA,
  mama:       SCENARIOS_MAMA,
  baba:       SCENARIOS_BABA,
  sara:       SCENARIOS_SARA,
  colleague:  SCENARIOS_COLLEAGUE,
  oldfriend:  SCENARIOS_OLDFRIEND
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
    cardAtRisk: 'DEVOTION',
    difficulty: 'Hard',
    accent: '#F0883E',
    emoji: '💔'
  },
  mama: {
    id: 'mama', character: 'Mama', you: 'Noor',
    title: 'Noor & Mama',
    relationship: 'Mother / Daughter',
    description: 'She loves you completely and makes it impossible to breathe. You have 23 moves to stay in the room without losing yourself.',
    cardAtRisk: 'DEVOTION',
    difficulty: 'Brutal',
    accent: '#98C379',
    emoji: '🌿'
  },
  baba: {
    id: 'baba', character: 'Baba', you: 'Zain',
    title: 'Zain & Baba',
    relationship: 'Father / Son',
    description: 'He has never said he is proud of you. He has said everything else. You have 23 moves to hear what he has always meant.',
    cardAtRisk: 'DEVOTION',
    difficulty: 'Hard',
    accent: '#E5C07B',
    emoji: '🪔'
  },
  sara: {
    id: 'sara', character: 'Sara', you: 'Hira',
    title: 'Hira & Sara',
    relationship: 'Sisters',
    description: 'She is your sister. She loves you. She has been quietly competing with you for twenty years. You have 23 moves to finally talk about it.',
    cardAtRisk: 'EXCITEMENT',
    difficulty: 'Hard',
    accent: '#C678DD',
    emoji: '🌸'
  },
  colleague: {
    id: 'colleague', character: 'Colleague', you: 'Daniyal',
    title: 'Daniyal & Colleague',
    relationship: 'Workplace Betrayal',
    description: 'He took credit for your work. Now he wants to fix it. Every sentence he says is a political move. You have 23 moves to decide what you actually want from this.',
    cardAtRisk: 'PRESENCE',
    difficulty: 'Hard',
    accent: '#56B6C2',
    emoji: '💼'
  },
  oldfriend: {
    id: 'oldfriend', character: 'Old Friend', you: 'Bilal',
    title: 'Bilal & Old Friend',
    relationship: 'Childhood — Reconnecting',
    description: 'He was your best friend. Then years passed without either of you meaning them to. He reached out. You came. You have 23 moves to find out if what you had still exists.',
    cardAtRisk: 'EXCITEMENT',
    difficulty: 'Medium',
    accent: '#58A6FF',
    emoji: '🕰️'
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
      TC_FLATLINE=8, // Conversation died from silence/disengagement — not conflict
      TC_FAWNING=9;  // 3 consecutive SOFT — appeasement/fawning used to bury the real grievance

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
    this.trust  = this.scenarioId === 'mama' ? 0.62 : 0.80; // mama: already strained

    // Scenario-specific starting states — pre-loaded emotional damage
    if (this.scenarioId === 'mama') {
      this.ns.cortisol = 0.28; this.ns.pfcLoad = 0.22; this.ns.dopamine = 0.62;
      this.ns.computeNLI();
    }
    if (this.scenarioId === 'baba') {
      // Years of unexpressed things — medium pre-load, but very fragile trust
      this.trust = 0.58;
      this.ns.cortisol = 0.22; this.ns.pfcLoad = 0.18; this.ns.dopamine = 0.65;
      this.ns.computeNLI();
    }
    if (this.scenarioId === 'sara') {
      // Sibling competition simmering — cortisol moderate, dopamine lower
      this.trust = 0.60;
      this.ns.cortisol = 0.20; this.ns.pfcLoad = 0.15; this.ns.dopamine = 0.60;
      this.ns.computeNLI();
    }
    if (this.scenarioId === 'colleague') {
      // Professional damage already done — low trust, high cortisol
      this.trust = 0.45;
      this.ns.cortisol = 0.32; this.ns.pfcLoad = 0.25; this.ns.dopamine = 0.55;
      this.ns.computeNLI();
    }
    if (this.scenarioId === 'oldfriend') {
      // Years of distance but no active wound — medium state, fragile warmth
      this.trust = 0.65;
      this.ns.cortisol = 0.15; this.ns.pfcLoad = 0.12; this.ns.dopamine = 0.68;
      this.ns.computeNLI();
    }
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
    const ri = (arr) => Math.floor(Math.random() * arr.length);
    const sc = this._scenes[Math.min(this.move, 22)];
    let choices;

    // ── Per-line options (preferred) ──────────────────────────────────
    // If this scene defines its own soft/aggressive/silent arrays, the options
    // are written to respond to THIS specific line, with several variations
    // each so replays feel fresh. Falls back to generic phase pools otherwise.
    if (sc && Array.isArray(sc.soft) && sc.soft.length
          && Array.isArray(sc.aggressive) && sc.aggressive.length
          && Array.isArray(sc.silent) && sc.silent.length) {
      choices = [
        { text: sc.soft[ri(sc.soft)],             type: SOFT },
        { text: sc.aggressive[ri(sc.aggressive)], type: AGGRESSIVE },
        { text: sc.silent[ri(sc.silent)],         type: SILENT }
      ];
    } else {
      const phase = this.move < 6 ? 0 : this.move < 16 ? 1 : 2;
      const pools = [[P1_SOFT,P1_AGGR,P1_SILE],[P2_SOFT,P2_AGGR,P2_SILE],[P3_SOFT,P3_AGGR,P3_SILE]];
      const [sp, ap, np] = pools[phase];
      choices = [
        { text: sp[ri(sp)], type: SOFT },
        { text: ap[ri(ap)], type: AGGRESSIVE },
        { text: np[ri(np)], type: SILENT }
      ];
    }
    // Shuffle (mirrors std::shuffle in C++)
    for (let i = choices.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }

  // Returns the current scene with hani/subtext resolved to a single string.
  // A scene may define `hani`/`subtext` as an ARRAY of variations — one is
  // picked at random per move (cached) so replays show different wording.
  getCurrentScenario() {
    const idx = Math.min(this.move, 22);
    const sc  = this._scenes[idx];
    if (!sc) return sc;
    if (!this._lineCache) this._lineCache = {};
    if (this._lineCache[idx]) return this._lineCache[idx];
    const pick = (v) => Array.isArray(v) ? v[Math.floor(Math.random()*v.length)] : v;
    const resolved = Object.assign({}, sc, { hani: pick(sc.hani), subtext: pick(sc.subtext) });
    this._lineCache[idx] = resolved;
    return resolved;
  }

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
    const _softGain = { mama:0.003, baba:0.004, sara:0.005, colleague:0.006, oldfriend:0.012 };
    const _aggLoss  = { mama:0.20,  baba:0.19,  sara:0.17,  colleague:0.18,  oldfriend:0.13  };
    const _silLoss  = { mama:0.13,  baba:0.12,  sara:0.11,  colleague:0.12,  oldfriend:0.08  };
    const sid = this.scenarioId;
    if (choiceType === SOFT)          this.trust = Math.min(1, this.trust + (_softGain[sid] ?? 0.01));
    else if (choiceType===AGGRESSIVE) this.trust = Math.max(0, this.trust - (_aggLoss[sid]  ?? 0.14));
    else                              this.trust = Math.max(0, this.trust - (_silLoss[sid]  ?? 0.08));

    // Passive neurological cost per scenario (higher = harder to reach move 23)
    const scenarioMult =
      this.scenarioId === 'mama'      ? 2.2 :   // brutal — emotional contradictions
      this.scenarioId === 'baba'      ? 1.9 :   // hard — decades of silence compound fast
      this.scenarioId === 'sara'      ? 1.8 :   // hard — sibling competition under every word
      this.scenarioId === 'colleague' ? 1.7 :   // hard — professional civility = high PFC load
      this.scenarioId === 'oldfriend' ? 1.3 :   // medium — warmth buffers some damage
      1.0;
    const passiveMult  = (1 + (this.move * 0.04)) * scenarioMult;
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

    // Terminal check — 3 consecutive SOFT moves triggers the fawning ending first
    let tc = (this.softConsec >= 3)
      ? TC_FAWNING
      : checkTerminal(this.cards, this.chess, this.ns, this.stack, this.trust, this.move);
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
      case TC_FAWNING:       return 'FAWN OVERRIDE - APPEASEMENT AS CONTROL';
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
      case TC_FAWNING:       return 'Three soft replies in a row. Not warmth - a tactic.\nEvery grievance soothed before it could land, every accusation dissolved in apology. The other person never got to stay angry, never got to be right, never got to trust their own read of events.\nPsychology calls it fawning: keeping the peace by erasing yourself - and quietly making them doubt they were ever hurt at all.\nThe conflict ended. So did the truth.';
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
