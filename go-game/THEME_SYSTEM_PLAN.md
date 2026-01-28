# Multi-Theme Game System Plan

## Overview

Transform Go Grind from a single-themed Persona 5 app into a multi-skin system where the same learning data can be presented through different game metaphors. The user selects their preferred "game mode" via a dropdown, and all UI, terminology, and presentation adapts accordingly.

**Current Theme:** Persona 5 (JRPG)
**New Theme:** 4X Grand Strategy (HOI4 + Civilization hybrid)

---

## Part 1: Architecture Restructure

### 1.1 Theme Registry System

Create a central theme registry that defines how each theme presents the core data:

```
js/
├── themes/
│   ├── theme-registry.js      # Theme switching logic, active theme state
│   ├── theme-persona5.js      # P5 terminology, icons, colors, layouts
│   └── theme-4x-strategy.js   # 4X terminology, icons, colors, layouts
```

Each theme file exports a configuration object:

```javascript
// Example structure
window.Theme4X = {
    id: '4x-strategy',
    name: 'Grand Strategy',

    // Terminology mappings
    terms: {
        player: 'Empire',
        level: 'Era',
        xp: 'Production',
        skill: 'Technology',
        exercise: 'Operation',
        palace: 'Territory',
        persona: 'General',
        confidant: 'Advisor',
        mementos: 'War Council',
        training: 'Command Center',
        grade: 'Commendation',
        hint: 'Intelligence Report',
        stats: 'National Power',
        // ... etc
    },

    // Color palette (CSS variable overrides)
    colors: {
        primary: '#4a5568',      // Steel gray
        accent: '#c9a227',       // Gold/brass
        success: '#2d5a27',      // Military green
        danger: '#8b0000',       // Dark red
        background: '#1a1a1a',   // Map dark
        // ... etc
    },

    // Grade labels
    grades: {
        S: 'Distinguished Service',
        A: 'Meritorious',
        B: 'Commendable',
        C: 'Satisfactory',
        F: 'Failed'
    },

    // Icon set (emoji or SVG references)
    icons: {
        skill: '🔬',
        exercise: '⚔️',
        xp: '🏭',
        // ... etc
    },

    // Layout variant (affects which CSS classes are used)
    layoutClass: 'theme-4x',

    // Custom render functions for themed components
    renderPlayerCard: (state) => { /* returns HTML */ },
    renderSkillCard: (skill, state) => { /* returns HTML */ },
    // ... etc
}
```

### 1.2 CSS Architecture Changes

Restructure CSS to separate base layout from theme-specific styling:

```
css/
├── base/
│   ├── layout.css          # Grid, positioning (theme-agnostic)
│   ├── typography.css      # Font sizes, weights (theme-agnostic)
│   └── utilities.css       # Common utilities
├── themes/
│   ├── persona5/
│   │   ├── colors.css      # P5 color palette
│   │   ├── components.css  # P5 angular clips, gradients
│   │   └── animations.css  # P5 specific effects
│   └── 4x-strategy/
│       ├── colors.css      # 4X color palette
│       ├── components.css  # 4X map-style borders, textures
│       └── animations.css  # 4X specific effects
└── components/
    ├── sidebar.css         # Uses CSS variables, theme-agnostic structure
    ├── cards.css           # Uses CSS variables
    └── ... etc
```

### 1.3 Theme Switching Mechanism

**In `theme-registry.js`:**
```javascript
window.ThemeRegistry = {
    themes: {},
    activeTheme: null,

    register(theme) { ... },
    setTheme(themeId) {
        // Update state.settings.theme
        // Swap root class: document.documentElement.className = theme.layoutClass
        // Re-render all visible views
        // Dispatch 'themeChanged' event
    },
    getTheme() { return this.activeTheme; },
    getTerm(key) { return this.activeTheme.terms[key]; }
};
```

### 1.4 Module Updates Required

Each existing module needs updating to use theme-aware terminology:

| Module | Changes |
|--------|---------|
| `app.js` | Use `ThemeRegistry.getTerm()` for sidebar labels, add theme dropdown |
| `combat.js` | Themed exercise presentation, hint labels, grade display |
| `skills.js` | Skill → Technology terminology, themed progress bars |
| `overlays.js` | Themed grade screens, level-up animations |
| `confidants.js` | Confidant → Advisor presentation |
| `mementos.js` | Daily challenges → War goals / National focus |
| `palace-mode.js` | Palace → Territory conquest |
| `velvet-room.js` | Persona → General/Leader compendium |
| `gamification.js` | Achievement text/icons |

---

## Part 2: 4X Grand Strategy Theme Design

### 2.1 Concept Mapping

| Persona 5 Concept | 4X Strategy Equivalent | Visual Style |
|-------------------|------------------------|--------------|
| Player (Joker) | Your Empire | Flag/crest |
| Level | Era (Ancient → Information) | Era banner |
| XP | Production Points (PP) | Factory icon |
| Skills | Technologies | Tech tree nodes |
| Skill Levels | Tech Tiers (I-V) | Roman numerals |
| Exercises | Operations / Campaigns | Battle plans |
| Difficulty | Operation Complexity | Star generals |
| Hints | Intelligence Reports | Classified docs |
| Grade S | Distinguished Service Cross | Medal |
| Grade A | Order of Merit | Medal |
| Palaces | Territories to Annex | Map regions |
| Palace Progress | Territorial Control % | Province map |
| Personas | Generals / Leaders | Portrait + stats |
| Confidants | Cabinet Advisors | Minister portraits |
| Confidant Tips | Policy Briefings | Document style |
| Mementos Requests | War Council Directives | Orders from HQ |
| Jobs | Domestic Programs | Civilian projects |
| Social Stats | National Power | Power bars |
| Calendar | Campaign Timeline | Strategy map dates |
| Exams | Staff College Examinations | Military academy |
| Achievements | Medals & Decorations | Military honors |
| Streaks | Supply Lines Maintained | Logistics |
| Combos | Combined Arms Bonus | Tactical synergy |

### 2.2 Social Stats Mapping (5 Stats → 5 Power Metrics)

| P5 Stat | 4X Equivalent | Description |
|---------|---------------|-------------|
| Knowledge | Research Output | Scientific advancement |
| Proficiency | Industrial Capacity | Production efficiency |
| Guts | Military Strength | Combat readiness |
| Charm | Diplomatic Influence | International standing |
| Kindness | National Unity | Population morale |

### 2.3 Palace → Territory Mapping

