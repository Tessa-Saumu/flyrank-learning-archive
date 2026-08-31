/**
 * Graph data — approved direct edges and explicitly rejected edges.
 *
 * Source: CONTENT_REGISTRY §4.2 (30 approved direct edges: 29 builds-on +
 * 1 connects-to), §4.3 (4 approved cross-track edges), §4.4 (5 rejected
 * edges mediated by concepts instead).
 *
 * Total public edges = 34. Concept-mediated relationships are expressed
 * through the concept mapping, never as extra edges (DESIGN_SPEC §13, §43).
 * Only `approved: true` edges may reach the public map.
 */
import type { GraphEdge, RejectedEdge } from './types';

export const publicEdges: GraphEdge[] = [
  /* ---------------- Machine Learning spine (builds-on) ---------------- */
  { source: 'ml-01-run-starter-notebooks', target: 'ml-02-research-question-lane', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-02 asks students to use real numbers from the starter data already run in ML-01.' },
  { source: 'ml-02-research-question-lane', target: 'ml-03-ml-task-framing', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-03 maps the chosen lane from ML-02 onto an ML task.' },
  { source: 'ml-03-ml-task-framing', target: 'ml-04-data-contract', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-04 defines the data contract for the lane and target/proxy established earlier.' },
  { source: 'ml-04-data-contract', target: 'ml-07-baseline-action-score', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-07 uses real lane signals and safe inputs after the data contract and leakage work.' },
  { source: 'ml-07-baseline-action-score', target: 'ml-08-capstone-modeling', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-08 must compare the model against the Week 4 baseline on the same data and metric.' },
  { source: 'ml-08-capstone-modeling', target: 'ml-09-validation-claim-audit', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-09 re-runs and audits the Week 5 model.' },
  { source: 'ml-09-validation-claim-audit', target: 'ml-10-content-action-playbook', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-10 converts the validated output into a content action playbook.' },
  { source: 'ml-10-content-action-playbook', target: 'ml-11-ship-paper', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-10 exports the queue and figures that ML-11 uses in the paper.' },
  { source: 'ml-11-ship-paper', target: 'ml-12-tell-story', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'ML-12 starts from the live paper and adapts it for demo and sharing contexts.' },

  /* --------------- AI Fluency — Portfolio / Public Work --------------- */
  { source: 'fl-portfolio-proof', target: 'fl-portfolio-sitemap', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The sitemap is judged against the proof statement and one action.' },
  { source: 'fl-portfolio-sitemap', target: 'fl-portfolio-cases', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The case study work is for every piece the sitemap calls for.' },
  { source: 'fl-portfolio-cases', target: 'fl-content-ctas', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The content map places cases on pages and connects them to CTAs.' },
  { source: 'fl-content-ctas', target: 'fl-stack-choice', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The stack choice assignment asks students to paste the sitemap and content map into the AI prompt.' },
  { source: 'fl-stack-choice', target: 'fl-empty-live-page', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The blank live page must match the chosen stack.' },
  { source: 'fl-empty-live-page', target: 'pf-04-personal-website', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'PF-04 builds the real personal site after the earlier blank deployment milestone.' },
  { source: 'pf-04-personal-website', target: 'fl-dynamic-feature', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'The dynamic feature is added to the portfolio site.' },
  { source: 'pf-04-personal-website', target: 'fl-mobile-audit', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'The mobile audit tests the live portfolio.' },
  { source: 'fl-mobile-audit', target: 'fl-crit-review', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'The crit requires a live portfolio ready for external review.' },
  { source: 'fl-crit-review', target: 'fl-site-hardening', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'The hardening step extends review into edge cases and launch readiness.' },
  { source: 'fl-site-hardening', target: 'fl-domain-badge', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'Break Your Own Site must pass before launch, and Plant Your Flag is the launch step.' },
  { source: 'fl-domain-badge', target: 'fl-maintenance-plan', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'The maintenance plan follows the launched portfolio and explains how to keep it current.' },

  /* ----------------- AI Fluency — AI Systems / Agents ----------------- */
  { source: 'fl-01-workflow-audit', target: 'fl-02-prompting-fundamentals', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-02 requires using a real task from the FL-01 audit.' },
  { source: 'fl-01-workflow-audit', target: 'fl-04-automation-workflow', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-04 requires choosing a research or writing pipeline from the audit.' },
  { source: 'fl-04-automation-workflow', target: 'fl-05-agent-mcp-basics', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-05 asks students to classify their FL-04 pipeline as a workflow or agent.' },
  { source: 'fl-05-agent-mcp-basics', target: 'fl-06-agent-design', relationship: 'builds-on', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'FL-06 applies the agent/tool/guardrail concepts introduced in FL-05.' },
  { source: 'fl-06-agent-design', target: 'fl-07-build-agent', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-07 builds from the FL-06 agent spec.' },
  { source: 'fl-07-build-agent', target: 'fl-09-documentation-demo', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-09 documents and demos the working agent.' },

  /* ------------------------- FL-10 convergence ------------------------- */
  { source: 'pf-04-personal-website', target: 'fl-10-final-package', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-10 packages the live site as part of the final submission.' },
  { source: 'fl-09-documentation-demo', target: 'fl-10-final-package', relationship: 'builds-on', confidence: 'high', evidence: 'explicit', approved: true, reason: 'FL-10 packages the documented agent deliverables with the rest of the track.' },
  { source: 'fl-maintenance-plan', target: 'fl-10-final-package', relationship: 'connects-to', confidence: 'medium', evidence: 'strong-inference', approved: true, reason: 'The maintenance plan belongs to the final public-work package, but is not the only input.' },

  /* ------------------- Approved cross-track edges (§4.3) ------------------- */
  { source: 'fl-portfolio-proof', target: 'ml-02-research-question-lane', relationship: 'cross-track', confidence: 'high', evidence: 'editorial', approved: true, reason: 'Both assignments force the student to define the claim or question before choosing tools or building.' },
  { source: 'fl-portfolio-cases', target: 'ml-12-tell-story', relationship: 'cross-track', confidence: 'high', evidence: 'strong-inference', approved: true, reason: 'Both assignments turn real work into audience-specific communication without inventing a generic story.' },
  { source: 'pf-04-personal-website', target: 'ml-11-ship-paper', relationship: 'cross-track', confidence: 'high', evidence: 'strong-inference', approved: true, reason: 'Both require deploying work publicly so someone else can access and inspect it.' },
  { source: 'fl-09-documentation-demo', target: 'ml-11-ship-paper', relationship: 'cross-track', confidence: 'high', evidence: 'strong-inference', approved: true, reason: 'Both require a substantial artifact to be understandable, reproducible, and honest about limits for a stranger.' },
];

/**
 * Edges explicitly NOT approved for direct display (CONTENT_REGISTRY §4.4).
 * These pairs connect through one or more mediating concepts instead. Encoded
 * here so future edits stay auditable; the validator asserts none of these
 * appear in `publicEdges`.
 */
export const rejectedEdges: RejectedEdge[] = [
  {
    source: 'fl-prompt-ladder',
    target: 'ml-09-validation-claim-audit',
    relationship: 'connects-to',
    decision: 'Not approved as direct edge',
    mediatingConcepts: ['concept-evaluation'],
  },
  {
    source: 'fl-explain-build',
    target: 'ml-09-validation-claim-audit',
    relationship: 'connects-to',
    decision: 'Not approved as direct edge',
    mediatingConcepts: ['concept-human-judgment', 'concept-communication'],
  },
  {
    source: 'fl-site-hardening',
    target: 'ml-09-validation-claim-audit',
    relationship: 'connects-to',
    decision: 'Not approved as direct edge',
    mediatingConcepts: ['concept-evaluation', 'concept-human-judgment'],
  },
  {
    source: 'fl-04-automation-workflow',
    target: 'ml-10-content-action-playbook',
    relationship: 'connects-to',
    decision: 'Not approved as direct edge for default map',
    mediatingConcepts: ['concept-workflow-design'],
  },
  {
    source: 'ml-04-data-contract',
    target: 'fl-04-automation-workflow',
    relationship: 'connects-to',
    decision: 'Not approved',
    mediatingConcepts: [],
  },
];
