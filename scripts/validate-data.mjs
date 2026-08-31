#!/usr/bin/env node
/**
 * validate-data.mjs — dependency-free data validator (IMPLEMENTATION_PLAN §1.1.5).
 *
 * Fails the build (exit 1) on any violation. Prints a data census for the
 * record. Never writes counts into UI copy; this script only.
 *
 * Run: npm run validate
 *
 * The hard-coded expected sets below are flagged `AUDIT SET` in comments.
 * They mirror the locked CONTENT_REGISTRY verbatim so that accidental data
 * drift during implementation is caught. If the registry changes, update the
 * registry first, then this validator in the same commit (§1.4).
 */
import { assignments } from '../src/data/assignments.ts';
import { concepts } from '../src/data/concepts.ts';
import { artifacts, artifactLinks } from '../src/data/artifacts.ts';
import { publicEdges, rejectedEdges } from '../src/data/graph.ts';
import { frameworkSteps } from '../src/data/framework.ts';
import { wishIKnew } from '../src/data/wish-i-knew.ts';
import { finalReflection } from '../src/data/reflection.ts';

const errors = [];
const fail = (msg) => errors.push(msg);

/* ============================================================================
 * AUDIT SET — canonical assignment IDs (CONTENT_REGISTRY §1.1), verbatim.
 * ========================================================================== */
const EXPECTED_ASSIGNMENT_IDS = [
  // Machine Learning spine (10)
  'ml-01-run-starter-notebooks',
  'ml-02-research-question-lane',
  'ml-03-ml-task-framing',
  'ml-04-data-contract',
  'ml-07-baseline-action-score',
  'ml-08-capstone-modeling',
  'ml-09-validation-claim-audit',
  'ml-10-content-action-playbook',
  'ml-11-ship-paper',
  'ml-12-tell-story',
  // AI Fluency — AI Systems / Agents (8)
  'fl-01-workflow-audit',
  'fl-prompt-ladder',
  'fl-02-prompting-fundamentals',
  'fl-04-automation-workflow',
  'fl-05-agent-mcp-basics',
  'fl-06-agent-design',
  'fl-07-build-agent',
  'fl-09-documentation-demo',
  // AI Fluency — Portfolio / Public Work (16)
  'fl-portfolio-proof',
  'fl-portfolio-sitemap',
  'fl-portfolio-cases',
  'fl-identity-kit',
  'fl-curate-images',
  'fl-content-ctas',
  'fl-empty-live-page',
  'fl-stack-choice',
  'fl-explain-build',
  'pf-04-personal-website',
  'fl-dynamic-feature',
  'fl-mobile-audit',
  'fl-crit-review',
  'fl-site-hardening',
  'fl-domain-badge',
  'fl-maintenance-plan',
  // Convergence (1)
  'fl-10-final-package',
];

/* ============================================================================
 * AUDIT SET — officialCode mapping. The registry provides a code for exactly
 * these 19 assignments (ML-01..ML-12 minus ML-05/ML-06, FL-01, FL-02, FL-04,
 * FL-05, FL-06, FL-07, FL-09, FL-10, PF-04). No code is invented for the
 * other 16 AI Fluency assignments.
 * ========================================================================== */
const EXPECTED_OFFICIAL_CODES = {
  'ml-01-run-starter-notebooks': 'ML-01',
  'ml-02-research-question-lane': 'ML-02',
  'ml-03-ml-task-framing': 'ML-03',
  'ml-04-data-contract': 'ML-04',
  'ml-07-baseline-action-score': 'ML-07',
  'ml-08-capstone-modeling': 'ML-08',
  'ml-09-validation-claim-audit': 'ML-09',
  'ml-10-content-action-playbook': 'ML-10',
  'ml-11-ship-paper': 'ML-11',
  'ml-12-tell-story': 'ML-12',
  'fl-01-workflow-audit': 'FL-01',
  'fl-02-prompting-fundamentals': 'FL-02',
  'fl-04-automation-workflow': 'FL-04',
  'fl-05-agent-mcp-basics': 'FL-05',
  'fl-06-agent-design': 'FL-06',
  'fl-07-build-agent': 'FL-07',
  'fl-09-documentation-demo': 'FL-09',
  'fl-10-final-package': 'FL-10',
  'pf-04-personal-website': 'PF-04',
};

/* ============================================================================
 * AUDIT SET — locked concept mappings (CONTENT_REGISTRY §4.1). 58 instances.
 * ========================================================================== */
