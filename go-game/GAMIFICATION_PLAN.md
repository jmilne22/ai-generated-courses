# Go Grind - Gamification Enhancement Plan

## Philosophy: Game First, Learning Second

The core principle: **Every piece of educational content should feel like unlocking an ability, discovering lore, or progressing through a narrative** — never like reading a textbook.

### Inspiration Sources
- **Persona 5**: Confidant system, social stats, calendar/time management, stylish UI
- **Melvor Idle**: Interconnected skill systems, passive progression, mastery XP

---

## Phase 1: Confidant System (Advanced Topics as Relationships)

### Concept
Each party member teaches a different advanced Go topic. Building your relationship unlocks abilities and content.

### Confidant Roster

| Confidant | Arcana | Topic Domain | Abilities Unlocked |
|-----------|--------|--------------|-------------------|
| **Morgana** | Magician | Go Idioms & Best Practices | "Code Review" hints, style tips appear contextually |
| **Ryuji** | Chariot | Brute Force → Optimization | Two Pointers, Sliding Window challenges |
| **Ann** | Lovers | Strings & Parsing | Unicode/rune challenges, regex patterns |
| **Yusuke** | Emperor | Clean Code & Design Patterns | Factory, Options, Strategy pattern challenges |
| **Makoto** | Priestess | Testing & Error Handling | Test-writing challenges, error type design |
| **Futaba** | Hermit | Concurrency & Performance | Goroutines, channels, benchmarking |
| **Haru** | Empress | APIs & Real-World Integration | HTTP handlers, JSON, external services |

### Progression Mechanics

```
CONFIDANT RANK PROGRESSION (1-10)

Rank 1-3: Introduction
- Unlock basic challenges for that topic
- Receive "Intel" (educational content as discovered lore)
- Hints from this confidant appear in related exercises

Rank 4-6: Development
- Unlock intermediate challenges
- Gain passive bonuses (e.g., Makoto rank 5: +10% XP on error handling exercises)
- New hint types unlock (e.g., Futaba: "Performance Analysis" hints)

Rank 7-9: Mastery
- Unlock advanced/boss challenges
- Confidant-specific "Showtime" attacks (special combo challenges)
- Ability modifiers (e.g., Ryuji rank 8: optimization hints auto-reveal after 2 min)

Rank 10: MAX
- Unlock ultimate challenge (equivalent to unlocking ultimate Persona)
- Permanent passive bonus
- "Third Eye" ability: see optimal solution approach before starting
```

### How to Rank Up

1. **Spend Time** - Complete challenges in their domain
2. **Give Gifts** - Use "Code Samples" (found during exercises) that match their interests
3. **Story Events** - Automatic ranks at certain player levels
4. **Special Requests** - Complete specific challenges they ask for

---

## Phase 2: Palace Infiltration Mode

### Concept
Transform skill clusters into time-limited dungeon runs with roguelike elements.

### Structure

```
PALACE INFILTRATION

Entry Requirements:
- Palace unlocks at 50% skill cluster completion
- Infiltration available once per day (or spend "SP" to retry)

Dungeon Structure:
├── Floor 1-3: Warmup rooms (easy challenges)
├── Floor 4-6: Shadow encounters (medium challenges)
├── Floor 7-9: Elite shadows (hard challenges)
├── Floor 10: Treasure room (bonus XP/items)
└── Boss: Skill assessment (exam-style)

Mechanics:
- Security Level (0-100%): Rises with hints used, wrong answers
- At 99%: Forced retreat, lose some progress
- Stealth bonus: Complete floor with no hints = security doesn't rise
- Safe Rooms: Rest points where Pomodoro timer = "recovery time"
```

### Rewards

| Completion | Reward |
|------------|--------|
| Any floor cleared | Skill XP + items |
| Full clear (no retreat) | 2x XP multiplier |
| Speedrun (under 25 min) | Special badge |
| Perfect (no hints, no wrong) | Gold treasure, rare Persona |

---

## Phase 3: Mementos Requests (Story-Driven Challenges)

### Concept
Daily challenges framed as requests from Metaverse NPCs with narrative context.

### Example Requests

```
REQUEST: "The Forgetful Archivist"
Client: A shadow who keeps losing track of items
Task: Implement a function to find duplicate entries in a slice
Reward: 75 XP + "Memory Fragment" (crafting item)
Dialog: "I... I can't remember if I've catalogued this before...
        Please, help me find the duplicates in my collection!"

REQUEST: "The Impatient Courier"
Client: A shadow who delivers messages but hates waiting
Task: Implement binary search for a sorted message queue
Reward: 100 XP + Speed bonus if completed quickly
Dialog: "Time is money! I need to find messages FAST.
        None of this checking-every-single-one nonsense!"

REQUEST: "The Parallel Processor"
Client: A shadow running a busy workshop
Task: Implement concurrent worker pool with goroutines
Reward: 150 XP + "Thread of Fate" (rare item)
Confidant Required: Futaba Rank 3
Dialog: "One worker isn't enough! I need MANY hands working at once!"
```

