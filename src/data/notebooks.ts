/**
 * Notebook previews (IMPLEMENTATION_PLAN Task 3.1.2, DESIGN_SPEC §22–23).
 *
 * ML notebooks are NOT iframes. They render as a contained artifact viewport:
 * a compact title bar, a notebook heading, a results preview (chart, metric
 * table, code region) and OPEN NOTEBOOK / GITHUB actions. The card communicates
 * *what the artifact proves*, then allows deeper inspection.
 *
 * PLACEHOLDER: the filenames come from CONTENT_REGISTRY §3.2; the chart /
 * metric / code regions are intentionally empty until the author supplies the
 * real exported charts, a metric/result table, and the polished code excerpt.
 * The UI renders an honest "evidence attaches here" state (EVIDENCE: PARTIAL)
 * rather than a fake embed (PRODUCT_SPEC §3.4, DESIGN_SPEC §57).
 */

export interface NotebookPreview {
  /** The assignment that produced the notebook. */
  assignmentId: string;
  /** The notebook filename / heading shown in the viewport title bar. */
  filename: string;
  /** One plain sentence describing what the notebook yields (evidence framing). */
  outcome: string;
  /** Names of the exported chart images rendered inside the viewport (empty until supplied). */
  charts: string[];
  /** Metric/result rows rendered as a small table (empty until supplied). */
  metrics: { label: string; value: string }[];
  /** Short code/result excerpt shown in the card (empty until supplied). */
  code: string;
  /** true when the notebook actually carries evidence (charts/metrics/code). */
  hasEvidence: boolean;
}

export const notebookPreviews: NotebookPreview[] = [
  {
    assignmentId: 'ml-01-run-starter-notebooks',
    filename: 'starter_notebooks.ipynb',
    outcome: 'Runs the starter ML pipeline and records the rule-vs-model comparison.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-02-research-question-lane',
    filename: 'w01_research_question.ipynb',
    outcome: 'Commits the lane, the research question, and the decision it informs.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-03-ml-task-framing',
    filename: 'w02_ml_task_framing.ipynb',
    outcome: 'Frames the lane as a precise ML task with target and success metric.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-04-data-contract',
    filename: 'w03_data_contract.ipynb',
    outcome: 'Documents the data contract, the five-feature frame, and the leakage experiment.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-07-baseline-action-score',
    filename: 'w04_baseline_score.ipynb',
    outcome: 'Produces the baseline rule, the ranked queue CSV, and the top-10 review.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-08-capstone-modeling',
    filename: 'w05_model.ipynb',
    outcome: 'Builds the model and produces the model-versus-baseline comparison table.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-09-validation-claim-audit',
    filename: 'w06_validation_audit.ipynb',
    outcome: 'Re-runs the model with an honest split and audits the research claim.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-10-content-action-playbook',
    filename: 'w07_action_playbook.ipynb',
    outcome: 'Converts the validated output into a ranked action playbook and figures.',
    charts: [],
    metrics: [],
    code: '',
    hasEvidence: false,
  },
];

/** Look up a notebook preview by the assignment that produced it. */
export function notebookForAssignment(assignmentId: string): NotebookPreview | undefined {
  return notebookPreviews.find((n) => n.assignmentId === assignmentId);
}
