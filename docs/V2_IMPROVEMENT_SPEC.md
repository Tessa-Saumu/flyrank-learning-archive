# AI Fluency Graph — V2 Improvement Specification

## 0. V2 objective

**V2 is a refinement of the completed V1, not a redesign.**

Preserve:

* the existing Systems Atlas visual language
* existing typography and color system unless accessibility fixes require changes
* existing graph data and relationships
* existing assignment content
* existing routes where they remain useful
* existing responsive behavior
* existing interaction model where it already works
* the overall restrained visual aesthetic

V2 should primarily improve:

* hierarchy
* discoverability
* assignment exploration
* evidence access
* graph legibility
* desktop usability
* accessibility
* mobile overflow

### Core principle

> **Make the existing system easier to understand without making it visually busier.**

---

# 1. Fix section/tab hierarchy

### Problem

The current page has too many visually similar tabs/section labels.

They currently read as one flat collection of navigation items rather than a hierarchy of distinct sections.

### Required change

Create a stronger visual distinction between:

**Primary sections**

and

**secondary tabs / controls within a section.**

The user should be able to understand the page structure at a glance.

### Design requirements

Primary section navigation should:

* have stronger visual weight
* have clearer spacing between sections
* read as structural navigation

Secondary tabs should:

* look lighter
* remain visually grouped
* clearly belong to their parent section

Do **not** solve this by simply making everything larger or adding decorative containers.

The hierarchy should come primarily from:

* typography
* spacing
* grouping
* active state
* alignment

### Acceptance criteria

* A first-time visitor can distinguish major sections from tabs without reading every label.
* Tabs no longer appear as one continuous flat row.
* Existing Systems Atlas visual restraint is preserved.
* No unnecessary cards, gradients, shadows, or decorative UI are introduced.

---

# 2. Convert assignment pages into assignment pop-ups

## Problem

Assignments currently navigate to individual pages.

This creates unnecessary navigation:

> homepage → assignment → back → homepage → another assignment

The user wants assignment exploration to happen **in context**.

## Required change

When an assignment is clicked from a page displaying assignment cards, **open the assignment as a modal/popup instead of navigating to a new page.**

### Important scope

This applies to:

* assignment cards
* assignment listings
* "all work" sections
* assignment collections

This **does not replace the Knowledge Graph interaction model.**

The graph remains its own exploration experience.

### Modal behavior

The modal should:

* open without changing the underlying page
* preserve the user's scroll position
* contain the complete assignment view
* be scrollable independently if content is long
* close via an explicit close control
* close via `Escape`
* prevent accidental background interaction while open
* restore focus appropriately when closed

### Visual behavior

The modal should feel like:

> **the existing assignment page placed above the current page**

rather than a completely new visual component.

Do not create a radically different card style.

### URL behavior

Do not unnecessarily remove existing assignment routes.

If the existing routes are useful for direct linking, retain them as valid pages.

The new default interaction from assignment cards should simply be:

**click → modal**

rather than:

**click → route.**

### Acceptance criteria

* Clicking an assignment card opens a modal.
* Browser page does not navigate away.
* Background scroll position is preserved.
* `Escape` closes the modal.
* Clicking the close control closes it.
* Long assignments can be fully scrolled inside the modal.
* Knowledge Graph behavior is unaffected.

---

# 3. Redesign assignment modal into two-column evidence layout

## Problem

The current assignment presentation puts evidence below the main content.

This means the user has to scroll to discover the proof.

The desired structure is:

```text
┌─────────────────────────────────────────────┐
│ Assignment                                  │
│                                             │
│ ┌──────────────────────┐ ┌───────────────┐ │
│ │                      │ │               │ │
│ │ Assignment content  │ │   Evidence    │ │
│ │                      │ │               │ │
│ │                      │ │   preview     │ │
│ │                      │ │               │ │
│ └──────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────┘
```

### Required change

Desktop assignment modal:

**Left:**

* assignment title
* description
* context
* work/process
* outcomes
* relevant metadata

**Right:**

* evidence panel

The evidence panel should remain visually distinct from the main content.

### Evidence panel

Each assignment must have an evidence area.

It should initially show:

* evidence preview image/thumbnail
* evidence title/type
* short description if useful
* `Show evidence` interaction

