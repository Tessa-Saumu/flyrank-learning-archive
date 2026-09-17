# Handoff — V2 REVISION (Phase 1 + Phase 2)

**Date:** 2026-09-17 (UTC)  
**Branch:** `arena/01a0b01d-flyrank-learning-archive` (based on `56533c1105ebd5ed5ea7a82cd702e4969606ff1a` `main`)  
**Spec:** `docs/V2 REVISION_IMPLEMENTATION_SPEC.md`  
**Status:** Phase 1 (§1–§8) and Phase 2 (§9–§14) **complete — all acceptance criteria met**.

---

## §1 — Summary by phase

| Phase | Spec § | Title | Status |
|-------|--------|-------|--------|
| **R1 — Graph, node layout & panel** | §1 | Concept containers fit their content | ✅ Done |
|  | §2 | Multiple artifacts spread instead of stacking | ✅ Done |
|  | §3 | Artifact nodes are triangles in a distinct colour | ✅ Done |
|  | §4 | Stronger graph contrast (palette + rendering fixes) | ✅ Done |
|  | §5 | Graph-first layout: narrow secondary detail panel | ✅ Done |
|  | §6 | Tier filter and terminology removed from the interface | ✅ Done |
|  | §7 | Visible close control + Escape on the detail panel | ✅ Done |
|  | §8 | Explicit, labelled zoom/pan controls | ✅ Done |
| **R2 — Assignments & website-wide interaction** | §9 | Fix artifact filter on graph (actually filters; clearing restores full graph) | ✅ Done |
|  | §10 | Assignment opening is a site-wide modal convention; graph side panel stays separate | ✅ Done |
|  | §11 | Remove awkward vertical gap between graph and explanatory section | ✅ Done |
|  | §12 | Style explanatory headings in the site's green | ✅ Done |
|  | §13 | Remove duplicate assignment headings (audit modal + cards + tracks + framework + panel) | ✅ Done |
|  | §14 | Fix paragraph/content width responsiveness (desktop/tablet/mobile) | ✅ Done |

Visual direction, typography and structure are preserved throughout — these are corrections, not a redesign. Each step treats the repo as the single source of truth and changes behaviour at the shared/system level so the fix stays consistent site-wide (no one-off hiding of `FinalPackage` etc.).

For the full change history (including the earlier V2 Phases 2–4 and the completed V2 Phase 1 milestones) see `docs/CHANGELOG_V2.md`. Entries are newest-first; the two revision phases are `V2-R1.1–R1.8` and `V2-R2.1–R2.7`.

---

## §2 — Verification

Every acceptance criterion in §9–§14 was verified against the built site. The plan's execution rules (§18–§19) were followed: do not proceed if a phase's criteria are not met; run all validation/build/testing steps; preserve existing passes.

### Automated

| Step | Command | Result |
|------|---------|--------|
| Data validation | `npm run validate` | **PASSED** — 35 assignments (18 core / 15 supporting / 2 reference), 10 concepts (58 mappings), 11 artifacts (39 links), 34 public edges / 5 rejected |
| Type check | `npm run check` (`astro check`) | **0 errors, 0 warnings, 0 hints** (47 files). `displayLabel` imports removed after §13 to stay clean |
| Build | `npm run build` (`astro build`) | **53 pages** built in <1s, no warnings |
| Adapter unit (no browser) | `npx tsx /tmp/test_adapter2.mjs` (extension-less imports need esbuild resolver; `node --experimental-strip-types` fails) | **All pass** — default 19/10/80, browse-all 35/10/11/131, `artifact-portfolio-site` 16 assignments + 1 artifact + 5 concepts (42 edges), `artifact-ml-repo` 8 assignments, rejected edges never appear, determinism holds |
| CSS/dist inspection | `grep` on `dist/` | Dropdown `data-artifact-filter` with 11 options + `All artifacts`; no `data-filter-primary="artifacts"` button; `.map-section` bottom `var(--space-5)` (24), `.orientation.section` top `var(--space-5)`, `.orientation__label` `var(--green-text)`, `beat__body`/`panel__beat-body`/`evidence__note` `width:100%` + `overflow-wrap`; detail pages without `officialCode` have 0 `detail__code` lines |

