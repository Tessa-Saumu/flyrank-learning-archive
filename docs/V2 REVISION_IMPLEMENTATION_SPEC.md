# V2 REVISION IMPLEMENTATION SPEC

## Goal

Implement the following revisions to the current V2 website.

**Important:** Preserve the existing visual direction, structure, typography, and overall design language. These are targeted corrections and interaction improvements, not a redesign.

Work in **3 phases**. Complete and verify each phase before moving to the next.

---

# PHASE 1 — GRAPH, NODE LAYOUT & GRAPH PANEL

## 1. Concept container must fit its content

The box/container surrounding each concept currently does not expand correctly to accommodate its text.

### Required change

Make concept nodes dynamically size themselves so:

* all text remains inside the node
* no text spills outside the container
* the node has appropriate internal padding
* longer concept names wrap naturally
* the box grows vertically/horizontally as required rather than clipping or overflowing

Do not solve this by simply making every concept node excessively large. The sizing should remain compact and content-driven.

---

## 2. Multiple artifacts must spread around the concept

When a concept has more than one artifact, the artifact nodes currently stack directly on top of one another.

### Required change

Update graph positioning so multiple artifacts connected to the same concept are distributed spatially around the concept node.

Requirements:

* artifact nodes must not overlap
* each artifact should remain individually readable
* spacing between artifacts should be intentional and consistent
* positioning should remain stable and understandable as artifact count increases

The layout should communicate the relationship between the central concept and its associated artifacts at a glance.

---

## 3. Artifact nodes must be visually distinct from concept nodes

Artifact nodes currently use the same shape and color treatment as concept nodes, which makes the two node types difficult to distinguish.

### Required change

Use a **triangle** for artifact nodes.

Concept nodes should retain their existing shape.

Artifact nodes must also use a clearly different color from concept nodes.

The distinction should be immediately obvious without requiring the user to read labels.

---

## 4. Increase graph node color contrast

The current graph colors still feel too muted/dull.

### Required change

Increase visual contrast between the different node types while remaining consistent with the site's existing visual identity.

The objective is:

* stronger differentiation between concept and artifact nodes
* better readability at a glance
* more visual energy
* no neon or overly saturated treatment

The graph should feel clearer and more legible, not louder.

---

## 5. Reduce the graph detail panel width

When a graph node is selected, the detail panel opens from the side and currently takes approximately 50% of the available width.

This is too large.

### Required change

Make the node detail panel substantially narrower.

The graph is the primary content and must remain visually dominant.

Target behavior:

* graph remains the main visual area
* detail panel occupies a smaller secondary portion
* panel should still have enough width for its content
* avoid a 50/50 split

Treat this as a **graph-first layout**, not a two-column equal split.

---

## 6. Remove the Tier filter completely

There is a Tier filter tab at the top of the interface.

The Tier system is no longer wanted.

### Required change

Remove the Tier filter/tab and its associated terminology completely from the public interface.

This includes:

- Tier
- Tier-related filtering/reference labels
- any UI that exists specifically to support that Tier filtering system

Do not replace it with another Tier control.

The remaining work/category filtering should simply use the actual categories such as:

- **AI Fluency**
- **Machine Learning**

---

## 7. Add an Escape control to the graph detail panel

When a node is selected, the detail panel opens.

The user should not have to discover how to close it.

### Required change

Add a clear **Escape/close control** to the panel.

Expected behavior:

* clicking the control closes the panel
* pressing the keyboard `Escape` key should also close the panel
* closing the panel returns the user cleanly to the full graph view

This is a discoverability improvement, not just a technical close action.4

## 8. Add explicit graph navigation controls

The graph currently relies heavily on gestures/interactions such as double-clicking, dragging, and other pointer/finger interactions for navigation.

This is not sufficiently accessible or discoverable.

### Required change

Add visible graph navigation buttons for:

- **Zoom in**
- **Zoom out**
- **Pan left**
- **Pan right**

These controls are **additive**.

Do not remove the existing graph navigation functionality. The existing mouse/touch interactions may remain, but users must also have explicit button controls.

The buttons should:

- be visually discoverable
- have clear labels/icons
- work reliably
- provide accessible labels for assistive technology
- remain usable on smaller screens

The objective is to make graph navigation possible without requiring users to discover gestures.

---

## PHASE 1 ACCEPTANCE CRITERIA

Before moving to Phase 2 verify:

* No concept text overflows its container.
* Multiple artifacts never stack directly on top of each other.
* Artifact nodes are triangles.
* Artifact and concept nodes are clearly differentiated by color and shape.
* Graph colors have noticeably stronger contrast.
* The graph detail panel is clearly narrower than the graph itself.
* All T1/supporting/reference footer terminology has been removed.
* The graph panel can be closed via a visible control and the `Escape` key.
* Existing graph functionality still works.

---

# PHASE 2 — ASSIGNMENTS & WEBSITE-WIDE INTERACTION

## 9. Fix the artifact filter on the graph

The artifact filter is currently not functioning correctly on the graph.

### Required change

Make the artifact filtering behavior actually filter the graph.

When the user selects an artifact/filter category:

* the graph must update accordingly
* irrelevant nodes/relationships should be hidden according to the intended filter behavior
* the selected filter state must visibly correspond to the graph state
* clearing/resetting the filter must restore the full graph

Do not leave the filter as a purely visual control.

---

## 10. Make assignment opening behavior a website-wide convention

Currently only the home page uses the desired assignment popup behavior.

### Required change

Across the **entire website**, clicking an assignment should open the assignment in a **modal/popup** rather than navigating to a separate red/full assignment page.

This becomes a **site-wide interaction convention**.

Applies to:

