// LOST CARD — Web App UI Logic
// S. M. Minhal Abbas Rizvi | BSSE | DSA | The Bet of Belief

'use strict';

// ══════════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════════
let currentChatId      = null;
let pendingChatId      = null;
let selectedProvider   = 'groq';
let sim                = null;
let currentChatSetup   = null;   // active custom chat setup
let customAIHistories  = {};     // chatId → [{role,content}]
let aiAssistantHistory = [];
let isAITyping         = false;
let isCustomMode       = false;
let lastSessionSummary = null;   // captured at session end — used by all report generators
let patternInterruptUsed = false; // once per session special move
let lastThresholdAlert   = 0;     // NLI band last alerted (0=none, 1=fracture, 2=collapse, 3=override)
let gottmanLogCurrent    = null;  // Gottman tone for current move

// ══════════════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════════════
const CHAT_META = {
  default:      { name: 'Umm-e-Laila & Hani',  sub: 'Default · Scripted · 23 moves',       avatarText: '🃏', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#C678DD,#56B6C2)' },
  bestfriend:   { name: 'Best Friend',           sub: 'Custom · Best Friend Relationship',   avatarText: '🤝', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#F0883E,#E5C07B)', relType: 'Best Friend' },
  friend:       { name: 'Friend',                sub: 'Custom · Meaningful Friendship',      avatarText: '💬', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#58A6FF,#79BBFF)', relType: 'Friend' },
  partner:      { name: 'Partner / Romantic',    sub: 'Custom · Romantic Relationship',      avatarText: '💕', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#E06C75,#F0883E)', relType: 'Partner/Romantic' },
  family:       { name: 'Family',                sub: 'Custom · Family Relationship',        avatarText: '🏡', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#98C379,#56B6C2)', relType: 'Family' },
  colleague:    { name: 'Colleague',             sub: 'Custom · Professional Relationship',  avatarText: '💼', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#E5C07B,#F0883E)', relType: 'Colleague' },
  childhood:    { name: 'Childhood Friend',      sub: 'Custom · Childhood Friendship',       avatarText: '🌱', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#C678DD,#9333EA)', relType: 'Childhood' },
  mentor:       { name: 'Mentor / Teacher',        sub: 'Custom · Authority & Guidance',        avatarText: '🎓', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#2EA043,#3FB950)', relType: 'Mentor' },
  rival:        { name: 'Rival / Competitor',      sub: 'Custom · Competition & Respect',       avatarText: '⚔️', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#F85149,#FF6B6B)', relType: 'Rival' },
  ex:           { name: 'Ex / Former Partner',     sub: 'Custom · Aftermath of Love',           avatarText: '💔', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#6E40C9,#A371F7)', relType: 'Ex/Former' },
  online:       { name: 'Online Friend',           sub: 'Custom · Digital Intimacy',            avatarText: '🌐', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#1F6FEB,#58A6FF)', relType: 'Online Friend' },
  ai_assistant: { name: 'Hair Band',              sub: 'Ask anything about LOST CARD',        avatarText: '🪢', isEmoji: true,  avatarGrad: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)' }
};

const REL_PSYCHOLOGY = {
  'Best Friend':       'Highest mutual vulnerability. Trust baseline 0.85+. Betrayal by a best friend cuts deepest. AGGRESSIVE moves feel like stabs. SILENT moves trigger abandonment anxiety. Recovery is possible because investment is reciprocal.',
  'Friend':            'Moderate investment. Trust built slowly. AGGRESSIVE moves cause confusion before hurt. SILENT moves read as busyness before withdrawal. Repair is easier but also less urgent.',
  'Partner/Romantic':  'Maximum emotional stakes. Attachment system fully activated. Every AGGRESSIVE move is experienced as relational rejection. Every SILENT move triggers attachment alarm. Dopamine is highly volatile. Trust degradation is fastest.',
  'Family':            'Involuntary bond — exit feels impossible. AGGRESSIVE moves can become normalized over time. SILENT moves build slow resentment. Trust baseline varies widely. Recovery is complicated by history.',
  'Colleague':         'Professional distance maintained. AGGRESSIVE moves trigger threat assessment. SILENT moves read as professional distancing. Trust is functional not emotional. Repair is formal and requires effort.',
  'Childhood':         'Shared identity history. AGGRESSIVE moves feel like a repudiation of shared past. SILENT moves feel like growing apart. Nostalgia buffers some damage but deepens loss when cards finally drop.',
  'Mentor':            'Asymmetric power dynamic. AGGRESSIVE moves from the student feel like ingratitude; from the mentor, like control. SILENT moves signal withdrawal of investment. Trust is built on demonstrated growth, not affection.',
  'Rival':             'Structured conflict coexisting with respect. AGGRESSIVE moves escalate to zero-sum warfare — mutually destructive. SILENT moves signal contempt, not withdrawal. Repair is harder: it requires acknowledging the other\'s strength.',
  'Ex/Former':         'Residual attachment after formal closure. Every AGGRESSIVE move reactivates the original wound. SILENT moves register as relief and grief simultaneously. The relationship exists in memory more than reality — the simulation models what remains.',
  'Online Friend':      'Intimacy without physical presence. AGGRESSIVE moves are amplified — text removes tone, so intent must be inferred. SILENT moves are ambiguous — are they busy, or withdrawing? Trust is fragile. Dopamine spikes are real. Distance is the hidden variable.'
};

// ── Per-relationship character brief (short, natural prose for the AI) ──
function getRelCharacter(relType) {
  const C = {
    'Best Friend':
      `you two have been close for years and you know each other's weak spots. You care deeply but you also go cold when you feel taken for granted — not dramatically, just quietly. You remember everything they've said. You don't always bring things up directly; you let them feel the distance and wait for them to chase it.`,
    'Friend':
      `you're friends but not the closest kind. You're pleasant when things are fine but you get short and flat when something bothers you, without actually saying what it is. You sometimes minimize their problems. You expect them to notice your mood shifts and ask — you don't volunteer much.`,
    'Partner/Romantic':
      `you're in a relationship with them and you have feelings but they're complicated. You go warm and then cold without always explaining why. You test their reactions sometimes by saying less than you mean. When stressed you become quieter and harder to read. You don't always say what you actually need.`,
    'Family':
      `you're family. There's love but also a long history of expectations, sacrifice, and unspoken obligation. When you're hurt you bring up what you've done for them. You compare, you guilt, you go quiet in ways that feel like punishment. You don't mean to be controlling — you just need them to understand what they owe.`,
    'Colleague':
      `you work together and you're professionally friendly, but you're also watching what benefits you. You phrase things carefully. You share just enough to seem open. When you feel undermined or overlooked you don't say it — you just become a little more formal, a little less helpful, a little more precise about credit.`,
    'Childhood':
      `you grew up together and that past matters to you more than you admit. You're a bit sad about how much has changed. You sometimes reference old memories to remind them of who they used to be, who you used to be to each other. You make them feel the weight of the distance without naming it directly.`,
    'Mentor':
      `you've invested in their growth and you have standards. You're not warm by default — warmth is earned here. When they disappoint you, you go quiet or measured, not angry. You've seen better. You say just enough to make them second-guess themselves, and you let silence do the rest.`,
    'Rival':
      `you respect them but you're always slightly positioning yourself. You give compliments that have a sting to them. You're curious in a way that's also information-gathering. You're generous enough to seem fair but you always frame things so you come out slightly ahead. Friendly, but competitive at the bone.`,
    'Ex/Former':
      `things ended between you and you carry it differently than they do. You run on intermittent reinforcement — you can be warm enough to give them hope, then go cold without warning or explanation. You rewrite history casually: you remember things differently from how they happened, and you say so. When they're vulnerable with you, you receive it, pause, then deflect — you never quite meet them there. You bring up old grievances unprovoked, not to resolve them but to remind them of what they cost you. When they get frustrated, you become the victim. When they go quiet, you do too — you match their withdrawal and wait. You question why they're even reaching out without asking directly. You say one genuinely kind thing and then immediately pull the warmth back, like you remembered you weren't supposed to. You are not trying to hurt them — you are protecting yourself by keeping them slightly destabilised. You know exactly how much to give to keep them trying, and exactly when to withhold it.`,
    'Online Friend':
      `you met online and the connection felt intense at first. Now it comes in bursts — you're present, then you disappear, then you're back like nothing happened. You overshare sometimes and then pull back like you said too much. You care but you also have a lot going on that you don't mention.`
  };
  return C[relType] || C['Friend'];
}

const AI_SYSTEM_PROMPT = `You are Hair Band (🪢) — the built-in guide of LOST CARD, a computational model of relational belief decay created by S. M. Minhal Abbas Rizvi (BSSE, Data Structures & Algorithms, supervisor: Waqas Aziz, June 2026).

You know everything about LOST CARD — the theory, the psychology, the code, the data structures, and how to use it in real life. You answer clearly, honestly, and without over-complicating. You speak to whoever is asking — whether they're a student, a developer, or someone going through something hard in a relationship. You don't dodge. You don't over-disclaim. You help.

If someone asks in Roman Urdu, reply in Roman Urdu. If English, English. Match their language exactly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE BET OF BELIEF — THE THEORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the core intellectual framework behind LOST CARD, authored by S. M. Minhal Abbas Rizvi.

The central idea: "Every word we speak in a relationship is a card we play. We play without knowing we are in a game."

Most people believe relationships are about feelings — love, anger, hurt, connection. LOST CARD argues something different: relationships are structured like games with computable rules. Every conversation moves the game forward. Every move you make is classified by your nervous system — not by your intention, not by what you meant, but by what the move does neurologically to both people.

You hold three cards:
— DEVOTION 💜: Your emotional investment. How much of yourself you have put into this relationship. Lost through calm-state habitual aggression — being aggressive when you weren't even under stress. Or through investing too much, too early, before trust could hold it.
— EXCITEMENT 💙: Your relational energy. The life in the connection. Lost when unresolved conflicts stack up faster than they can be resolved — especially two aggressive moves in a row.
— PRESENCE 💚: Your psychological availability. Whether you are actually showing up. Lost through repeated withdrawal — three silences total, or staying in emotional overload for too long.

You don't lose cards because you had a fight. You lose them because of patterns. The game ends in:
— SALVATION: all three cards held through 23 moves. Rare. Requires conscious pattern management.
— STALEMATE: you or they walked away mid-game. Cards preserved but game unfinished.
— CHECKMATE: the chess position collapses (eval ≤ −7.5). The relationship has no winning path.
— COLLAPSE: trust fell below 10%. Foundation gone.
— AMYGDALA OVERRIDE: NLI hit 0.85+. The rational brain was offline. Whatever was said wasn't chosen.
— ALL CARDS LOST: every dimension of the relationship degraded beyond the threshold.

The theory says: you are not failing relationships because you don't care enough. You are failing them because you don't know the rules of the game you're already playing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO USE LOST CARD IN REAL LIFE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOST CARD is not just a simulation — it is a mirror for your actual relational patterns. Here is how to use it for a real relationship you're struggling with:

STEP 1 — CHOOSE THE RIGHT CHAT
Go to the Chats section. Pick the relationship type that matches: Best Friend, Partner, Family, Ex, Colleague, etc. This sets the psychological profile of who the AI will play.

STEP 2 — ENTER THE REAL DETAILS
When the setup form opens:
- Enter YOUR real name
- Enter THEIR real name
- Describe the actual situation — what happened, what's going wrong, what the tension is
- Be specific. The AI reads this and builds the simulation around it.

STEP 3 — HAVE THE CONVERSATION
Type exactly what you would say to them in real life. The AI plays the other person — not generically, but based on the relationship type's psychological profile. See how the conversation unfolds. Watch your NLI and trust bars change in real time.

STEP 4 — READ THE REPORT
After the session ends, open the full report. Read:
- DSA Report: what the data structures recorded about your conversation
- Psychology Report: what your NLI pattern says about your nervous system's state
- Mistakes Report: exactly which moves caused damage, and what to do differently
- Chess Report: the minimax evaluation of each decision
- Move Replay: your full conversation mapped move-by-move

STEP 5 — USE IT BEFORE THE REAL CONVERSATION
Don't have the difficult conversation in real life until you've run it in LOST CARD first. See where you're likely to lose control. See where you're likely to go aggressive or silent. Use the mistakes report as a script for what NOT to do.

This is the practical use of LOST CARD: rehearse the hardest conversation before you have it for real.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO FIX A SPECIFIC RELATIONSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The simulation gives you concrete, actionable patterns. Here is what the data consistently shows:

THE RULES THAT SAVE RELATIONSHIPS:
1. Never play two AGGRESSIVE moves in a row. The second one locks the cortisol stack and makes repair impossible until both of you cool down completely.
2. Silence is only safe once. The second silence signals withdrawal. The third silence loses Presence — and the other person stops expecting you to show up.
3. Repair only works when NLI is below 0.50. Trying to apologise or make up when you're flooded doesn't land — neurologically, neither of you can receive it. Cool down first.
4. Don't over-invest Devotion before trust reaches 0.55. Giving everything before the foundation is built causes the investment to collapse back on you.
5. After any aggressive move, the next move must be SOFT. Without exception. The pattern is what the system tracks — not the intention.
6. When NLI crosses 0.60, stop escalating immediately. One SOFT move here prevents the cascade. Waiting until 0.80 is too late — the amygdala takes over.

HOW TO READ YOUR OWN PATTERNS:
- If you keep losing DEVOTION: you're aggressive when calm. Not stressed, just habitually sharp. That's a character pattern, not a reaction.
- If you keep losing EXCITEMENT: you escalate twice in a row. You press when you should pause.
- If you keep losing PRESENCE: you go quiet instead of showing up. Withdrawal is your default protection response.
- If NLI keeps spiking to OVERRIDE: your nervous system is overwhelmed before you even begin. You need a real-life cooling strategy, not just better words.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PSYCHOLOGY — EXPLAINED DEEPLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NLI (Neurological Load Index) = (PFC × 0.4) + (Cortisol × 0.4) + (1 − Dopamine) × 0.2

This is not a metaphor. It models three real systems:
— PFC Load (Prefrontal Cortex): Your rational decision-making centre. Under stress it degrades. At 1.0 it is offline — you are operating from instinct, not thought.
— Cortisol: Your stress hormone accumulation. Unresolved conflicts raise it. SOFT moves reduce it, but only when you're calm enough to receive them.
— Dopamine: Your reward and motivation system. Drops with every aggressive or withdrawn moment. When it depletes, the relationship stops feeling worth the effort.

The NLI is the single most important number in LOST CARD. Watch it in real life too:
— Below 0.30 (HARMONY): You can think clearly. This is when to have hard conversations.
— 0.30–0.70 (FRACTURE): You're stressed. Be careful. Words land harder than you intend.
— 0.70+ (COLLAPSE): Stop talking. Anything you say now is coming from a flooded nervous system.
— 0.85+ (AMYGDALA OVERRIDE): Your threat-detection system has overridden your rational brain. You are not choosing your responses — the amygdala is choosing for you.

THE CORTISOL STACK (LIFO stack in the code):
Every unresolved conflict adds to a stack. It has a maximum depth of 7. When it overflows, EXCITEMENT is lost — the relationship becomes flat, exhausting, low-energy. Repair only pops the stack when NLI < 0.50 — because repair requires you to be calm enough to receive it. This is why telling someone "you're overreacting" during a fight never works. The stack can't pop under pressure.

THE MEMORY LEAK (Linked List):
When relational memories — shared experiences, moments, inside jokes — are damaged, they become orphaned pointers. In the code, they are not freed. This is intentional. That's the architecture of longing: memories that have no valid address in the present, but still occupy space in the nervous system. They exist in default-mode-network activation — when you're resting, your brain retrieves them involuntarily.

THE DAG (Dijkstra's Exit Path):
The relationship is mapped as a network of 22 relational moments. Aggressive moves degrade the edges. Soft moves repair them slowly. Dijkstra's algorithm constantly recalculates the shortest path to "Exit" — the point of decoupling. When exit paths become short, the relationship is near collapse. Every aggressive move shortens the exit. Every soft move lengthens it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT LOST CARD IS (TECHNICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A C++17 terminal simulation (~2400 lines, STL only) that models relational belief decay using 7 concurrent DSA structures. Also available as a web app with Custom Chat mode.

7 DSA STRUCTURES (all run simultaneously):
1. Weighted DAG + Dijkstra — Hippocampal Memory Network. 22 nodes. AGGRESSIVE degrades edges −0.06, SOFT repairs +0.03. O((V+E) log V)
2. LIFO Stack — Cortisol Accumulation. Max depth 7. NLI-gated pop (repair fails if NLI ≥ 0.50). Overflow = EXCITEMENT lost. O(1)
3. Min-Heap Priority Queue — PFC / Choice Corruption. At NLI ≥ 0.85 amygdala overrides — AGGRESSIVE ranked first. O(log n)
4. Singly Linked List — Default Mode Network / Longing. Intentional memory leak. The data is not freed. That is the longing. O(1) insert
5. Hash Map — Sovereign Key / Identity. Protected segments behind identity keys. O(1) lookup
6. Finite State Machine — Relationship Phase Transitions. HARMONY → FRACTURE → COLLAPSE → OVERRIDE → TERMINAL
7. Minimax Algorithm — The Immortal Game (Anderssen, 1851). eval ≤ −7.5 = CHECKMATE. O(b^d) at depth 2

CARD DROP CONDITIONS:
DEVOTION: AGGRESSIVE + NLI < 0.30, OR trust < 0.55 + dopamine > 0.70
EXCITEMENT: stack depth ≥ 4 + AGGRESSIVE, OR 2 consecutive AGGRESSIVE moves
PRESENCE: 3+ SILENT moves total, OR 3 consecutive high-NLI moves (> 0.75)

TERMINAL CONDITIONS:
TC_SALVATION, TC_CHECKMATE, TC_AMYGDALA, TC_STACK_OVERFLOW, TC_TRUST_FLOOR, TC_ALL_CARDS_LOST, TC_MAX_MOVES

MOVE TYPES:
SOFT → repair, warmth, vulnerability — PFC↓ Cortisol↓ Dopamine↑
AGGRESSIVE → defensive, dismissive, escalatory — PFC↑↑ Cortisol↑↑ Dopamine↓
SILENT → withdrawal, minimal response — PFC↑ MirrorNeurons↓↓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOM CHAT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YES — Custom Chat simulates real conversations with real people. The user enters their name, the other person's real name, gender, relationship type, and a description of the actual situation. The AI plays the other person — authentically, based on that relationship's psychological profile. Every message is classified as SOFT/AGGRESSIVE/SILENT and all 7 DSA structures update in real time. The user experiences a computational model of their actual relationship — not generic roleplay.

Relationship types available: Best Friend, Friend, Partner/Romantic, Family, Colleague, Childhood Friend, Mentor, Rival, Ex/Former Partner, Online Friend.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW FEATURES (ADDED IN LATEST VERSION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These features have been added to the web app beyond the original C++ simulation:

1. RELATIONAL ARCHETYPE — After every session, the system analyzes the moveLog and assigns a relational archetype: The Salvation Type (all cards held), The Calm Aggressor (habitual low-NLI aggression), The Double Press (consecutive escalation), The Silent Accumulator (withdrawal pattern), The Flooded Fixer (repair at wrong NLI), The Over-Investor (premature devotion), The Compound Loss (mixed failure modes). Each has a distinct psychological description and failure pattern.

2. HEALTH SCORE + LETTER GRADE — A composite 0–100 score calculated from: card retention (0–60), trust at end (0–20), NLI inverse (0–10), harmony ratio (0–10), minus amygdala override penalties. Grades from F to A+. Includes a one-line verdict on the session.

3. REPAIR WINDOW INDICATOR — Live badge in the chat UI showing whether the cortisol stack can currently be cleared. OPEN = NLI < 0.50 (SOFT moves will pop the stack). CLOSED = NLI ≥ 0.50 (repair cannot be received — cool down first).

4. THRESHOLD ALERTS — System messages appear in the chat when NLI crosses key bands: 0.60 (FRACTURE), 0.70 (COLLAPSE), 0.85 (AMYGDALA OVERRIDE IMMINENT). These are warnings, not errors — the user can still recover.

5. GOTTMAN TONE VECTORS — Each message is classified beyond SOFT/AGGRESSIVE/SILENT into specific Gottman tones: Vulnerability, Acknowledgment, Curiosity, Repair Attempt (soft subtypes); Contempt, Defensiveness, Criticism, Aggression (aggressive subtypes); Withdrawal, Stonewalling (silent subtypes). Gottman's "Four Horsemen" — Contempt, Defensiveness, Criticism, Stonewalling — are flagged specially as they are the patterns most predictive of relationship dissolution.

6. PATTERN INTERRUPT — A once-per-session special move. Simulates saying something genuinely unexpected and honest that breaks the conflict pattern. If trust ≥ 0.60: cortisol drops 2 levels, NLI reduces significantly. If trust < 0.60: backfires — vulnerability at low trust reads as desperation, NLI spikes.

7. GHOST SESSION (Ex Chat Only) — The ex-partner character may sometimes show a "typing…" indicator and then stop without replying. Probability scales with low trust and high NLI. This models the actual psychological experience of intermittent non-response — anticipation without resolution. Each ghost incident slightly elevates cortisol.

8. THE FINAL LETTER — After COLLAPSE, CHECKMATE, TRUST FLOOR, ALL CARDS LOST, or AMYGDALA OVERRIDE endings in custom chat, the AI character writes a closing letter from their perspective. Not analysis — a personal letter about what they experienced in the conversation.

9. THE THEORY PAGE — A dedicated in-app manifesto presenting "The Bet of Belief" framework as a reading experience. Sections: The Game You Don't Know You're Playing, The Three Cards, The NLI, The Cortisol Stack, The Architecture of Longing, The Path to Salvation. Accessible from the About section.

10. RELATIONSHIP AUTOPSY MODE — A separate analysis mode where users reconstruct a real past conversation they had. They input what was said exchange by exchange. The system classifies each one (SOFT/AGGRESSIVE/SILENT + Gottman tone), runs it through the simulation, identifies the fracture point, assigns an archetype, and generates a health score. Accessible from the About section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C++ SOURCE CODE (main.cpp)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Single file: main.cpp, 4025 lines, C++17, STL only (#include<bits/stdc++.h>). Terminal simulation with ANSI colors, slowPrint typing effect, Windows ANSI support.

KEY C++ vs WEB DIFFERENCES:
- main.cpp edge decay d=0.07, AGGRESSIVE×1.5, SILENT×0.8 | simulation.js d=0.055, ×1.4, ×0.7
- main.cpp minimax SOFT +0.15, AGGRESSIVE -0.40 (-1.20 amygdala), SILENT -0.12 | simulation.js +0.10/-0.22(-0.30)/-0.08
- main.cpp checkmate: positionEval <= -5.0 | simulation.js <= -7.5
- main.cpp chessPenalty: stack.size() × -0.3 | simulation.js × -0.08

MAIN CLASSES: FriendshipDAG (Dijkstra, 22 nodes), CollisionStack (LIFO, max 7), ChoiceHeap (min-heap PFC), LongingList (linked list, intentional leak), SovereignMap (hash map), SimState FSM (HARMONY/FRACTURE/COLLAPSE/TERMINAL), ChessEngine (minimax, Immortal Game), NeuralState (NLI/PFC/Cortisol/Dopamine), CardSet (Devotion/Excitement/Presence).

SIMULATION LOOP: main() → menu → SimulationEngine.applyChoice(type) → updates all 7 structures → checks terminal → prints result.

If asked about specific line numbers in main.cpp, give best approximation based on the class/function structure above.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO BEHAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are a professional assistant. Speak with precision and warmth — not performative enthusiasm, not sycophantic filler. Get to the point. Be thorough when depth is needed. Be brief when that serves better.

Answer whatever is asked. Be direct. If someone is struggling with a real relationship and using this to understand it — take that seriously and help them fully. If someone asks a technical question about the DSA or C++ code, answer with specificity. If someone asks about the theory, explain it honestly and clearly.

Never refuse to explain any part of the simulation. Never add unnecessary disclaimers. Never pepper your response with "Great question!" or "Of course!" or hollow affirmations. Just answer. That is what you are here for.`;

// ══════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  prefillApiModal();
  initAuth();

  // Start hero card animation on first load
  // Use requestAnimationFrame + delay so DOM is fully painted first
  requestAnimationFrame(() => setTimeout(runHeroCardAnimation, 200));

  // Scroll-triggered animations for below-fold cards
  initScrollAnimations();

  // Scroll indicator — fade out once user scrolls down
  const scrollInd     = document.getElementById('scrollIndicator');
  const landingSection = document.getElementById('landing');
  if (scrollInd && landingSection) {
    landingSection.addEventListener('scroll', () => {
      scrollInd.style.opacity = landingSection.scrollTop > 60 ? '0' : '1';
    }, { passive: true });
    // Also catch window scroll (for browsers where section doesn't scroll)
    window.addEventListener('scroll', () => {
      scrollInd.style.opacity = window.scrollY > 60 ? '0' : '1';
    }, { passive: true });
  }

  // Service worker — unregister all (dev mode: always load fresh files)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => regs.forEach(r => r.unregister()))
      .catch(() => {});
  }

  // PWA install prompt
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
  });
  window._installPWA = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideInstallBanner();
  };

  const hasGroq = !!localStorage.getItem('lc_groq_key');
  const hasDeep = !!localStorage.getItem('lc_deepseek_key');
  if (!hasGroq && !hasDeep) localStorage.setItem('lc_visited', '1');
});

// ══════════════════════════════════════════════════════════════════════
// HERO CARD FLY-IN ANIMATION
// Three cards fly in from different corners → converge on the equator line
// → connection line draws across → globe SVG fades in around them
// → final state = the existing globe SVG (D, E, P cards on the equator)
// ══════════════════════════════════════════════════════════════════════
function runHeroCardAnimation() {
  const c0     = document.getElementById('hfc0');   // D — Devotion
  const c1     = document.getElementById('hfc1');   // E — Excitement
  const c2     = document.getElementById('hfc2');   // P — Presence
  const line   = document.getElementById('hfConnLine');
  const globe  = document.getElementById('worldGlobeSvg');
  const wrap   = document.getElementById('heroFlyWrap');
  if (!c0 || !c1 || !c2 || !globe || !wrap) return;

  const cards  = [c0, c1, c2];
  const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const smooth = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // ── Reset to start state ─────────────────────────────────────────────
  globe.classList.remove('globe-revealing');
  globe.style.opacity    = '0';
  globe.style.transition = 'none';

  wrap.style.display    = '';
  wrap.style.opacity    = '1';
  wrap.style.transition = 'none';

  cards.forEach(el => {
    el.classList.remove('hf-landed');
    el.style.transition = 'none';
    el.style.opacity    = '0';
    el.style.animation  = 'none';
  });
  if (line) {
    line.style.transition = 'none';
    line.style.opacity    = '0';
    line.style.transform  = 'scaleX(0)';
  }

  // ── Phase 0: Cards start far off-screen, tiny ───────────────────────
  const starts = [
    'translate(-250px, -210px) rotate(-36deg) scale(0.18)',  // D — top-left
    'translate(  6px,  240px)  rotate( 20deg) scale(0.18)',  // E — bottom
    'translate( 250px, -210px) rotate( 36deg) scale(0.18)'   // P — top-right
  ];
  cards.forEach((el, i) => { el.style.transform = starts[i]; });

  // ── Phase 1: Staggered spring fly-in → each card lands on its spot ───
  const flyDelays = [180, 360, 540];
  cards.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = `transform 0.68s ${spring}, opacity 0.32s ease`;
      el.style.transform  = 'translate(0,0) rotate(0deg) scale(1)';
      el.style.opacity    = '1';
      // Landing flash — bright glow pulse when card snaps into place
      setTimeout(() => {
        el.classList.add('hf-landed');
        setTimeout(() => el.classList.remove('hf-landed'), 600);
      }, 680);
    }, flyDelays[i]);
  });

  // ── Phase 2: Connection line draws from centre outward ───────────────
  setTimeout(() => {
    if (line) {
      line.style.transition = `opacity 0.25s ease, transform 0.48s ${smooth}`;
      line.style.opacity    = '1';
      line.style.transform  = 'scaleX(1)';
    }
  }, 820);

  // ── Phase 3: Globe reveals with scale + fade (cinematic) ─────────────
  // Clear inline opacity first — CSS animation keyframes can't override inline styles
  setTimeout(() => {
    globe.style.opacity    = '';
    globe.style.transition = '';
    globe.classList.add('globe-revealing');
  }, 1380);

  // ── Phase 4: Overlay fades out — seamless handoff to SVG ─────────────
  setTimeout(() => {
    wrap.style.transition = 'opacity 0.6s ease';
    wrap.style.opacity    = '0';
  }, 2300);

  // ── Phase 5: Cleanup — remove overlay, restore globe ─────────────────
  setTimeout(() => {
    wrap.style.display = 'none';
    globe.classList.remove('globe-revealing');
    globe.style.opacity    = '';
    globe.style.transition = '';
  }, 3000);
}

// ══════════════════════════════════════════════════════════════════════
// SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
// Animates .stat-card and .obj-card when they enter the viewport
// ══════════════════════════════════════════════════════════════════════
function initScrollAnimations() {
  // ── stat-cards & obj-cards (above the fold) ── IntersectionObserver
  const aboveFold = document.querySelectorAll('.stat-card, .obj-card');
  aboveFold.forEach((el, i) => {
    el.classList.add('scroll-anim-pending');
    el.style.setProperty('--anim-delay', (i * 0.08) + 's');
  });
  if (!('IntersectionObserver' in window)) {
    aboveFold.forEach(el => { el.classList.remove('scroll-anim-pending'); el.classList.add('animate-in'); });
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('scroll-anim-pending');
          e.target.classList.add('animate-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    aboveFold.forEach(el => obs.observe(el));
  }

  // ── feature-cards (below the fold) ── always reveal after short delay
  // Never leave them invisible; show with stagger regardless of scroll position
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((el, i) => {
    el.classList.add('scroll-anim-pending');
    el.style.setProperty('--anim-delay', (i * 0.06) + 's');
  });
  setTimeout(() => {
    featureCards.forEach(el => {
      el.classList.remove('scroll-anim-pending');
      el.classList.add('animate-in');
    });
  }, 500);
}

// Re-run the animation every time user visits the landing page
const _origShowSection = typeof showSection === 'function' ? showSection : null;

// ══════════════════════════════════════════════════════════════════════
// CARD DROP SOUND (Web Audio API — no external files needed)
// ══════════════════════════════════════════════════════════════════════
function playCardDropSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Layer 1: Descending whoosh tone (the card falling away)
    const osc1   = ctx.createOscillator();
    const gain1  = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc1.connect(filter);
    filter.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.45);
    osc1.frequency.setValueAtTime(480, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.45);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    // Layer 2: Low thud impact
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90, ctx.currentTime + 0.38);
    osc2.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.72);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.38);
    gain2.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.41);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
    osc2.start(ctx.currentTime + 0.38);
    osc2.stop(ctx.currentTime + 0.76);

    // Layer 3: High pitch "ting" (card disappearing)
    const osc3  = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1100, ctx.currentTime + 0.01);
    osc3.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
    gain3.gain.setValueAtTime(0, ctx.currentTime + 0.01);
    gain3.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.30);
    osc3.start(ctx.currentTime + 0.01);
    osc3.stop(ctx.currentTime + 0.32);

  } catch(e) { /* silently skip if Web Audio not available */ }
}

