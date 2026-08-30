# FlyRank Learning Archive DESIGN SPEC v1 — SYSTEMS ATLAS

**Status:** Design direction selected and approved for implementation  
**Product:** FlyRank Learning Archive  
**Visual direction:** Systems Atlas  
**Primary stack:** Astro + TypeScript + CSS + Cytoscape.js  
**Typography:** Sora + Inter

---

# 01. DESIGN DECISION

The approved direction is **Systems Atlas**.

The archive should feel like a **technical atlas of a learning system**: precise, spatial, restrained, and designed around relationships between work rather than around decoration.

The visual language is inspired by:

- systems architecture
    
- cartography
    
- information mapping
    
- technical documentation
    
- editorial information design
    

It is **not** inspired by:

- cyberpunk
    
- generic AI dashboards
    
- crypto interfaces
    
- hacker terminals
    
- sci-fi HUDs
    
- glassmorphism
    
- neon technology aesthetics
    

The key product principle is:

> **The graph is the map. It is not the archive itself.**

The assignment cards are the archive.  
The artifacts are the proof.  
The graph explains how the work connects.

---

# 02. CORE VISUAL IDEA

The interface should communicate that the work is a **system that can be explored**.

The user should feel like they are navigating a map of ideas, assignments, and evidence rather than browsing a conventional portfolio.

The design must remain readable when the graph is not being interacted with.

The graph should therefore be treated as a **navigation and synthesis layer**, not as decorative wallpaper.

---

# 03. CANONICAL SCREEN TO RECREATE

The primary desktop composition is based on the approved Systems Atlas mockup.

Use the following composition as the reference state for implementation:

1. slim top navigation
    
2. left introductory column
    
3. central learning map
    
4. right-side selected assignment/artifact panel
    
5. dark near-black green background
    
6. restrained green/terracotta/gold accents
    
7. thin graph lines
    
8. small technical metadata
    
9. selected node visibly highlighted
    
10. selected artifact shown as a technical notebook preview
    

The visual hierarchy should immediately read as:

**INTRO → MAP → SELECTED WORK → PROOF**

---

# 04. COLOUR SYSTEM

## Primary background

`#101312`

Near-black green-black.

Use as the dominant page background.

It should appear almost black at first glance but retain a subtle green undertone.

Do not use a visible gradient.

## Primary text

`#E9E7DF`

Warm off-white rather than pure white.

Used for:

- headlines
    
- major assignment titles
    
- body text on dark surfaces
    
- primary navigation where necessary
    

## Deep green

`#315D4B`

Used for:

- AI Fluency identity
    
- selected states where green is appropriate
    
- active system elements
    
- important positive/primary highlights
    

## Terracotta

`#B9664E`

Used for:

- Machine Learning identity
    
- cross-track emphasis
    
- selected relationship accents
    
- active ML nodes
    
- small high-value attention markers
    

Terracotta should be used sparingly.

## Muted gold

`#B9A36A`

Used for:

- small metadata accents
    
- rare annotation details
    
- artifact indicators
    
- subtle secondary emphasis
    

Gold must never become a dominant interface colour.

## Graph grey

`#5B625D`

Used for:

- inactive connections
    
- secondary lines
    
- supporting graph elements
    
- low-emphasis metadata
    

## Rule / border tone

Use a low-opacity version of the warm off-white or graph grey.

Borders should be visible but quiet.

---

# 05. COLOUR USAGE RULES

The palette must remain restrained.

Use approximately:

- 70–80% near-black background
    
- 10–15% warm off-white
    
- 5–8% deep green
    
- 3–5% terracotta
    
- <2% gold
    

These are visual guidelines rather than hard token ratios.

Never introduce:

- purple
    
- bright cyan
    
- electric green
    
- bright red
    
- rainbow graph colours
    
- blue/purple AI gradients
    

The two tracks must be distinguishable, but the page must still feel like one system.

---

# 06. TYPOGRAPHY

## Headings

Use **Sora**.

Weights:

- 600 for primary headings
    
- 500–600 for section headings
    
- 500 for major metadata labels
    

Sora should create the technical/editorial voice.

## Body

Use **Inter**.

Weights:

- 400 for body
    
- 500 for metadata
    
- 600 for small emphasis
    

## Type characteristics

Headings:

- compact
    
- confident
    
- moderately tight line-height
    
