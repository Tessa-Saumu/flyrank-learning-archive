/**
 * Locked concept registry — 10 concepts with descriptions and approved
 * assignment mappings from CONTENT_REGISTRY §4.1 (which supersedes the
 * earlier concept list in PRODUCT_SPEC §12).
 *
 * The `assignments` arrays are encoded EXACTLY as locked. Together they total
 * 58 mapping instances (the validator asserts this against the locked set).
 */
import type { Concept } from './types';

export const concepts: Concept[] = [
  {
    id: 'concept-problem-framing',
    name: 'Problem Framing',
    description: 'Define what you are trying to prove or answer before choosing the tool.',
    assignments: [
      'fl-portfolio-proof',
      'fl-portfolio-sitemap',
      'fl-content-ctas',
      'ml-02-research-question-lane',
      'ml-03-ml-task-framing',
      'fl-06-agent-design',
    ],
  },
  {
    id: 'concept-data-evidence',
    name: 'Data & Evidence',
    description: 'Use real evidence and do not ask it to support more than it can.',
    assignments: [
      'ml-01-run-starter-notebooks',
      'ml-02-research-question-lane',
      'ml-04-data-contract',
      'ml-07-baseline-action-score',
      'ml-09-validation-claim-audit',
      'ml-11-ship-paper',
    ],
  },
  {
    id: 'concept-baseline',
    name: 'Baseline',
    description: 'Establish a reference point before claiming improvement.',
    assignments: ['ml-07-baseline-action-score', 'ml-08-capstone-modeling'],
  },
  {
    id: 'concept-evaluation',
    name: 'Evaluation',
    description: 'Test the thing rather than trusting the thing.',
    assignments: [
      'fl-prompt-ladder',
      'fl-02-prompting-fundamentals',
      'ml-08-capstone-modeling',
      'ml-09-validation-claim-audit',
      'fl-crit-review',
      'fl-site-hardening',
      'fl-09-documentation-demo',
      'fl-06-agent-design',
    ],
  },
  {
    id: 'concept-prompting',
    name: 'Prompting',
    description: 'Treat AI interaction as a deliberate, testable process.',
    assignments: [
      'fl-01-workflow-audit',
      'fl-prompt-ladder',
      'fl-02-prompting-fundamentals',
      'ml-03-ml-task-framing',
    ],
  },
  {
    id: 'concept-workflow-design',
    name: 'Workflow Design',
    description: 'Break work into steps, define handoffs, and name where human review belongs.',
    assignments: [
      'fl-01-workflow-audit',
      'fl-04-automation-workflow',
      'fl-05-agent-mcp-basics',
      'ml-10-content-action-playbook',
    ],
  },
  {
    id: 'concept-agents-tools',
    name: 'Agents & Tools',
    description: 'A real agent has a defined job, tools, constraints, and a way to evaluate it.',
    assignments: [
      'fl-05-agent-mcp-basics',
      'fl-06-agent-design',
      'fl-07-build-agent',
      'fl-09-documentation-demo',
    ],
  },
  {
    id: 'concept-human-judgment',
    name: 'Human Judgment',
    description:
      'The human remains responsible for deciding what to trust, keep, reject, automate, and explain.',
    assignments: [
      'fl-01-workflow-audit',
      'fl-02-prompting-fundamentals',
      'fl-curate-images',
      'fl-05-agent-mcp-basics',
      'fl-06-agent-design',
      'fl-07-build-agent',
      'ml-04-data-contract',
      'ml-07-baseline-action-score',
      'ml-09-validation-claim-audit',
      'fl-crit-review',
    ],
  },
  {
    id: 'concept-deployment',
    name: 'Deployment',
    description:
      'Move work from an internal build into a form someone else can run, access, or inspect.',
    assignments: [
      'fl-empty-live-page',
      'pf-04-personal-website',
      'fl-dynamic-feature',
      'fl-domain-badge',
      'ml-11-ship-paper',
      'fl-07-build-agent',
      'fl-09-documentation-demo',
    ],
  },
  {
    id: 'concept-communication',
    name: 'Communication',
    description: "Make the work understandable outside the builder's head.",
    assignments: [
      'fl-portfolio-cases',
      'fl-explain-build',
      'ml-11-ship-paper',
      'ml-12-tell-story',
      'fl-09-documentation-demo',
      'fl-10-final-package',
      'fl-maintenance-plan',
    ],
  },
];