const LOCKED_CONCEPT_MAPPINGS = {
  'concept-problem-framing': [
    'fl-portfolio-proof',
    'fl-portfolio-sitemap',
    'fl-content-ctas',
    'ml-02-research-question-lane',
    'ml-03-ml-task-framing',
    'fl-06-agent-design',
  ],
  'concept-data-evidence': [
    'ml-01-run-starter-notebooks',
    'ml-02-research-question-lane',
    'ml-04-data-contract',
    'ml-07-baseline-action-score',
    'ml-09-validation-claim-audit',
    'ml-11-ship-paper',
  ],
  'concept-baseline': ['ml-07-baseline-action-score', 'ml-08-capstone-modeling'],
  'concept-evaluation': [
    'fl-prompt-ladder',
    'fl-02-prompting-fundamentals',
    'ml-08-capstone-modeling',
    'ml-09-validation-claim-audit',
    'fl-crit-review',
    'fl-site-hardening',
    'fl-09-documentation-demo',
    'fl-06-agent-design',
  ],
  'concept-prompting': [
    'fl-01-workflow-audit',
    'fl-prompt-ladder',
    'fl-02-prompting-fundamentals',
    'ml-03-ml-task-framing',
  ],
  'concept-workflow-design': [
    'fl-01-workflow-audit',
    'fl-04-automation-workflow',
    'fl-05-agent-mcp-basics',
    'ml-10-content-action-playbook',
  ],
  'concept-agents-tools': [
    'fl-05-agent-mcp-basics',
    'fl-06-agent-design',
    'fl-07-build-agent',
    'fl-09-documentation-demo',
  ],
  'concept-human-judgment': [
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
  'concept-deployment': [
    'fl-empty-live-page',
    'pf-04-personal-website',
    'fl-dynamic-feature',
    'fl-domain-badge',
    'ml-11-ship-paper',
    'fl-07-build-agent',
    'fl-09-documentation-demo',
  ],
  'concept-communication': [
    'fl-portfolio-cases',
    'fl-explain-build',
    'ml-11-ship-paper',
    'ml-12-tell-story',
    'fl-09-documentation-demo',
    'fl-10-final-package',
    'fl-maintenance-plan',
  ],
};

/* ============================================================================
 * AUDIT SET — approved copy (PRODUCT_SPEC §15) with the three safeguards
 * applied: revised ML-03 wording, revised FL Ship wording, and the FL-04
 * source-safe edit ("runs on a brand new input", no "without your
 * intervention").
 * ========================================================================== */
const APPROVED_COPY = {
  'ml-01-run-starter-notebooks': {
    task: 'Clone the starter repo, run a live ML pipeline on real search data, and observe a hand-written rule get outperformed by a learned model before you have studied any theory.',
    lesson:
      'The gap between a rule and a model is not abstract. Seeing it computed in front of you, before you know the theory, is what makes the concept stick.',
    takeaway:
      'The repo structure matters as much as the notebooks. Read GUIDE.md before you start so you know which folders are yours and which you should not touch.',
  },
  'ml-02-research-question-lane': {
    task: 'Pick a provisional project lane and write a framing notebook that defines your research question, the decision it improves, the action it enables, and the cost of a wrong answer, backed by real numbers from the starter data.',
    lesson:
      'An ML project that does not name a decision and an action is just a modelling exercise. The framing question forces you to connect the output to something that matters.',
    takeaway:
      'The lane can change until Week 4, so do not agonise over it. What you cannot defer is being concrete: vague questions produce vague projects.',
  },
  'ml-03-ml-task-framing': {
    task: 'Translate your research question into a precise ML task definition, including task type, target column, and success metric, and make the unit of analysis visible as real data.',
    lesson:
      'The gap between wanting to predict something useful and defining X for unit Y with a measurable success metric is what this assignment makes concrete.',
    takeaway:
      'Use AI to explore options for task type and target, but write the explanation yourself. The graded part is your reasoning, not what the model suggested.',
  },
  'ml-04-data-contract': {
    task: "Document your lane's slice of the data pipeline in plain language, verify three facts about it with real queries, build a five-feature frame with availability justifications, and deliberately trigger label leakage to see what it looks like before removing it.",
    lesson:
      "The deliberate leakage experiment is the assignment's most useful moment. Watching your score jump toward perfect when you include a label-derived column makes the problem real in a way that reading about it does not.",
    takeaway:
      'The sample table is the final month only, not a random sample. Do not use it to develop label logic. Iterate on a mid-panel month and treat the final month as sealed.',
  },
  'ml-07-baseline-action-score': {
    task: "Check two signals your rule relies on with real data, encode one hand-written rule with a score and reason code, write the ranked queue to a CSV, and review your top ten outputs row by row with a skeptic's eye.",
    lesson:
      'Building the baseline rule before the model forces you to be honest about what the rule actually leans on, and the signal checks reveal whether those assumptions hold.',
    takeaway:
      'A clearly explained negative signal verdict is not a failure. The brief says so explicitly. If your signal check comes back OPPOSITE or FALSE, that is useful information that may just have saved your rule design.',
  },
  'ml-08-capstone-modeling': {
    task: 'Build the appropriate model or analysis for your lane, then produce a clear model-versus-baseline comparison table on the same data and same metric, with an interpretation of what the errors look like.',
    lesson:
      'Modeling comes last in the sequence because by this point you have something honest to beat and clean features to beat it with. The order of operations is not arbitrary.',
    takeaway:
      'The assignment explicitly says it does not reward complexity alone. A simpler model that beats the baseline on the right metric is better than a sophisticated one you cannot explain.',
  },
  'ml-09-validation-claim-audit': {
    task: 'Audit your Week 5 model by re-running it under a grouped or time-aware split, checking features for leakage, reviewing real failure examples, and rewriting any claims that go further than the evidence, while also applying the same critical reading to two findings from the FlyRank research paper.',
    lesson:
      'Running your own model under a stricter validation design and seeing the before/after difference is what turns a model result into a trustworthy claim.',
    takeaway:
      'The paper audit is not about finding fault. It is practice for applying the same rigor to your own work. Frame both parts the way you would want your own work reviewed.',
  },
  'ml-10-content-action-playbook': {
    task: 'Convert your validated model output into a structured content action playbook with ranked actions, reason codes, human-review rules, monitoring triggers, and an explicit list of what should not be automated, then export the files your paper will use.',
    lesson:
      'A model score is not the end product. The playbook is the step where analytical output becomes something a person can actually use, with known limits attached.',
    takeaway:
      'Build this carefully because it becomes the recommendations section of your paper. Poor work here costs you twice.',
  },
  'ml-11-ship-paper': {
    task: 'Research how good research pages are structured, make deliberate choices about format and presentation, then deploy a paper that includes baseline, validation, interpretation, ranked recommendations, and honest claim language throughout.',
    lesson:
      '"Finding and judging best practices yourself is part of the assignment." This is the first place in the track where presentation decisions are explicitly your own to research and make.',
    takeaway:
      'Anyone with your repo should be able to rerun or inspect the work. Reproducibility is a required section, not an afterthought.',
  },
  'ml-12-tell-story': {
    task: "Reframe your paper's findings as a case study tied to a real FlyRank content problem, and prepare two audience-specific versions of the work for sharing and for a potential live demo.",
    lesson:
      'The case study lives inside the paper, not in a separate file. The assignment is mostly about making sure the paper already contains what you need, rather than adding more documents.',
    takeaway:
      'The demo outline is optional to present but worth writing either way. It forces you to identify your one honest result and one recommendation, which sharpens the paper itself.',
  },
  'fl-01-workflow-audit': {
    task: 'Audit your real workflow against an AI task-classification framework, configure your tooling including a Claude Project with custom instructions, and define what "done well" looks like for each of your three target tasks.',
    lesson:
      'Defining what "done well" means before you start prompting is what separates deliberate practice from just running more prompts.',
    takeaway:
      'At least two tasks must honestly be "just me" with a reason. That is not a formality. It is the most important part of the audit.',
  },
  'fl-prompt-ladder': {
    task: 'Take a genuinely weak prompt from your own work, improve it across five versions where each version adds exactly one named layer, and document what actually changed in the output at each step.',
    lesson:
      'Changing one thing at a time is the only way to know which change caused the improvement. Changing several things at once and seeing a better result teaches you nothing.',
    takeaway:
      'The note that matters is "what improved in the output," not "what I changed in the prompt." If you can only write the second kind, you are not looking closely enough at the results.',
  },
  'fl-02-prompting-fundamentals': {
    task: "Work through Anthropic's prompt engineering tutorial, apply five named techniques to a real task from your FL-01 audit, run the final prompt on both Claude and ChatGPT, and distill the result into a reusable template.",
    lesson:
      'Practicing on a real task from your own audit is what makes the techniques stick. Toy examples do not surface the same failure points.',
    takeaway:
      'The cross-model comparison needs to say something specific. "Both were fine" does not pass. Compare tone, accuracy, structure, and failure points separately.',
  },
  'fl-04-automation-workflow': {
    // SOURCE-SAFE EDIT: "without your intervention" removed (CONTENT_REGISTRY §2.2).
    task: 'Build an end-to-end automated pipeline that runs on a brand new input, time it against doing the same task manually, and document what it cannot do.',
    lesson:
      'Timing yourself against the manual version and being honest about the setup cost is what distinguishes a genuine productivity tool from a demonstration.',
    takeaway:
      'Sketch the flow before you build. The brief says to do this and it is good advice. Building a multi-step workflow without a step diagram usually ends in an unworkable structure.',
  },
  'fl-05-agent-mcp-basics': {
    task: 'Classify your FL-04 pipeline accurately as a workflow or an agent, demonstrate one real MCP connection working, and write a technically correct explainer that describes what your pipeline would need to become a true agent.',
    lesson:
      'MCP\'s three primitives, tools, resources, and prompts, are a useful framework. Understanding them is what lets you evaluate whether a tool\'s "agent" claims hold up.',
    takeaway:
      'One concrete agent upgrade named for your own pipeline is a required part of the explainer. Vague gestures toward "adding more tools" do not count.',
  },
  'fl-06-agent-design': {
    task: 'Scope one job for an agent, justify your platform choice against at least one alternative, and specify what the agent must confirm and what it must never do before you write a line of configuration.',
    lesson:
      'The guardrails section is not an afterthought. Naming what the agent must never do is part of the design, not a disclaimer you add at the end.',
    takeaway:
      'Scope it to one job done well. The brief is explicit. The grading criteria cap the expected build time at roughly ten hours. If your spec requires more, the scope is too large.',
  },
  'fl-07-build-agent': {
    task: 'Ship an MVP agent that completes its core job end to end without mid-run hand-editing, with at least one live tool connection and a build log that shows real iteration.',
    lesson:
      'Build logs that show real iteration, including what you cut and why, are more credible than clean retrospective stories. The honest version of what happened is the valuable record.',
    takeaway:
      'Deviating from your FL-06 spec is normal. The requirement is to document why, not to pretend it did not happen.',
  },
  'fl-09-documentation-demo': {
    task: 'Make your agent legible to a stranger through a setup-reproducible README and an honest demo that includes one real limitation explained on camera.',
    lesson:
      'Including one limitation explained on camera is a required criterion, not a nice-to-have. Honesty about limitations reads as credibility, not weakness.',
    takeaway:
      'Add a line in the README naming what you built with AI and how. The brief explicitly requires transparency about AI involvement.',
  },
  'fl-portfolio-proof': {
    task: 'Define the single most important thing your portfolio must prove, who it must prove it to, and what you want them to do, with AI as a questioning partner rather than a drafter.',
    lesson:
      'Everything downstream of this assignment is easier once the claim is settled. The brief says so plainly. The time spent here is not wasted on framing. It is the work.',
    takeaway:
      'Push back on the AI\'s output until the claim sounds like yours, not like something generated. The pass criterion explicitly says "could only describe your proof, not any portfolio."',
  },
  'fl-portfolio-sitemap': {
    task: 'Design a sitemap with only the pages that earn their place, and immediately test it against your claim by prompting Claude to find the weaknesses.',
    lesson:
      'Using AI to pressure-test a plan you have just made is a different skill from using AI to generate ideas. The value is in having something concrete to test.',
    takeaway:
      'Resist adding pages. The brief says so directly and the pass criteria enforce it. Extra pages are a sign the claim is not narrow enough yet.',
  },
  'fl-portfolio-cases': {
    task: 'Build case studies for every piece the sitemap calls for, using AI as an interviewer to pull out the honest messy version, then edit until it sounds like a specific person talking about a specific project.',
    lesson:
      'A portfolio is mostly the framing around the work. The framing is what a stranger reads first, and it is what makes them trust you or scroll past.',
    takeaway:
      'Start with the work you are making in this internship. The brief suggests it explicitly, and it means you are building the case study alongside the project rather than reconstructing it from memory.',
  },
  'fl-identity-kit': {
    task: 'Choose your fonts, colour palette, and logo, write a two-line style note, and add the style note to your Claude Project so all future build work inherits the same decisions.',
    lesson:
      'Visual consistency comes from making a small number of decisions once, not from having design talent. The kit makes every later page cheaper to build.',
    takeaway:
      'The palette should be calm enough that your work is the loudest thing on the page. That constraint is the design principle, not just a preference.',
  },
  'fl-curate-images': {
    task: 'Identify every image your portfolio actually needs, use real captures for your work and generate only connective-tissue images in a consistent style, and write a short note explaining at least one generated image you rejected and why.',
    lesson:
      'The skill is not generation. It is knowing when a real screenshot of your work beats anything generated, and being able to explain the difference.',
    takeaway:
      'The rejection note is graded. "I liked this one better" is not enough. The brief asks for genuine judgment about what serves your proof.',
  },
  'fl-content-ctas': {
    task: 'Write a single memorable one-line claim, build a content map that puts sections in order per page with the strongest work leading, and list anything you still need to gather before the build week.',
    lesson:
      'A good case in the wrong place still fails. The content map is what prevents you from building a site that is complete but incoherent.',
    takeaway:
      'The gather-list is not an optional extra. The brief says it exists so the build week is not blocked. Do it honestly.',
  },
  'fl-empty-live-page': {
    task: 'Get a near-blank page live on a real public URL, confirm it works on your phone, and load your identity kit, case studies, and content map into your Claude Project so the build week can start without setup.',
    lesson:
      'Getting something live on a URL, even if it just says your name, removes a major setup barrier before the build week. The point is to start the build with something already deployed.',
    takeaway:
      'Test the URL on a second device, not just a resized browser. The pass criteria require it.',
  },
  'fl-stack-choice': {
    task: 'Use AI as an options generator, not a decision-maker, to compare three genuine build paths for your portfolio, then commit to one in writing with reasons that include maintainability and whether it shows your work properly.',
    lesson:
      'Three genuine options with trade-offs considered, not one answer obeyed. The habit of extracting options before deciding is what the assignment is actually teaching.',
    takeaway:
      'The rationale must include "can I maintain this." Future-you has to update this site. That constraint rules out a lot of tempting options.',
  },
  'fl-explain-build': {
    task: 'Close one genuine gap in your understanding of your own build by using AI as a tutor, then prove you closed it by writing the explanation without jargon.',
    lesson:
      'Using AI to tutor you into genuine understanding, then explaining it yourself, is a different skill from using AI to explain something you do not care about understanding. The writing proves whether the learning happened.',
    takeaway:
      'Read every line out loud before submitting. If you would not say it to a friend, cut it.',
  },
  'pf-04-personal-website': {
    task: 'Plan and deploy a simple personal site on a free host with HTTPS, rename it to a clean URL, and write a plain-language DNS walkthrough explaining what actually happens between a browser request and the host responding.',
    lesson:
      'Building and deploying the site teaches you hosting, HTTPS, and basic web infrastructure regardless of what stack you choose. The DNS walkthrough forces you to understand the infrastructure rather than just following instructions.',
    takeaway:
      'You must be able to explain every file in the deployed site. That requirement is in the pass criteria. It is the practical test of whether you built it or just clicked through a template.',
  },
  'fl-dynamic-feature': {
    task: 'Choose one dynamic feature your portfolio actually needs, build it to work on a free tier with AI as a build partner, and explain the data flow in your own words.',
    lesson:
      'The assignment calls this the most directly employable skill in the whole track. Wiring one real feature and understanding it is the line between a portfolio that tells and one that does.',
    takeaway:
      'One feature, not several. The pass criteria repeat this. Pick the one thing your portfolio most needs and make it work properly.',
  },
  'fl-mobile-audit': {
    task: 'Conduct a real device audit of your portfolio across mobile, tablet, and desktop, fix the obvious breaks, and document what you found and changed.',
    lesson:
      'Testing on a resized browser is not the same as testing on a real phone. Issues that are invisible in a browser window show up on a real device, and some of them matter.',
    takeaway:
      'Click every link including demo and repo. The fix log requires real problems found and fixed. If your log is empty, you did not look hard enough.',
  },
  'fl-crit-review': {
    task: 'Get external feedback on whether your portfolio communicates what you do in ten seconds and whether the work backs it up, then act on the must-fixes before proceeding.',
    lesson:
      'The two questions to ask first, "what do I do?" and "would you believe I\'m good at it?", are structured so you get the most useful signal before the reviewer has a chance to be polite.',
    takeaway:
      'Engaging with feedback rather than defending is itself a graded criterion. If the must-fixes are acknowledged but not fixed on the live site, you have not passed.',
  },
  'fl-site-hardening': {
    task: 'Conduct real edge-case testing on your own site, add findability and speed basics, and submit a triage document that distinguishes between what you fixed and what you are acknowledging as a known limitation.',
    lesson:
      'The SEO and meta step is often treated as optional decoration. It is in this assignment because a portfolio that cannot be found or shared properly is missing a functional requirement.',
    takeaway:
      'This checkpoint must pass to proceed to launch. Do not treat it as a formality.',
  },
  'fl-domain-badge': {
    task: 'Complete the final public launch: custom domain, analytics, HTTPS confirmed, share preview working, and the badge installed.',
    lesson:
      'Launch hygiene, the social share preview, favicon, and page titles on the real address, is the last check before the site is genuinely public rather than just reachable.',
    takeaway:
      'Open the final address on your phone one more time after pointing the custom domain. DNS propagation can take time, and what worked on the old URL may not have transferred cleanly.',
  },
  'fl-maintenance-plan': {
    task: 'Make a concrete maintenance plan for your portfolio, naming the next project and when you will add it, before the context from building it is gone.',
    lesson:
      'Setting a calendar nudge now, while you still remember how everything works, is the practical difference between a site that grows and one that stagnates.',
    takeaway:
      'The three-beat shape from Week 2, problem, what you did, what came of it, is reusable for every future case. You do not need to reinvent the format.',
  },
  'fl-10-final-package': {
    task: 'Assemble every deliverable from the whole track in one indexed place, write a 500-to-800 word retrospective aimed at the person you were in Week 1, complete your hours log, publish your site, and submit for final sign-off.',
    lesson:
      'The retrospective is where you account for what specifically changed in how you work, not what you learned in general. That specificity is what makes it useful.',
    takeaway:
      'The retrospective must be specific to your build. Generic reflection does not pass. The brief says so directly.',
  },
};

/* ========================================================================== */
const BANNED_VOICE_WORDS = ['passionate', 'leveraged', 'empowered', 'results-driven', 'AI-powered'];
const BLOCKED_SENTENCES = ['most projects fall apart', 'obstacle is not design or content'];
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

const assignmentById = new Map(assignments.map((a) => [a.id, a]));
const conceptById = new Map(concepts.map((c) => [c.id, c]));
const artifactById = new Map(artifacts.map((a) => [a.id, a]));

/* ---- 1. Assignment count + unique IDs + registry match ---- */
if (assignments.length !== 35) fail(`Expected exactly 35 assignments, got ${assignments.length}`);
if (new Set(assignments.map((a) => a.id)).size !== assignments.length) fail('Duplicate assignment IDs found');

const actualIds = assignments.map((a) => a.id).sort();
const expectedIds = [...EXPECTED_ASSIGNMENT_IDS].sort();
if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
  const missing = expectedIds.filter((id) => !actualIds.includes(id));
  const extra = actualIds.filter((id) => !expectedIds.includes(id));
  fail(`Assignment IDs do not match the registry. Missing: [${missing}] Extra: [${extra}]`);
}

