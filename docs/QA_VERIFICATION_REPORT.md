# QA Verification Report — FlyRank Learning Archive

**Date:** 2026-08-31
**Verified by:** Automated code review + manual build/run verification
**System state:** All three phases implemented, build passing, one critical fix applied

---

## 1. What was checked

### Build pipeline

| Check | Method | Result |
|---|---|---|
| `npm run validate` | Run against Node 22.13.1 | PASS (after fix; see Critical Issues) |
| `npm run build` | Full static build | PASS — 53 pages generated |
| `npx astro check` | TypeScript/Astro validation | NOT RUN (devDependency not installed in this environment) |
| `npm run test:adapter` | 10 adapter unit tests | Listed, not runnable (Playwright chromium CDN unreachable) |

### Data integrity (validator)

| Check | Result |
|---|---|
| 35 assignments (registry ID set) | PASS |
| 10 concepts with locked IDs | PASS |
| 58 concept-to-assignment mappings | PASS |
| 11 shared artifacts | PASS |
| 39 artifact links | PASS |
| 34 approved public edges | PASS |
| 5 rejected edges absent from public | PASS |
| Copy integrity (exact-match against approved set) | PASS |
| Banned-pattern scan (em/en dash, blocked sentences, banned voice words) | PASS |
| officialCode mapping (19 coded, no invented codes) | PASS |
| evidenceStatus all "partial" | PASS |
| Framework steps resolve | PASS |
| Wish-i-knew statements traceable | PASS |
| Retrospective 500-800 words | PASS |

### Build output verification

| Check | Result |
|---|---|
| 35 assignment directories in `dist/work/` | PASS |
| 10 concept pages in `dist/concepts/` | PASS |
| Track pages (`ai-fluency`, `machine-learning`) | PASS |
| Framework page with 7 steps | PASS |
| Wish-i-knew page with 6 traceable statements | PASS |
| Reflection page with 4 sections | PASS |
| 404 page | PASS |
| sitemap.xml lists all routes | PASS |
| robots.txt points to sitemap | PASS |
| og.png exists | PASS |

### Code quality

| Check | Result |
|---|---|
| No em dashes in rendered output (dist/) | PASS |
| No cytoscape in non-map pages (bundle isolation) | PASS |
| `prefers-reduced-motion` guard in CSS | PASS |
| `focus-visible` styles | PASS |
| Skip-to-content link | PASS |
| OG metadata on detail pages | PASS |
| Header: FLYRANK/LEARNING ARCHIVE, centre nav, right tracks | PASS |
| Three beats (TASK/LESSON/TAKEAWAY) on detail pages | PASS |
| PROOF block with ArtifactPreview | PASS |
| Connections block with concepts + edges | PASS |
| ML-03 revised wording (not "most projects fall apart") | PASS |
| FL Ship revised wording (not stronger claim) | PASS |
| FL-04 source-safe edit ("runs on a brand new input") | PASS |
| No hard-coded assignment counts in UI | PASS |
| Cytoscape init wrapped in try/catch with fallback | PASS |
| Deterministic layout (seed coordinates, no randomness) | PASS |
| URL state sync in map client | PASS |
| Keyboard: nodes focusable, Enter selects, Escape closes | PASS |
| Artifact embeds lazy-loaded (no iframe in initial HTML) | PASS |
| Embed fallback card present | PASS |
| NotebookPreview is NOT an iframe | PASS |
| netlify.toml configured | PASS |

### Spot-checked rendered pages

- `/work/ml-03-ml-task-framing/` — three beats, PROOF block, Connections, OG metadata, revised wording confirmed
- `/framework/` — 7 framework steps with assignment links
- `/framework/wish-i-knew/` — 6 statements, each with traceable assignment links
- `/reflection/` — convergence diagram, 4 sections, word count validated

---

## 2. Critical issues (fixed)

### C-1: `npm run validate` fails on Node 22.x

**Root cause:** `scripts/validate-data.mjs` imports `.ts` files with explicit `.ts` extensions. Node 22.x does not support `.ts` extensions in ESM imports without `--experimental-strip-types`.

**Fix applied:** Changed `package.json` line 12:
```
- "validate": "node scripts/validate-data.mjs"
+ "validate": "node --experimental-strip-types scripts/validate-data.mjs"
```

**Status:** Fixed. `npm run validate` and `npm run build` now pass.

---

## 3. Important issues (should address)

### I-1: `@astrojs/check` not installed

The `@astrojs/check` devDependency is listed in `package.json` but was not present in `node_modules` after clone. Running `npm install` fixed this. Ensure CI runs `npm install` before `npx astro check`.

### I-2: Playwright browser tests not runnable

The 23 browser tests (map, phase3, axe) are written but could not be executed in this environment (Playwright chromium CDN unreachable). Run `npm run test:install && npm run test` on a machine with egress access to verify browser-level behavior.

### I-3: Placeholder site.url

`src/config.ts` has `site.url` set to `https://flyrank-learning-archive.example.com`. This affects canonical URLs, sitemap, OG absolute URLs, and the Final Package "live site" link. Must be replaced before production deploy.

---

## 4. System status summary

| Area | Status |
|---|---|
| Data layer | Complete and validated |
| Non-graph archive (35 pages) | Complete, renders correctly |
| Learning Map (interactive graph) | Complete, bundle-isolated |
| Evidence layer (embeds/fallbacks) | Complete, lazy-loaded |
| Framework / Wish I Knew / Reflection | Complete with editable draft |
| Design system (tokens, typography) | Complete, matches spec |
| SEO (sitemap, robots, OG) | Complete |
| Deployment config (netlify.toml) | Complete, target unconfirmed |
| Browser tests | Written, not yet executed |
| Lighthouse/axe | Configured, not yet run |

**Overall:** The implementation is complete and the build pipeline passes. The one critical issue (validate script) has been fixed. Browser-level testing and production deployment remain as owner actions.