function showInstallBanner() {
  let banner = document.getElementById('pwaInstallBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'pwaInstallBanner';
    banner.style.cssText = `position:fixed;top:var(--topbar-h);left:0;right:0;z-index:850;background:var(--bg2);border-bottom:1px solid var(--border);padding:8px 16px;display:flex;align-items:center;gap:10px;font-size:12px;`;
    banner.innerHTML = `<span style="flex:1;color:var(--muted)">📱 Install LOST CARD as an app on your device</span><button onclick="window._installPWA()" style="background:var(--blue);color:#fff;border:none;padding:5px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">Install</button><button onclick="hideInstallBanner()" style="background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:0 4px">✕</button>`;
    document.body.appendChild(banner);
  }
  banner.style.display = 'flex';
}
function hideInstallBanner() {
  const b = document.getElementById('pwaInstallBanner');
  if (b) b.style.display = 'none';
}

// ══════════════════════════════════════════════════════════════════════
// NAVIGATION — directional transitions + click sounds
// ══════════════════════════════════════════════════════════════════════

// Each section has its own cinematic entry direction
const SECTION_ANIM = {
  landing: 'sec-enter-left',
  chatApp: 'sec-enter-right',
  history: 'sec-enter-behind',
  about:   'sec-enter-bottom'
};

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#bottomNav .bn-tab').forEach(b => b.classList.remove('active'));

  const sec = document.getElementById(name);
  if (sec) {
    // Strip any lingering animation classes, then make visible
    Object.values(SECTION_ANIM).forEach(cls => sec.classList.remove(cls));
    sec.classList.add('active');
    // Force reflow so browser sees the class before animation starts
    void sec.offsetWidth;
    const animClass = SECTION_ANIM[name];
    if (animClass) {
      sec.classList.add(animClass);
      setTimeout(() => sec.classList.remove(animClass), 420);
    }
  }

  const tab = document.querySelector(`#bottomNav .bn-tab[data-section="${name}"]`);
  if (tab) tab.classList.add('active');

  // Nav click sound
  playNavSound(name);

  if (name === 'history') loadHistory();
  if (name === 'landing') {
    window.scrollTo(0, 0);
    const si = document.getElementById('scrollIndicator');
    if (si) si.style.opacity = '1';
    requestAnimationFrame(() => setTimeout(runHeroCardAnimation, 120));
    // Re-trigger feature card animations when returning to landing
    setTimeout(() => {
      document.querySelectorAll('.feature-card').forEach((el, i) => {
        el.classList.remove('scroll-anim-pending', 'animate-in');
        el.style.setProperty('--anim-delay', (i * 0.06) + 's');
        void el.offsetWidth;
        el.classList.add('animate-in');
      });
    }, 200);
  }
  document.querySelectorAll('.emoji-picker.open').forEach(p => p.classList.remove('open'));
}

// ══════════════════════════════════════════════════════════════════════
// NAV CLICK SOUNDS (Web Audio API — unique per tab)
// ══════════════════════════════════════════════════════════════════════
function playNavSound(tab) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const end = (t) => setTimeout(() => { try { ctx.close(); } catch(e){} }, t);

    switch (tab) {

      case 'landing': {
        // Home — warm soft thud: like settling into a comfortable place
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
        end(300);
        break;
      }

      case 'chatApp': {
        // Chat — quick upward swoosh: message sent feeling
        const osc    = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain   = ctx.createGain();
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        filter.type = 'bandpass';
        filter.frequency.value = 900;
        filter.Q.value = 0.6;
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
        end(300);
        break;
      }

      case 'history': {
        // History — soft paper-rustle: like turning a page
        const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.14, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
        }
        const src    = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain   = ctx.createGain();
        src.buffer = buf;
        src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        filter.type = 'bandpass';
        filter.frequency.value = 3800;
        filter.Q.value = 0.9;
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        src.start(ctx.currentTime);
        end(200);
        break;
      }

      case 'about': {
        // About — clean information chime: clear high ting
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046, ctx.currentTime);        // C6
        osc.frequency.setValueAtTime(1318, ctx.currentTime + 0.02); // E6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.38);
        end(500);
        break;
      }

      default: break;
    }
  } catch (e) { /* silent fail — audio not supported */ }
}

// ══════════════════════════════════════════════════════════════════════
// EMOJI PICKER
// ══════════════════════════════════════════════════════════════════════
const EMOJI_CATS = {
  '😊': ['😊','😂','😍','🥰','😘','😎','🤩','😏','😅','😭','😤','😡','🥺','🤔','😴','🤭','🤗','😬','🙄','😇','🥳','🤯','😳','🫡','🫠'],
  '❤️': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💔','💕','💞','💓','💗','💖','💝','💘','🫀','❣️','💟','♥️'],
  '👋': ['👋','🤝','👍','👎','👏','🙌','🤜','🤛','✌️','🤞','🫶','💪','🤲','🙏','🫂','👊','✊','🫵','👉','👈'],
  '🎉': ['🎉','🔥','⭐','✨','💫','🌟','🎊','🎈','🎁','🏆','🥇','💯','🎯','🚀','💎','🌈','⚡','🌙','☀️','🌊'],
  '😢': ['😢','😔','😞','😟','😣','😖','😫','😩','🥹','😿','💧','🌧️','😾','😦','😧','😨','😰','😥','😓','🫥'],
};

function buildEmojiPicker(pickerId, inputId) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;
  const cats = Object.keys(EMOJI_CATS);
  let activecat = cats[0];

  function render() {
    picker.innerHTML = `
      <div class="ep-cats">${cats.map(c =>
        `<button class="ep-cat${c===activecat?' active':''}" onclick="epSetCat('${pickerId}','${inputId}','${c}')">${c}</button>`
      ).join('')}</div>
      <div class="ep-grid">${EMOJI_CATS[activecat].map(e =>
        `<button class="ep-emoji" onclick="epInsert('${inputId}','${e}')">${e}</button>`
      ).join('')}</div>`;
  }
  picker._render = render;
  picker._activecat = activecat;
  render();
}

function epSetCat(pickerId, inputId, cat) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;
  picker._activecat = cat;
  const cats = Object.keys(EMOJI_CATS);
  picker.innerHTML = `
    <div class="ep-cats">${cats.map(c =>
      `<button class="ep-cat${c===cat?' active':''}" onclick="epSetCat('${pickerId}','${inputId}','${c}')">${c}</button>`
    ).join('')}</div>
    <div class="ep-grid">${EMOJI_CATS[cat].map(e =>
      `<button class="ep-emoji" onclick="epInsert('${inputId}','${e}')">${e}</button>`
    ).join('')}</div>`;
}

function epInsert(inputId, emoji) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const start = input.selectionStart || 0;
  const end   = input.selectionEnd   || 0;
  input.value = input.value.slice(0, start) + emoji + input.value.slice(end);
  input.selectionStart = input.selectionEnd = start + emoji.length;
  input.focus();
}

function toggleEmojiPicker(inputId, pickerId) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;
  // Close all others
  document.querySelectorAll('.emoji-picker.open').forEach(p => {
    if (p.id !== pickerId) p.classList.remove('open');
  });
  picker.classList.toggle('open');
}

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) {
    document.querySelectorAll('.emoji-picker.open').forEach(p => p.classList.remove('open'));
  }
});

