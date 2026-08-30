# Handoff — FlyRank Learning Archive, Phase 1

This document summarizes the completed Phase 1 work, how it was verified, what
is complete, what is intentionally incomplete, and the exact placeholders that
must be filled by the owner.

---

## 1. Summary of work completed (by phase)

### Phase 1 — Foundation: Data Layer and Non-Graph Archive (COMPLETE)

**Task 1.1 — Toolchain and design system foundation**

- Installed dependencies and check tooling; self-hosted variable Sora/Inter
  fonts (no external CDN).
- Built the Systems Atlas token system in `src/styles/global.css`: exact colour
  tokens, rules, 8px spacing scale, clamp type scale, radii, motion tokens,
  base reset, focus-visible, skip link, reduced-motion guard.
- Built `src/layouts/Base.astro` (semantic shell + full SEO/OG head), the
  `Header.astro` (§08), and the `Hero.astro` (§09).

**Task 1.2 — Typed content data layer (the heart of Phase 1)**

- `src/data/types.ts` with the full typed model (`Assignment`, `Concept`,
  `Artifact`, `ArtifactLink`, `GraphEdge`, `RejectedEdge`).
- `assignments.ts` — 35 canonical records, IDs and copy exactly per the locked
  registry, with the three copy safeguards applied.
- `concepts.ts` — 10 concepts with locked descriptions and mappings.
- `artifacts.ts` — 11 shared artifacts + 39 `ArtifactLink` records.
- `graph.ts` — 34 approved public edges + 5 `rejectedEdges`.
- `scripts/validate-data.mjs` (`npm run validate`) + `prebuild` hook.

**Task 1.3 — Non-graph archive pages**

- `/` (hero + orientation + browse index), `/work/` (query-param filtering),
  `/work/[slug]` (35 detail pages), `/track/ai-fluency`, `/track/machine-learning`,
  `/concepts/[id]` (10 pages), `/framework` + `/reflection` stubs, `404`, and
  `sitemap.xml`.
- All six scaffold components filled (plus `BrowseWork`); client-side search
  that degrades to the static list with JS off.

The data census is: **35 assignments / 10 concepts / 11 artifacts / 34 public
edges / 5 documented rejections / 58 concept mappings / 39 artifact links**,
18 core / 15 supporting / 2 reference tiers.

---

## 2. How correctness was verified

**Automated**

- `npm run validate` — green; prints the census above and asserts every rule
  (counts, unique IDs, registry ID set, copy exact-match, referential integrity
  both directions, `approved: true` only, rejected edges absent from public
  edges, banned-pattern scan, official-code mapping, evidence-status rule).
- `npx astro check` — 0 errors / 0 warnings / 0 hints.
- `npm run build` — succeeds; 52 pages; `dist/work/` contains 35 rendered
  assignment pages.
- Copy scan — `grep` for em dash (`U+2014`) and en dash (`U+2013`) over `dist`
  and `src` returns nothing; banned-word scan over `src/data` returns nothing.
- Smoke test — `npm run preview` + a script curling all 53 routes returns
  HTTP 200 for every route.

**Manual / targeted checks**

- FL-04 task text renders with the source-safe edit and without
  "without your intervention".
- ML-03 and FL Ship render the revised wording; the blocked older phrases are
  absent from rendered output and from source copy.
- `officialCode` appears only on the 19 coded assignments; aliases present in
  secondary metadata.
- Detail pages emit correct `<title>`, canonical URL, and OG metadata
  (verified on `ml-09-validation-claim-audit`).
- Sitemap lists all 51 static pages (home, work index, 2 tracks, 35 work pages,
  10 concept pages, framework, reflection).
- Header active states, CTA anchors (`#browse`, `/work/`), skip link, and
  reduced-motion guard are implemented per the specs.

**Not yet run (Phase 3 gates, recorded as the baseline reference)**

