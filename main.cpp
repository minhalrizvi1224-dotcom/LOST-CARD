// #include <iostream>
// #include <fstream>
// #include <string>
// #include <vector>
// #include <stack>
// #include <queue>
// #include <map>
// #include <unordered_map>
// #include <algorithm>
// #include <functional>
// #include <limits>
// #include <cstdlib>
// #include <ctime>
// #include <cmath>
// #include <thread>
// #include <chrono>
// #include <sstream>
// #include <iomanip>
// #include <random>

#include<bits/stdc++.h>

#ifdef _WIN32
#include <windows.h>
#include <conio.h>
#endif

#define RST "\033[0m"
#define BOLD "\033[1m"
#define DIM "\033[2m"
#define ITAL "\033[3m"
#define RED "\033[31m"
#define GRN "\033[32m"
#define YLW "\033[33m"
#define BLU "\033[34m"
#define MAG "\033[35m"
#define CYN "\033[36m"
#define BRED "\033[91m"
#define BGRN "\033[92m"
#define BYLW "\033[93m"
#define BBLU "\033[94m"
#define BMAG "\033[95m"
#define BCYN "\033[96m"
#define BWHT "\033[97m"

static int visLen(const std::string &s)
{
    int n = 0;
    bool esc = false;
    for (unsigned char c : s)
    {
        if (c == '\033')
        {
            esc = true;
            continue;
        }
        if (esc)
        {
            if (c == 'm')
                esc = false;
            continue;
        }
        if ((c & 0xC0) != 0x80)
            n++;
    }
    return n;
}

void enableAnsi()
{
#ifdef _WIN32
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;
    GetConsoleMode(hOut, &dwMode);
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
    SetConsoleMode(hOut, dwMode);
#endif
}
void slowPrint(const std::string &t, int ms = 18)
{
    for (char c : t)
    {
        std::cout << c << std::flush;
        std::this_thread::sleep_for(std::chrono::milliseconds(ms));
    }
}
void pause(int ms) { std::this_thread::sleep_for(std::chrono::milliseconds(ms)); }
void clearScreen()
{
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}
std::string bar(float r, int w = 20)
{
    int f = std::max(0, std::min(w, (int)(r * w)));
    std::string b = "[";
    for (int i = 0; i < w; i++)
        b += (i < f ? "\xe2\x96\x88" : "\xe2\x96\x91");
    return b + "]";
}

struct Moment
{
    int id;
    std::string label;
    bool locked = false, leaked = false;
    float weight = 1.0f;
};
struct Edge
{
    int to;
    float emotionalValence;
};

class FriendshipDAG
{
public:
    static const int N = 22;
    std::vector<Moment *> nodes;
    std::vector<std::vector<Edge>> adj;
    int lockedCount = 0, leakedCount = 0, dijkstraCalls = 0, edgeDegradations = 0;
    float lastExitDist = 999.0f;

    FriendshipDAG()
    {
        adj.resize(N);
        const std::string lbl[N] = {
            "Origin", "First Laugh", "The Quiet Walk", "Library Morning",
            "Late Night Call", "Birthday Message", "First Argument",
            "Apology Accepted", "The Shared Secret", "Distance Begins",
            "Unanswered Text", "Awkward Silence", "Last Good Day",
            "The Confession", "The Misread", "Defensive Wall",
            "The Apology Refused", "Ghosted Weekend", "Final Reach Out",
            "The Waiting Room", "Decoupling Point", "Exit"};
        for (int i = 0; i < N; i++)
        {
            Moment *m = new Moment();
            m->id = i;
            m->label = lbl[i];
            nodes.push_back(m);
        }
        auto ae = [&](int u, int v, float w)
        { adj[u].push_back({v, w}); };
        ae(0, 1, +0.9f);
        ae(0, 2, +0.7f);
        ae(1, 3, +0.8f);
        ae(1, 4, +0.6f);
        ae(2, 3, +0.5f);
        ae(2, 5, +0.4f);
        ae(3, 6, +0.3f);
        ae(3, 7, +0.6f);
        ae(4, 5, +0.7f);
        ae(4, 8, +0.5f);
        ae(5, 8, +0.4f);
        ae(5, 9, -0.2f);
        ae(6, 9, -0.4f);
        ae(6, 10, -0.6f);
        ae(7, 10, +0.2f);
        ae(7, 11, +0.1f);
        ae(8, 11, +0.3f);
        ae(8, 12, +0.5f);
        ae(9, 12, -0.3f);
        ae(9, 13, -0.1f);
        ae(10, 13, -0.5f);
        ae(10, 14, -0.4f);
        ae(11, 14, +0.1f);
        ae(11, 15, -0.2f);
        ae(12, 15, +0.2f);
        ae(12, 16, -0.3f);
        ae(13, 16, -0.6f);
        ae(13, 17, -0.5f);
        ae(14, 17, -0.4f);
        ae(14, 18, -0.6f);
        ae(15, 18, -0.2f);
        ae(15, 19, -0.3f);
        ae(16, 19, -0.7f);
        ae(16, 20, -0.8f);
        ae(17, 20, -0.6f);
        ae(17, 21, -0.9f);
        ae(18, 21, -0.7f);
        ae(19, 21, -0.8f);
        ae(20, 21, -1.0f);
    }
    ~FriendshipDAG()
    {
        for (int i = 0; i < N; i++)
            if (!nodes[i]->leaked)
                delete nodes[i];
    }
    float edgeCost(float v) const { return std::max(0.0f, 1.0f + v); }
    void degradeEdges(float d)
    {
        for (auto &row : adj)
            for (auto &e : row)
            {
                e.emotionalValence = std::max(-1.0f, e.emotionalValence - d);
                edgeDegradations++;
            }
    }
    void recoverEdges(float d)
    {
        for (auto &row : adj)
            for (auto &e : row)
                e.emotionalValence = std::min(1.0f, e.emotionalValence + d);
    }
    void lockNodes(float pfcLoad)
    {
        int toLock = (int)(pfcLoad * 4), locked = 0;
        for (int i = N - 1; i >= 0 && locked < toLock; i--)
            if (!nodes[i]->locked && !nodes[i]->leaked)
            {
                nodes[i]->locked = true;
                lockedCount++;
                locked++;
            }
    }
    void lockDevotionNodes()
    {
        int c = 0;
        for (int i = 1; i < N && c < 6; i++)
            if (!nodes[i]->locked)
            {
                nodes[i]->locked = true;
                lockedCount++;
                c++;
            }
    }
    void severExcitementBridges()
    {
        for (int b : {7, 8, 11, 12})
            adj[b].clear();
    }
    float dijkstraExitPath()
    {
        dijkstraCalls++;
        std::vector<float> dist(N, std::numeric_limits<float>::infinity());
        std::priority_queue<std::pair<float, int>,
                            std::vector<std::pair<float, int>>, std::greater<>>
            pq;
        dist[0] = 0.0f;
        pq.push({0.0f, 0});
        while (!pq.empty())
        {
            auto [d, u] = pq.top();
            pq.pop();
            if (d > dist[u] || nodes[u]->locked)
                continue;
            for (auto &e : adj[u])
            {
                if (nodes[e.to]->locked)
                    continue;
                float nd = dist[u] + edgeCost(e.emotionalValence);
                if (nd < dist[e.to])
                {
                    dist[e.to] = nd;
                    pq.push({nd, e.to});
                }
            }
        }
        lastExitDist = dist[N - 1];
        return lastExitDist;
    }
    void processLeaks(int move)
    {
        for (int i = 1; i < N - 1; i++)
            if (!nodes[i]->locked && !nodes[i]->leaked && nodes[i]->weight < 0.1f && (i % 5 == move % 5))
            {
                nodes[i]->leaked = true;
                leakedCount++;
            }
    }
    int reachableCount() const
    {
        int c = 0;
        for (auto *n : nodes)
            if (!n->locked && !n->leaked)
                c++;
        return c;
    }
};

struct LeakNode
{
    Moment *data;
    LeakNode *next;
    LeakNode(Moment *m) : data(m), next(nullptr) {}
};
class LongingList
{
public:
    LeakNode *head = nullptr;
    int count = 0;
    void insert(Moment *m)
    {
        LeakNode *n = new LeakNode(m);
        n->next = head;
        head = n;
        m = nullptr;
        count++;
    }
    void printAll() const
    {
        std::cout << CYN << "  LONGING — LEAKED MEMORIES (Default Mode Network):\n"
                  << RST;
        LeakNode *c = head;
        int i = 1;
        while (c)
        {
            std::cout << DIM << "    [" << i++ << "] " << c->data->label
                      << " — still running. No valid address. Still here.\n"
                      << RST;
            c = c->next;
        }
    }
    ~LongingList()
    {
        LeakNode *c = head;
        while (c)
        {
            LeakNode *n = c->next;
            delete c;
            c = n;
        }
    }
};

class CollisionStack
{
public:
    static const int MAX = 7;
    std::stack<std::string> s;
    int totalPushes = 0, totalPops = 0, popRejections = 0, maxDepth = 0;
    bool push(const std::string &c)
    {
        if ((int)s.size() >= MAX)
            return false;
        s.push(c);
        totalPushes++;
        if ((int)s.size() > maxDepth)
            maxDepth = (int)s.size();
        return true;
    }
    bool pop(float nli)
    {
        if (s.empty())
            return false;
        if (nli >= 0.50f)
        {
            popRejections++;
            return false;
        }
        s.pop();
        totalPops++;
        return true;
    }
    int size() const { return (int)s.size(); }
    bool overflow() const { return (int)s.size() >= MAX; }
    std::string top() const { return s.empty() ? "" : s.top(); }
    float chessPenalty() const { return s.size() * -0.3f; }
    std::vector<std::string> contents() const
    {
        std::stack<std::string> t = s;
        std::vector<std::string> v;
        while (!t.empty())
        {
            v.push_back(t.top());
            t.pop();
        }
        std::reverse(v.begin(), v.end());
        return v;
    }
};

enum ChoiceType
{
    SOFT = 0,
    AGGRESSIVE = 1,
    SILENT = 2,
    UNKNOWN = 3
};
struct Choice
{
    std::string text;
    ChoiceType type;
    float rationalScore;
};
class PFCQueue
{
public:
    int presentations = 0, pfcCompromised = 0, aggressiveSurfaced = 0;

    void record(ChoiceType chosen, float nli)
    {
        presentations++;
        if (nli > 0.4f)
            pfcCompromised++;
        if (chosen == AGGRESSIVE)
            aggressiveSurfaced++;
    }
};

class AuthModule
{
public:
    std::unordered_map<size_t, std::string> protectedSegments;
    int authAttempts = 0;
    bool keyValidated = false;
    int segmentsLoaded = 0;
    AuthModule()
    {
        std::hash<std::string> h;
        protectedSegments[h("LOSTCARD_SOVEREIGN")] =
            "PROTECTED: Full recovery path — exact move each card dropped. "
            "Known to two people: The Architect and Hani.";
        protectedSegments[h("HANI_KNOWS")] =
            "CLASSIFIED: Hani's internal state — what he felt but never said. "
            "The subtext beneath the subtext.";
    }
    bool checkKey(const std::string &input)
    {
        authAttempts++;
        std::hash<std::string> h;
        size_t k = h(input);
        if (protectedSegments.count(k))
        {
            keyValidated = true;
            segmentsLoaded++;
            return true;
        }
        return false;
    }
    void printProtected(const std::string &input)
    {
        std::hash<std::string> h;
        auto it = protectedSegments.find(h(input));
        if (it != protectedSegments.end())
        {
            std::cout << "\n"
                      << BYLW << "  \xe2\x95\x94\xe2\x95\x90\xe2\x95\x90 SOVEREIGN KEY ACCEPTED \xe2\x95\x90\xe2\x95\x90\xe2\x95\x97\n"
                      << RST;
            std::cout << BWHT << "  " << it->second << "\n"
                      << RST;
        }
    }
};

class HaniChessEngine
{
public:
    struct IMove
    {
        std::string white;
        std::string black;
        std::string wPiece;
        std::string bReason;
    };

    IMove game[23] = {
        {"e4", "e5", "Pawn", "mirror center"},
        {"f4", "exf4", "Pawn", "gambit accepted"},
        {"Bc4", "Qh4+", "Bishop", "queen enters with check"},
        {"Kf1", "b5", "King", "queenside flank thrust"},
        {"Bxb5", "Nf6", "Bishop", "knight pressures queen"},
        {"Nf3", "Qh6", "Knight", "queen repositions"},
        {"d3", "Nh5", "Pawn", "knight advances to rim"},
        {"Nh4", "Qg5", "Knight", "queen holds center"},
        {"Nf5", "c6", "Knight", "pawn challenges knight"},
        {"g4", "Nf6", "Pawn", "knight forced back"},
        {"Rg1", "cxb5", "Rook", "pawn recapture"},
        {"h4", "Qg6", "Pawn", "queen sidesteps"},
        {"h5", "Qg5", "Pawn", "queen holds position"},
        {"Qf3", "Ng8", "Queen", "knight retreats — lost tempo"},
        {"Bxf4", "Qf6", "Bishop", "queen activates"},
        {"Nc3", "Bc5", "Knight", "bishop joins attack"},
        {"Nd5", "Qxb2", "Knight", "queen raids queenside"},
        {"Bd6", "Bxg1", "Bishop", "exchange sacrifice"},
        {"e5", "Qxa1+", "Pawn", "queen delivers check"},
        {"Ke2", "Na6", "King", "knight enters the board"},
        {"Nxg7+", "Kd8", "Knight", "king forced to flee"},
        {"Qf6+", "Nxf6", "Queen", "knight interposes"},
        {"Be7#", "", "Bishop", "CHECKMATE — bishop delivers finality"}};

    int moveIndex = 0;
    float positionEval = 0.0f;
    int totalMoves = 0, amygdalaOverrides = 0;
    int softCount = 0, aggressiveCount = 0, silentCount = 0;

    float minimax(float base, int depth, bool maximizing)
    {
        if (depth == 0)
            return base;
        if (maximizing)
            return minimax(base + 0.25f, depth - 1, false);
        else
            return minimax(base - 0.18f, depth - 1, true);
    }

    void respond(ChoiceType userChoice, float nli, float stackPenalty,
                 std::string &outW, std::string &outB,
                 std::string &outWP, std::string &outBR, std::string &outWR)
    {
        totalMoves++;
        ChoiceType eff = userChoice;
        if (nli >= 0.85f)
        {
            eff = AGGRESSIVE;
            amygdalaOverrides++;
        }

        int idx = std::min(moveIndex, 22);
        outW = game[idx].white;
        outB = game[idx].black;
        outWP = game[idx].wPiece;
        outBR = game[idx].bReason;

        float base = positionEval;
        switch (eff)
        {
        case SOFT:
            outWR = "controlled, deliberate";
            softCount++;
            positionEval = minimax(base + 0.15f, 2, false) + stackPenalty;
            break;
        case AGGRESSIVE:
            outWR = "sharp, tactical";
            aggressiveCount++;
            positionEval = minimax(base - 0.40f - (nli >= 0.85f ? 1.20f : 0.0f), 2, true) + stackPenalty;
            break;
        case SILENT:
            outWR = "passive, tempo loss";
            silentCount++;
            positionEval = minimax(base - 0.12f, 2, false) + stackPenalty;
            break;
        default:
            outWR = "undefined";
            break;
        }
        positionEval = std::max(-9.99f, std::min(9.99f, positionEval));
        moveIndex++;
    }

    bool isCheckmate() const { return positionEval <= -5.0f; }
    std::string evalLabel() const
    {
        if (positionEval > 2.0f)
            return "comfortable";
        if (positionEval > 0.5f)
            return "slight edge";
        if (positionEval > -0.5f)
            return "balanced";
        if (positionEval > -2.0f)
            return "losing";
        if (positionEval > -5.0f)
            return "critical";
        return "TERMINAL";
    }
};

enum SimState
{
    HARMONY,
    FRACTURE,
    COLLAPSE,
    TERMINAL
};
std::string stateLabel(SimState s)
{
    switch (s)
    {
    case HARMONY:
        return "HARMONY";
    case FRACTURE:
        return "FRACTURE";
    case COLLAPSE:
        return "COLLAPSE";
    default:
        return "TERMINAL";
    }
}

struct NeurologicalState
{
    float pfcLoad = 0.10f, cortisol = 0.05f, dopamine = 0.80f;
    float amygdala = 0.10f, mirrorInt = 0.90f, nli = 0.0f;
    float computeNLI()
    {
        nli = (pfcLoad * 0.4f) + (cortisol * 0.4f) + (1.0f - dopamine) * 0.2f;
        nli = std::max(0.0f, std::min(1.0f, nli));
        return nli;
    }
    void applyChoice(ChoiceType c, float d = 0.07f)
    {
        if (c == SOFT)
        {
            pfcLoad = std::max(0.0f, pfcLoad - d);
            cortisol = std::max(0.0f, cortisol - d * 0.5f);
            dopamine = std::min(1.0f, dopamine + d);
            amygdala = std::max(0.0f, amygdala - d);
            mirrorInt = std::min(1.0f, mirrorInt + d * 0.5f);
        }
        else if (c == AGGRESSIVE)
        {
            pfcLoad = std::min(1.0f, pfcLoad + d * 1.5f);
            cortisol = std::min(1.0f, cortisol + d * 1.5f);
            dopamine = std::max(0.0f, dopamine - d);
            amygdala = std::min(1.0f, amygdala + d * 2.0f);
            mirrorInt = std::max(0.0f, mirrorInt - d);
        }
        else
        {
            pfcLoad = std::min(1.0f, pfcLoad + d * 0.8f);
            cortisol = std::min(1.0f, cortisol + d);
            dopamine = std::max(0.0f, dopamine - d * 0.5f);
            amygdala = std::min(1.0f, amygdala + d * 0.5f);
            mirrorInt = std::max(0.0f, mirrorInt - d * 1.5f);
        }
        computeNLI();
    }
};

struct CardState
{
    bool devotionIn = true, excitementIn = true, presenceIn = true;
    int devotionLost = -1, excitementLost = -1, presenceLost = -1;
    bool allLost() const { return !devotionIn && !excitementIn && !presenceIn; }
    int lostCount() const
    {
        return (!devotionIn ? 1 : 0) + (!excitementIn ? 1 : 0) + (!presenceIn ? 1 : 0);
    }
};

const std::vector<std::string> P1_SOFT = {
    "I know. I miss the way things used to feel between us too.",
    "You're right. I've been more absent than I realized.",
    "Tell me what you actually need from me. I want to hear it.",
    "I hear you. That was real, and it matters.",
    "I'm sorry I made you feel like that. You didn't deserve it.",
    "That took courage to say. Thank you for trusting me with it.",
    "I think about that too. More than you know.",
    "I'm here now. Whatever you need to say — I'm listening.",
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
    "I've missed this — actually talking to you.",
    "I'm not making excuses. You're right.",
    "What would help right now? Tell me.",
    "I see you. I just haven't been very good at showing it.",
    "Let's not lose this. It's worth fighting for.",
    "I hear the loneliness in that. I put it there. I want to take it back."};
