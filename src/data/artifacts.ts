/**
 * Artifact registry.
 *
 * 1. `artifacts` — the 33 artifact records, in two groups:
 *
 *    a. the 11 SHARED "major artifact nodes" from CONTENT_REGISTRY §3.3
 *       (the deliverable streams of each work stream), and
 *
 *    b. the 22 per-assignment deliverable documents from INDEX.md (the
 *       assignment-artifacts/ folder): one record per AI Fluency assignment
 *       whose primary proof is its own submitted PDF / image / document.
 *
 *    Every URL in this file is a real, public, verified location
 *    (CONTENT_REGISTRY §3.4, resolved 2026-09-18). Where a deliverable does
 *    not exist publicly yet (the deployed ML paper, the build-in-public
 *    post), `url` stays `undefined` and the UI renders the honest
 *    `partial` state instead of a fake link (PRODUCT_SPEC §3.4).
 *
 * 2. `artifactLinks` — the 42 assignment-level artifact decisions. Each
 *    assignment links to the artifact that proves it. Where an assignment's
 *    proof is the stream deliverable itself (FL-04's workflow document,
 *    FL-09's README + demo video, the ML notebooks inside the shared repo,
 *    FL-10's final package), it links to the shared node; where the proof is
 *    its own submitted document, it links to its per-assignment record.
 *    Roles are preserved from CONTENT_REGISTRY §3.2.
 *
 * URL conventions:
 *   - `url`      — the human-facing location (GitHub blob page, live site).
 *   - `embedUrl` — the raw file for the in-page lazy viewer (PDF iframe,
 *                  video element). Raw GitHub URLs serve the file with its
 *                  real MIME type, which is what the lazy embed needs.
 */
import type { Artifact, ArtifactLink } from './types';

const ARCHIVE_REPO = 'https://github.com/Tessa-Saumu/flyrank-learning-archive';
const ARCHIVE_BLOB = `${ARCHIVE_REPO}/blob/main/assignment-artifacts/`;
const ARCHIVE_RAW =
  'https://raw.githubusercontent.com/Tessa-Saumu/flyrank-learning-archive/main/assignment-artifacts/';
const INDEX_BLOB = `${ARCHIVE_REPO}/blob/main/INDEX.md`;
const ML_REPO = 'https://github.com/Tessa-Saumu/FlyRank-ML-Internship';
const PORTFOLIO_SITE = 'https://theresia-saumu.netlify.app/';