/* ---- 2. officialCode mapping (no invented codes) ---- */
for (const a of assignments) {
  const expected = EXPECTED_OFFICIAL_CODES[a.id];
  if (a.officialCode !== expected) {
    fail(
      `Assignment ${a.id}: officialCode ${JSON.stringify(a.officialCode)} does not match registry ${JSON.stringify(expected)}`
    );
  }
}

/* ---- 3. Copy integrity (exact match against approved strings) ---- */
for (const a of assignments) {
  const approved = APPROVED_COPY[a.id];
  if (!approved) {
    fail(`Assignment ${a.id}: missing from APPROVED_COPY audit set`);
    continue;
  }
  for (const key of ['task', 'lesson', 'takeaway']) {
    if (a[key] !== approved[key]) {
      fail(
        `Assignment ${a.id} "${key}" copy drift detected.\n` +
          `  got:      ${JSON.stringify(a[key])}\n` +
          `  expected: ${JSON.stringify(approved[key])}`
      );
    }
  }
}

/* ---- 4. Concept count + locked mapping (bidirectional) ---- */
if (concepts.length !== 10) fail(`Expected exactly 10 concepts, got ${concepts.length}`);
if (new Set(concepts.map((c) => c.id)).size !== concepts.length) fail('Duplicate concept IDs found');