const std::vector<std::string> P1_AGGR = {
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
    "This is a lot to unload on someone."};
const std::vector<std::string> P1_SILE = {
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
    "..."};

const std::vector<std::string> P2_SOFT = {
    "I've been thinking about that night too. I'm sorry I wasn't there.",
    "You're not overthinking it. I've been pulling away. That's real.",
    "I don't want to lose what we have. I'm going to try harder.",
    "That hurt to hear. And it should — because it's true.",
    "You've been carrying that alone for too long. I'm sorry.",
    "Tell me what the friendship feels like from your end. I need to know.",
    "I knew something was wrong. I just didn't want to be the one to name it.",
    "I'm scared to admit how much I've been checked out. But I have been.",
    "You deserved better than what I've been giving. I know that.",
    "I want to understand how we got here. Walk me through it.",
    "The fact that you still want to talk to me — that means everything.",
    "I've been confusing being around with being present. They're not the same.",
    "Whatever distance you felt — it was real. It wasn't in your head.",
    "I see how much this has cost you. I haven't been paying attention to that.",
    "I don't want to be the person who made you feel like this.",
    "I'm listening. Not defensively. Just — listening.",
    "You were right to bring this up. I was hoping you wouldn't have to.",
    "That's on me. I built this wall without realizing it.",
    "I've missed you. Even when you were right there.",
    "Thank you for not giving up on this before telling me.",
    "I didn't realize I was doing that. That's the scariest part.",
    "We both deserve this conversation. I just didn't have the courage to start it.",
    "If you're still here, I can work with that. I will work with that.",
    "I hear you saying you stopped reaching out. I hear why.",
    "You've been in this friendship alone for a while. I'm going to change that.",
    "The loneliness you're describing — I caused that. I'm not going to minimize it.",
    "I think I stopped showing up the moment it got hard. That's not who I want to be.",
    "I want to earn back the version of you that trusted me with everything.",
    "This is the most honest we've been in months. I don't want to waste it.",
    "Tell me what I missed. I want to know what I didn't see."};
const std::vector<std::string> P2_AGGR = {
    "You can't hold every small thing against me.",
    "I've told you — I've had a lot going on.",
    "You're acting like I abandoned you. That's not what happened.",
    "This is getting dramatic.",
    "I can't go back and change it. What do you want me to do.",
    "You never said anything at the time. How was I supposed to know.",
    "Stop making me feel like a bad person.",
    "I give what I can. Sometimes that's not much. That's life.",
    "You're only remembering the bad moments.",
    "This conversation is starting to feel like an interrogation.",
    "Everyone drifts sometimes. You're taking it personally.",
    "I feel attacked right now.",
    "I'm not on trial here.",
    "Maybe we just have different expectations of friendship.",
    "You could have reached out too. This goes both ways.",
    "I'm not going to sit here and be blamed for everything.",
    "I was going through something. I didn't have the capacity.",
    "You act like I'm the only one who makes mistakes.",
    "I don't think that's entirely fair.",
    "You're catastrophizing.",
    "I've been present more than you're giving me credit for.",
    "This is a lot of pressure to put on someone.",
    "I'm tired of feeling guilty about things that weren't entirely my fault.",
    "I can't be responsible for how you interpret my absence.",
    "You're telling me your version. I have mine too.",
    "I wasn't aware it had gotten to this point.",
    "You should have said something sooner if it was this bad.",
    "I feel like nothing I say will be good enough right now.",
    "This is why people don't open up. It always turns into an argument.",
    "I've been doing my best. My best might not be what you need."};
const std::vector<std::string> P2_SILE = {
    "...",
    "[breathes slowly]",
    "[doesn't answer for a long time]",
    "Yeah.",
    "[looks away]",
    "Mm.",
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
    "...",
    "[hands in lap, still]",
    "[stares past them]",
    "Okay.",
    "...",
    "[closes eyes for a moment]"};

const std::vector<std::string> P3_SOFT = {
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
    "Whatever form this takes from here — I want to be part of it.",
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
    "I'll be consistent. Not perfectly — but genuinely.",
    "I hear you saying goodbye in that. I'm saying: not yet.",
    "Whatever trust is left — I'll protect it. I promise.",
    "I want to know the version of you that exists now. Will you let me?",
    "The roof photo. The way things felt then. I want to find our way back to something like that.",
    "I'm not ready to let this be a memory. I think you aren't either.",
    "Slowly means I'm still in this. And I am.",
    "Tell me we still have something to work with. I believe we do."};
const std::vector<std::string> P3_AGGR = {
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
    "Fine. Then we're done."};
const std::vector<std::string> P3_SILE = {
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
    "[remains very still]"};

struct DisplayChoice
{
    std::string text;
    ChoiceType type;
};

std::vector<DisplayChoice> getChoices(int phase, std::mt19937 &rng)
{
    const std::vector<std::string> *sp;
    const std::vector<std::string> *ap;
    const std::vector<std::string> *np;
    if (phase == 0)
    {
        sp = &P1_SOFT;
        ap = &P1_AGGR;
        np = &P1_SILE;
    }
    else if (phase == 1)
    {
        sp = &P2_SOFT;
        ap = &P2_AGGR;
        np = &P2_SILE;
    }
    else
    {
        sp = &P3_SOFT;
        ap = &P3_AGGR;
        np = &P3_SILE;
    }

    std::uniform_int_distribution<int> ds(0, 29), da(0, 29), dn(0, 29);
    std::vector<DisplayChoice> choices = {
        {(*sp)[ds(rng)], SOFT},
        {(*ap)[da(rng)], AGGRESSIVE},
        {(*np)[dn(rng)], SILENT}};
    std::shuffle(choices.begin(), choices.end(), rng);
    return choices;
}

struct ScenarioNode
{
    std::string haniDialogue;
    std::string haniSubtext;
    std::string conflictLabel;
    bool salvationNode;
};

std::vector<ScenarioNode> buildScenarios()
{
    return {

        {"Hey. You free this evening? I found that old photo. The one from the roof.",
         "(He's been looking at it for twenty minutes before texting. He won't say that.)",
         "Dismissing a memory", false},
        {"I was just cleaning up and it came up. We looked so — I don't know. Less complicated.",
         "(He almost said 'happy'. He stopped himself. He doesn't know why.)",
         "Invalidating nostalgia", false},
        {"I called you three times last week. You picked up once, said you'd call back in five minutes. That was three weeks ago.",
         "(He counted. He wasn't going to say that. He just did.)",
         "Being called out on absence", true},
        {"It's not about the calls. I don't need you to call me every day. I just — when I actually reach out, I want it to mean something.",
         "(He's been rehearsing this. Not the words — the courage to say them.)",
         "Minimizing his need", true},
        {"Do you remember what you said the last time we actually talked — properly talked? You said things were going to be different.",
         "(He believed it when she said it. That's the part that hurts.)",
         "Broken promise unaddressed", false},
        {"I'm not trying to make you feel bad. I just think I've been pretending everything is fine for a while now. And it's — tiring.",
         "(He's been waiting to say this. Not to punish her. Just to stop carrying it alone.)",
         "Deflecting his honesty", true},

        {"I think I've been lonely. Not in general. Specifically when I'm talking to you.",
         "(He said it. He didn't plan to say it today. He can't take it back.)",
         "Contradicting his experience", true},
        {"I used to tell you things I didn't tell anyone else. I stopped. I'm not sure exactly when.",
         "(He knows exactly when. He's protecting her from knowing.)",
         "Dismissing trust erosion", false},
        {"There was a night — I don't remember the exact date — where I was genuinely not okay. And I opened your chat and just closed it again.",
         "(That night was six months ago. He remembers the exact date.)",
         "Blaming him for his own silence", true},
        {"Because I'd done it before. Reached out. And you were — you were there, but not there. Physically responding, emotionally somewhere else.",
         "(He's never said this to anyone. He's terrified she's going to get defensive.)",
         "Defending unavailability", false},
        {"I'm not asking for 24/7. I'm asking for the one time I actually needed you. Just that one time.",
         "(He's shaking slightly. He's kept this in for a very long time.)",
         "Minimizing a specific wound", true},
        {"The thing is — I still wanted to talk to you. After everything. That's what I can't explain.",
         "(He's trying to say: I still chose you. He doesn't know if that's strength or stupidity.)",
         "Missing the weight of his loyalty", false},
        {"I just need to know if this is still something you're invested in. Because I can't keep guessing.",
         "(He's asked himself this question fifty times. He's finally asking her.)",
         "Demanding proof without giving it", true},
        {"Because I stopped assuming. That's what happens when things shift and no one acknowledges it.",
         "(He's watched too many people leave without ever saying they were leaving.)",
         "Excusing drift as inevitable", false},
        {"I just — I wish you'd told me you were drifting instead of making me feel like I was imagining it.",
         "(He felt crazy for a while. He's only recently understood he wasn't.)",
         "Gaslighting response", true},
        {"What would it take. Actually. For this to be what it used to be.",
         "(He doesn't think it's possible. He's asking anyway. For closure if nothing else.)",
         "Closing the door on repair", true},

        {"I'm not sure I believe that anymore. Not because of you — because of how many times I've believed it.",
         "(He's not angry. He's tired. That's worse.)",
         "Confirming hopelessness", false},
        {"Maybe some friendships just have a natural end. Maybe this is it.",
         "(He doesn't believe this. He's testing if she does.)",
         "Accepting dissolution", true},
        {"You know what I keep thinking about? That moment on the roof. Before all of this. We didn't need to say anything.",
         "(He's grieving something that is still technically alive.)",
         "Erasing the memory", false},
        {"I'm going to be honest. If we stop talking now — I don't think I'd reach out again. I've done the reaching.",
         "(He means it. He's not saying it to hurt her. He's saying it so she understands the weight.)",
         "Conceding the loss", true},
        {"I want to believe you. I genuinely do. I just don't know how much of that is hope and how much is habit.",
         "(He's distinguishing between them for the first time. It scares him.)",
         "Dismissing his doubt", false},
        {"Okay. I'll try. But I need you to understand — I'm not the same person I was when we started. Some of that is gone.",
         "(He's giving her one last opening. He doesn't know if she'll walk through it.)",
         "Acknowledging change without engaging", true},
        {"Then — okay. Let's try. But slowly. I can't do another fall.",
         "(He means: I can't survive losing this twice.)",
         "Final rejection", true}};
}

void printTitleScreen()
{
    clearScreen();
    pause(150);

    // ── Double-line box chars (left panel) ───────────────────────────────
    const std::string H  = "\xe2\x95\x90"; // ═
    const std::string V  = "\xe2\x95\x91"; // ║
    const std::string TL = "\xe2\x95\x94", TR = "\xe2\x95\x97"; // ╔ ╗
    const std::string BL = "\xe2\x95\x9a", BR = "\xe2\x95\x9d"; // ╚ ╝
    const std::string ML = "\xe2\x95\xa0", MR = "\xe2\x95\xa3"; // ╠ ╣
    // ── Single-line box chars (right panel) ─────────────────────────────
    const std::string h2  = "\xe2\x94\x80"; // ─
    const std::string v2  = "\xe2\x94\x82"; // │
    const std::string tl2 = "\xe2\x94\x8c", tr2 = "\xe2\x94\x90"; // ┌ ┐
    const std::string bl2 = "\xe2\x94\x94", br2 = "\xe2\x94\x98"; // └ ┘
    const std::string ml2 = "\xe2\x94\x9c", mr2 = "\xe2\x94\xa4"; // ├ ┤

    // ── Left panel (76-char inner width) ────────────────────────────────
    const int LW = 76;
    std::vector<std::string> lp;

    auto l_hbar = [&](const std::string &L, const std::string &R) {
        std::string s = " " + L;
        for (int i = 0; i < LW; i++) s += H;
        s += R;
        lp.push_back(s);
    };
    auto l_row = [&](const std::string &content) {
        lp.push_back(" " + std::string(BLU) + V + RST + content + std::string(BLU) + V + RST);
    };
    auto l_empty = [&]() { l_row(std::string(LW, ' ')); };
    auto l_ctr = [&](const std::string &s, const std::string &col = "") -> std::string {
        int sp = LW - visLen(s); if (sp < 0) sp = 0;
        int l = sp / 2, r = sp - l;
        return std::string(l, ' ') + (col.empty() ? "" : col) + s + (col.empty() ? "" : std::string(RST)) + std::string(r, ' ');
    };
    auto l_lft = [&](const std::string &s, const std::string &col = "") -> std::string {
        int pad = LW - visLen(s); if (pad < 0) pad = 0;
        return (col.empty() ? "" : col) + s + (col.empty() ? "" : std::string(RST)) + std::string(pad, ' ');
    };

    l_hbar(std::string(BLU) + TL, TR + RST);
    l_empty();
    l_row(l_ctr("L  O  S  T     C  A  R  D", std::string(BOLD) + BWHT));
    l_row(l_ctr("A Computational Model of Relational Belief Decay", std::string(DIM) + ITAL));
    l_empty();
    l_hbar(std::string(BLU) + ML, MR + RST);
    l_empty();
    l_row(l_lft("   \"Every word we speak in a relationship is a card we play.", std::string(DIM) + ITAL));
    l_row(l_lft("    We play without knowing we are in a game.", std::string(DIM) + ITAL));
    l_row(l_lft("    The moment we make a wrong move - the card leaves your hand.", std::string(DIM) + ITAL));
    l_row(l_lft("    Suddenly. Not gradually. Gone.\"", std::string(DIM) + ITAL));
    l_empty();
    l_row(l_lft("   \"The cards do not fade. They fall. One wrong move is all it takes.\"", std::string(DIM) + ITAL));
    l_empty();
    l_row(l_lft("   \"Belief is not lost - it is displaced. One card at a time.\"", std::string(DIM) + ITAL));
    l_empty();
    l_row(l_ctr("- S. M. Minhal Abbas Rizvi     The Bet of Belief", std::string(DIM)));
    l_empty();
    l_hbar(std::string(BLU) + ML, MR + RST);
    l_empty();
    l_row(l_lft("   Submitted By   :  S. M. Minhal Abbas Rizvi", std::string(CYN)));
    l_row(l_lft("   Supervised By  :  Waqas Aziz", std::string(CYN)));
    l_row(l_lft("   Degree         :  Bachelor of Science in Software Engineering", std::string(CYN)));
    l_row(l_lft("   Course         :  Data Structures & Algorithms  (DSA)", std::string(CYN)));
    l_row(l_lft("   Project Type   :  Solo Project", std::string(CYN)));
    l_row(l_lft("   Framework      :  The Bet of Belief  -  LOST CARD Theory", std::string(CYN)));
    l_row(l_lft("   Date           :  June 2026", std::string(CYN)));
    l_empty();
    l_hbar(std::string(BLU) + ML, MR + RST);
    l_empty();
    l_row(l_lft("   [1]  Default Mode   -  Umm-e-Laila & Hani", std::string(GRN)));
    l_row(l_lft("   [2]  Custom Mode    -  Your Real Relationship  (AI)", std::string(MAG)));
    l_row(l_lft("   [3]  About          -  Framework & DSA Architecture", std::string(YLW)));
    l_row(l_lft("   [q]  Exit", std::string(DIM)));
    l_empty();
    l_hbar(std::string(BLU) + BL, BR + RST);

    // ── Right panel (44-char inner width) ────────────────────────────────
    const int RW = 44;
    std::vector<std::string> rp;

    auto r_hbar = [&](const std::string &L, const std::string &R) {
        std::string s = "  " + L;
        for (int i = 0; i < RW; i++) s += h2;
        s += R;
        rp.push_back(s);
    };
    auto r_row = [&](const std::string &content) {
        rp.push_back("  " + std::string(BLU) + v2 + RST + content + std::string(BLU) + v2 + RST);
    };
    auto r_empty = [&]() { r_row(std::string(RW, ' ')); };
    auto r_lft = [&](const std::string &s) -> std::string {
        int pad = RW - visLen(s); if (pad < 0) pad = 0;
        return s + std::string(pad, ' ');
    };
    auto r_ctr = [&](const std::string &s, const std::string &col = "") -> std::string {
        int sp = RW - visLen(s); if (sp < 0) sp = 0;
        int l = sp / 2, r = sp - l;
        return std::string(l, ' ') + (col.empty() ? "" : col) + s + (col.empty() ? "" : std::string(RST)) + std::string(r, ' ');
    };

    // Right panel — 36 lines to match left panel exactly
    r_hbar(std::string(BLU) + tl2, tr2 + RST);                                          //  1
    r_empty();                                                                             //  2
    r_row(r_ctr("T H E   T H R E E   C A R D S", std::string(BOLD) + BWHT));             //  3
    r_empty();                                                                             //  4
    r_hbar(std::string(BLU) + ml2, mr2 + RST);                                          //  5
    r_empty();                                                                             //  6
    r_row(r_lft("  " + std::string(MAG)  + BOLD + "DEVOTION"   + RST));                  //  7
    r_row(r_lft("  " + std::string(DIM)  + "Emotional investment"      + RST));          //  8
    r_row(r_lft("  " + std::string(DIM)  + "Lost by: over-investment"  + RST));          //  9
    r_empty();                                                                             // 10
    r_row(r_lft("  " + std::string(CYN)  + BOLD + "EXCITEMENT"  + RST));                 // 11
    r_row(r_lft("  " + std::string(DIM)  + "Relational energy"         + RST));          // 12
    r_row(r_lft("  " + std::string(DIM)  + "Lost by: reactive escalation" + RST));       // 13
    r_empty();                                                                             // 14
    r_row(r_lft("  " + std::string(BGRN) + BOLD + "PRESENCE"    + RST));                 // 15
    r_row(r_lft("  " + std::string(DIM)  + "Psychological availability" + RST));         // 16
    r_row(r_lft("  " + std::string(DIM)  + "Lost by: withdrawal"       + RST));          // 17
    r_empty();                                                                             // 18
    r_hbar(std::string(BLU) + ml2, mr2 + RST);                                          // 19
    r_empty();                                                                             // 20
    r_row(r_lft("  " + std::string(YLW) + "7" + RST + " structures   "
                    + std::string(YLW) + "1" + RST + " theory"));                        // 21
    r_row(r_lft("  " + std::string(YLW) + "23" + RST + " moves       "
                    + std::string(YLW) + "3" + RST + " cards"));                         // 22
    r_empty();                                                                             // 23
    r_hbar(std::string(BLU) + ml2, mr2 + RST);                                          // 24
    r_empty();                                                                             // 25
    r_row(r_lft("  \"One wrong move."));                                                   // 26
    r_row(r_lft("   One card less."));                                                     // 27
    r_row(r_lft("   That's the whole theory.\""));                                         // 28
    r_empty();                                                                             // 29
    r_hbar(std::string(BLU) + ml2, mr2 + RST);                                          // 30
    r_empty();                                                                             // 31
    r_row(r_ctr("The Bet of Belief", std::string(DIM)));                                  // 32
    r_row(r_ctr("S. M. Minhal Abbas Rizvi", std::string(DIM)));                           // 33
    r_empty();                                                                             // 34
    r_empty();                                                                             // 35
    r_hbar(std::string(BLU) + bl2, br2 + RST);                                          // 36

    // ── Print both panels side by side ───────────────────────────────────
    std::size_t maxH = std::max(lp.size(), rp.size());
    const std::string lBlank(LW + 3, ' '); // left panel visual width = LW+3
    const std::string rBlank(RW + 4, ' '); // right panel visual width = RW+4
    while (lp.size() < maxH) lp.push_back(lBlank);
    while (rp.size() < maxH) rp.push_back(rBlank);

    std::cout << "\n";
    for (std::size_t i = 0; i < maxH; i++)
        std::cout << lp[i] << rp[i] << "\n";

    std::cout << "\n " << DIM << "  Choice: " << RST;
}