- no decorative effects
    

Body:

- readable
    
- generous line-height
    
- relatively narrow measure
    

Do not use excessive letter spacing.

Small uppercase metadata can use modest tracking, approximately `0.06em–0.10em`.

---

# 07. TYPE SCALE

Desktop baseline:

### Hero headline

48–64px

Use responsive clamp values rather than a fixed size.

### Assignment title

32–48px

### Section heading

20–28px

### Body

14–17px

### Metadata

9–11px

### Graph labels

9–12px

The graph labels must remain legible without overpowering the map.

---

# 08. HEADER

The header is compact and quiet.

Approximate structure:

```text
FLYRANK                         MAP   WORK   FRAMEWORK   REFLECTION       AI FLUENCY   MACHINE LEARNING
LEARNING ARCHIVE
```

## Left

`FLYRANK`

Small descriptor underneath:

`LEARNING ARCHIVE`

## Centre navigation

- MAP
    
- WORK
    
- FRAMEWORK
    
- REFLECTION
    

## Right navigation

- AI FLUENCY
    
- MACHINE LEARNING
    

The selected section receives a subtle indicator.

Avoid large navigation buttons.

Avoid pill-shaped navigation.

Avoid oversized logos.

Header height should remain compact enough that the map begins early in the viewport.

---

# 09. HERO / INTRODUCTION

The hero is not a conventional marketing hero.

It should function as a concise orientation panel for the map.

Use:

### Eyebrow

`AI FLUENCY × MACHINE LEARNING`

AI Fluency should appear in green.  
Machine Learning should appear in terracotta.

### Headline

**Two tracks.**  
**One evolving way of working.**

Large Sora heading.

Line breaks should remain deliberate.

### Supporting text

`A visual archive of what I built, what the work taught me, and how the pieces connect.`

### Secondary supporting line

`Built for the next person trying to find their footing.`

This should be visually subordinate.

### Actions

Primary:  
`EXPLORE THE MAP`

Secondary:  
`BROWSE THE WORK`

Use one filled/strong CTA and one quieter text/button treatment.

Do not make both buttons visually dominant.

---

# 10. LEARNING MAP

## Purpose

The map communicates the implicit structure of the programme.

It is not a generic network diagram.

It should reveal:

- learning paths
    
- conceptual relationships
    
- cross-track connections
    
- major work
    
- progression
    

## Default graph state

Do not display every assignment.

Default state should show:

- 10 concept nodes
    
- key anchor assignments
    
- major track paths
    
- only the strongest approved relationships
    
- limited artifact markers
    

Everything else is progressively revealed after interaction.

## Track presentation

AI Fluency should lean green.

Machine Learning should lean terracotta.

Do not colour every node entirely by track.

Use colour as an accent system rather than painting the graph in two blocks.

---

# 11. GRAPH NODE TYPES

There are exactly three semantic node types.

## Assignment node

Represents a real assignment.

Visual treatment:

- circular node
    
- thin border
    
- compact label
    
- core assignments larger
    
- supporting assignments smaller
    

## Concept node

Represents a recurring underlying idea.

Visual treatment:

- rectangular label
    
- thin technical border
    
- uppercase or compact title
    
- visually distinct from assignment circles
    

Concept nodes should function as the connective tissue of the graph.

## Artifact node

Represents proof or a substantial output.

Visual treatment:

- small document icon/marker
    
- attached to the relevant assignment or displayed within the selected-work area
    

Do not create additional semantic node types.

Track and strand labels are grouping metadata, not separate node types.

---

# 12. GRAPH HIERARCHY

Use the three narrative tiers:

## Tier 1 — Core

These are the central narrative/work nodes.

They receive:

- larger node size
    
- stronger label treatment
    
- higher contrast
    
- more prominent placement
    

## Tier 2 — Supporting

These are still important but should not compete with the main spine.

They receive:

- smaller nodes
    
- lower contrast
    
- less prominent labels
    

## Tier 3 — Reference

These are quiet archive material.

They may be hidden in the default graph and appear when the user explores a track or concept.

Tier is **narrative weight**, not programme importance.

---

# 13. GRAPH RELATIONSHIPS

Use three relationship types visually:

### BUILDS ON

Primary solid or clearly structured line.

Used for genuine progression/dependency.

### CONNECTS TO

Subtler line.

Used for conceptual relationships.