| P5 Palace | 4X Territory | Theme |
|-----------|--------------|-------|
| Kamoshida | The Frontier | Basic expansion |
| Madarame | Industrial Heartland | Production focus |
| Kaneshiro | Economic Zones | Function/method mastery |
| Futaba | Research Complex | Algorithm territory |
| Okumura | Strategic Patterns | Pattern control |
| Sae | Data Fortress | Data structure region |
| Shido | Imperial Core | Type system dominion |
| Mementos Depths | Final Frontier | Polymorphism mastery |

### 2.4 Confidant → Advisor Mapping

| P5 Confidant | 4X Advisor | Role |
|--------------|------------|------|
| Morgana | Chief of Staff | General practices, idioms |
| Futaba | Director of Research | Advanced algorithms |
| Makoto | Minister of Technology | Type system expertise |

### 2.5 Visual Design Language

**Color Palette:**
```css
:root.theme-4x {
    /* Primary tones - aged map/military aesthetic */
    --primary: #3d4f5f;           /* Steel blue-gray */
    --accent: #c9a227;            /* Brass/gold (HOI4 style) */
    --accent-secondary: #8b4513;  /* Leather brown */

    /* Status colors */
    --success: #2d5a27;           /* Military olive */
    --warning: #b8860b;           /* Dark goldenrod */
    --danger: #8b0000;            /* Dark red */
    --info: #4682b4;              /* Steel blue */

    /* Backgrounds - map textures */
    --bg-dark: #1a1a1a;           /* Dark map background */
    --bg-card: #252525;           /* Parchment-dark */
    --bg-sidebar: #1f1f1f;        /* Control panel */
    --bg-overlay: rgba(0,0,0,0.85);

    /* Text */
    --text: #d4d4d4;              /* Aged paper text */
    --text-dim: #888888;
    --text-bright: #f5f5dc;       /* Beige highlight */

    /* Borders - HOI4 style */
    --border: #3d3d3d;
    --border-accent: #c9a227;

    /* Grade colors */
    --grade-s: #ffd700;           /* Gold medal */
    --grade-a: #c0c0c0;           /* Silver medal */
    --grade-b: #cd7f32;           /* Bronze medal */
    --grade-c: #808080;           /* Participation */
}
```

**Typography:**
- Headers: Bold, condensed, military stencil feel (or use existing Barlow Condensed in all-caps)
- Body: Clean, readable (Space Grotesk works)
- Data: Monospace for numbers/stats (JetBrains Mono)

**UI Components:**
- Cards: Rectangular with brass corners, subtle parchment texture
- Borders: Double-line military style, brass accents
- Progress bars: Segmented like HOI4 production queues
- Buttons: Flat with brass borders, hover glow
- Icons: Simple military/industrial iconography

### 2.6 Layout Differences

**Sidebar (Control Panel):**
```
┌─────────────────────────┐
│  🏛️ YOUR EMPIRE         │
│  Era III • 2,450 PP     │
│  ████████░░ 78%         │
├─────────────────────────┤
│  WARFARE                │
│    ⚔️ Operations        │
│    📋 War Council       │
│    🗺️ Conquest Map      │
│    🔥 Active Wars (3)   │
├─────────────────────────┤
│  DIPLOMACY              │
│    🏛️ Embassy           │
│    🤝 Pragmatist League │
│    🔬 Algorithmica      │
│    🔒 Type Consortium   │
├─────────────────────────┤
│  TECHNOLOGIES           │
│    🔬 Variables   [III] │
│    🔬 For Loops   [II]  │
│    🔬 Pointers    [I]   │
│    ... (collapsible)    │
├─────────────────────────┤
│  NATIONAL POWER         │
│    Research:  ████░ 4   │
│    Industry:  ███░░ 3   │
│    Military:  ██░░░ 2   │
│    Diplomacy: █░░░░ 1   │
│    Unity:     ███░░ 3   │
├─────────────────────────┤
│  ADMINISTRATION         │
│    📊 Empire Stats      │
│    📅 Timeline          │
│    🎓 Staff College     │
│    🎖️ Hall of Generals  │
│    ⚙️ Settings          │
└─────────────────────────┘
```

**Operations View (Training Ground equivalent):**
```
┌──────────────────────────────────────────────────────────────┐
│  ⚔️ OPERATION: Variable Declaration                          │
│  Complexity: ★★☆ (Tier II)  │  Intel Available: 3 reports   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MISSION BRIEFING                                            │
│  ─────────────────                                           │
│  Implement a function that declares and returns a variable   │
│  with the value 42.                                          │
│                                                              │
│  EXPECTED OUTCOME                                            │
│  ────────────────                                            │
│  42                                                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ // Your battle plan here                               │  │
│  │ func main() {                                          │  │
│  │     █                                                  │  │
│  │ }                                                      │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  PLANNING PHASE: 00:32 remaining                             │
│  ════════════════════░░░░░░░░░░░░                            │
│                                                              │
│  [📋 Request Intel]  [✓ Execute Operation]  [↩ Abort]        │
└──────────────────────────────────────────────────────────────┘
```