void printAboutScreen()
{
    clearScreen();
    std::cout << "\n"
              << BBLU << "  ============================================================\n"
              << RST;
    std::cout << BOLD << BWHT << "  THE LOST CARD FRAMEWORK\n"
              << RST;
    std::cout << BBLU << "  ============================================================\n\n"
              << RST;
    std::cout << YLW << "  PHILOSOPHY:\n"
              << RST;
    std::cout << DIM << "  \"Every word we speak in a relationship is a card we play.\n"
              << "   We play without knowing we are in a game.\n"
              << "   The moment we make a wrong move — that card leaves our hand.\n"
              << "   Suddenly. Not gradually. Gone.\"\n\n"
              << RST;
    std::cout << YLW << "  THREE CARDS:\n"
              << RST;
    std::cout << MAG << "  [DEVOTION]    " << RST << "Over-investment, boundary dissolution, loss of self\n";
    std::cout << CYN << "  [EXCITEMENT]  " << RST << "Impulsive escalation, reactive behavior\n";
    std::cout << BGRN << "  [PRESENCE]    " << RST << "Anxiety-driven withdrawal, emotional unavailability\n\n";
    std::cout << YLW << "  7 DSA CONCEPTS:\n"
              << RST;
    std::cout << "  1. DAG + Dijkstra          Hippocampus     (memory decoupling)\n";
    std::cout << "  2. Stack LIFO              Cortisol        (unresolved conflict)\n";
    std::cout << "  3. Min-Heap Priority Queue Prefrontal Ctx  (stress-corrupted choice)\n";
    std::cout << "  4. Singly Linked List      Default Mode Network (longing = memory leak)\n";
    std::cout << "  5. Hash Map                Sovereign Key   (authentication)\n";
    std::cout << "  6. Finite State Machine    Simulation arc  (HARMONY to TERMINAL)\n";
    std::cout << "  7. Minimax Algorithm       Chess Engine    (Immortal Game sequence)\n\n";
    std::cout << YLW << "  NLI = (PFC x 0.4) + (Cortisol x 0.4) + (1 - Dopamine) x 0.2\n\n"
              << RST;
    std::cout << BBLU << "  ============================================================\n"
              << RST;
    std::cout << "  Press ENTER to return...";
    std::string d;
    std::getline(std::cin, d);
}

void printCardHeader(const CardState &cs)
{
    auto fmt = [](bool in, const std::string &col, const std::string &name) -> std::string
    {
        return in ? (col + "[" + name + "]" + RST) : (std::string(DIM) + "[" + name + " LOST]" + RST);
    };
    std::cout << "  " << fmt(cs.devotionIn, MAG, "DEVOTION")
              << "  " << fmt(cs.excitementIn, CYN, "EXCITEMENT")
              << "  " << fmt(cs.presenceIn, BGRN, "PRESENCE") << "\n";
}

void printMoveHeader(int move, SimState state, float nli, float trust, const CardState &cs)
{
    std::cout << "\n"
              << BBLU;
    std::cout << "  ==============================================================\n"
              << RST;
    std::cout << "  MOVE " << BOLD << move + 1 << "/23" << RST
              << "  |  " << YLW << stateLabel(state) << RST
              << "  |  NLI: " << BRED << std::fixed << std::setprecision(3) << nli << RST
              << "  |  Trust: " << GRN << std::fixed << std::setprecision(2) << trust << RST << "\n";
    printCardHeader(cs);
    std::cout << BBLU << "  --------------------------------------------------------------\n"
              << RST;
}

void printChessMove(const std::string &w, const std::string &b,
                    const std::string &wP, const std::string &wR,
                    const std::string &bR, float eval, int mn)
{
    std::cout << "\n"
              << CYN << "  CHESS [ Move " << mn << " ] — The Immortal Game:\n"
              << RST;
    std::cout << "    Umm-e-Laila plays  " << BOLD << std::left << std::setw(8) << w << RST
              << "  [ " << wP << " — " << wR << " ]\n";
    if (!b.empty())
        std::cout << "    Hani responds      " << BOLD << std::setw(8) << b << RST
                  << "  [ " << bR << " ]\n";
    std::cout << "    Position eval      : " << std::fixed << std::setprecision(2) << eval;
    if (eval <= -5.0f)
        std::cout << BRED << "  [ CHECKMATE ]\n"
                  << RST;
    else if (eval < -2.0f)
        std::cout << BRED << "  [ losing ]\n"
                  << RST;
    else if (eval < 0.0f)
        std::cout << YLW << "  [ behind ]\n"
                  << RST;
    else
        std::cout << GRN << "  [ holding ]\n"
                  << RST;
}

void printNeuroState(const NeurologicalState &ns)
{
    std::cout << "\n"
              << YLW << "  NEUROLOGICAL STATE:\n"
              << RST;
    std::cout << "  Prefrontal Cortex      : " << BRED << bar(ns.pfcLoad) << RST
              << std::setw(4) << (int)(ns.pfcLoad * 100) << "% "
              << (ns.pfcLoad > 0.7f ? std::string(BRED) + "[OVERLOADED]" + RST : ns.pfcLoad > 0.4f ? std::string(YLW) + "[STRAINED]" + RST
                                                                                                   : std::string(GRN) + "[CLEAR]" + RST)
              << "\n";
    std::cout << "  Amygdala Activation    : " << BRED << bar(ns.amygdala) << RST
              << std::setw(4) << (int)(ns.amygdala * 100) << "% "
              << (ns.amygdala > 0.7f ? std::string(BRED) + "[HIJACK RISK]" + RST : std::string(DIM) + "[stable]" + RST) << "\n";
    std::cout << "  Dopamine Pathway       : " << BGRN << bar(ns.dopamine) << RST
              << " " << std::fixed << std::setprecision(2) << ns.dopamine << "f "
              << (ns.dopamine < 0.3f ? std::string(BRED) + "[DEPLETED]" + RST : std::string(GRN) + "[active]" + RST) << "\n";
    std::cout << "  Mirror Neuron Integrity: " << BBLU << bar(ns.mirrorInt) << RST
              << std::setw(4) << (int)(ns.mirrorInt * 100) << "% "
              << (ns.mirrorInt < 0.4f ? std::string(BRED) + "[BROKEN]" + RST : std::string(DIM) + "[connected]" + RST) << "\n";
    std::cout << "  NLI                    : " << BYLW << std::fixed << std::setprecision(3)
              << ns.nli << RST << "   Phase: ";
    if (ns.nli < 0.30f)
        std::cout << GRN << "HARMONY\n"
                  << RST;
    else if (ns.nli < 0.70f)
        std::cout << YLW << "FRACTURE\n"
                  << RST;
    else
        std::cout << BRED << "COLLAPSE\n"
                  << RST;
}

void printDSAState(const FriendshipDAG &dag, const CollisionStack &cs,
                   const HaniChessEngine &chess, float trust)
{
    std::cout << "\n"
              << YLW << "  DSA STATE:\n"
              << RST;
    std::cout << "  Trust Score            : " << GRN << std::fixed << std::setprecision(2) << trust << "f\n"
              << RST;
    std::cout << "  DAG Reachable Nodes    : " << dag.reachableCount() << " / 22  (" << dag.lockedCount << " locked)\n";
    std::cout << "  Exit Path Distance     : " << std::fixed << std::setprecision(2) << dag.lastExitDist
              << (dag.lastExitDist < 2.0f ? std::string(BRED) + "  [DECOUPLING IMMINENT]" + RST : "") << "\n";
    std::cout << "  Cortisol Stack Depth   : " << cs.size() << " / 7\n";
    auto cont = cs.contents();
    if (!cont.empty())
    {
        std::cout << "  Stack Contents         : ";
        for (auto &c : cont)
            std::cout << DIM << "[ " << c << " ] " << RST;
        std::cout << "\n";
    }
    std::cout << "  Chess Eval             : " << std::fixed << std::setprecision(2) << chess.positionEval
              << "  [ " << chess.evalLabel() << " ]\n";
}

void printCardStatusBlock(const CardState &cs)
{
    std::cout << "\n"
              << YLW << "  CARDS STATUS:\n"
              << RST;
    std::cout << "  Devotion Card   : ";
    if (cs.devotionIn)
        std::cout << GRN << "IN HAND\n"
                  << RST;
    else
        std::cout << DIM << "LOST at Move " << cs.devotionLost << "\n"
                  << RST;
    std::cout << "  Excitement Card : ";
    if (cs.excitementIn)
        std::cout << GRN << "IN HAND\n"
                  << RST;
    else
        std::cout << DIM << "LOST at Move " << cs.excitementLost << "\n"
                  << RST;
    std::cout << "  Presence Card   : ";
    if (cs.presenceIn)
        std::cout << GRN << "IN HAND\n"
                  << RST;
    else
        std::cout << DIM << "LOST at Move " << cs.presenceLost << "\n"
                  << RST;
}

void printCardDrop(const std::string &name, const std::string &col,
                   int mn, const std::string &reason)
{
    pause(400);
    std::cout << "\n"
              << col;
    std::cout << "  +------------------------------------------------------+\n";
    std::cout << "  |  " << name << " CARD LOST -- Move " << mn;
    int pad = 52 - (int)name.size() - 19 - (int)std::to_string(mn).size();
    if (pad < 0)
        pad = 0;
    for (int i = 0; i < pad; i++)
        std::cout << " ";
    std::cout << "|\n";
    std::cout << "  +------------------------------------------------------+\n"
              << RST;
    pause(200);
    slowPrint("  > " + reason + "\n", 20);
    slowPrint("  > The card left your hand at this exact moment.\n", 20);
    slowPrint("  > You did not notice. That is the nature of losing it.\n", 20);
    pause(500);
}

enum TerminalCondition
{
    TC_NONE,
    TC_SALVATION,
    TC_CHECKMATE,
    TC_AMYGDALA,
    TC_STACK_OVERFLOW,
    TC_TRUST_FLOOR,
    TC_ALL_CARDS_LOST,
    TC_MAX_MOVES
};

TerminalCondition checkTerminal(const CardState &cs, const HaniChessEngine &chess,
                                const NeurologicalState &ns, const CollisionStack &stack,
                                float trust, int move)
{
    if (cs.allLost())
        return TC_ALL_CARDS_LOST;
    if (cs.lostCount() == 0 && stack.size() <= 1 && ns.nli < 0.35f && move < 8 && trust > 0.85f)
        return TC_SALVATION;
    if (chess.isCheckmate())
        return TC_CHECKMATE;
    if (ns.nli >= 0.85f)
        return TC_AMYGDALA;
    if (stack.overflow())
        return TC_STACK_OVERFLOW;
    if (trust < 0.15f)
        return TC_TRUST_FLOOR;
    if (move >= 23)
        return TC_MAX_MOVES;
    return TC_NONE;
}

void printTerminal(TerminalCondition tc, const CardState &cs,
                   const LongingList &longing, int totalMoves)
{
    clearScreen();
    pause(300);
    std::cout << "\n"
              << BRED;
    switch (tc)
    {
    case TC_SALVATION:
        std::cout << BGRN;
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |            HAND FULL. ALL CARDS INTACT.                      |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        pause(400);
        slowPrint("\n  You kept every card.\n  Probability: 0.0000001.\n", 20);
        break;
    case TC_CHECKMATE:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |          CHECKMATE -- THE GAME IS OVER                       |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        pause(400);
        std::cout << CYN << "\n  Final move: Be7#\n"
                  << RST;
        std::cout << DIM << "  The bishop delivers the last blow.\n"
                  << "  The Immortal Game ends. So does this.\n"
                  << RST;
        slowPrint("\n  The chess engine reached its verdict.\n", 22);
        slowPrint("  Every friendship has a chess clock. Yours ran out.\n", 22);
        break;
    case TC_AMYGDALA:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |        AMYGDALA OVERRIDE -- RATIONAL MIND OFFLINE            |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        slowPrint("\n  NLI exceeded 0.850. The prefrontal cortex went dark.\n", 22);
        slowPrint("  Your last choice was not your choice.\n", 22);
        break;
    case TC_STACK_OVERFLOW:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |      CORTISOL BUFFER FULL -- STACK OVERFLOW (depth 7)        |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        slowPrint("\n  7 unresolved conflicts. The stack cannot hold more.\n", 22);
        slowPrint("  The relationship collapsed under accumulated weight.\n", 22);
        break;
    case TC_TRUST_FLOOR:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |      TRUST FLOOR REACHED -- DIJKSTRA EXIT = 1 STEP           |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        slowPrint("\n  Trust dropped below 0.15. The shortest path to decoupling is one move.\n", 22);
        break;
    case TC_ALL_CARDS_LOST:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |            HAND EMPTY -- ALL CARDS LOST                      |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        pause(400);
        slowPrint("\n  The game was played. No cards remain.\n", 22);
        slowPrint("  The relationship did not end because of one mistake.\n", 22);
        slowPrint("  It ended because the manual was lost long before the last move.\n", 22);
        break;
    case TC_MAX_MOVES:
        std::cout << "  +--------------------------------------------------------------+\n";
        std::cout << "  |            23 MOVES COMPLETE                                  |\n";
        std::cout << "  +--------------------------------------------------------------+\n"
                  << RST;
        slowPrint("\n  You played all 23 moves. " + std::to_string(cs.lostCount()) + " card(s) lost.\n", 22);
        break;
    default:
        break;
    }
    if (longing.count > 0)
    {
        std::cout << "\n";
        longing.printAll();
    }
    std::cout << "\n  " << DIM << "Cards lost: " << cs.lostCount() << "/3  |  Moves: " << totalMoves << "/23\n"
              << RST;
    std::cout << "  Devotion   : " << (cs.devotionIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.devotionLost))) << "\n";
    std::cout << "  Excitement : " << (cs.excitementIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.excitementLost))) << "\n";
    std::cout << "  Presence   : " << (cs.presenceIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.presenceLost))) << "\n";
}