### CROSS-TRACK

Distinct accent treatment, usually terracotta or a controlled accent variation.

Only use when the connection is approved as meaningful.

## Important rule

Do not create a direct assignment-to-assignment edge when the relationship is adequately explained by a shared concept.

Example:

Do not draw:

`Prompt Ladder ↔ ML-09`

merely because both involve evaluation.

Instead:

`Prompt Ladder → EVALUATION ← ML-09`

The concept mediates the relationship.

---

# 14. GRAPH LINE STYLE

Lines should be:

- thin
    
- precise
    
- low opacity
    
- visually subordinate to nodes
    

Avoid:

- thick connector lines
    
- neon glow
    
- animated electricity effects
    
- arrowheads everywhere
    
- dotted spiderwebs covering the entire viewport
    

Only explicit dependency relationships should visually suggest direction.

Concept connections can remain undirected.

---

# 15. GRAPH INTERACTION

The map should feel responsive but restrained.

## Hover assignment

On hover:

- node slightly increases in scale
    
- label becomes more readable
    
- immediate connections brighten slightly
    
- unrelated graph remains unchanged
    

Do not use aggressive bounce animations.

## Click assignment

On click:

- selected node enlarges slightly
    
- selected node receives a clear outer ring
    
- connected concepts/assignments brighten
    
- unrelated nodes fade
    
- assignment panel opens
    

## Click concept

On click:

- highlight all assignments connected to that concept
    
- fade unrelated nodes
    
- update contextual labels
    

## Click track

Selecting AI Fluency or Machine Learning should:

- focus the graph on that track
    
- preserve relevant cross-track concept nodes
    
- make the chosen track dominant
    

Do not navigate away just because the user selected a track.

## Escape / close

Allow closing the assignment focus state without losing graph position.

---

# 16. PROGRESSIVE DISCLOSURE

The first graph state must remain calm.

### Default

Conceptual overview + selected core nodes.

### Track selected

Reveal the primary learning spine of that track.

### Concept selected

Reveal relevant assignments across both tracks.

### Assignment selected

Reveal its immediate relationships and artifact evidence.

### Browse All

Allow a fuller archive view for users who explicitly request it.

This preserves discoverability without overwhelming the initial screen.

---

# 17. SELECTED ASSIGNMENT PANEL

The selected assignment appears alongside the map rather than replacing the entire map.

This is critical to the Systems Atlas identity.

The user should never lose the context of where the assignment sits in the larger system.

## Recommended layout

```text
┌─────────────────────┬──────────────────────────────┐
│                     │                              │
│      LEARNING       │  ML-09                       │
│       MAP           │  VALIDATION AND              │
│                     │  RESEARCH CLAIM AUDIT        │
│                     │                              │
│                     │  TASK                         │
│                     │  ...                          │
│                     │                              │
│                     │  LESSON                       │
│                     │  ...                          │
│                     │                              │
│                     │  TAKEAWAY                     │
│                     │  ...                          │
│                     │                              │
│                     │  PROOF                        │
│                     │  [artifact preview]           │
│                     │                              │
└─────────────────────┴──────────────────────────────┘
```

The map can compress to approximately one-third to one-half of the viewport when the assignment is selected.

The assignment panel receives the majority of attention.

---

# 18. ASSIGNMENT HEADER

Example:

`ML-09`

Large Sora numeral/code.

Below:

`WEEK 6 · MACHINE LEARNING · CORE`

Small uppercase metadata.

Then:

**VALIDATION AND RESEARCH CLAIM AUDIT**

Use a thin rule below the title.

---

# 19. THREE-BEAT CONTENT

Every assignment uses the same three-beat structure.

## TASK

What the assignment asked the student to do.

## LESSON

The useful thing learned through doing it.

## TAKEAWAY

The most useful guidance for a future student.

Do not introduce additional reflective sections into the basic card.

Do not turn the cards into assignment memoirs.

Do not create a fourth beat just because an assignment is complicated.

The artifact and graph relationship information live outside the three beats.

---

# 20. TASK / LESSON / TAKEAWAY PRESENTATION

Labels should be:

- small
    
- uppercase
    
- restrained
    
- clearly separated from body copy
    

Body copy should be short enough to scan.

Do not create three large text boxes with heavy borders.

Use whitespace and thin rules instead.