let mappingInstances = 0;
for (const c of concepts) {
  const locked = LOCKED_CONCEPT_MAPPINGS[c.id];
  if (!locked) {
    fail(`Concept ${c.id}: not present in the locked registry`);
    continue;
  }
  mappingInstances += c.assignments.length;
  const a = [...c.assignments].sort();
  const b = [...locked].sort();
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    fail(`Concept ${c.id}: assignments do not match the locked registry`);
  }
}

// Reverse direction: every assignment's `concepts` must match the locked set.
for (const a of assignments) {
  const lockedReverse = concepts
    .filter((c) => LOCKED_CONCEPT_MAPPINGS[c.id].includes(a.id))
    .map((c) => c.id)
    .sort();
  const actual = [...a.concepts].sort();
  if (JSON.stringify(actual) !== JSON.stringify(lockedReverse)) {
    fail(`Assignment ${a.id}: concepts do not match the locked registry`);
  }
}

/* ---- 5. Artifacts count + unique IDs ---- */
if (artifacts.length !== 11) fail(`Expected exactly 11 shared artifacts, got ${artifacts.length}`);
if (new Set(artifacts.map((a) => a.id)).size !== artifacts.length) fail('Duplicate artifact IDs found');

/* ---- 6. Referential integrity (edges, artifact links, concepts) ---- */
for (const e of publicEdges) {
  if (!assignmentById.has(e.source)) fail(`Edge source ${e.source} does not resolve to an assignment`);
  if (!assignmentById.has(e.target)) fail(`Edge target ${e.target} does not resolve to an assignment`);
}
for (const r of rejectedEdges) {
  if (!assignmentById.has(r.source)) fail(`Rejected edge source ${r.source} does not resolve`);
  if (!assignmentById.has(r.target)) fail(`Rejected edge target ${r.target} does not resolve`);
  for (const cid of r.mediatingConcepts) {
    if (!conceptById.has(cid)) fail(`Rejected edge mediating concept ${cid} does not resolve`);
  }
}
for (const link of artifactLinks) {
  if (!assignmentById.has(link.assignmentId)) fail(`ArtifactLink assignment ${link.assignmentId} does not resolve`);
  if (!artifactById.has(link.artifactId)) fail(`ArtifactLink artifact ${link.artifactId} does not resolve`);
}
for (const a of assignments) {
  for (const cid of a.concepts) {
    if (!conceptById.has(cid)) fail(`Assignment ${a.id} references unknown concept ${cid}`);
  }
  for (const aid of a.artifactLinks) {
    if (!artifactById.has(aid)) fail(`Assignment ${a.id} references unknown artifact ${aid}`);
  }
}