### Request Categories

1. **Daily Targets** - Rotating challenges, reset at midnight
2. **Weekly Bounties** - Harder challenges, better rewards
3. **Confidant Requests** - Unlocked via relationships, advance story
4. **Special Events** - Limited-time challenges (holidays, etc.)

---

## Phase 4: Velvet Room Enhancements (Persona Fusion)

### Concept
Combine mastered concepts to unlock hybrid challenges and advanced techniques.

### Fusion Recipes

```
FUSION EXAMPLES

Maps + Strings = "Anagram Detection" challenges
  - New challenge type unlocked
  - Bonus: Word frequency analysis exercises

Slices + Two Pointers = "In-Place Algorithms"
  - Unlock remove-duplicates, partition problems
  - Bonus: Memory-efficient pattern hints

Recursion + Stack = "Tree Traversal"
  - Unlock DFS/BFS challenges (when added)
  - Bonus: Call stack visualization

Interfaces + Structs = "Polymorphic Design"
  - Unlock design pattern challenges
  - Bonus: Yusuke confidant XP boost

Goroutines + Channels = "Pipeline Patterns"
  - Unlock producer/consumer challenges
  - Bonus: Futaba's "Concurrency Visualizer" hint type
```

### Compendium Upgrades

- **Persona Registration**: Save your best solutions
- **Persona Recall**: Re-attempt challenges with previous hints visible
- **Persona Enhancement**: Improve mastery by completing harder variants

---

## Phase 5: Social Stats Rework

### Current System
Knowledge, Proficiency, Guts, Charm, Kindness

### Enhanced System

```
SOCIAL STATS → AFFECT GAMEPLAY

KNOWLEDGE (from algorithm challenges)
├── Rank 1-2: Basic hints available
├── Rank 3-4: "Pattern Recognition" - see related problems
├── Rank 5: "Third Eye" - solution approach preview
└── Affects: Makoto confidant, exam performance

PROFICIENCY (from data structure challenges)
├── Rank 1-2: Standard tools available
├── Rank 3-4: "Code Templates" - starter code for complex problems
├── Rank 5: "Master Craftsman" - elegant solution bonuses
└── Affects: Yusuke confidant, project unlocks

GUTS (from hard/advanced challenges)
├── Rank 1-2: Can attempt hard mode
├── Rank 3-4: "Baton Pass" - skip stuck challenges without penalty
├── Rank 5: "All-Out Attack" - multi-challenge combo bonuses
└── Affects: Ryuji confidant, Palace boss access

CHARM (from perfect grades & streaks)
├── Rank 1-2: Basic party hints
├── Rank 3-4: "Negotiation" - request specific hint types
├── Rank 5: "Joker's Charisma" - all confidants boost
└── Affects: Ann confidant, special dialog options

KINDNESS (from helping others - future multiplayer?)
├── Rank 1-2: Personal notes feature
├── Rank 3-4: "Mentor Mode" - explain solutions to earn XP
├── Rank 5: "Heart's Light" - bonus XP for elegant solutions
└── Affects: Haru confidant, community features
```

---

## Phase 6: Passive Progression (Melvor-Style)

### Concept
Continue progressing even when not actively playing.

### Implementation

```
PASSIVE TRAINING

"Study Sessions" - Set a skill to train passively
- Earn 10% of normal XP rate while away
- Max 8 hours of passive gains
- Requires completing at least 1 challenge in that skill first

"Muscle Memory" - Concepts you've mastered reinforce over time
- Mastered exercises slowly gain "polish" points
- Polish = chance for bonus XP when revisited
- Represents knowledge solidifying

"Morgana's Lessons" - Overnight learning
- Before "sleeping" (closing app), select a concept
- Next session: small chance of "Eureka!" bonus
- Morgana explains an insight you "dreamed about"
```

### Offline Rewards

| Time Away | Reward |
|-----------|--------|
| 1-4 hours | Small XP bonus on return |
| 4-8 hours | Passive training XP + "Rest Bonus" (1.2x first challenge) |
| 8-24 hours | Above + random "Gift" item |
| 24+ hours | Above + Morgana nags you to come back |

---

## Phase 7: Calendar Integration

### Enhanced Calendar Features