The card should feel closer to a technical note than a dashboard card.

---

# 21. ARTIFACTS

The archive's rule is:

> **Embed the work. Preview supporting evidence. Link administrative/source material.**

## Primary artifact

If technically feasible and substantial:

**embed.**

Examples:

- ML notebooks
    
- deployed ML paper
    
- live portfolio
    
- substantial agent demos
    
- meaningful workflow artefacts
    

## Supporting artifact

Use:

- preview
    
- screenshot
    
- compact evidence card
    
- external link
    

## Administrative/source artifact

Use a simple link.

Do not waste visual space on administrative evidence.

---

# 22. NOTEBOOK EMBEDS

Notebook embeds should look integrated with the archive rather than like a random external iframe dropped into the page.

Where possible, use a contained artifact viewport with:

- notebook title
    
- execution/results context
    
- one or two charts
    
- metric/result table
    
- limited code excerpts
    
- open notebook action
    
- GitHub action
    

Do not show huge scrolling code blocks by default.

The archive should communicate **what the artifact proves**, then allow deeper inspection.

---

# 23. ARTIFACT PREVIEW VISUAL LANGUAGE

Use a dark technical frame consistent with Systems Atlas.

It may include:

- compact title bar
    
- subtle border
    
- notebook heading
    
- chart
    
- result table
    
- code/result region
    

Do not use:

- floating MacBooks
    
- browser chrome mockups that imitate a specific OS unnecessarily
    
- 3D device renders
    
- giant screenshots
    

The artifact itself is the visual evidence.

---

# 24. METADATA

Useful metadata may include:

- week
    
- workload
    
- phase
    
- source code where provided
    
- source URL
    
- completion status
    
- evidence status
    

Not all metadata should be visible at once.

### Visible metadata

Use:

`WEEK 6 · MACHINE LEARNING · CORE`

### Secondary metadata

Available in an info area or expanded state.

This keeps the primary interface clean.

---

# 25. STATUS VISUALS

Completion and evidence availability are separate concepts.

## Programme status

- upcoming
    
- in-progress
    
- complete
    

## Evidence status

- available
    
- partial
    
- private
    
- missing
    
- not-applicable
    

Do not use colour alone to communicate either status.

Use text/icon/state changes as well.

---

# 26. CROSS-TRACK VISUAL LANGUAGE

AI Fluency and Machine Learning should feel related but distinct.

### AI Fluency

Green-led accents.

### Machine Learning

Terracotta-led accents.

### Shared concepts

Neutral or mixed treatment.

### Cross-track connections

Use a controlled terracotta/accent line treatment that is visibly different from ordinary same-track relationships.

The purpose is to make the visitor notice:

> These two tracks were not actually isolated.

---

# 27. FRAMEWORK VIEW

The archive contains a later **My Working Framework** view.

Do not present the framework as a standalone motivational diagram.

Each framework step must eventually link back to the assignments that support it.

Example structure:

`DEFINE`  
→ What Are You Proving?  
→ ML-02  
→ ML-03

`TEST`  
→ Prompt Ladder  
→ ML-08  
→ ML-09  
→ Break Your Own Site

`SHIP`  
→ Empty but Live  
→ PF-04  
→ FL-07  
→ ML-11

The visual language should reuse the same Systems Atlas concept styling.

---

# 28. “WHAT I WISH I KNEW” VIEW

This should be a compact future-student reference section.

The final statements should not be invented in advance.

Each statement should be traceable to one or more assignments.

Visually, use concise numbered advice with assignment references.

Avoid inspirational quote styling.

---

# 29. FINAL REFLECTION VIEW

FL-10 is the convergence point.

It should not appear as merely another child of the agent strand.

The visual relationship should communicate:

```text
PORTFOLIO / PUBLIC WORK ──┐
                          ├──→ FL-10 FINAL PACKAGE
AGENT / SYSTEMS WORK ─────┘
                          └──→ RETROSPECTIVE
```

The final reflection page should preserve the Systems Atlas identity but become more editorial/readable than the map view.

The 500–800 word retrospective should be presented as a readable long-form document, not squeezed into the graph panel.

---

# 30. MOBILE BEHAVIOUR

The desktop composition must not simply collapse into a tiny graph.

On mobile:

1. Header becomes compact navigation.
    
2. Intro appears first.
    
3. Map becomes a vertically scrollable or focused interactive area.
    