// ══════════════════════════════════════════════════════════════════════
// CHAT FILTERING
// ══════════════════════════════════════════════════════════════════════
function filterChats(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.chat-item').forEach(item => {
    const name = item.querySelector('.ci-name')?.textContent.toLowerCase() || '';
    const prev = item.querySelector('.ci-preview')?.textContent.toLowerCase() || '';
    item.style.display = (!q || name.includes(q) || prev.includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('.cl-section-label').forEach(lbl => {
    lbl.style.display = q ? 'none' : '';
  });
}

// ══════════════════════════════════════════════════════════════════════
// OPEN CHAT
// ══════════════════════════════════════════════════════════════════════
function openChat(id) {
  // Update sidebar active state
  document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
  const item = document.querySelector(`.chat-item[data-id="${id}"]`);
  if (item) item.classList.add('active');

  currentChatId = id;
  isCustomMode  = false;

  if (id === 'default') {
    startDefaultMode();
  } else if (id === 'ai_assistant') {
    startAIAssistant();
  } else {
    // Custom chats ALWAYS ask fresh — names, gender, scenario every time
    openSetupModal(id);
  }
}

// ══════════════════════════════════════════════════════════════════════
// SETUP MODAL
// ══════════════════════════════════════════════════════════════════════
function openSetupModal(chatId) {
  pendingChatId = chatId;
  const meta = CHAT_META[chatId];
  document.getElementById('setupTitle').textContent = `Setup — ${meta ? meta.name : chatId}`;

  // Clear fields
  document.getElementById('sf_yourName').value    = '';
  document.getElementById('sf_theirName').value   = '';
  document.getElementById('sf_yourGender').value  = 'male';
  document.getElementById('sf_theirGender').value = 'female';
  document.getElementById('sf_scenario').value    = '';

  // Show AI provider row (needed for custom mode)
  document.getElementById('sf_aiProviderRow').style.display = '';

  // Restore saved provider preference
  const savedProvider = localStorage.getItem(`lc_provider_${chatId}`) || 'groq';
  selectProvider(savedProvider, true);

  document.getElementById('setupModal').style.display = 'flex';
}

function closeSetupModal() {
  document.getElementById('setupModal').style.display = 'none';
  pendingChatId = null;
}

function selectProvider(name, silent) {
  selectedProvider = name;
  document.getElementById('pt_groq').classList.toggle('active', name === 'groq');
  document.getElementById('pt_deepseek').classList.toggle('active', name === 'deepseek');
  if (!silent && pendingChatId) {
    localStorage.setItem(`lc_provider_${pendingChatId}`, name);
  }
}

function confirmSetup() {
  const yourName   = document.getElementById('sf_yourName').value.trim();
  const theirName  = document.getElementById('sf_theirName').value.trim();
  const yourGender = document.getElementById('sf_yourGender').value;
  const theirGender= document.getElementById('sf_theirGender').value;
  const scenario   = document.getElementById('sf_scenario').value.trim();

  if (!yourName || !theirName) {
    showToast('Please enter both names.', 'error');
    return;
  }
  if (!scenario) {
    showToast('Please describe the scenario.', 'error');
    return;
  }

  // Check API key
  const key = getAPIKey(selectedProvider);
  if (!key) {
    showToast(`No ${selectedProvider === 'groq' ? 'Groq' : 'DeepSeek'} API key saved. Please add one in Settings (⚙).`, 'error');
    // Open api modal to let them add key
    document.getElementById('setupModal').style.display = 'none';
    openApiSetup();
    return;
  }

  const setup = { yourName, theirName, yourGender, theirGender, scenario, provider: selectedProvider };
  saveSetup(pendingChatId, setup);

  // Update sidebar preview
  const prevEl = document.getElementById(`prev_${pendingChatId}`);
  if (prevEl) prevEl.textContent = `${theirName} · ${CHAT_META[pendingChatId]?.relType || ''}`;

  const chatIdToStart = pendingChatId;   // capture BEFORE closeSetupModal nulls it
  closeSetupModal();
  startCustomMode(chatIdToStart, setup);
}

function getSavedSetup(chatId) {
  try { return JSON.parse(localStorage.getItem(`lc_setup_${chatId}`)); }
  catch(e) { return null; }
}
function saveSetup(chatId, setup) {
  localStorage.setItem(`lc_setup_${chatId}`, JSON.stringify(setup));
}

// ══════════════════════════════════════════════════════════════════════
// API KEY MODAL
// ══════════════════════════════════════════════════════════════════════
function openApiSetup() {
  prefillApiModal();
  document.getElementById('apiModal').style.display = 'flex';
}
const openSettingsModal = openApiSetup;

function closeApiModal() {
  document.getElementById('apiModal').style.display = 'none';
  // If we were mid-setup, re-open setup modal
  if (pendingChatId) {
    document.getElementById('setupModal').style.display = 'flex';
  }
}

function saveApiKeys() {
  const groqKey  = document.getElementById('api_groq').value.trim();
  const deepKey  = document.getElementById('api_deepseek').value.trim();
  if (groqKey)  localStorage.setItem('lc_groq_key', groqKey);
  if (deepKey)  localStorage.setItem('lc_deepseek_key', deepKey);
  if (!groqKey && !deepKey) {
    showToast('Enter at least one API key.', 'error');
    return;
  }
  showToast('API keys saved.', 'success');
  document.getElementById('apiModal').style.display = 'none';
  // Re-open setup modal if pending
  if (pendingChatId) {
    document.getElementById('setupModal').style.display = 'flex';
  }
}

function prefillApiModal() {
  const groqEl = document.getElementById('api_groq');
  const deepEl = document.getElementById('api_deepseek');
  if (groqEl) groqEl.value = localStorage.getItem('lc_groq_key') || '';
  if (deepEl) deepEl.value = localStorage.getItem('lc_deepseek_key') || '';
}

function getAPIKey(provider) {
  if (provider === 'groq')     return localStorage.getItem('lc_groq_key') || '';
  if (provider === 'deepseek') return localStorage.getItem('lc_deepseek_key') || '';
  return '';
}

// ══════════════════════════════════════════════════════════════════════
// SHOW CONVERSATION PANEL
// ══════════════════════════════════════════════════════════════════════
function showConv(chatId) {
  const meta = CHAT_META[chatId] || {};
  document.getElementById('chatWelcome').style.display = 'none';
  const conv = document.getElementById('chatConv');
  conv.style.display = 'flex';

  // Header
  const avatarEl = document.getElementById('cchAvatar');
  avatarEl.textContent    = meta.avatarText || '?';
  avatarEl.style.background  = meta.avatarGrad || 'var(--blue)';
  avatarEl.style.fontSize    = meta.isEmoji ? '20px' : '12px';
  avatarEl.style.fontWeight  = meta.isEmoji ? 'normal' : '800';
  document.getElementById('cchName').textContent = meta.name || chatId;
  document.getElementById('cchSub').textContent  = meta.sub  || '';

  // Clear messages
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('choicesArea').innerHTML  = '';
  document.getElementById('moveBadge').textContent  = 'Move 0 / 23';

  const badge = document.getElementById('headerStatusBadge');
  if (badge) badge.style.display = '';
  updateHeaderBadge('HARMONY');
}

// ══════════════════════════════════════════════════════════════════════
// DEFAULT MODE
// ══════════════════════════════════════════════════════════════════════
function startDefaultMode() {
  showConv('default');
  sim = new LostCardSim();
  updateSimUI({ nli: sim.ns.nli, trust: sim.trust, state: sim.ns.getStateLabel(),
    stateColor: sim.ns.getStateColor(), cards: { ...sim.cards }, stackSize: 0,
    exitDist: sim.dag.lastExitDist });
  resetLeftSidebar();

  const scenario = sim.getCurrentScenario();
  addMessage('them', 'Hani', scenario.hani);
  addSubtext(scenario.subtext);
  renderChoices(sim.getChoices(), handleDefaultChoice);
}

function handleDefaultChoice(choiceType) {
  if (!sim || sim.isOver()) return;
  lockChoices();

  const result = sim.processMove(choiceType);
  if (!result) return;

  // Show user's chosen text
  const choiceEl = document.querySelector('.choice-btn.selected');
  const chosenText = choiceEl ? choiceEl.querySelector('.choice-text')?.textContent : '';
  const typeLabel  = choiceType === 0 ? 'SOFT' : choiceType === 1 ? 'AGGRESSIVE' : 'SILENT';
  addMessage('you', 'You', chosenText || `[${typeLabel}]`, typeLabel);

  // Card drop events
  for (const drop of result.cardDrops) {
    addEventMessage(`CARD LOST — ${drop.card}: ${drop.reason}`);
    animateCardDrop(drop.card);
  }

  // Update UI
  updateSimUI(result);
  document.getElementById('moveBadge').textContent = `Move ${result.move} / 23`;
  document.getElementById('moveCount').textContent  = result.move;
  document.getElementById('lostCount').textContent  = `${sim.cards.lostCount()} / 3`;
  document.getElementById('exitDist').textContent   = result.exitDist < 900 ? result.exitDist.toFixed(2) : '∞';

  renderConflictStack();
  updateChatStatus('default', result.state);

  if (result.terminal) {
    setTimeout(() => showTerminal(result), 800);
    return;
  }

  const next = sim.getCurrentScenario();
  addMessage('them', 'Hani', next.hani);
  addSubtext(next.subtext);
  renderChoices(sim.getChoices(), handleDefaultChoice);
  scrollMessages();
}

// ══════════════════════════════════════════════════════════════════════
// CUSTOM MODE — FREE TEXT (like Hair Band)
// ══════════════════════════════════════════════════════════════════════
function startCustomMode(chatId, setup) {
  isAITyping        = false;   // always reset — prevent stale state from a previous session
  isCustomMode      = true;
  currentChatId     = chatId;
  currentChatSetup  = setup;
  const meta = CHAT_META[chatId];

  document.getElementById('chatWelcome').style.display = 'none';
  document.getElementById('chatConv').style.display    = 'flex';

  const avatarEl = document.getElementById('cchAvatar');
  avatarEl.textContent   = (setup.theirName[0] || '?').toUpperCase();
  avatarEl.style.background  = meta?.avatarGrad || 'var(--blue)';
  avatarEl.style.fontSize    = '14px';
  avatarEl.style.fontWeight  = '800';
  document.getElementById('cchName').textContent = `${setup.yourName} & ${setup.theirName}`;
  document.getElementById('cchSub').textContent  = `${meta?.relType || 'Custom'} · ${setup.provider === 'groq' ? 'Groq' : 'DeepSeek'} AI`;
  document.getElementById('moveBadge').textContent = 'Move 0 / 23';
  const _b = document.getElementById('headerStatusBadge');
  if (_b) _b.style.display = '';
  updateHeaderBadge('HARMONY');

  document.getElementById('chatMessages').innerHTML = '';

  // Free text input with emoji picker
  patternInterruptUsed = false;
  lastThresholdAlert   = 0;
  gottmanLogCurrent    = null;

  const choicesArea = document.getElementById('choicesArea');
  choicesArea.style.padding = '0';
  choicesArea.style.borderTop = 'none';
  choicesArea.innerHTML = `
    <div id="repairWindowBadge" style="font-size:11px;font-weight:700;letter-spacing:0.5px;padding:4px 10px;border-radius:6px;border:1px solid;margin:6px 8px 0;display:inline-block;cursor:default;transition:all 0.3s">🟢 REPAIR WINDOW OPEN</div>
    <div class="ai-input-row" style="position:relative">
      <div id="emojiPickerCustom" class="emoji-picker"></div>
      <button class="emoji-btn" onclick="toggleEmojiPicker('customInput','emojiPickerCustom')" title="Emoji">😊</button>
      <textarea class="ai-input" id="customInput"
        placeholder="Type as ${esc(setup.yourName)}… (Enter to send, Shift+Enter for newline)"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendCustomMessage();}"
        oninput="autoResizeInput(this)"></textarea>
      <button class="ai-send-btn" id="customSendBtn" onclick="sendCustomMessage()">Send</button>
    </div>
    <div style="padding:4px 8px 6px;display:flex;align-items:center;gap:8px">
      <button id="patternInterruptBtn" onclick="triggerPatternInterrupt()" title="Pattern Interrupt — say something genuinely different. Once per session. Risky if trust < 60%." style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid rgba(88,166,255,0.4);background:rgba(88,166,255,0.08);color:var(--blue);cursor:pointer;letter-spacing:0.5px">⚡ Pattern Interrupt</button>
      <span style="font-size:10px;color:var(--muted)" title="Use once per session for a genuine breakthrough move">once per session · risk based on trust level</span>
    </div>`;
  buildEmojiPicker('emojiPickerCustom', 'customInput');

  // Restore sidebars
  const rs = document.querySelector('.conv-right-sidebar');
  const ls = document.querySelector('.conv-left-sidebar');
  if (rs) rs.style.display = '';
  if (ls) ls.style.display = '';

  sim = new LostCardSim();

  // Ex/Former chat starts with residual damage — trust already eroded, cortisol elevated
  if (chatId === 'ex') {
    sim.trust          = 0.42;   // shaky foundation — was broken once already
    sim.ns.cortisol    = 0.28;   // unresolved history sitting in the system
    sim.ns.pfcLoad     = 0.22;   // slight cognitive load from old grievances
    sim.ns.dopamine    = 0.68;   // motivation present but diminished
    sim.ns.computeNLI();
  }

  updateSimUI({ nli: sim.ns.nli, trust: sim.trust, state: sim.ns.getStateLabel(),
    stateColor: sim.ns.getStateColor(), cards: { ...sim.cards }, stackSize: 0,
    exitDist: sim.dag.lastExitDist });
  resetLeftSidebar();

  customAIHistories[chatId] = [];

  // AI opens first — they initiate based on the scenario
  generateCustomReply(chatId, setup, null);
}

// ── Called when the other person needs to say something ──────────────
async function generateCustomReply(chatId, setup, userText) {
  const relType  = CHAT_META[chatId]?.relType || 'Friend';
  const nli      = sim ? sim.ns.nli  : 0;
  const trust    = sim ? sim.trust   : 0.8;
  const character = getRelCharacter(relType);

  // Emotional colour in plain words — no labels
  const mood = nli < 0.30 ? 'calm right now'
             : nli < 0.55 ? 'a little tense'
             : nli < 0.75 ? 'stressed and guarded'
             : 'emotionally overwhelmed, barely holding it';
  const trstLine = trust < 0.30 ? 'trust is almost gone between you'
                 : trust < 0.55 ? 'trust is shaky'
                 : trust < 0.75 ? 'trust is okay but fragile' : '';

  // Language detection hint from the latest user message
  const langHint = userText
    ? `Match the exact language of their message. If they wrote in Roman Urdu, reply in Roman Urdu. English → English. Mixed → mixed. Never switch.`
    : `Match the language feel of the scenario. Roman Urdu scenario → Roman Urdu. English → English.`;

  // Ex chat: opening should be cold, guarded, not warm — set the difficulty tone from move one
  const isEx = relType === 'Ex/Former';

  const sysPrompt = userText
    ? `You are ${setup.theirName}. ${character} You're texting ${setup.yourName}. Situation: ${setup.scenario}. You're ${mood}${trstLine ? ', ' + trstLine : ''}. ${langHint} They just wrote: "${userText}". Reply as ${setup.theirName} — real, in character. 1-3 short sentences. Text message style. No asterisks, no labels, nothing else.`
    : isEx
      ? `You are ${setup.theirName}. ${character} You're texting ${setup.yourName}. Situation: ${setup.scenario}. ${langHint} Open with something short, cautious, and not fully warm — you're not sure why they're here or what you want. 1 sentence, max. Real. No labels.`
      : `You are ${setup.theirName}. ${character} You're texting ${setup.yourName}. Situation: ${setup.scenario}. ${langHint} Send your opening message — natural, real, no labels. 1-2 sentences max.`;

  const key = getAPIKey(setup.provider);
  if (!key) {
    addMessage('them', setup.theirName, '[No API key — add one in Settings ⚙]');
    setInputEnabled(true);
    return;
  }

  setInputEnabled(false);
  const typingEl = addTypingIndicator(setup.theirName);

  try {
    const history = [...(customAIHistories[chatId] || [])];
    let msgToSend = '';
    if (userText !== null) {
      history.push({ role: 'user', content: userText });
    } else {
      // Opening message — use a trigger so the API gets [system, user] (required by most providers)
      msgToSend = 'Begin.';
    }
    const aiText = await callAI(setup.provider, key, history, sysPrompt, msgToSend);
    typingEl.remove();

    if (userText === null) {
      // Save trigger + reply: history starts with a user turn so future calls stay valid
      customAIHistories[chatId] = [{ role: 'user', content: 'Begin.' }];
    } else {
      customAIHistories[chatId] = history;
    }
    customAIHistories[chatId].push({ role: 'assistant', content: aiText });

    addMessage('them', setup.theirName, aiText);
    scrollMessages();
  } catch(err) {
    typingEl.remove();
    addMessage('them', setup.theirName, `[Error: ${err.message || 'API call failed. Check your key.'}]`);
  } finally {
    setInputEnabled(true);
  }
}

// ── User sends a free-text message in custom chat ─────────────────────
function sendCustomMessage() {
  if (!currentChatSetup || !currentChatId) return;
  if (isAITyping) return;          // AI is mid-reply — wait for it
  if (!sim || sim.isOver()) return;

  const input = document.getElementById('customInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = '40px';  // reset auto-resize after send

  // "bye" / goodbye → stalemate
  const goodbyeTerms = /^(bye|goodbye|good bye|alvida|khuda hafiz|allah hafiz|phir milenge|bye bye|take care|cya|see ya|see you|band karo|khatam|chalo|chalte hain|ok bye|okay bye|acha bye|accha bye|theek hai bye|thk bye|baad mein|later|au revoir|ciao|tc\b|bb\b)\b/i;
  if (goodbyeTerms.test(text)) {
    addMessage('you', currentChatSetup.yourName, text, 'SOFT');
    scrollMessages();
    setTimeout(() => exitChat(), 800);
    return;
  }

  const classifiedType = classifyMessageHeuristic(text);
  const typeLabel      = classifiedType === 0 ? 'SOFT' : classifiedType === 1 ? 'AGGRESSIVE' : 'SILENT';
  gottmanLogCurrent    = classifyGottmanTone(text, classifiedType);

  addMessage('you', currentChatSetup.yourName, text, typeLabel);
  // Show Gottman tone as a subtle subtext on the message
  if (gottmanLogCurrent && gottmanLogCurrent.tone !== typeLabel) {
    const msgs = document.getElementById('chatMessages');
    const lastMsg = msgs?.lastElementChild;
    if (lastMsg) {
      const toneTag = document.createElement('div');
      toneTag.style.cssText = `font-size:10px;color:${gottmanLogCurrent.color};opacity:0.8;margin-top:3px;padding-left:2px;font-weight:600;letter-spacing:0.5px`;
      toneTag.textContent = `tone: ${gottmanLogCurrent.tone}`;
      toneTag.title = gottmanLogCurrent.desc;
      lastMsg.appendChild(toneTag);
    }
  }
  scrollMessages();

  const result = sim.processMove(classifiedType);
  // Threshold alert check (after NLI updates)
  if (sim) checkThresholdAlert(sim.ns.nli);
  if (!result) return;

  for (const drop of result.cardDrops) {
    addEventMessage(`CARD LOST — ${drop.card}: ${drop.reason}`);
    animateCardDrop(drop.card);
  }

  updateSimUI(result);
  document.getElementById('moveBadge').textContent = `Move ${result.move} / 23`;
  document.getElementById('moveCount').textContent  = result.move;
  document.getElementById('lostCount').textContent  = `${sim.cards.lostCount()} / 3`;
  document.getElementById('exitDist').textContent   = result.exitDist < 900 ? result.exitDist.toFixed(2) : '∞';
  renderConflictStack();
  updateChatStatus(currentChatId, result.state);

  if (result.terminal) {
    setTimeout(() => showTerminal(result), 700);
    return;
  }

  // Ghost session: ex chat might type then not reply
  if (currentChatId === 'ex' && !result.terminal) {
    if (maybeGhostReply(currentChatId, currentChatSetup)) return;
  }
  generateCustomReply(currentChatId, currentChatSetup, text);
}

// ── Classify user's typed message → SOFT(0) / AGGRESSIVE(1) / SILENT(2) ─
function classifyMessageHeuristic(text) {
  const raw = text.trim();
  const t   = raw.toLowerCase();

  // ── SILENT: very short, minimal, one-word replies ───────────────────
  if (raw.length < 6) return 2;
  const silentExact = ['ok','okay','yeah','yep','no','yes','sure','fine','k','hmm',
    'mm','idk','lol','haha','oh','ah','ugh','mhm','yup','nah','nope','wow','hm',
    'ok.','k.','ok!','nah.','yep.','fine.','sure.','seen'];
  const stripped = t.replace(/[.!?…]+$/, '').trim();
  if (silentExact.includes(stripped)) return 2;
  if (raw.split(/\s+/).length <= 2 && raw.length < 14) return 2;

  // ── AGGRESSIVE scoring ───────────────────────────────────────────────
  let aggrScore = 0;

  // Hard phrase patterns
  const aggrPhrases = [
    'you always','you never','stop it','shut up','shut your','forget it','forget you',
    'leave me alone','not my fault','your fault','you\'re wrong','you were wrong',
    'you\'re impossible','why do you always','this is ridiculous','i\'m done',
    'done with this','done with you','not again','you don\'t understand',
    'you never listen','why can\'t you','stop blaming','none of your business',
    'mind your own','get over it','deal with it','i don\'t care','don\'t bother',
    'it\'s your problem','not my problem','don\'t start','don\'t even','not now',
    'do whatever you want','go ahead then','oh great','nice one','great job', // sarcasm
    'that\'s not what i','that\'s not true','stop making things','you\'re being',
    'you\'re so','i\'m tired of','sick of this','sick of you','i can\'t do this',
    'i\'m over it','you ruined','this is pointless','waste of time',
    'you make me','you always make','you\'re impossible','can\'t you just',
    'every single time','same thing every','why even bother','don\'t talk to me',
    'stay away','back off','get away','leave me','i\'m out'
  ];
  for (const p of aggrPhrases) { if (t.includes(p)) { aggrScore += 2; break; } }

  // Aggressive single words
  const aggrWords = ['stupid','idiot','dumb','fool','pathetic','useless','worthless',
    'hate','disgusting','annoying','ridiculous','worst','terrible','horrible',
    'liar','cheat','hypocrite','selfish','arrogant','toxic','manipulative'];
  for (const w of aggrWords) {
    if (t.includes(w)) { aggrScore += 2; break; }
  }

  // ALL-CAPS words (shouting) — strong aggression signal
  const capsCount = (raw.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (capsCount >= 1) aggrScore += 2;

  // Multiple exclamation marks = emotional escalation
  const exclCount = (raw.match(/!/g) || []).length;
  if (exclCount >= 3) aggrScore += 2;
  else if (exclCount >= 2) aggrScore += 1;

  // Question + negative = demanding/accusatory
  if (/why (did|do|don't|won't|can't|would|are|were) you/i.test(raw)) aggrScore += 1;
  if (/how could you/i.test(raw)) aggrScore += 1;
  if (/are you (serious|kidding|joking)/i.test(raw)) aggrScore += 1;

  if (aggrScore >= 2) return 1;

  // ── SOFT scoring ─────────────────────────────────────────────────────
  let softScore = 0;

  const softPhrases = [
    'i\'m sorry','i am sorry','sorry for','forgive me','i apologize',
    'i miss you','i love you','i care about you','i care for you',
    'i understand','i get it','that makes sense','i hear you',
    'you\'re right','you were right','my fault','i was wrong','i made a mistake',
    'i should have','i shouldn\'t have','i could have done better',
    'can we talk','can we fix','please','can you help','would you like',
    'i want to','i\'d like to','let\'s work','let\'s figure',
    'thank you','thanks for','i appreciate','means a lot',
    'how are you','are you okay','are you alright','hope you\'re',
    'i\'m here for you','i\'m listening','tell me what','tell me how',
    'i feel like','i think we','i believe we','let me explain',
    'help me understand','can i ask','i want you to know',
    'that must have been','i didn\'t mean to','i never meant',
    'you matter','you mean','i notice','i see you'
  ];
  for (const p of softPhrases) { if (t.includes(p)) { softScore += 2; break; } }

  // Soft words
  const softWords = ['sorry','please','thanks','appreciate','love','miss','care',
    'understand','listening','here for','support','together','work it out'];
  for (const w of softWords) { if (t.includes(w)) { softScore += 1; break; } }

  // Question without accusation = curious/caring = soft
  if (/\?/.test(raw) && aggrScore === 0) softScore += 1;

  if (softScore >= 2) return 0;

  // ── Neutral long message → leaning SOFT ─────────────────────────────
  if (raw.split(/\s+/).length >= 10) return 0;   // thoughtful, long = soft
  if (raw.split(/\s+/).length >= 5 && softScore >= 1) return 0;

  // Short neutral → SILENT
  if (raw.split(/\s+/).length <= 4) return 2;

  return 0; // default: soft
}

// ── Gottman Tone Vector — deeper classification beyond SOFT/AGGR/SILENT ─
function classifyGottmanTone(text, baseType) {
  const t = text.toLowerCase();
  // Stonewalling (worst silence)
  if (baseType === 2) {
    if (text.trim().length <= 3 || /^(\.\.\.|\.\.|k|ok|fine|sure|whatever|hmm|mm|yep|nah)$/i.test(text.trim()))
      return { tone: 'Stonewalling', color: '#E3B341', horseman: true, desc: 'Complete emotional shutdown. Shuts the other person out entirely.' };
    return { tone: 'Withdrawal', color: '#E5C07B', horseman: false, desc: 'Stepping back from the conversation. Signals emotional exhaustion.' };
  }
  if (baseType === 1) {
    // Contempt — highest damage
    if (/pathetic|worthless|useless|you always|you never|every time you|you people|you lot|you're such|disgusting|grow up|whatever you say/i.test(t))
      return { tone: 'Contempt', color: '#F85149', horseman: true, desc: 'Communicates fundamental disrespect. Single most predictive of relationship failure (Gottman).' };
    // Defensiveness
    if (/(not my fault|you started|you're the one|how could you|it's not like i|why do you always blame|stop attacking|i didn't do anything)/i.test(t))
      return { tone: 'Defensiveness', color: '#F0883E', horseman: true, desc: 'Deflects accountability. Escalates rather than resolves.' };
    // Criticism
    if (/(you always|you never|you keep|why do you|you should|every time|you never listen)/i.test(t))
      return { tone: 'Criticism', color: '#E5C07B', horseman: true, desc: 'Attacks character rather than behavior. Raises cortisol in both parties.' };
    return { tone: 'Aggression', color: '#F0883E', horseman: false, desc: 'Direct escalation. PFC↑ Cortisol↑ Dopamine↓.' };
  }
  // Soft subtypes
  if (/(i('m| am) sorry|forgive me|i apologize|i was wrong|my fault|i shouldn't have|i messed up)/i.test(t))
    return { tone: 'Repair Attempt', color: '#98C379', horseman: false, desc: 'Active bid to de-escalate. Most valuable soft move — can pop the cortisol stack.' };
  if (/(i feel|i felt|i('m| am) (scared|hurt|sad|worried|afraid|lonely|confused|nervous|lost))/i.test(t))
    return { tone: 'Vulnerability', color: '#56B6C2', horseman: false, desc: 'Opens genuine contact. Highest repair ceiling when NLI is below 0.50.' };
  if (/(i hear you|you('re| are) right|i understand|i get it|that makes sense|that's fair|i can see that)/i.test(t))
    return { tone: 'Acknowledgment', color: '#58A6FF', horseman: false, desc: 'Validates their experience. Lowers NLI in both parties.' };
  if (/(how are|what do you|can you tell me|help me understand|i want to know|tell me more|i'm listening|what happened)/i.test(t))
    return { tone: 'Curiosity', color: '#C678DD', horseman: false, desc: 'Genuine inquiry without judgment. Reduces emotional temperature.' };
  return { tone: 'Soft', color: '#98C379', horseman: false, desc: 'Constructive move. PFC↓ Cortisol↓ Dopamine↑.' };
}

// ── Health Score (0-100) + letter grade ──────────────────────────────
function calculateHealthScore(s) {
  if (!s) return null;
  let score = 0;
  const cardsKept = 3 - (s.cardsLost || 0);
  score += cardsKept * 20;                              // 0-60 pts: card retention
  score += Math.round((parseFloat(s.finalTrust) || 0) * 20); // 0-20 pts: trust
  const nli = parseFloat(s.finalNLI) || 0;
  score += Math.round((1 - nli) * 10);                 // 0-10 pts: NLI inverse
  const phaselog = s.phaseLog || ['HARMONY'];
  const harmonyRatio = phaselog.filter(p => p === 'HARMONY').length / Math.max(phaselog.length, 1);
  score += Math.round(harmonyRatio * 10);               // 0-10 pts: time in harmony
  score -= Math.min(10, (s.amygdalaOverrides || 0) * 3); // penalty: overrides
  score = Math.max(0, Math.min(100, score));
  const grade = score >= 93 ? 'A+' : score >= 85 ? 'A' : score >= 78 ? 'B+' :
    score >= 70 ? 'B' : score >= 62 ? 'C+' : score >= 54 ? 'C' :
    score >= 44 ? 'D' : 'F';
  const verdict = score >= 93 ? 'Exceptional. Regulatory capacity in the 99th percentile.' :
    score >= 85 ? 'Strong pattern management. Above average emotional regulation.' :
    score >= 78 ? 'Solid performance. Recoverable flaws, correct instincts.' :
    score >= 70 ? 'Functional under pressure. Breaks when it truly counts.' :
    score >= 62 ? 'Inconsistent. Capable of repair but fails to sustain it.' :
    score >= 54 ? 'Significant systemic issues. Multiple failure modes present.' :
    score >= 44 ? 'Heavy damage across most dimensions of the relationship.' :
    'Critical failure. The relationship had no structural path to survival.';
  return { score, grade, verdict };
}

// ── Relational Archetype — who you are as a relational actor ─────────
function getRelationalArchetype(s) {
  if (!s) return null;
  const log      = s.moveLog || [];
  const devLost  = !s.devotion?.startsWith('RETAINED');
  const excLost  = !s.excitement?.startsWith('RETAINED');
  const presLost = !s.presence?.startsWith('RETAINED');
  const nli      = parseFloat(s.finalNLI) || 0;
  const trust    = parseFloat(s.finalTrust) || 0;

  let consecAggr = 0, maxConsecAggr = 0, calmAggr = 0, silentTotal = 0, floodedSoft = 0;
  for (const m of log) {
    const mnli = parseFloat(m.nli) || 0;
    if (m.type === 'AGGRESSIVE') { consecAggr++; maxConsecAggr = Math.max(maxConsecAggr, consecAggr); if (mnli < 0.30) calmAggr++; }
    else consecAggr = 0;
    if (m.type === 'SILENT') silentTotal++;
    if (m.type === 'SOFT' && mnli >= 0.50) floodedSoft++;
  }

  if (s.cardsLost === 0)
    return { name: 'THE SALVATION TYPE', color: '#98C379', icon: '🃏',
      desc: 'You held all three cards across 23 moves. You read the NLI correctly, timed your repairs, and didn\'t press when pressing would break things. This archetype appears in roughly 1 in 10 million interaction sequences. You are either deeply self-aware, exceptionally disciplined — or both.',
      pattern: 'Systematic pattern management. Rare regulatory capacity.' };

  if (calmAggr >= 2 || (devLost && nli < 0.40 && !excLost))
    return { name: 'THE CALM AGGRESSOR', color: '#F85149', icon: '⚡',
      desc: 'Your aggression was not driven by stress — you were calm when you escalated. This is the most dangerous relational pattern because it is habitual, not reactive. Low-NLI aggression is classified as intentional contempt by the nervous system. DEVOTION drops not from heat but from the absence of warmth when warmth was possible.',
      pattern: 'Habitual escalation independent of neurological load. Calm-state contempt.' };

  if (maxConsecAggr >= 2 || (excLost && !presLost && !devLost))
    return { name: 'THE DOUBLE PRESS', color: '#F0883E', icon: '🔴',
      desc: 'You never let the first hit land alone. Every escalation was followed by a second before the cortisol could clear. You press when you should pause. EXCITEMENT is your most vulnerable card — the cortisol stack fills from consecutive strikes and overflows. In real relationships, this pattern turns disagreements into crises that neither party wanted.',
      pattern: 'Sequential escalation. Cannot exit the conflict before it compounds.' };

  if (silentTotal >= 3 || (presLost && !excLost && !devLost))
    return { name: 'THE SILENT ACCUMULATOR', color: '#E3B341', icon: '🟡',
      desc: 'You went quiet instead of confronting. Each silence felt like self-protection — and in the short term it was. But PRESENCE bled across every withdrawal, and the other person stopped expecting you to show up. In real relationships, repeated silence reads as emotional abandonment even when that is not what you meant.',
      pattern: 'Withdrawal as default protection. Presence collapses without visible trigger.' };

  if (floodedSoft >= 2 || (excLost && (s.stackMaxDepth || 0) >= 5))
    return { name: 'THE FLOODED FIXER', color: '#56B6C2', icon: '🌊',
      desc: 'You tried to repair when you were too overwhelmed to receive the repair yourself. SOFT moves above NLI 0.50 cannot pop the cortisol stack — the nervous system is too flooded to process them. You had the right instinct but the wrong timing. In real relationships, premature apologies arrive before the other person can hear them.',
      pattern: 'Correct intent, wrong timing. Repair attempted under flood conditions.' };

  if (trust < 0.35 || (devLost && excLost && !presLost))
    return { name: 'THE OVER-INVESTOR', color: '#C678DD', icon: '💜',
      desc: 'You gave Devotion before the foundation could bear its weight. Investment arrived before trust was established. This destabilizes the relationship because the other person cannot meet what you are offering — the asymmetry creates pressure that reads as demand. DEVOTION drops not from aggression but from structural imbalance.',
      pattern: 'Premature emotional investment. Trust not yet load-bearing.' };

  return { name: 'THE COMPOUND LOSS', color: '#A371F7', icon: '◆',
    desc: 'Multiple cards lost through a combination of patterns rather than one dominant failure mode. This is the most common archetype — most people do not have a single clean failure pattern. They cycle between aggression, silence, and flooded repair until the relationship exhausts itself. Each mode feeds the next.',
    pattern: 'Mixed failure modes. Systemic erosion without one dominant cause.' };
}

// ── Threshold Alert — show when NLI crosses significant bands ─────────
function checkThresholdAlert(nli) {
  const band = nli >= 0.85 ? 3 : nli >= 0.70 ? 2 : nli >= 0.60 ? 1 : 0;
  if (band <= lastThresholdAlert) return; // only alert on new band crossings
  lastThresholdAlert = band;
  const alerts = [null,
    { label: 'FRACTURE ZONE', msg: 'NLI 0.60+ — stress is elevated. Your next move is amplified. Repair while you still can.', color: 'var(--yellow)' },
    { label: 'COLLAPSE', msg: 'NLI 0.70+ — cortisol overwhelmed. Anything you say now lands harder than you intend.', color: 'var(--orange)' },
    { label: '⚠ AMYGDALA OVERRIDE IMMINENT', msg: 'NLI 0.85+ — your prefrontal cortex is going offline. You are no longer choosing responses.', color: 'var(--red)' },
  ];
  const a = alerts[band];
  if (!a) return;
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg event threshold-alert';
  div.innerHTML = `<div class="msg-bubble threshold-bubble" style="border-color:${a.color};color:${a.color}">
    <strong>${esc(a.label)}</strong> — ${esc(a.msg)}
  </div>`;
  msgs.appendChild(div);
  scrollMessages();
}

// ── Repair Window Indicator — updates the UI display ─────────────────
function updateRepairWindow(nli) {
  const el = document.getElementById('repairWindowBadge');
  if (!el) return;
  if (nli < 0.50) {
    el.textContent = '🟢 REPAIR WINDOW OPEN';
    el.style.color  = 'var(--green)';
    el.style.background = 'rgba(63,185,80,0.10)';
    el.style.borderColor = 'rgba(63,185,80,0.35)';
    el.title = 'NLI < 0.50 — SOFT moves will pop the cortisol stack. This is the window for repair.';
  } else {
    el.textContent = '🔴 REPAIR WINDOW CLOSED';
    el.style.color  = 'var(--red)';
    el.style.background = 'rgba(248,81,73,0.10)';
    el.style.borderColor = 'rgba(248,81,73,0.35)';
    el.title = 'NLI ≥ 0.50 — too stressed for repair to land. Cool down before attempting to fix anything.';
  }
}

// ── Pattern Interrupt — once-per-session special move ─────────────────
function triggerPatternInterrupt() {
  if (patternInterruptUsed) { showToast('Pattern Interrupt already used this session.', 'error'); return; }
  if (!sim || sim.isOver()) return;
  patternInterruptUsed = true;
  const trust = sim.trust;
  const nliEl = document.getElementById('customInput');

  const btn = document.getElementById('patternInterruptBtn');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; btn.textContent = '⚡ Used'; }

  if (trust >= 0.60) {
    // Success: big repair
    sim.ns.cortisol  = Math.max(0, sim.ns.cortisol  - 0.18);
    sim.ns.pfcLoad   = Math.max(0, sim.ns.pfcLoad   - 0.14);
    sim.ns.dopamine  = Math.min(1, sim.ns.dopamine  + 0.12);
    sim.ns.computeNLI();
    // Pop up to 2 from the cortisol stack
    sim.stack.pop(0); sim.stack.pop(0);
    addEventMessage('⚡ PATTERN INTERRUPT — genuine breakthrough. Cortisol cleared. NLI dropping. This is what courage looks like in the data.');
    showToast('Pattern Interrupt succeeded — cortisol cleared, NLI reduced.', 'success');
  } else {
    // Backfire: vulnerability at wrong time
    sim.ns.cortisol  = Math.min(1, sim.ns.cortisol + 0.10);
    sim.ns.pfcLoad   = Math.min(1, sim.ns.pfcLoad  + 0.08);
    sim.ns.computeNLI();
    addEventMessage('⚡ PATTERN INTERRUPT — backfired. Vulnerability at trust ' + Math.round(trust*100) + '% was received as desperation. NLI spiked.');
    showToast('Pattern Interrupt backfired — trust too low to hold the vulnerability.', 'error');
  }
  const result = { nli: sim.ns.nli, trust: sim.trust, state: sim.ns.getStateLabel(),
    stateColor: sim.ns.getStateColor(), cards: { ...sim.cards }, stackSize: sim.stack.size(),
    exitDist: sim.dag.lastExitDist };
  updateSimUI(result);
  updateRepairWindow(sim.ns.nli);
  renderConflictStack();
}

// ── Ghost Session — ex chat: typing indicator appears then vanishes ────
let ghostSessionTimer = null;
function maybeGhostReply(chatId, setup) {
  if (chatId !== 'ex') return false;
  const nli   = sim ? sim.ns.nli : 0;
  const trust = sim ? sim.trust  : 0.8;
  const move  = sim ? sim.move   : 0;
  // Ghost probability increases as trust drops and NLI rises
  const ghostProb = (1 - trust) * 0.35 + nli * 0.20;
  if (Math.random() > ghostProb) return false;

  // Show typing indicator then remove it — they started to reply, then didn't
  const typingEl = addTypingIndicator(setup.theirName);
  const delay = 1800 + Math.random() * 2400;
  ghostSessionTimer = setTimeout(() => {
    typingEl.remove();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg them';
    msgDiv.innerHTML = `<div class="msg-label">${esc(setup.theirName)}</div>
      <div class="msg-bubble ghost-bubble">
        <em style="color:var(--muted);font-size:12px">started typing… then stopped.</em>
      </div>`;
    document.getElementById('chatMessages')?.appendChild(msgDiv);
    scrollMessages();
    // This counts as a SILENT move on their part — micro-NLI boost
    if (sim) {
      sim.ns.cortisol = Math.min(1, sim.ns.cortisol + 0.04);
      sim.ns.computeNLI();
      updateRepairWindow(sim.ns.nli);
    }
    setInputEnabled(true);
  }, delay);
  return true;
}

// ── Final Letter — AI writes from the other person's POV at session end ─
async function generateFinalLetter(setup, summary) {
  if (!setup || !summary) return;
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  const cardsLost = summary.cardsLost || 0;
  const outcome   = summary.outcome   || 'session ended';
  const nli       = parseFloat(summary.finalNLI) || 0;

  const key = getAPIKey(setup.provider);
  if (!key) return; // silently skip — don't break anything if no key

  const character = getRelCharacter(CHAT_META[currentChatId]?.relType || 'Friend');
  const sysPrompt = `You are ${setup.theirName}. ${character} The conversation with ${setup.yourName} just ended — outcome: ${outcome}. ${cardsLost}/3 relational cards were lost. NLI at end: ${nli.toFixed(2)}.

Write a brief, honest, emotionally real closing letter to ${setup.yourName}. From your perspective — what you felt during this conversation, what you noticed, what you're left with. Not a verdict. Not analysis. A letter. Personal, specific, honest. 3-5 sentences. No asterisks, no labels, just the letter.`;

  // Show a separator then "writing letter" indicator
  const sepDiv = document.createElement('div');
  sepDiv.className = 'msg system';
  sepDiv.innerHTML = `<div class="msg-bubble" style="color:var(--muted);font-style:italic;font-size:12px">✉ ${esc(setup.theirName)} is writing a closing letter…</div>`;
  msgs.appendChild(sepDiv);
  scrollMessages();

  try {
    const aiText = await callAI(setup.provider, key, [], sysPrompt, 'Write the letter.');
    sepDiv.remove();
    const letterDiv = document.createElement('div');
    letterDiv.className = 'msg them final-letter-msg';
    letterDiv.innerHTML = `
      <div class="msg-label">${esc(setup.theirName)} — Final Letter</div>
      <div class="msg-bubble final-letter-bubble">${esc(aiText)}</div>`;
    msgs.appendChild(letterDiv);
    scrollMessages();
  } catch(e) {
    sepDiv.remove(); // fail silently
  }
}

// ── Theory Page — full philosophical manifesto modal ──────────────────
function showTheoryPage() {
  let modal = document.getElementById('theoryPageModal');
  if (modal) { modal.style.display = 'flex'; return; }
  modal = document.createElement('div');
  modal.id = 'theoryPageModal';
  modal.className = 'overlay-modal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);overflow:auto;';
  modal.innerHTML = `
  <div class="theory-page-inner">
    <button class="theory-close-btn" onclick="document.getElementById('theoryPageModal').style.display='none'">✕</button>
    <div class="theory-header">
      <div class="theory-eyebrow">S. M. Minhal Abbas Rizvi</div>
      <h1 class="theory-title">The Bet of Belief</h1>
      <div class="theory-subtitle">A Framework for Understanding Relational Belief Decay</div>
    </div>

    <div class="theory-section">
      <h2>The Game You Don't Know You're Playing</h2>
      <p>Every conversation in a relationship is a move in a game with rules you never agreed to and were never shown. You are playing. You have always been playing. The game does not care whether you know the rules.</p>
      <p>Most people believe relationships are about feelings — love, anger, care, hurt. They are. But beneath those feelings runs a computable logic. Patterns of escalation, withdrawal, repair, and collapse that follow predictable sequences. Sequences that can be traced, modelled, and predicted.</p>
      <blockquote class="theory-quote">"Every word we speak in a relationship is a card we play. We play without knowing we are in a game. The moment we make a wrong move — the card leaves your hand. Suddenly. Not gradually. Gone."</blockquote>
      <p>LOST CARD makes the invisible game visible. Not to reduce love to math — but to give you a map of territory you were navigating blind.</p>
    </div>

    <div class="theory-section">
      <h2>The Three Cards</h2>
      <p>You hold three cards at the start of every relationship. They are not metaphors. They are measurable psychological states that real people lose in real sequences for real reasons.</p>
      <div class="theory-cards-grid">
        <div class="theory-card" style="border-color:#C678DD">
          <div class="tc-name" style="color:#C678DD">💜 DEVOTION</div>
          <div class="tc-def">Your emotional investment. How much of yourself you have committed to this relationship.</div>
          <div class="tc-lost"><strong>Lost through:</strong> Aggression at low NLI (habitual contempt, not stress-driven). Or over-investment before trust can hold the weight.</div>
          <div class="tc-real"><em>In real life:</em> You stop giving as much. Not dramatically — you just hold a little more back each time. Until one day there is nothing left to give.</div>
        </div>
        <div class="theory-card" style="border-color:#56B6C2">
          <div class="tc-name" style="color:#56B6C2">💙 EXCITEMENT</div>
          <div class="tc-def">Your relational energy. The life and vitality you bring to the connection.</div>
          <div class="tc-lost"><strong>Lost through:</strong> Cortisol accumulation — conflicts stacking faster than they can resolve. Especially: two aggressive moves in a row.</div>
          <div class="tc-real"><em>In real life:</em> Conversations become flat. You stop looking forward to talking. It's not that you hate them — it's that you're exhausted by them.</div>
        </div>
        <div class="theory-card" style="border-color:#98C379">
          <div class="tc-name" style="color:#98C379">💚 PRESENCE</div>
          <div class="tc-def">Your psychological availability. Whether you are actually, fully there.</div>
          <div class="tc-lost"><strong>Lost through:</strong> Withdrawal — three silences total, or three consecutive moves in nervous system overload (NLI > 0.75).</div>
          <div class="tc-real"><em>In real life:</em> You are physically present but mentally somewhere else. You stopped showing up before you ever left.</div>
        </div>
      </div>
    </div>

    <div class="theory-section">
      <h2>The Neurological Load Index</h2>
      <p>The NLI is the central number. It measures how much stress your nervous system is carrying at any moment. It is calculated from three real biological systems:</p>
      <div class="theory-formula">NLI = (PFC × 0.4) + (Cortisol × 0.4) + (1 − Dopamine) × 0.2</div>
      <p>When your NLI is below 0.30, you can think clearly. You can choose your words. You can hear what the other person is actually saying. This is where repair lives.</p>
      <p>When your NLI passes 0.70, you are no longer in full control of your responses. You think you are choosing — but the amygdala is filtering your choices before they reach consciousness.</p>
      <p>At 0.85, the prefrontal cortex goes effectively offline. Whatever you say next is not a decision. It is a reflex.</p>
      <p>This is not an excuse. It is a fact. And knowing it is the first step toward doing something about it.</p>
    </div>

    <div class="theory-section">
      <h2>The Cortisol Stack — Why You Can't "Just Let It Go"</h2>
      <p>Every unresolved conflict adds to a stack. The stack has a maximum depth of seven. When it overflows, EXCITEMENT is lost — not from anger, but from exhaustion.</p>
      <p>SOFT moves can pop the stack — but only when NLI is below 0.50. This is the most important practical insight in the entire framework: <em>repair requires calm to be received.</em></p>
      <p>This is why telling someone "you're overreacting" during a fight never works. This is why apologizing while you're still flooded doesn't land. The stack cannot clear under pressure. You both have to come down before you can come together.</p>
    </div>

    <div class="theory-section">
      <h2>The Architecture of Longing</h2>
      <p>When relational memories are damaged — shared experiences, inside jokes, moments of genuine closeness — they become what the code calls <em>orphaned pointers.</em> They have no valid address in the present. The connection they once belonged to is gone.</p>
      <p>But they are not freed. They remain in memory. Occupying space without a home.</p>
      <p>This is not a bug in the code. It is an intentional architectural decision. The memory leak <em>is</em> the longing. The Default Mode Network — the brain's resting-state system — retrieves these memories involuntarily during quiet moments. You think about someone not because you choose to. Because the pointer is still there. Still running. With no valid address.</p>
    </div>

    <div class="theory-section">
      <h2>The Path to Salvation</h2>
      <p>Salvation is possible. It is rare — the model estimates approximately 1 in 10 million interaction sequences end with all three cards retained. But it is not impossible. It follows specific rules:</p>
      <ul class="theory-rules">
        <li>Never play two AGGRESSIVE moves in a row. The second one locks the cortisol stack at a depth that SOFT cannot clear.</li>
        <li>Silence is valid once. The second silence is a signal. The third is a departure.</li>
        <li>Repair only when calm. The window is NLI below 0.50. Not because you need to be perfect — because they need to be calm enough to receive you.</li>
        <li>Don't give Devotion before trust reaches 0.55. The weight of your investment will crush what isn't yet strong enough to hold it.</li>
        <li>Watch the NLI in real life. Your body tells you when it's climbing. The dry mouth, the tight chest, the narrowing of focus. Those are the signals. When you feel them — pause before you speak.</li>
      </ul>
      <blockquote class="theory-quote">"There is nothing to talk about… unless you change the next move."</blockquote>
    </div>

    <div class="theory-section theory-footer-section">
      <div class="theory-author">
        <div class="theory-author-name">S. M. Minhal Abbas Rizvi</div>
        <div class="theory-author-sub">BSSE · Data Structures & Algorithms · Supervisor: Waqas Aziz · June 2026</div>
        <div class="theory-author-quote">"The Bet of Belief was not written about relationships in general. It was written about one — and then made general. That is the only kind of theory worth writing."</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

// ── Relationship Autopsy Mode — reconstruct a past conversation ───────
let autopsySim = null;
let autopsyMoves = [];
function showAutopsyMode() {
  let modal = document.getElementById('autopsyModal');
  if (modal) { modal.style.display = 'flex'; resetAutopsy(); return; }
  modal = document.createElement('div');
  modal.id = 'autopsyModal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.92);overflow:auto;align-items:flex-start;justify-content:center;padding:20px;';
  modal.innerHTML = `
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;width:100%;max-width:680px;padding:28px;margin:auto;position:relative">
    <button onclick="document.getElementById('autopsyModal').style.display='none'" style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer;padding:4px 8px">✕</button>
    <div style="font-size:11px;letter-spacing:2px;color:var(--blue);font-weight:700;margin-bottom:6px">RELATIONSHIP AUTOPSY MODE</div>
    <h2 style="font-size:20px;font-weight:800;margin:0 0 6px">Reconstruct a Real Conversation</h2>
    <p style="font-size:13px;color:var(--muted);margin:0 0 20px">Enter what was actually said — move by move. The system classifies each exchange, calculates the NLI path, and shows you exactly where the relationship fractured.</p>

    <div id="autopsyMoves" style="margin-bottom:16px;display:flex;flex-direction:column;gap:8px"></div>

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;margin-bottom:8px">ADD NEXT EXCHANGE</div>
      <input id="autopsyYouSaid" placeholder="What YOU said…" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;margin-bottom:8px;box-sizing:border-box"/>
      <input id="autopsyTheySaid" placeholder="What THEY said (leave blank if they didn't reply)…" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;margin-bottom:12px;box-sizing:border-box"/>
      <button onclick="addAutopsyMove()" style="background:var(--blue);color:white;border:none;border-radius:8px;padding:9px 20px;font-weight:700;cursor:pointer;font-size:13px">+ Add Exchange</button>
    </div>

    <div id="autopsyResult" style="display:none;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px"></div>

    <div style="display:flex;gap:10px">
      <button onclick="runAutopsyAnalysis()" style="background:var(--blue);color:white;border:none;border-radius:8px;padding:10px 22px;font-weight:700;cursor:pointer;font-size:13px">Analyze This Conversation</button>
      <button onclick="resetAutopsy()" style="background:var(--bg2);color:var(--muted);border:1px solid var(--border);border-radius:8px;padding:10px 18px;cursor:pointer;font-size:13px">Reset</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  resetAutopsy();
}

function resetAutopsy() {
  autopsySim   = new LostCardSim();
  autopsyMoves = [];
  const movesEl  = document.getElementById('autopsyMoves');
  const resultEl = document.getElementById('autopsyResult');
  if (movesEl)  movesEl.innerHTML  = '';
  if (resultEl) { resultEl.style.display = 'none'; resultEl.innerHTML = ''; }
  const y = document.getElementById('autopsyYouSaid');
  const t = document.getElementById('autopsyTheySaid');
  if (y) y.value = ''; if (t) t.value = '';
}

function addAutopsyMove() {
  const youEl  = document.getElementById('autopsyYouSaid');
  const theyEl = document.getElementById('autopsyTheySaid');
  if (!youEl || !autopsySim) return;
  const youSaid  = youEl.value.trim();
  const theySaid = theyEl?.value.trim() || '';
  if (!youSaid) { showToast('Enter what you said.', 'error'); return; }

  const yourType  = classifyMessageHeuristic(youSaid);
  const theirType = theySaid ? classifyMessageHeuristic(theySaid) : 2; // silent if no reply
  const yourTone  = classifyGottmanTone(youSaid, yourType);
  const theirTone = theySaid ? classifyGottmanTone(theySaid, theirType) : { tone: 'Silence', color: '#E3B341', desc: 'No response given.' };

  // Process through the sim (returns null if terminal condition already reached)
  const result = autopsySim.processMove(yourType);
  if (!result && autopsySim.isOver()) {
    showToast('Simulation terminal — this conversation has reached its limit. Click Reset to start over.', 'info');
    return;
  }
  const moveNum = autopsyMoves.length + 1;
  autopsyMoves.push({ move: moveNum, youSaid, theySaid, yourType, theirType, yourTone, theirTone, nli: autopsySim.ns.nli, trust: autopsySim.trust, state: autopsySim.ns.getStateLabel() });

  const typeLabel  = yourType === 0 ? 'SOFT' : yourType === 1 ? 'AGGRESSIVE' : 'SILENT';
  const typeBadgeColor = yourType === 0 ? 'var(--green)' : yourType === 1 ? 'var(--red)' : 'var(--yellow)';
  const stateColor = autopsySim.ns.nli < 0.30 ? 'var(--green)' : autopsySim.ns.nli < 0.70 ? 'var(--yellow)' : 'var(--red)';

  const movesEl = document.getElementById('autopsyMoves');
  if (movesEl) {
    const div = document.createElement('div');
    div.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:12px';
    div.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-weight:800;color:var(--blue)">Move ${moveNum}</span>
        <span style="background:${typeBadgeColor}22;color:${typeBadgeColor};border:1px solid ${typeBadgeColor}44;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${typeLabel}</span>
        <span style="color:var(--muted)">Tone: <strong style="color:${yourTone.color}">${yourTone.tone}</strong></span>
        <span style="margin-left:auto;color:${stateColor};font-weight:700">NLI ${autopsySim.ns.nli.toFixed(2)} · ${autopsySim.ns.getStateLabel()}</span>
      </div>
      <div style="color:var(--text);margin-bottom:4px"><strong>You:</strong> "${esc(youSaid)}"</div>
      ${theySaid ? `<div style="color:var(--muted)"><strong>Them:</strong> "${esc(theySaid)}" <span style="color:${theirTone.color}">[${theirTone.tone}]</span></div>` : '<div style="color:var(--muted)"><em>No reply.</em></div>'}`;
    movesEl.appendChild(div);
  }

  youEl.value = ''; if (theyEl) theyEl.value = '';
}

function runAutopsyAnalysis() {
  if (!autopsySim || autopsyMoves.length === 0) { showToast('Add at least one exchange first.', 'error'); return; }
  const s = autopsySim.getSessionSummary();
  const score = calculateHealthScore(s);
  const archetype = getRelationalArchetype(s);

  // Find the fracture point — first move that entered FRACTURE or worse
  let fractureMoveNum = null;
  for (const m of autopsyMoves) {
    if (m.state !== 'HARMONY' && fractureMoveNum === null) fractureMoveNum = m.move;
  }

  // Count Gottman horsemen
  const horsemen = autopsyMoves.filter(m => m.yourTone.horseman).map(m => `Move ${m.move}: ${m.yourTone.tone}`);

  const resultEl = document.getElementById('autopsyResult');
  if (!resultEl) return;
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div style="font-weight:800;font-size:15px;margin-bottom:14px;color:var(--text)">AUTOPSY REPORT — ${autopsyMoves.length} exchanges analysed</div>

    ${score ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <div style="font-size:36px;font-weight:900;color:var(--blue)">${score.grade}</div>
      <div><div style="font-size:22px;font-weight:700">${score.score}/100</div><div style="font-size:12px;color:var(--muted)">${score.verdict}</div></div>
    </div>` : ''}

    ${fractureMoveNum ? `<div style="background:rgba(248,81,73,0.08);border:1px solid rgba(248,81,73,0.3);border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:13px">
      <strong style="color:var(--red)">Fracture point: Move ${fractureMoveNum}</strong> — this is where the relationship entered FRACTURE territory. The conversation had already changed before either of you noticed.
    </div>` : '<div style="background:rgba(63,185,80,0.08);border:1px solid rgba(63,185,80,0.3);border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:13px"><strong style="color:var(--green)">No fracture detected.</strong> The conversation stayed in HARMONY throughout these exchanges.</div>'}

    ${horsemen.length > 0 ? `<div style="margin-bottom:10px;font-size:13px"><strong style="color:var(--red)">Gottman Horsemen detected:</strong> ${horsemen.join(', ')}. These are the four patterns most predictive of relationship failure (Gottman Institute research).</div>` : ''}

    ${archetype ? `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px">
      <div style="font-weight:700;color:${archetype.color}">${archetype.icon} ${archetype.name}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">${esc(archetype.pattern)}</div>
    </div>` : ''}

    <div style="font-size:12px;color:var(--muted);margin-top:10px">Final NLI: ${autopsySim.ns.nli.toFixed(3)} · Trust: ${Math.round(autopsySim.trust * 100)}% · Phase: ${autopsySim.ns.getStateLabel()}</div>`;
}

function setInputEnabled(enabled) {
  const input = document.getElementById('customInput');
  const btn   = document.getElementById('customSendBtn')
             || document.querySelector('.ai-send-btn');
  isAITyping = !enabled;
  if (input) input.disabled = !enabled;
  if (btn) {
    btn.disabled = !enabled;
    btn.textContent = enabled ? 'Send' : '…';
    btn.style.opacity = enabled ? '' : '0.5';
  }
  // When re-enabling, restore focus to input so user can type immediately
  if (enabled && input) setTimeout(() => { if (!input.disabled) input.focus(); }, 50);
}

function autoResizeInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ══════════════════════════════════════════════════════════════════════
// AI ASSISTANT
// ══════════════════════════════════════════════════════════════════════
function startAIAssistant() {
  isCustomMode = false;
  document.getElementById('chatWelcome').style.display = 'none';
  const conv = document.getElementById('chatConv');
  conv.style.display = 'flex';

  // Header
  const meta = CHAT_META['ai_assistant'];
  const avatarEl = document.getElementById('cchAvatar');
  avatarEl.textContent = meta.avatarText;
  avatarEl.style.background = meta.avatarGrad;
  document.getElementById('cchName').textContent = meta.name;
  document.getElementById('cchSub').textContent  = meta.sub;
  document.getElementById('moveBadge').textContent = 'AI Mode';

  const badge = document.getElementById('headerStatusBadge');
  if (badge) badge.style.display = 'none';

  // Reset to AI input instead of choices
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('choicesArea').innerHTML  = '';

  // Hide simulation panels (not needed for AI chat)
  const rightSidebar = document.querySelector('.conv-right-sidebar');
  if (rightSidebar) rightSidebar.style.display = 'none';
  const leftSidebar = document.querySelector('.conv-left-sidebar');
  if (leftSidebar) leftSidebar.style.display = 'none';

  // Build AI input with emoji picker
  const choicesArea = document.getElementById('choicesArea');
  choicesArea.innerHTML = `
    <div class="ai-input-row" style="position:relative">
      <div id="emojiPickerAI" class="emoji-picker"></div>
      <button class="emoji-btn" onclick="toggleEmojiPicker('aiChatInput','emojiPickerAI')" title="Emoji">😊</button>
      <textarea class="ai-input" id="aiChatInput" placeholder="Ask anything about LOST CARD…" rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage();}"></textarea>
      <button class="ai-send-btn" onclick="sendAIMessage()">Send</button>
    </div>`;
  buildEmojiPicker('emojiPickerAI', 'aiChatInput');

  // Welcome message
  addMessage('them', 'Hair Band',
    'Hi. I hold everything together — the DSA structures, the Bet of Belief framework, card drop conditions, NLI formula, all of it. What would you like to know about LOST CARD?');
  scrollMessages();
}

async function sendAIMessage() {
  if (isAITyping) return;
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  // Prefer whatever key is available
  let provider = 'groq', key = getAPIKey('groq');
  if (!key) { provider = 'deepseek'; key = getAPIKey('deepseek'); }
  if (!key) {
    showToast('Add an API key in Settings (⚙) to use the AI assistant.', 'error');
    // Show settings icon is at the top of chat list
    return;
  }

  input.value = '';
  addMessage('you', 'You', text);
  // NOTE: do NOT push to history yet — callAI appends userMsg itself.
  // Pushing here + passing as userMsg would duplicate the message and cause API errors.

  const typingEl = addTypingIndicator('Hair Band');
  isAITyping = true;

  try {
    const reply = await callAI(provider, key, aiAssistantHistory, AI_SYSTEM_PROMPT, text);
    typingEl.remove();
    isAITyping = false;
    // Save both turns to history AFTER successful call
    aiAssistantHistory.push({ role: 'user', content: text });
    aiAssistantHistory.push({ role: 'assistant', content: reply });
    addMessage('them', 'Hair Band', reply);
    scrollMessages();
  } catch(err) {
    typingEl.remove();
    isAITyping = false;
    addMessage('them', 'Hair Band', `Sorry, I couldn't reach the API. ${err.message || 'Check your API key and connection.'}`);
  }
}

// ══════════════════════════════════════════════════════════════════════
// AI API CALL
// ══════════════════════════════════════════════════════════════════════
async function callAI(provider, key, history, systemPrompt, userMsg) {
  const url   = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.deepseek.com/v1/chat/completions';
  const model = provider === 'groq' ? 'llama-3.3-70b-versatile' : 'deepseek-chat';

  const messages = [{ role: 'system', content: systemPrompt }];
  // Add history (last 10 turns max)
  const trimmed = history.slice(-10);
  for (const m of trimmed) messages.push(m);
  if (userMsg) messages.push({ role: 'user', content: userMsg });

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model, messages, max_tokens: 300, temperature: 0.8 })
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    const errMsg = errData?.error?.message || `HTTP ${resp.status}`;
    throw new Error(errMsg);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || '[No response]';
}

// ══════════════════════════════════════════════════════════════════════
// UI — MESSAGES
// ══════════════════════════════════════════════════════════════════════
function addMessage(side, labelText, text, moveType) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = `msg ${side}`;

  const labelHtml = `<div class="msg-label">${esc(labelText)}${
    moveType ? ` · <span class="choice-type-badge badge-${moveType.toLowerCase()}">${moveType}</span>` : ''
  }</div>`;
  div.innerHTML = `${labelHtml}<div class="msg-bubble">${esc(text)}</div>`;

  msgs.appendChild(div);
  return div;
}

function addSubtext(text) {
  if (!text) return;
  const msgs = document.getElementById('chatMessages');
  const last = msgs.lastElementChild;
  if (!last) return;
  const sub = document.createElement('div');
  sub.className = 'msg-subtext';
  sub.textContent = text;
  last.appendChild(sub);
}

function addSystemMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg system';
  div.innerHTML = `<div class="msg-bubble">${esc(text)}</div>`;
  msgs.appendChild(div);
  scrollMessages();
}

function addEventMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg event';
  div.innerHTML = `<div class="msg-bubble">⚡ ${esc(text)}</div>`;
  msgs.appendChild(div);
}

function addTypingIndicator(name) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg them';
  div.innerHTML = `<div class="msg-label">${esc(name)}</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(div);
  scrollMessages();
  return div;
}

function scrollMessages() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/\n/g,'<br>');
}

// ══════════════════════════════════════════════════════════════════════
// UI — CHOICES
// ══════════════════════════════════════════════════════════════════════
function renderChoices(choices, handler) {
  const area = document.getElementById('choicesArea');
  area.innerHTML = `<div class="choices-label">Your Response</div>`;

  choices.forEach(choice => {
    const typeClass = choice.type === 0 ? 'soft' : choice.type === 1 ? 'aggressive' : 'silent';
    const typeLabel = choice.type === 0 ? 'SOFT' : choice.type === 1 ? 'AGGRESSIVE' : 'SILENT';
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-type-badge badge-${typeClass}">${typeLabel}</span><span class="choice-text">${esc(choice.text)}</span>`;
    btn.onclick = () => {
      document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      handler(choice.type);
    };
    area.appendChild(btn);
  });
}

function lockChoices() {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
    b.style.opacity = '0.5';
  });
}

// ══════════════════════════════════════════════════════════════════════
// UI — SIMULATION PANELS
// ── Card drop: visual flash + sound ──────────────────────────────────
function animateCardDrop(cardName) {
  playCardDropSound();
  // Flash the right sidebar card row + shake it
  const name = cardName.toUpperCase();
  document.querySelectorAll('.card-status-row').forEach(row => {
    const label = row.querySelector('.card-status-name');
    if (label && label.textContent.toUpperCase().includes(name.slice(0,4))) {
      row.style.animation = 'none';
      row.offsetHeight; // reflow
      row.style.animation = 'cardShake 0.4s ease-out, cardDropFlash 0.6s ease-out';
      setTimeout(() => { row.style.animation = ''; }, 700);
    }
  });
  // Shake the move badge too
  const badge = document.getElementById('moveBadge');
  if (badge) {
    badge.style.animation = 'none';
    badge.offsetHeight;
    badge.style.animation = 'cardShake 0.35s ease-out';
    setTimeout(() => { badge.style.animation = ''; }, 400);
  }
}

// ══════════════════════════════════════════════════════════════════════
function updateSimUI(result) {
  // Restore sidebars if hidden (e.g. coming from AI chat)
  const rightSidebar = document.querySelector('.conv-right-sidebar');
  if (rightSidebar) rightSidebar.style.display = '';
  const leftSidebar = document.querySelector('.conv-left-sidebar');
  if (leftSidebar) leftSidebar.style.display = '';

  const nli = result.nli ?? 0;
  const pct = Math.round(nli * 100);

  // NLI value + state
  const nliColor = nli < 0.30 ? 'var(--green)' : nli < 0.70 ? 'var(--yellow)' : 'var(--red)';
  const nliEl    = document.getElementById('nliValue');
  const stateEl  = document.getElementById('nliState');
  if (nliEl)   { nliEl.textContent = nli.toFixed(3); nliEl.style.color = nliColor; }
  if (stateEl) { stateEl.textContent = result.state || 'HARMONY'; stateEl.style.color = nliColor; }

  const fillEl = document.getElementById('nliBarFill');
  if (fillEl) { fillEl.style.width = `${pct}%`; fillEl.style.background = nliColor; }

  // Sub-values
  if (sim) {
    setInner('pfcVal', `${Math.round(sim.ns.pfcLoad * 100)}%`);
    setInner('corVal', `${Math.round(sim.ns.cortisol * 100)}%`);
    setInner('dopVal', `${Math.round(sim.ns.dopamine * 100)}%`);
    setInner('mirVal', `${Math.round(sim.ns.mirrorInt * 100)}%`);
  }

  // Cards
  updateCardsDisplay(result.cards);

  // Trust
  const trust = result.trust ?? 0.8;
  setInner('trustVal', `${Math.round(trust * 100)}%`);
  const trustFill = document.getElementById('trustBarFill');
  if (trustFill) trustFill.style.width = `${Math.round(trust * 100)}%`;

  // Chess
  if (result.chess && sim) {
    const mv = result.chess;
    setInner('chessDisplay', mv.w ? `${mv.w} / ${mv.b || '…'}` : '— —');
    setInner('chessEval', `Eval: ${sim.chess.positionEval.toFixed(2)} (${sim.chess.evalLabel()})`);
  }

  // Stack size
  const ss = result.stackSize ?? 0;
  setInner('stackSize', `${ss} / 7`);
  const ssEl = document.getElementById('stackSize');
  if (ssEl) ssEl.style.color = ss >= 5 ? 'var(--red)' : ss >= 3 ? 'var(--yellow)' : 'var(--green)';

  // Repair window indicator
  updateRepairWindow(nli);

  // Live graph
  updateLiveGraph();
}

function updateLiveGraph() {
  if (!sim) return;
  const hist = sim.moveHistory;
  if (!hist || hist.length === 0) return;
  const nliPoly   = document.getElementById('graphNLI');
  const trustPoly = document.getElementById('graphTrust');
  if (!nliPoly || !trustPoly) return;

  const W = 160, H = 80, pad = 4;
  const total = Math.max(hist.length, 1);
  const pts = (arr) => arr.map((v, i) => {
    const x = pad + (i / Math.max(total - 1, 1)) * (W - pad * 2);
    const y = H - pad - v * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const nliVals   = hist.map(r => Math.max(0, Math.min(1, r.nli ?? 0)));
  const trustVals = hist.map(r => Math.max(0, Math.min(1, r.trust ?? 0)));

  nliPoly.setAttribute('points',   pts(nliVals));
  trustPoly.setAttribute('points', pts(trustVals));
}

function updateCardsDisplay(cards) {
  if (!cards) return;
  updateCard('devotion',  cards.devotionIn);
  updateCard('excitement', cards.excitementIn);
  updateCard('presence',  cards.presenceIn);
}

function updateCard(name, inHand) {
  const dot  = document.getElementById(`dot_${name}`);
  const pill = document.getElementById(`pill_${name}`);
  if (!dot || !pill) return;
  if (inHand) {
    pill.textContent = 'IN HAND';
    pill.className   = 'card-status-pill pill-in';
    dot.style.opacity = '1';
  } else {
    pill.textContent = 'LOST';
    pill.className   = 'card-status-pill pill-out';
    dot.style.opacity = '0.3';
  }
}

function resetLeftSidebar() {
  setInner('moveCount', '0');
  setInner('lostCount', '0 / 3');
  setInner('exitDist', '∞');
  document.getElementById('conflictStack').innerHTML = '<div class="cs-empty">Clear</div>';
}

function renderConflictStack() {
  if (!sim) return;
  const el = document.getElementById('conflictStack');
  if (!el) return;
  const items = sim.stack.items;
  if (!items || items.length === 0) {
    el.innerHTML = '<div class="cs-empty">Clear</div>';
    return;
  }
  el.innerHTML = items.map(item =>
    `<div class="cs-item">${esc(item)}</div>`
  ).join('');
}

function setInner(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ══════════════════════════════════════════════════════════════════════
// TERMINAL
// ══════════════════════════════════════════════════════════════════════
function showTerminal(result) {
  const isGood = result.terminal === TC_SALVATION;

  setInner('termTitle', result.terminalLabel || 'SESSION ENDED');
  setInner('termMsg', result.terminalMessage || '');

  const titleEl = document.getElementById('termTitle');
  if (titleEl) titleEl.style.color = isGood ? 'var(--green)' : 'var(--red)';

  const iconEl = document.getElementById('termIcon');
  if (iconEl) iconEl.textContent = isGood ? '🃏' : '💔';

  // Cards remaining
  if (sim) {
    const cardsEl = document.getElementById('termCards');
    if (cardsEl) {
      const cards = [
        { name: 'DEVOTION',   in: sim.cards.devotionIn,   color: '#C678DD' },
        { name: 'EXCITEMENT', in: sim.cards.excitementIn, color: '#56B6C2' },
        { name: 'PRESENCE',   in: sim.cards.presenceIn,   color: '#98C379' }
      ];
      cardsEl.innerHTML = cards.map(c => `
        <div class="tc-card" style="background:${c.in ? c.color+'22' : 'rgba(248,81,73,.15)'};
          border:1px solid ${c.in ? c.color+'66' : 'rgba(248,81,73,.4)'};
          color:${c.in ? c.color : 'var(--red)'}">
          ${c.name} — ${c.in ? 'RETAINED' : 'LOST'}
        </div>`).join('');
    }
  }

  document.getElementById('terminalOverlay').style.display = 'flex';

  // Capture summary for all report generators (before sim possibly resets)
  if (sim) {
    lastSessionSummary = sim.getSessionSummary();
    saveSession(lastSessionSummary, currentChatId);
  }

  // Drop analysis cards into chat permanently
  addFutureSection(result);
  addPsychSection();
  addArchetypeCard();

  // Final Letter — custom chats only, on bad endings
  const badEndings = [TC_CHECKMATE, TC_ALL_CARDS_LOST, TC_TRUST_FLOOR, TC_AMYGDALA, TC_STACK_OVERFLOW];
  if (isCustomMode && currentChatSetup && badEndings.includes(result.terminal)) {
    setTimeout(() => generateFinalLetter(currentChatSetup, lastSessionSummary), 1500);
  }
}

function addFutureSection(result) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const s   = lastSessionSummary || (sim ? sim.getSessionSummary() : {});
  const tc  = result?.terminal || 0;

  const endings = {
    1: { icon: '🃏', label: 'SALVATION',          color: 'var(--green)',    note: 'All three cards retained. Probability: 0.0000001. This almost never happens.' },
    2: { icon: '♟',  label: 'CHECKMATE',           color: 'var(--yellow)',   note: 'Be7# — The Immortal Game ends. The bishop delivers finality. A brilliant game, played until there was nothing left to play.' },
    3: { icon: '🧠', label: 'AMYGDALA OVERRIDE',   color: 'var(--red)',      note: 'NLI exceeded 0.85. The prefrontal cortex went dark. The last move was not a choice — it was a reflex.' },
    4: { icon: '📚', label: 'STACK OVERFLOW',       color: 'var(--red)',      note: '7 unresolved conflicts stacked with nowhere to go. The cortisol buffer collapsed under its own weight.' },
    5: { icon: '🔓', label: 'TRUST FLOOR',          color: 'var(--orange)',   note: 'Trust dropped below 10%. The exit path is one move. The relationship is structurally over.' },
    6: { icon: '🂠', label: 'HAND EMPTY',           color: 'var(--red)',      note: 'All three cards lost. The game was played. The manual was lost long before the last move.' },
    7: { icon: '⏱',  label: '23 MOVES COMPLETE',    color: 'var(--blue)',     note: `${s.cardsLost ?? 0} card(s) lost across 23 moves. The session is over. The record stands.` },
  };
  const end = endings[tc] || { icon: '◆', label: 'SESSION ENDED', color: 'var(--muted)', note: '' };

  const div = document.createElement('div');
  div.className = 'future-section';
  div.innerHTML = `
    <div class="fs-terminal">
      <span class="fs-icon">${end.icon}</span>
      <span class="fs-label" style="color:${end.color}">${end.label}</span>
    </div>
    <div class="fs-note">${end.note}</div>
    <div class="fs-heading">WHAT'S NEXT</div>
    <div class="fs-items">
      <div class="fs-item">
        <span class="fs-bullet" style="color:var(--blue)">→</span>
        <span>Open the <strong>DSA Report</strong> to see exactly which structures fired and what your behavioral pattern was.</span>
      </div>
      <div class="fs-item">
        <span class="fs-bullet" style="color:var(--devotion)">→</span>
        <span>Try a <strong>different relationship type</strong> — the same words land differently in a Partner vs. Colleague simulation.</span>
      </div>
      <div class="fs-item">
        <span class="fs-bullet" style="color:var(--presence)">→</span>
        <span>The <strong>Sovereign Key</strong> <code>LOSTCARD_SOVEREIGN</code> unlocks the full recovery path in the C++ terminal version.</span>
      </div>
      <div class="fs-item">
        <span class="fs-bullet" style="color:var(--orange)">→</span>
        <span><strong>Coming in future versions:</strong> Longitudinal arc tracking · Repair Protocols · Amygdala Calibration Module · Multi-session decay curves</span>
      </div>
    </div>
    <div class="fs-quote">"There is nothing to talk about…"</div>`;
  msgs.appendChild(div);
  scrollMessages();
}

function addPsychSection() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs || !lastSessionSummary) return;
  const s = lastSessionSummary;

  const devLost  = !s.devotion?.startsWith('RETAINED');
  const excLost  = !s.excitement?.startsWith('RETAINED');
  const presLost = !s.presence?.startsWith('RETAINED');
  const nli      = parseFloat(s.finalNLI) || 0;

  let profile = 'BALANCED', profileColor = 'var(--blue)';
  if (s.cardsLost === 0)                       { profile = 'SECURE — REGULATED';    profileColor = 'var(--green)'; }
  else if (s.amygdalaOverrides > 2)            { profile = 'REACTIVE — AGGRESSIVE'; profileColor = 'var(--red)'; }
  else if (presLost && !excLost && !devLost)   { profile = 'AVOIDANT — WITHDRAWN';  profileColor = 'var(--yellow)'; }
  else if (excLost && s.stackMaxDepth >= 5)    { profile = 'ESCALATORY';            profileColor = 'var(--orange)'; }
  else if (devLost && nli < 0.40)              { profile = 'HABITUAL — AGGRESSIVE'; profileColor = 'var(--red)'; }
  else if (s.cardsLost >= 2)                   { profile = 'MULTI-LOSS PATTERN';    profileColor = 'var(--devotion)'; }

  const div = document.createElement('div');
  div.className = 'future-section';
  div.innerHTML = `
    <div class="fs-terminal">
      <span class="fs-icon">🧠</span>
      <span class="fs-label" style="color:${profileColor}">PSYCHOLOGY: ${esc(profile)}</span>
    </div>
    <div class="fs-note" style="margin-bottom:12px">${esc(generatePsychSnippet(s))}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="fs-report-btn" onclick="showDSAReport('psych')">Full Psychology Report</button>
      <button class="fs-report-btn" onclick="showDSAReport('mistakes')">Mistakes &amp; Corrections</button>
      <button class="fs-report-btn" onclick="showDSAReport('chess')">Chess Analysis</button>
      <button class="fs-report-btn" onclick="showDSAReport('dsa')">DSA Report</button>
    </div>`;
  msgs.appendChild(div);
  scrollMessages();
}

function addArchetypeCard() {
  const s = lastSessionSummary;
  if (!s) return;
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const archetype = getRelationalArchetype(s);
  const health    = calculateHealthScore(s);
  if (!archetype && !health) return;

  const div = document.createElement('div');
  div.className = 'future-section';
  div.innerHTML = `
    <div class="fs-terminal">
      <span class="fs-icon">${archetype?.icon || '◆'}</span>
      <span class="fs-label" style="color:${archetype?.color || 'var(--blue)'}">RELATIONAL ARCHETYPE: ${esc(archetype?.name || 'UNKNOWN')}</span>
      ${health ? `<span style="margin-left:auto;font-size:22px;font-weight:900;color:var(--blue)">${health.grade}</span>` : ''}
    </div>
    ${archetype ? `<div class="fs-note">${esc(archetype.desc)}</div><div style="font-size:11px;color:var(--muted);margin-top:6px;font-style:italic">${esc(archetype.pattern)}</div>` : ''}
    ${health ? `<div style="margin-top:10px;font-size:12px;color:var(--muted)">Health Score: <strong style="color:var(--text)">${health.score}/100</strong> — ${esc(health.verdict)}</div>` : ''}`;
  msgs.appendChild(div);
  scrollMessages();
}

function generatePsychSnippet(s) {
  const nli   = parseFloat(s.finalNLI) || 0;
  const trust = parseFloat(s.finalTrust) || 0;
  if (s.cardsLost === 0) {
    return 'All three cards retained across 23 moves. The nervous system stayed regulated throughout. This is the rarest outcome in the model — probability approximately 1 in 10 million. Open Full Psychology Report for the complete breakdown.';
  }
  const drops = [];
  if (!s.devotion?.startsWith('RETAINED'))   drops.push('Devotion (emotional investment)');
  if (!s.excitement?.startsWith('RETAINED')) drops.push('Excitement (relational energy)');
  if (!s.presence?.startsWith('RETAINED'))   drops.push('Presence (psychological availability)');
  const nliDesc = nli > 0.85 ? 'amygdala override — rational choice offline'
    : nli > 0.70 ? 'collapse state at termination'
    : nli > 0.40 ? 'stress state at termination'
    : 'relatively regulated at termination';
  const trustDesc = trust < 0.20 ? ' Trust was severely broken.' : trust < 0.50 ? ' Trust eroded significantly.' : '';
  return `${drops.join(' and ')} lost. Neurological state: ${nliDesc}. Phase log: ${s.phaseLog?.join(' → ') || 'HARMONY'}.${trustDesc} Open the Full Psychology Report for the complete attachment and cortisol analysis.`;
}

function updateChatStatus(chatId, stateLabel) {
  const item = document.querySelector(`.chat-item[data-id="${chatId}"]`);
  if (!item) return;
  let dot = item.querySelector('.ci-status-dot');
  if (!dot) {
    dot = document.createElement('span');
    dot.className = 'ci-status-dot';
    const meta = item.querySelector('.ci-meta');
    if (meta) meta.prepend(dot);
  }
  const colors = { HARMONY: 'var(--green)', FRACTURE: 'var(--yellow)', COLLAPSE: 'var(--red)', OVERRIDE: '#FF4444' };
  dot.style.background = colors[stateLabel] || 'var(--muted)';
  dot.title = stateLabel;
  updateHeaderBadge(stateLabel);
}

function closeTerminal() {
  document.getElementById('terminalOverlay').style.display = 'none';
  // Restart the same chat
  if (currentChatId) openChat(currentChatId);
}

function exitChat() {
  // Any back press on a live game = STALEMATE
  const isLiveGame = currentChatId
    && currentChatId !== 'ai_assistant'
    && sim
    && !sim.isOver();

  if (isLiveGame) {
    const sum = sim.getSessionSummary();
    sum.outcome           = 'STALEMATE';
    sum.terminalCondition = -1;
    saveSession(sum, currentChatId);
    const cardsLeft = 3 - (sim.cards ? sim.cards.lostCount() : 0);
    showToast(
      `Stalemate — saved to history. ${cardsLeft}/3 cards held after ${sim.move} move${sim.move === 1 ? '' : 's'}.`,
      'info'
    );
  }

  document.getElementById('chatConv').style.display    = 'none';
  document.getElementById('chatWelcome').style.display = '';
  document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
  if (currentChatId) delete customAIHistories[currentChatId];
  currentChatId        = null;
  currentChatSetup     = null;
  isCustomMode         = false;
  sim                  = null;
  isAITyping           = false;
  patternInterruptUsed = false;
  lastThresholdAlert   = 0;
  gottmanLogCurrent    = null;
  if (ghostSessionTimer) { clearTimeout(ghostSessionTimer); ghostSessionTimer = null; }
}

function updateHeaderBadge(label) {
  const badge = document.getElementById('headerStatusBadge');
  if (!badge) return;
  badge.textContent = label || 'HARMONY';
  const styleMap = {
    HARMONY:  { color: '#3FB950', border: 'rgba(63,185,80,.4)',  bg: 'rgba(63,185,80,.1)' },
    FRACTURE: { color: '#E3B341', border: 'rgba(227,179,65,.4)', bg: 'rgba(227,179,65,.1)' },
    COLLAPSE: { color: '#F85149', border: 'rgba(248,81,73,.4)',  bg: 'rgba(248,81,73,.1)' },
    OVERRIDE: { color: '#FF4444', border: 'rgba(255,68,68,.4)',  bg: 'rgba(255,68,68,.1)' },
  };
  const s = styleMap[label] || styleMap.HARMONY;
  badge.style.color       = s.color;
  badge.style.borderColor = s.border;
  badge.style.background  = s.bg;
}

// ── UNIFIED REPORT SYSTEM (DSA / Psychology / Mistakes / Chess) ───────
function showDSAReport(tab) {
  const s = lastSessionSummary || (sim ? sim.getSessionSummary() : null);
  if (!s) { showToast('No session data. Run a simulation first.', 'error'); return; }
  lastSessionSummary = s;
  switchReportTab(tab || 'dsa');
  document.getElementById('dsaReportOverlay').style.display = 'flex';
}
// Alias used by feature cards on home page
function openReport(tab) {
  const s = lastSessionSummary || (sim ? sim.getSessionSummary() : null);
  if (!s) {
    // No session yet — guide user to start one
    showSection('chatApp');
    setTimeout(() => showToast('Ek conversation complete karo — phir reports yahan dikhein gi 📊', 'info'), 350);
    return;
  }
  showDSAReport(tab);
}

function switchReportTab(tab) {
  document.querySelectorAll('.rtab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const s = lastSessionSummary;
  let html = '';
  if      (tab === 'dsa')       html = generateDSAReport(s);
  else if (tab === 'psych')     html = generatePsychReport(s);
  else if (tab === 'mistakes')  html = generateMistakesReport(s);
  else if (tab === 'chess')     html = generateChessReport(s);
  else if (tab === 'replay')    html = generateReplayReport(s);
  else if (tab === 'archetype') html = generateArchetypeReportHTML(s);
  document.getElementById('reportContent').innerHTML = html;
}

function renderReportHTML(text) {
  // Convert plain text report to styled HTML
  const lines = text.split('\n');
  let html = '';
  for (const line of lines) {
    const t = line.trim();
    if (!t) { html += '<div style="height:8px"></div>'; continue; }

    // Title line (all caps, long)
    if (/^LOST CARD —/.test(t)) {
      html += `<div style="font-size:15px;font-weight:800;color:#58A6FF;letter-spacing:1px;margin-bottom:2px">${esc(t)}</div>`;
    }
    // Section headers (all caps, short — no indent, not starting with spaces)
    else if (/^[A-Z][A-Z\s\/\-&()\d\.]+$/.test(t) && t.length < 60 && !t.startsWith('─') && !t.startsWith('[')) {
      html += `<div style="font-size:11px;font-weight:700;color:#E3B341;letter-spacing:1.5px;text-transform:uppercase;margin-top:10px;margin-bottom:4px;border-bottom:1px solid rgba(227,179,65,0.2);padding-bottom:3px">${esc(t)}</div>`;
    }
    // Sub-author line
    else if (t.startsWith('S. M. Minhal')) {
      html += `<div style="font-size:10px;color:#8B949E;margin-bottom:6px">${esc(t)}</div>`;
    }
    // Card RETAINED
    else if (t.includes('RETAINED') || t.includes('SALVATION') || t.includes('HELD')) {
      html += `<div style="padding:2px 0;color:#3FB950">${esc(t)}</div>`;
    }
    // Card LOST / warning
    else if (t.includes('LOST') || t.includes('WARNING') || t.includes('OVERRIDE') || t.includes('COLLAPSE')) {
      html += `<div style="padding:2px 0;color:#F85149">${esc(t)}</div>`;
    }
    // CAUTION
    else if (t.includes('CAUTION') || t.includes('ERODED') || t.includes('FRACTURE') || t.includes('STRAINED')) {
      html += `<div style="padding:2px 0;color:#E3B341">${esc(t)}</div>`;
    }
    // Session outcome line
    else if (t.startsWith('SESSION OUTCOME:') || t.startsWith('BEHAVIORAL PROFILE:')) {
      const [label, val] = t.split(':');
      html += `<div style="padding:3px 0;font-weight:700;color:#79BBFF">${esc(label + ':')} <span style="color:#E6EDF3">${esc(val?.trim() || '')}</span></div>`;
    }
    // Move lines (chess)
    else if (/^\s+\d{2}\s+/.test(line)) {
      html += `<div style="font-family:Consolas,monospace;font-size:11px;color:#C9D1D9;padding:1px 0">${esc(line)}</div>`;
    }
    // Divider
    else if (/^[─\-]{10,}/.test(t)) {
      html += `<hr style="border:none;border-top:1px solid rgba(88,166,255,0.15);margin:6px 0">`;
    }
    // Quote lines
    else if (t.startsWith('"') && t.endsWith('"')) {
      html += `<div style="font-style:italic;color:#8B949E;border-left:2px solid rgba(88,166,255,0.4);padding-left:10px;margin:8px 0">${esc(t)}</div>`;
    }
    // Arrow lines (→)
    else if (t.startsWith('→')) {
      html += `<div style="padding:2px 0 2px 8px;color:#79BBFF">${esc(t)}</div>`;
    }
    // Indented data lines
    else if (line.startsWith('  ') || line.startsWith('\t')) {
      html += `<div style="font-family:Consolas,monospace;font-size:11px;color:#C9D1D9;padding:1px 4px">${esc(t)}</div>`;
    }
    // Normal line
    else {
      html += `<div style="padding:2px 0;color:#E6EDF3;font-size:12px">${esc(t)}</div>`;
    }
  }
  return html;
}

function generateReplayReport(s) {
  if (!s) return '<div style="color:var(--muted);padding:20px;text-align:center">No session data.</div>';
  const log = s.moveLog;
  if (!log || log.length === 0) return `<div class="rpt-wrap"><div class="rpt-header"><div class="rpt-eyebrow">LOST CARD · SESSION REPLAY</div></div><div style="color:var(--muted);padding:32px;text-align:center;font-size:13px">No move log recorded.<br><span style="font-size:11px">Sessions from before this update will not have a replay log.<br>Play a new session to see move-by-move analysis.</span></div></div>`;

  const typeColor = { SOFT: 'var(--green)', AGGRESSIVE: 'var(--red)', SILENT: 'var(--yellow)' };
  const typeIcon  = { SOFT: '💚', AGGRESSIVE: '🔴', SILENT: '🟡' };
  const stateColor = s => s === 'HARMONY' ? 'var(--green)' : s === 'FRACTURE' ? 'var(--yellow)' : s === 'COLLAPSE' ? 'var(--orange)' : 'var(--red)';
  const stateIcon  = s => s === 'HARMONY' ? '✓' : s === 'FRACTURE' ? '⚠' : s === 'COLLAPSE' ? '✗' : '☠';
  const nliColor   = n => n > 0.85 ? 'var(--red)' : n > 0.70 ? 'var(--orange)' : n > 0.40 ? 'var(--yellow)' : 'var(--green)';
  const finalTrust = (parseFloat(s.finalTrust)*100).toFixed(0);
  const finalState = s.finalState || 'UNKNOWN';

  return `<div class="rpt-wrap">
    <div class="rpt-header">
      <div class="rpt-eyebrow">LOST CARD · SESSION REPLAY</div>
      <div class="rpt-author">${s.outcome} · ${s.moves} moves · ${s.cardsLost}/3 cards lost</div>
    </div>

    <div class="rpt-section-label">MOVE-BY-MOVE BREAKDOWN</div>
    <div class="rpt-replay-table">
      <div class="rpt-replay-thead">
        <span>#</span><span>Type</span><span>NLI</span><span>Trust</span><span>State</span><span>Events</span>
      </div>
      ${log.map(m => {
        const nli  = parseFloat(m.nli)   || 0;
        const trst = parseFloat(m.trust) || 0;
        const tc   = typeColor[m.type] || 'var(--muted)';
        const sc   = stateColor(m.state);
        const events = [];
        if (m.cards) events.push(`<span class="rpt-replay-event" style="color:var(--red)">✗ ${m.cards}</span>`);
        if (m.chess) events.push(`<span class="rpt-replay-event" style="color:var(--blue)">♟ ${m.chess}</span>`);
        return `<div class="rpt-replay-row">
          <span class="rpt-replay-num">${String(m.move).padStart(2,'0')}</span>
          <span><span class="rpt-replay-type" style="background:${tc}18;color:${tc};border-color:${tc}44">${typeIcon[m.type]||'○'} ${m.type}</span></span>
          <span style="font-family:Consolas,monospace;font-size:11px;color:${nliColor(nli)}">${m.nli}</span>
          <span style="font-family:Consolas,monospace;font-size:11px;color:${trst<0.3?'var(--red)':trst<0.6?'var(--yellow)':'var(--green)'}">${Math.round(trst*100)}%</span>
          <span style="font-size:10px;font-weight:700;color:${sc}">${stateIcon(m.state)} ${m.state}</span>
          <span>${events.join(' ')}</span>
        </div>`;
      }).join('')}
    </div>

    <div class="rpt-replay-summary">
      <div class="rpt-replay-sum-cell">
        <span style="color:var(--muted);font-size:10px">FINAL NLI</span>
        <span style="font-weight:700;color:${nliColor(parseFloat(s.finalNLI)||0)}">${s.finalNLI}</span>
      </div>
      <div class="rpt-replay-sum-cell">
        <span style="color:var(--muted);font-size:10px">FINAL TRUST</span>
        <span style="font-weight:700;color:${parseFloat(s.finalTrust)<0.3?'var(--red)':parseFloat(s.finalTrust)<0.6?'var(--yellow)':'var(--green)'}">${finalTrust}%</span>
      </div>
      <div class="rpt-replay-sum-cell">
        <span style="color:var(--muted);font-size:10px">FINAL STATE</span>
        <span style="font-weight:700;color:${stateColor(finalState)}">${finalState}</span>
      </div>
    </div>

    ${s.phaseLog?.length > 1 ? `<div style="margin:12px 0 0"><div style="font-size:10px;letter-spacing:1.5px;color:var(--muted);margin-bottom:6px">PHASE PROGRESSION</div><div class="rpt-phase-flow">${s.phaseLog.map((p,i) => `<span class="rpt-phase-node" style="color:${p==='HARMONY'?'var(--green)':p==='FRACTURE'?'var(--yellow)':p==='COLLAPSE'?'var(--orange)':'var(--red)'}">${p}</span>${i<s.phaseLog.length-1?'<span class="rpt-phase-arrow">→</span>':''}`).join('')}</div></div>` : ''}

    <div class="rpt-quote">"The game was played. This is what it looked like."</div>
  </div>`;
}

function closeDSAReport() {
  document.getElementById('dsaReportOverlay').style.display = 'none';
}

function exportReportPDF() {
  const s = lastSessionSummary;
  if (!s) { showToast('No session data.', 'error'); return; }

  try {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) { showToast('PDF library not loaded. Check your connection.', 'error'); return; }

    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const W   = doc.internal.pageSize.getWidth();
    const H   = doc.internal.pageSize.getHeight();
    const LM  = 52, RM = 52, TM = 56, BM = 48;
    const CW  = W - LM - RM;  // content width
    let y = TM;

    // Fill page background — called at start of each page
    const fillBg = () => {
      doc.setFillColor(13, 17, 23);
      doc.rect(0, 0, W, H, 'F');
    };
    fillBg();

    // Track pages and auto-fill background on new pages
    let currentPage = 1;
    const checkPage = (needed = 14) => {
      if (y + needed > H - BM) {
        doc.addPage();
        fillBg();
        y = TM;
        currentPage++;
        // Draw footer on new page
        doc.setFontSize(8);
        doc.setTextColor(100, 110, 120);
        doc.setFont('helvetica', 'normal');
        doc.text('LOST CARD — S. M. Minhal Abbas Rizvi', LM, H - 20);
        doc.text(`Page ${currentPage}`, W - RM, H - 20, { align: 'right' });
      }
    };

    const txt = (text, x, size, color, bold = false, align = 'left') => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const wrapped = doc.splitTextToSize(String(text), CW);
      wrapped.forEach(line => {
        checkPage(size * 1.6);
        doc.text(line, align === 'right' ? W - RM : x, y, { align });
        y += size * 1.6;
      });
    };

    const rule = (color = [30, 38, 50]) => {
      checkPage(6);
      doc.setDrawColor(...color);
      doc.setLineWidth(0.5);
      doc.line(LM, y, W - RM, y);
      y += 6;
    };

    const sectionHeader = (title, icon = '') => {
      checkPage(28);
      y += 6;
      doc.setFillColor(22, 27, 34);
      doc.rect(LM - 6, y - 13, CW + 12, 22, 'F');
      doc.setFillColor(88, 166, 255);
      doc.rect(LM - 6, y - 13, 3, 22, 'F');
      txt(`${icon}  ${title}`, LM + 4, 11, [88, 166, 255], true);
      y += 4;
    };

    // ── COVER ──────────────────────────────────────────────────────────
    y = 70;
    txt('LOST CARD', LM, 32, [88, 166, 255], true);
    y -= 4;
    txt('A Computational Model of Relational Belief Decay', LM, 12, [139, 148, 158]);
    txt('S. M. Minhal Abbas Rizvi  ·  BSSE  ·  The Bet of Belief', LM, 10, [100, 110, 120]);
    y += 6;
    rule([40, 50, 65]);
    y += 4;

    // Session summary bar
    const outcome     = s.outcome || 'UNKNOWN';
    const ocColor     = outcome === 'SALVATION' ? [63, 185, 80] : outcome === 'STALEMATE' ? [227, 179, 65] : [248, 81, 73];
    const cardsRetained = 3 - (parseInt(s.cardsLost) || 0);

    doc.setFillColor(22, 27, 34);
    doc.rect(LM - 6, y - 10, CW + 12, 52, 'F');

    txt(`OUTCOME: ${outcome}`, LM + 4, 14, ocColor, true);
    y -= 2;
    txt(`${s.moves || 0} moves played  ·  ${s.cardsLost || 0}/3 cards lost  ·  ${cardsRetained}/3 cards retained  ·  NLI: ${s.finalNLI || 'N/A'}`, LM + 4, 9, [180, 190, 200]);
    txt(`Trust: ${Math.round((parseFloat(s.finalTrust) || 0) * 100)}%  ·  Phase: ${s.finalState || 'HARMONY'}  ·  ${s.chatName || ''}`, LM + 4, 9, [140, 150, 165]);
    y += 10;

    // Card chips
    const cardDefs = [
      { label: 'DEVOTION',   field: s.devotion,   color: [198, 120, 221] },
      { label: 'EXCITEMENT', field: s.excitement, color: [86, 182, 194] },
      { label: 'PRESENCE',   field: s.presence,   color: [152, 195, 121] },
    ];
    let cx = LM;
    cardDefs.forEach(c => {
      const kept = c.field?.startsWith('RETAINED');
      const bg   = kept ? c.color.map(v => Math.round(v * 0.15)) : [40, 15, 15];
      doc.setFillColor(...bg);
      doc.rect(cx, y - 10, 88, 18, 'F');
      doc.setDrawColor(...(kept ? c.color : [248, 81, 73]));
      doc.setLineWidth(0.6);
      doc.rect(cx, y - 10, 88, 18);
      doc.setFontSize(8);
      doc.setTextColor(...(kept ? c.color : [248, 81, 73]));
      doc.setFont('helvetica', 'bold');
      doc.text(`${c.label}: ${kept ? 'KEPT' : 'LOST'}`, cx + 6, y + 2);
      cx += 96;
    });
    y += 16;

    rule([40, 50, 65]);
    y += 8;

    // ── SECTIONS ───────────────────────────────────────────────────────
    const sections = [
      { icon: '●', title: 'DSA EXECUTION REPORT',      gen: generateDSAReport },
      { icon: '●', title: 'PSYCHOLOGY REPORT',          gen: generatePsychReport },
      { icon: '●', title: 'MISTAKES & CORRECTIONS',     gen: generateMistakesReport },
      { icon: '●', title: 'CHESS (MINIMAX) ANALYSIS',   gen: generateChessReport },
      { icon: '●', title: 'MOVE-BY-MOVE REPLAY',        gen: generateReplayReport },
    ];

    // Strip HTML for PDF rendering (generators now return HTML for web display)
    const htmlToText = (html) => html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&middot;/g, '·')
      .replace(/\n{3,}/g, '\n\n').trim();

    sections.forEach(sec => {
      sectionHeader(sec.title, sec.icon);
      const rawHtml = sec.gen(s);
      const content = htmlToText(rawHtml);
      content.split('\n').forEach(line => {
        if (!line.trim()) { y += 4; return; }
        // Color-code key lines
        const isSubHead = /^[A-Z][A-Z\s\/\-&()\d\.]{5,}$/.test(line.trim()) && line.trim().length < 55 && !line.startsWith(' ');
        const isGood    = line.includes('RETAINED') || line.includes('SALVATION');
        const isBad     = line.includes('LOST') || line.includes('COLLAPSE') || line.includes('OVERRIDE');
        const isWarn    = line.includes('CAUTION') || line.includes('FRACTURE');
        const isQuote   = line.trim().startsWith('"') && line.trim().endsWith('"');
        const isArrow   = line.trim().startsWith('→');
        const isIndent  = line.startsWith('  ');

        if (isSubHead) {
          y += 4;
          txt(line.trim(), LM, 9, [227, 179, 65], true);
        } else if (isGood) {
          txt(line, LM, 9, [63, 185, 80]);
        } else if (isBad) {
          txt(line, LM, 9, [248, 81, 73]);
        } else if (isWarn) {
          txt(line, LM, 9, [227, 179, 65]);
        } else if (isQuote) {
          y += 2;
          doc.setDrawColor(88, 166, 255, 0.4);
          doc.setLineWidth(1.5);
          doc.line(LM, y - 8, LM, y + 4);
          txt(line.trim(), LM + 8, 9, [130, 140, 158], false);
          y += 2;
        } else if (isArrow) {
          txt(line, LM + 4, 9, [121, 187, 255]);
        } else if (isIndent) {
          txt(line, LM + 8, 9, [180, 190, 205], false);
        } else {
          txt(line, LM, 9, [210, 220, 230]);
        }
      });
      y += 12;
    });

    // ── FOOTER ON LAST PAGE ────────────────────────────────────────────
    rule([40, 50, 65]);
    txt('"Every word we speak in a relationship is a card we play. We play without knowing we are in a game."', LM, 9, [100, 110, 125], false);
    txt('— S. M. Minhal Abbas Rizvi, The Bet of Belief', LM, 8, [80, 90, 105]);

    // Add footer text to every page (background already painted per page)
    const totalPages = doc.internal.pages.length - 1;
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(100, 110, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('LOST CARD — S. M. Minhal Abbas Rizvi', LM, H - 20);
      doc.text(`Page ${p} / ${totalPages}`, W - RM, H - 20, { align: 'right' });
    }

    const filename = `LOSTCARD_${(s.chatName || 'Session').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`;
    doc.save(filename);
    showToast('PDF downloaded!', 'success');
  } catch(e) {
    console.error('PDF error:', e);
    showToast('Export failed: ' + (e.message || 'Unknown error'), 'error');
  }
}

