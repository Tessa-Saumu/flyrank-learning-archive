# Owner Action Items — FlyRank Learning Archive

**Date:** 2026-08-31
**Status:** Implementation complete, one fix applied, owner actions required before production

---

## Must do before deploy

### 1. Set the production URL

**File:** `src/config.ts` — `site.url`

Current value: `https://flyrank-learning-archive.example.com` (placeholder)

This affects:
- Canonical URLs on every page
- sitemap.xml absolute URLs
- OG meta `og:url` and `twitter:url`
- Final Package "live site" link

Replace with the real production origin before deploying.

### 2. Confirm Netlify target

`netlify.toml` is configured (build command, publish dir, Node version) but the exact Netlify site/CI location must be confirmed. If the deploy target lives in another repo, coordinate before running `netlify deploy`.

### 3. Run Playwright browser tests

The 23 browser tests (map interactions, phase3, axe accessibility) are written but not yet executed. Run on a machine with internet access:

```bash
npm run test:install    # installs chromium
npm run test            # runs all suites
```

Expected: 10 adapter tests + 11 map tests + 7 phase3 tests + 5 axe tests = 33 total.

### 4. Run Lighthouse audit

```bash
npm run preview         # start preview server
npm run lighthouse      # in a separate terminal
```

Targets: 90+ Performance/Accessibility/Best Practices/SEO on mobile and desktop.

---

## Must do before final sign-off

### 5. Replace the retrospective draft

**File:** `src/data/reflection.ts`

Current: 566-word editable draft (flagged `PLACEHOLDER / EDITABLE DRAFT`). Replace with the author's own wording. Must stay 500-800 words. The validator checks word count and required headings.

### 6. Supply artifact URLs

**File:** `src/data/artifacts.ts`

Every `Artifact.url` and `embedUrl` is `undefined`. For each real artifact:
1. Set `url` to the live URL
2. Flip `evidenceStatus` from `"partial"` to `"available"` (or `"private"`/`"missing"`)
3. Optionally upgrade `displayMode` from `"preview"` to `"embed"` for substantial artifacts

The UI already renders both states honestly. No code changes needed.

### 7. Supply ML notebook evidence

**File:** `src/data/notebooks.ts`

For each ML notebook:
1. Set `hasEvidence: true`
2. Populate `charts` (exported static images)
3. Populate `metrics` (result table)
4. Populate `code` (short excerpt)

### 8. Replace OG image (optional)

**File:** `public/og.png`

Currently a generated default. Replace with a branded social card if desired.

---

## What was fixed in this review

The validate script was updated to work on Node 22.x:
```json
"validate": "node --experimental-strip-types scripts/validate-data.mjs"
```

This was the only code change made during QA. All other verification passed without modifications.

---

## Reference: what is already working

- 35 assignment pages with verbatim approved copy
- 10 concept pages with locked mappings
- Interactive Learning Map with progressive disclosure
- Framework, Wish I Knew, and Reflection pages
- Full evidence layer with lazy embeds and fallbacks
- SEO metadata, sitemap, robots.txt
- Data validator with comprehensive checks
- Bundle isolation (Cytoscape only on map page)
- Keyboard accessibility and reduced-motion handling