The actual heavy asset should **not automatically load into the page.**

---

# 4. Lazy-load assignment evidence

This is an important part of the design.

### Desired interaction

Initial state:

```text
┌───────────────────────┐
│ Evidence              │
│                       │
│ [preview image]       │
│                       │
│ Assignment PDF        │
│                       │
│ [ Show evidence ]     │
└───────────────────────┘
```

After clicking:

```text
┌───────────────────────┐
│ Evidence              │
│                       │
│ [embedded PDF/video]  │
│                       │
└───────────────────────┘
```

### Required behavior

Do **not** eagerly embed every PDF/video.

Evidence should be loaded only when the user requests it.

This is specifically intended to prevent:

* unnecessarily large initial payloads
* multiple PDFs/videos loading simultaneously
* excessive browser memory use
* unnecessary context on the page

### Supported evidence types

The evidence system should support at minimum:

* PDF
* video

Design the evidence component so additional types can be added later without rewriting the assignment modal.

### Acceptance criteria

Every assignment has an evidence panel.

Every evidence panel:

* has a preview
* identifies the evidence
* has a `Show evidence` control
* lazy-loads the heavy asset
* supports the appropriate embedded viewer

---

# 5. Standardize assignment-card typography

## Problem

The current cards have inconsistent font sizing.

This makes the collection feel visually uneven.

### Required change

Create a **single canonical assignment-card typography system.**

Define explicit tokens for:

* assignment label
* title
* description
* metadata
* evidence/status text
* CTA/action text

Do not individually tune fonts per card.

### Requirement

Cards containing longer or shorter titles should maintain the same typographic hierarchy.

If content length varies, solve that through:

* controlled line wrapping
* consistent card dimensions where appropriate
* spacing
* truncation only where explicitly appropriate

Do not randomly reduce font size to make individual cards fit.

### Acceptance criteria

* All assignment cards use the same typography tokens.
* Same semantic content uses same font size.
* Card hierarchy is visually consistent.
* No card requires one-off font overrides.

---

# 6. Increase laptop navigation scale

## Problem

The desktop/laptop navigation is currently too small.

The target platform is primarily **laptop/desktop**.

### Required change

Increase navigation text and/or navigation item spacing to improve readability.

Do not dramatically enlarge the entire navigation bar.

The goal is:

> **comfortable laptop reading, not oversized navigation.**

### Preserve

* existing navigation structure
* existing visual language
* responsiveness
* mobile navigation behavior

### Acceptance criteria

At typical laptop viewport widths:

* navigation labels are immediately legible
* navigation does not feel cramped
* navigation does not overflow
* hierarchy remains clear

---

# 7. Add labels/descriptors to Knowledge Graph nodes

## Problem

The graph currently contains nodes that appear largely as dots/squares with connections.

Without labels, the graph does not communicate enough information.

The user cannot understand what a node represents without interacting with it.

### Required change

Every assignment node must display a **short descriptor directly on or beside the node.**

Examples of the desired form:

* `Survive the Crit`
* `Build the Pipeline`
* `Ship the System`
* `Evaluate the Model`

The exact labels should come from the canonical assignment naming/content system.

### Important constraint

Do **not** display long descriptions directly on the graph.

Use:

> **shortest useful descriptor**

The graph label should identify the assignment, not explain it.

### Node label requirements

Labels should:

* remain readable at the default zoom
* have consistent typography
* avoid overlapping where possible
* preserve graph relationships
* work at different zoom levels

---

# 8. Improve Knowledge Graph hover behavior

### Required change

Hovering over an assignment node should provide additional context.

The hover state should reveal:

* full assignment name
* optionally a short description

The graph itself should remain concise.

Therefore:

**Graph node = short descriptor**

**Hover = fuller explanation**

### Example

Graph:

> `Survive the Crit`

Hover:

> **Survive the Crit**
> Defend your analytical work against structured critique and revision.

### Acceptance criteria

* Hover clearly identifies the node.
* Full assignment name is available.
* Hover does not permanently clutter the graph.
* Tooltip positioning works near graph edges.
* Tooltip does not obstruct the node unnecessarily.

---

# 9. Fix Knowledge Graph interaction model

There are several separate issues here.