// Assignment.artifactLinks must be consistent with the ArtifactLink records.
for (const a of assignments) {
  const derived = artifactLinks.filter((l) => l.assignmentId === a.id).map((l) => l.artifactId).sort();
  const actual = [...a.artifactLinks].sort();
  if (JSON.stringify(actual) !== JSON.stringify(derived)) {
    fail(`Assignment ${a.id}: artifactLinks array is inconsistent with the ArtifactLink records`);
  }
}

/* ---- 7. Edge approval rules ---- */
if (publicEdges.some((e) => e.approved !== true)) {
  fail('publicEdges contains an edge with approved !== true');
}

const publicPairs = new Set(
  publicEdges.map((e) => [`${e.source}::${e.target}`, `${e.target}::${e.source}`]).flat()
);
for (const r of rejectedEdges) {
  const fwd = `${r.source}::${r.target}`;
  const rev = `${r.target}::${r.source}`;
  if (publicPairs.has(fwd) || publicPairs.has(rev)) {
    fail(`Rejected edge (${r.source} <-> ${r.target}) appears in the public edges`);
  }
}

/* ---- 8. Banned-pattern scan on all copy ---- */
const copyFields = [];
for (const a of assignments) {
  copyFields.push(...[a.title, a.task, a.lesson, a.takeaway, a.phase, ...(a.sourceAliases ?? [])].filter(Boolean));
}
for (const c of concepts) copyFields.push(c.name, c.description);
for (const art of artifacts) copyFields.push(art.title, art.description);
for (const e of publicEdges) copyFields.push(e.reason);
for (const r of rejectedEdges) copyFields.push(r.decision);
for (const s of frameworkSteps) copyFields.push(s.label, s.description);
for (const s of wishIKnew) copyFields.push(s.text);
copyFields.push(finalReflection.intro);
for (const s of finalReflection.sections) {
  copyFields.push(s.heading);
  copyFields.push(...s.body);
}
copyFields.push(...finalReflection.learnings, finalReflection.convergenceNote);

