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
  "I hear the loneliness in that. I put it there. I want to take it back."
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
  "This is a lot to unload on someone."
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
  "Okay.",
  "Yeah I get it.",
  "Mm-hm.",
  "[no response]",
  "K.",
  "I hear you.",
  "[closes the chat]",
  "Yeah.",
  "True.",
  "Got it.",
  "...",
  "[reads it twice, says nothing]",
  "Okay.",
  "[puts the phone face down]",
  "..."
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
  "You kept showing up. I didn't. That's the truth."
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
  "I'm starting to feel like nothing I do will be enough."
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
  "I guess.",
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
  "Mm.",
  "[doesn't move]",
  "Yeah, okay.",
  "..."
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
  "Tell me we still have something to work with. I believe we do."
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
  "Fine. Then we're done."
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
  "...",
  "[doesn't disagree]",
  "[long pause, then nothing]",
  "...",
  "[remains very still]"
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
      TC_STACK_OVERFLOW=4, TC_TRUST_FLOOR=5, TC_ALL_CARDS_LOST=6, TC_MAX_MOVES=7;

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
  constructor() { this.reset(); }

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

  getCurrentScenario() { return SCENARIOS[Math.min(this.move, 22)]; }

  processMove(choiceType) {
    if (this.terminalCondition !== TC_NONE) return null;
    const sc = SCENARIOS[this.move];
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