4. Assignment selection moves below the map.
    
5. Artifact preview becomes full-width.
    
6. Connections appear as a concise related-work section.
    

Do not force a dense desktop graph onto a phone.

For mobile graph interactions:

- tap node to select
    
- provide a clear close/back state
    
- use fewer visible nodes
    
- preserve labels at readable sizes
    

---

# 31. RESPONSIVE BREAKPOINTS

Use CSS-driven responsive behaviour rather than hard-coded device-specific layouts.

Suggested reference points:

- mobile: `< 700px`
    
- tablet: `700–1023px`
    
- desktop: `1024–1439px`
    
- large desktop: `1440px+`
    

The exact breakpoints can be adjusted during implementation.

---

# 32. SPACING SYSTEM

Use an 8px base spacing system with flexibility where editorial composition requires it.

Suggested tokens:

`4px`  
`8px`  
`12px`  
`16px`  
`24px`  
`32px`  
`48px`  
`64px`  
`96px`

Use generous whitespace around:

- hero copy
    
- assignment headings
    
- graph boundaries
    
- artifact panels
    

The dark layout must not feel cramped.

---

# 33. BORDERS / RULES

Use thin rules.

Recommended default:

`1px solid rgba(233,231,223,0.16)`

Stronger active border:

`1px solid rgba(233,231,223,0.30)`

Avoid heavy boxed UI.

Borders exist to establish structure, not decoration.

---

# 34. CORNERS / RADII

Keep the interface mostly geometric.

Use small radii only where technically useful.

Recommended:

`0–4px`

Avoid:

- large 16–24px rounded cards
    
- pill-shaped containers everywhere
    
- excessive bubble UI
    

The reference design is architectural rather than soft.

---

# 35. SHADOWS

Use very little shadow.

The dark surface and borders should create separation.

For artifact previews only, a subtle shadow may be used.

Never use dramatic floating-card shadows.

---

# 36. ICONOGRAPHY

Icons should be minimal and functional.

Preferred:

- simple line icons
    
- document marker
    
- external-link indicator
    
- close icon
    
- zoom controls
    
- filter controls
    

Do not use:

- robot icons
    
- magic wand icons
    
- sparkle AI icons
    
- generic brain icons
    
- decorative 3D icon sets
    

---

# 37. MOTION

Motion should reinforce map interaction, not provide entertainment.

Recommended:

- 150–250ms hover transitions
    
- 200–350ms panel transitions
    
- subtle node scale changes
    
- graph fade/re-centering on selection
    

Avoid:

- constant motion
    
- pulsing nodes
    
- animated backgrounds
    
- parallax
    
- scrolling marquees
    
- particle systems
    
- loading animations that resemble AI activity
    

The interface should feel calm and controlled.

---

# 38. ACCESSIBILITY

Accessibility is part of the design, not an afterthought.

Requirements:

- sufficient text contrast
    
- keyboard-accessible navigation
    
- visible focus states
    
- assignment nodes reachable by keyboard
    
- graph interactions have non-graph alternatives
    
- no information encoded by colour alone
    
- readable body text
    
- reduced-motion support
    

Every graph state must have an equivalent accessible archive route.

---

# 39. NON-GRAPH FALLBACK

The user must always be able to browse:

`ALL WORK → TRACK → ASSIGNMENT → TASK / LESSON / TAKEAWAY → ARTIFACT`

This is not secondary functionality.

It is the guaranteed route for users who:

- do not understand graphs
    
- use keyboard navigation
    
- use mobile
    
- have motion preferences
    
- want to find one assignment quickly
    

---

# 40. SEARCH / FILTERS

Keep filtering restrained.

Useful filters:

`ALL`  
`AI FLUENCY`  
`MACHINE LEARNING`  
`CONCEPTS`  
`ARTIFACTS`

Optional secondary filter:

`CORE`  
`SUPPORTING`  
`REFERENCE`

Do not turn the page into a faceted analytics dashboard.

---

# 41. PAGE STRUCTURE

Recommended information architecture:

```text
HOME / MAP
│
├── INTRO
│
├── LEARNING MAP
│
├── SELECTED ASSIGNMENT
│   ├── Task
│   ├── Lesson
│   ├── Takeaway
│   ├── Artifact
│   └── Connections
│
├── WORK
│   └── Browse all assignments and artifacts
│
├── FRAMEWORK
│   ├── My Working Framework
│   └── What I Wish I Knew
│
└── REFLECTION
    ├── Final Retrospective
    ├── Programme Package
    ├── Hours Log
    └── Build-in-public post
```