for (const text of copyFields) {
  if (text.includes(EM_DASH)) fail(`Em dash (—) found in copy: ${JSON.stringify(text)}`);
  if (text.includes(EN_DASH)) fail(`En dash (–) found in copy: ${JSON.stringify(text)}`);
  for (const word of BANNED_VOICE_WORDS) {
    if (text.toLowerCase().includes(word.toLowerCase())) {
      fail(`Banned voice word "${word}" found in copy: ${JSON.stringify(text)}`);
    }
  }
  for (const sentence of BLOCKED_SENTENCES) {
    if (text.toLowerCase().includes(sentence.toLowerCase())) {
      fail(`Blocked sentence fragment "${sentence}" found in copy: ${JSON.stringify(text)}`);
    }
  }
}

/* ---- 9. Evidence status rule ---- */
for (const a of assignments) {
  const linkedArtifacts = a.artifactLinks.map((id) => artifactById.get(id));
  const anyUrl = linkedArtifacts.some((art) => art && art.url);
  if (anyUrl && a.evidenceStatus !== 'available') {
    fail(`Assignment ${a.id} has a linked artifact URL but evidenceStatus is not "available"`);
  }
  if (!anyUrl && a.evidenceStatus !== 'partial') {
    fail(`Assignment ${a.id} has no artifact URL but evidenceStatus is not "partial"`);
  }
}