**Territory View (Palace equivalent):**
```
┌────────────────────────────────────────────────────────────┐
│  🗺️ TERRITORIAL CONQUEST                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ THE         │  │ INDUSTRIAL  │  │ ECONOMIC    │        │
│  │ FRONTIER    │  │ HEARTLAND   │  │ ZONES       │        │
│  │             │  │             │  │             │        │
│  │ ████████░░  │  │ ██████░░░░  │  │ ████░░░░░░  │        │
│  │ 82%         │  │ 61%         │  │ 43%         │        │
│  │             │  │             │  │             │        │
│  │ [READY TO   │  │ [CONTINUE   │  │ [CONTINUE   │        │
│  │  ANNEX]     │  │  CAMPAIGN]  │  │  CAMPAIGN]  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ RESEARCH    │  │ STRATEGIC   │  │ DATA        │        │
│  │ COMPLEX     │  │ PATTERNS    │  │ FORTRESS    │        │
│  │             │  │             │  │             │        │
│  │ 🔒 LOCKED   │  │ 🔒 LOCKED   │  │ 🔒 LOCKED   │        │
│  │ Req: Era II │  │ Req: Era II │  │ Req: Era III│        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Grade Display (Post-Operation):**
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              ⭐ DISTINGUISHED SERVICE ⭐               │
│                                                        │
│                      ┌───────┐                         │
│                      │  🎖️   │                         │
│                      │  DSC  │                         │
│                      └───────┘                         │
│                                                        │
│              OPERATION: Variable Declaration           │
│                                                        │
│              Production Earned: +75 PP                 │
│              Time: 28 seconds                          │
│              Intel Used: 0                             │
│                                                        │
│              Technology Advanced!                      │
│              Variables: Tier I → Tier II               │
│                                                        │
│              [Continue to Command Center]              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 2.7 Wars, Conquest & Diplomacy Systems

These core 4X mechanics provide thematic wrappers around existing game systems, giving the strategy theme more depth and immersion.

---

#### 2.7.1 Wars System

**Concept:** Wars are focused, time-limited campaigns against a specific skill area. They reframe the "palace infiltration" and "daily challenge" mechanics as military conflicts.

**Mapping to Existing Systems:**
| Existing Feature | War Equivalent |
|------------------|----------------|
| Palace infiltration | War Campaign |
| Daily challenges (Mementos) | Skirmishes / Border Conflicts |
| Exam mode | Decisive Battle |
| Streak maintenance | Front Line Stability |

**War Types:**

1. **Campaign Wars** (Palace equivalent)
   - Long-term wars against a skill domain (e.g., "The Pointer Wars")
   - Progress tracked as "territorial control" percentage
   - Multiple operations (exercises) required to win
   - Final "Annexation Battle" at 80% control (boss equivalent)

2. **Border Skirmishes** (Daily Challenges)
   - Small daily conflicts that appear on War Council
   - Quick objectives: "Repel 3 enemy operations", "Secure S-rank victory"
   - Rewards: Production bonus, supply crates (XP)

3. **Decisive Battles** (Exams)
   - High-stakes timed engagements
   - Multiple-choice "tactical decisions"
   - Grade determines war outcome: Victory, Pyrrhic Victory, Stalemate, Defeat

**War UI - Campaign Map View:**
```
┌────────────────────────────────────────────────────────────────┐
│  ⚔️ ACTIVE WARS                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  THE POINTER WARS                          Status: ONGOING     │
│  ══════════════════════════════════════════════════════════   │
│  Enemy: The Null Reference Dominion                            │
│  Theater: Memory Management Region                             │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  FRONT LINE PROGRESS                                    │  │
│  │  ████████████████░░░░░░░░░░░░░░  47% Territory Secured  │  │
│  │                                                         │  │
│  │  Battles Won: 12    Battles Lost: 3    Casualties: 2    │  │
│  │  Days at War: 5     Est. Victory: 80% control           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  TODAY'S OBJECTIVES:                                           │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ 🎯 Operation     │  │ 🎯 Operation     │                   │
│  │ "Dereference"    │  │ "Address Of"     │                   │
│  │ ★★☆ Complexity   │  │ ★☆☆ Complexity   │                   │
│  │ [LAUNCH]         │  │ [LAUNCH]         │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                │
│  [📜 War History]  [🏳️ Request Ceasefire]  [⚔️ Final Assault]  │
└────────────────────────────────────────────────────────────────┘
```

**War Mechanics:**
- **War Declaration:** Automatically declared when you first attempt exercises in a skill area
- **Front Line:** Progress bar showing % of skill exercises completed with passing grades
- **Casualties:** Failed attempts (can be recovered by re-attempting)
- **War Weariness:** Optional - streaks reset if you abandon a war for too many days
- **Victory Conditions:** Reach 80% control, then win the "Annexation Battle"
- **Spoils of War:** Bonus XP, unlock the General for that technology

---

#### 2.7.2 Conquest System

**Concept:** Conquest is the overarching expansion of your empire across the map of Go knowledge. Each territory represents a skill domain that must be conquered through sustained effort.

**The Empire Map:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  🗺️ THE GO EMPIRE - CONQUEST MAP                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌───────────────┐                                │
│                    │  POLYMORPHIA  │                                │
│                    │   (Locked)    │                                │
│                    │   Era V req   │                                │
│                    └───────┬───────┘                                │
│                            │                                        │
│         ┌──────────────────┼──────────────────┐                     │
│         │                  │                  │                     │
│  ┌──────┴──────┐    ┌──────┴──────┐    ┌──────┴──────┐             │
│  │  TYPE       │    │   DATA      │    │  PATTERN    │             │
│  │  DOMINION   │    │  FORTRESS   │    │  PLAINS     │             │
│  │  ░░░░░░░░░  │    │  ░░░░░░░░░  │    │  ████░░░░░  │             │
│  │  0%         │    │  0%         │    │  41%        │             │
│  │  (Locked)   │    │  (Locked)   │    │  AT WAR     │             │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘             │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│  ┌─────────────┐    ┌──────┴──────┐    ┌─────────────┐             │
│  │  ALGORITHM  │    │  FUNCTION   │    │  POINTER    │             │
│  │  HIGHLANDS  │    │  FEDERATION │    │  WASTES     │             │
│  │  ██████░░░  │    │  ████████░  │    │  ████████░░ │             │
│  │  67%        │    │  89%        │    │  78%        │             │
│  │  AT WAR     │    │  VICTORY    │    │  AT WAR     │             │
│  │             │    │  IMMINENT   │    │             │             │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘             │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│                    ┌───────┴───────┐                                │
│                    │   THE         │                                │
│                    │   FRONTIER    │                                │
│                    │   ██████████  │                                │
│                    │   100%        │                                │
│                    │   CONQUERED   │                                │
│                    └───────────────┘                                │
│                                                                     │
│  EMPIRE STATISTICS:                                                 │
│  Territories: 2/8 Conquered  │  Wars Active: 3  │  Era: III        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Territory States:**
| State | Visual | Description |
|-------|--------|-------------|
| Locked | Gray, padlock icon | Prerequisites not met (Era level, other territories) |
| Neutral | Dim, available | Can declare war |
| At War | Highlighted, progress bar | Active campaign |
| Victory Imminent | Glowing, 80%+ | Final battle available |
| Conquered | Your colors, flag | Territory annexed, General unlocked |
| Occupied | Your colors, garrison | Conquered but can still do exercises for mastery |

**Conquest Mechanics:**
- **Territory Prerequisites:** Some territories require others to be conquered first (tech tree style)
- **Era Gates:** Advanced territories locked until you reach certain eras (player levels)
- **Conquest Bonuses:**
  - First conquest of a territory: Large XP bonus + General unlock
  - Full occupation (100% mastery): Permanent Production bonus
- **Empire Score:** Total territories × conquest percentage = Empire Power rating

**Conquest Rewards:**
```
┌────────────────────────────────────────────────────────┐
│  🏆 TERRITORY CONQUERED: THE FRONTIER                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  🎖️ General Unlocked: GEN. VON ASSIGNEN               │
│     "The Declarator" joins your command               │
│                                                        │
│  📦 Spoils of War:                                     │
│     +500 Production Points                             │
│     +2 Industrial Capacity (permanent)                 │
│                                                        │
│  🗺️ New Territory Available:                           │
│     Function Federation now open for conquest          │
│                                                        │
│  [View General]  [Continue Expansion]  [Return to HQ]  │
└────────────────────────────────────────────────────────┘
```

---

#### 2.7.3 Diplomacy System

**Concept:** Diplomacy represents your relationships with AI "factions" that provide bonuses and assistance. This reframes the Confidant system as international relations with allied nations/organizations.

**Mapping to Existing Systems:**
| Existing Feature | Diplomacy Equivalent |
|------------------|---------------------|
| Confidants | Allied Nations / Factions |
| Confidant ranks | Diplomatic Relations level |
| Confidant tips | Trade Agreements / Tech Sharing |
| Unlocking confidants | Establishing Diplomatic Relations |

**Factions:**

| P5 Confidant | Faction Name | Faction Type | Specialty |
|--------------|--------------|--------------|-----------|
| Morgana | The Pragmatist League | Military Alliance | Best practices, idioms, conventions |
| Futaba | Algorithmica Research Pact | Science Council | Algorithms, optimization, complexity |
| Makoto | The Type Consortium | Trade Federation | Type systems, interfaces, generics |

**Diplomacy UI - Embassy View:**
```
┌────────────────────────────────────────────────────────────────┐
│  🏛️ DIPLOMATIC RELATIONS                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🤝 THE PRAGMATIST LEAGUE                                 │ │
│  │  ════════════════════════════════════════════════════════│ │
│  │                                                          │ │
│  │  Ambassador: Chief Strategist Morgan                     │ │
│  │  Relations: ALLIED (Rank 4/10)                           │ │
│  │  Influence: ████████░░░░░░░░░░░░ 42%                     │ │
│  │                                                          │ │
│  │  ACTIVE TREATIES:                                        │ │
│  │  ✓ Naming Convention Standards (Rank 1)                  │ │
│  │  ✓ Error-First Protocol (Rank 2)                         │ │
│  │  ✓ Defer Pattern Exchange (Rank 3)                       │ │
│  │  ○ Zero Value Doctrine (Rank 5) - Locked                 │ │
│  │  ○ Interface Segregation Pact (Rank 7) - Locked          │ │
│  │                                                          │ │
│  │  DIPLOMATIC ACTIONS:                                     │ │
│  │  [📜 View Treaties]  [💬 Audience with Ambassador]       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🔬 ALGORITHMICA RESEARCH PACT                            │ │
│  │  ════════════════════════════════════════════════════════│ │
│  │                                                          │ │
│  │  Ambassador: Director of Sciences Futaba                 │ │
│  │  Relations: CORDIAL (Rank 1/10)                          │ │
│  │  Influence: ██░░░░░░░░░░░░░░░░░░ 8%                      │ │
│  │                                                          │ │
│  │  Status: Recently established diplomatic contact         │ │
│  │  Requirement: Conquer Algorithm Highlands to improve     │ │
│  │                                                          │ │
│  │  [📜 View Treaties]  [💬 Audience with Ambassador]       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ⚙️ THE TYPE CONSORTIUM                          🔒      │ │
│  │  ════════════════════════════════════════════════════════│ │
│  │                                                          │ │
│  │  Relations: NO CONTACT                                   │ │
│  │  Requirement: Reach Era IV to establish contact          │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Diplomacy Mechanics:**

