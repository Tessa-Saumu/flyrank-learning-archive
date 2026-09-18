/**
 * Notebook previews (IMPLEMENTATION_PLAN Task 3.1.2, DESIGN_SPEC §22–23).
 *
 * ML notebooks are NOT iframes. They render as a contained artifact viewport:
 * a compact title bar, one row per executed notebook (filename, one-sentence
 * outcome, OPEN NOTEBOOK action), a results region (metric table when the
 * committed output JSON carries one) and a GitHub repository action.
 *
 * All notebook links are the real, public files in the FlyRank ML internship
 * repository (resolved 2026-09-18, CONTENT_REGISTRY §3.4). The metric tables
 * are the author's committed output files (work/outputs/*.json) and the
 * starter model report (outputs/model_report.md), copied verbatim:
 *
 *   - ml-01  outputs/model_report.md (the executed starter pipeline)
 *   - ml-07  work/outputs/baseline_metrics.json
 *   - ml-08  work/outputs/model_metrics.json (5-fold grouped CV summary)
 *   - ml-09  work/outputs/validation_audit_metrics.json
 *   - ml-10  work/outputs/action_playbook_summary.json
 *
 * Chart images and code excerpts are still exported per notebook, so those
 * regions stay in the honest "evidence attaches here" state (EVIDENCE:
 * PARTIAL behaviour per region, PRODUCT_SPEC §3.4) rather than showing
 * anything fabricated.
 */

const ML_REPO = 'https://github.com/Tessa-Saumu/FlyRank-ML-Internship';
const ML_BLOB = `${ML_REPO}/blob/main/`;

/** One executed notebook: filename, real public link, one-sentence outcome. */
export interface NotebookRef {
  filename: string;
  /** The public GitHub location of this notebook. */
  openUrl: string;
  /** One plain sentence describing what this notebook yields. */
  outcome: string;
}

export interface NotebookPreview {
  /** The assignment that produced the notebooks. */
  assignmentId: string;
  /** The repository the notebooks live in (footer action). */
  githubUrl: string;
  /** The executed notebooks for this assignment, in run order. */
  notebooks: NotebookRef[];
  /** Metric/result rows from the committed output files (empty until supplied). */
  metrics: { label: string; value: string }[];
  /** Names of the exported chart images rendered inside the viewport (empty until supplied). */
  charts: string[];
  /** Short code/result excerpt shown in the card (empty until supplied). */
  code: string;
  /** true when the notebook carries in-card evidence (charts/metrics/code). */
  hasEvidence: boolean;
}