---

# 42. CANONICAL CONTENT MODEL

Use the information model established in the V1 product specification.

The key semantic layers are:

```text
Assignment
    ↓
Concept
    ↓
Artifact
    ↓
Edge
```

Tracks, tiers, strands, weeks, phases, status, and evidence state are metadata.

Do not allow visual implementation to redefine the content model.

---

# 43. GRAPH DATA RULES

Each edge should include:

```ts
interface GraphEdge {
  source: string;
  target: string;
  relationship: "builds-on" | "connects-to" | "cross-track";
  confidence: "high" | "medium" | "low";
  reason: string;
  evidence?: "explicit" | "strong-inference" | "editorial";
  approved?: boolean;
}
```

Only edges with `approved: true` should appear in the public map.

This allows the archive to distinguish:

- programme-explicit dependencies
    
- strong synthesis
    
- editorial interpretation
    

without exposing that complexity to the visitor.

---

# 44. ARTIFACT DATA RULES

Artifact relationships should use:

```ts
interface ArtifactLink {
  assignmentId: string;
  artifactId: string;
  role: "produces" | "uses" | "documents" | "demonstrates";
}
```

This matters because an artifact may be:

- produced by one assignment
    
- reused by a later assignment
    
- documenting another assignment
    
- evidence of a particular skill or concept
    

Do not reduce all artifact relationships to “linked to”.

---

# 45. ASSIGNMENT METADATA

Assignment records should support:

```ts
interface Assignment {
  id: string;
  title: string;
  displayLabel?: string;
  officialCode?: string;
  track: "ai-fluency" | "machine-learning";
  week?: number;
  workloadHours?: number;
  phase?: string;
  tier: "core" | "supporting" | "reference";
  status: "upcoming" | "in-progress" | "complete";
  evidenceStatus:
    | "available"
    | "partial"
    | "private"
    | "missing"
    | "not-applicable";
  task: string;
  lesson: string;
  takeaway: string;
  sourceSummary?: string;
  sourceUrl?: string;
}
```

Do not invent an official FlyRank code when none exists.

Use stable internal IDs.

---

# 46. SOURCE RECONCILIATION REQUIREMENT

Before implementation, reconcile the full programme source inventory.

The archive must have **one canonical record per actual assignment**.

Aliases, duplicate programme views, checkpoint naming, and capstone references must resolve to the same canonical record where appropriate.

Example:

```text
Canonical ID: fl-09
Canonical title: Documentation and Demo Video
Aliases:
- Show It / Tell the Story
- Assignment 8.1
```

Do not hard-code the programme's final assignment count until this reconciliation is complete.

The archive may contain placeholder nodes only where the programme source confirms that the assignment exists.

---

# 47. VISUAL TREATMENT OF TIERS

### Core

- strongest contrast
    
- larger node
    
- full assignment panel
    
- artifact embed where appropriate
    
- visible in initial map when relevant
    

### Supporting

- medium contrast
    
- smaller node
    
- appears through track exploration
    
- normal assignment detail
    

### Reference

- quiet visual treatment
    
- often hidden until exploration
    
- still fully searchable
    
- still receives a complete archive record
    

A reference assignment is never deleted or treated as irrelevant.

---

# 48. VISUAL TREATMENT OF CONCEPTS

Concept nodes should visually feel like **labels on an atlas**.

Recommended form:

```text
┌──────────────────┐
│  PROBLEM FRAMING │
└──────────────────┘
```

Not:

```text
    ●
 PROBLEM FRAMING
```

Concepts should be visually distinct enough that the viewer immediately understands they are not assignments.

---

# 49. VISUAL TREATMENT OF SELECTED STATE

Selected assignment:

- brighter node
    
- clear outer ring
    
- label becomes more prominent
    
- immediate graph neighbourhood highlighted
    
- unrelated area fades
    

Selected concept:

- concept border strengthens
    
- linked assignments brighten
    
- cross-track paths become visible
    

Selected artifact:

- artifact preview becomes the primary right-side proof area
    

No glowing neon selection state.

---

# 50. EMPTY / UPCOMING STATE