export const artifacts: Artifact[] = [
  /* ---------- Shared major artifact nodes (CONTENT_REGISTRY §3.3) ---------- */
  {
    id: 'artifact-ml-repo',
    title: 'Machine Learning GitHub Repository',
    type: 'github',
    url: ML_REPO,
    description:
      'Public repo containing the starter notebooks, the capstone work, the committed output metrics, and the submission folder.',
  },
  {
    id: 'artifact-ml-paper',
    title: 'ML Research Paper',
    type: 'live',
    description: 'Deployed research paper built from the ML capstone sequence.',
    // HONEST STATE: the repo's submission/paper_url.txt still holds the
    // placeholder text, so the deployed paper URL is not supplied yet.
  },
  {
    id: 'artifact-portfolio-site',
    title: 'Personal Portfolio',
    type: 'live',
    url: PORTFOLIO_SITE,
    description:
      'Public portfolio site built through the AI Fluency portfolio strand.',
  },
  {
    id: 'artifact-personal-agent',
    title: 'Personal Agent',
    type: 'other',
    url: `${ARCHIVE_BLOB}fl-09-documentation-demo.md`,
    description:
      'Working personal AI agent built from the FL-06 spec, reproducible through its README.',
  },
  {
    id: 'artifact-agent-readme',
    title: 'Agent README',
    type: 'github',
    url: `${ARCHIVE_BLOB}fl-09-documentation-demo.md`,
    description: 'Reproducible documentation for the personal agent.',
  },
  {
    id: 'artifact-agent-demo-video',
    title: 'Agent Demo Video',
    type: 'video',
    url: `${ARCHIVE_BLOB}fl-09-documentation-demo.mp4`,
    embedUrl: `${ARCHIVE_RAW}fl-09-documentation-demo.mp4`,
    description:
      '3 to 5 minute narrated live run of the agent, including a limitation.',
  },
  {
    id: 'artifact-automation-workflow',
    title: 'Automation Workflow',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-04-automation-workflow.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-04-automation-workflow.pdf`,
    description:
      'End-to-end no-code research or writing workflow with documented runs.',
  },
  {
    id: 'artifact-learning-archive',
    title: 'FlyRank Learning Archive',
    type: 'github',
    url: INDEX_BLOB,
    description:
      'Final indexed package and reflective archive of both tracks, published as the public index.',
  },
  {
    id: 'artifact-build-in-public-post',
    title: 'Build-in-public Post',
    type: 'document',
    description:
      'Public post explaining one real decision and one real limitation.',
    // HONEST STATE: not published yet (INDEX.md: still open for FL-10).
  },
  {
    id: 'artifact-hours-log',
    title: 'Hours Log',
    type: 'document',
    url: INDEX_BLOB,
    description: 'Completion evidence for tracked programme hours (222.5 hours).',
  },
  {
    id: 'artifact-final-retrospective',
    title: 'Final Retrospective',
    type: 'document',
    url: '/reflection/',
    description: '500 to 800 word reflection required by FL-10.',
  },

  /* ---------- Per-assignment deliverables: AI Systems / Agents ---------- */
  {
    id: 'artifact-fl-01-workflow-audit',
    title: 'FL-01 Workflow Audit',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-01-workflow-audit.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-01-workflow-audit.pdf`,
    description: 'The submitted workflow audit and tool setup document.',
  },
  {
    id: 'artifact-fl-prompt-ladder',
    title: 'The Prompt Ladder',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-prompt-ladder.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-prompt-ladder.pdf`,
    description: 'Five-version prompt improvement log on a real task from the FL-01 audit.',
  },
  {
    id: 'artifact-fl-02-prompting-fundamentals',
    title: 'FL-02 Prompting Fundamentals',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-02-prompting-fundamentals.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-02-prompting-fundamentals.pdf`,
    description: 'Prompt iteration log with the cross-model comparison and the reusable template.',
  },
  {
    id: 'artifact-fl-05-agent-mcp-basics',
    title: 'FL-05 Agent and MCP Explainer',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-05-agent-mcp-basics.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-05-agent-mcp-basics.pdf`,
    description:
      'Workflow-versus-agent classification, the live MCP connection, and what a true agent would need.',
  },
  {
    id: 'artifact-fl-06-agent-design',
    title: 'FL-06 Agent Design Spec',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-06-agent-design.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-06-agent-design.pdf`,
    description: 'One-job agent scope, platform rationale, guardrails, and eval cases.',
  },
  {
    id: 'artifact-fl-07-build-agent',
    title: 'FL-07 Build Log and Agent Config',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-07-build-agent.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-07-build-agent.pdf`,
    description: 'The build log with the config and system prompt for the Repo Tutor agent.',
  },

  /* ---------- Per-assignment deliverables: Portfolio / Public Work ---------- */
  {
    id: 'artifact-fl-portfolio-proof',
    title: 'What Are You Proving?',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-portfolio-proof.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-portfolio-proof.pdf`,
    description: 'The single-claim proof statement the whole portfolio hangs on.',
  },
  {
    id: 'artifact-fl-portfolio-sitemap',
    title: 'Portfolio Sitemap and Toolkit',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-portfolio-sitemap.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-portfolio-sitemap.pdf`,
    description: 'The page-by-page sitemap, pressure-tested against the claim.',
  },
  {
    id: 'artifact-fl-portfolio-cases',
    title: 'Framed Case Studies',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-portfolio-cases.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-portfolio-cases.pdf`,
    description: 'Case studies pulled out of AI interviews and edited to a real voice.',
  },
  {
    id: 'artifact-fl-identity-kit',
    title: 'Identity Kit',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-identity-kit.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-identity-kit.pdf`,
    description: 'Fonts, colour palette, logo, and the two-line style note.',
  },
  {
    id: 'artifact-fl-curate-images',
    title: 'Curated Image Set',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-curate-images.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-curate-images.pdf`,
    description: 'Real captures plus generated connective tissue, with the rejection note.',
  },
  {
    id: 'artifact-fl-content-ctas',
    title: 'Content and CTA Map',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-content-ctas.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-content-ctas.pdf`,
    description: 'The one-line claim, section order per page, and the gather-list.',
  },
  {
    id: 'artifact-fl-empty-live-page',
    title: 'Empty but Live: First Screenshot',
    type: 'image',
    url: `${ARCHIVE_BLOB}fl-empty-live-page.png`,
    previewImage: `${ARCHIVE_RAW}fl-empty-live-page.png`,
    description: 'Screenshot of the near-blank page live on a real public URL.',
  },
  {
    id: 'artifact-fl-stack-choice',
    title: 'Stack Decision Rationale',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-stack-choice.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-stack-choice.pdf`,
    description: 'Three genuine build paths compared, one committed in writing with reasons.',
  },
  {
    id: 'artifact-fl-explain-build',
    title: 'Explain It Like You Built It',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-explain-build.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-explain-build.pdf`,
    description: 'The jargon-free explanation that proves the gap was genuinely closed.',
  },
  {
    id: 'artifact-pf-04-personal-website',
    title: 'PF-04 Deployment and DNS Walkthrough',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}pf-04-personal-website.pdf`,
    embedUrl: `${ARCHIVE_RAW}pf-04-personal-website.pdf`,
    description: 'The deployment record and the plain-language DNS walkthrough.',
  },
  {
    id: 'artifact-fl-dynamic-feature',
    title: 'Dynamic Feature Build',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-dynamic-feature.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-dynamic-feature.pdf`,
    description: 'One wired feature, built to the free tier, with the data flow explained.',
  },
  {
    id: 'artifact-fl-mobile-audit',
    title: 'Mobile Device Audit',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-mobile-audit.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-mobile-audit.pdf`,
    description: 'Real-device findings and the fix log across phone, tablet, and desktop.',
  },
  {
    id: 'artifact-fl-crit-review',
    title: 'Crit Feedback and Fixes',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-crit-review.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-crit-review.pdf`,
    description: 'External feedback, the must-fixes, and how they were acted on.',
  },
  {
    id: 'artifact-fl-site-hardening',
    title: 'Site Hardening and Triage',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-site-hardening.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-site-hardening.pdf`,
    description: 'Edge-case testing, SEO and meta proof, and the known-limitation list.',
  },
  {
    id: 'artifact-fl-domain-badge',
    title: 'Final Launch Record',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-domain-badge.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-domain-badge.pdf`,
    description: 'Domain, analytics, HTTPS, and share-preview confirmation for the launch.',
  },
  {
    id: 'artifact-fl-maintenance-plan',
    title: 'Maintenance Plan',
    type: 'pdf',
    url: `${ARCHIVE_BLOB}fl-maintenance-plan.pdf`,
    embedUrl: `${ARCHIVE_RAW}fl-maintenance-plan.pdf`,
    description: 'The plan to keep building, naming the next project and when it lands.',
  },
];

export const artifactLinks: ArtifactLink[] = [
  /* ---------- Machine Learning spine (notebooks inside the shared repo) ---------- */
  { assignmentId: 'ml-01-run-starter-notebooks', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-02-research-question-lane', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-03-ml-task-framing', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-04-data-contract', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-07-baseline-action-score', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-08-capstone-modeling', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-09-validation-claim-audit', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-10-content-action-playbook', artifactId: 'artifact-ml-repo', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'ml-11-ship-paper', artifactId: 'artifact-ml-paper', role: 'produces', displayMode: 'embed' },
  // ml-12 produces a demo outline/shareable cuts; the shared artifact it
  // documents is the paper it communicates.
  { assignmentId: 'ml-12-tell-story', artifactId: 'artifact-ml-paper', role: 'documents', displayMode: 'preview' },

  /* ---------- AI Fluency — AI Systems / Agents ---------- */
  { assignmentId: 'fl-01-workflow-audit', artifactId: 'artifact-fl-01-workflow-audit', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-prompt-ladder', artifactId: 'artifact-fl-prompt-ladder', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-02-prompting-fundamentals', artifactId: 'artifact-fl-02-prompting-fundamentals', role: 'produces', displayMode: 'preview' },
  // FL-04's own submission IS the stream deliverable, so it keeps the shared
  // node (now with a real URL).
  { assignmentId: 'fl-04-automation-workflow', artifactId: 'artifact-automation-workflow', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-05-agent-mcp-basics', artifactId: 'artifact-fl-05-agent-mcp-basics', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-06-agent-design', artifactId: 'artifact-fl-06-agent-design', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-07-build-agent', artifactId: 'artifact-fl-07-build-agent', role: 'produces', displayMode: 'preview' },
  // The agent itself (FL-07's working deliverable, reproducible through
  // its README) is documented by the build log too.
  { assignmentId: 'fl-07-build-agent', artifactId: 'artifact-personal-agent', role: 'documents', displayMode: 'preview' },
  // fl-09 documents the agent via a README and a demo video (two artifacts).
  { assignmentId: 'fl-09-documentation-demo', artifactId: 'artifact-agent-readme', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'fl-09-documentation-demo', artifactId: 'artifact-agent-demo-video', role: 'documents', displayMode: 'embed' },

  /* ---------- AI Fluency — Portfolio / Public Work ---------- */
  { assignmentId: 'fl-portfolio-proof', artifactId: 'artifact-fl-portfolio-proof', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-portfolio-sitemap', artifactId: 'artifact-fl-portfolio-sitemap', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-portfolio-cases', artifactId: 'artifact-fl-portfolio-cases', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-identity-kit', artifactId: 'artifact-fl-identity-kit', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-curate-images', artifactId: 'artifact-fl-curate-images', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-content-ctas', artifactId: 'artifact-fl-content-ctas', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-empty-live-page', artifactId: 'artifact-fl-empty-live-page', role: 'produces', displayMode: 'preview' },
  // The live site is a named deliverable of the ship/launch checkpoints too.
  { assignmentId: 'fl-empty-live-page', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-stack-choice', artifactId: 'artifact-fl-stack-choice', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-explain-build', artifactId: 'artifact-fl-explain-build', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'pf-04-personal-website', artifactId: 'artifact-pf-04-personal-website', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'pf-04-personal-website', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-dynamic-feature', artifactId: 'artifact-fl-dynamic-feature', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-mobile-audit', artifactId: 'artifact-fl-mobile-audit', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-crit-review', artifactId: 'artifact-fl-crit-review', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-site-hardening', artifactId: 'artifact-fl-site-hardening', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-domain-badge', artifactId: 'artifact-fl-domain-badge', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-domain-badge', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-maintenance-plan', artifactId: 'artifact-fl-maintenance-plan', role: 'produces', displayMode: 'preview' },

  /* ---------- Convergence (FL-10 final package) ---------- */
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-learning-archive', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-final-retrospective', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-hours-log', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-build-in-public-post', role: 'produces', displayMode: 'link' },
];