1. **Establishing Relations:**
   - Some factions available from start (Pragmatist League / Morgana)
   - Others require Era level or Territory conquests
   - First contact: Small ceremony/notification

2. **Improving Relations:**
   - Complete exercises in related skill areas
   - Each completion adds "Diplomatic Influence" points
   - Rank up at thresholds (like confidant points)

3. **Treaties (Tips):**
   - Each rank unlocks a new "treaty" (programming tip/best practice)
   - Treaties displayed as formal diplomatic documents
   - Can review all active treaties in a "Treaty Archive"

4. **Diplomatic Bonuses:**
   - Higher ranks = passive bonuses during related exercises
   - Rank 5: +10% XP for related operations
   - Rank 10: "Most Favored Nation" - special General variant unlocked

**Treaty Document Style:**
```
┌────────────────────────────────────────────────────────────────┐
│  📜 TREATY OF THE NAMING CONVENTIONS                           │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  Signed: Day 3 of your reign                                   │
│  Parties: Your Empire & The Pragmatist League                  │
│  Rank Required: 1                                              │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ARTICLE I: Variable Naming                                    │
│                                                                │
│  The contracting parties hereby agree that:                    │
│                                                                │
│  • Use camelCase for variables and functions                   │
│  • Use PascalCase for exported identifiers                     │
│  • Use ALL_CAPS for constants                                  │
│  • Avoid single-letter names except for indices (i, j, k)      │
│  • Prefer descriptive names over abbreviations                 │
│                                                                │
│  ARTICLE II: Package Naming                                    │
│                                                                │
│  • Package names should be lowercase, single words             │
│  • Avoid underscores or mixedCaps in package names             │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  [Close Treaty]  [View All Treaties]                           │
└────────────────────────────────────────────────────────────────┘
```

---

#### 2.7.4 War Council (Command Center)

**Concept:** The War Council is your central command hub where all active conflicts, diplomatic matters, and strategic decisions come together. It replaces the Mementos daily challenge view.

**War Council UI:**
```
┌────────────────────────────────────────────────────────────────┐
│  📋 WAR COUNCIL - DAILY BRIEFING                               │
│  Day 47 of Your Reign  •  Era III  •  2,450 Production        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PRIORITY DIRECTIVES:                    Status                │
│  ──────────────────────────────────────────────────────────── │
│  ⚔️ Secure 3 victories today              ██░░░░░░ 1/3        │
│  🎖️ Achieve Distinguished Service rating  ░░░░░░░░ 0/1        │
│  📦 Earn 200 Production Points            ████░░░░ 95/200     │
│                                                                │
│  ACTIVE FRONTS:                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ THE POINTER WARS    │  │ PATTERN CAMPAIGN    │             │
│  │ 47% controlled      │  │ 41% controlled      │             │
│  │ 🔥 3-day streak     │  │ ⚠️ Stalled          │             │
│  │ [Resume Campaign]   │  │ [Resume Campaign]   │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                │
│  DIPLOMATIC MATTERS:                                           │
│  📬 Ambassador Morgan requests audience (new treaty available) │
│                                                                │
│  RECONNAISSANCE REPORTS:                                       │
│  🔍 Algorithm Highlands partially mapped (67% intel)           │
│  🔍 Type Dominion remains unexplored (Era IV required)         │
│                                                                │
│  [🗺️ View Empire Map]  [🏛️ Embassy]  [📊 War Statistics]      │
└────────────────────────────────────────────────────────────────┘
```

