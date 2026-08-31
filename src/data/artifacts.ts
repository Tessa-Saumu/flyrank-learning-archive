/**
 * Artifact registry.
 *
 * 1. `artifacts` — the 11 SHARED artifact records from CONTENT_REGISTRY §3.3.
 *    These are the "major artifact nodes". `url` stays `undefined` until a
 *    real URL/file is supplied (CONTENT_REGISTRY §3: nothing is `available`
 *    until then).
 *
 * 2. `artifactLinks` — assignment-level artifact decisions from
 *    CONTENT_REGISTRY §3.2, encoded as `ArtifactLink` records (role +
 *    display mode). The same artifact may appear with different roles for
 *    different assignments (DESIGN_SPEC §44).
 *
 * MAPPING NOTE (documented interpretation): §3.2 describes a per-assignment
 * primary proof artifact (e.g. a specific notebook or document) in prose,
 * while §3.3 defines the 11 shared "major artifact nodes" that exist in this
 * file. Each assignment's primary proof artifact is linked to the shared
 * artifact that represents the final deliverable of its work stream:
 *
 *   - ML notebooks (ml-01..ml-10)   → artifact-ml-repo
 *   - ML paper / demo (ml-11, ml-12) → artifact-ml-paper
 *   - Portfolio strand (16)          → artifact-portfolio-site
 *   - Agent/systems (fl-05..fl-07)   → artifact-personal-agent
 *   - Workflow/prompting (fl-01, fl-prompt-ladder, fl-02, fl-04)
 *                                    → artifact-automation-workflow
 *   - Documentation (fl-09)          → artifact-agent-readme + artifact-agent-demo-video
 *   - Final package (fl-10)          → artifact-learning-archive + retrospective,
 *                                      hours log, build-in-public post
 *
 * Where a per-assignment document has no dedicated §3.3 record, the link maps
 * to the closest shared artifact (flagged inline as a PLACEHOLDER mapping).
 * No assignment is collapsed to a bare "linked to" relationship; roles are
 * preserved from §3.2.
 */
import type { Artifact, ArtifactLink } from './types';

export const artifacts: Artifact[] = [
  {
    id: 'artifact-ml-repo',
    title: 'Machine Learning GitHub Repository',
    type: 'github',
    description:
      'Public repo containing notebooks, outputs, paper URL file, and capstone work.',
    // PLACEHOLDER: url undefined until the real repository URL is supplied.
  },
  {
    id: 'artifact-ml-paper',
    title: 'ML Research Paper',
    type: 'live',
    description: 'Deployed research paper built from the ML capstone sequence.',
    // PLACEHOLDER: url undefined until the deployed paper URL is supplied.
  },
  {
    id: 'artifact-portfolio-site',
    title: 'Personal Portfolio',
    type: 'live',
    description:
      'Public portfolio site built through the AI Fluency portfolio strand.',
    // PLACEHOLDER: url undefined until the live site URL is supplied.
  },
  {
    id: 'artifact-personal-agent',
    title: 'Personal Agent',
    type: 'other',
    description: 'Working personal AI agent built from the FL-06 spec.',
    // PLACEHOLDER: url undefined until the demo/runnable URL is supplied.
  },
  {
    id: 'artifact-agent-readme',
    title: 'Agent README',
    type: 'github',
    description: 'Reproducible documentation for the personal agent.',
    // PLACEHOLDER: url undefined until the README URL is supplied.
  },
  {
    id: 'artifact-agent-demo-video',
    title: 'Agent Demo Video',
    type: 'video',
    description:
      '3 to 5 minute narrated live run of the agent, including a limitation.',
    // PLACEHOLDER: url undefined until the video URL is supplied.
  },
  {
    id: 'artifact-automation-workflow',
    title: 'Automation Workflow',
    type: 'document',
    description:
      'End-to-end no-code research or writing workflow with documented runs.',
    // PLACEHOLDER: url undefined until the workflow walkthrough URL is supplied.
  },
  {
    id: 'artifact-learning-archive',
    title: 'FlyRank Learning Archive',
    type: 'live',
    description: 'Final indexed package and reflective archive of both tracks.',
    // PLACEHOLDER: internal route (this site); no external URL in Phase 1.
  },
  {
    id: 'artifact-build-in-public-post',
    title: 'Build-in-public Post',
    type: 'document',
    description:
      'Public post explaining one real decision and one real limitation.',
    // PLACEHOLDER: url undefined until the post URL is supplied.
  },
  {
    id: 'artifact-hours-log',
    title: 'Hours Log Reference',
    type: 'document',
    description: 'Completion evidence for tracked programme hours.',
    // PLACEHOLDER: likely private or partial; url undefined for now.
  },
  {
    id: 'artifact-final-retrospective',
    title: 'Final Retrospective',
    type: 'document',
    description: '500 to 800 word reflection required by FL-10.',
    // PLACEHOLDER: internal page (Phase 3); no external URL in Phase 1.
  },
];