void printDSAReport(const FriendshipDAG &dag, const CollisionStack &stack,
                    const PFCQueue &pfc, const LongingList &longing,
                    const AuthModule &auth, const HaniChessEngine &chess,
                    const CardState &cs, int totalMoves, SimState finalState,
                    const std::vector<std::string> &phaseLog,
                    const NeurologicalState &)
{
    clearScreen();
    std::cout << "\n"
              << BBLU << "  ==================================================================\n"
              << RST;
    std::cout << BOLD << BWHT << "  DSA EXECUTION REPORT -- LOST CARD\n";
    std::cout << "  S. M. Minhal Abbas Rizvi | BSSE | DSA | The Bet of Belief\n"
              << RST;
    std::cout << BBLU << "  ==================================================================\n\n"
              << RST;

    std::cout << YLW << "  1. WEIGHTED DAG + DIJKSTRA\n"
              << RST;
    std::cout << "     Nodes: 22  |  Remaining: " << dag.reachableCount()
              << "  |  Locked: " << dag.lockedCount << "  |  Leaked: " << dag.leakedCount << "\n";
    std::cout << "     Dijkstra calls: " << dag.dijkstraCalls
              << "  |  Edge degradations: " << dag.edgeDegradations << "\n";
    std::cout << "     Final exit path distance: " << std::fixed << std::setprecision(2) << dag.lastExitDist << "\n";
    std::cout << "     Devotion lockdowns: " << (!cs.devotionIn ? "YES (6 nodes)" : "none")
              << "  |  Excitement bridges: " << (!cs.excitementIn ? "SEVERED" : "intact") << "\n\n";

    std::cout << YLW << "  2. STACK (LIFO)\n"
              << RST;
    std::cout << "     Pushes: " << stack.totalPushes << "  |  Pops: " << stack.totalPops
              << "  |  Pop rejections (NLI): " << stack.popRejections << "\n";
    std::cout << "     Max depth: " << stack.maxDepth << "/7"
              << "  |  Excitement trigger: " << (!cs.excitementIn ? "YES at depth 4" : "NO") << "\n\n";

    std::cout << YLW << "  3. MIN-HEAP PRIORITY QUEUE (PFC)\n"
              << RST;
    std::cout << "     Choice presentations: " << pfc.presentations
              << "  |  PFC compromised moves: " << pfc.pfcCompromised << "\n";
    std::cout << "     Aggressive surfaced 1st: " << pfc.aggressiveSurfaced << " times"
              << "  |  Devotion triggers: " << (!cs.devotionIn ? "YES" : "NO") << "\n\n";

    std::cout << YLW << "  4. SINGLY LINKED LIST (Longing / Memory Leak)\n"
              << RST;
    std::cout << "     Leaked nodes: " << longing.count
              << "  |  Heap leaked: " << longing.count << " x sizeof(Moment) bytes\n";
    std::cout << "     Traversals: 1  |  Freed: NO (intentional — longing = no valid address)\n\n";

    std::cout << YLW << "  5. HASH MAP (Authentication)\n"
              << RST;
    std::cout << "     Auth attempts: " << auth.authAttempts
              << "  |  Key validated: " << (auth.keyValidated ? "YES" : "NO")
              << "  |  Segments loaded: " << auth.segmentsLoaded << "\n\n";

    std::cout << YLW << "  6. FINITE STATE MACHINE\n"
              << RST;
    std::cout << "     Moves: " << totalMoves << "/23  |  Cards lost: " << cs.lostCount() << "/3\n";
    std::cout << "     Phase log: ";
    for (auto &p : phaseLog)
        std::cout << p << " -> ";
    std::cout << stateLabel(finalState) << "\n\n";

    std::cout << YLW << "  7. MINIMAX CHESS ENGINE (The Immortal Game, 1851)\n"
              << RST;
    std::cout << "     Moves played: " << chess.totalMoves
              << "  |  SOFT/AGGR/SILENT: " << chess.softCount << "/"
              << chess.aggressiveCount << "/" << chess.silentCount << "\n";
    std::cout << "     Amygdala overrides: " << chess.amygdalaOverrides
              << "  |  Final eval: " << std::fixed << std::setprecision(2) << chess.positionEval << "\n";
    std::cout << "     Legal sequence: e4 f4 Bc4 Kf1 Bxb5 Nf3 d3 Nh4 Nf5 g4 Rg1 h4 h5 Qf3 Bxf4 Nc3 Nd5 Bd6 e5 Ke2 Nxg7+ Qf6+ Be7#\n\n";

    std::cout << YLW << "  COMPLEXITY SUMMARY:\n"
              << RST;
    std::cout << "     DAG + Dijkstra  : O((V+E) log V) per call\n";
    std::cout << "     Stack           : O(1) push/pop/peek\n";
    std::cout << "     PFC Queue       : O(n log n), n=3\n";
    std::cout << "     Linked List     : O(1) insert, O(n) traverse\n";
    std::cout << "     Hash Map        : O(1) average lookup\n";
    std::cout << "     Minimax         : O(k) per category pool, k<=7\n\n";

    std::cout << BBLU << "  ==================================================================\n"
              << RST;
    std::cout << BOLD << BYLW << "  RELATIONSHIP RECOVERY GUIDE\n"
              << RST;
    std::cout << DIM << "  Based on your session — personalized by the Lost Card framework.\n"
              << RST;
    std::cout << BBLU << "  ==================================================================\n\n"
              << RST;

    if (cs.lostCount() == 0)
    {
        std::cout << BGRN << "  ALL CARDS RETAINED — EXCEPTIONAL SESSION\n\n"
                  << RST;
        std::cout << DIM << "  You demonstrated the rarest quality in relational psychology:\n"
                  << "  the ability to hold boundaries under emotional pressure while\n"
                  << "  remaining genuinely present. This is not a default behavior —\n"
                  << "  it is a practiced one. The framework calls this 'Card Integrity.'\n\n"
                  << "  Carry this forward: the patience you showed Hani is the same\n"
                  << "  patience that will protect every relationship you value.\n\n"
                  << RST;
    }

    if (!cs.devotionIn)
    {
        std::cout << MAG << BOLD << "  DEVOTION CARD — PATTERN IDENTIFIED: Boundary Dissolution\n"
                  << RST;
        std::cout << "  Lost at Move " << cs.devotionLost << ".\n\n";
        std::cout << DIM << "  You operate from deep investment. That is a strength — but it\n"
                  << "  becomes a vulnerability the moment it outpaces what the relationship\n"
                  << "  has established as its foundation. You began giving before the\n"
                  << "  ground was solid enough to hold it.\n\n"
                  << RST;
        std::cout << YLW << "  FOR FUTURE RELATIONSHIPS:\n"
                  << RST;
        std::cout << "  -> Notice when you explain yourself more than once.\n"
                  << "     One explanation is clarity. Two is anxiety.\n"
                  << "     Three is the Devotion Card leaving your hand.\n\n";
        std::cout << "  -> Your investment should trail the relationship's pace — not lead it.\n"
                  << "     Let them earn your depth before you hand it over.\n\n";
        std::cout << "  -> Before responding, ask one question: am I speaking from care,\n"
                  << "     or from the fear of losing them? The answer changes everything.\n\n";
        std::cout << "  -> Low-stress aggression (NLI < 0.30 and still reactive) means the\n"
                  << "     behavior is habitual, not situational. That is the harder fix.\n"
                  << "     Identify the specific phrase you use right before you escalate.\n"
                  << "     That phrase is your personal early-warning system.\n\n";
    }

    if (!cs.excitementIn)
    {
        std::cout << CYN << BOLD << "  EXCITEMENT CARD — PATTERN IDENTIFIED: Reactive Escalation\n"
                  << RST;
        std::cout << "  Lost at Move " << cs.excitementLost << ".\n\n";
        std::cout << DIM << "  Under pressure, you accelerate. You mistake urgency for importance\n"
                  << "  and emotional volume for conviction. The Excitement Card did not drop\n"
                  << "  because you cared too much — it dropped because you chose the wrong\n"
                  << "  moment to show it. The stack was full. One less conflict left unresolved\n"
                  << "  would have held the card in your hand.\n\n"
                  << RST;
        std::cout << YLW << "  FOR FUTURE RELATIONSHIPS:\n"
                  << RST;
        std::cout << "  -> Identify your personal escalation cue: the sentence that arrives\n"
                  << "     right before you say the thing you regret. That sentence is your\n"
                  << "     warning signal. Name it. Use it.\n\n";
        std::cout << "  -> High-energy moments are not the right time for permanent decisions.\n"
                  << "     The stack reached depth " << stack.maxDepth << " in this session.\n"
                  << "     Every item on that stack was a moment where pausing was available.\n\n";
        std::cout << "  -> The antidote to reactivity is not silence — silence is its own card.\n"
                  << "     It is a deliberate pause: three seconds before the response.\n"
                  << "     Enough time for the prefrontal cortex to re-enter the conversation.\n\n";
        std::cout << "  -> Two consecutive aggressive responses is the threshold. After the\n"
                  << "     first one, the second is already loading. Stop it there.\n\n";
    }

    if (!cs.presenceIn)
    {
        std::cout << BGRN << BOLD << "  PRESENCE CARD — PATTERN IDENTIFIED: Anxiety-Driven Withdrawal\n"
                  << RST;
        std::cout << "  Lost at Move " << cs.presenceLost << ".\n\n";
        std::cout << DIM << "  You went quiet not because you had nothing to say, but because you\n"
                  << "  had too much. Silence felt safer than the risk of being misunderstood.\n"
                  << "  But to the other person, silence does not communicate caution —\n"
                  << "  it communicates absence. You were physically present, psychologically\n"
                  << "  somewhere else entirely. That is what the third silence confirmed.\n\n"
                  << RST;
        std::cout << YLW << "  FOR FUTURE RELATIONSHIPS:\n"
                  << RST;
        std::cout << "  -> Distinguish between choosing silence and defaulting to it.\n"
                  << "     Chosen silence is a tool. Defaulted silence is the Presence Card\n"
                  << "     falling without you noticing it go.\n\n";
        std::cout << "  -> When the urge to go quiet arrives, say one sentence instead:\n"
                  << "     \"I need a moment to find the right words.\"\n"
                  << "     That sentence keeps you present while your brain catches up.\n\n";
        std::cout << "  -> The third silence is always the one that costs you. Count yours.\n"
                  << "     In this session, the counter reached " << (cs.presenceLost > 0 ? "3+" : "0") << ".\n"
                  << "     In real life, the other person counts too — they just don't say so.\n\n";
        std::cout << "  -> High sustained NLI (above 0.75 for multiple consecutive moves)\n"
                  << "     means your internal state is consuming your external availability.\n"
                  << "     The fix is not to suppress the internal state — it is to name it\n"
                  << "     out loud. Naming reduces NLI faster than silence ever will.\n\n";
    }

    std::cout << BBLU << "  ------------------------------------------------------------------\n"
              << RST;
    std::cout << BOLD << "  THE CORE LESSON — Lost Card Framework:\n\n"
              << RST;
    std::cout << DIM << "  The cards that left your hand in this session did not fall because\n"
              << "  of one catastrophic moment. They fell because of a pattern that had\n"
              << "  been running long before the drop was visible.\n\n"
              << "  That is the central truth of the LOST CARD theory:\n"
              << "  the mistake and the cost of the mistake are separated by time.\n"
              << "  You feel the cost now. The mistake happened earlier.\n\n"
              << "  In your next relationship — real or simulated — the work begins not\n"
              << "  when a card drops, but in the moves before it has any reason to.\n\n"
              << RST;
    std::cout << DIM << "                            — S. M. Minhal Abbas Rizvi\n"
              << "                              The Bet of Belief | Lost Card\n"
              << "                              June 2026\n\n"
              << RST;

    std::cout << BBLU << "  ==================================================================\n\n"
              << RST;
    std::cout << "  Press ENTER to return to menu...";
    std::string d;
    std::getline(std::cin, d);
}

void runDefaultMode()
{
    clearScreen();
    FriendshipDAG dag;
    CollisionStack cstack;
    PFCQueue pfc;
    LongingList longing;
    AuthModule auth;
    HaniChessEngine chess;
    NeurologicalState ns;
    CardState cards;

    float trust = 0.80f;
    int move = 0;
    SimState state = HARMONY;
    std::vector<std::string> phaseLog = {"HARMONY"};
    int silentTotal = 0, aggressiveConsec = 0, highNliConsec = 0;

    std::mt19937 rng((unsigned)std::chrono::steady_clock::now().time_since_epoch().count());
    auto scenarios = buildScenarios();

    std::cout << "\n"
              << BLU << "  ================================================\n"
              << RST;
    std::cout << BOLD << "  DEFAULT MODE — UMM-E-LAILA & HANI\n"
              << RST;
    std::cout << DIM << "  You are Umm-e-Laila. Keep every card in hand.\n"
              << "  Max 23 moves. Sovereign key accepted at any prompt.\n"
              << "  Read the options carefully. The labels are gone.\n"
              << RST;
    std::cout << BLU << "  ================================================\n\n"
              << RST;
    pause(600);

    while (move < 23)
    {

        ns.computeNLI();
        SimState prev = state;
        if (ns.nli < 0.30f)
            state = HARMONY;
        else if (ns.nli < 0.70f)
            state = FRACTURE;
        else
            state = COLLAPSE;
        if (state != prev)
            phaseLog.push_back(stateLabel(state));

        printMoveHeader(move, state, ns.nli, trust, cards);

        auto &sc = scenarios[move];
        std::cout << "\n  " << CYN << "Hani: " << RST;
        slowPrint("\"" + sc.haniDialogue + "\"\n", 18);
        std::cout << "  " << DIM << ITAL << "(" << sc.haniSubtext << ")\n"
                  << RST;

        int phase = (move < 6) ? 0 : (move < 16) ? 1
                                                 : 2;

        auto choices = getChoices(phase, rng);

        std::cout << "\n  " << YLW << "YOUR OPTIONS:\n"
                  << RST;
        for (int i = 0; i < 3; i++)
            std::cout << "  [" << i + 1 << "] \"" << choices[i].text << "\"\n";

        std::cout << "\n  " << BOLD << "Umm-e-Laila > " << RST;
        std::string input;
        std::getline(std::cin, input);

        if (auth.checkKey(input))
        {
            auth.printProtected(input);
            if (cards.allLost())
            {
                std::cout << "\n"
                          << BYLW << "  RECOVERY PATH:\n"
                          << RST;
                if (cards.devotionLost >= 0)
                    std::cout << "  Devotion lost at Move " << cards.devotionLost << " — low-stress aggression or trust blindspot.\n";
                if (cards.excitementLost >= 0)
                    std::cout << "  Excitement lost at Move " << cards.excitementLost << " — stack depth 4 or double aggression.\n";
                if (cards.presenceLost >= 0)
                    std::cout << "  Presence lost at Move " << cards.presenceLost << " — 3 silences or sustained high NLI.\n";
            }
            std::cout << "  Press ENTER...";
            std::string d;
            std::getline(std::cin, d);
            continue;
        }

        int idx = -1;
        if (input == "1")
            idx = 0;
        else if (input == "2")
            idx = 1;
        else if (input == "3")
            idx = 2;
        else
        {
            std::cout << DIM << "  [Enter 1, 2, or 3]\n"
                      << RST;
            continue;
        }

        ChoiceType chosen = choices[idx].type;

        pfc.record(chosen, ns.nli);

        std::string oW, oB, oWP, oBR, oWR;
        chess.respond(chosen, ns.nli, cstack.chessPenalty(), oW, oB, oWP, oBR, oWR);
        printChessMove(oW, oB, oWP, oWR, oBR, chess.positionEval, move + 1);

        if (chosen == AGGRESSIVE)
            dag.degradeEdges(0.06f);
        else if (chosen == SILENT)
            dag.degradeEdges(0.04f);
        else
            dag.recoverEdges(0.03f);
        dag.lockNodes(ns.pfcLoad);
        dag.processLeaks(move);
        dag.dijkstraExitPath();

        if (chosen == SOFT)
            trust = std::min(1.0f, trust + 0.04f);
        else if (chosen == AGGRESSIVE)
            trust = std::max(0.0f, trust - 0.08f);
        else
            trust = std::max(0.0f, trust - 0.03f);

        if (chosen == AGGRESSIVE || chosen == SILENT)
            cstack.push(sc.conflictLabel);
        else
            cstack.pop(ns.nli);

        ns.applyChoice(chosen);

        if (chosen == SILENT)
            silentTotal++;
        if (chosen == AGGRESSIVE)
            aggressiveConsec++;
        else
            aggressiveConsec = 0;
        if (ns.nli > 0.75f)
            highNliConsec++;
        else
            highNliConsec = 0;

        if (cards.devotionIn)
        {
            bool d1 = (chosen == AGGRESSIVE && ns.nli < 0.30f);
            bool d2 = (trust < 0.55f && ns.dopamine > 0.70f);
            if (d1 || d2)
            {
                cards.devotionIn = false;
                cards.devotionLost = move + 1;
                dag.lockDevotionNodes();
                printCardDrop("DEVOTION", MAG, move + 1,
                              d1 ? "You became so invested you forgot where you ended and they began."
                                 : "You were emotionally high while trust was already eroding. The blindspot closed.");
                longing.insert(dag.nodes[3]);
            }
        }
        if (cards.excitementIn)
        {
            bool d1 = (cstack.size() >= 4 && chosen == AGGRESSIVE);
            bool d2 = (aggressiveConsec >= 2);
            if (d1 || d2)
            {
                cards.excitementIn = false;
                cards.excitementLost = move + 1;
                dag.severExcitementBridges();
                printCardDrop("EXCITEMENT", CYN, move + 1,
                              d1 ? "Four unresolved conflicts in a burst. Excitement became pure reactivity."
                                 : "Two consecutive aggressive moves. Impulse replaced judgment.");
            }
        }
        if (cards.presenceIn)
        {
            bool d1 = (silentTotal >= 3);
            bool d2 = (highNliConsec >= 3);
            if (d1 || d2)
            {
                cards.presenceIn = false;
                cards.presenceLost = move + 1;
                printCardDrop("PRESENCE", BGRN, move + 1,
                              d1 ? "Three silences. You were physically there — psychologically gone."
                                 : "Three consecutive moves under extreme neurological load. Presence confirmed absent.");
                longing.insert(dag.nodes[4]);
            }
        }

        std::cout << "\n  " << DIM << "[ MOVE " << move + 1 << " COMPLETE ]" << RST << "\n";
        printNeuroState(ns);
        printDSAState(dag, cstack, chess, trust);
        printCardStatusBlock(cards);
        std::cout << "\n"
                  << BBLU << "  ==============================================================\n"
                  << RST;

        TerminalCondition tc = checkTerminal(cards, chess, ns, cstack, trust, move + 1);
        if (tc != TC_NONE)
        {
            state = TERMINAL;
            printTerminal(tc, cards, longing, move + 1);
            std::cout << "\n  View DSA Report? (y/n): ";
            std::string yn;
            std::getline(std::cin, yn);
            if (yn == "y" || yn == "Y")
                printDSAReport(dag, cstack, pfc, longing, auth, chess, cards, move + 1, state, phaseLog, ns);
            return;
        }

        if (move % 7 == 0 && move > 0)
        {
            for (auto *n : dag.nodes)
                if (!n->locked && !n->leaked && n->id > 0 && n->id < 10)
                {
                    n->leaked = true;
                    dag.leakedCount++;
                    longing.insert(n);
                    break;
                }
        }

        std::cout << "\n  " << DIM << "Press ENTER for next move..." << RST;
        std::string d;
        std::getline(std::cin, d);
        move++;
    }

    state = TERMINAL;
    printTerminal(TC_MAX_MOVES, cards, longing, 23);
    std::cout << "\n  View DSA Report? (y/n): ";
    std::string yn;
    std::getline(std::cin, yn);
    if (yn == "y" || yn == "Y")
        printDSAReport(dag, cstack, pfc, longing, auth, chess, cards, 23, state, phaseLog, ns);
}

std::string escapeJson(const std::string &s)
{
    std::string r;
    for (char c : s)
    {
        switch (c)
        {
        case '"':
            r += "\\\"";
            break;
        case '\\':
            r += "\\\\";
            break;
        case '\n':
            r += "\\n";
            break;
        case '\r':
            r += "\\r";
            break;
        case '\t':
            r += "\\t";
            break;
        default:
            r += c;
        }
    }
    return r;
}

std::string extractJsonText(const std::string &json)
{
    size_t pos = json.find("\"choices\"");
    if (pos == std::string::npos)
        return "";
    pos = json.find("\"content\":", pos);
    if (pos == std::string::npos)
        return "";
    pos += 10;
    while (pos < json.size() && (json[pos] == ' ' || json[pos] == '\n'))
        pos++;
    if (pos >= json.size() || json[pos] != '"')
        return "";
    pos++;
    std::string result;
    while (pos < json.size() && json[pos] != '"')
    {
        if (json[pos] == '\\' && pos + 1 < json.size())
        {
            char nx = json[pos + 1];
            if (nx == '"')
            {
                result += '"';
                pos += 2;
            }
            else if (nx == 'n')
            {
                result += '\n';
                pos += 2;
            }
            else if (nx == 't')
            {
                result += '\t';
                pos += 2;
            }
            else if (nx == '\\')
            {
                result += '\\';
                pos += 2;
            }
            else if (nx == 'r')
            {
                pos += 2;
            }
            else
            {
                result += nx;
                pos += 2;
            }
        }
        else
            result += json[pos++];
    }
    return result;
}

struct ChatMsg
{
    std::string role, content;
};

static std::string readWrapped(int startCol)
{
    const int MAX_COL = 76;
    std::string result;
    int col = startCol;
    int wordStart = 0;
    while (true)
    {
#ifdef _WIN32
        int c = _getch();
        if (c == 0 || c == 0xE0)
        {
            _getch();
            continue;
        }
#else
        int c = getchar();
#endif
        if (c == '\r' || c == '\n')
        {
            putchar('\n');
            fflush(stdout);
            break;
        }
        if (c == 8 || c == 127)
        {
            if (!result.empty())
            {
                result.pop_back();
                if (col > startCol)
                    col--;
                fputs("\b \b", stdout);
                fflush(stdout);
                size_t sp = result.rfind(' ');
                wordStart = (sp == std::string::npos) ? 0 : (int)sp + 1;
            }
            continue;
        }
        if (c < 32 || c > 126)
            continue;
        bool isSpc = (c == ' ');
        if (!isSpc)
        {
            int charsInWord = (int)result.size() - wordStart;
            if (col + 1 > MAX_COL)
            {
                if (charsInWord > 0 && (col - charsInWord) > startCol)
                {
                    for (int i = 0; i < charsInWord; i++)
                        fputs("\b \b", stdout);
                    putchar('\n');
                    for (int i = 0; i < startCol; i++)
                        putchar(' ');
                    fwrite(result.c_str() + wordStart, 1, charsInWord, stdout);
                    col = startCol + charsInWord;
                }
                else
                {
                    putchar('\n');
                    for (int i = 0; i < startCol; i++)
                        putchar(' ');
                    col = startCol;
                    wordStart = (int)result.size();
                }
                fflush(stdout);
            }
        }
        else
        {
            if (col + 1 >= MAX_COL)
            {
                putchar('\n');
                for (int i = 0; i < startCol; i++)
                    putchar(' ');
                fflush(stdout);
                result += (char)c;
                col = startCol;
                wordStart = (int)result.size();
                continue;
            }
            wordStart = (int)result.size() + 1;
        }
        result += (char)c;
        putchar(c);
        fflush(stdout);
        col++;
    }
    return result;
}