---

#### 2.7.5 Integration Summary

| Feature | Presentation Layer | Underlying System |
|---------|-------------------|-------------------|
| Active Wars | War campaign cards, front line progress | Palace infiltration progress |
| War Operations | Military operation cards | Individual exercises |
| Conquest Map | Territory grid with states | All palaces/skill areas |
| Annexation | Victory ceremony | Palace boss completion |
| Factions | Embassy view, ambassador cards | Confidants |
| Treaties | Formal document popups | Confidant tips |
| Diplomatic Rank | Influence bar, rank number | Confidant rank/points |
| War Council | Daily briefing dashboard | Mementos daily challenges |
| Border Skirmishes | Quick-action cards | Daily challenge variants |
| Decisive Battles | Timed tactical mode | Exam system |

---

### 2.8 Generals/Leaders System (Personas)

**Concept:** Generals are legendary commanders who represent mastery of each technology domain. They replace the Persona system, providing military flavor while maintaining the collection/progression aspect. Each General has a unique personality, military background, and special abilities.

---

#### 2.8.1 The General Roster

Each technology (skill) has an associated General. Generals are "recruited" when you first complete an exercise in their domain and fully "unlocked" when you conquer their territory.

**Full General Roster:**

| Technology | General Name | Title | Military Branch | Specialty |
|------------|--------------|-------|-----------------|-----------|
| Variables | Gen. Viktor Von Assignen | The Declarator | Logistics Corps | Supply chain fundamentals |
| For Loops | Gen. Lucia Iterata | The Repeater | Infantry Division | Sustained operations |
| Conditionals | Gen. Branch Wellington | The Decider | Intelligence Bureau | Tactical decision-making |
| Functions | Gen. Callisto Modular | The Invoker | Special Operations | Modular strike teams |
| Strings | Gen. Tex Concatenov | The Wordsmith | Communications Corps | Signal operations |
| Arrays | Gen. Indira Indexson | The Collector | Quartermaster Division | Resource management |
| Slices | Gen. Flex Windowsky | The Adapter | Rapid Response Unit | Dynamic deployment |
| Maps | Gen. Keir Hashworth | The Cartographer | Reconnaissance Brigade | Terrain mapping |
| Pointers | Gen. Dmitri Addresskov | The Reference | Artillery Command | Precision targeting |
| Structs | Gen. Archie Compositum | The Architect | Engineering Corps | Fortification design |
| Methods | Gen. Receiver Bindwell | The Attaché | Liaison Office | Unit coordination |
| Interfaces | Gen. Abigail Abstractus | The Polymorphist | Strategic Command | Adaptive warfare |
| Error Handling | Gen. Nil Checkson | The Sentinel | Defense Ministry | Threat mitigation |
| Goroutines | Gen. Parallel Spawnwick | The Multiplier | Airborne Division | Multi-front operations |
| Channels | Gen. Pipe Messageworth | The Coordinator | Signals Intelligence | Communication lines |
| Packages | Gen. Orga Namespace | The Organizer | General Staff | Army structure |
| Testing | Gen. Assert Validateski | The Verifier | Quality Assurance | Operation validation |
| Generics | Gen. Template Typevar | The Universalist | Research Division | Adaptable strategies |
| Embedding | Gen. Inherit Composington | The Combiner | Joint Operations | Force multiplication |
| Defer | Gen. Stack Postponer | The Cleaner | Rear Guard | Withdrawal operations |
| Panic/Recover | Gen. Crisis Handler | The Resilient | Emergency Response | Disaster recovery |
| Reflection | Gen. Meta Inspector | The Analyst | Counter-Intelligence | Deep reconnaissance |
| Context | Gen. Cancel Timeout | The Controller | Command & Control | Operation management |
| JSON/Encoding | Gen. Marshal Serialize | The Translator | Foreign Relations | Data diplomacy |

---

#### 2.8.2 General Ranks & Progression

Generals have military ranks that increase as you gain mastery in their domain. This maps directly to the skill level system.

**Rank Progression:**

| Skill Level | Military Rank | Insignia | Unlock |
|-------------|---------------|----------|--------|
| 1 | Second Lieutenant | ⬧ | First exercise completed |
| 5 | First Lieutenant | ⬧⬧ | Basic competency |
| 10 | Captain | ★ | Journeyman |
| 15 | Major | ★⬧ | Intermediate |
| 20 | Lieutenant Colonel | ★★ | Advanced |
| 25 | Colonel | ★★⬧ | Expert |
| 30 | Brigadier General | ★★★ | Master |
| 40 | Major General | ★★★⬧ | Grandmaster |
| 50 | Lieutenant General | ★★★★ | Legendary |
| 50+ (max mastery) | General of the Army | ★★★★★ | Supreme Commander |

**Rank-Up Ceremony:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                    ⚔️ PROMOTION CEREMONY ⚔️                    │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │                      ┌─────────┐                       │   │
│  │                      │  ★★★    │                       │   │
│  │                      │  👤🎖️   │                       │   │
│  │                      └─────────┘                       │   │
│  │                                                        │   │
│  │           GEN. DMITRI ADDRESSKOV                       │   │
│  │           "The Reference"                              │   │
│  │                                                        │   │
│  │    Has been promoted to the rank of                    │   │
│  │                                                        │   │
│  │              ★★★ BRIGADIER GENERAL ★★★                 │   │
│  │                                                        │   │
│  │    For distinguished service in the Pointer Wars       │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  NEW ABILITY UNLOCKED:                                         │
│  "Precision Strike" - +15% XP for pointer operations          │
│                                                                │
│                    [Accept Commission]                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

#### 2.8.3 General Abilities

Each General provides passive bonuses that scale with their rank. These replace the milestone bonuses from the skill system.

**Ability Types:**