export const artifactLinks: ArtifactLink[] = [
  /* ---------- Machine Learning spine (notebooks → ml-repo) ---------- */
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
  // PLACEHOLDER mapping: fl-01's workflow audit has no dedicated §3.3 record;
  // linked to the automation-workflow stream it initiates.
  { assignmentId: 'fl-01-workflow-audit', artifactId: 'artifact-automation-workflow', role: 'produces', displayMode: 'preview' },
  // PLACEHOLDER mapping: prompting work has no dedicated §3.3 record; linked
  // to the workflow stream it feeds.
  { assignmentId: 'fl-prompt-ladder', artifactId: 'artifact-automation-workflow', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-02-prompting-fundamentals', artifactId: 'artifact-automation-workflow', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-04-automation-workflow', artifactId: 'artifact-automation-workflow', role: 'produces', displayMode: 'preview' },
  // PLACEHOLDER mapping: fl-05's MCP explainer has no dedicated §3.3 record;
  // linked to the agent workstream it establishes.
  { assignmentId: 'fl-05-agent-mcp-basics', artifactId: 'artifact-personal-agent', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-06-agent-design', artifactId: 'artifact-personal-agent', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-07-build-agent', artifactId: 'artifact-personal-agent', role: 'produces', displayMode: 'preview' },
  // fl-09 documents the agent via a README and a demo video (two artifacts).
  { assignmentId: 'fl-09-documentation-demo', artifactId: 'artifact-agent-readme', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'fl-09-documentation-demo', artifactId: 'artifact-agent-demo-video', role: 'documents', displayMode: 'embed' },

  /* ---------- AI Fluency — Portfolio / Public Work ---------- */
  { assignmentId: 'fl-portfolio-proof', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-portfolio-sitemap', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-portfolio-cases', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-identity-kit', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-curate-images', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-content-ctas', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-empty-live-page', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-stack-choice', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'preview' },
  { assignmentId: 'fl-explain-build', artifactId: 'artifact-portfolio-site', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'pf-04-personal-website', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-dynamic-feature', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-mobile-audit', artifactId: 'artifact-portfolio-site', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'fl-crit-review', artifactId: 'artifact-portfolio-site', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'fl-site-hardening', artifactId: 'artifact-portfolio-site', role: 'documents', displayMode: 'preview' },
  { assignmentId: 'fl-domain-badge', artifactId: 'artifact-portfolio-site', role: 'produces', displayMode: 'embed' },
  { assignmentId: 'fl-maintenance-plan', artifactId: 'artifact-portfolio-site', role: 'documents', displayMode: 'preview' },

  /* ---------- Convergence (FL-10 final package) ---------- */
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-learning-archive', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-final-retrospective', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-hours-log', role: 'produces', displayMode: 'link' },
  { assignmentId: 'fl-10-final-package', artifactId: 'artifact-build-in-public-post', role: 'produces', displayMode: 'link' },
];
