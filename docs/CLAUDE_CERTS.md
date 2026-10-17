# Claude Certs

Claude Certs is the third learning destination alongside AI Fluency and Machine Learning. It uses the existing Systems Atlas colors, Sora/Inter typography, spacing, card surfaces, action styles, native dialog, and repaired lazy PDF evidence viewer. No additional application framework or runtime dependency is required.

## Content and progress

`src/data/certifications.json` is the source registry for the 14 distinct supplied course completion certificates. `src/data/certifications.ts` supplies the typed records and derives the completed count and percentage against the owner's stated 20-course learning goal: 14/20, or 70%.

The certificates are external Claude/Anthropic course completions. They are separate from FlyRank assignments, programme hours, tracks, concepts, and graph relationships. The six remaining goal items have no invented titles, dates, or completion states. Unavailable issue dates and issuer verification URLs are not displayed.

## Routes and interaction

- `/certifications/`: original certificate previews, progress, and bulk download.
- `/certifications/[id]/`: static, shareable certificate detail and original PDF download.
- Certificate cards use the existing dialog controller with explicit certificate routes. Assignment `/work/` interception remains intact. Escape/focus return, scroll preservation, media cleanup, error fallback, and lazy PDF activation are shared.
- Without JavaScript, card links navigate to their static detail pages and PDF/ZIP downloads remain available.
- Header navigation uses the label Sections and includes AI Fluency, Machine Learning, and Claude Certs. The existing navigation wraps to accommodate the third destination at smaller widths.

## Assets and provenance

`public/evidence/certifications/` contains one unchanged original PDF per credential, a lightweight full-page WebP preview per PDF, a public-safe manifest, and `claude-certificates.zip`. Full-page rendering includes the recipient overlay; thumbnails are not extracted background artwork. The ZIP contains only the 14 certificate PDFs and its manifest, with no planning documents or unrelated credentials.

Every original PDF is identified by SHA-256 in the registry. Six byte-identical generic-filename duplicates were excluded. The supplied file contents and course titles were inspected; this does not assert independent issuer authentication.

`npm run validate` now also checks unique certificate IDs/hashes, PDF signatures and original bytes, and preview availability/signatures. The original FlyRank validation remains unchanged: 35 assignments, 33 artifacts, 43 artifact links, and 34 public edges.

When adding a certificate, add a source-backed record, its unchanged PDF and a genuine rendered preview; regenerate the public manifest/ZIP and verify archived PDF hashes. Keep the count/percentage derived, and only change the learning goal when the owner changes that goal.

## Verification

`tests/certifications.spec.ts` covers all source hashes and routes, progress, header active state and layout, lazy loading, mobile/desktop PDF popups, downloads, focus return/cleanup, no-JavaScript behavior, failed detail fetches, and axe accessibility. The existing navigation hierarchy test now expects the intended three secondary destinations. The full existing regression suite continues to cover AI Fluency, ML, the graph, work filters, and assignment evidence.

The production build adds 15 static routes, taking the checked HTML inventory from 53 to 68 and internal destinations from 79 to 109. Deployment remains with the owner; build with `npm run build` and publish `dist/`.

Final local verification on 17 October 2026: all 101 tests passed in one full Chromium run, with zero failures, skips, or retries. Production build and data validation passed; Astro check reported zero errors, warnings, and hints. The certificate ZIP was extracted and each of its 14 PDFs matched the registered original hash. Full-page previews and the layout were visually inspected at 390, 768, 1024, and 1366 px. No deployment or merge was performed.
