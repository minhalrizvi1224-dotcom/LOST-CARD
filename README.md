# LOST CARD
### A Computational Model of Relational Belief Decay

**[Live Demo](https://lost-card.netlify.app)** · **[Theory: The Bet of Belief](#the-bet-of-belief)**

---

> *"Every word we speak in a relationship is a card we play. We play without knowing we are in a game."*

---

## What is LOST CARD?

LOST CARD is a simulation engine that models how relationships deteriorate — computationally. It maps human psychological states (cortisol accumulation, prefrontal cortex degradation, dopamine depletion) onto 7 concurrent data structures, all running simultaneously inside a single simulation loop.

It exists in two forms:
- **C++ terminal simulation** — 2,400+ lines, STL only, C++17, no external libraries
- **Web app** — Vanilla JS/HTML/CSS, AI-powered custom chat, real-time NLI tracking

This is not a psychology project with a coding theme. It is a psychology framework turned into a data structures implementation.

---

## The Bet of Belief

*An original framework by S. M. Minhal Abbas Rizvi — part of a larger work in progress (2028)*

The central claim: relationships follow computable rules. Every conversational move is classified by the nervous system — not by intention, but by neurological effect. You hold three cards:

| Card | Represents | Lost When |
|------|-----------|-----------|
| 💜 **DEVOTION** | Emotional investment | Calm-state aggression — habitual, not reactive |
| 💙 **EXCITEMENT** | Relational energy | Conflicts stack faster than they resolve |
| 💚 **PRESENCE** | Psychological availability | Repeated withdrawal — 3 silences total |

You don't lose cards in one fight. You lose them in patterns.

---

## 7 Data Structures — Psychology Mapping

| DSA Concept | Psychology Mapped | Key Mechanic | Complexity |
|-------------|------------------|--------------|------------|
| Weighted DAG + Dijkstra | Hippocampal Memory Network | Edge decay on AGGRESSIVE moves; Dijkstra finds exit path | O((V+E) log V) |
| LIFO Stack | Cortisol Accumulation | NLI-gated pop — repair fails if NLI ≥ 0.50 | O(1) |
| Min-Heap Priority Queue | PFC / Choice Corruption | At NLI ≥ 0.85, AGGRESSIVE surfaces first | O(log n) |
| Singly Linked List | Default Mode Network | Intentional memory leak — the data is never freed | O(1) insert |
| Hash Map | Sovereign Key / Identity | Protected segments behind identity keys | O(1) |
| Finite State Machine | Relationship Phase Transitions | HARMONY → FRACTURE → COLLAPSE → TERMINAL | O(1) |
| Minimax Algorithm | The Immortal Game (1851) | Position eval ≤ −7.5 = CHECKMATE | O(b^d) |

---

## The NLI Formula

```
NLI = (PFC × 0.4) + (Cortisol × 0.4) + (1 − Dopamine) × 0.2
```

| Range | State | Meaning |
|-------|-------|---------|
| < 0.30 | HARMONY | Rational mind online. Have the hard conversation here. |
| 0.30 – 0.70 | FRACTURE | Stressed. Words land harder than intended. |
| 0.70+ | COLLAPSE | Stop talking. Anything said now is from a flooded nervous system. |
| 0.85+ | AMYGDALA OVERRIDE | The rational brain is offline. Responses are no longer chosen. |

---

## Move Types

Every input is classified into one of three types:

- **SOFT** — Repair, acknowledgment, vulnerability → PFC↓ Cortisol↓ Dopamine↑
- **AGGRESSIVE** — Defensive, dismissive, escalatory → PFC↑↑ Cortisol↑↑ Dopamine↓
- **SILENT** — Withdrawal, minimal response → PFC↑ MirrorNeurons↓↓

---

## Features

- **Default Mode** — Scripted 23-move narrative (Umm-e-Laila & Hani)
- **Custom Chat Mode** — Enter a real relationship. AI plays the other person based on psychological profile
- **Real-time NLI tracking** — Live bars for PFC, Cortisol, Dopamine, Trust
- **Repair Window Indicator** — Shows when the cortisol stack can be cleared
- **Threshold Alerts** — System messages at NLI 0.60, 0.70, 0.85
- **Gottman Tone Classification** — Contempt, Defensiveness, Criticism, Stonewalling flagged
- **Pattern Interrupt** — Once-per-session move that breaks conflict patterns
- **Relational Archetype** — Post-session analysis assigns one of 7 archetypes
- **Health Score + Letter Grade** — Composite 0–100 score with verdict
- **Full Report Generation** — DSA report, Psychology report, Chess analysis, Move replay
- **Ghost Session** (Ex mode) — Typing indicator that disappears without reply
- **The Final Letter** — After collapse endings, AI character writes a closing letter
- **Relationship Autopsy Mode** — Reconstruct and analyze a real past conversation
- **The Theory Page** — In-app manifesto: The Bet of Belief

---

## Tech Stack

**C++ Simulation**
- C++17 · STL only · `#include<bits/stdc++.h>`
- No external libraries
- ANSI terminal UI · slowPrint typing effect · Windows ANSI support

**Web App**
- Vanilla JavaScript (ES2020) · HTML5 · CSS3
- No frameworks, no build tools
- Groq API (llama-3.3-70b-versatile) / DeepSeek API
- jsPDF for report generation
- PWA ready

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/minhalrizvi1224-dotcom/LOST-CARD.git

# Serve the web app
cd LOST-CARD
python -m http.server 8080

# Open in browser
# http://localhost:8080/web/
```

For the C++ terminal simulation:
```bash
# Compile
g++ -std=c++17 -O2 -o lostcard main.cpp

# Run
./lostcard
```

---

## Project Structure

```
LOST-CARD/
├── main.cpp          # C++17 terminal simulation (2,400+ lines)
├── web/
│   ├── index.html    # Single-page app
│   ├── app.js        # UI logic + AI integration (3,400+ lines)
│   ├── simulation.js # JS mirror of C++ engine
│   ├── auth.js       # Profile + theme
│   ├── style.css     # Full design system
│   └── sw.js         # Service worker
```

---

## Author

**S. M. Minhal Abbas Rizvi**
BSSE · Independent researcher in cognitive psychology & philosophy of mind (8+ years)
Writing: *The Bet of Belief* — a framework for belief reconstruction (2028)

LOST CARD is one theory from that book, turned into code.

**[Live App](https://lost-card.netlify.app)** · **[GitHub](https://github.com/minhalrizvi1224-dotcom/LOST-CARD)** · **[LinkedIn](https://www.linkedin.com/in/minhal-rizvi)**

---

*LOST CARD — June 2026*
