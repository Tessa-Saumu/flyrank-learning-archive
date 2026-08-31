/**
 * "What I Wish I Knew in Week 1" (IMPLEMENTATION_PLAN Task 3.2.2,
 * PRODUCT_SPEC §30, DESIGN_SPEC §28).
 *
 * A compact, practical, future-student reference section. Each numbered
 * statement is TRACEABLE to one or more canonical assignments (rendered as
 * links). The statement wording is drafted from the completed assignment copy
 * in this archive, not invented as a motivational essay (PRODUCT_SPEC §30).
 *
 * `assignmentIds` must resolve to canonical assignments (validator-enforced).
 */

export interface WishIKnewStatement {
  id: string;
  /** Plain, direct advice statement (no inspirational-quote styling). */
  text: string;
  /** Canonical assignment ids that this lesson is traceable to. */
  assignmentIds: string[];
}

export const wishIKnew: WishIKnewStatement[] = [
  {
    id: 'wik-1',
    text: 'You do not need to understand the entire track before starting. The first assignments are deliberately small and get bigger only after you have something real to work with.',
    assignmentIds: ['ml-01-run-starter-notebooks', 'fl-01-workflow-audit', 'fl-portfolio-sitemap'],
  },
  {
    id: 'wik-2',
    text: 'Define the thing you are trying to prove before choosing the tool. Both tracks made me write down the claim or question first, and that single sentence decided most of what came next.',
    assignmentIds: ['fl-portfolio-proof', 'ml-02-research-question-lane', 'ml-03-ml-task-framing'],
  },
  {
    id: 'wik-3',
    text: 'Build something small enough to test. A runnable slice with a clear reference point teaches more than a large build you cannot yet evaluate.',
    assignmentIds: ['ml-07-baseline-action-score', 'fl-stack-choice', 'fl-empty-live-page'],
  },
  {
    id: 'wik-4',
    text: 'Treat AI output as something to evaluate, not automatically accept. The prompt ladder and the baseline work both come down to comparing versions against a stated target.',
    assignmentIds: ['fl-prompt-ladder', 'fl-02-prompting-fundamentals', 'ml-07-baseline-action-score'],
  },
  {
    id: 'wik-5',
    text: 'A working artifact with clear limits is more useful than a polished explanation of an untested idea. The crit, the breakdown step, and the validation audit all pushed the same lesson.',
    assignmentIds: ['fl-crit-review', 'fl-site-hardening', 'ml-09-validation-claim-audit'],
  },
  {
    id: 'wik-6',
    text: 'Document the work while the decisions are still fresh. The agent README, the demo video, and the case write-ups were all much easier to produce close to the build than they would have been later.',
    assignmentIds: ['fl-09-documentation-demo', 'fl-portfolio-cases', 'fl-explain-build'],
  },
];