/* ---- 10. workloadHours omitted where registry is blank ---- */
for (const id of ['fl-explain-build', 'fl-crit-review', 'fl-10-final-package']) {
  const a = assignmentById.get(id);
  if (a && a.workloadHours !== undefined) {
    fail(`Assignment ${id}: workloadHours should be omitted (registry is blank) but is ${a.workloadHours}`);
  }
}

/* ---- 11. Framework steps: referential integrity (Phase 3, Task 3.2.1) ---- */
if (frameworkSteps.length === 0) fail('frameworkSteps is empty (Phase 3 expects to render an earned synthesis)');
for (const step of frameworkSteps) {
  if (!step.id || !step.label || !step.description) fail(`Framework step is missing a required field`);
  if (step.assignmentIds.length === 0) fail(`Framework step ${step.id}: must reference at least one assignment`);
  for (const id of step.assignmentIds) {
    if (!assignmentById.has(id)) fail(`Framework step ${step.id} references unknown assignment ${id}`);
  }
}
const frameworkStepIds = new Set(frameworkSteps.map((s) => s.id));
if (frameworkStepIds.size !== frameworkSteps.length) fail('Duplicate framework step ids found');

/* ---- 12. "What I Wish I Knew": traceable statements (Phase 3, Task 3.2.2) ---- */
if (wishIKnew.length === 0) fail('wishIKnew is empty (Phase 3 expects traceable statements)');
for (const s of wishIKnew) {
  if (!s.id || !s.text) fail('wishIKnew statement is missing a required field');
  if (s.assignmentIds.length === 0) fail(`wishIKnew statement ${s.id}: must trace to at least one assignment`);
  for (const id of s.assignmentIds) {
    if (!assignmentById.has(id)) fail(`wishIKnew statement ${s.id} references unknown assignment ${id}`);
  }
}
const wikIds = new Set(wishIKnew.map((s) => s.id));
if (wikIds.size !== wishIKnew.length) fail('Duplicate wishIKnew statement ids found');