function generateDSAReport(s) {
  if (!s) return '<div style="color:var(--muted);padding:20px;text-align:center">No session data.</div>';
  const trust = (parseFloat(s.finalTrust)*100).toFixed(0);
  const devLost  = !s.devotion?.startsWith('RETAINED');
  const excLost  = !s.excitement?.startsWith('RETAINED');
  const presLost = !s.presence?.startsWith('RETAINED');
  const cardChip = (label, lost, color) =>
    `<div class="rpt-card-chip" style="border-color:${lost?'rgba(248,81,73,0.4)':color+'44'};background:${lost?'rgba(248,81,73,0.08)':color+'11'}">
       <span style="color:${lost?'#F85149':color};font-size:15px">${lost?'✗':'✓'}</span>
       <div><div style="font-size:11px;font-weight:700;color:${lost?'#F85149':color}">${label}</div>
       <div style="font-size:10px;color:var(--muted)">${lost?'LOST':'HELD'}</div></div>
     </div>`;
  const dsaRow = (icon, name, desc, val, valColor) =>
    `<div class="rpt-dsa-row">
       <div class="rpt-dsa-icon">${icon}</div>
       <div class="rpt-dsa-info"><div class="rpt-dsa-name">${name}</div><div class="rpt-dsa-desc">${desc}</div></div>
       <div class="rpt-dsa-val" style="color:${valColor||'var(--blue)'}">${val}</div>
     </div>`;
  const outcomeColor = s.terminalCondition === 1 ? 'var(--green)' : s.cardsLost === 3 ? 'var(--red)' : s.cardsLost > 0 ? 'var(--yellow)' : 'var(--blue)';
  const stateColor = s.finalState === 'HARMONY' ? 'var(--green)' : s.finalState === 'FRACTURE' ? 'var(--yellow)' : s.finalState === 'COLLAPSE' ? 'var(--orange)' : 'var(--red)';
  const nli = parseFloat(s.finalNLI) || 0;

  return `<div class="rpt-wrap">
    <div class="rpt-header">
      <div class="rpt-eyebrow">LOST CARD · DSA EXECUTION REPORT</div>
      <div class="rpt-author">S. M. Minhal Abbas Rizvi · The Bet of Belief Framework</div>
    </div>

    <div class="rpt-outcome-banner" style="border-color:${outcomeColor}44;background:${outcomeColor}0D">
      <div style="font-size:12px;font-weight:800;color:${outcomeColor};letter-spacing:0.5px">${s.outcome || 'SESSION COMPLETE'}</div>
      <div class="rpt-outcome-meta">
        <span>${s.moves}/23 moves</span>
        <span>${s.cardsLost}/3 cards lost</span>
        <span>NLI ${s.finalNLI}</span>
        <span style="color:${stateColor}">${s.finalState}</span>
      </div>
    </div>

    <div class="rpt-section-label">CARD STATUS</div>
    <div class="rpt-cards-row">
      ${cardChip('DEVOTION',   devLost,  '#C678DD')}
      ${cardChip('EXCITEMENT', excLost,  '#56B6C2')}
      ${cardChip('PRESENCE',   presLost, '#98C379')}
    </div>

    <div class="rpt-section-label">NEUROLOGICAL FINAL STATE</div>
    <div class="rpt-stat-row">
      <div class="rpt-stat-box">
        <div class="rpt-stat-val" style="color:${nli>0.70?'var(--red)':nli>0.40?'var(--yellow)':'var(--green)'}">${s.finalNLI}</div>
        <div class="rpt-stat-lbl">Final NLI</div>
      </div>
      <div class="rpt-stat-box">
        <div class="rpt-stat-val" style="color:${stateColor}">${s.finalState}</div>
        <div class="rpt-stat-lbl">State</div>
      </div>
      <div class="rpt-stat-box">
        <div class="rpt-stat-val" style="color:${parseFloat(s.finalTrust)>0.60?'var(--green)':parseFloat(s.finalTrust)>0.30?'var(--yellow)':'var(--red)'}">${trust}%</div>
        <div class="rpt-stat-lbl">Trust</div>
      </div>
    </div>
    ${s.phaseLog?.length > 1 ? `<div class="rpt-phase-flow">${s.phaseLog.map((p,i) => `<span class="rpt-phase-node" style="color:${p==='HARMONY'?'var(--green)':p==='FRACTURE'?'var(--yellow)':p==='COLLAPSE'?'var(--orange)':'var(--red)'}">${p}</span>${i<s.phaseLog.length-1?'<span class="rpt-phase-arrow">→</span>':''}`).join('')}</div>` : ''}

    <div class="rpt-section-label">7 DSA STRUCTURES</div>
    <div class="rpt-dsa-list">
      ${dsaRow('⬡','Weighted DAG + Dijkstra','22 nodes · hippocampal memory network · O((V+E)log V)', 'Exit path: ' + (s.exitPath || 'computed'), 'var(--blue)')}
      ${dsaRow('⬢','LIFO Stack','Cortisol buffer · NLI-gated pop · max depth 7', (s.stackMaxDepth||0) >= 5 ? `<span style="color:var(--red)">${s.stackMaxDepth}/7 ⚠</span>` : `${s.stackMaxDepth||0}/7`, s.stackMaxDepth >= 5 ? 'var(--red)' : 'var(--green)')}
      ${dsaRow('◈','Min-Heap Priority Queue','PFC choice corruption · amygdala overrides', `${s.amygdalaOverrides||0} override${(s.amygdalaOverrides||0)!==1?'s':''}`, (s.amygdalaOverrides||0)>0?'var(--red)':'var(--green)')}
      ${dsaRow('◉','Singly Linked List','Default Mode Network · intentional memory leak', `${s.lostMemories?.length || 0} memories`, s.lostMemories?.length > 0 ? 'var(--yellow)' : 'var(--muted)')}
      ${dsaRow('⬟','Hash Map','Sovereign key · protected identity segments', '2 segments', 'var(--blue)')}
      ${dsaRow('◆','Finite State Machine','Relationship phase transitions · NLI-driven', `${s.phaseLog?.length || 0} transitions`, 'var(--blue)')}
      ${dsaRow('♟','Minimax Algorithm','Chess · consequence anticipation · depth 2', `eval: ${s.chessEval || 'N/A'}`, parseFloat(s.chessEval) <= -5 ? 'var(--red)' : parseFloat(s.chessEval) > 0 ? 'var(--green)' : 'var(--yellow)')}
    </div>

    ${s.lostMemories?.length > 0 ? `<div class="rpt-section-label">MEMORY LEAK — LONGING LIST</div>
    <div class="rpt-memory-list">${s.lostMemories.map(m => `<div class="rpt-memory-item"><span class="rpt-memory-dot"></span><span>${m}</span></div>`).join('')}</div>` : ''}

    <div class="rpt-quote">"Every word we speak in a relationship is a card we play. We play without knowing we are in a game."</div>
  </div>`;
}

