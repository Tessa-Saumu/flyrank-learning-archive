# FlyRank Learning Archive — Implementation Plan

**Status:** Ready for implementation
**Basis:** `docs/PRODUCT_SPEC.md`, `docs/DESIGN_SPEC.md`, `docs/CONTENT_REGISTRY.md`
**Stack (locked):** Astro 7 + TypeScript + CSS + Cytoscape.js. No backend. No additional UI framework unless justified in writing.
**Visual direction (locked):** Systems Atlas.

---

## 0. Context and Ground Rules

### 0.1 Current repository state

| Area | State |
|---|---|
| `src/pages/index.astro` | Default Astro starter template, to be replaced |
| `src/data/assignments.ts`, `concepts.ts`, `artifacts.ts`, `graph.ts` | Exist but are **empty** (0 bytes) |
| `src/components/{AssignmentCard,ArtifactCard,ConceptCard,DetailPanel,FilterBar,LearningMap}.astro` | Exist but are **empty** |
| `src/layouts/`, `src/styles/` | Do not exist yet |
| `package.json` | `astro ^7.2.9`, `cytoscape ^3.34.2`, `@types/cytoscape`. Node `>= 22.12.0`. No test tooling yet |
| `node_modules` | Not installed yet |
| `docs/` | Three authoritative documents, all in "locked / reviewed" state |
| Deployment | Assumed: existing Netlify workflow (no `netlify.toml` in repo yet, see Phase 3) |

The empty scaffold files already match the file layout recommended by DESIGN_SPEC §55 and PRODUCT_SPEC §26, so the plan keeps those paths. Component names are explicitly *not* mandatory in the specs; where scaffold names differ from spec suggestions (e.g. scaffold `DetailPanel.astro` vs spec `AssignmentPanel.astro`), the scaffold name wins and the spec component is treated as its functional equivalent.

### 0.2 Source authority and precedence

1. **`CONTENT_REGISTRY.md` is the authority for data**: canonical IDs, titles, tiers, weeks, workload, phases, copy verdicts, artifact registry, and approved edges. AGENTS.md requires using its IDs **exactly as written**.
2. **`DESIGN_SPEC.md` is the authority for visuals**: colour tokens, typography, graph behaviour, spacing, radii, motion, accessibility, and the §60 build acceptance test.
3. **`PRODUCT_SPEC.md` is the authority for product logic**: information architecture, data model interfaces, user flows, status model, Definition of Done (§38), and the build order (§39).
4. Where documents differ, the more recently revised spec wins (CONTENT_REGISTRY states this explicitly). Notably, the **locked concept mapping in CONTENT_REGISTRY §4.1 / DESIGN_SPEC §4.1 supersedes** the earlier concept list in PRODUCT_SPEC §12 (e.g. `concept-human-judgment` includes 10 assignments in the locked registry).

### 0.3 Data volumes (encoded from the locked registry, not assumed)

| Layer | Count | Source |
|---|---|---|
| Canonical assignments | 35 (10 ML spine + 25 AI Fluency) | CONTENT_REGISTRY §1.1 |
| Non-assignment source records | 2 (do NOT become nodes) | CONTENT_REGISTRY §1.2 |
| Concepts | 10 | CONTENT_REGISTRY §4.1 |
| Concept-to-assignment mappings | 57 instances across the 10 concepts | CONTENT_REGISTRY §4.1 |
| Shared artifact records | 11 | CONTENT_REGISTRY §3.3 |
| Approved direct assignment edges | 30 (29 `builds-on` + 1 `connects-to`) | CONTENT_REGISTRY §4.2 |
| Approved cross-track edges | 4 | CONTENT_REGISTRY §4.3 |
| **Public edges total** | **34** | |
| Explicitly rejected direct edges | 5 (mediated by concepts instead) | CONTENT_REGISTRY §4.4 |
| Tier split | 18 core / 15 supporting / 2 reference | CONTENT_REGISTRY §1.1 |

**Rule:** these numbers are encoded in data files and asserted by the validator. They are never hard-coded in UI copy, nav, or counts. The UI says things like "the assignments in this archive", never a literal total.

### 0.4 Copy rules (applied everywhere, enforced by validation)

- Use **only** the V1 copy in PRODUCT_SPEC §15, with the three registry-mandated safeguards:
  1. **ML-03:** use the revised spec wording. Never the older "most projects fall apart" sentence.
  2. **FL Ship (`fl-empty-live-page`):** use the revised spec wording. Never the stronger older "obstacle is not design or content" claim.
  3. **FL-04:** source-safe edit to the Task beat: *"Build an end-to-end automated pipeline that runs on a brand new input..."* (drop "without your intervention"). Record the edit and its provenance in a comment on the data entry.
- Remove any duplicated FL Identity Task/Lesson/Takeaway blocks if present in source.
- Voice: direct, plain, analytical, grounded. No corporate filler, no motivational language, no AI clichés. **Never use em dashes.**
- Never write invented Task/Lesson/Takeaway for any assignment. Upcoming-state assignments (none in V1, but the model must support it) show confirmed metadata only.

### 0.5 Cross-cutting conventions