/* ---- 13. Final Reflection: 500–800 word retrospective (Phase 3, Task 3.2.3) ---- */
const retrospectiveText = [
  finalReflection.intro,
  ...finalReflection.sections.flatMap((s) => s.body),
  ...finalReflection.learnings,
].join(' ');
const retrospectiveWords = retrospectiveText.split(/\s+/).filter(Boolean).length;
if (retrospectiveWords < 500 || retrospectiveWords > 800) {
  fail(
    `Final retrospective is ${retrospectiveWords} words; must be between 500 and 800 (PRODUCT_SPEC §32)`
  );
}
const requiredHeadings = ['What I set out to do', 'What changed', 'What I would build next'];
const sectionHeadings = finalReflection.sections.map((s) => s.heading);
for (const h of requiredHeadings) {
  if (!sectionHeadings.includes(h)) fail(`Final retrospective is missing the required section heading "${h}"`);
}
if (finalReflection.learnings.length !== 3) {
  fail(`Final retrospective must list three transferable learnings, got ${finalReflection.learnings.length}`);
}

/* ========================================================================== */
/* ---- Census (for the record; never written into UI copy) ---- */
const byTrack = {};
const byTier = {};
for (const a of assignments) {
  byTrack[a.track] = (byTrack[a.track] ?? 0) + 1;
  byTier[a.tier] = (byTier[a.tier] ?? 0) + 1;
}

console.log('\n=== FLYRANK LEARNING ARCHIVE — DATA CENSUS ===');
console.log(`Assignments:      ${assignments.length}`);
console.log(`  machine-learning: ${byTrack['machine-learning'] ?? 0}`);
console.log(`  ai-fluency:       ${byTrack['ai-fluency'] ?? 0}`);
console.log(`  core: ${byTier.core ?? 0} / supporting: ${byTier.supporting ?? 0} / reference: ${byTier.reference ?? 0}`);
console.log(`Concepts:         ${concepts.length}`);
console.log(`Concept mappings: ${mappingInstances}`);
console.log(`Shared artifacts: ${artifacts.length}`);
console.log(`Artifact links:   ${artifactLinks.length}`);
console.log(`Public edges:     ${publicEdges.length}`);
console.log(`Rejected edges:   ${rejectedEdges.length}`);
console.log('\nConcepts by assignment count:');
for (const c of [...concepts].sort((x, y) => y.assignments.length - x.assignments.length)) {
  console.log(`  ${c.name.padEnd(18)} ${c.assignments.length}`);
}

/* ========================================================================== */
if (errors.length > 0) {
  console.error('\n=== VALIDATION FAILED ===');
  for (const e of errors) console.error(`\n✗ ${e}`);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log('\n=== VALIDATION PASSED ===\n');