## 9.1 Add graph interaction instructions

The graph currently requires interaction knowledge that is not obvious.

Add a compact instruction panel/legend explaining:

* how to zoom
* how to pan/drag
* how to exit/reset the interaction mode
* `Escape` behavior where applicable

Use concise language.

For example:

> **Explore the map**
> Scroll/pinch to zoom · Drag to move · Esc to exit

The exact wording should match the actual implemented controls.

### Important

Do not make this a large instructional block.

It should be discoverable but visually subordinate to the graph.

---

# 10. Fix graph relationships and artifacts

## 10.1 Arrowheads must be visually clear

### Problem

Graph connections currently look like plain lines.

This makes directionality unclear.

### Required change

Make directional edges unmistakably directional.

Arrowheads should:

* be visible at normal zoom
* remain visible against the graph background
* clearly indicate direction
* not dominate the graph visually

### Acceptance criterion

A user can distinguish:

**A → B**

from:

**A — B**

without needing to hover or inspect the line.

---

## 10.2 Connect concept nodes correctly

### Problem

Concept/square nodes are currently floating without meaningful connections.

This makes them look accidental rather than structural.

### Required change

Audit the graph data and rendering logic.

Every concept node displayed in the graph must have a meaningful relationship to the graph.

Possible valid states:

```text
Assignment → Concept
```

or

```text
Concept → Assignment
```

or another relationship explicitly defined by the graph data model.

No concept node should appear as an isolated floating square unless isolation is intentionally represented in the canonical graph data.

### Acceptance criteria

* No accidental orphan concept nodes.
* Every displayed concept has at least one intentional relationship.
* Relationships correspond to the canonical graph data.
* Rendering does not visually detach related nodes.

---

# 11. Show artifacts by default

## Problem

Artifacts currently appear only after interacting with the filter.

This hides useful information behind an unnecessary interaction.

### Required change

Artifact nodes should be **visible by default**.

The current artifact set exposed through the filter should become the default graph state.

### Important distinction

Default visibility does not mean:

> make artifacts visually dominant.

Artifacts should remain visually subordinate to assignments/concepts.

### Filters

The existing filtering mechanism can remain.

The default state should simply be:

```text
Assignments: visible
Concepts: visible
Artifacts: visible
```

unless the canonical V1 data model explicitly specifies otherwise.

### Acceptance criteria

On initial graph load:

* artifact nodes are visible
* their relationships are visible
* no filter interaction is required
* filtering can still hide them

---

# 12. Move "Explore the Map" CTA

## Problem

The current `Explore the Map` button is immediately underneath the map.

Clicking it provides almost no meaningful movement because the user is already beside the map.

### Required change

Move the CTA to the **end of the homepage assignment/work section.**

The intended journey becomes:

```text
Hero
 ↓
Map preview
 ↓
Assignments / all work
 ↓
Explore the Map
```

The CTA therefore becomes a deliberate transition:

> "I've seen the work. Now I want to explore how it connects."

### Behavior

Clicking `Explore the Map` should take the user to the actual full Knowledge Graph experience.

It should not simply move the viewport a few pixels.

### Acceptance criteria

* Button is no longer directly beneath the map preview.
* Button appears after the assignment/work section.
* Clicking it produces meaningful navigation to the map.
* User understands why they are being invited to explore the map.

---

# 13. Make the homepage map preview collapsible

## Problem

The homepage map preview shares space with another panel, limiting the graph's usable size.

### Required change

The map preview area should support a collapsed/expanded state.

### Collapsed state

The existing homepage composition remains compact.

### Expanded state

The graph receives substantially more horizontal/vertical space.

The adjacent information panel should collapse or recede.

Conceptually:

```text
NORMAL

┌───────────────┬───────────────┐
│               │               │
│     GRAPH     │   CONTEXT     │
│               │               │
└───────────────┴───────────────┘


EXPANDED

┌────────────────────────────────┐
│                                │
│             GRAPH              │
│                                │
│                                │
└────────────────────────────────┘
```

### Acceptance criteria

* User can expand the graph.
* User can collapse it again.
* Expansion does not break page layout.
* Graph receives meaningfully more space.
* The existing design language is preserved.

---

# 14. Fix V1 accessibility failures