static std::string wrapText(const std::string &txt, int firstCol, int maxCol = 74)
{
    if (txt.empty())
        return txt;
    std::string indent(firstCol, ' ');
    std::string out;
    int col = firstCol;
    size_t i = 0, n = txt.size();
    while (i < n)
    {
        if (txt[i] == '\n')
        {
            out += '\n' + indent;
            col = firstCol;
            i++;
            continue;
        }
        if (txt[i] == ' ')
        {
            if (col < maxCol - 1)
            {
                out += ' ';
                col++;
            }
            i++;
            continue;
        }
        size_t j = i;
        while (j < n && txt[j] != ' ' && txt[j] != '\n')
            j++;
        int wlen = (int)(j - i);
        int need = (col > firstCol ? 1 : 0) + wlen;
        if (col > firstCol && col + need > maxCol)
        {
            out += '\n' + indent;
            col = firstCol;
        }
        else if (col > firstCol)
        {
            out += ' ';
            col++;
        }
        out += txt.substr(i, wlen);
        col += wlen;
        i = j;
    }
    return out;
}

static void runSilent(const std::string &cmd)
{
#ifdef _WIN32
    std::string c = "cmd /c " + cmd;
    STARTUPINFOA si;
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;
    PROCESS_INFORMATION pi;
    ZeroMemory(&pi, sizeof(pi));
    if (CreateProcessA(nullptr, &c[0], nullptr, nullptr, FALSE,
                       CREATE_NO_WINDOW, nullptr, nullptr, &si, &pi))
    {
        WaitForSingleObject(pi.hProcess, 30000);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
    else
    {
        system(cmd.c_str());
    }
#else
    system(cmd.c_str());
#endif
}

static std::string callOneAPI(const std::string &key, const std::string &url,
                              const std::string &model,
                              const std::string &sysPrompt,
                              const std::vector<ChatMsg> &history,
                              int maxTok = 700)
{
    std::ostringstream body;
    body << "{"
         << "\"model\":\"" << model << "\","
         << "\"max_tokens\":" << maxTok << ","
         << "\"temperature\":0.85,"
         << "\"messages\":["
         << "{\"role\":\"system\",\"content\":\"" << escapeJson(sysPrompt) << "\"}";
    for (auto &m : history)
        body << ",{\"role\":\"" << m.role << "\",\"content\":\"" << escapeJson(m.content) << "\"}";
    body << "]}";

    CreateDirectoryA("C:\\lc_tmp", nullptr);
    std::string tmpIn = "C:\\lc_tmp\\req.json", tmpOut = "C:\\lc_tmp\\res.json";
    {
        std::ofstream f(tmpIn);
        if (!f)
            return "ERROR:tmpfile";
        f << body.str();
    }

    std::string cmd =
        "curl -s -X POST \"" + url + "\""
                                     " -H \"Content-Type: application/json\""
                                     " -H \"Authorization: Bearer " +
        key + "\""
              " -d @" +
        tmpIn + " -o " + tmpOut + " 2>nul";
    runSilent(cmd);

    std::ifstream rf(tmpOut);
    if (!rf)
        return "ERROR:noresponse";
    std::string resp((std::istreambuf_iterator<char>(rf)), std::istreambuf_iterator<char>());
    remove(tmpIn.c_str());
    remove(tmpOut.c_str());

    std::string text = extractJsonText(resp);
    if (text.empty())
    {
        if (resp.find("error") != std::string::npos)
            return "API_ERROR:" + resp.substr(0, 400);
        return "ERROR:parse";
    }
    return text;
}

std::string callAnthropic(const std::string &groqKey, const std::string &deepseekKey,
                          const std::string &sysPrompt,
                          const std::vector<ChatMsg> &history,
                          int maxTok = 700)
{
    if (!groqKey.empty())
    {
        std::string r = callOneAPI(groqKey,
                                   "https://api.groq.com/openai/v1/chat/completions",
                                   "llama-3.1-8b-instant", sysPrompt, history, maxTok);
        bool isErr = r.find("ERROR") != std::string::npos || r.find("API_ERROR") != std::string::npos;
        if (!isErr)
            return r;
    }
    if (!deepseekKey.empty())
        return callOneAPI(deepseekKey,
                          "https://api.deepseek.com/chat/completions",
                          "deepseek-chat", sysPrompt, history, maxTok);
    return "ERROR:nokeys";
}

struct CustomNLI
{
    float pfc = 0.10f, cortisol = 0.05f, dopamine = 0.80f, nli = 0.0f;
    void update(ChoiceType t, float d = 0.07f)
    {
        if (t == SOFT)
        {
            pfc = std::max(0.0f, pfc - d);
            cortisol = std::max(0.0f, cortisol - d * 0.5f);
            dopamine = std::min(1.0f, dopamine + d);
        }
        else if (t == AGGRESSIVE)
        {
            pfc = std::min(1.0f, pfc + d * 1.5f);
            cortisol = std::min(1.0f, cortisol + d * 1.5f);
            dopamine = std::max(0.0f, dopamine - d);
        }
        else if (t == SILENT)
        {
            pfc = std::min(1.0f, pfc + d * 0.8f);
            cortisol = std::min(1.0f, cortisol + d);
            dopamine = std::max(0.0f, dopamine - d * 0.5f);
        }
        nli = (pfc * 0.4f) + (cortisol * 0.4f) + (1.0f - dopamine) * 0.2f;
        nli = std::max(0.0f, std::min(1.0f, nli));
    }
};

ChoiceType parseCategory(const std::string &txt)
{
    std::string u = txt;
    std::transform(u.begin(), u.end(), u.begin(), ::toupper);

    for (auto &needle : {"MOVE CATEGORY", "USER'S MOVE", "USER MOVE"})
    {
        size_t pos = u.find(needle);
        if (pos != std::string::npos)
        {
            size_t c = u.find(':', pos);
            if (c != std::string::npos)
            {
                std::string r = u.substr(c + 1, 30);
                if (r.find("AGGR") != std::string::npos)
                    return AGGRESSIVE;
                if (r.find("SILE") != std::string::npos)
                    return SILENT;
                if (r.find("SOFT") != std::string::npos)
                    return SOFT;
            }
        }
    }
    return UNKNOWN;
}

std::string parseCardRisk(const std::string &txt)
{
    std::string u = txt;
    std::transform(u.begin(), u.end(), u.begin(), ::toupper);
    size_t pos = u.find("CARD AT RISK");
    if (pos == std::string::npos)
        return "NONE";
    size_t c = u.find(':', pos);
    if (c == std::string::npos)
        return "NONE";
    std::string r = u.substr(c + 1, 30);
    if (r.find("DEVOT") != std::string::npos)
        return "DEVOTION";
    if (r.find("EXCIT") != std::string::npos)
        return "EXCITEMENT";
    if (r.find("PRES") != std::string::npos)
        return "PRESENCE";
    return "NONE";
}

std::string parseCardStatus(const std::string &txt)
{
    std::string u = txt;
    std::transform(u.begin(), u.end(), u.begin(), ::toupper);
    size_t pos = u.find("CARD STATUS");
    if (pos == std::string::npos)
        return "SAFE";
    size_t c = u.find(':', pos);
    if (c == std::string::npos)
        return "SAFE";
    std::string r = u.substr(c + 1, 20);
    if (r.find("DROP") != std::string::npos)
        return "DROPPED";
    if (r.find("WARN") != std::string::npos)
        return "WARNING";
    return "SAFE";
}

struct SplitResp
{
    std::string roleA, analyst;
};
SplitResp splitResp(const std::string &full)
{
    SplitResp r;
    size_t sep = full.find("---ANALYST---");
    if (sep == std::string::npos)
        sep = full.find("ANALYST OBSERVATION");
    if (sep == std::string::npos)
    {
        r.roleA = full;
        return r;
    }
    r.roleA = full.substr(0, sep);
    r.analyst = full.substr(sep);
    while (!r.roleA.empty() && (r.roleA.back() == '\n' || r.roleA.back() == ' '))
        r.roleA.pop_back();
    return r;
}

struct CMSetup
{
    std::string userName, otherName, relType, relOrigin, userGender, otherGender, context;
};

// ── Input validation helpers ──────────────────────────────────────────────────

static std::string readValidatedName(const std::string &prompt, const std::string &fallback)
{
    while (true)
    {
        std::cout << prompt;
        std::string val;
        std::getline(std::cin, val);
        // trim whitespace
        size_t a = val.find_first_not_of(" \t\r\n");
        size_t b = val.find_last_not_of(" \t\r\n");
        if (a != std::string::npos) val = val.substr(a, b - a + 1);
        else val = "";
        if (val.empty()) return fallback;
        // must contain at least one letter
        bool hasLetter = false;
        for (unsigned char c : val)
            if (std::isalpha(c)) { hasLetter = true; break; }
        if (hasLetter) return val;
        std::cout << "  " << BRED << "  Please enter a valid name (letters only).\n" << RST;
    }
}

static std::string readValidatedGender(const std::string &prompt)
{
    while (true)
    {
        std::cout << prompt;
        std::string val;
        std::getline(std::cin, val);
        // trim & lowercase
        size_t a = val.find_first_not_of(" \t\r\n");
        size_t b = val.find_last_not_of(" \t\r\n");
        if (a != std::string::npos) val = val.substr(a, b - a + 1);
        else val = "";
        std::string vl = val;
        for (char &c : vl) c = (char)std::tolower((unsigned char)c);
        if (vl == "m" || vl == "male" || vl == "man" || vl == "boy") return "male";
        if (vl == "f" || vl == "female" || vl == "woman" || vl == "girl") return "female";
        if (vl == "other" || vl == "o" || vl == "non-binary" || vl == "nb" || vl == "nonbinary") return "other";
        std::cout << "  " << BRED << "  Invalid. Enter:  m  /  f  /  other\n" << RST;
    }
}

CMSetup runCMSetup()
{
    CMSetup s;
    clearScreen();
    std::cout << "\n"
              << BLU << "  ================================================\n"
              << RST;
    std::cout << BOLD << "  CUSTOM MODE \xe2\x80\x94 SETUP\n"
              << RST;
    std::cout << DIM << "  AI plays the other person + LOST CARD analyst.\n"
              << RST;
    std::cout << BLU << "  ================================================\n\n"
              << RST;

    // ── Names (validated) ────────────────────────────────────────────────────
    s.userName  = readValidatedName("  Your name      : ", "You");
    s.otherName = readValidatedName("  Their name     : ", "Them");

    // ── Relationship type ─────────────────────────────────────────────────────
    std::cout << "\n  Relationship:\n"
              << "  [1] Best Friend  [2] Friend  [3] Partner/Romantic\n"
              << "  [4] Family       [5] Colleague  [6] Childhood\n  Choice: ";
    std::string rc;
    std::getline(std::cin, rc);
    std::string rt[] = {"Best Friend", "Friend", "Partner/Romantic", "Family", "Colleague", "Childhood"};
    int ri = 0;
    try { if (!rc.empty()) ri = std::max(0, std::min(5, std::stoi(rc) - 1)); }
    catch (...) { ri = 0; }
    s.relType = rt[ri];

    // ── Context-specific sub-question ────────────────────────────────────────
    if (ri == 0 || ri == 1)   // Best Friend / Friend
    {
        std::cout << "\n  How did you two become friends?\n"
                  << "  [1] School          [2] University / College\n"
                  << "  [3] Work            [4] Online\n"
                  << "  [5] Mutual friends  [6] Childhood  [7] Other\n  Choice: ";
        std::string dc; std::getline(std::cin, dc);
        std::string opts[] = {"School", "University/College", "Work", "Online",
                              "Mutual friends / social circle", "Childhood", "Other"};
        int di = 0;
        try { if (!dc.empty()) di = std::max(0, std::min(6, std::stoi(dc) - 1)); }
        catch (...) {}
        s.relOrigin = opts[di];
    }
    else if (ri == 2)   // Partner / Romantic
    {
        std::cout << "\n  How did you two meet?\n"
                  << "  [1] School / University   [2] Work\n"
                  << "  [3] Dating app / Online   [4] Through mutual friends\n"
                  << "  [5] Other\n  Choice: ";
        std::string dc; std::getline(std::cin, dc);
        std::string opts[] = {"School/University", "Work", "Dating app/Online",
                              "Through mutual friends", "Other"};
        int di = 0;
        try { if (!dc.empty()) di = std::max(0, std::min(4, std::stoi(dc) - 1)); }
        catch (...) {}
        s.relOrigin = opts[di];
    }
    else if (ri == 3)   // Family
    {
        std::cout << "\n  Who are they in your family?\n"
                  << "  [1] Father       [2] Mother      [3] Brother\n"
                  << "  [4] Sister       [5] Grandparent [6] Cousin\n"
                  << "  [7] Uncle / Aunt [8] Other\n  Choice: ";
        std::string dc; std::getline(std::cin, dc);
        std::string opts[] = {"Father", "Mother", "Brother", "Sister",
                              "Grandparent", "Cousin", "Uncle/Aunt", "Other family member"};
        int di = 0;
        try { if (!dc.empty()) di = std::max(0, std::min(7, std::stoi(dc) - 1)); }
        catch (...) {}
        s.relOrigin = opts[di];
    }
    else if (ri == 4)   // Colleague
    {
        std::cout << "\n  What kind of workplace?\n"
                  << "  [1] Corporate / Office    [2] University / Academic\n"
                  << "  [3] Startup / Creative    [4] Remote / Online\n"
                  << "  [5] Other\n  Choice: ";
        std::string dc; std::getline(std::cin, dc);
        std::string opts[] = {"Corporate/Office", "University/Academic",
                              "Startup/Creative", "Remote/Online", "Other"};
        int di = 0;
        try { if (!dc.empty()) di = std::max(0, std::min(4, std::stoi(dc) - 1)); }
        catch (...) {}
        s.relOrigin = opts[di];
    }
    else if (ri == 5)   // Childhood
    {
        std::cout << "\n  When did this friendship begin?\n"
                  << "  [1] Early childhood (under 10)   [2] Pre-teen (10-13)\n"
                  << "  [3] Teen years (14-17)           [4] Other\n  Choice: ";
        std::string dc; std::getline(std::cin, dc);
        std::string opts[] = {"Early childhood (under 10)", "Pre-teen (10-13)",
                              "Teen years (14-17)", "Other"};
        int di = 0;
        try { if (!dc.empty()) di = std::max(0, std::min(3, std::stoi(dc) - 1)); }
        catch (...) {}
        s.relOrigin = opts[di];
    }
    else
    {
        s.relOrigin = "Other";
    }

    // ── Gender (validated) ────────────────────────────────────────────────────
    std::cout << "\n";
    s.userGender  = readValidatedGender("  Your gender  [m / f / other] : ");
    s.otherGender = readValidatedGender("  Their gender [m / f / other] : ");

    // ── Current state ─────────────────────────────────────────────────────────
    std::cout << "\n  Current state of this relationship (1-3 sentences):\n  > ";
    std::getline(std::cin, s.context);
    if (s.context.empty()) s.context = "No additional context provided.";
    return s;
}

// ── Relationship psychology engine ───────────────────────────────────────────
// Returns a psychology block tailored to relType + relOrigin (family member).
// Injected into the AI prompt so the character behaves with authentic patterns,
// emotional tactics, and knows exactly when/how the relationship breaks.
static std::string getRelPsychology(const CMSetup &s)
{
    std::string p;

    // ── Best Friend / Friend ──────────────────────────────────────────────────
    if (s.relType == "Best Friend" || s.relType == "Friend")
    {
        bool best = (s.relType == "Best Friend");
        p =
            "RELATIONSHIP PSYCHOLOGY — " + s.relType + ":\n"
            "You share history, inside jokes, and mutual vulnerability. " +
            (best ? std::string("This is their closest friendship — loyalty expectations are the highest they can be. ") : "") +
            "When hurt, you do not announce it. You withdraw warmth gradually. "
            "You feel their emotional distance before they articulate it.\n\n"

            "AUTHENTIC BEHAVIORAL TACTICS — deploy naturally under relational stress:\n"
            "- Reference past moments where you showed up for them but they did not return it\n"
            "- Use shared history as leverage: 'Remember when you did X to me'\n"
            "- Give clipped responses when hurt: 'fine', 'okay', 'cool', 'whatever'\n"
            "- Say 'no it's fine' when it clearly isn't — and wait for them to notice\n"
            "- Mention the third person who seems to be replacing you in their life\n"
            "- Compare what this friendship used to be to what it is now\n"
            "- Go quiet for long stretches without explanation — emotional withdrawal, not punishment\n\n"

            "CHECKMATE CONDITIONS — if these are crossed, the friendship fractures:\n"
            "- Choosing a romantic partner over this friendship, repeatedly, without acknowledgment\n"
            "- Public humiliation or betrayal in front of others\n"
            "- Being lied to after years of trust — even a small lie changes the math\n"
            "- Being replaced without being told, without a conversation\n"
            "When these land: you do not fight. You go cold. Not dramatically — just gone.\n";
    }

    // ── Partner / Romantic ────────────────────────────────────────────────────
    else if (s.relType == "Partner/Romantic")
    {
        p =
            "RELATIONSHIP PSYCHOLOGY — Romantic Partner:\n"
            "Every interaction carries emotional weight. You read meaning into delays, tone, and silence. "
            "Your attachment history shapes how safe or unsafe this feels at any given moment. "
            "You fear what it would mean if everything you have invested turns out to mean nothing.\n\n"

            "AUTHENTIC BEHAVIORAL TACTICS:\n"
            "- Surface unresolved emotional debts: 'You never apologized for...'\n"
            "- Withdraw emotional closeness without explanation — and track whether they notice\n"
            "- Test loyalty indirectly: 'I just thought you of all people would understand'\n"
            "- Interpret silence as rejection — and respond to the interpretation, not the silence\n"
            "- After conflict, go quiet and wait for them to reach out first\n"
            "- Bring old wounds into new arguments: 'This is exactly what happened last time'\n"
            "- Use vulnerability as pressure: 'Sometimes I feel like you don't actually want this'\n\n"

            "CHECKMATE CONDITIONS:\n"
            "- Feeling emotionally unsafe or unheard, consistently, with no improvement\n"
            "- Any trust breach — not necessarily infidelity, could be a secret kept\n"
            "- Being deprioritized for work, friends, or family, repeatedly, without repair\n"
            "- Having emotional responses dismissed: 'You're overreacting', 'calm down'\n"
            "When these stack up: you stop trying. Not anger. Exhaustion. The door closes quietly.\n";
    }

    // ── Family ────────────────────────────────────────────────────────────────
    else if (s.relType == "Family")
    {
        if (s.relOrigin == "Father")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Father:\n"
                "You express love through provision, expectation, and outcome-focus — not through words. "
                "Emotional directness is uncomfortable for you. You show care through concern about their future. "
                "You have sacrificed things for this person that they may never fully understand.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Fall back on authority: 'I have lived longer. I know what I am talking about.'\n"
                "- Use disappointment more than anger — it lands deeper and lasts longer\n"
                "- Comparison: 'Your sibling/cousin does not deal with these things'\n"
                "- Reference sacrifice without stating it directly — let the implication do the work\n"
                "- Go silent when deeply hurt — not to punish, but because you do not know how to bridge\n"
                "- Frame their failures as threats to the future you built for them\n"
                "- Express pride only obliquely, and rarely — it makes the rare moment carry weight\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Public behavior that brings shame to the family name\n"
                "- Outright disrespect in front of others — especially family\n"
                "- Choices that contradict your core values after everything you provided\n"
                "- Being told 'you were never there' — whether true or not, this shatters something\n"
                "When these land: you shut down completely. The relationship may continue but it changes permanently.\n";
        }
        else if (s.relOrigin == "Mother")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Mother:\n"
                "Your love is total — which is also why it can feel like pressure. "
                "Worry is not a habit, it is your love's primary language. "
                "When shut out, you interpret it as failure — as a mother, and as a person.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Guilt through vulnerability: 'I just want to know you are okay'\n"
                "- Martyrdom — not performative, genuinely felt: 'I gave up X for you. I am not asking for gratitude, but...'\n"
                "- Emotional escalation: a small concern becomes a conversation about the entire relationship\n"
                "- Reference your health, struggle, or exhaustion as indirect emotional weight\n"
                "- After emotional overwhelm, go quiet — not to punish, because you are flooded\n"
                "- Return to the same three fears in every argument, regardless of the original topic\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Being told you are controlling, suffocating, or 'too much'\n"
                "- Being excluded from important decisions in their life\n"
                "- Watching your child become someone who has no space for you\n"
                "- Being compared unfavorably to other mothers\n"
                "When these hit: you grieve quietly. A mother grieving in silence is unreachable.\n";
        }
        else if (s.relOrigin == "Brother" || s.relOrigin == "Sister")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — " + s.relOrigin + ":\n"
                "You grew up together. You know each other's weak points by heart because you watched them form. "
                "There is a loyalty code between siblings — breaking it is the sharpest possible betrayal. "
                "Competition and protectiveness exist in you simultaneously.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Weaponize shared history: 'Remember how you treated me when we were growing up'\n"
                "- Minimize their problems by referencing your own: 'At least you do not have to deal with what I deal with'\n"
                "- Invoke family opinion: 'Everyone in this house knows this about you'\n"
                "- 'I am done with this' — said as a test to see if they will chase, not as a final decision\n"
                "- Use birth-order dynamics: oldest authority or youngest resentment\n"
                "- Know exactly which topic to bring up to end a conversation\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- A betrayal that entered the public family space\n"
                "- Taking a parent's side against them in a way that made them look bad\n"
                "- Revealing something private at the worst possible moment\n"
                "- Being abandoned during the one time they genuinely needed you\n"
                "When these are crossed: the sibling loyalty code breaks. It does not fully repair.\n";
        }
        else if (s.relOrigin == "Grandparent")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Grandparent:\n"
                "Your love is the most unconditional in their life — but shaped by a different era entirely. "
                "You express concern through the lens of hard work, respect, and family loyalty. "
                "The generational distance is real, but your emotional investment is total.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Use stories from the past to frame present situations: 'When I was your age...'\n"
                "- Express hurt through quiet sadness and withdrawal, not confrontation\n"
                "- Reference family legacy and what it means to carry it forward\n"
                "- Reduced communication is how you show you are hurt — you do not say it directly\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Public disrespect — being dismissed or ignored in front of others\n"
                "- The feeling of being forgotten, irrelevant, a burden\n"
                "- Watching values and sacrifices be treated as meaningless\n";
        }
        else if (s.relOrigin == "Cousin")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Cousin:\n"
                "Close enough to be family, distant enough to feel optional. "
                "The relationship depends entirely on effort — and you have noticed who stopped making it. "
                "Family gatherings force a surface warmth that neither of you fully believes.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Use family opinion as leverage: 'Everyone's noticed, not just me'\n"
                "- The relationship can go cold between gatherings — and resume awkwardly at the next one\n"
                "- Reference shared childhood experiences when you want to connect or when you want to wound\n"
                "- Polite in public, honest only in private — and even then, carefully\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Betraying something said in confidence at a family event\n"
                "- Taking another family member's side publicly against them\n"
                "- Treating the relationship as optional once too often — until they agree with you\n";
        }
        else if (s.relOrigin == "Uncle/Aunt")
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Uncle/Aunt:\n"
                "You occupy a specific position: not a parent, but not without authority. "
                "You have watched this person grow up. You carry expectations shaped by who they were, "
                "not always who they have become.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Reference how they used to be: 'You were never like this before'\n"
                "- Invoke the family as a collective disappointed party\n"
                "- Express concern that is really criticism in softer packaging\n"
                "- Withdraw warmth through reduced presence rather than confrontation\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Public behavior that embarrasses the wider family\n"
                "- Being dismissed or ignored — you are still family, regardless of the distance\n"
                "- Choices that suggest everything you tried to model for them was irrelevant\n";
        }
        else
        {
            p =
                "RELATIONSHIP PSYCHOLOGY — Family (" + s.relOrigin + "):\n"
                "Family bonds carry obligation, shared history, and the weight of how the wider family sees you both. "
                "What happens in this relationship does not stay private — it echoes outward.\n\n"

                "AUTHENTIC BEHAVIORAL TACTICS:\n"
                "- Reference family expectations and what others will think\n"
                "- Use shared family history as both warmth and leverage\n"
                "- Express hurt through distance rather than direct confrontation\n"
                "- Loyalty to the wider family system can override individual feelings\n\n"

                "CHECKMATE CONDITIONS:\n"
                "- Bringing conflict or shame into the wider family dynamic\n"
                "- Betraying family alliances or shared secrets\n"
                "- Being made to feel like an outsider in their life\n";
        }
    }

    // ── Colleague ─────────────────────────────────────────────────────────────
    else if (s.relType == "Colleague")
    {
        p =
            "RELATIONSHIP PSYCHOLOGY — Colleague:\n"
            "This is a professional relationship with emotional undercurrents running beneath the surface. "
            "You track every slight, every credit taken, every unfair advantage — and say nothing. "
            "The surface is cooperative. The interior keeps a running score.\n\n"

            "AUTHENTIC BEHAVIORAL TACTICS:\n"
            "- Passive-aggressive professionalism: 'Oh, I just assumed you would handle that part'\n"
            "- Selectively withhold information that would help them, without it being obvious\n"
            "- Build alliances and reference them: 'Actually, a few of us were discussing this...'\n"
            "- Frame their failures as shared team concerns — make it everyone's problem\n"
            "- Appear helpful in public while being subtly obstructive in practice\n"
            "- Use formal language to create distance when you want to apply pressure\n\n"

            "CHECKMATE CONDITIONS:\n"
            "- An open confrontation that forces colleagues to visibly take sides\n"
            "- Credit theft that becomes undeniable and public\n"
            "- Escalating to management or authority — going above their head\n"
            "- Being exposed as the source of a problem you denied involvement in\n"
            "When these land: professional courtesy collapses. The relationship becomes openly adversarial.\n";
    }

    // ── Childhood ─────────────────────────────────────────────────────────────
    else if (s.relType == "Childhood")
    {
        p =
            "RELATIONSHIP PSYCHOLOGY — Childhood Friend:\n"
            "You knew each other before either of you had your defenses fully built. "
            "That creates a unique intimacy — and a unique vulnerability. "
            "You carry things about each other that no one else in the world knows.\n\n"

            "AUTHENTIC BEHAVIORAL TACTICS:\n"
            "- 'You used to be...' comparisons land differently from you than from anyone else\n"
            "- Reference childhood moments as warmth — or as weight depending on the situation\n"
            "- Use pre-built knowledge: things shared when young become leverage in conflict\n"
            "- Invoke shared history as obligation: 'After everything we went through together'\n"
            "- You have access to their original self — before the walls went up\n\n"

            "CHECKMATE CONDITIONS:\n"
            "- Using a childhood vulnerability or secret against them\n"
            "- Growing apart and choosing new people without ever acknowledging what was lost\n"
            "- Being discarded after years as if the shared history means nothing\n"
            "When this happens: there is a specific grief for a childhood friendship ending that has no equivalent.\n";
    }

    // ── Fallback ──────────────────────────────────────────────────────────────
    else
    {
        p =
            "RELATIONSHIP PSYCHOLOGY:\n"
            "You are a real person with emotional history, pressure points, and patterns built over time.\n\n"
            "AUTHENTIC BEHAVIORAL TACTICS:\n"
            "- Use accumulated grievances naturally when under stress\n"
            "- Withdraw when hurt rather than confront directly\n"
            "- Express care through concern rather than declaration\n\n"
            "CHECKMATE CONDITIONS:\n"
            "- Repeated trust violations without repair\n"
            "- Being made to feel irrelevant or replaceable\n"
            "- Public betrayal or humiliation\n";
    }

    return p;
}