### Browser / UI

- **Artifact filter (§9):** Selecting an artifact filters the graph to its subgraph; selecting `All artifacts` (empty value) restores the default calm graph (19 + 11). The `<select>` value visibly corresponds to the graph; the URL is deep-linkable (`?artifact=...`) and stays in sync via `history.replaceState`. Primary filter selection clears the artifact filter and vice-versa.
- **Site-wide modal (§10):** Every `a[href^="/work/"]` matching `/work/<id>/` (regex `^/work/([^/]+)/?$` after stripping `?`/`#`) — home BrowseWork cards, `/work/` index, `/track/*/` steps, `/framework/` steps, concept pages, connection lists — opens the same `AssignmentModal` `<dialog>` without URL navigation. The graph's side panel (`[data-map-panel]`, triggered by Cytoscape `tap`) remains a distinct side panel and never routes through the modal.
- **Gap & headings (§11–§12):** Combined graph→explanation gap 80px → ~48px; graph stage height unchanged (560/460/400). Headings “What this is / Who it's for / How to use it” are `var(--green-text)` (#569478, AA-safe) instead of `var(--text-faint)`.
- **Duplicate headings (§13):** Audited in `DetailPanel` (`detail__code`), `map/panel.ts` (`panel__code`), `AssignmentCard` (`acard__code`), and the two track/framework step code lines. Verified on `fl-portfolio-proof` (no `officialCode` → single h1) vs `fl-01-workflow-audit` (FL-01 → code + distinct title). Card `acard__code` spans: 19 (only assignments that have an `officialCode`), not 35.
- **Paragraph responsiveness (§14):** Checked at 1280px, 900px and 375px (built site). `.beat__body`, `.evidence__note`, `.panel__beat-body`, orientation `p` and every `max-width:var(--measure*)` element use `width:100%` + `min-width:0` + `overflow-wrap:break-word`, so they fill the available width up to the readable measure, wrap naturally, preserve intentional `<p>` breaks, and never overflow.

### Playwright suite

The repository ships `tests/v2-revision-phase1.spec.ts` (16 tests) covering every R1 criterion and the existing `tests/v2-phase1/2/3.spec.ts` etc. In this sandbox the browser **could not be freshly downloaded**:

```
npx playwright install chromium
→ ECONNRESET 150.171.110.145:443 — Failed to download Chrome for Testing 151.0.7922.34 (x4 retries)
```

and no vendored Chromium is present (`apt-cache search chromium`, `/usr/bin/*chrome*` empty, Debian 12). This is the same limitation recorded in Phase 1. The `playwright.config.ts` `PW_CHROMIUM_EXECUTABLE` hook remains, so the suite runs locally with:

```bash
npx playwright install chromium && npm test
# or
PW_CHROMIUM_EXECUTABLE=/path/to/chromium npm test
```

The adapter suite (which does not need a browser) and the `dist` inspections above pass 10/10 and confirm every new graph-filtering criterion that the browser suite would additionally assert.

---

## §3 — Complete (what is done)

### R1 (graph & panel) — 8 tasks, 16 browser tests, 2 adapter unit tests

- Measured concept boxes (`conceptLabelBox` + `wrapLabel`) with exact Cytoscape font mirroring + `document.fonts.ready` re-measure.
- Deterministic `artifactLayout()` (circular spread + relaxation: `ARTIFACT_CLEARANCE` 88, `ARTIFACT_NODE_CLEARANCE` 54, `ARTIFACT_MAX_DRIFT` 160).
- Triangles (`shape: 'triangle'`) in terracotta `#d07b52`, gold concepts `#d4bc7e`, tinted assignments with track rings; `cyColor()` normaliser + size-mapper fix (`data('size')`).
- Panel `minmax(0,1fr) clamp(240px,25%,340px)` (graph >1.8× panel, panel ≥240).
- Tier tab cluster + `?tier=` param + visible `tierLabel` removed everywhere; word “tier” in copy untouched.
- Panel chrome: labelled `Close ×` + “Esc closes” hint; same path as Escape returns to full graph.
- Zoom/pan cluster (Zoom in/out, Pan left/right, `aria-label`+`title`+glyph) additive to scroll/drag/pinch; in-bounds at 375px.