* home page assignments
* work/projects browsing pages
* assignment cards anywhere else on the website

### Important distinction

This rule applies to **assignment interactions**.

It does **not** replace or interfere with the graph's node detail side panel.

The graph node panel remains a side panel.

### Expected behavior

Click assignment card → assignment opens in modal.

Do not:

Click assignment card → navigate to a standalone assignment page.

Use one consistent assignment modal implementation across the website rather than separate implementations per page.

---

## 11. Remove awkward vertical gap between graph and explanatory section

There is currently an awkward amount of empty space between the graph and the section beginning with:

**What is this? / Who's this for?**

### Required change

Reduce/fix the spacing so the explanatory section follows the graph naturally.

Do not compress the graph itself.

The goal is to remove the accidental-looking empty gap and restore intentional vertical rhythm.

---

## 12. Style the explanatory section headings

The headings such as:

* **What is this?**
* **Who's this for?**

currently appear flat gray and visually weak.

They look disconnected from the rest of the design.

### Required change

Give these section headings a stronger visual treatment.

Use the site's **green** as the heading color.

The headings should feel like intentional section anchors rather than secondary afterthoughts.

Do not introduce a new unrelated accent color.

---

## 13. Remove duplicate assignment headings

There is currently a major bug where an assignment title/heading is rendered twice.

Example:

**What are you proving?**

appears, followed immediately by another:

**What are you proving?**

### Required change

Each assignment section heading must render **once only**.

Audit both:

* assignment modal view
* any assignment content rendered elsewhere

The content source should have one canonical heading rather than the component adding a duplicate heading on top of content that already contains one.

This is a functional/content rendering bug and must be fixed everywhere.

---

## 14. Fix paragraph/content width responsiveness

Assignment and website paragraphs are currently behaving incorrectly when line breaks are introduced.

For example, text can become unnaturally compressed toward the left despite significant available horizontal space.

### Required change

Make text containers properly responsive to the available width.

Paragraphs should:

* use the available content width appropriately
* wrap naturally
* maintain readable line length
* respond correctly when the viewport changes
* avoid fixed/narrow widths that leave unexplained empty space
* preserve intentional manual paragraph breaks

Do not force every paragraph to stretch infinitely. Use sensible max-width/readability constraints while ensuring the layout responds correctly to the actual container width.

### Important

This affects the **website paragraphs generally**, not just one assignment.

Test on:

* desktop
* narrower desktop/tablet widths
* mobile

---

## PHASE 2 ACCEPTANCE CRITERIA

Before moving to Phase 3 verify:

* Artifact filtering actually changes the graph.
* Artifact selection uses the new dropdown.
* Clicking an assignment anywhere on the website opens the assignment modal.
* Assignment cards do not navigate to the old standalone/red assignment page.
* Graph side-panel behavior remains separate and unchanged.
* The awkward graph-to-explanation gap is resolved.
* "What is this?" and "Who's this for?" use the site's green.
* Assignment headings are never duplicated.
* Paragraphs respond correctly to container width and viewport size.

---

# PHASE 3 — WORK FILTERS, TERMINOLOGY & FINAL CLEANUP

## 15. Fix the Work filters

The filters for categories such as:

* AI Fluency
* Machine Learning

are currently not functioning.

They fail in both locations:

1. the dedicated Work page
2. the Work section on the Home page

### Required change

Make the filtering logic functional in both locations.

The same filtering behavior and category definitions should be used across both implementations.

When a category is selected:

* only matching work should be shown
* active filter state should be obvious
* clearing/resetting should restore all work
* filtering should work without navigating away

Do not implement separate, contradictory filtering logic for Home and Work.

Prefer one shared filtering model/component where practical.

---

## 16. Remove all tier concept / supporting-reference terminology

The previous system included tier concepts and terminology such as:

* supporting
* reference
* supporting reference
* tier concepts

These should no longer exist in the public website experience.

### Required change

Remove this terminology and the associated UI completely.

This applies to:

* Home page
* Work page
* graph
* filter controls
* supporting labels
* explanatory text
* footer/reference text
* any other visible UI

The Work browsing/filter experience should now simply use the actual categories:

**AI Fluency**

**Machine Learning**

Do not leave inactive/hidden remnants of the old tier system in the interface.

---

# FINAL SYSTEM-WIDE CONSISTENCY CHECK

After all three phases are implemented, perform a final pass across the complete website.

Verify that:

### Graph

* Concept nodes fit their content.
* Artifact nodes are triangles.
* Artifact nodes have distinct colors.
* Artifact nodes distribute around concepts instead of overlapping.
* Graph colors have stronger contrast.
* Detail panel is secondary to the graph.
* Detail panel has visible close control + Escape support.
* T1/supporting/reference footer is gone.
* Artifact filtering works.
* Artifact selector is a dropdown.

### Assignments

* Every assignment opens in a modal.
* This behavior is consistent across the entire website.
* Graph node detail panels remain separate from assignment modals.
* Assignment headings are not duplicated.
* Assignment content is responsive.

### Work browsing

* AI Fluency filter works.
* Machine Learning filter works.
* Filters work on both Home and Work.
* Old tier/supporting/reference terminology is completely removed.

### Layout

* No accidental large gaps.
* Explanatory headings use green.
* Paragraph widths respond properly across viewport sizes.
* No text overflow or clipped content.
* No regressions to the existing visual system.

## Implementation principle

Do not patch individual instances where a shared component, layout rule, or filtering model should be fixed at the source.

Where the same behavior appears in multiple places, implement the fix at the shared/system level so the behavior remains consistent throughout the site.

Do not redesign unrelated areas of the website.

The goal is to correct the existing V2 implementation while keeping its current visual identity and structure intact.