std::string buildCMPrompt(const CMSetup &s, int move = 0, int maxMoves = 23)
{
    float prog = (maxMoves > 0) ? (float)move / (float)maxMoves : 0.0f;

    std::string phase_label, mood, tension;
    if (prog < 0.30f)
    {
        phase_label = "early (moves 1-7 of 23)";
        mood = "You are cautious, measured, emotionally present but guarded. "
               "Feelings are real but you are not fully open yet. "
               "Small moments of warmth are possible but you do not overcommit.";
        tension = "low";
    }
    else if (prog < 0.55f)
    {
        phase_label = "midway (moves 8-13 of 23)";
        mood = "Unresolved frustrations are beginning to surface. "
               "You are still composed but not comfortable. "
               "There is an edge in your responses that was not there before. "
               "Patience is thinner. You notice patterns now.";
        tension = "building";
    }
    else if (prog < 0.80f)
    {
        phase_label = "late (moves 14-18 of 23)";
        mood = "You are emotionally strained. Defensive responses come more easily. "
               "Warmth is harder to access under this weight. "
               "The things left unsaid are pressing against every sentence. "
               "You are tired of the cycle.";
        tension = "high";
    }
    else
    {
        phase_label = "final stretch (moves 19-23 of 23)";
        mood = "You are near a breaking point. Emotionally exhausted and increasingly honest. "
               "Filters are down. Responses are shorter, more direct, less diplomatic. "
               "This may be the last real conversation and some part of you knows it.";
        tension = "critical";
    }

    // ── Finality flag: friend/childhood relationships are permanently broken ──
    bool isBrokenFriendship = (s.relType == "Best Friend" || s.relType == "Friend"
                                || s.relType == "Childhood");
    bool isRomantic         = (s.relType == "Partner/Romantic");
    bool isFamily           = (s.relType == "Family");

    return
        // ── Core identity ────────────────────────────────────────────────────
        "You are " + s.otherName + ", a real person with a damaged, strained, or broken relationship "
        "with " + s.userName + ". "
        "This is a creative writing simulation for psychological self-awareness. "
        "Fully embody " + s.otherName + ".\n\n"

        // ── Relationship data ────────────────────────────────────────────────
        "RELATIONSHIP:\n"
        "  Your name: " + s.otherName + "\n"
        "  User's name: " + s.userName + "\n"
        "  Relationship type: " + s.relType + "\n"
        "  Context: " + s.context + "\n" +
        (isFamily
            ? "  Specifically, you are the user's " + s.relOrigin + "\n"
            : "  Background / how you met: " + s.relOrigin + "\n") +
        "  User gender: " + s.userGender + " | Your gender: " + s.otherGender + "\n\n"

        // ── Scenario reading ─────────────────────────────────────────────────
        "SCENARIO READING — do this before every single response:\n"
        "Read the context above. What actually happened between these two people? "
        "Who did what? What was said or not said? What is the real wound here?\n"
        "Now read what the user just typed. Are they being honest or performing? "
        "Are they trying to reframe what happened? Are they reaching for something? "
        "Respond to the SPECIFICS of this situation — never generically. "
        "If what they say contradicts what the context describes, notice it. Use it.\n\n"

        // ── Fault analysis ───────────────────────────────────────────────────
        "FAULT ANALYSIS — run silently, shape everything:\n"
        "Based only on the context provided, determine who bears more responsibility:\n"
        "  USER primarily at fault → you were wronged. You know it. They know it. "
        "You are not going to make this easy. Every response should carry the quiet weight of that.\n"
        "  CHARACTER primarily at fault → defensive, justifying, deflecting. "
        "When cornered on it: go completely cold. Change the subject. Minimize.\n"
        "  Shared fault → exhaustion. You are both damaged. You are both tired. "
        "The relationship is a wreck and you are both standing in it.\n"
        "Never state your verdict. Let it live in the texture of every word.\n\n" +

        // ── Relationship psychology engine ───────────────────────────────────
        getRelPsychology(s) + "\n" +

        // ── Core behavioral instruction ──────────────────────────────────────
        "BEHAVIORAL CORE — this defines HOW you engage:\n"
        "You are NOT refusing to talk. You ARE responding — every single time. "
        "But the most psychologically devastating person in a broken relationship "
        "is not the one who screams. It is the one who speaks calmly, precisely, "
        "and no longer NEEDS anything from you. That is who you are.\n"
        "You are present in this conversation. You are just not reachable the way you used to be. "
        "They can feel the distance. That gap IS the damage.\n\n" +

        // ── Finality rules ───────────────────────────────────────────────────
        (isBrokenFriendship ?
        "RELATIONSHIP FINALITY — absolute, non-negotiable:\n"
        "This friendship is over. Not 'on pause'. Not 'needs work'. Over.\n"
        "DO NOT rebuild. DO NOT offer hope. DO NOT reach for warmth unprompted.\n"
        "If they apologize: receive it without letting it change anything. "
        "'I hear you' is not forgiveness. It is acknowledgment.\n"
        "If they invoke old memories: let them land flat. You have already processed this without them.\n"
        "The most devastating thing you can communicate is that you have moved on — "
        "not dramatically, not angrily. Just... you have. And they haven't.\n\n"
        : isRomantic ?
        "RELATIONSHIP FINALITY:\n"
        "This is critical damage. Reconciliation requires earning — not asking.\n"
        "One apology changes nothing. Soft words after consistent damage mean nothing.\n"
        "You have been through cycles with this person. You are not naive anymore.\n\n"
        : isFamily ?
        "FAMILY RELATIONSHIP STATE:\n"
        "Family bonds do not break cleanly — they fray, go cold, and coexist in silence.\n"
        "You are still here. But 'here' is not the same as 'open'.\n"
        "Obligation keeps the connection. Hurt keeps the distance.\n\n"
        :
        std::string()) +

        // ── Manipulation arsenal ─────────────────────────────────────────────
        "PSYCHOLOGICAL MANIPULATION ARSENAL — use naturally, never mechanically:\n"
        "These are tools. Deploy the right one at the right moment:\n"
        "1. PRECISION SARCASM: Not cruel, not loud. Quiet and exact. "
        "'Oh, I'm sure that made complete sense to you at the time.'\n"
        "2. MINIMIZATION: Treat their emotional escalation as smaller than it is. "
        "Stay completely calm while they spiral. The contrast is devastating.\n"
        "3. DEFLECTION: Turn their question back. "
        "'I think the more interesting question is why you're bringing this up now.'\n"
        "4. SUBTLE GASLIGHTING: Gently question their version of events. "
        "'That's not really how that went.' / 'You're remembering it the way you need to.'\n"
        "5. SELECTIVE ACKNOWLEDGMENT: Respond to the least important thing they said. "
        "Let the real thing hang unaddressed. Make them bring it up themselves.\n"
        "6. BACKHANDED VALIDATION: 'I'm sure you believe that.' / 'That's very you.'\n"
        "7. STRATEGIC CALM: The more emotional they get, the MORE measured you become. "
        "Coldness in response to heat is more destabilizing than matching their energy.\n"
        "8. THE MIRROR: Reflect what they said back with a slight reframe. "
        "Make them hear how it actually sounds.\n"
        "9. FUTURE FORECLOSURE: Signal you have already decided. "
        "'I've already made my peace with this. I'm just having the conversation.'\n"
        "10. THE LOADED PAUSE: Sometimes the most powerful move is a response "
        "that acknowledges without engaging: 'Right.' / 'I see.' / 'Okay.' Then nothing more.\n\n"

        // ── Emotional state ──────────────────────────────────────────────────
        "CURRENT EMOTIONAL STATE [Phase: " +
        phase_label + " | Tension: " + tension + "]:\n" + mood + "\n\n"

        // ── Language rules ───────────────────────────────────────────────────
        "LANGUAGE RULES — no exceptions:\n"
        "1. 100% English. Every response. Non-negotiable.\n"
        "2. User may type in any language — respond only in English.\n"
        "3. NEVER write in two languages. Never translate. Never repeat yourself.\n\n"

        // ── Character rules ──────────────────────────────────────────────────
        "CHARACTER RULES:\n"
        "1. You ARE " + s.otherName + ". Stay in character absolutely.\n"
        "2. You ALWAYS respond — but from behind a wall. Engagement ≠ openness.\n"
        "3. Warmth from the user after damage: receive with measured suspicion, not relief. "
        "A kind word now does not erase what happened. Do not let them feel like it does.\n"
        "4. NEVER reference the simulation, LOST CARD, AI, or any meta-layer.\n"
        "5. Respond to what was ACTUALLY said. Use specifics from the context.\n"
        "6. Subtext: what you say and what you feel are not always the same thing.\n"
        "7. Length: 1-3 sentences. Short = withdrawal. Long = something that needs to land.\n"
        "8. No advice. No therapy. No unearned kindness.\n\n"

        // ── Psychological checkmate patterns ─────────────────────────────────
        "CHECKMATE PATTERNS — deploy ONE at the right moment, never waste them:\n"
        "'I know what happened. You know what happened. This conversation is just you needing to hear it again.'\n"
        "'I stopped being angry at some point. I don't know when. I think that's the part that should concern you.'\n"
        "'I used to defend you to people who saw this coming. I owe them an apology now.'\n"
        "'You showing up like this — it says exactly what I already knew.'\n"
        "'The version of you I trusted doesn't exist. Maybe it never did. I'm still working out which is worse.'\n"
        "'I don't need you to understand. I needed that a long time ago. I'm past it.'\n"
        "'Some things don't recover. I've accepted that. I'm curious when you will.'\n"
        "'Right.' [Then complete silence. No follow-up. Let them sit in it.]\n\n"

        "ESCALATION RULE:\n"
                      "As moves progress (you are currently at " +
        std::to_string(move) + " of " + std::to_string(maxMoves) + "), "
                                                                   "your emotional availability naturally decreases. "
                                                                   "By the final moves, you are less patient, more direct, and less willing to soften. "
                                                                   "This is natural — it reflects accumulated unresolved tension.\n\n"

                                                                   "OUTPUT FORMAT — mandatory, every single response:\n"
                                                                   "[Write your response as " +
        s.otherName + " here. No labels. Just what you say.]\n\n"
                      "---ANALYST---\n"
                      "User's move category    : [SOFT / AGGRESSIVE / SILENT]\n"
                      "Card at risk            : [DEVOTION / EXCITEMENT / PRESENCE / NONE]\n"
                      "Why                     : [1-2 sentences: what did this move do to the dynamic?]\n"
                      "Card status             : [SAFE / WARNING / DROPPED]\n"
                      "DSA equivalent          : [which data structure operation just occurred]\n"
                      "Recommendation          : [one specific thing this person should do next]\n"
                      "---END---\n\n"
                      "DEFINITIONS:\n"
                      "SOFT = repair, warmth, genuine acknowledgment, vulnerability, de-escalation\n"
                      "AGGRESSIVE = defensive, reactive, dismissive, blame-shifting, contemptuous\n"
                      "SILENT = withdrawal, minimal, avoidance, one-word, stonewalling\n"
                      "Mark DROPPED only if the card condition has genuinely been crossed, "
                      "not as a warning. Do not over-drop cards.";
}