- **Testing tooling:** Phase 1 adds a plain-Node data validator (`scripts/validate-data.mjs`, `npm run validate`) and `astro check`. Phase 2 adds Playwright for interaction verification. Phase 3 adds Lighthouse CI + axe-core. No framework needed before that.
- **Commits:** one logical commit per task below. Each phase ends with a green `npm run validate && npm run build && npx astro check`.
- **Branching:** all work lands on the current session branch; phases are sequential and each is independently shippable (the site is browsable after every phase).
- **Performance budget (carried through all phases):** the graph is the only significant client JS. No graph code ships on non-map pages. No iframe loads on initial page load.
- **Spec phase mapping** (PRODUCT_SPEC §39's six phases folded into the three phases required by the project brief):

| Plan phase | Product spec build order |
|---|---|
| Phase 1 | Spec Phase 1 (content and data) + Spec Phase 2 (non-graph archive) + design-system foundation |
| Phase 2 | Spec Phase 3 (Learning Map) |
| Phase 3 | Spec Phase 4 (embeds and evidence) + Spec Phase 5 (responsive/a11y) + Spec Phase 6 (polish) + deployment |

---

## PHASE 1 — Foundation: Data Layer and Non-Graph Archive

**Goal:** A fully browsable, statically-rendered archive with zero JavaScript required for content, where every piece of content is typed, validated, and sourced. The graph is deliberately not present yet. Per PRODUCT_SPEC §39: *"Build the information system first. Do not begin with animation. Do not begin with graph aesthetics."*

**Rough effort:** 4–6 person-days.

### 1.1 Task breakdown and deliverables

#### Task 1.1 — Toolchain and design system foundation

1. `npm install`; verify `npm run build` and `npx astro check` pass on the starter.
2. **Self-host fonts** with `@fontsource-variable/sora` + `@fontsource-variable/inter` (keeps the static site free of external font CDNs; falls back to system stack if loading fails).
3. Create `src/styles/global.css` implementing the Systems Atlas token system as CSS custom properties:
   - Colour: `--bg #101312`, `--text #E9E7DF`, `--green #315D4B` (AI Fluency identity), `--terracotta #B9664E` (ML identity + cross-track accent), `--gold #B9A36A` (rare metadata accent only), `--graph-grey #5B625D`.
   - Rules: `1px solid rgba(233,231,223,0.16)` default, `rgba(233,231,223,0.30)` active (DESIGN_SPEC §33).
   - Spacing scale: 4/8/12/16/24/32/48/64/96 (§32).
   - Type scale with `clamp()`: hero 48–64px, assignment title 32–48px, section 20–28px, body 14–17px, metadata 9–11px uppercase with `0.06em–0.10em` tracking (§07).
   - Radii 0–4px, near-zero shadows (artifact previews only), 150–250ms/200–350ms transition tokens (§34, §35, §37).
   - Base reset, focus-visible styles, `prefers-reduced-motion` guard, skip-link style.
4. **Fonts + meta:** Sora for headings (500–600), Inter for body/metadata (400–600). Load Sora 500/600 and Inter 400/500/600 only.
5. Create `src/layouts/Base.astro`: semantic HTML shell, `<head>` with title/description/canonical/OG template fields, skip-to-content link, header, footer.
6. Build the **Header** per DESIGN_SPEC §08: left `FLYRANK` / `LEARNING ARCHIVE` descriptor; centre nav `MAP · WORK · FRAMEWORK · REFLECTION`; right `AI FLUENCY · MACHINE LEARNING` (track links to track index pages). Compact height, thin bottom rule, subtle active-section indicator, no pills. In Phase 1, `MAP` links to the homepage map section placeholder (which is the browse index in Phase 1) and FRAMEWORK/REFLECTION link to stub pages that get real content in Phase 3.
7. Build the **Hero / orientation panel** per DESIGN_SPEC §09: eyebrow `AI FLUENCY × MACHINE LEARNING` (green/terracotta per track), headline **"Two tracks. One evolving way of working."** with deliberate line breaks, supporting line `A visual archive of what I built, what the work taught me, and how the pieces connect.`, subordinate line `Built for the next person trying to find their footing.`, primary CTA `EXPLORE THE MAP` (filled) + secondary `BROWSE THE WORK` (quiet). Both CTAs scroll/anchor to the browse index in Phase 1.

**Deliverable D1.1:** a running site with the correct identity (background, type, header, hero) and a lint-clean build.

#### Task 1.2 — Typed content data layer (the heart of Phase 1)

Create `src/data/types.ts` with the interfaces from PRODUCT_SPEC §27 and DESIGN_SPEC §43–45 (`Assignment`, `Concept`, `Artifact`, `ArtifactLink`, `GraphEdge`), extending `Assignment` with `sourceAliases`, `strand` (`"portfolio-public-work" | "ai-systems-agents" | "ml-spine"`), and `displayLabel`. Keep `status` and `evidenceStatus` as separate unions exactly as specified.

1. **`src/data/assignments.ts` — 35 canonical records**, one per row of CONTENT_REGISTRY §1.1:
   - `id` **exactly** as the registry writes it (e.g. `ml-09-validation-claim-audit`, `fl-portfolio-proof`, `pf-04-personal-website`).
   - `officialCode` only where the registry provides one (`ML-01`…`ML-12`, `FL-01`, `FL-02`, `FL-04`, `FL-05`, `FL-06`, `FL-07`, `FL-09`, `FL-10`, `PF-04`); **leave `undefined`** for the 15 FL assignments without a code. Do not invent codes.
   - `week`, `workloadHours` (omit for `fl-explain-build`, `fl-crit-review`, `fl-10` where the registry is blank), `phase` (verbatim strings, e.g. `"Build core"`, `"Setup / Onboarding"`), `tier`, `strand`.
   - `status: "complete"` for all 35 (the archive documents a completed programme; one-field change if any assignment is actually still in progress).
   - `evidenceStatus: "partial"` for all (registry §3 rule: nothing is `available` until a real URL/file is attached).
   - `task` / `lesson` / `takeaway` **verbatim** from PRODUCT_SPEC §15 with the three safeguards from §0.4.
   - `sourceAliases` from the registry's alias column (e.g. `fl-09-documentation-demo` ← `["Show It / Tell the Story", "Assignment 8.1"]`).
   - The two §1.2 non-assignment source records are documented as a comment block, not data nodes.
2. **`src/data/concepts.ts` — 10 concepts** with the locked IDs (`concept-problem-framing` … `concept-communication`), descriptions from CONTENT_REGISTRY §4.1, and the approved `assignments` arrays exactly as locked (57 mapping instances).
3. **`src/data/artifacts.ts`** —
   - The 11 shared artifact records from registry §3.3 (`artifact-ml-repo`, `artifact-ml-paper`, `artifact-portfolio-site`, `artifact-personal-agent`, `artifact-agent-readme`, `artifact-agent-demo-video`, `artifact-automation-workflow`, `artifact-learning-archive`, `artifact-build-in-public-post`, `artifact-hours-log`, `artifact-final-retrospective`) with `type`, `description`, preferred display, `url: undefined` until real URLs are supplied.
   - **Assignment-level artifact decisions** from registry §3.2 encoded as `ArtifactLink` records: each assignment's primary proof artifact, its display mode (`embed`/`preview`/`link`), and role (`produces`/`uses`/`documents`/`demonstrates`). Per ASSIGNMENT §44: the same artifact may appear with different roles for different assignments; never collapse to "linked to".
4. **`src/data/graph.ts`** —
   - The 30 approved direct edges (registry §4.2) and 4 approved cross-track edges (§4.3), each with `source`, `target`, `relationship`, `confidence`, `evidence` (`explicit`/`strong-inference`/`editorial`), `reason`, `approved: true`.
   - A `rejectedEdges` array (registry §4.4) encoding the 5 relationships explicitly NOT drawn, with the mediating concept named, so future edits stay auditable.
   - Concept-mediated relationships are expressed via the concept mapping, never as extra edges (DESIGN_SPEC §13, §43).
5. **`scripts/validate-data.mjs` + `npm run validate`** — a dependency-free Node script that fails the build on any violation:
   - Exactly 35 assignments; IDs unique; IDs match the registry list verbatim (hard-coded expected set for the audit, flagged `AUDIT SET` in comments).
   - Every edge source/target, artifact link, and concept mapping resolves to an existing ID (both directions).
   - Only `approved: true` edges exist in the public array; `rejectedEdges` entries are asserted to NOT appear in the public array.
   - Copy integrity: each Task/Lesson/Takeaway is compared against the approved strings (checksum or exact match), so accidental rewrites during implementation are caught.
   - Banned-pattern scan on all copy: em dashes, the blocked older ML-03/FL-Ship sentences, banned voice words ("passionate", "leveraged", "empowered", "results-driven", "AI-powered").
   - `officialCode` present only for the 20 coded assignments; no invented codes.
   - All `evidenceStatus` in {`partial`} by default unless a URL is present (at which point `available`).
   - Prints a data census (counts per tier/track/concept) for the record; never writes counts into the UI.
6. Hook `prebuild` so `npm run build` cannot succeed with invalid data.

**Deliverable D1.2:** the complete, validated content model. This is the single source of truth for routes, search, filters, analytics, and (next phase) the graph.

#### Task 1.3 — Non-graph archive pages (the guaranteed route)

PRODUCT_SPEC §3.1 / DESIGN_SPEC §39: the user must always be able to browse **ALL WORK → TRACK → ASSIGNMENT → TASK/LESSON/TAKEAWAY → ARTIFACT** without any graph. This is not secondary functionality.

1. **`/` (index.astro)** — hero + orientation (what this is / who it is for / how to use it, per IA §4) + the **BrowseWork** index section: all 35 assignments as cards grouped by track and strand (Portfolio/Public Work, AI Systems/Agents, ML spine), with filter controls (Task 1.3.4). This is where `EXPLORE THE MAP` / `BROWSE THE WORK` land in Phase 1.
2. **`/work/`** — full Work Index: same card grid, server-rendered filtering via query params (`?track=`, `?tier=`, `?concept=`), preserving shareable URLs.
3. **`/work/[slug].astro`** — static route per canonical assignment (35 pages at build time):
   - Header per DESIGN_SPEC §18: code in large Sora, `WEEK 6 · MACHINE LEARNING · CORE`-style uppercase metadata line, title, thin rule.
   - Three beats per §19–20: `TASK` / `LESSON` / `TAKEAWAY` as small uppercase labels separated by whitespace and thin rules (not three heavy boxes), scannable body copy.
   - **PROOF** block: primary artifact card (display mode from registry §3.2; in Phase 1 everything renders in `preview` mode: compact evidence card with title, one-sentence description, type, and a disabled/absent external link until URLs exist, plus the honest `EVIDENCE: PARTIAL` metadata).
   - **Connections** block: connected concepts (chips linking to concept pages) + direct approved edges (named assignments, labelled `builds on` / `connects to` / `cross-track`). Prioritised, never a huge list.
   - Secondary metadata area: workload, phase, evidence status, source aliases, canonicalisation status.
   - Full OG/canonical metadata per PRODUCT_SPEC §36.
4. **Track pages** `/track/ai-fluency` and `/track/machine-learning`: intro line, strand/spine structure rendered as ordered lists (the §11 core learning paths, including ML-01 visibly at the ML entrance and FL-10 as the convergence node), each item linking to its detail page.
5. **Concept pages** `/concepts/[id].astro`: concept name/description, the assignments it connects (grouped by track), and a note that it mediates relationships.
6. **Stub pages** for `/framework` and `/reflection`: minimal honest placeholders ("This section is being written from the completed work. It will appear in the final phase.") — no invented framework or retrospective content yet (PRODUCT_SPEC §30, §31 forbid pre-invented final statements).
7. **Components** (filling the empty scaffold): `AssignmentCard.astro` (tier-weighted: core strongest contrast/largest label, supporting medium, reference quiet), `ArtifactCard.astro` (preview/link modes), `ConceptCard.astro` (rectangular "atlas label" treatment per DESIGN_SPEC §48), `FilterBar.astro` (`ALL · AI FLUENCY · MACHINE LEARNING · CONCEPTS · ARTIFACTS` + optional `CORE / SUPPORTING / REFERENCE`), `DetailPanel.astro` (server-rendered assignment detail, reusable by the Phase 2 map panel).
8. **Search** (Phase 1 scope): a simple `<input>` client-side filter over title, code/ID, concept name, artifact name, rendered server-side as the full list so it degrades to the static list with JS off. No index, no backend.
9. **404 page** + `sitemap.xml` (generated at build time from the assignment/concept/track pages).

**Deliverable D1.3:** every piece of content reachable and readable without JavaScript, with the Systems Atlas identity fully applied.

### 1.2 Key design considerations (UI/UX)

- **Restraint is the spec.** 70–80% near-black background; gold under 2%; terracotta sparing; no gradients, glass, glow, particles (DESIGN_SPEC §04–05, §52). The dark layout must not feel cramped: generous 8px-system whitespace around hero, headings, and panels.
- **The three-beat card is a technical note, not a dashboard card.** Whitespace + thin rules; labels small, uppercase, quiet; body short enough to scan (§19–20).
- **Tier is narrative weight, not importance.** Core assignments get larger labels and stronger contrast in lists; reference assignments stay visually quiet but remain fully present and searchable (§12, §47).
- **Metadata hierarchy:** one visible metadata line (`WEEK 6 · MACHINE LEARNING · CORE`); everything else (workload, phase, evidence status, aliases) in the expanded/secondary area (§24).
- **No information by colour alone.** Track identity (green vs terracotta) is always paired with text labels; status is always text + icon, never hue-only (§25, §38).
- **Tone in the UI itself:** plain labels, no "dependency graph" vocabulary in user-facing copy (PRODUCT_SPEC §6), no em dashes anywhere.
- **Readable measure:** body copy in a relatively narrow column; metadata at 9–11px must still pass contrast (verify `#B9A36A` on `#101312` for text; if it fails 4.5:1, gold is restricted to large text and non-text accents).

### 1.3 Key development considerations

- **Data files are the product.** Components are dumb renderers of typed data. No content string lives in a component.
- **Static routes over dynamic data fetching:** all 35 detail pages are generated at build time from `assignments.ts`; the graph phase will consume the same modules client-side (no server round-trips, no content collection layer needed for V1).
- **`astro check` + strict TS from `day one`** (tsconfig already extends `astro/tsconfigs/strict`).
- **Validator before UI:** the data census is correct before a single page is styled; the UI is "mostly mechanical" afterwards, as DESIGN_SPEC §61 intends.
- **No graph code in this phase.** The header `MAP` item points at the browse section; Phase 2 swaps the target for the real map with zero layout change.
- **Keep `dist/` small:** images are used only where evidence exists; none yet, so Phase 1 is text/CSS only.

### 1.4 Dependencies and assumptions

**Dependencies**
- The three docs are frozen for the duration of Phase 1 (any change to the locked registry requires a doc update first, then a validator update in the same commit).
- Node ≥ 22.12, npm available; registry access for `@fontsource` packages.
- Nothing external is needed for content: no artifact URLs, no retrospective text yet (those gate Phase 3 items, not Phase 1).

**Assumptions**
- All 35 assignments are `complete` (the archive is a post-programme retrospective). If any is actually in progress, it is a one-field data change plus the §50 upcoming-state treatment.
- The scaffold file names stay (spec explicitly allows it).
- No real artifact URLs exist yet, so every artifact renders in `preview`/`link` placeholder mode with `EVIDENCE: PARTIAL`; the UI is designed so that attaching a URL later is a data-only change (flip `evidenceStatus`, set `url`, optionally upgrade display mode).
- "Existing Netlify workflow" (PRODUCT_SPEC §26) refers to a deploy target outside this repo; Phase 1 is fully local.

### 1.5 Acceptance criteria (Phase 1)

1. `npm run validate`, `npx astro check`, and `npm run build` all pass with zero errors, and the validator census matches: 35 assignments / 10 concepts / 11 artifacts / 34 public edges / 5 documented rejections / 57 concept mappings.
2. All 35 assignment pages render at `/work/[slug]` with verbatim approved copy (validator-confirmed), correct header metadata, three beats, PROOF block, and Connections block.
3. The non-graph route works end-to-end: All Work → track → assignment → Task/Lesson/Takeaway → artifact card, using only links, with JS disabled.
4. Track pages show the ML spine (with ML-01 at the entrance) and both AI Fluency strands with FL-10 as convergence; concept pages list exactly the locked mappings.
5. Filters (`ALL / AI FLUENCY / MACHINE LEARNING / CONCEPTS` + tier) and search produce correct, shareable results.
6. Visual identity matches DESIGN_SPEC: exact token values in CSS, Sora/Inter used per the scale, header and hero composition per §08–09, thin rules, 0–4px radii, no shadow-heavy or rounded-card UI, no banned aesthetics (§52).
7. No assignment count is hard-coded in any UI string.
8. Every page has title, description, canonical URL, and OG metadata; sitemap lists all static pages.
9. `prefers-reduced-motion` and keyboard focus states exist in the base system (full a11y pass is Phase 3).

### 1.6 Verification steps and tests (Phase 1)

**Automated**
- `npm run validate` (data census, referential integrity, copy checksums, banned patterns) — must be green before build.
- `npx astro check` — zero TS/astro errors.
- `npm run build` — succeeds; `dist/work` contains 35 rendered HTML files (assert count in a quick script or CI step).
- Copy scan: `grep -r "—" dist/work` returns nothing; banned-word grep over `src/data` returns nothing.
- Smoke: `npm run preview` and curl every generated route for HTTP 200 (small script iterating the slug list from `assignments.ts`).
- Lighthouse baseline on `npm run preview`: record mobile + desktop Performance/Accessibility/Best Practices/SEO numbers (no gate yet, but the baseline is the reference for Phase 3).

**Manual QA (checklist, ~30 min)**
- Browse all 35 cards on `/work`; spot-check 10 detail pages against CONTENT_REGISTRY rows (title, code, week, tier, phase, copy).
- Verify `FL-04` task text has the source-safe edit and `ML-03`/`FL Ship` use the revised wording.
- Verify no `officialCode` appears for the 15 code-less FL assignments; aliases visible in secondary metadata.
- Verify header active states, CTA targets, skip link, 404 page, and sitemap contents.
- Screenshots at 1440px (desktop) and 375px (mobile) of: home, work index, one ML detail page, one FL detail page, a track page, a concept page. Compare against the §53 reference composition: identity reads "technical atlas", not "generic portfolio".

**Phase 1 exit gate:** all of the above green. The site is deployable as a static browse archive.

---

## PHASE 2 — Learning Map: The Interactive Graph Layer

**Goal:** The map becomes the primary orientation and discovery surface, implemented exactly per DESIGN_SPEC §10–17, §23, §49, §56, §58. The map is a **navigation and synthesis layer**; it never replaces the archive (Phase 1's non-graph route remains the fallback and the accessible route).

**Rough effort:** 5–7 person-days.

### 2.1 Task breakdown and deliverables

#### Task 2.1 — Graph foundation (isolated, lazy, failure-safe)

1. **Component boundary:** `LearningMap.astro` (presentational shell) + `src/components/map/` client module. Cytoscape loads only on pages that embed the map (homepage map section; no map JS on `/work/*` detail pages). Use Astro's client loading with a `noscript` fallback that renders the static BrowseWork list, satisfying DESIGN_SPEC §58 (site remains useful if Cytoscape fails or JS is unavailable).
2. **Data adapter** (`src/components/map/adapter.ts`): pure function `buildGraphElements(viewState) → { nodes, edges }` translating the Phase 1 data modules into Cytoscape elements. This is the only place data meets the renderer, and it is unit-testable without a browser.
3. **Node styling for exactly three semantic node types** (DESIGN_SPEC §11, §47–48):
   - **Assignment:** circular, thin border, compact label; core = larger + stronger label + higher contrast; supporting = smaller/quieter; reference = quiet, hidden by default, revealed on exploration.
   - **Concept:** rectangular "atlas label" (bordered uppercase label, visually unmistakable from circles).
   - **Artifact:** small document marker, attached to its assignment (limited markers in the default state).
   - Track colour is an **accent** (node border/halo tint), never a full two-colour paint of the graph (§10, §26).
4. **Edge styling for exactly three relationship types** (§13–14): `builds-on` = structured solid line with subtle direction cue (only directed relationships suggest direction); `connects-to` = subtler undirected line; `cross-track` = distinct restrained terracotta treatment. All lines thin, low opacity, subordinate to nodes. No neon glow, no arrowheads everywhere, no electricity effects.
5. **Layout strategy:** a deterministic seed layout for the default conceptual view (10 concepts as the connective tissue, Tier-1 anchors + ML-01 placed around them), with a hierarchical (dagre-style) layout computed for track-spine views. Node count (~56) is tiny; prefer a stable, hand-tuned default over a force-directed one, so the default state is identical on every load and never feels like spaghetti. Add `dagre` (or Cytoscape's built-in hierarchical layout) only if the seed layout proves insufficient; document the decision.
6. **Viewport:** zoom/pan, fit-to-view on state change, `ResizeObserver`-driven sizing, modest animation only (§37: 150–250ms hover, 200–350ms panel/selection fades, subtle scale).

**Deliverable D2.1:** a calm, deterministic default map: 10 concepts + core anchors + ML-01 + approved high-confidence edges only, with the three node shapes and three line treatments visually distinguishable.

#### Task 2.2 — Progressive disclosure and selection state

1. **State machine** for graph view state: `default → track(selected) → concept(selected) → assignment(selected) → browse-all`, plus `filter` and `search` inputs. One reducer, one source of truth, URL-synced.
2. **Track selection** (§16, §28 track expansion): AI Fluency reveals both strands (Portfolio/Public Work + AI Systems/Agents) while keeping relevant cross-track concept nodes visible; ML reveals the full spine including ML-01. The chosen track becomes dominant; the graph does **not** navigate away (§15).
3. **Concept selection:** highlight all connected assignments (including tier promotion, e.g. `fl-curate-images` becoming prominent under Human Judgment), fade unrelated nodes, update contextual labels.
4. **Assignment selection** (§15, §49): node enlarges slightly + clear outer ring, immediate neighbourhood brightens, unrelated nodes fade, and the **detail panel opens beside the map** (DESIGN_SPEC §17 — the panel never replaces the map; the map compresses to ~1/3–1/2 viewport and the panel takes the majority of attention).
5. **Browse All:** an explicit fuller archive view for users who ask for it; default state stays calm.
6. **Escape/close:** returns to the previous state **without losing zoom/position** (§15).
7. **URL state:** `?track=`, `?concept=`, `?node=`, `?view=browse-all` synced to the address bar so every graph state is shareable and refresh-safe; deep links open the corresponding detail panel.

**Deliverable D2.2:** full progressive-disclosure behaviour with shareable, refresh-safe state.

#### Task 2.3 — Interaction, filtering, and search integration

1. **Hover** (§15): slight scale, more readable label, immediate connections brighten, unrelated graph unchanged; 150–250ms; no bounce.
2. **FilterBar** (DESIGN_SPEC §40): `ALL · AI FLUENCY · MACHINE LEARNING · CONCEPTS · ARTIFACTS` primary; `CORE / SUPPORTING / REFERENCE` secondary. Filters adjust node visibility in the graph and the browse list simultaneously (single state).
3. **Search** upgraded from Phase 1: results open the node/detail view; searching an assignment title, code (e.g. `ML-09`), concept name, or artifact name resolves to the right target and focuses it in the graph when on the map.
4. **Keyboard access for the graph** (DESIGN_SPEC §38): every graph state has a keyboard path. Implement nodes as focusable (tab-traversable) with Enter to select, Escape to close, visible focus ring; and keep the Phase 1 browse list permanently available as the guaranteed non-graph alternative. Focus management: opening a panel moves focus into it; closing returns focus to the trigger.
5. **Selection panel integration:** `DetailPanel.astro` (Phase 1) renders inside the map layout; the panel shows code/title/metadata, the three beats, the PROOF artifact preview, and a compact Connections list. This guarantees the map is never the only route to content.

**Deliverable D2.3:** the map is fully interactive, filterable, searchable, and keyboard-operable.

#### Task 2.4 — Mobile map behaviour

Per DESIGN_SPEC §30: the desktop composition must not collapse into a tiny graph.
- Compact header; intro first; map becomes a vertically scrollable / focused interactive area with **fewer visible nodes** (default mobile state = concepts + selected track's core spine only).
- Tap to select; clear close/back state; labels at readable sizes (≥9px effective, larger on small screens); assignment content moves **below** the map; artifact preview full-width; connections as a concise related-work section.
- Verify at 375px and 700px–1023px (tablet keeps the graph interactive with simplified labels, PRODUCT_SPEC §25).

**Deliverable D2.4:** a usable, honest mobile map (simpler, not broken).

### 2.2 Key design considerations (UI/UX)

- **The graph is the map, not the archive.** Visual hierarchy always reads INTRO → MAP → SELECTED WORK → PROOF (DESIGN_SPEC §03). The selected work must feel real and inspectable; the graph must never outshine the content (§59 failure conditions).
- **Calm by default.** The first state a visitor sees is the conceptual overview; density is earned by the user's own actions (§16). If a state looks like spaghetti, the state is wrong, not the renderer.
- **Concept mediation is a visual rule, not just a data rule:** relationships explained by a shared concept are never drawn as direct assignment edges (§13). The 5 rejected edges from registry §4.4 must be visibly absent; their pairs connect through the concept node instead.
- **Selection is a spotlight:** brighter node, clear outer ring, neighbourhood up, everything else faded, no neon.
- **Cross-track edges are a deliberate accent:** the visitor should notice "these two tracks were not actually isolated" (§26) without the page becoming two coloured halves.
- **Motion = feedback:** node focus, filtering, panel open/close, hover, connection highlighting. Nothing perpetual, nothing decorative (§37).
- **Plain language:** the surface is called **Learning Map** in all user-facing copy; never "dependency graph" (PRODUCT_SPEC §6).

### 2.3 Key development considerations

- **Isolation is mandatory** (DESIGN_SPEC §55): the graph is the only heavy client code. Non-map pages ship zero Cytoscape JS. Verify with a bundle check (no `cytoscape` string in `dist/_astro` output of `/work/*` pages).
- **The adapter is the contract.** Pure, tested, deterministic. Rendering bugs should be traceable to either adapter output or style config, never to ad-hoc element mutation.
- **Only `approved: true` edges ever reach Cytoscape** — enforce in the adapter (assert) *and* the validator. Confidence/evidence/reason travel in data for future auditability but are not shown to visitors.
- **Deterministic layout:** seeded positions, no random force-directed jitter between reloads; fit-to-view must be stable.
- **Performance:** lazy graph init (intersection or deferred), modest animation, no re-layout loops; measure init time in the browser console and keep it well under 100ms for ~56 nodes.
- **Testing infrastructure introduced here:** add `playwright` (dev) with a small test project covering interaction, keyboard, no-JS, and URL-state behaviour. Unit tests for the adapter can run under Node (Playwright test runner or `node --test`).
- **Error containment:** wrap Cytoscape init in try/catch; on failure, show the browse list (Phase 1) with a quiet note. The map is an enhancement, never a dependency.

### 2.4 Dependencies and assumptions

**Dependencies**
- Phase 1 complete: validated data modules, `DetailPanel.astro`, `FilterBar.astro`, the browse route (the fallback), design tokens.
- `cytoscape` + `@types/cytoscape` (already in `package.json`); `playwright` added as a dev dependency (justified: the graph is the product's core interactive surface and must be browser-verified).
- Optional: a layout helper (dagre/hierarchical) if the seed layout is insufficient — decision recorded in the commit message.

**Assumptions**
- ~56 nodes / 34 edges + concept mappings is comfortably within Cytoscape's performance envelope on mobile; no virtualisation needed.
- A deterministic default layout is achievable and preferred over force-directed (calmness is a spec requirement).
- Deep-linking via query params is sufficient (no routing library; the static-site constraint holds).
- The map section lives on the homepage per the §03 composition (intro left, map centre, panel right on desktop); `/work` remains list-first.

### 2.5 Acceptance criteria (Phase 2)

1. **Default state:** shows exactly 10 concept nodes, Tier-1 anchors, ML-01 at the ML entrance, and only approved high-confidence edges; no reference-tier nodes; no unapproved edges; visually calm (reviewed against §53 composition and §60 checklist).
2. **All three node types** are visually distinct by shape + label (not colour alone); **all three relationship types** have distinct line treatments; cross-track edges use the controlled terracotta accent.
3. **Progressive disclosure:** track selection reveals that track's spine and preserves cross-track concept nodes; concept selection highlights connected assignments (including tier promotion cases) and fades unrelated; assignment selection opens the panel **beside** the map with the map compressed but still visible; Browse All works; Escape restores state without losing zoom/position.
4. **Interactions:** hover (subtle scale + label + neighbourhood brighten), click (ring + fade + panel), 150–350ms transitions, no bounce/perpetual motion; reduced-motion preference honoured.
5. **Filters and search:** all five primary filters + tier secondary filter work; search resolves title/code/concept/artifact names and opens the right node/detail.
6. **URL state:** every graph state is encodable in the URL and reproduces on refresh/share.
7. **Keyboard:** a keyboard-only user can browse the map (focus ring visible, Enter selects, Escape closes), and the non-graph browse route remains available at all times.
8. **No-JS / failure fallback:** with JavaScript disabled or Cytoscape failing, the site shows the browseable archive (no empty graph region, no broken state).
9. **Mobile (375px):** simplified node set, tap-select works, clear close state, content below the map, artifact full-width, no horizontal scroll.
10. **Performance:** map JS absent from non-map pages (bundle check); graph init < 100ms on desktop; no layout thrash during state changes.

### 2.6 Verification steps and tests (Phase 2)

**Automated**
- `npm run validate` + `npx astro check` + `npm run build` stay green.
- **Adapter unit tests** (Node): node count by type, edge count = 34, no `approved: false` edges, rejected-edge pairs absent as direct edges, every concept's members match the locked registry, tier→size mapping monotonic (core > supporting > reference).
- **Playwright interaction suite** (against `npm run preview`):
  - default state: concept node count = 10, no reference nodes visible, edge count in DOM/instances = expected;
  - click `ml-09-validation-claim-audit` → panel opens with correct title + three beats, map still present in DOM, outer ring applied;
  - click `concept-human-judgment` → `fl-curate-images` node becomes visible/promoted;
  - select AI Fluency track → both strand spines visible, ML spine dimmed, cross-track concept nodes preserved;
  - Escape → previous state, zoom preserved;
  - URL: `?node=ml-09-...` loads with panel open; refresh keeps state;
  - search "ML-09" and "Validation and Research Claim Audit" → correct target;
  - keyboard: Tab reaches a node, Enter selects, Escape closes, focus returns;
  - no-JS context: browse list present, all 35 assignments reachable;
  - reduced-motion: transition durations collapse;
  - 375px viewport: map renders, tap-select works, close works, no horizontal overflow.
- **Bundle check:** assert `cytoscape` is not referenced in the HTML/JS of `/work/*` and `/track/*` pages; present only on the map page.
- Performance spot-check: `performance.now()` around graph init logged in dev; note baseline numbers.

**Manual QA (checklist)**
- Visual state review (screenshots, 1440px + 768px + 375px): default, each track, two concepts, one core assignment, one cross-track highlight, Browse All. Judge against DESIGN_SPEC §60 "Graph" and "Restraint" sections item by item.
- Hover/click feel: subtle, calm, no bounce; selection reads as a spotlight.
- Verify the 4 approved cross-track edges are the *only* visibly distinct accent edges.
- Verify panel scroll behaviour for the longest card (ML-09) and the shortest (FL-01).

**Phase 2 exit gate:** DESIGN_SPEC §60 sections *Graph* and *Interaction* fully checked, adapter and Playwright suites green, fallback paths demonstrated.

---

## PHASE 3 — Evidence, Experience, and Production

**Goal:** The archive becomes the real completion package: substantial artifacts are embedded or honestly previewed with fallbacks, the FRAMEWORK and REFLECTION views exist as earned synthesis, and the whole product passes the responsive/accessibility/polish gauntlet and ships.

**Rough effort:** 3–5 person-days.

### 3.1 Task breakdown and deliverables

#### Task 3.1 — Embeds and the evidence layer (PRODUCT_SPEC §16, DESIGN_SPEC §21–23, §56–57)

1. **`ArtifactPreview.astro`** with the three registry display modes:
   - `embed` — substantial, stable, public artifacts only (ML paper, portfolio, runnable agent demo where appropriate).
   - `preview` — compact technical card: title, one-sentence description, type, optional screenshot, open action.
   - `link` — administrative/source material (hours log, sign-off references): a simple labelled link, no visual real estate.
2. **Notebook pattern** (DESIGN_SPEC §22): ML notebooks are **not** iframes. Build a contained artifact viewport: compact title bar, notebook heading, one or two charts (exported static images), a small metric/result table, a short code excerpt, plus `OPEN NOTEBOOK` (raw) and `GITHUB` actions. The card communicates *what the artifact proves*, then allows deeper inspection.
3. **Lazy loading:** every embed, video, and PDF loads on demand (IntersectionObserver / on-selection). No iframe exists in the initial document. Selected notebook loads when chosen, never all at once (§56).
4. **Embed fallbacks** (§57): every embed wraps in a fallback that renders `[artifact preview] · This artifact opens externally. [OPEN ARTIFACT]`. Test by blocking the embed host. Never an empty iframe box.
5. **Evidence status flip:** when real URLs/screenshots are supplied (content dependency from the programme author), update `artifacts.ts`/`assignments.ts`: set `url`, `evidenceStatus: "available"` (or `private`/`missing` where applicable), upgrade display mode where the registry prefers embed. The UI already renders this state honestly: `EVIDENCE: PARTIAL` metadata stays visible until proven otherwise (DESIGN_SPEC §25 — status is never colour-only).
6. **Priority embeds** (PRODUCT_SPEC §16): personal portfolio, deployed ML paper, agent/demo experience, deployed interactive work. Everything else remains preview/link.

**Deliverable D3.1:** the proof layer is real: substantial artifacts are directly experienced where feasible, everything else is honestly previewed or linked, and no embed can silently fail.

#### Task 3.2 — Framework, "What I Wish I Knew", and Final Reflection views

1. **`/framework` — My Working Framework** (PRODUCT_SPEC §31, DESIGN_SPEC §27): steps (candidate: DEFINE → DECIDE WHAT GOOD LOOKS LIKE → BUILD SMALL → TEST → FIND FAILURE → EXPLAIN → SHIP) each linked to the assignments that earned them (e.g. DEFINE → `fl-portfolio-proof`, `ml-02`, `ml-03`, `fl-06`; TEST → `fl-prompt-ladder`, `ml-08`, `ml-09`, `fl-site-hardening`; SHIP → `fl-empty-live-page`, `pf-04`, `fl-07`, `ml-11`). Reuse concept-node styling; present as an **earned synthesis**, not a standalone motivational diagram.
2. **`/framework/wish-i-knew`** (PRODUCT_SPEC §30, DESIGN_SPEC §28): concise numbered advice, each statement **traceable to one or more assignments** (render the references as links). Final wording drafted from the completed assignment copy + retrospective; no invented statements; no inspirational-quote styling.
3. **`/reflection` — Final Reflection** (PRODUCT_SPEC §32, DESIGN_SPEC §29): the 500–800 word retrospective as a **readable long-form editorial document** (wider measure, Sora headings, Inter body), written for the Week-1 self, answering: what you set out to do / what changed / what you would build next / three most transferable learnings. Word count validated.
4. **Final Package section** (PRODUCT_SPEC §33): master index (all 35 assignments grouped by track/strand), live site link, hours log reference (link only), build-in-public post link, final reflection, final review/sign-off reference. Make it obvious that the archive *is* the FL-10 completion package.
5. **FL-10 convergence treatment** (DESIGN_SPEC §29): in both the map (Phase 2 layout) and the reflection section, FL-10 reads as the convergence of both strands (`Portfolio/Public Work ─┬→ FL-10; Agent/Systems ─┘→ FL-10 → Retrospective`), not as another child of the agent strand.

**Deliverable D3.2:** the synthesis and reflection views complete the IA from PRODUCT_SPEC §4 / DESIGN_SPEC §41 with nothing invented beyond the source material.

#### Task 3.3 — Responsive and accessibility pass (PRODUCT_SPEC §34, DESIGN_SPEC §30–31, §38–39, §54)

1. **Breakpoints** per §31: `<700px` mobile, `700–1023px` tablet, `1024–1439px` desktop, `1440px+` large desktop — CSS-driven, no device-specific hacks.
2. **Responsive priority** (§54): when space tightens, preserve in order: assignment title → task/lesson/takeaway → proof artifact → connection context → secondary metadata → graph detail. Simplify the graph substantially on small screens; never block access to the work.
3. **Keyboard:** every control navigable (header, filters, search, cards, map nodes, panel, close buttons); visible focus states everywhere; meaningful labels; logical tab order.
4. **Screen reader:** semantic headings throughout; the Phase 1 pages are the guaranteed non-graph route; map region has an accessible description + "browse instead" link; no information conveyed by colour alone (status, tier, track all have text).
5. **Reduced motion:** all transitions collapse to instant; graph selection uses opacity only.
6. **Contrast audit:** verify all text token pairs against WCAG AA (body ≥ 4.5:1, large text ≥ 3:1). `#B9A36A` on `#101312` is borderline for small text: restrict gold to large text/metadata accents or brighten a gold variant for text.
7. **Alt text** for every meaningful image (notebook charts, screenshots); decorative markers `aria-hidden`.

**Deliverable D3.3:** a keyboard-only and screen-reader-only complete journey, and a mobile experience that is simplified rather than broken.

#### Task 3.4 — Performance and SEO hardening (PRODUCT_SPEC §35–36, DESIGN_SPEC §56)

1. Images optimised (WebP/AVIF where screenshots arrive), explicit dimensions (no CLS), lazy below the fold.
2. Fonts: preload, subset to the weights used; `font-display: swap` with matching system fallback metrics to limit CLS.
3. Sitemap, robots, per-assignment canonical URLs and OG cards (title = assignment title, description = first sentence of Task beat), archive-level description covering both tracks.
4. Lighthouse targets: ≥ 90 Performance/Accessibility/Best Practices/SEO on mobile and desktop for home, a `/work/[slug]` page, and the map state; LCP < 2.5s on simulated 4G; CLS < 0.1 including embed loads.

**Deliverable D3.4:** measurable performance and share-preview quality.

#### Task 3.5 — Motion, polish, and final visual audit (DESIGN_SPEC §37, §59, §60; PRODUCT_SPEC §37)

1. Verify motion tokens are honoured end-to-end (150–250ms hover, 200–350ms panel, subtle node scale, fade/re-centre on selection). Nothing automatic, pulsing, or decorative.
2. Spacing/typography tuning pass against the 8px system and type scale; final hierarchy pass so the page reads INTRO → MAP → SELECTED WORK → PROOF.
3. **Do-not audit** (DESIGN_SPEC §52 + §60 Restraint): no neon, no glass, no robot/sparkle iconography, no cyberpunk grids, no 3D devices, no fake terminals, no particle backgrounds, no stock photos, no dashboard clutter, no oversized rounded cards, no em dashes in copy.
4. **Definition of Done sweep:** run through PRODUCT_SPEC §38 items 1–18 as a literal checklist (see §3.6).
5. **Deployment:** add `netlify.toml` (build command `npm run build`, publish `dist/`, Node version pinned), deploy to the existing Netlify workflow's staging, verify the production URL, share previews, and the custom-domain behaviour. (If the existing workflow lives in another repo, confirm the target before deploy and record it in the commit notes.)

**Deliverable D3.5:** the final, deployable archive — the product's Definition of Done, item by item.

### 3.2 Key design considerations (UI/UX)

- **The proof is the point.** An embedded notebook must look like part of the archive (dark technical frame, title bar, chart, table, actions), not a foreign iframe (DESIGN_SPEC §22–23). The archive communicates what the artifact *proves* before inviting inspection.
- **Honesty over polish:** `EVIDENCE: PARTIAL` stays visible until URLs exist. A quiet card with a real link beats a fake embed. Never manufacture a screenshot or claim an artifact exists (PRODUCT_SPEC §3.4).
- **Editorial shift for reflection:** the final reflection page keeps the Systems Atlas identity but becomes more readable/long-form (wider measure, calmer rhythm) — the one place the interface relaxes (DESIGN_SPEC §29).
- **Framework is earned, not claimed:** every framework step links downward to the assignments that justify it; the visitor can always drill from synthesis back to evidence (PRODUCT_SPEC §31).
- **Mobile is a different composition, not a shrunken desktop** (DESIGN_SPEC §30): fewer nodes, content below the map, full-width artifacts, concise related-work.
- **Accessibility is the non-graph route:** the Phase 1 pages are the accessibility story; the map adds a11y on top (keyboard nodes, focus management, labels), it does not depend on it.

### 3.3 Key development considerations

- **Content dependencies are data changes, not code changes.** Retrospective text, artifact URLs, screenshots, video, and the hours-log reference all land as data/content files; components already render every state.
- **Embed isolation:** every third-party embed lives in one component with one fallback contract; provider changes are contained.
- **Lighthouse CI gates the phase exit**, not just spot checks: run against the preview server with a fixed config and a baseline from Phase 1.
- **axe-core** runs over the key routes (home, map, work index, a detail page, reflection) in the Playwright suite.
- **Word count validation** for the retrospective (500–800) added to `scripts/validate-data.mjs`.
- **No scope creep:** PRODUCT_SPEC §37 "nice to have later" items (journey replay, timeline mode, map image export, progress visualisation) are explicitly out of V1.

### 3.4 Dependencies and assumptions

**Dependencies**
- Phases 1 and 2 complete and green.
- **From the programme author (content, not code):** the 500–800 word retrospective; real artifact URLs (portfolio, ML paper, agent, repos, demo video); screenshots for notebook previews; the build-in-public post URL; hours log reference; sign-off reference. Until they arrive, Phase 3 ships with the honest `partial` state everywhere.
- `lighthouse`/`lighthouse-ci` and `@axe-core/playwright` as dev dependencies (justified: the a11y and performance requirements are acceptance criteria, not aspirations).
- The existing Netlify deployment target (to confirm the exact site/CI location before Task 3.5 deploys).

**Assumptions**
- Embed hosts (GitHub, the paper's host, the portfolio domain) will either support iframes or have predictable restrictions; the fallback design means either outcome is acceptable.
- No backend is required at any point (PRODUCT_SPEC §26) — search, filters, and state remain client-side/static.
- The retrospective meets the 500–800 word requirement as written; if the author's text is longer, the page presents the full text and the validator flags the range (the spec says the retrospective itself must stay in range).

### 3.5 Acceptance criteria (Phase 3)

1. **DESIGN_SPEC §60 Build Acceptance Test: every item passes** (Identity, Graph, Content, Artifacts, Interaction, Restraint) — run as a literal signed-off checklist.
2. **PRODUCT_SPEC §38 Definition of Done: all 18 items pass.**
3. Every Tier-1 substantial artifact is either directly experienced (embed) or honestly previewed/linked with a working fallback; zero empty iframes; embed failure drill passes.
4. All lazy-loading rules hold: no iframe/embed in initial HTML of any page; notebooks load on selection only.
5. `/framework` (with assignment backlinks), `/framework/wish-i-knew` (every statement traceable to assignments), `/reflection` (retrospective 500–800 words, long-form layout), and the Final Package section are live and internally consistent.
6. **Keyboard-only journey complete:** from a fresh load, a keyboard user can reach any assignment, any concept, any artifact link, and back, with visible focus throughout.
7. **Screen-reader journey complete:** the non-graph route exposes all content with correct landmarks/headings; the map region is optional.
8. **Mobile (375px) and tablet (768px):** no horizontal scroll, all content reachable, map usable with tap/close, artifacts full-width, priority order from §54 respected.
9. **Reduced motion** honoured site-wide; **contrast** passes AA for all text pairs (gold restriction verified).
10. **Lighthouse ≥ 90** (mobile + desktop) on home, a detail page, and the map; LCP < 2.5s, CLS < 0.1 including embeds.
11. **SEO:** per-assignment canonical URLs, OG cards render correctly in a link-preview check; sitemap complete.
12. Deployed to staging/production via Netlify; production URL verified end-to-end including share preview.

### 3.6 Verification steps and tests (Phase 3)

**Automated**
- Full regression: `npm run validate` (now including retrospective word count), `npx astro check`, `npm run build`.
- Playwright: full Phase 1+2 suites re-run (no regressions), plus new:
  - **Keyboard-only journey script** (no mouse events): home → filter → assignment → artifact link → concept → back → map node → panel → close.
  - **No-JS journey** (JS disabled): complete browse of all 35 assignments.
  - **Embed failure drill:** abort all external embed requests via route interception; assert fallback card + `OPEN ARTIFACT` link appear; no empty boxes.
  - **Reduced-motion run:** assert transition durations are instant.
  - **Mobile/tablet journeys** at 375px/768px including the map.
  - **axe-core** over home, map, work index, detail page, reflection: zero critical/serious violations.
- **Lighthouse CI** (mobile + desktop) against preview server for the three key routes; compare against the Phase 1 baseline; gate at ≥ 90.
- **Link-preview check:** render OG tags for 3 representative assignments (or use a preview service) and confirm title/description image.

**Manual QA (checklist)**
- §60 checklist walked on a real device (desktop + phone), not only emulated.
- Read the retrospective as the Week-1 self: does it answer the four required questions? Is it in range?
- Walk the cross-track story: `fl-portfolio-proof` ↔ `ml-02`, `pf-04` ↔ `ml-11`, `fl-portfolio-cases` ↔ `ml-12`, `fl-09` ↔ `ml-11` — do the four strongest bridges read as intended (PRODUCT_SPEC §29)?
- Share-preview screenshots of home + one assignment.
- Final restraint pass: screenshot every page; confirm none resemble a SaaS dashboard or a generic AI product (DESIGN_SPEC §59 failure conditions).

**Phase 3 exit gate:** §60 + §38 checklists fully ticked, all automated suites green, production deploy verified. The archive is the completion package.

---

## 4. Appendices

### 4.1 Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Embed hosts block iframes (GitHub, paper host, portfolio domain) | High | Medium | Fallback contract is a first-class requirement (Task 3.1.4); notebook pattern avoids iframes entirely; failure drill in CI |
| Copy drift during implementation (unintended rewrites) | Medium | High (trust) | Validator checksums copy against the approved strings; banned-pattern scan; AGENTS.md rule "use only registry copy" |
| Graph looks like spaghetti in some state | Medium | High (design identity) | Deterministic seeded layout; default state restricted by spec; state-by-state screenshots in review; concept mediation enforced in adapter |
| Scope creep into "nice to have" items | Medium | Medium | PRODUCT_SPEC §37 list explicitly out of V1; each task maps to a spec section |
| Gold/terracotta contrast failures at 9–11px metadata | Medium | Medium | Contrast audit in Phase 3.3; pre-decide a brightened text variant now if AA fails |
| Artifact URLs/retrospective arrive late | High | Low (design absorbs it) | `partial` evidence state is a designed, honest UI state; Phase 3 items 3.1.5 and 3.2 are data-only changes |
| Font CLS on first load | Low | Low | Self-hosted variable fonts, preload, swap with matched fallback metrics |
| Netlify target ambiguity | Low | Low | Confirm deployment target before Task 3.5; add `netlify.toml` to make the build reproducible in-repo |

### 4.2 Effort summary

| Phase | Scope | Estimate |
|---|---|---|
| Phase 1 | Design tokens, shell, 35+10+11+34 data records, validator, static archive, 9 page groups | 4–6 person-days |
| Phase 2 | Cytoscape layer, adapter, progressive disclosure, filters/search, keyboard, mobile map, Playwright suite | 5–7 person-days |
| Phase 3 | Embeds + fallbacks, framework/reflection views, a11y/responsive pass, Lighthouse/axe, polish, deploy | 3–5 person-days |

### 4.3 Per-phase commit map (suggested)

- **Phase 1:** `chore: install toolchain + fonts` → `feat: design tokens + base layout + header/hero` → `feat: data layer (types, assignments, concepts, artifacts, graph)` → `feat: data validator + prebuild hook` → `feat: work index + assignment detail pages` → `feat: track + concept pages, filters, search, SEO, sitemap, 404`.
- **Phase 2:** `feat: map shell + adapter + default view` → `feat: progressive disclosure + URL state` → `feat: filters, search, keyboard access` → `feat: mobile map` → `test: Playwright interaction suite`.
- **Phase 3:** `feat: artifact preview + embed fallbacks` → `feat: framework + wish-i-knew + reflection + final package` → `fix: responsive + accessibility pass` → `perf: images, fonts, lighthouse gates` → `chore: polish audit + netlify deploy config`.

### 4.4 Open questions to confirm with the owner before Phase 3

1. Exact Netlify site/CI location for the "existing deployment approach" (PRODUCT_SPEC §26).
2. Delivery date and format for the retrospective, artifact URLs, screenshots, demo video, hours log, and build-in-public post.
3. Whether `status: "complete"` for all 35 assignments is confirmed (assumed).
4. Any additional approved cross-track edges beyond the locked 4 (none should be added without registry update first).