| Ability Type | Effect | Example |
|--------------|--------|---------|
| XP Boost | Bonus Production for related exercises | +10% XP at Captain |
| Intel Discount | Hints cost less XP penalty | -5 XP per hint at Major |
| Time Extension | Longer planning phase | +15 seconds at Colonel |
| Streak Shield | Protect streak on first failure | 1 free retry at Brigadier |
| Mastery Bonus | Bonus for S-rank completions | +25% S-rank XP at Lt. General |

**Sample General Abilities:**

**Gen. Viktor Von Assignen (Variables)**
| Rank | Ability | Effect |
|------|---------|--------|
| Captain (10) | Supply Efficiency | +10% XP for variable exercises |
| Colonel (25) | Rapid Deployment | -10 second timer reduction |
| Brigadier (30) | Logistics Mastery | First hint free (no penalty) |
| Lt. General (50) | Total Recall | Variables concepts auto-complete hints |

**Gen. Dmitri Addresskov (Pointers)**
| Rank | Ability | Effect |
|------|---------|--------|
| Captain (10) | Precision Targeting | +10% XP for pointer exercises |
| Colonel (25) | Memory Mapping | Pointer hints reveal more info |
| Brigadier (30) | Reference Lock | Streak protected once per day |
| Lt. General (50) | Absolute Address | Double XP for S-rank pointer ops |

---

#### 2.8.4 Hall of Generals

The Hall of Generals replaces the Velvet Room Compendium. It's a grand military gallery showcasing all your recruited commanders.

**Hall of Generals UI:**
```
┌────────────────────────────────────────────────────────────────────────┐
│  🎖️ HALL OF GENERALS                                                   │
│  Your Empire's Greatest Military Minds                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  RECRUITED: 12/24 Generals  │  Total Rank Stars: 47  │  Era: III      │
│                                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ ★★★★        │  │ ★★★         │  │ ★★          │  │ ★           │   │
│  │ 👤 VON      │  │ 👤 ITERATA  │  │ 👤 ADDRESS- │  │ 👤 COMPO-   │   │
│  │    ASSIGNEN │  │             │  │    KOV      │  │    SITUM    │   │
│  │             │  │             │  │             │  │             │   │
│  │ Lt. General │  │ Brig. Gen.  │  │ Lt. Colonel │  │ Captain     │   │
│  │ Variables   │  │ For Loops   │  │ Pointers    │  │ Structs     │   │
│  │ [VIEW]      │  │ [VIEW]      │  │ [VIEW]      │  │ [VIEW]      │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ ★★          │  │ ★           │  │ ★           │  │ ⬧           │   │
│  │ 👤 MODULAR  │  │ 👤 INDEXSON │  │ 👤 HASHWRTH │  │ 👤 WINDOW-  │   │
│  │             │  │             │  │             │  │    SKY      │   │
│  │ Lt. Colonel │  │ Captain     │  │ Captain     │  │ 2nd Lt.     │   │
│  │ Functions   │  │ Arrays      │  │ Maps        │  │ Slices      │   │
│  │ [VIEW]      │  │ [VIEW]      │  │ [VIEW]      │  │ [VIEW]      │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 🔒          │  │ 🔒          │  │ 🔒          │  │ 🔒          │   │
│  │             │  │             │  │             │  │             │   │
│  │ ? ? ? ? ?   │  │ ? ? ? ? ?   │  │ ? ? ? ? ?   │  │ ? ? ? ? ?   │   │
│  │             │  │             │  │             │  │             │   │
│  │ Unknown     │  │ Unknown     │  │ Unknown     │  │ Unknown     │   │
│  │ Interfaces  │  │ Goroutines  │  │ Channels    │  │ Generics    │   │
│  │ [LOCKED]    │  │ [LOCKED]    │  │ [LOCKED]    │  │ [LOCKED]    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                        │
│  [Sort: By Rank ▾]  [Filter: All ▾]  [🏆 Achievements]                │
└────────────────────────────────────────────────────────────────────────┘
```

---

#### 2.8.5 Individual General Profile

Clicking a General opens their detailed dossier.

**General Dossier View:**
```
┌────────────────────────────────────────────────────────────────────────┐
│  📋 MILITARY DOSSIER                                        [✕ Close] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐                                                      │
│  │              │   GENERAL DMITRI ADDRESSKOV                          │
│  │   ★★★★★      │   ══════════════════════════                         │
│  │   🎖️👤🎖️     │   "The Reference"                                    │
│  │              │                                                      │
│  │  [PORTRAIT]  │   Current Rank: LIEUTENANT GENERAL (★★★★)            │
│  │              │   Branch: Artillery Command                          │
│  │              │   Specialty: Precision Targeting                     │
│  └──────────────┘   Recruited: Day 12 of your reign                    │
│                                                                        │
│  ═══════════════════════════════════════════════════════════════════  │
│                                                                        │
│  SERVICE RECORD                                                        │
│  ───────────────                                                       │
│  Campaigns Fought:        47                                           │
│  Operations Completed:    156                                          │
│  Distinguished Service:   23 (S-rank)                                  │
│  Meritorious Service:     45 (A-rank)                                  │
│  Casualties Recovered:    8 (retried failures)                         │
│  Days in Service:         34                                           │
│                                                                        │
│  ═══════════════════════════════════════════════════════════════════  │
│                                                                        │
│  RANK PROGRESSION                                                      │
│  ────────────────                                                      │
│  ████████████████████████████████████████░░░░░░░░░░  82% to General   │
│                                                                        │
│  ⬧ 2nd Lt ─ ⬧⬧ 1st Lt ─ ★ Cpt ─ ★⬧ Maj ─ ★★ Lt.Col ─ ★★⬧ Col        │
│       ✓         ✓        ✓       ✓        ✓          ✓                │
│                                                                        │
│  ★★★ Brig ─ ★★★⬧ Maj.Gen ─ ★★★★ Lt.Gen ─ ★★★★★ General               │
│       ✓           ✓            ●              ○                        │
│                                                                        │
│  ═══════════════════════════════════════════════════════════════════  │
│                                                                        │
│  ACTIVE ABILITIES                                                      │
│  ────────────────                                                      │
│  ✓ Precision Targeting (Cpt)    +10% XP for pointer operations        │
│  ✓ Memory Mapping (Col)         Enhanced hint information              │
│  ✓ Reference Lock (Brig)        Daily streak protection               │
│  ○ Absolute Address (Gen)       Double S-rank XP  [LOCKED - ★★★★★]    │
│                                                                        │
│  ═══════════════════════════════════════════════════════════════════  │
│                                                                        │
│  BIOGRAPHY                                                             │
│  ─────────                                                             │
│  "Born in the memory-scarce borderlands, Addresskov learned early     │
│   that every byte matters. His legendary precision in targeting       │
│   specific memory locations earned him the moniker 'The Reference.'   │
│   Under his command, no pointer goes uninitialized, no address        │
│   unreachable. His tactical doctrine: 'Know your address, know        │
│   your enemy.'"                                                        │
│                                                                        │
│  FAMOUS QUOTE                                                          │
│  ────────────                                                          │
│  "A nil pointer is not a mistake—it is an opportunity for clarity."   │
│                                                                        │
│  [⚔️ Deploy to Operations]  [📜 View Campaign History]                │
└────────────────────────────────────────────────────────────────────────┘
```