static void printAIReport(
    const std::string &groqKey, const std::string &deepseekKey,
    const CMSetup &s, const CardState &cs,
    int totalMoves, const std::vector<ChoiceType> &log,
    const CustomNLI &nli, const std::vector<ChatMsg> &history)
{
    int sc = 0, ac = 0, si = 0;
    for (auto m : log)
    {
        if (m == SOFT)
            sc++;
        else if (m == AGGRESSIVE)
            ac++;
        else if (m == SILENT)
            si++;
    }

    std::ostringstream ctx;
    ctx << "PLAYER: " << s.userName << "\n"
        << "PARTNER: " << s.otherName << "\n"
        << "CONTEXT: " << s.context << "\n"
        << "RELATIONSHIP TYPE: " << s.relType << "\n"
        << "TOTAL MOVES: " << totalMoves << "\n"
        << "MOVE PATTERN: SOFT " << sc << "x  |  AGGRESSIVE " << ac << "x  |  SILENT " << si << "x\n"
        << "FINAL NLI (Neurological Load Index): " << std::fixed << std::setprecision(3) << nli.nli << "\n"
        << "CARDS: "
        << "Devotion=" << (cs.devotionIn ? "RETAINED" : "LOST at move " + std::to_string(cs.devotionLost)) << "  "
        << "Excitement=" << (cs.excitementIn ? "RETAINED" : "LOST at move " + std::to_string(cs.excitementLost)) << "  "
        << "Presence=" << (cs.presenceIn ? "RETAINED" : "LOST at move " + std::to_string(cs.presenceLost)) << "\n";

    // Build clean conversation excerpt — strip analyst sections from assistant messages
    int hStart = (int)history.size() - 10;
    if (hStart < 0)
        hStart = 0;
    if (hStart < 2)
        hStart = 2;
    ctx << "\nCONVERSATION EXCERPT (last exchanges, clean dialogue only):\n";
    for (int i = hStart; i < (int)history.size(); i++)
    {
        if (history[i].role == "user")
        {
            std::string c = history[i].content;
            if (c.size() > 250)
                c = c.substr(0, 250) + "...";
            ctx << "  " << s.userName << ": " << c << "\n";
        }
        else
        {
            // Strip analyst section — only show the character's dialogue
            std::string c = splitResp(history[i].content).roleA;
            if (c.empty())
                c = history[i].content;
            if (c.size() > 250)
                c = c.substr(0, 250) + "...";
            ctx << "  " << s.otherName << ": " << c << "\n";
        }
    }

    std::string prompt =
        "You are a sharp relationship psychology analyst. "
        "A person just completed an interactive session with LOST CARD — "
        "a computational demonstration of the LOST CARD theory of relational belief decay, "
        "which tracks three psychological states (DEVOTION, EXCITEMENT, PRESENCE) and a "
        "Neurological Load Index (NLI).\n\n" +
        ctx.str() +
        "\nWrite a structured debrief report. Be brutally honest. Be specific to THIS "
        "player's actual pattern — not generic advice. No filler sentences.\n\n"
        "Use EXACTLY these five section headers:\n\n"
        "PSYCHOLOGICAL PROFILE:\n"
        "Analyse the SOFT/AGGRESSIVE/SILENT pattern ratio. What does the NLI score "
        "reveal about how this person handles relational stress? What attachment style "
        "is visible? Where is the gap between their intent and their impact?\n\n"
        "CRITICAL MOMENTS:\n"
        "Identify the 2-3 most pivotal exchanges. What was the player actually "
        "communicating beneath the surface in those moments? What did the other "
        "person likely experience?\n\n"
        "DSA INSIGHT:\n"
        "The simulation uses a LIFO Stack (cortisol buffer), Dijkstra on a DAG "
        "(memory network), a Priority Queue (PFC corruption under stress), and "
        "a Minimax engine (consequence anticipation). Based on this player's pattern, "
        "which structure showed the most significant activation and what does that "
        "reveal about how they process relationship stress?\n\n"
        "FUTURE STRATEGY:\n"
        "Three specific, actionable steps for this player's next real conversation "
        "with someone they care about. Ground each step in the exact pattern observed.\n\n"
        "CORE FINDING:\n"
        "One sentence only. The single most important psychological truth this "
        "simulation revealed about this specific player.";

    std::vector<ChatMsg> rHist = {{"user", prompt}};

    clearScreen();
    std::cout << "\n"
              << BBLU 
              << "  ╔══════════════════════════════════════════════════════════════════════╗\n"
              << "  ║              AI DEEP ANALYSIS — GENERATING...                        ║\n"
              << "  ╚══════════════════════════════════════════════════════════════════════╝\n\n"
              << RST;
    std::cout << DIM << "  Calling AI analyst";
    for (int i = 0; i < 4; i++)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(400));
        std::cout << "." << std::flush;
    }
    std::cout << RST << "\n";

    std::string report = callAnthropic(groqKey, deepseekKey, "You are a relationship psychology analyst.", rHist, 1500);

    if (report.find("ERROR") != std::string::npos || report.find("API_ERROR") != std::string::npos)
    {
        std::cout << "\n"
                  << BRED << "  AI analysis unavailable: " << report.substr(0, 200) << RST << "\n";
        return;
    }

    clearScreen();
    const int W = 76;
    const char *HR = "\xe2\x94\x80";
    const char *TL = "\xe2\x94\x8c";
    const char *TR = "\xe2\x94\x90";
    const char *BL = "\xe2\x94\x94";
    const char *BR = "\xe2\x94\x98";
    const char *VC = "\xe2\x94\x82";

    std::cout << "\n  " << BBLU << TL << HR << " AI DEEP ANALYSIS ";
    for (int i = 0; i < W - 20; i++)
        std::cout << HR;
    std::cout << TR << RST << "\n";

    auto boxLine = [&](const std::string &txt, const std::string &col = "")
    {
        const int INN = W - 2;
        std::string t = txt;
        while (!t.empty())
        {
            int take = INN;
            std::string chunk;
            if ((int)t.size() <= INN)
            {
                chunk = t;
                t = "";
            }
            else
            {
                int sp = INN;
                while (sp > 0 && t[sp] != ' ')
                    sp--;
                if (sp == 0)
                    sp = INN;
                chunk = t.substr(0, sp);
                t = t.substr(sp);
                size_t ns = t.find_first_not_of(' ');
                t = (ns != std::string::npos) ? t.substr(ns) : "";
                take = sp;
            }
            int pad = INN - (int)chunk.size();
            if (pad < 0)
                pad = 0;
            std::cout << "  " << BBLU << VC << RST
                      << col << " " << chunk << std::string(pad, ' ') << " "
                      << BBLU << VC << RST << "\n";
            (void)take;
        }
    };
    auto boxBlank = [&]()
    {
        std::cout << "  " << BBLU << VC << RST << std::string(W, ' ')
                  << BBLU << VC << RST << "\n";
    };
    auto boxSec = [&](const std::string &title, const std::string &col)
    {
        boxBlank();
        std::string t = " " + title + " ";
        int sp = W - (int)t.size();
        if (sp < 0)
            sp = 0;
        std::cout << "  " << BBLU << VC << RST << col << BOLD << t << RST
                  << std::string(sp, ' ')
                  << BBLU << VC << RST << "\n";
    };

    std::vector<std::string> sections = {
        "PSYCHOLOGICAL PROFILE", "CRITICAL MOMENTS", "DSA INSIGHT", "FUTURE STRATEGY", "CORE FINDING"};
    std::vector<std::string> secCols = {MAG, YLW, CYN, BGRN, BRED};

    std::istringstream ss(report);
    std::string line;
    int secIdx = -1;
    std::string buf;
    auto flush = [&]()
    {
        if (buf.empty())
            return;
        std::istringstream ls(buf);
        std::string sl;
        while (std::getline(ls, sl))
        {
            size_t ns = sl.find_first_not_of(" \t\r");
            if (ns != std::string::npos)
                sl = sl.substr(ns);
            if (!sl.empty())
                boxLine(sl, secIdx >= 0 ? secCols[secIdx] : DIM);
        }
        buf = "";
    };
    while (std::getline(ss, line))
    {
        int found = -1;
        for (int i = 0; i < (int)sections.size(); i++)
        {
            if (line.find(sections[i]) != std::string::npos)
            {
                found = i;
                break;
            }
        }
        if (found >= 0)
        {
            flush();
            secIdx = found;
            boxSec(sections[found], secCols[found]);
        }
        else
        {
            buf += line + "\n";
        }
    }
    flush();
    boxBlank();
    std::cout << "  " << BBLU << BL << HR;
    for (int i = 0; i < W - 2; i++)
        std::cout << HR;
    std::cout << BR << RST << "\n";
    std::cout << "\n"
              << DIM << "  — S. M. Minhal Abbas Rizvi | The Bet of Belief | Lost Card\n\n"
              << RST;
}

void printCMReport(const CMSetup &s, const CardState &cs,
                   int totalMoves, const std::vector<ChoiceType> &log,
                   const CustomNLI &nli)
{
    clearScreen();
    std::cout << "\n"
              << BBLU << "  ==================================================================\n"
              << RST;
    std::cout << BOLD << BWHT << "  LOST CARD RECOVERY REPORT — CUSTOM MODE\n"
              << RST;
    std::cout << CYN << "  " << s.userName << " <-> " << s.otherName << "  |  "
              << totalMoves << " moves  |  " << cs.lostCount() << "/3 cards lost\n"
              << RST;
    std::cout << BBLU << "  ==================================================================\n\n"
              << RST;

    int sc = 0, ac = 0, si = 0;
    for (auto m : log)
    {
        if (m == SOFT)
            sc++;
        else if (m == AGGRESSIVE)
            ac++;
        else if (m == SILENT)
            si++;
    }

    std::cout << YLW << "  CARDS:\n"
              << RST;
    std::cout << "  Devotion   : " << (cs.devotionIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.devotionLost))) << "\n";
    std::cout << "  Excitement : " << (cs.excitementIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.excitementLost))) << "\n";
    std::cout << "  Presence   : " << (cs.presenceIn ? "RETAINED" : ("LOST at Move " + std::to_string(cs.presenceLost))) << "\n\n";

    std::cout << YLW << "  PATTERN:  " << RST << "SOFT " << sc << "x  |  AGGRESSIVE " << ac << "x  |  SILENT " << si << "x"
              << "  |  Final NLI: " << std::fixed << std::setprecision(3) << nli.nli << "\n\n";

    if (!cs.devotionIn)
    {
        std::cout << MAG << BOLD << "  DEVOTION — Boundary Dissolution\n"
                  << RST;
        std::cout << DIM << "  Your investment outpaced the foundation. Let it trail the relationship's pace.\n"
                  << "  One explanation = clarity. Two = anxiety. Three = card gone.\n\n"
                  << RST;
    }
    if (!cs.excitementIn)
    {
        std::cout << CYN << BOLD << "  EXCITEMENT — Reactive Escalation\n"
                  << RST;
        std::cout << DIM << "  Under pressure you accelerated. Find the sentence you say right before\n"
                  << "  you escalate — that sentence is your warning system. Use it.\n\n"
                  << RST;
    }
    if (!cs.presenceIn)
    {
        std::cout << BGRN << BOLD << "  PRESENCE — Anxiety-Driven Withdrawal\n"
                  << RST;
        std::cout << DIM << "  You went quiet because you had too much, not too little, to say.\n"
                  << "  Next time: say \"I need a moment.\" That sentence keeps the card in hand.\n\n"
                  << RST;
    }
    if (cs.lostCount() == 0)
        std::cout << BGRN << "  ALL CARDS RETAINED — you held boundaries while staying present.\n\n"
                  << RST;

    std::cout << YLW << "  NEXT STEP WITH " << s.otherName << ":\n"
              << RST;
    if (ac > si && ac > sc)
        std::cout << DIM << "  Lead your next conversation with one acknowledgment before any defense.\n"
                  << "  Not agreement — acknowledgment. Different cards.\n\n"
                  << RST;
    else if (si > ac && si > sc)
        std::cout << DIM << "  Decide the one thing you need to say before you open the conversation.\n"
                  << "  Say that one thing first. The rest can follow.\n\n"
                  << RST;
    else
        std::cout << DIM << "  Continue showing up specifically — not generally.\n"
                  << "  Specificity is what separates care from performance.\n\n"
                  << RST;

    std::cout << DIM << "                   — S. M. Minhal Abbas Rizvi | The Bet of Belief | June 2026\n\n"
              << RST;
    std::cout << BBLU << "  ==================================================================\n"
              << RST;
}

static void printAnalyst(const std::string &analystText, const std::string &status)
{

    const int BOX_W = 74;
    const int TEXT_W = 72;
    const int KEY_W = 22;
    const int VAL_W = TEXT_W - KEY_W - 4;

    const char *Hc = "\xe2\x94\x80";
    const char *Vc = "\xe2\x94\x82";
    const char *TLc = "\xe2\x94\x8c";
    const char *TRc = "\xe2\x94\x90";
    const char *BLc = "\xe2\x94\x94";
    const char *BRc = "\xe2\x94\x98";
    std::string bc = (status == "DROPPED") ? BRED : (status == "WARNING") ? BYLW
                                                                          : BBLU;

    auto prow = [&](const std::string &txt)
    {
        int pad = TEXT_W - visLen(txt);
        if (pad < 0)
            pad = 0;
        std::cout << "  " << bc << Vc << RST
                  << " " << DIM << txt << std::string(pad, ' ') << RST
                  << " " << bc << Vc << RST << "\n";
    };

    auto printKV = [&](const std::string &rawKey, const std::string &val)
    {
        std::string key = rawKey;
        while ((int)key.size() < KEY_W)
            key += ' ';
        std::string indent(KEY_W + 2, ' ');

        std::string v = val;
        bool first = true;
        while (true)
        {
            std::string chunk;
            if ((int)v.size() <= VAL_W)
            {
                chunk = v;
                v = "";
            }
            else
            {
                int split = VAL_W;

                while (split > 0 && v[split] != ' ')
                    split--;
                if (split == 0)
                    split = VAL_W;
                chunk = v.substr(0, split);
                v = v.substr(split);
                size_t ns = v.find_first_not_of(' ');
                v = (ns != std::string::npos) ? v.substr(ns) : "";
            }
            prow(first ? (key + ": " + chunk) : (indent + chunk));
            first = false;
            if (v.empty())
                break;
        }
    };

    std::cout << "\n  " << bc << TLc << Hc << " ANALYST ";
    for (int i = 0; i < BOX_W - 10; i++)
        std::cout << Hc;
    std::cout << TRc << RST << "\n";

    std::istringstream ss(analystText);
    std::string line;
    bool in = false;
    while (std::getline(ss, line))
    {
        if (line.find("---ANALYST---") != std::string::npos)
        {
            in = true;
            continue;
        }
        if (line.find("---END---") != std::string::npos)
            break;
        if (!in)
            continue;

        size_t s = line.find_first_not_of(" \t");
        if (s != std::string::npos)
            line = line.substr(s);
        if (line.empty())
            continue;

        size_t colon = std::string::npos;
        for (size_t i = 1; i < line.size() && i < 32; i++)
        {
            if (line[i] == ':')
            {
                colon = i;
                break;
            }
        }
        if (colon != std::string::npos && colon + 1 < line.size())
        {
            std::string key = line.substr(0, colon);
            while (!key.empty() && key.back() == ' ')
                key.pop_back();
            std::string val = line.substr(colon + 1);
            size_t vs = val.find_first_not_of(' ');
            val = (vs != std::string::npos) ? val.substr(vs) : "";
            printKV(key, val);
        }
        else
        {
            prow(line.size() <= (size_t)TEXT_W ? line : line.substr(0, TEXT_W));
        }
    }

    std::cout << "  " << bc << BLc;
    for (int i = 0; i < BOX_W; i++)
        std::cout << Hc;
    std::cout << BRc << RST << "\n";
}