export const notebookPreviews: NotebookPreview[] = [
  {
    assignmentId: 'ml-01-run-starter-notebooks',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: '01_first_look_and_discovery.ipynb',
        openUrl: `${ML_BLOB}notebooks/01_first_look_and_discovery.ipynb`,
        outcome:
          'First look at the anonymised refresh data: the label rate, the raw signals, and the shape of the problem.',
      },
      {
        filename: '02_your_first_readable_model.ipynb',
        openUrl: `${ML_BLOB}notebooks/02_your_first_readable_model.ipynb`,
        outcome:
          'A hand-written rule versus a learned model, computed on the same rows and the same metric before any theory is studied.',
      },
    ],
    metrics: [
      { label: 'Rows scored (starter dataset)', value: '30,000' },
      { label: 'Baseline rule Precision@50', value: '0.240' },
      { label: 'Random forest Precision@50', value: '0.740' },
      { label: 'Random forest ROC AUC', value: '0.750' },
    ],
    charts: [],
    code: '',
    hasEvidence: true,
  },
  {
    assignmentId: 'ml-02-research-question-lane',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w01_research_question.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w01_research_question.ipynb`,
        outcome:
          'Commits the lane, the research question, the decision it improves, and the cost of a wrong answer.',
      },
    ],
    metrics: [],
    charts: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-03-ml-task-framing',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w02_ml_task_framing.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w02_ml_task_framing.ipynb`,
        outcome:
          'Frames the lane as a precise ML task: task type, target column, unit of analysis, and success metric.',
      },
    ],
    metrics: [],
    charts: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-04-data-contract',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w03_data_contract.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w03_data_contract.ipynb`,
        outcome:
          "Documents the lane's slice of the pipeline, verifies three facts with real queries, and builds the five-feature frame.",
      },
      {
        filename: 'w03_feature_leakage_check.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w03_feature_leakage_check.ipynb`,
        outcome:
          'Deliberately triggers label leakage, shows how far the score jumps, then removes it.',
      },
      {
        filename: '03_working_with_the_full_release.ipynb',
        openUrl: `${ML_BLOB}notebooks/03_working_with_the_full_release.ipynb`,
        outcome:
          'Works with the full anonymised release rather than the final-month sample.',
      },
    ],
    metrics: [],
    charts: [],
    code: '',
    hasEvidence: false,
  },
  {
    assignmentId: 'ml-07-baseline-action-score',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w04_baseline_score.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w04_baseline_score.ipynb`,
        outcome:
          'Encodes the hand-written rule with a score and reason code, and writes the ranked queue to CSV.',
      },
      {
        filename: 'w04_signal_audit.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w04_signal_audit.ipynb`,
        outcome:
          'Checks the two signals the rule relies on against real data before trusting them.',
      },
    ],
    metrics: [
      { label: 'Base rate (label prevalence)', value: '0.4908' },
      { label: 'Baseline Precision@50', value: '0.560' },
      { label: 'Baseline NDCG@50', value: '0.471' },
      { label: 'Tie-band decline rate (n = 24,462)', value: '0.507' },
    ],
    charts: [],
    code: '',
    hasEvidence: true,
  },
  {
    assignmentId: 'ml-08-capstone-modeling',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w05_model.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w05_model.ipynb`,
        outcome:
          'Builds the model and produces the model-versus-baseline comparison on the same data and metric.',
      },
    ],
    metrics: [
      { label: 'Rows modelled (5-fold grouped CV)', value: '95,810' },
      { label: 'Baseline P@50 (mean of folds)', value: '0.512' },
      { label: 'Logistic regression P@50 (mean of folds)', value: '0.636' },
      { label: 'Random forest P@50 (mean of folds)', value: '0.608' },
      { label: 'Random forest average precision (mean)', value: '0.561' },
    ],
    charts: [],
    code: '',
    hasEvidence: true,
  },
  {
    assignmentId: 'ml-09-validation-claim-audit',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w06_validation_audit.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w06_validation_audit.ipynb`,
        outcome:
          'Re-runs the model under grouped and time-aware splits and audits the research claim against the evidence.',
      },
    ],
    metrics: [
      { label: 'Random split RF ROC AUC (34 clients shared)', value: '0.734' },
      { label: 'Grouped CV RF ROC AUC (honest split)', value: '0.604' },
      { label: 'Time-forward RF P@50 (March to April)', value: '0.14' },
      { label: 'Leak injection, honest AP to injected AP', value: '0.761 to 0.993' },
    ],
    charts: [],
    code: '',
    hasEvidence: true,
  },
  {
    assignmentId: 'ml-10-content-action-playbook',
    githubUrl: ML_REPO,
    notebooks: [
      {
        filename: 'w07_action_playbook.ipynb',
        openUrl: `${ML_BLOB}work/notebooks/w07_action_playbook.ipynb`,
        outcome:
          'Converts the validated output into the ranked action playbook with reason codes, review rules, and safety gates.',
      },
    ],
    metrics: [
      { label: 'Action queue size', value: '50' },
      { label: 'Model queue Precision@50', value: '0.608' },
      { label: 'Precision gain vs random tie order', value: '0.101' },
      { label: 'Safety gate (cleared / escalated)', value: '47 / 3' },
    ],
    charts: [],
    code: '',
    hasEvidence: true,
  },
];

/** Look up the notebook preview record for the assignment that produced it. */
export function notebookForAssignment(assignmentId: string): NotebookPreview | undefined {
  return notebookPreviews.find((n) => n.assignmentId === assignmentId);
}