```
CALENDAR SYSTEM

Daily View:
- Available requests
- Confidant availability (some only appear certain days)
- Special events

Weekly Planning:
- Set goals (complete X challenges, reach Y rank)
- Weekly review with stats
- Bonus for meeting goals

Monthly Milestones:
- "Story beats" - narrative events at certain dates
- Seasonal themes (different UI colors, special challenges)
- Monthly challenge: complete specific achievement
```

### Time Management

```
"AFTER SCHOOL ACTIVITIES" (Limited Daily Actions)

Each day you have limited "energy":
- 5 Challenge attempts (refreshes daily)
- 3 Palace infiltrations (refreshes weekly)
- Unlimited warmups (but reduced XP after 10)

Spend wisely:
- Confidant hangouts cost 1 action but give relationship XP
- Palace runs cost 2 actions but give big rewards
- Study sessions (passive) cost 0 but require setup
```

---

## Phase 8: Content Migration from go-course

### What to Transplant

| go-course Content | Go Grind Integration |
|-------------------|---------------------|
| Module 2: Pointers | Morgana Confidant Rank 1-3 |
| Module 3: Structs | Yusuke Confidant Rank 1-3 |
| Module 4: Interfaces | Yusuke Confidant Rank 4-7 |
| Module 5: Data Structures | Already in core (slices, maps) |
| Module 9: Error Handling | Makoto Confidant |
| Module 10: Design Patterns | Yusuke Confidant Rank 7-10 |
| Module 12: Concurrency | Futaba Confidant |
| Module 16-17: Testing | Makoto Confidant Rank 4-10 |
| Projects | "Palace Treasures" (end rewards) |

### Content Transformation Rules

1. **No "lessons"** - Everything is "Intel" discovered through gameplay
2. **No "read this first"** - Hints unlock progressively as you struggle
3. **No passive reading** - Every concept has an associated challenge
4. **Story context** - Each topic has narrative framing via confidant

---

## Implementation Priority

### MVP (Phase 1 Features)
1. ✅ Fix emoji encoding
2. ✅ Add Pomodoro timer ("Infiltration Timer")
3. [ ] Confidant system skeleton (UI + basic progression)
4. [ ] One complete confidant (Morgana - Go idioms)
5. [ ] Mementos requests with story dialog

### V1.0 (Core Loop)
6. [ ] Palace infiltration mode
7. [ ] Social stat effects on gameplay
8. [ ] Velvet Room fusion system
9. [ ] Calendar with limited actions

### V1.5 (Content Expansion)
10. [ ] All 7 confidants with content
11. [ ] Passive progression system
12. [ ] Weekly/monthly challenges
13. [ ] Achievement system

### V2.0 (Polish)
14. [ ] Sound effects and music
15. [ ] Animations and transitions
16. [ ] Mobile optimization
17. [ ] Export/import save data

---

## Technical Notes

### Data Structure Changes Needed

```javascript
// New state additions
state = {
  // Existing...

  // Confidants
  confidants: {
    morgana: { rank: 1, points: 0, unlocked: true },
    ryuji: { rank: 0, points: 0, unlocked: false },
    // ...
  },

  // Palace progress
  palaces: {
    kamoshida: { infiltration: 0, treasureStolen: false },
    // ...
  },

  // Mementos
  completedRequests: [],
  dailyRequestsAvailable: [],

  // Passive
  passiveTraining: { skill: null, startedAt: null },
  lastVisit: Date.now(),
}
```

### New Files Needed

```
js/
├── confidants.js      # Confidant system
├── palace-mode.js     # Infiltration gameplay
├── requests.js        # Mementos request system
├── fusion.js          # Velvet Room fusion
├── passive.js         # Offline progression
└── calendar-v2.js     # Enhanced calendar

data/
├── confidants.json    # Confidant content/dialog
├── requests.json      # Mementos requests
└── fusion-recipes.json # Fusion combinations

css/
├── confidants.css     # Confidant UI
└── palace.css         # Infiltration mode UI
```

---

## Questions for You

1. **Confidant Priority**: Which confidant/topic should we build first?
   - Morgana (Go idioms) - easiest, good intro
   - Futaba (Concurrency) - most requested topic
   - Makoto (Testing) - most practical

2. **Action Limits**: Do you want the "limited daily actions" mechanic?
   - Pro: Creates urgency, strategic choices
   - Con: Could feel restrictive for learning

3. **Narrative Depth**: How much story/dialog do you want?
   - Light: Brief intro text for requests
   - Medium: Dialog trees with confidants
   - Heavy: Full story events, cutscenes

4. **Passive Progression**: Important to you?
   - Some people love "progress while away"
   - Others find it gimmicky

Let me know your preferences and I'll start implementing!