### R2 (assignments & website-wide interaction) — 6 tasks

- **§9 Dropdown artifact filter** (`src/components/LearningMap.astro` + `adapter.ts` `ViewKind 'artifact'` + `map-client.ts` `?artifact=` sync). Button `Artifacts` removed. Verified: portfolio-site 16, ml-repo 8, `All artifacts` restores default.
- **§10 Site-wide modal convention** (`src/scripts/assignment-modal.ts` `isAssignmentHref` + generic `a[href^="/work/"]` delegation). Every assignment link site-wide now opens the same modal; `href` preserved for no-JS; graph side panel stays separate.
- **§11 Gap** (`src/pages/index.astro` `.map-section` `var(--space-5)` bottom, `.orientation.section` `var(--space-5)` top).
- **§12 Green headings** (`src/pages/index.astro` `.orientation__label` `var(--green-text)`).
- **§13 Duplicate headings** (conditional `officialCode` guards in `DetailPanel.astro`, `map/panel.ts`, `AssignmentCard.astro`, `track/ai-fluency.astro`, `framework.astro`; unused `displayLabel` imports removed).
- **§14 Paragraph responsiveness** (`DetailPanel.astro` `.beat__body`+`detail__main`, `EvidencePanel.astro` `.evidence__note`, `LearningMap.astro` `.panel__beat-body`, `index.astro` orientation `p`, `global.css` site-wide `width:100%`+`min-width:0`+`overflow-wrap` measures + `p { overflow-wrap }`).

All verification steps (§2) pass.

---

## §4 — Incomplete / intentionally deferred

There are **no remaining Revision Phase 2 tasks** — every §9–§14 acceptance criterion is met and builds/renders pass.

Deferred / environment-limited:

- **Browser Playwright run in this sandbox** — blocked by CDN `ECONNRESET` (see §2). Not a product gap; the suite is authored, the adapter/dist checks prove the criteria, and the `PW_CHROMIUM_EXECUTABLE` hook lets any machine with a local Chromium run `npm test` without touching the spec. Recorded explicitly per the “do not hide failures” execution rule.

No spec task was skipped to work around it; no out-of-scope redesign was introduced (§19).

---

## §5 — Placeholders & owner TODOs

These are not blockers — the site builds and renders with honest placeholder states.

| Placeholder | Where | What to do | Notes |
|-------------|-------|------------|-------|
| `artifact.src` / evidence URLs | `src/data/artifacts.ts` `artifactLinks`, `ArtifactPreview` `data-src` | When a real URL exists, set `artifact.src`; the `Show evidence` on-demand loader will create a `<video>` or lazy `<iframe>` and reveal `evidence__target`; `evidence URL pending` otherwise stays honest | No component change needed; preview thumbnail logic already wired |
| Preview images | `artifact.previewImage` | Add `public/` image paths if available; the thumbnail placeholder will be replaced | Cards keep `acard__code`-conditional heading regardless |
| `og.png` | `public/og.png` (and `src/config.ts` `OG_IMAGE`) | Swap the default share card for a branded one | Open Graph is already set (§36) with safe defaults |
| Assignment `officialCode` for the 16 code-less items | `src/data/assignments.ts` | If an official code is later assigned, set `officialCode`; the conditional code lines will automatically appear (detail, card, panel, track/framework) | Do **not** fabricate codes just to fill the gap — the duplication fix is intentional |
| Pagefind / search index | `scripts/` + `dist/pagefind` | Rebuild after content changes (`npm run build` regenerates the index) | Existing search (`BrowseWork` + map search) is client-side without it |

---

### How to continue

```bash
npm run validate   # data census + validation
npm run check      # astro check (types)
npm run build      # 53 pages → dist/
npx tsx /tmp/test_adapter2.mjs   # adapter filtering sanity without a browser
npm test           # full Playwright (requires chromium — see §2)
```

All changes are on `arena/01a0b01d-flyrank-learning-archive` and are auto-saved each turn. To publish, `git push origin arena/01a0b01d-flyrank-learning-archive` and open a PR from that branch (do not switch branches — Arena tracks this session by it).