---

#### 2.8.6 General Recruitment

Generals are recruited through conquest. The recruitment ceremony happens when you first complete an exercise in a new domain.

**First Contact (Recruitment):**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                  ⚔️ NEW GENERAL RECRUITED ⚔️                   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │                      ┌─────────┐                       │   │
│  │                      │  ⬧      │                       │   │
│  │                      │  👤     │                       │   │
│  │                      └─────────┘                       │   │
│  │                                                        │   │
│  │           GEN. ABIGAIL ABSTRACTUS                      │   │
│  │           "The Polymorphist"                           │   │
│  │                                                        │   │
│  │    Has pledged allegiance to your Empire               │   │
│  │                                                        │   │
│  │    Starting Rank: SECOND LIEUTENANT                    │   │
│  │    Branch: Strategic Command                           │   │
│  │    Specialty: Adaptive Warfare                         │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  "Your Excellency, I offer my expertise in the art of        │
│   abstraction. Under my guidance, your forces shall adapt    │
│   to any battlefield condition."                              │
│                                                                │
│  First Ability Unlocked at Captain (Level 10)                 │
│                                                                │
│                    [Welcome to Command]                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

#### 2.8.7 Combined Arms (Fusion System)

Generals can collaborate on joint operations, combining their expertise for advanced exercises. This replaces the Persona Fusion system.

**Combined Arms Operations:**

| Operation Name | Generals Required | Technology Created |
|----------------|-------------------|-------------------|
| Structured Reference | Addresskov + Compositum | Pointer to Structs |
| Dynamic Dispatch | Abstractus + Bindwell | Interface Methods |
| Concurrent Messaging | Spawnwick + Messageworth | Goroutine Channels |
| Generic Collections | Typevar + Indexson | Generic Containers |
| Error Propagation | Checkson + Modular | Function Error Handling |

**Combined Arms UI:**
```
┌────────────────────────────────────────────────────────────────┐
│  ⚔️ COMBINED ARMS OPERATIONS                                   │
│  Joint exercises requiring multiple Generals                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  AVAILABLE JOINT OPERATIONS:                                   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  OPERATION: STRUCTURED REFERENCE                         │ │
│  │  ════════════════════════════════                        │ │
│  │                                                          │ │
│  │  ┌─────────┐         ┌─────────┐                        │ │
│  │  │ ★★★★    │   ⚔️    │ ★★      │                        │ │
│  │  │ ADDRESS │   +     │ COMPO-  │                        │ │
│  │  │ KOV     │         │ SITUM   │                        │ │
│  │  └─────────┘         └─────────┘                        │ │
│  │                                                          │ │
│  │  Combined Expertise: Pointer to Structs                  │ │
│  │  Difficulty: ★★★                                         │ │
│  │  Rewards: 2x Production, Combined Arms Medal             │ │
│  │                                                          │ │
│  │  [🎯 Launch Joint Operation]                             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  OPERATION: DYNAMIC DISPATCH                    🔒       │ │
│  │  ════════════════════════════                            │ │
│  │                                                          │ │
│  │  Requires: Gen. Abstractus (Interfaces)                  │ │
│  │            Gen. Bindwell (Methods)                       │ │
│  │                                                          │ │
│  │  Status: Abstractus not yet recruited                    │ │
│  │  [LOCKED - Recruit required Generals]                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

#### 2.8.8 Legendary Generals (Achievements)

Special General variants are unlocked through exceptional achievements.

| Achievement | Legendary General | Bonus |
|-------------|------------------|-------|
| 100 S-ranks total | Marshal Von Assignen (Gold) | +25% all XP |
| 30-day streak | Field Marshal Iterata (Silver) | Streak never breaks |
| All territories conquered | Supreme Commander (Your name) | Access to Legendary difficulty |
| All Generals at Colonel+ | High Command Council | All abilities stack at 50% |

**Legendary General Unlock:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              ⭐ LEGENDARY GENERAL UNLOCKED ⭐                  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │                   ┌───────────┐                        │   │
│  │                   │  ★★★★★    │                        │   │
│  │                   │  ✨👤✨   │                        │   │
│  │                   │   🎖️🎖️    │                        │   │
│  │                   └───────────┘                        │   │
│  │                                                        │   │
│  │         FIELD MARSHAL LUCIA ITERATA                    │   │
│  │         ═══════════════════════════                    │   │
│  │         "The Eternal Repeater"                         │   │
│  │                                                        │   │
│  │    Legendary variant unlocked for maintaining          │   │
│  │    a 30-day unbroken streak of operations              │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  LEGENDARY ABILITY:                                            │
│  "Perpetual Motion" - Your streak can never be broken.        │
│  Even if you miss a day, your streak continues.               │
│                                                                │
│                [Accept Legendary Commission]                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Part 3: Implementation Steps

### Phase 1: Infrastructure (Foundation)

1. **Create theme registry system**
   - `js/themes/theme-registry.js`
   - Add `settings.theme` to GameState
   - Theme switching function

2. **Restructure CSS**
   - Extract color variables into theme-specific files
   - Create base layout CSS (theme-agnostic)
   - Add `.theme-persona5` and `.theme-4x` root classes

3. **Add theme dropdown to settings/header**
   - Dropdown in settings view
   - Persist selection to localStorage
   - Apply theme class on load

### Phase 2: Persona 5 Theme Extraction

4. **Extract P5 theme configuration**
   - Create `js/themes/theme-persona5.js`
   - Define all terminology mappings
   - Move P5-specific colors to `css/themes/persona5/colors.css`
   - Define custom render functions for P5-specific UI

5. **Update modules to use ThemeRegistry**
   - Replace hardcoded text with `ThemeRegistry.getTerm()`
   - Replace hardcoded colors with CSS variables
   - Ensure all text is themeable

### Phase 3: 4X Theme Implementation

6. **Create 4X theme configuration**
   - `js/themes/theme-4x-strategy.js`
   - All terminology mappings
   - Grade labels and icons
   - Custom render functions

7. **Create 4X CSS theme**
   - `css/themes/4x-strategy/colors.css`
   - `css/themes/4x-strategy/components.css`
   - Military/map aesthetic
   - Different card styles, borders, progress bars

8. **Theme-specific layouts**
   - 4X sidebar structure
   - 4X operation view
   - 4X territory map view
   - 4X grade/commendation display

### Phase 4: Polish & Testing

9. **Implement smooth theme transitions**
   - CSS transitions on theme switch
   - Re-render views on theme change

10. **Test both themes thoroughly**
    - All views in both themes
    - Responsive layouts
    - Animations and overlays

---

## Part 4: File Changes Summary

### New Files
```
js/themes/
├── theme-registry.js          # ~150 LOC
├── theme-persona5.js          # ~200 LOC
└── theme-4x-strategy.js       # ~250 LOC