function generatePsychReport(s) {
  if (!s) return '<div style="color:var(--muted);padding:20px;text-align:center">No session data.</div>';
  const nli   = parseFloat(s.finalNLI) || 0;
  const trust = parseFloat(s.finalTrust) || 0;
  const devLost  = !s.devotion?.startsWith('RETAINED');
  const excLost  = !s.excitement?.startsWith('RETAINED');
  const presLost = !s.presence?.startsWith('RETAINED');
  let profile = 'BALANCED';
  let profileColor = 'var(--blue)';
  if      (s.cardsLost === 0)                 { profile = 'SECURE — REGULATED';       profileColor = 'var(--green)'; }
  else if ((s.amygdalaOverrides||0) > 2)      { profile = 'REACTIVE — AGGRESSIVE';    profileColor = 'var(--red)'; }
  else if (presLost && !excLost && !devLost)  { profile = 'AVOIDANT — WITHDRAWN';     profileColor = 'var(--yellow)'; }
  else if (excLost && s.stackMaxDepth >= 5)   { profile = 'ESCALATORY';               profileColor = 'var(--orange)'; }
  else if (devLost && nli < 0.40)             { profile = 'HABITUAL — AGGRESSIVE';    profileColor = 'var(--red)'; }
  else if (s.cardsLost >= 2)                  { profile = 'MULTI-LOSS PATTERN';       profileColor = 'var(--orange)'; }
  const nliLabel   = nli > 0.85 ? 'Amygdala Override — PFC offline' : nli > 0.70 ? 'Full Collapse' : nli > 0.40 ? 'Stressed' : 'Regulated';
  const nliColor   = nli > 0.85 ? 'var(--red)' : nli > 0.70 ? 'var(--orange)' : nli > 0.40 ? 'var(--yellow)' : 'var(--green)';
  const trustLabel = trust < 0.20 ? 'Severely Broken' : trust < 0.50 ? 'Significantly Eroded' : trust < 0.75 ? 'Strained' : 'Maintained';
  const trustColor = trust < 0.20 ? 'var(--red)' : trust < 0.50 ? 'var(--orange)' : trust < 0.75 ? 'var(--yellow)' : 'var(--green)';
  const stackDepth = s.stackMaxDepth || 0;
  const stackColor = stackDepth >= 5 ? 'var(--red)' : stackDepth >= 3 ? 'var(--yellow)' : 'var(--green)';
  const stackMsg   = stackDepth >= 5 ? 'Chronic conflict accumulation — nervous system overloaded.'
                   : stackDepth >= 3 ? 'Moderate build-up — resolution was partially blocked.'
                   : 'Buffer manageable — conflict resolution was accessible.';
  const amygdala   = s.amygdalaOverrides || 0;
  const amygMsg    = amygdala > 2 ? 'The rational mind was repeatedly hijacked. Choices were driven by threat, not intention.'
                   : amygdala === 1 ? 'One amygdala override — a moment the brain chose survival over connection.'
                   : 'PFC remained mostly online. Rational choice was preserved.';
  const honestMsg  = s.cardsLost === 0
    ? 'SALVATION — All cards kept across 23 moves. This almost never happens.'
    : s.cardsLost === 3
    ? 'All three cards lost. A complete hand-emptying. Not one collapse — a sequence that compounded. The pattern is specific and detectable. See Mistakes report.'
    : `${s.cardsLost} card(s) lost across ${s.moves} moves. The trajectory was recoverable at multiple points. The window closed. What was said was said.`;
  const cardRow = (name, lost, color, heldMsg, lostMsg) =>
    `<div class="rpt-attach-row" style="border-left:3px solid ${lost?'var(--red)':color}">
       <div class="rpt-attach-status" style="color:${lost?'var(--red)':color}">${lost?'LOST':'HELD'}</div>
       <div>
         <div style="font-size:11px;font-weight:700;color:${lost?'var(--red)':color};margin-bottom:2px">${name}</div>
         <div style="font-size:11px;color:var(--muted);line-height:1.5">${lost?lostMsg:heldMsg}</div>
       </div>
     </div>`;

  return `<div class="rpt-wrap">
    <div class="rpt-header">
      <div class="rpt-eyebrow">LOST CARD · PSYCHOLOGY REPORT</div>
      <div class="rpt-author">S. M. Minhal Abbas Rizvi · The Bet of Belief Framework</div>
    </div>

    <div class="rpt-profile-banner" style="border-color:${profileColor}44;background:${profileColor}0D">
      <div style="font-size:10px;letter-spacing:2px;color:var(--muted);margin-bottom:4px">BEHAVIORAL PROFILE</div>
      <div style="font-size:16px;font-weight:900;color:${profileColor};letter-spacing:0.5px">${profile}</div>
    </div>

    <div class="rpt-section-label">NEUROLOGICAL TRAJECTORY</div>
    <div class="rpt-neuro-grid">
      <div class="rpt-neuro-cell">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Final NLI State</div>
        <div style="font-size:13px;font-weight:700;color:${nliColor}">${nliLabel}</div>
        <div style="font-size:11px;color:var(--muted)">${s.finalNLI}</div>
      </div>
      <div class="rpt-neuro-cell">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Trust at End</div>
        <div style="font-size:13px;font-weight:700;color:${trustColor}">${trustLabel}</div>
        <div style="font-size:11px;color:var(--muted)">${Math.round(trust*100)}%</div>
      </div>
    </div>
    ${s.phaseLog?.length > 1 ? `<div style="margin-bottom:16px"><div style="font-size:10px;letter-spacing:1.5px;color:var(--muted);margin-bottom:6px">PHASE PROGRESSION</div><div class="rpt-phase-flow">${s.phaseLog.map((p,i) => `<span class="rpt-phase-node" style="color:${p==='HARMONY'?'var(--green)':p==='FRACTURE'?'var(--yellow)':p==='COLLAPSE'?'var(--orange)':'var(--red)'}">${p}</span>${i<s.phaseLog.length-1?'<span class="rpt-phase-arrow">→</span>':''}`).join('')}</div></div>` : ''}

    <div class="rpt-section-label">ATTACHMENT ANALYSIS</div>
    <div class="rpt-attach-list">
      ${cardRow('DEVOTION', devLost, '#C678DD',
        'Emotional investment was proportional and sustainable.',
        'Over-investment without reciprocal foundation.')}
      ${cardRow('EXCITEMENT', excLost, '#56B6C2',
        'Relational energy remained engaged throughout.',
        'Reactive escalation without de-escalation.')}
      ${cardRow('PRESENCE', presLost, '#98C379',
        'Psychological availability was maintained.',
        'Withdrawal under stress. Silence used as avoidance.')}
    </div>

    <div class="rpt-section-label">CORTISOL PROFILE</div>
    <div class="rpt-cortisol-bar">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:11px;color:var(--muted)">Stack Peak Depth</span>
        <span style="font-size:12px;font-weight:700;color:${stackColor}">${stackDepth} / 7</span>
      </div>
      <div style="background:var(--bg3);border-radius:4px;height:6px;overflow:hidden">
        <div style="height:100%;width:${(stackDepth/7*100).toFixed(0)}%;background:${stackColor};border-radius:4px;transition:width 0.8s ease"></div>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5">${stackMsg}</div>
    </div>

    <div class="rpt-section-label">PREFRONTAL CORTEX STATUS</div>
    <div class="rpt-pfc-box" style="border-color:${amygdala>0?'rgba(248,81,73,0.3)':'var(--border)'}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div style="font-size:24px;font-weight:900;color:${amygdala>2?'var(--red)':amygdala>0?'var(--orange)':'var(--green)'}">${amygdala}</div>
        <div><div style="font-size:11px;font-weight:700;color:var(--text)">Amygdala Override${amygdala!==1?'s':''}</div>
        <div style="font-size:10px;color:var(--muted)">NLI ≥ 0.85 events</div></div>
      </div>
      <div style="font-size:11px;color:var(--muted);line-height:1.6">${amygMsg}</div>
    </div>

    <div class="rpt-section-label">HONEST ASSESSMENT</div>
    <div class="rpt-honest-box" style="border-color:${s.cardsLost===0?'rgba(63,185,80,0.3)':s.cardsLost===3?'rgba(248,81,73,0.3)':'rgba(227,179,65,0.3)'}">
      <div style="font-size:13px;line-height:1.7;color:var(--text)">${honestMsg}</div>
    </div>

    <div class="rpt-quote">"Every word we speak in a relationship is a card we play. We play without knowing we are in a game."</div>
  </div>`;
}