Upcoming assignments should look like **known destinations**, not missing data.

Recommended treatment:

- outlined node
    
- lower contrast
    
- `UPCOMING` metadata where opened
    
- no fabricated description beyond confirmed programme information
    

Do not write invented Task/Lesson/Takeaway content for future assignments.

---

# 51. CONTENT TONE

The visual system supports the existing voice rules.

Copy should remain:

- direct
    
- specific
    
- conversational
    
- analytical
    
- grounded
    
- human
    

Avoid:

- corporate filler
    
- motivational language
    
- AI clichés
    
- generic career language
    
- exaggerated transformation claims
    

Never use em dashes.

---

# 52. DESIGN DO NOTS

Do not add:

- neon gradients
    
- AI robots
    
- glowing brains
    
- futuristic holograms
    
- cyberpunk grids
    
- glass cards
    
- 3D laptop mockups
    
- excessive rounded cards
    
- fake terminal windows
    
- decorative code
    
- particle backgrounds
    
- generic tech illustrations
    
- stock photography
    

Do not make it look like a SaaS analytics dashboard.

Do not make the graph occupy the entire site at all times.

Do not let visual effects overpower the assignment content or artifacts.

---

# 53. REFERENCE COMPOSITION

The approved desktop composition should approximately follow this spatial relationship:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLYRANK       MAP   WORK   FRAMEWORK   REFLECTION       TRACK FILTERS       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI FLUENCY × MACHINE LEARNING         ┌─────────────────────────────────┐ │
│                                        │ ML-09                           │ │
│  TWO TRACKS.                           │ VALIDATION AND                  │ │
│  ONE EVOLVING                          │ RESEARCH CLAIM AUDIT             │ │
│  WAY OF WORKING.                       │                                 │ │
│                                        │ TASK                            │ │
│  short orientation                     │ ...                             │ │
│                                        │                                 │ │
│  [EXPLORE MAP] [BROWSE WORK]           │ LESSON                          │ │
│                                        │ ...                             │ │
│        LEARNING MAP                    │                                 │ │
│     ○       ┌──────────┐               │ TAKEAWAY                        │ │
│       ○──── │ CONCEPT  │ ───○          │ ...                             │ │
│      /      └──────────┘     \         │                                 │ │
│    ○                         ● ML-09   │ PROOF                           │ │
│      \                           \      │ ┌─────────────────────────────┐ │ │
│        ○────── concept ───────○        │ │ VALIDATION NOTEBOOK          │ │ │
│                                        │ │ chart / table / code        │ │ │
│                                        │ │ [OPEN NOTEBOOK] [GITHUB]   │ │ │
│                                        │ └─────────────────────────────┘ │ │
└─────────────────────────────────────────────────────────────────────────────┘
```

The actual implementation should be more refined and spatially balanced than this wire representation.

---

# 54. RESPONSIVE PRIORITY

When space gets tight, preserve this order:

1. assignment title
    
2. task / lesson / takeaway
    
3. proof artifact
    
4. connection context
    
5. secondary metadata
    
6. graph detail
    

On very small screens, it is acceptable to simplify the visible graph substantially.

The user must never lose the ability to access the actual work.

---

# 55. TECHNICAL IMPLEMENTATION GUIDANCE

Use Astro for page structure and static/content rendering.

Use TypeScript for structured content and graph data.

Use CSS for the visual system.

Use Cytoscape.js for the graph interaction layer.

Keep the graph isolated to the components that need it.

Do not turn the entire application into a client-heavy SPA merely to support the map.

Recommended conceptual structure:

```text
src/
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── LearningMap.tsx / .astro + client graph module
│   ├── AssignmentPanel.astro
│   ├── ArtifactPreview.astro
│   ├── ConceptList.astro
│   ├── ConnectionList.astro
│   └── BrowseWork.astro
│
├── content/
│   ├── ai-fluency/
│   ├── machine-learning/
│   └── reflections/
│
├── data/
│   ├── assignments.ts
│   ├── concepts.ts
│   ├── artifacts.ts
│   └── graph.ts
│
└── styles/
    └── global.css
