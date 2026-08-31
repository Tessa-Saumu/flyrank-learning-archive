/**
 * My Working Framework (IMPLEMENTATION_PLAN Task 3.2.1, PRODUCT_SPEC §31,
 * DESIGN_SPEC §27).
 *
 * This is an EARNED synthesis, not a standalone motivational diagram. Each
 * step links downward to the assignments that justify it, and the visitor can
 * drill from synthesis back to evidence. The step ids/names follow the
 * candidate structure in PRODUCT_SPEC §31 verbatim.
 *
 * Every `assignmentIds` entry must resolve to a canonical assignment (the
 * validator asserts referential integrity). No step is invented beyond the
 * completed work; the assignment references are drawn from the locked registry
 * and the real cross-track/step clusters identified in PRODUCT_SPEC §31.
 */

export interface FrameworkStep {
  id: string;
  /** Short uppercase step label, e.g. "DEFINE". */
  label: string;
  /** One plain-language sentence describing what the step is. */
  description: string;
  /** Canonical assignment ids that earned this step (in the order they chain). */
  assignmentIds: string[];
}

export const frameworkSteps: FrameworkStep[] = [
  {
    id: 'define',
    label: 'Define',
    description:
      'Name the claim, question, or problem before choosing the tool or writing the code.',
    assignmentIds: [
      'fl-portfolio-proof',
      'ml-02-research-question-lane',
      'ml-03-ml-task-framing',
      'fl-06-agent-design',
    ],
  },
  {
    id: 'decide-what-good-looks-like',
    label: 'Decide what good looks like',
    description:
      'Turn the definition into a measurable target, a unit of analysis, and a checkable success metric.',
    assignmentIds: [
      'ml-04-data-contract',
      'ml-07-baseline-action-score',
      'fl-04-automation-workflow',
      'fl-05-agent-mcp-basics',
    ],
  },
  {
    id: 'build-small',
    label: 'Build small',
    description:
      'Ship a small, runnable slice first so the work is testable before it is polished.',
    assignmentIds: [
      'fl-stack-choice',
      'fl-empty-live-page',
      'ml-07-baseline-action-score',
      'ml-08-capstone-modeling',
    ],
  },
  {
    id: 'test',
    label: 'Test',
    description:
      'Run the thing against the reference point and the metric, rather than trusting the thing.',
    assignmentIds: [
      'fl-prompt-ladder',
      'ml-08-capstone-modeling',
      'ml-09-validation-claim-audit',
      'fl-site-hardening',
    ],
  },
  {
    id: 'find-failure',
    label: 'Find failure',
    description:
      'Deliberately look for where the evidence is weak, the claim overreaches, or the build breaks.',
    assignmentIds: [
      'ml-04-data-contract',
      'ml-09-validation-claim-audit',
      'fl-crit-review',
      'fl-mobile-audit',
    ],
  },
  {
    id: 'explain',
    label: 'Explain',
    description:
      'Make the work understandable to someone who was not in your head when you built it.',
    assignmentIds: [
      'fl-explain-build',
      'fl-portfolio-cases',
      'ml-12-tell-story',
      'fl-09-documentation-demo',
    ],
  },
  {
    id: 'ship',
    label: 'Ship',
    description:
      'Move the work into a form someone else can run, access, inspect, and build on.',
    assignmentIds: [
      'fl-empty-live-page',
      'pf-04-personal-website',
      'fl-07-build-agent',
      'ml-11-ship-paper',
    ],
  },
];