css/themes/
├── persona5/
│   ├── colors.css             # Extract from current theme.css
│   ├── components.css         # P5 angular clips, gradients
│   └── animations.css         # P5 effects
└── 4x-strategy/
    ├── colors.css             # New 4X palette
    ├── components.css         # Military borders, textures
    └── animations.css         # 4X effects
```

### Modified Files
```
index.html           # Add theme CSS links, theme dropdown
js/state.js          # Add settings.theme
js/app.js            # Use ThemeRegistry, theme dropdown handler
js/combat.js         # Themed terminology
js/skills.js         # Themed terminology
js/overlays.js       # Themed grade displays
js/confidants.js     # Advisor terminology
js/mementos.js       # War Council terminology
js/palace-mode.js    # Territory terminology
js/velvet-room.js    # Generals terminology
js/gamification.js   # Achievement terminology
css/base.css         # Restructure for theme-agnostic layout
css/theme.css        # Becomes persona5/colors.css
```

---

## Part 5: Theme Switcher UI

### Location Options

**Option A: Settings View**
- Add "Display Theme" dropdown in existing settings
- Clean, out of the way
- Requires navigation to change

**Option B: Header Dropdown** (Recommended)
- Small dropdown in the top-right of main content area
- Always accessible
- Quick switching for comparison
- Similar to VS Code theme switcher

**UI Design:**
```
┌─────────────────────────────────────────────────────────┐
│  TRAINING GROUND                    [🎨 Persona 5 ▾]   │
├─────────────────────────────────────────────────────────┤
                                      ┌─────────────────┐
                                      │ ✓ Persona 5     │
                                      │   Grand Strategy│
                                      └─────────────────┘
```

---

## Part 6: Future Theme Ideas

Once the multi-theme system is in place, additional themes could include:

| Theme | Inspiration | Aesthetic |
|-------|-------------|-----------|
| Sci-Fi Command | Stellaris, FTL | Space stations, research labs |
| Medieval Kingdom | CK3, Age of Empires | Castles, knights, scrolls |
| Cyberpunk Corp | Shadowrun, Cyberpunk | Neon, terminals, megacorps |
| Sports Manager | FIFA Career, Football Manager | Training, matches, leagues |
| Light Mode P5 | Persona 5 daytime | Same P5 but light colors |

---

## Appendix: 4X Terminology Quick Reference

### Core Terms
| Current (P5) | 4X Equivalent |
|--------------|---------------|
| Shadows | Enemies / Hostiles |
| Defeat Shadow | Complete Operation |
| Palace Boss | Territory Annexation Battle |
| All-Out Attack | Total Victory |
| Thinking Time | Planning Phase |
| Reveal Hint | Request Intel |
| Mastery | Campaign Excellence |
| Compendium | Hall of Generals |
| Fusion | Combined Arms |
| Arcana | Military Branch |
| Shift | Duty Rotation |
| Joker | Supreme Commander |
| Metaverse | Theater of Operations |

### War & Conquest Terms
| Current (P5) | 4X Equivalent |
|--------------|---------------|
| Palace | Territory / War Theater |
| Palace Progress | Front Line / Territorial Control |
| Palace Infiltration | War Campaign |
| Palace Boss Fight | Annexation Battle |
| Palace Completed | Territory Conquered |
| Daily Challenge | Border Skirmish / Directive |
| Mementos | War Council |
| Mementos Request | Priority Directive |
| Streak | Supply Line / Front Stability |
| Failed Exercise | Casualty / Setback |
| Exercise Complete | Operation Success / Victory |

### Diplomacy Terms
| Current (P5) | 4X Equivalent |
|--------------|---------------|
| Confidant | Allied Faction / Nation |
| Confidant Rank | Diplomatic Relations Level |
| Confidant Points | Diplomatic Influence |
| Confidant Tip | Treaty / Trade Agreement |
| Unlock Confidant | Establish Diplomatic Relations |
| Max Confidant | Most Favored Nation Status |
| Morgana | The Pragmatist League |
| Futaba | Algorithmica Research Pact |
| Makoto | The Type Consortium |

### Military Ranks (Grade Equivalents)
| Grade | Military Commendation | Ceremony |
|-------|----------------------|----------|
| S | Distinguished Service Cross | Full honors, fanfare |
| A | Order of Merit | Commendation ceremony |
| B | Bronze Star | Acknowledgment |
| C | Participation Medal | Brief mention |
| F | Court Martial | Failure notification |

### Era Progression (Level Equivalents)
| Player Level | Era | Title |
|--------------|-----|-------|
| 1-5 | Era I | Tribal Chieftain |
| 6-15 | Era II | City-State Ruler |
| 16-30 | Era III | Kingdom Monarch |
| 31-50 | Era IV | Empire Sovereign |
| 51+ | Era V | Civilization Leader |

---

## Summary

This plan transforms Go Grind into a multi-theme learning platform:

1. **Separation of concerns**: Data/logic stays the same, presentation is themeable
2. **Theme registry**: Central system for managing themes and terminology
3. **CSS restructure**: Base layout + theme-specific styles
4. **4X theme**: HOI4/Civ inspired military strategy aesthetic
5. **Easy switching**: Dropdown to swap themes instantly
6. **Extensible**: Adding new themes becomes straightforward

The core learning experience remains identical - same exercises, same progression, same XP calculations. Only the presentation changes, allowing you to find which metaphor resonates best with your learning style.