```

Do not treat these file names as mandatory. The information architecture is mandatory; the exact file decomposition can be adjusted by the implementation agent.

---

# 56. PERFORMANCE

The graph must not make the site feel heavy.

Requirements:

- lazy-load expensive graph behaviour where reasonable
    
- lazy-load below-the-fold artifact embeds
    
- avoid loading every external notebook simultaneously
    
- do not load all iframes on the initial page
    
- optimise images
    
- keep graph animation modest
    

A selected notebook should load when the user chooses it, not all notebooks on initial page load.

---

# 57. EMBED FALLBACK

External embeds may fail because of iframe restrictions, authentication, provider policies, or performance.

Every embed needs a fallback:

```text
[artifact preview]
This artifact opens externally.
[OPEN ARTIFACT]
```

Never show an empty iframe box as the only evidence path.

---

# 58. GRAPH FAILURE FALLBACK

If Cytoscape fails to load or JavaScript is unavailable:

show the browseable assignment archive.

The product must remain useful without the graph renderer.

---

# 59. DEFINITION OF VISUAL SUCCESS

The design succeeds when a first-time visitor can understand within seconds:

1. This is an archive of work across two tracks.
    
2. The tracks connect through shared ideas.
    
3. The graph is interactive navigation.
    
4. The selected work is real and inspectable.
    
5. The interface is technical but human, not futuristic or gimmicky.
    

The design fails when:

- the graph is more visually important than the work
    
- the page resembles a generic AI product
    
- the map is too dense to understand
    
- assignment content becomes difficult to read
    
- artifacts feel bolted on
    
- visual polish competes with evidence
    

---

# 60. BUILD ACCEPTANCE TEST

Before the implementation is considered visually faithful, confirm all of the following:

### Identity

-  Systems Atlas direction is obvious
    
-  Near-black green-black background is dominant
    
-  Sora + Inter are used correctly
    
-  Green and terracotta distinguish the tracks
    
-  Gold remains rare
    

### Graph

-  Concept nodes are rectangular labels
    
-  Assignment nodes are circular
    
-  Core nodes have greater weight
    
-  Lines are thin and restrained
    
-  No graph spaghetti
    
-  Default state is not overloaded
    
-  Selection fades unrelated nodes
    
-  Cross-track connections are visually distinct
    

### Content

-  Three-beat assignment structure is intact
    
-  Task/Lesson/Takeaway are easy to scan
    
-  Artifact is clearly identified as proof
    
-  Connections remain visible
    
-  User can browse without the graph
    

### Artifacts

-  Substantial core artifacts can be embedded where feasible
    
-  Embeds are lazy-loaded
    
-  External failures have fallbacks
    
-  GitHub/open-artifact actions are obvious
    

### Interaction

-  Hover is subtle
    
-  Click opens assignment context
    
-  Concept selection reveals related work
    
-  Track selection focuses the map
    
-  Keyboard access exists
    
-  Mobile interaction remains usable
    

### Restraint

-  No generic AI iconography
    
-  No cyberpunk styling
    
-  No excessive glow
    
-  No excessive rounded cards
    
-  No unnecessary animation
    
-  No decorative elements that compete with the work
    

---

# 61. WHAT REMAINS BEFORE IMPLEMENTATION

The visual direction is now selected.

The remaining non-design work is:

### A. Canonical content registry

Reconcile the complete programme source inventory and establish one canonical ID per actual assignment.

Do not use an assumed assignment count until this is done.

### B. Final evidence audit of copy

Audit every Task / Lesson / Takeaway against the original assignment cards.

The audit is evidence-only:

- remove claims that go beyond the source
    
- preserve the current voice
    
- do not rewrite for polish unless the source requires it
    

### C. Artifact registry

Decide for each assignment:

- primary artifact
    
- supporting artifacts
    
- live URL
    
- embed / preview / link mode
    
- evidence status
    

### D. Concept and edge approval

Approve the final concept mappings and graph edges.

Only approved edges enter the public map.

### E. Build dataset

Once A–D are complete, the coding agent receives:

1. PRODUCT_SPEC
    
2. DESIGN_SPEC
    
3. canonical assignment registry
    
4. artifact registry
    
5. concept registry
    
6. approved graph edges
    
7. final copy
    

At that point the implementation should be mostly mechanical rather than interpretive.

---

# 62. FINAL DESIGN PRINCIPLE

The archive should feel like **a map made for understanding**, not a website made to show off a graph.

The sophistication comes from the system:

**work → concepts → connections → evidence**

The visual system exists to make that structure visible.