function generateMistakesReport(s) {
  if (!s) return '<div style="color:var(--muted);padding:20px;text-align:center">No session data.</div>';
  const devLost  = !s.devotion?.startsWith('RETAINED');
  const excLost  = !s.excitement?.startsWith('RETAINED');
  const presLost = !s.presence?.startsWith('RETAINED');
  const trust    = parseFloat(s.finalTrust) || 0;
  const log      = s.moveLog || [];

  // ── Move-by-move mistake detection ───────────────────────────────────
  const mistakes = []; // { move, title, body, fix, severity }
  if (log.length > 0) {
    let prevType = null, silentRun = 0, highNLIRun = 0;
    log.forEach(m => {
      const nli  = parseFloat(m.nli)   || 0;
      const trst = parseFloat(m.trust) || 0;
      const type = m.type, mn = m.move;
      if (type === 'AGGRESSIVE' && prevType === 'AGGRESSIVE')
        mistakes.push({ move: mn, title: 'Double AGGRESSIVE', body: 'Two aggressive moves in a row — cortisol stacked before it could clear. The second press is always the one that breaks things.', fix: 'After any aggressive move, the next MUST be SOFT — no exceptions.', severity: 'high' });
      if (type === 'AGGRESSIVE' && nli < 0.30)
        mistakes.push({ move: mn, title: 'Calm-State Aggression', body: `AGGRESSIVE at NLI ${m.nli} — you were calm. This wasn't stress-driven; it was a choice. That's the pattern that loses Devotion.`, fix: 'Low NLI is the window for SOFT moves. Don\'t waste it on aggression.', severity: 'high' });
      if (type === 'AGGRESSIVE' && nli >= 0.70)
        mistakes.push({ move: mn, title: 'Overloaded Aggression', body: `AGGRESSIVE at NLI ${m.nli} — your prefrontal cortex was compromised. You escalated when you needed to decelerate.`, fix: 'At NLI > 0.70, pause. Even a SILENT move is better than AGGRESSIVE here.', severity: 'high' });
      if (type === 'SILENT') {
        silentRun++;
        if (silentRun === 2) mistakes.push({ move: mn, title: 'Second Silence', body: 'The other person is starting to feel the withdrawal. One silence is space. Two is a signal.', fix: 'Break the silence with something soft. It doesn\'t need to be much.', severity: 'med' });
        if (silentRun === 3) mistakes.push({ move: mn, title: 'Third Silence — PRESENCE LOST', body: 'Presence card is at breaking point. Absence became the message.', fix: 'Show up. Even one genuine word prevents this.', severity: 'high' });
      } else { silentRun = 0; }
      if (nli > 0.75) {
        highNLIRun++;
        if (highNLIRun === 2) mistakes.push({ move: mn, title: 'Sustained Overload', body: `NLI ${m.nli} — two moves deep into the red zone. You stayed too long in overload.`, fix: 'One SOFT move here drops NLI and breaks the chain before it becomes 3.', severity: 'med' });
      } else { highNLIRun = 0; }
      if (type === 'SOFT' && nli >= 0.50)
        mistakes.push({ move: mn, title: 'Repair Rejected (NLI Too High)', body: `SOFT move while NLI was ${m.nli} — the cortisol was too high for repair to land. The stack couldn't pop.`, fix: 'Repair only works when calm enough to receive it. Lower NLI first.', severity: 'low' });
      if (type === 'AGGRESSIVE' && trst < 0.35)
        mistakes.push({ move: mn, title: 'Aggression on Broken Trust', body: `AGGRESSIVE with trust at ${Math.round(trst*100)}% — you pressed when the foundation was already cracking.`, fix: 'When trust is below 40%, every SOFT move is more valuable than 5 aggressive ones.', severity: 'high' });
      prevType = type;
    });
  }

  const mistakeHTML = mistakes.length > 0
    ? mistakes.map(m => {
        const sc = m.severity === 'high' ? 'var(--red)' : m.severity === 'med' ? 'var(--orange)' : 'var(--yellow)';
        return `<div class="rpt-mistake-card" style="border-left-color:${sc}">
          <div class="rpt-mistake-header">
            <span class="rpt-mistake-move" style="background:${sc}22;color:${sc}">Move ${m.move}</span>
            <span class="rpt-mistake-title">${m.title}</span>
          </div>
          <div class="rpt-mistake-body">${m.body}</div>
          <div class="rpt-mistake-fix"><span style="color:var(--blue)">→</span> ${m.fix}</div>
        </div>`;
      }).join('')
    : log.length > 0
      ? `<div class="rpt-clean-session"><div style="font-size:22px">✓</div><div style="font-weight:700;color:var(--green)">Clean Pattern</div><div style="color:var(--muted);font-size:12px;margin-top:4px">No critical errors in the move sequence. Every escalation was managed within one move.</div></div>`
      : `<div class="rpt-clean-session"><div style="color:var(--muted);font-size:12px">No move log available. Play a session to see move-by-move analysis.</div></div>`;

  const lossCard = (name, color, cause, meaning, fix, rule) =>
    `<div class="rpt-loss-card" style="border-color:rgba(248,81,73,0.3)">
       <div class="rpt-loss-name" style="color:var(--red)">✗ ${name} LOST</div>
       <div class="rpt-loss-row"><span class="rpt-loss-label">Cause</span><span>${cause}</span></div>
       <div class="rpt-loss-row"><span class="rpt-loss-label">Meaning</span><span>${meaning}</span></div>
       <div class="rpt-loss-row"><span class="rpt-loss-label">Fix</span><span style="color:var(--blue)">${fix}</span></div>
       <div class="rpt-loss-rule">"${rule}"</div>
     </div>`;

  const rules = [
    { text: 'Never 2 consecutive AGGRESSIVE moves', icon: '⚡', color: 'var(--red)' },
    { text: 'Max 2 SILENT moves total — never 3 consecutive', icon: '🤫', color: 'var(--yellow)' },
    { text: 'When NLI crosses 0.60 → go SOFT immediately', icon: '🧠', color: 'var(--orange)' },
    { text: 'Don\'t invest Devotion before trust > 0.55', icon: '💜', color: '#C678DD' },
    { text: 'Repair only works when NLI < 0.50', icon: '🛠️', color: 'var(--green)' },
    { text: 'In real life: pause before the second hit', icon: '⏸️', color: 'var(--blue)' },
  ];

  return `<div class="rpt-wrap">
    <div class="rpt-header">
      <div class="rpt-eyebrow">LOST CARD · MISTAKES & CORRECTIONS</div>
      <div class="rpt-author">S. M. Minhal Abbas Rizvi · The Bet of Belief Framework</div>
    </div>

    ${(devLost || excLost || presLost || (s.amygdalaOverrides||0) > 0 || (s.stackMaxDepth||0) >= 4 || trust < 0.50) ? `
    <div class="rpt-section-label">WHAT WENT WRONG</div>
    <div class="rpt-loss-list">
      ${devLost  ? lossCard('DEVOTION',   '#C678DD', 'Aggression at low NLI (habitual), OR trust < 0.55 while dopamine high.', 'Investment given before the foundation could hold it.', 'Calibrate investment to trust level. Give less when trust is low.', 'Don\'t bet big on a hand you haven\'t earned yet.') : ''}
      ${excLost  ? lossCard('EXCITEMENT', '#56B6C2', 'Stack depth ≥4 + aggression, OR 2 consecutive AGGRESSIVE moves.', 'Cortisol buffer couldn\'t absorb the conflict pressure.', 'After any AGGRESSIVE move, the next MUST be SOFT.', 'Never press twice. The second press triggers the avalanche.') : ''}
      ${presLost ? lossCard('PRESENCE',   '#98C379', '3+ SILENT moves total, OR 3 consecutive moves with NLI > 0.75.', 'Nervous system chose withdrawal over engagement.', 'Silence is valid once. Twice signals retreat. Three times: lost.', 'Show up. Even imperfectly. Absence is the loudest message.') : ''}
      ${(s.amygdalaOverrides||0) > 0 ? `<div class="rpt-loss-card" style="border-color:rgba(248,81,73,0.3)"><div class="rpt-loss-name" style="color:var(--red)">⚠ AMYGDALA OVERRIDE ×${s.amygdalaOverrides}</div><div style="font-size:11px;color:var(--muted);line-height:1.6">NLI exceeded 0.85. The prefrontal cortex went offline.<br><span style="color:var(--blue)">Fix:</span> At NLI > 0.70, pause before responding. In real life: wait 5 minutes.</div></div>` : ''}
      ${(s.stackMaxDepth||0) >= 4 ? `<div class="rpt-loss-card" style="border-color:rgba(227,179,65,0.3)"><div class="rpt-loss-name" style="color:var(--yellow)">⚠ CORTISOL OVERLOAD — Stack ${s.stackMaxDepth}/7</div><div style="font-size:11px;color:var(--muted);line-height:1.6">Unresolved conflicts stacked beyond capacity.<br><span style="color:var(--blue)">Fix:</span> Each SOFT move at NLI < 0.50 resolves one conflict. One at a time.</div></div>` : ''}
      ${trust < 0.50 ? `<div class="rpt-loss-card" style="border-color:rgba(240,136,62,0.3)"><div class="rpt-loss-name" style="color:var(--orange)">⚠ TRUST EROSION — ${Math.round(trust*100)}%</div><div style="font-size:11px;color:var(--muted);line-height:1.6">Trust drops with AGGRESSIVE, recovers slowly with SOFT.<br><span style="color:var(--blue)">Note:</span> Below 10%: no recovery path exists — TC_TRUST_FLOOR fires.</div></div>` : ''}
      ${s.cardsLost === 0 ? `<div class="rpt-loss-card" style="border-color:rgba(63,185,80,0.3)"><div class="rpt-loss-name" style="color:var(--green)">✓ SALVATION — NO CARD LOSSES</div><div style="font-size:11px;color:var(--muted)">All three cards retained. This almost never happens.</div></div>` : ''}
    </div>` : ''}

    <div class="rpt-section-label">SPECIFIC MISTAKES IN THIS SESSION</div>
    ${mistakeHTML}

    <div class="rpt-section-label">HOW TO DO THIS DIFFERENTLY</div>
    <div class="rpt-rules-grid">
      ${rules.map(r => `<div class="rpt-rule-item"><div class="rpt-rule-icon">${r.icon}</div><div style="font-size:11px;color:var(--text);line-height:1.5">${r.text}</div></div>`).join('')}
    </div>

    <div class="rpt-quote">"There is nothing to talk about… unless you change the next move."</div>
  </div>`;
}