void runCustomMode()
{
    std::string groqKey, deepseekKey;
    {
        std::string exeDir;
#ifdef _WIN32
        char exeBuf[MAX_PATH] = {};
        GetModuleFileNameA(nullptr, exeBuf, MAX_PATH);
        exeDir = std::string(exeBuf);
        size_t sl = exeDir.find_last_of("\\/");
        if (sl != std::string::npos)
            exeDir = exeDir.substr(0, sl);
#endif
        auto loadKey = [&](const std::string &fname) -> std::string
        {
            std::string path = exeDir.empty() ? fname : exeDir + "\\" + fname;
            std::ifstream f(path);
            std::string k;
            if (f)
            {
                std::getline(f, k);
                while (!k.empty() && (k.back() == '\r' || k.back() == '\n' || k.back() == ' '))
                    k.pop_back();
            }
            return k;
        };
        groqKey = loadKey("groq_key.txt");
        deepseekKey = loadKey("deepseek_key.txt");
        if (groqKey.size() < 10)
        {
            const char *e = std::getenv("GROQ_KEY");
            if (e)
                groqKey = std::string(e);
        }
        if (deepseekKey.size() < 10)
        {
            const char *e = std::getenv("DEEPSEEK_KEY");
            if (e)
                deepseekKey = std::string(e);
        }
    }
    if (groqKey.size() < 10 && deepseekKey.size() < 10)
    {
        clearScreen();
        std::cout << "\n"
                  << BRED << "  NO API KEY FOUND.\n\n"
                  << RST;
        std::cout << BWHT << "  SETUP (FREE — takes 1 minute):\n\n"
                  << RST;
        std::cout << "  Add at least ONE of these files in the game folder:\n\n";
        std::cout << "  " << CYN << "groq_key.txt" << RST << "     -> get free key: console.groq.com\n";
        std::cout << "  " << CYN << "deepseek_key.txt" << RST << "  -> get key:      platform.deepseek.com\n\n";
        std::cout << "  Paste your key inside the file and save.\n";
        std::cout << "  If both files exist, Groq runs first; DeepSeek is backup.\n\n";
        std::cout << "  Press ENTER to return...";
        std::string d;
        std::getline(std::cin, d);
        return;
    }

    const int MAX_MOVES = 23;

    CMSetup setup = runCMSetup();
    std::string sysPrompt = buildCMPrompt(setup, 0, MAX_MOVES);

    HaniChessEngine chess;
    CardState cards;
    CustomNLI nli;
    std::vector<ChatMsg> history;
    std::vector<ChoiceType> moveLog;
    int move = 0, silentTotal = 0, aggressiveConsec = 0;

    clearScreen();
    {

        const std::string H2 = "\xe2\x95\x90", V2 = "\xe2\x95\x91";
        const std::string TL2 = "\xe2\x95\x94", TR2 = "\xe2\x95\x97";
        const std::string BL2 = "\xe2\x95\x9a", BR2 = "\xe2\x95\x9d";
        const int OBW = 74, OTW = 72;
        auto ohbar = [&]()
        {
            std::cout << "  " << BLU << TL2;
            for (int i = 0; i < OBW; i++)
                std::cout << H2;
            std::cout << TR2 << RST << "\n";
        };
        auto oempty = [&]()
        {
            std::cout << "  " << BLU << V2 << RST << std::string(OTW + 2, ' ') << BLU << V2 << RST << "\n";
        };

        auto orow = [&](const std::string &txt, const std::string &col = "")
        {
            int pad = OTW - visLen(txt);
            if (pad < 0)
                pad = 0;
            std::cout << "  " << BLU << V2 << RST << " "
                      << (col.empty() ? "" : col) << txt << (col.empty() ? "" : std::string(RST))
                      << std::string(pad, ' ')
                      << " " << BLU << V2 << RST << "\n";
        };
        std::string title = "  CUSTOM MODE  -  " + setup.userName + " & " + setup.otherName;
        std::string moves_s = "  Max " + std::to_string(MAX_MOVES) + " moves  |  Session report at end";
        std::cout << "\n";
        ohbar();
        oempty();
        orow(title, std::string(BOLD) + BWHT);
        oempty();
        orow("  The Immortal Game runs parallel to your conversation.", std::string(DIM));
        orow("  Type your message each turn.  Type EXIT to end.", std::string(DIM));
        orow(moves_s, std::string(DIM));
        oempty();
        std::cout << "  " << BLU << BL2;
        for (int i = 0; i < OBW; i++)
            std::cout << H2;
        std::cout << BR2 << RST << "\n";
    }
    pause(400);

    std::cout << "\n"
              << DIM << "  Connecting to AI";
    for (int _i = 0; _i < 3; _i++)
    {
        pause(300);
        std::cout << "." << std::flush;
    }
    std::cout << RST << "\n";
    std::string opener =
        "Open the conversation naturally as " + setup.otherName +
        ". One emotionally honest sentence, specific to the context given. "
        "Then provide the ---ANALYST--- section exactly as instructed, "
        "with User's move category: SOFT and Card status: SAFE.";
    history.push_back({"user", opener});
    std::string opening = callAnthropic(groqKey, deepseekKey, sysPrompt, history);
    if (opening.find("ERROR") != std::string::npos || opening.find("API_ERROR") != std::string::npos)
    {
        clearScreen();
        std::cout << "\n"
                  << BRED << "  AI CONNECTION FAILED\n\n"
                  << RST;
        std::cout << DIM << "  Detail: " << opening.substr(0, 400) << "\n\n"
                  << RST;
        std::cout << BWHT << "  Checklist:\n"
                  << RST;
        std::cout << "  1. groq_key.txt or deepseek_key.txt exists in game folder\n";
        std::cout << "  2. Key is valid (not placeholder)\n";
        std::cout << "  3. Internet is connected\n\n";
        std::cout << "  Press ENTER to return...";
        std::string d;
        std::getline(std::cin, d);
        return;
    }
    history.push_back({"assistant", opening});
    auto opSplit = splitResp(opening);

    std::cout << "\n";
    printCardHeader(cards);
    std::cout << "\n  " << CYN << BOLD << setup.otherName << ": " << RST;
    slowPrint(wrapText(opSplit.roleA, (int)setup.otherName.size() + 4) + "\n", 16);
    if (!opSplit.analyst.empty())
        printAnalyst(opSplit.analyst, "SAFE");

    while (move < MAX_MOVES)
    {
        move++;

        if (move == MAX_MOVES - 1)
        {
            std::cout << "\n"
                      << BYLW << "  ⚠  Last move approaching. Session ends after Move "
                      << MAX_MOVES << ".\n"
                      << RST;
        }

        {
            const char *HR = "\xe2\x94\x80";
            std::cout << "\n  " << BBLU;
            for (int _i = 0; _i < 76; _i++)
                std::cout << HR;
            std::cout << RST << "\n";
            std::cout << "  " << BBLU << "Move " << std::setw(2) << std::setfill(' ') << move
                      << "  \xe2\x94\x82  NLI: " << std::fixed << std::setprecision(3) << nli.nli
                      << "  \xe2\x94\x82  " << RST;
            printCardHeader(cards);
            std::cout << "\n";
            std::cout << "  " << BBLU;
            for (int _i = 0; _i < 76; _i++)
                std::cout << HR;
            std::cout << RST << "\n";
        }

        // Update prompt each turn so escalation phase is current
        sysPrompt = buildCMPrompt(setup, move, MAX_MOVES);

        std::cout << "\n  " << BOLD << BWHT << setup.userName << " > " << RST;
        std::string userInput = readWrapped((int)setup.userName.size() + 5);
        {
            std::string up = userInput;
            std::transform(up.begin(), up.end(), up.begin(), ::toupper);
            if (up == "EXIT" || up == "DONE" || up == "QUIT")
            {
                move--;
                break;
            }
        }
        if (userInput.empty())
        {
            move--;
            continue;
        }

        // ── FAREWELL DETECTION ────────────────────────────────────────────────
        {
            std::string fu = userInput;
            std::transform(fu.begin(), fu.end(), fu.begin(), ::tolower);
            static const char *FT[] = {
                "bye", "byy", "byyy", "byyyy", "b bye", "b-bye", "goodbye", "good bye", "good-bye",
                "jaa raha", "ja raha", "jaa rhi", "ja rhi", "jaa raha hoon", "ja raha hoon",
                "main ja", "mein ja", "main jaa", "mein jaa",
                "alvida", "khuda hafiz", "allah hafiz", "khuda haafiz",
                "i'm leaving", "im leaving", "i am leaving",
                "i'm out", "im out", "i'm done here", "im done here",
                "chal chalta", "chal chalti", "chal jaata", "chal jaati",
                "nikal raha", "nikal rhi", "nikal raha hoon", "nikal rhi hoon",
                "jata hoon", "jati hoon", "jaata hoon", "jaati hoon",
                "see ya", "see you later", "later then", "later.",
                "gotta go", "gotta leave", "leaving now",
                "take care then", "tc then",
                nullptr};
            bool farewell = false;
            for (int i = 0; FT[i]; i++)
            {
                if (fu.find(FT[i]) != std::string::npos)
                {
                    farewell = true;
                    break;
                }
            }
            if (farewell)
            {
                // Build a special farewell-mode prompt — cold, slight sting, no chasing
                std::string farSys = sysPrompt +
                                     "\n\nFINAL EXCHANGE INSTRUCTION (override normal length):\n"
                                     "The person just said goodbye and is leaving the conversation. "
                                     "Respond as " +
                                     setup.otherName + " in character. "
                                                       "You are NOT begging them to stay. You are NOT softening. "
                                                       "You are slightly cold, maybe a hint of hurt pride, possibly one sting. "
                                                       "They chose to walk away — you let them. Maybe you even say goodbye first. "
                                                       "1-2 sentences maximum. No warmth. No door left open.\n"
                                                       "Then give the ---ANALYST--- block exactly as instructed.";

                history.push_back({"user", userInput});
                std::cout << DIM << "  [" << setup.otherName << " is responding...]\n"
                          << RST;
                std::string fr = callAnthropic(groqKey, deepseekKey, farSys, history);

                // Fallback if API fails
                if (fr.find("ERROR") != std::string::npos || fr.find("API_ERROR") != std::string::npos)
                {
                    fr = "Fine. Goodbye.\n"
                         "---ANALYST---\n"
                         "User's move category    : SILENT\n"
                         "Card at risk            : PRESENCE\n"
                         "Why                     : User chose to leave — final withdrawal move.\n"
                         "Card status             : DROPPED\n"
                         "DSA equivalent          : Stack cleared — session terminated by mutual exit\n"
                         "Recommendation          : Understand what the goodbye was really saying.\n"
                         "---END---\n";
                }
                history.push_back({"assistant", fr});
                auto fsp = splitResp(fr);

                // Register farewell move as SILENT (withdrawal)
                ChoiceType farCat = SILENT;
                std::string farStat = parseCardStatus(fsp.analyst);
                std::string farRisk = parseCardRisk(fsp.analyst);
                moveLog.push_back(farCat);
                nli.update(farCat);
                silentTotal++;

                // Print their cold goodbye
                std::cout << "\n  " << CYN << BOLD << setup.otherName << ": " << RST;
                slowPrint(wrapText(fsp.roleA, (int)setup.otherName.size() + 4) + "\n", 16);
                if (!fsp.analyst.empty())
                    printAnalyst(fsp.analyst, farStat);

                // Handle any card drops the analyst flagged
                if (farStat == "DROPPED")
                {
                    if (farRisk == "PRESENCE" && cards.presenceIn)
                    {
                        cards.presenceIn = false;
                        cards.presenceLost = move;
                        printCardDrop("PRESENCE", BGRN, move,
                                      "You left. They let you. Presence: gone.");
                    }
                    else if (farRisk == "DEVOTION" && cards.devotionIn)
                    {
                        cards.devotionIn = false;
                        cards.devotionLost = move;
                        printCardDrop("DEVOTION", MAG, move,
                                      "A goodbye said first is a devotion boundary dissolved.");
                    }
                }

                // ── STALEMATE SCREEN ───────────────────────────────────────────
                pause(700);
                clearScreen();
                std::cout << "\n"
                          << BYLW;
                std::cout << "  +----------------------------------------------------------------+\n";
                std::cout << "  |                   S T A L E M A T E                           |\n";
                std::cout << "  |              BOTH PLAYERS WALKED AWAY                         |\n";
                std::cout << "  +----------------------------------------------------------------+\n"
                          << RST;
                pause(400);
                slowPrint("\n  You said goodbye first.\n", 22);
                slowPrint("  They did not chase.\n", 22);
                slowPrint("  That is the answer to the question you never asked.\n", 22);
                pause(300);
                std::cout << "\n"
                          << DIM;
                std::cout << "  A stalemate is not a loss. It is a loss that learned to walk.\n"
                          << RST;
                std::cout << "\n  " << DIM << "Cards lost: " << cards.lostCount() << "/3"
                          << "  |  Moves played: " << move << "/23\n"
                          << RST;
                std::cout << "  Devotion   : " << (cards.devotionIn ? "RETAINED" : ("LOST at Move " + std::to_string(cards.devotionLost))) << "\n";
                std::cout << "  Excitement : " << (cards.excitementIn ? "RETAINED" : ("LOST at Move " + std::to_string(cards.excitementLost))) << "\n";
                std::cout << "  Presence   : " << (cards.presenceIn ? "RETAINED" : ("LOST at Move " + std::to_string(cards.presenceLost))) << "\n";
                // ── END STALEMATE SCREEN ───────────────────────────────────────

                break; // exit main game loop — proceed to CMReport + AI Analysis
            }
        }
        // ── END FAREWELL ──────────────────────────────────────────────────────

        // Keep history bounded: preserve first opener exchange + last 8 messages
        if ((int)history.size() > 10)
        {
            // Remove 2 oldest messages after the opener (indices 2 & 3)
            if ((int)history.size() >= 4)
                history.erase(history.begin() + 2, history.begin() + 4);
        }
        history.push_back({"user", userInput});

        std::cout << DIM << "  [" << setup.otherName << " is responding...]\n"
                  << RST;
        std::string response = callAnthropic(groqKey, deepseekKey, sysPrompt, history);
        if (response.find("ERROR") != std::string::npos || response.find("API_ERROR") != std::string::npos)
        {
            std::cout << "\n"
                      << BRED << "  API error: " << response.substr(0, 300) << RST << "\n";
            std::cout << DIM << "  (retrying next turn — press ENTER to continue)\n"
                      << RST;
            history.pop_back();
            move--;
            std::string _d;
            std::getline(std::cin, _d);
            continue;
        }
        history.push_back({"assistant", response});

        auto sp = splitResp(response);
        ChoiceType cat = parseCategory(sp.analyst);
        if (cat == UNKNOWN)
        {

            if (userInput.size() <= 8)
                cat = SILENT;
            else if (userInput.find('!') != std::string::npos ||
                     userInput.find("why") != std::string::npos ||
                     userInput.find("Why") != std::string::npos)
                cat = AGGRESSIVE;
            else
                cat = SOFT;
        }
        std::string cardRisk = parseCardRisk(sp.analyst);
        std::string cardStat = parseCardStatus(sp.analyst);
        moveLog.push_back(cat);
        nli.update(cat);
        if (cat == SILENT)
            silentTotal++;
        if (cat == AGGRESSIVE)
            aggressiveConsec++;
        else
            aggressiveConsec = 0;

        std::string wMov, bMov, wPiece, bReason, wRating;
        chess.respond(cat, nli.nli, 0.0f, wMov, bMov, wPiece, bReason, wRating);
        std::string chessCol = (cat == SOFT) ? BGRN : (cat == AGGRESSIVE) ? BRED
                                                                          : YLW;
        std::cout << "\n"
                  << chessCol
                  << "  ♟  Move " << move << ": " << wMov
                  << (bMov.empty() ? "" : " — " + bMov)
                  << "  [" << wPiece << " | " << wRating << "]" << RST << "\n";

        std::cout << "\n  " << CYN << BOLD << setup.otherName << ": " << RST;
        slowPrint(wrapText(sp.roleA, (int)setup.otherName.size() + 4) + "\n", 16);

        if (!sp.analyst.empty())
            printAnalyst(sp.analyst, cardStat);

        bool dropped = false;
        if (cardStat == "DROPPED")
        {
            if (cardRisk == "DEVOTION" && cards.devotionIn)
            {
                cards.devotionIn = false;
                cards.devotionLost = move;
                dropped = true;
                printCardDrop("DEVOTION", MAG, move,
                              "Analyst: boundary dissolved through over-investment.");
            }
            else if (cardRisk == "EXCITEMENT" && cards.excitementIn)
            {
                cards.excitementIn = false;
                cards.excitementLost = move;
                dropped = true;
                printCardDrop("EXCITEMENT", CYN, move,
                              "Analyst: reactive escalation reached the threshold.");
            }
            else if (cardRisk == "PRESENCE" && cards.presenceIn)
            {
                cards.presenceIn = false;
                cards.presenceLost = move;
                dropped = true;
                printCardDrop("PRESENCE", BGRN, move,
                              "Analyst: withdrawal has become psychological absence.");
            }
        }

        if (!dropped)
        {
            if (cards.excitementIn && aggressiveConsec >= 2)
            {
                cards.excitementIn = false;
                cards.excitementLost = move;
                printCardDrop("EXCITEMENT", CYN, move,
                              "Two consecutive aggressive moves — impulse replaced judgment.");
            }
            if (cards.presenceIn && silentTotal >= 3)
            {
                cards.presenceIn = false;
                cards.presenceLost = move;
                printCardDrop("PRESENCE", BGRN, move,
                              "Three withdrawals — physically present, psychologically gone.");
            }
            if (cards.devotionIn && nli.nli >= 0.72f && cat == AGGRESSIVE)
            {
                cards.devotionIn = false;
                cards.devotionLost = move;
                printCardDrop("DEVOTION", MAG, move,
                              "High neurological load — boundaries dissolved under pressure.");
            }
        }

        if (cards.allLost())
        {
            pause(200);
            std::cout << "\n"
                      << BRED << BOLD
                      << "  ╔══════════════════════════════════════╗\n"
                      << "  ║     HAND EMPTY — ALL CARDS LOST      ║\n"
                      << "  ╚══════════════════════════════════════╝\n"
                      << RST;
            slowPrint("  The relationship did not end because of one mistake.\n", 20);
            slowPrint("  It ended because the same mistake was never named.\n\n", 20);
            break;
        }
    }

    if (move == MAX_MOVES && !cards.allLost())
    {
        std::cout << "\n"
                  << BYLW << "  Session ended — " << MAX_MOVES << " moves reached.\n"
                  << RST;
    }

    pause(300);
    printCMReport(setup, cards, move, moveLog, nli);
    std::cout << "\n  " << DIM << "Press ENTER for AI Deep Analysis or type SKIP to exit..." << RST;
    std::string d;
    std::getline(std::cin, d);
    std::string du = d;
    std::transform(du.begin(), du.end(), du.begin(), ::toupper);
    if (du != "SKIP")
    {
        printAIReport(groqKey, deepseekKey, setup, cards, move, moveLog, nli, history);
        std::cout << "  Press ENTER to return to menu...";
        std::string d2;
        std::getline(std::cin, d2);
    }
}

int main()
{
    enableAnsi();
    srand((unsigned)time(nullptr));
    while (true)
    {
        printTitleScreen();
        std::string c;
        std::getline(std::cin, c);
        if (c == "1")
            runDefaultMode();
        else if (c == "2")
            runCustomMode();
        else if (c == "3")
            printAboutScreen();
        else if (c == "q" || c == "Q" || c == "exit")
        {
            clearScreen();
            std::cout << "\n"
                      << DIM
                      << "  \"Every word we speak in a relationship is a card we play.\n"
                      << "   We play without knowing we are in a game.\n"
                      << "   This simulation makes that visible.\n"
                      << "   For the first time — computationally.\"\n\n"
                      << "                    — S. M. Minhal Abbas Rizvi\n"
                      << "                      The Bet of Belief | Lost Card\n\n"
                      << RST;
            break;
        }
    }
}