- Lighthouse baseline and axe-core/Playwright suites are Phase 2/3 tooling and
  were not introduced in Phase 1, per the plan's testing progression (§0.5).

---

## 3. What is fully complete

- The complete, validated content model (single source of truth for routes,
  search, filters, and the Phase 2 graph).
- The full non-graph route: All Work → track → assignment → Task/Lesson/Takeaway
  → artifact, browsable with JavaScript disabled.
- Design-system foundation: exact Systems Atlas tokens, Sora/Inter, header and
  hero composition, thin rules, 0–4px radii, no shadow-heavy/rounded-card UI,
  no banned aesthetics.
- Filters (ALL / AI FLUENCY / MACHINE LEARNING / CONCEPTS + tier) and search
  with shareable, correct results.
- SEO/OG metadata on every page, sitemap, and a 404 page.
- No assignment count hard-coded in any UI string.

Phase 1's exit gate is met: the site is a deployable static browse archive.

---

## 4. Intentionally incomplete (by design)

- **Learning Map (graph):** Phase 2. `LearningMap.astro` is a marked
  placeholder; the homepage "map" target is the static browse index.
- **`/framework` and `/reflection`:** honest stubs. Real synthesis/retrospective
  content is Phase 3 and must be written from the completed work (PRODUCT_SPEC
  §30–32 forbid pre-inventing it).
- **Embeds and evidence:** Phase 3. Every artifact currently renders in
  `preview`/`link` mode with `EVIDENCE: PARTIAL`; no URLs, screenshots, or
  embeds yet.
- **Responsive/a11y/contrast pass, Lighthouse, axe-core, deployment:**
  Phase 3. The base system already includes focus states and a reduced-motion
  guard, but the full pass is not part of Phase 1.
- **Netlify deployment:** no `netlify.toml` yet (Phase 3, Task 3.5).

---

## 5. Placeholders to fill (owner)

1. **`src/config.ts` → `site.url`** — `https://flyrank-learning-archive.example.com`
   is a placeholder. Replace with the real production origin (affects canonical
   URLs, sitemap, and OG absolute URLs).
2. **Artifact URLs** — every `Artifact.url` is `undefined`. Supply real URLs
   (portfolio, ML paper, repo, agent, demo video, automation walkthrough,
   build-in-public post, hours log, retrospective) and flip the corresponding
   `evidenceStatus` from `partial` to `available` (or `private`/`missing`).
3. **Assignment evidence status** — currently `partial` for all 35. Confirmed
   per CONTENT_REGISTRY §3 (nothing is `available` until a real URL/file is
   attached).
4. **`status: "complete"` for all 35 assignments** — assumed (the archive is a
   post-programme retrospective). If any assignment is still in progress, it is
   a one-field data change plus the §50 upcoming-state treatment.
5. **The final retrospective (500–800 words)** — for `/reflection` in Phase 3.
6. **Framework + "What I Wish I Knew" content** — for `/framework` in Phase 3,
   drafted from the completed assignment copy.
7. **Netlify site/CI target** — to confirm before Phase 3 Task 3.5 deploys.

All placeholders are also flagged inline in code with `PLACEHOLDER` comments.

---

## Key interpretation notes for the owner

- The plan states "20 coded assignments" and "57 concept mappings"; the locked
  CONTENT_REGISTRY actually contains **19 coded assignments** (ML-05/ML-06 do
  not exist) and **58 concept mappings** (Evaluation includes
  `fl-06-agent-design`). The registry was treated as authoritative; the
  validator asserts the exact locked sets.
- `strand` includes a fourth value `"convergence"` for FL-10.
- A derived `--green-bright` token is used for green text/outlines, since the
  spec's `--green (#315D4B)` is too dark for text on the near-black background.
- Each assignment's §3.2 primary proof artifact is linked to the closest §3.3
  shared "major artifact node"; see the mapping note at the top of
  `src/data/artifacts.ts`.