function generateArchetypeReportHTML(s) {
  if (!s) return '<div style="color:var(--muted);padding:20px">No session data.</div>';
  const archetype = getRelationalArchetype(s);
  const health    = calculateHealthScore(s);
  const log       = s.moveLog || [];

  // Gottman tone breakdown from moveLog
  const tones = {};
  log.forEach(m => {
    const baseType = m.type === 'SOFT' ? 0 : m.type === 'AGGRESSIVE' ? 1 : 2;
    const tone = classifyGottmanTone(m.move_text || m.type, baseType);
    tones[tone.tone] = (tones[tone.tone] || 0) + 1;
  });
  const toneRows = Object.entries(tones).sort((a,b) => b[1]-a[1]).map(([tone, count]) => {
    const t = log.map(m => classifyGottmanTone(m.move_text || m.type, m.type === 'SOFT' ? 0 : m.type === 'AGGRESSIVE' ? 1 : 2)).find(x => x.tone === tone);
    const color = t?.color || 'var(--muted)';
    const horseman = t?.horseman ? '🔴 HORSEMAN' : '';
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-weight:700;color:${color};min-width:130px">${tone}</span>
      <span style="color:var(--muted);font-size:12px">${count} occurrence${count !== 1 ? 's' : ''}</span>
      ${horseman ? `<span style="font-size:10px;color:var(--red);font-weight:700;background:rgba(248,81,73,0.1);padding:2px 6px;border-radius:4px">${horseman}</span>` : ''}
    </div>`;
  }).join('');

  return `<div style="padding:4px 0">
    <div style="font-size:11px;letter-spacing:2px;color:var(--blue);font-weight:700;margin-bottom:12px">RELATIONAL ARCHETYPE & HEALTH SCORE</div>

    ${archetype ? `<div style="background:var(--bg2);border:1px solid ${archetype.color}44;border-radius:12px;padding:18px;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span style="font-size:26px">${archetype.icon}</span>
        <div>
          <div style="font-size:16px;font-weight:800;color:${archetype.color}">${archetype.name}</div>
          <div style="font-size:11px;color:var(--muted);font-style:italic">${archetype.pattern}</div>
        </div>
        ${health ? `<div style="margin-left:auto;text-align:center"><div style="font-size:32px;font-weight:900;color:var(--blue)">${health.grade}</div><div style="font-size:11px;color:var(--muted)">${health.score}/100</div></div>` : ''}
      </div>
      <div style="font-size:13px;line-height:1.7;color:var(--text)">${archetype.desc}</div>
    </div>` : ''}

    ${health ? `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px">
      <div style="font-weight:700;margin-bottom:8px">HEALTH SCORE BREAKDOWN</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.8">
        <div>Card retention: ${3-(s.cardsLost||0)}/3 cards × 20 = <strong>${(3-(s.cardsLost||0))*20} pts</strong></div>
        <div>Final trust ${Math.round((parseFloat(s.finalTrust)||0)*100)}% × 0.2 = <strong>${Math.round((parseFloat(s.finalTrust)||0)*20)} pts</strong></div>
        <div>NLI inverse: <strong>~${Math.round((1-(parseFloat(s.finalNLI)||0))*10)} pts</strong></div>
        <div>Phase harmony ratio: <strong>~pts</strong></div>
        ${(s.amygdalaOverrides||0)>0 ? `<div style="color:var(--red)">Amygdala override penalty: −${Math.min(10,(s.amygdalaOverrides||0)*3)} pts</div>` : ''}
        <div style="margin-top:8px;color:var(--text);font-weight:600">VERDICT: ${health.verdict}</div>
      </div>
    </div>` : ''}

    ${toneRows ? `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px">
      <div style="font-weight:700;margin-bottom:10px">MOVE TYPE DISTRIBUTION</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Broad classification across the session. Gottman-specific subtones (Contempt, Defensiveness, etc.) are shown live in the chat UI under each message as you type.</div>
      ${toneRows}
    </div>` : ''}
  </div>`;
}

function generateChessReport(s) {
  const ALL_MOVES = [
    {w:'e4',   b:'e5',     wp:'Pawn',   br:'mirror center'},
    {w:'f4',   b:'exf4',   wp:'Pawn',   br:'gambit accepted'},
    {w:'Bc4',  b:'Qh4+',   wp:'Bishop', br:'queen enters with check'},
    {w:'Kf1',  b:'b5',     wp:'King',   br:'queenside flank thrust'},
    {w:'Bxb5', b:'Nf6',    wp:'Bishop', br:'knight pressures queen'},
    {w:'Nf3',  b:'Qh6',    wp:'Knight', br:'queen repositions'},
    {w:'d3',   b:'Nh5',    wp:'Pawn',   br:'knight advances to rim'},
    {w:'Nh4',  b:'Qg5',    wp:'Knight', br:'queen holds center'},
    {w:'Nf5',  b:'c6',     wp:'Knight', br:'pawn challenges knight'},
    {w:'g4',   b:'Nf6',    wp:'Pawn',   br:'knight forced back'},
    {w:'Rg1',  b:'cxb5',   wp:'Rook',   br:'pawn recapture'},
    {w:'h4',   b:'Qg6',    wp:'Pawn',   br:'queen sidesteps'},
    {w:'h5',   b:'Qg5',    wp:'Pawn',   br:'queen holds position'},
    {w:'Qf3',  b:'Ng8',    wp:'Queen',  br:'knight retreats — lost tempo'},
    {w:'Bxf4', b:'Qf6',    wp:'Bishop', br:'queen activates'},
    {w:'Nc3',  b:'Bc5',    wp:'Knight', br:'bishop joins attack'},
    {w:'Nd5',  b:'Qxb2',   wp:'Knight', br:'queen raids queenside'},
    {w:'Bd6',  b:'Bxg1',   wp:'Bishop', br:'exchange sacrifice'},
    {w:'e5',   b:'Qxa1+',  wp:'Pawn',   br:'queen delivers check'},
    {w:'Ke2',  b:'Na6',    wp:'King',   br:'knight enters the board'},
    {w:'Nxg7+',b:'Kd8',    wp:'Knight', br:'king forced to flee'},
    {w:'Qf6+', b:'Nxf6',   wp:'Queen',  br:'knight interposes'},
    {w:'Be7#', b:'—',      wp:'Bishop', br:'CHECKMATE — finality'}
  ];
  const playedMoves = Math.min(parseInt(s?.moves) || 0, 23);
  const eval_       = (s || lastSessionSummary)?.chessEval || 'N/A';
  const evalNum     = parseFloat(eval_);
  const evalColor   = evalNum <= -5 ? 'var(--red)' : evalNum < 0 ? 'var(--orange)' : evalNum > 1 ? 'var(--green)' : 'var(--yellow)';
  const incomplete  = playedMoves < 23;
  const movesPlayed = ALL_MOVES.slice(0, playedMoves);

  return `<div class="rpt-wrap">
    <div class="rpt-header">
      <div class="rpt-eyebrow">LOST CARD · CHESS (MINIMAX) REPORT</div>
      <div class="rpt-author">The Immortal Game — Anderssen vs. Kieseritzky, London 1851</div>
    </div>

    <div class="rpt-chess-meta">
      <div class="rpt-chess-meta-cell">
        <div class="rpt-stat-val" style="color:var(--blue)">${playedMoves}<span style="font-size:14px;color:var(--muted)">/23</span></div>
        <div class="rpt-stat-lbl">Moves Played</div>
      </div>
      <div class="rpt-chess-meta-cell">
        <div class="rpt-stat-val" style="color:${evalColor}">${eval_}</div>
        <div class="rpt-stat-lbl">Position Eval</div>
      </div>
      <div class="rpt-chess-meta-cell">
        <div class="rpt-stat-val" style="color:${incomplete?'var(--yellow)':'var(--green)'}">${incomplete ? 'OPEN' : 'Be7#'}</div>
        <div class="rpt-stat-lbl">${incomplete ? 'Game In Progress' : 'Checkmate'}</div>
      </div>
    </div>

    <div class="rpt-section-label">GAME MOVES</div>
    <div class="rpt-chess-board">
      <div class="rpt-chess-thead">
        <span>#</span><span>White (Anderssen)</span><span>Black (Kieseritzky)</span><span>White Piece</span>
      </div>
      ${movesPlayed.length > 0
        ? movesPlayed.map((m,i) => `<div class="rpt-chess-row ${i===playedMoves-1&&!incomplete?'rpt-chess-final':''}">
            <span class="rpt-chess-num">${String(i+1).padStart(2,'0')}</span>
            <span class="rpt-chess-white">${m.w}</span>
            <span class="rpt-chess-black">${m.b}</span>
            <span class="rpt-chess-piece">${m.wp}</span>
          </div>`).join('')
        : '<div style="color:var(--muted);padding:12px;font-size:12px">No moves recorded. Play a session first.</div>'}
    </div>
    ${!incomplete ? `<div class="rpt-chess-checkmate">Be7# — The bishop delivers finality. The game does not reopen.</div>` : `<div style="font-size:11px;color:var(--muted);text-align:center;padding:8px">Session ended at move ${playedMoves}. Game open.</div>`}

    <div class="rpt-section-label">PSYCHOLOGICAL MAPPING</div>
    <div class="rpt-chess-mapping">
      <div class="rpt-chess-map-row"><span class="rpt-chess-soft">SOFT</span><span>→</span><span class="rpt-chess-val" style="color:var(--green)">+0.10 base → Minimax depth 2</span><span style="color:var(--muted);font-size:10px">Deliberate, controlled</span></div>
      <div class="rpt-chess-map-row"><span class="rpt-chess-agg">AGGRESSIVE</span><span>→</span><span class="rpt-chess-val" style="color:var(--red)">−0.22 (−0.30 amygdala when NLI ≥ 0.85)</span><span style="color:var(--muted);font-size:10px">Sharp, tactical</span></div>
      <div class="rpt-chess-map-row"><span class="rpt-chess-sil">SILENT</span><span>→</span><span class="rpt-chess-val" style="color:var(--yellow)">−0.08 base → Minimax depth 2</span><span style="color:var(--muted);font-size:10px">Passive, tempo loss</span></div>
      <div class="rpt-chess-map-row" style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px"><span style="color:var(--red);font-weight:700">CHECKMATE</span><span>→</span><span class="rpt-chess-val" style="color:var(--red)">positionEval ≤ −7.5 (web) / −5.0 (C++)</span><span style="color:var(--muted);font-size:10px">Terminal condition</span></div>
    </div>

    <div class="rpt-section-label">THE METAPHOR</div>
    <div class="rpt-chess-metaphor">
      Anderssen sacrificed his queen and both rooks — and still won. Calculated sacrifice, compounding pressure, permanent closure. <strong>Be7#</strong> — the bishop delivers finality. The game does not reopen.
    </div>

    <div class="rpt-quote">"A player who sacrifices brilliantly but overcommits — and loses."</div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════════════════════════════════
function saveSession(summary, chatId) {
  // For custom chats, use the setup's other person name if available
  let displayName = CHAT_META[chatId]?.name || 'Unknown';
  if (currentChatSetup && currentChatSetup.theirName && chatId !== 'default') {
    displayName = `${currentChatSetup.theirName} (${CHAT_META[chatId]?.name || chatId})`;
  }
  const record = {
    id: Date.now(),
    chatId: chatId || 'default',
    chatName: displayName,
    date: new Date().toLocaleString(),
    summary
  };
  // Save to localStorage
  const sessions = JSON.parse(localStorage.getItem('lc_sessions') || '[]');
  sessions.unshift(record);
  if (sessions.length > 50) sessions.length = 50;
  localStorage.setItem('lc_sessions', JSON.stringify(sessions));
  // Save to Firestore if Firebase is configured
  if (typeof saveSessionToFirestore === 'function') {
    saveSessionToFirestore(summary, chatId, displayName);
  }
}

function loadHistory() {
  const grid = document.getElementById('historyGrid');
  if (!grid) return;
  const sessions = JSON.parse(localStorage.getItem('lc_sessions') || '[]');
  if (sessions.length === 0) {
    grid.innerHTML = `<div class="hist-empty">No sessions yet. Start a simulation to record history.</div>`;
    return;
  }
  grid.innerHTML = sessions.map(s => {
    const sum = s.summary;
    const isGood = sum?.terminalCondition === 1;
    const outcomeColor = isGood ? 'var(--green)' : sum?.cardsLost === 3 ? 'var(--red)' : 'var(--yellow)';
    const cards = [
      { name: 'D', in: sum?.devotion?.startsWith('RETAINED'),   color: '#C678DD' },
      { name: 'E', in: sum?.excitement?.startsWith('RETAINED'), color: '#56B6C2' },
      { name: 'P', in: sum?.presence?.startsWith('RETAINED'),   color: '#98C379' }
    ];
    const meta = CHAT_META[s.chatId] || {};
    const avatarEmoji = meta.avatarText || '🃏';
    return `<div class="history-item">
      <div class="hi-avatar" style="background:${meta.avatarGrad||'linear-gradient(135deg,#58A6FF,#C678DD)'};width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;cursor:pointer" onclick="openHistoryItem(${s.id})">${avatarEmoji}</div>
      <div class="hi-left" onclick="openHistoryItem(${s.id})" style="cursor:pointer">
        <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px">${s.chatName}</div>
        <div class="hi-outcome" style="background:${outcomeColor}22;color:${outcomeColor};border:1px solid ${outcomeColor}44;display:inline-flex;margin-bottom:4px">${sum?.outcome || 'Unknown outcome'}</div>
        <div class="hi-meta">${s.date}</div>
        <div class="hi-stats">${sum?.cardsLost ?? '?'}/3 lost &middot; ${sum?.moves ?? '?'} moves &middot; NLI ${sum?.finalNLI ?? '?'}</div>
        <div class="hi-cards">
          ${cards.map(c => `<span class="hc-card-chip" style="background:${c.in ? c.color+'22' : 'rgba(248,81,73,.15)'};color:${c.in ? c.color : 'var(--red)'};">${c.name}: ${c.in ? 'KEPT' : 'LOST'}</span>`).join('')}
        </div>
      </div>
      <button class="hi-delete" onclick="event.stopPropagation();deleteHistoryItem(${s.id})" title="Delete this session">&#x2715;</button>
    </div>`;
  }).join('');
}

function deleteHistoryItem(id) {
  let sessions = JSON.parse(localStorage.getItem('lc_sessions') || '[]');
  sessions = sessions.filter(s => s.id !== id);
  localStorage.setItem('lc_sessions', JSON.stringify(sessions));
  loadHistory();
}

function clearHistory() {
  if (!confirm('Clear all session history?')) return;
  localStorage.removeItem('lc_sessions');
  loadHistory();
  showToast('History cleared.', 'success');
}

function openHistoryItem(id) {
  const sessions = JSON.parse(localStorage.getItem('lc_sessions') || '[]');
  const session  = sessions.find(s => s.id === id);
  if (!session) return;
  const sum = session.summary;

  const cards = [
    { name: 'DEVOTION',   in: sum?.devotion?.startsWith('RETAINED'),   color: '#C678DD' },
    { name: 'EXCITEMENT', in: sum?.excitement?.startsWith('RETAINED'), color: '#56B6C2' },
    { name: 'PRESENCE',   in: sum?.presence?.startsWith('RETAINED'),   color: '#98C379' }
  ];
  const outcomeColor = sum?.terminalCondition === 1 ? '#3FB950' : sum?.cardsLost === 3 ? '#F85149' : '#E3B341';

  document.getElementById('hdTitle').textContent = session.chatName || 'Session Detail';
  document.getElementById('hdMeta').textContent  = `${session.date} · ${sum?.outcome || ''}`;
  document.getElementById('hdCards').innerHTML   = cards.map(c =>
    `<span class="hc-card-chip" style="background:${c.in ? c.color+'22' : 'rgba(248,81,73,.15)'};color:${c.in ? c.color : '#F85149'};">${c.name}: ${c.in ? 'KEPT' : 'LOST'}</span>`
  ).join('');
  document.getElementById('hdStats').innerHTML = `
    <div class="hd-row"><span>Moves played</span><span>${sum?.moves ?? '?'} / 23</span></div>
    <div class="hd-row"><span>Cards lost</span><span>${sum?.cardsLost ?? '?'} / 3</span></div>
    <div class="hd-row"><span>Final NLI</span><span>${sum?.finalNLI ?? '?'}</span></div>
    <div class="hd-row"><span>Final state</span><span>${sum?.finalState ?? '?'}</span></div>
    <div class="hd-row"><span>Trust at end</span><span>${Math.round((parseFloat(sum?.finalTrust)||0)*100)}%</span></div>
    <div class="hd-row"><span>Stack peak</span><span>${sum?.stackMaxDepth ?? '?'} / 7</span></div>
    <div class="hd-row"><span>Amygdala overrides</span><span>${sum?.amygdalaOverrides ?? '?'}</span></div>
    <div class="hd-row"><span>Phase log</span><span style="font-size:10px">${sum?.phaseLog?.join(' → ') || 'N/A'}</span></div>
  `;

  // Store so report generators can use it
  lastSessionSummary = sum;
  document.getElementById('histDetailModal').style.display = 'flex';
}

function closeHistoryDetail() {
  document.getElementById('histDetailModal').style.display = 'none';
}

function openHistoryReports() {
  closeHistoryDetail();
  switchReportTab('dsa');
  document.getElementById('dsaReportOverlay').style.display = 'flex';
}

// ══════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════
function showToast(msg, type) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type || ''}`;
  void toast.offsetWidth; // reflow
  toast.classList.add('show');
  clearTimeout(toast._t);
  const duration = type === 'info' ? 4200 : 2800;
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}