These are **implementation fixes, not design changes.**

## 14.1 ARIA

Current problem:

`aria-pressed` is being applied to `<a>` elements.

This is invalid because `aria-pressed` is intended for toggle buttons.

### Required fix

Either:

**Preferred:**

Convert filter controls to actual `<button>` elements.

Or:

Use an appropriate ARIA role if the semantic model genuinely requires links.

Do not simply add `role="button"` without considering keyboard behavior and semantics.

### Acceptance criterion

Axe no longer reports:

`aria-allowed-attr`

---

# 15. Fix color contrast

Current failures:

| Pair                   | Current ratio | Requirement |
| ---------------------- | ------------: | ----------: |
| `#3c6956` on `#101312` |        2.97:1 |       4.5:1 |
| `#7f807b` on `#151817` |        4.49:1 |       4.5:1 |
| `#b9664e` on `#151817` |        4.31:1 |       4.5:1 |

### Required change

Adjust the relevant text tokens until they pass WCAG AA for their actual rendered size.

Do **not** simply change the entire palette.

Preserve the existing Systems Atlas palette as closely as possible.

### Important

The existing `#4D8A70` green should also be evaluated at its actual small-text usage rather than assuming that passing at large-text size is sufficient.

### Acceptance criteria

Run Axe after implementation.

No color-contrast failures remain.

---

# 16. Fix reflection page mobile overflow

## Problem

`/reflection/` overflows at a 375px viewport.

### Required change

Identify the exact overflowing element rather than adding a global:

```css
overflow-x: hidden;
```

as a superficial fix.

The likely source is the convergence diagram or another intentionally wide component.

### Fix requirements

The content must:

* fit within 375px
* retain its intended structure
* wrap or scale appropriately
* not cause horizontal page scrolling

### Acceptance criterion

At:

```text
375 × appropriate mobile height
```

the page has no horizontal overflow.

---

# 17. Regression requirements

After all V2 changes, rerun the complete existing test suite.

The current V1 baseline is:

| Area               |       Result |
| ------------------ | -----------: |
| Playwright tests   | 27/33 passed |
| Map interaction    |        11/11 |
| Adapter unit tests |        10/10 |
| Phase 3            |          6/7 |
| Design review      |       Passed |
| Accessibility      |   5 failures |
| Mobile             |    1 failure |

### V2 target

The goal is:

| Area            |            V2 target |
| --------------- | -------------------: |
| Playwright      |            **33/33** |
| Adapter         |            **10/10** |
| Map interaction |            **11/11** |
| Phase 3         |              **7/7** |
| Accessibility   | **0 Axe violations** |
| Mobile overflow |                **0** |
| Design review   |             **Pass** |

---

# 18. Implementation order

I would **not** give the AI all of these as one giant instruction and say "fix everything."

Use this order:

### Phase 1 — Structural interaction

1. Assignment modal
2. Two-column assignment layout
3. Evidence panel
4. Lazy evidence loading
5. Typography normalization

### Phase 2 — Knowledge Graph

6. Node descriptors
7. Hover information
8. Interaction instructions
9. Arrowheads
10. Concept relationships
11. Default artifact visibility
12. Expandable homepage graph

### Phase 3 — Navigation

13. Section/tab hierarchy
14. Laptop navigation sizing
15. Move `Explore the Map` CTA

### Phase 4 — QA

16. ARIA fix
17. Contrast fixes
18. `/reflection/` mobile overflow
19. Full regression test
20. Final visual review

That ordering matters because **the modal and graph changes affect the component architecture**, whereas the accessibility and contrast fixes are much safer to do after the structural work is settled.

---

# 19. V2 non-goals

This is important for the coding AI.

**Do not:**

* redesign the Systems Atlas aesthetic
* introduce new colors without necessity
* add gradients
* add excessive shadows
* turn everything into cards
* redesign the entire homepage
* replace the Knowledge Graph library
* rewrite the graph data model unnecessarily
* remove existing assignment routes
* add unnecessary animations
* make the graph permanently full-screen
* hide information just to make the interface cleaner
* introduce a dashboard-style UI
* optimize primarily for mobile at the expense of the laptop experience

The V2 goal is **clarity and interaction quality**, not visual novelty.