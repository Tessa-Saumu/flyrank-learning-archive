# Content Reconciliation Pass

Below is the implementation-ready content reconciliation pass based on:

- the original assignment cards you provided,
- the revised Product Spec,
- the Systems Atlas Design Spec,
- the current V1 copy.

I have treated the uploaded revised specs as the authority where they differ from the pasted V1 copy.

---

# 1. CANONICAL ASSIGNMENT REGISTRY

## 1.1 Canonical assignments

Use these IDs for routes, graph nodes, artifact links, search, filters, and analytics.

| Canonical ID | Official code | Canonical title | Track | Strand | Week | Workload | Phase | Tier | Source aliases / labels | Canonical status |
|---|---:|---|---|---|---:|---:|---|---|---|---|
| `ml-01-run-starter-notebooks` | ML-01 | Run the Starter Notebooks | Machine Learning | ML spine | 1 | 3h | Setup | Supporting | ML01, Run the Starter Notebooks | Reviewed |
| `ml-02-research-question-lane` | ML-02 | Research Question and Provisional Lane | Machine Learning | ML spine | 1 | 3h | Setup | Core | ML02 | Reviewed |
| `ml-03-ml-task-framing` | ML-03 | Frame Your Lane as an ML Task | Machine Learning | ML spine | 2 | 4h | Foundations | Core | ML03 | Reviewed |
| `ml-04-data-contract` | ML-04 | Search Intelligence Data Contract | Machine Learning | ML spine | 3 | 3h | Foundations | Core | ML04 | Reviewed |
| `ml-07-baseline-action-score` | ML-07 | Baseline Action Score and Top-10 Review | Machine Learning | ML spine | 4 | 3h | Build | Core | ML07 | Reviewed |
| `ml-08-capstone-modeling` | ML-08 | Capstone Modeling Lane | Machine Learning | ML spine | 5 | 6h | Build | Core | ML08 | Reviewed |
| `ml-09-validation-claim-audit` | ML-09 | Validation and Research Claim Audit | Machine Learning | ML spine | 6 | 5h | Build+ | Core | ML09 | Reviewed |
| `ml-10-content-action-playbook` | ML-10 | Content Action Playbook | Machine Learning | ML spine | 7 | 4h | Build+ | Core | ML10 | Reviewed |
| `ml-11-ship-paper` | ML-11 | Ship the Paper | Machine Learning | ML spine | 8 | 6h | Submit | Core | ML11 | Reviewed |
| `ml-12-tell-story` | ML-12 | Tell the Story | Machine Learning | ML spine | 8 | 2h | Submit | Core | ML12 | Reviewed |
| `fl-01-workflow-audit` | FL-01 | AI Workflow Audit and Tool Setup | AI Fluency | AI Systems / Agents | 1 | 4h | Setup / Onboarding | Supporting | FL01 | Reviewed |
| `fl-portfolio-proof` |  | What Are You Proving? | AI Fluency | Portfolio / Public Work | 1 | 2h | Setup | Core | FL Proving, What Are You Proving? | Reviewed |
| `fl-portfolio-sitemap` |  | Draw the Path: Portfolio Sitemap + Toolkit | AI Fluency | Portfolio / Public Work | 1 | 3h | Setup | Supporting | FL Sitemap, Draw the Path | Reviewed |
| `fl-portfolio-cases` |  | Frame It as Cases: Work That Speaks for Itself | AI Fluency | Portfolio / Public Work | 2 | 3h | Foundations | Core | FL Frame, Frame It as Cases | Reviewed |
| `fl-prompt-ladder` |  | The Prompt Ladder | AI Fluency | AI Systems / Agents | 2 | 2h | Foundations | Supporting | FL Prompt Ladder | Reviewed |
| `fl-02-prompting-fundamentals` | FL-02 | Prompting Fundamentals on Real Tasks v2 | AI Fluency | AI Systems / Agents | 2 | 6h | Foundations | Supporting | FL-02, FL-02 Prompting | Reviewed |
| `fl-identity-kit` |  | Decide Once: Build Your Identity Kit | AI Fluency | Portfolio / Public Work | 3 | 2h | Foundations | Supporting | FL Identity, Identity Kit | Reviewed |
| `fl-curate-images` |  | Kill Your Darlings: Curate Your Images | AI Fluency | Portfolio / Public Work | 3 | 2h | Foundations | Reference | FL Curate, Kill Your Darlings | Reviewed |
| `fl-content-ctas` |  | The Through-Line: Map Content and CTAs | AI Fluency | Portfolio / Public Work | 3 | 2h | Foundations | Supporting | FL Map Content, Through-Line | Reviewed |
| `fl-empty-live-page` |  | Empty but Live: Ship a Blank Page | AI Fluency | Portfolio / Public Work | 4 | 2h | Build | Supporting | FL Ship, Empty but Live | Reviewed |
| `fl-stack-choice` |  | Three Roads: Choose Your Stack with AI | AI Fluency | Portfolio / Public Work | 4 | 2h | Build | Supporting | FL Stack, Three Roads | Reviewed |
| `fl-04-automation-workflow` | FL-04 | Ship an Automation Workflow v2 | AI Fluency | AI Systems / Agents | 4 | 7h | Build core | Core | FL04, Automation Workflow | Reviewed |
| `fl-05-agent-mcp-basics` | FL-05 | Agent Concepts and MCP Basics | AI Fluency | AI Systems / Agents | 4 | 5h | Build core | Core | FL05, Agent Concepts | Reviewed |
| `fl-explain-build` |  | Explain It Like You Built It | AI Fluency | Portfolio / Public Work | 5 |  | Build+ | Supporting | FL Explain | Reviewed |
| `fl-06-agent-design` | FL-06 | Design Your Personal Agent | AI Fluency | AI Systems / Agents | 5 | 4h | Build | Core | FL06 | Reviewed |
| `fl-07-build-agent` | FL-07 | Build the Agent | AI Fluency | AI Systems / Agents | 5 | 10h | Build | Core | FL07 | Reviewed |
| `pf-04-personal-website` | PF-04 | Personal Website Live on the FlyRank Domain | AI Fluency | Portfolio / Public Work | 5 | 6h | Build | Core | PF04, Personal Website Live | Reviewed |
| `fl-dynamic-feature` |  | Make It Do Something | AI Fluency | Portfolio / Public Work | 6 | 4h | Submit | Supporting | FL Do Something | Reviewed |
| `fl-mobile-audit` |  | Open It on Your Phone | AI Fluency | Portfolio / Public Work | 6 | 4h | Build+ | Supporting | FL Phone | Reviewed |
| `fl-crit-review` |  | Survive the Crit | AI Fluency | Portfolio / Public Work | 6 |  | Build+ | Supporting | FL Crit | Reviewed |
| `fl-site-hardening` |  | Break Your Own Site | AI Fluency | Portfolio / Public Work | 7 | 2h | Submit | Supporting | FL Break | Reviewed |
| `fl-domain-badge` |  | Plant Your Flag: Domain + Badge | AI Fluency | Portfolio / Public Work | 7 | 20h | Build+ | Reference | FL Flag, Plant Your Flag | Reviewed |
| `fl-maintenance-plan` |  | The Plan to Keep Building | AI Fluency | Portfolio / Public Work | 8 | 1h | Submit | Supporting | FL Plan | Reviewed |
| `fl-09-documentation-demo` | FL-09 | Documentation and Demo Video | AI Fluency | AI Systems / Agents | 8 | 5h | Submit | Core | FL09, Show It / Tell the Story, Assignment 8.1, Documentation and demo | Reviewed |
| `fl-10-final-package` | FL-10 | Final Package, Retrospective, and Capstone | AI Fluency | Convergence | 8 |  | Submit | Core | FL10, Assignment 8.2, final checkpoint | Reviewed |

## 1.2 Source records that should not become assignment nodes

| Source record | What it is | Resolution |
|---|---|---|
| Consistency, Not Talent and Frame, Not Upstage | Week 3 session / lesson page, not a deliverable-bearing assignment card | Do not create assignment node. Use as source context only if needed. |
| Show It / Tell the Story | Week 8 page containing FL-09 and FL-10 assignment records | Do not create separate node. Use as alias/source page for `fl-09-documentation-demo` and `fl-10-final-package`. |
| Assignment 8.1 | Alternate label for FL-09 Documentation and Demo Video | Alias of `fl-09-documentation-demo`. |
| Assignment 8.2 | Alternate label for FL-10 Final Package, Retrospective, and Capstone | Alias of `fl-10-final-package`. |

---

# 2. FINAL COPY AUDIT

This is an evidence check, not a rewrite pass.

Verdicts:

- **Approved:** Supported by the original card.
- **Approved with note:** Supported, but implementation should use the revised spec version or avoid a small source-risk.
- **Needs source-safe edit:** Current copy goes slightly beyond the card.

## 2.1 Copy audit table

| Assignment | Verdict | Evidence check | Implementation action |
|---|---|---|---|
| ML-01 | Approved | Source asks student to clone repo, run starter notebooks, observe rule beaten by model, read repo guides. | Use current copy. |
| ML-02 | Approved | Source explicitly asks for lane, question, decision, action, wrong-cost, and real starter data numbers. | Use current copy. |
| ML-03 | Approved with note | Source supports task framing, task type, target/proxy, success metric, unit of analysis, AI as helper. | Use revised spec wording, not the older “most projects fall apart” version. |
| ML-04 | Approved | Source explicitly includes data contract, three queries, five features, “available when” check, deliberate leakage trap, sample table warning. | Use current copy. |
| ML-07 | Approved | Source explicitly includes signal checks, one rule, score, reason code, action label, CSV, top-10 review, negative verdicts. | Use current copy. |
| ML-08 | Approved | Source explicitly says modeling comes after framing, data contract, signal audit, baseline, and must compare to baseline. | Use current copy. |
| ML-09 | Approved | Source explicitly says audit paper findings, rerun model with honest split, leakage audit, error examples, claim rewrite. | Use current copy. |
| ML-10 | Approved | Source explicitly says validated output becomes action playbook and paper recommendations section. | Use current copy. |
| ML-11 | Approved | Source explicitly requires research page best-practice review, deployed paper, baseline, validation, recommendations, honest claims, reproducibility. | Use current copy. |
| ML-12 | Approved | Source explicitly says paper is live, case-study framing lives inside paper, demo outline and shareable cuts required. | Use current copy. |
| FL-01 | Approved | Source explicitly asks for real task audit, classifications, Claude Project, three target tasks, success definitions. | Use current copy. |
| FL Sitemap | Approved | Source asks for minimal sitemap, Claude Project, pressure-test prompt, and at least one thing to change. | Use canonical ID `fl-portfolio-sitemap`. |
| FL Proving | Approved | Source asks for claim, audience, action, AI as interviewer, and why it needs to exist beyond CV/LinkedIn. | Use canonical ID `fl-portfolio-proof`. |
| FL Frame | Approved | Source asks for voice card, AI interview, three-beat cases, bio/contact copy, hard edit, before/after. | Use canonical ID `fl-portfolio-cases`. |
| FL Prompt Ladder | Approved | Source explicitly requires weak baseline, five versions, one layer at a time, output comparison, final reusable prompt. | Use canonical ID `fl-prompt-ladder`. |
| FL-02 Prompting | Approved | Source asks for Anthropic tutorial, FL-01 task, five named techniques, Claude/ChatGPT comparison, reusable template. | Use current copy. |
| FL Identity | Approved with note | Source supports fonts, palette, logo/favicon, two-line style note, Claude Project. | Remove duplicated Task/Lesson/Takeaway from pasted V1 if still present anywhere. |
| FL Curate | Approved | Source explicitly says judgment matters more than generation, real captures for work, rejection note graded. | Use current copy. |
| FL Map Content | Approved | Source asks for one-line claim, content map, page sections, cases, CTAs, gather-list. | Use current copy. |
| FL Ship | Approved with note | Source supports live near-blank URL and phone test. Revised spec version is safer than older “obstacle is not design or content” wording. | Use revised spec wording. |
| FL Stack | Approved | Source asks for three stack options, trade-offs, front-runner pressure test, maintainability rationale. | Use current copy. |
| FL-04 | Approved with note | Source supports end-to-end workflow on new input, five real runs, time comparison, failure points. “Without your intervention” is a little stronger than the card. | Recommended source-safe edit: “runs end to end on a brand new input.” |
| FL-05 | Approved | Source explicitly asks workflow vs agent distinction, MCP primitives, connector setup, three tool tasks, agent upgrade. | Use current copy. |
| FL Explain | Approved | Source asks for one real part of build, AI tutoring, plain-words explanation in own words. | Use current copy. |
| FL-06 | Approved | Source asks for one job, platform choice, tools/data access, eval cases, risks/guardrails. | Use current copy. |
| FL-07 | Approved | Source asks to build from FL-06 spec, connect tool/data, build log, deviations, raw end-to-end capture. | Use current copy. |
| PF-04 | Approved | Source asks for live HTTPS site, clean URL, DNS walkthrough, links, ability to explain deployed files. | Use current copy. |
| FL Do Something | Approved | Source explicitly says one dynamic feature, free tier, works end to end, backend/data-flow explainer. | Use current copy. |
| FL Phone | Approved | Source asks real phone test, tablet/desktop checks, readability, links, image compression, fix log. | Use current copy. |
| FL Crit | Approved | Source asks reviewer feedback, two questions, must-fix/nice-to-have sort, fix must-fixes, no defending. | Use current copy. |
| FL Break | Approved | Source asks edge-case testing, SEO/meta, speed check, triage, hardening review. | Use current copy. |
| FL Flag | Approved | Source asks custom domain/fallback, analytics, HTTPS, share preview, favicon, titles, badge. | Use current copy. |
| FL09 | Approved | Source asks README, demo video, setup reproducibility, evals, limitations, one AI-transparency line. | Use current copy. |
| FL Plan | Approved | Source asks how to add next case, named next work, reminder, preserve Claude Project. | Use current copy. |
| FL10 | Approved | Source asks complete index, retrospective, hours log, site/post, final review/sign-off. | Use current copy. |

## 2.2 Copy audit changes to apply

Only three implementation notes matter:

1. **Use revised ML-03 wording from the uploaded spec.**  
   Do not use the older “most projects fall apart” sentence.

2. **Use revised FL Ship wording from the uploaded spec.**  
   Do not use the stronger older claim about design/content not being the obstacle.

3. **For FL-04, consider a source-safe edit.**  
   Current:

   > Build an end-to-end automated pipeline that runs on a brand new input without your intervention...

   Safer:

   > Build an end-to-end automated pipeline that runs on a brand new input...

   The card supports “runs end to end,” but not necessarily full autonomy without any human step.

---

# 3. ARTIFACT REGISTRY

No actual artifact URLs were provided in this prompt, so **do not mark these as `available` yet**.

Recommended implementation rule:

- Use `evidenceStatus: "partial"` until a real URL/file is attached.
- Change to `available` once the artifact is linked, embedded, or previewed.
- Use `private` if the work exists but cannot be public.
- Use `missing` only if no proof exists.

## 3.1 Artifact display modes

| Mode | Use when |
|---|---|
| Embed | Stable public artifact, useful in-page experience, not too heavy. |
| Preview | Artifact exists but embed is unreliable, too large, private-ish, or better represented by a screenshot/card. |
| Link | Administrative/source/supporting evidence where embedding wastes space. |

## 3.2 Assignment-level artifact decisions

| Assignment ID | Primary proof artifact | Artifact type | Role | Display mode | Supporting artifacts | Evidence status until URL added |
|---|---|---|---|---|---|---|
| `ml-01-run-starter-notebooks` | Executed starter notebooks in public ML repo | GitHub / notebook | Produces | Preview + link | Public repo URL, notebook outputs | Partial |
| `ml-02-research-question-lane` | `w01_research_question.ipynb` | Notebook | Produces | Preview + link | Supporting starter data numbers | Partial |
| `ml-03-ml-task-framing` | `w02_ml_task_framing.ipynb` | Notebook | Produces | Preview + link | Unit-of-analysis dataframe screenshot/table | Partial |
| `ml-04-data-contract` | `w03_data_contract.ipynb` | Notebook | Produces | Preview + link | Query outputs, feature frame, leakage experiment | Partial |
| `ml-07-baseline-action-score` | `w04_baseline_score.ipynb` | Notebook | Produces | Preview + link | `baseline_action_score.csv`, metrics JSON, top-10 review | Partial |
| `ml-08-capstone-modeling` | `w05_model.ipynb` | Notebook | Produces | Preview + link | Model-vs-baseline table, metrics, error notes | Partial |
| `ml-09-validation-claim-audit` | `w06_validation_audit.ipynb` | Notebook | Produces | Preview + link | Before/after split comparison, leakage audit, claim rewrite | Partial |
| `ml-10-content-action-playbook` | `w07_action_playbook.ipynb` | Notebook | Produces | Preview + link | Ranked queue export, figures, metrics JSONs | Partial |
| `ml-11-ship-paper` | Deployed ML research paper | Live / document | Produces | Embed preferred, preview fallback | Repo, `submission/paper_url.txt`, capstone notebook | Partial |
| `ml-12-tell-story` | Demo outline and shareable cuts in final notebook/work folder | Document / markdown | Produces | Preview + link | Live paper abstract/introduction updates | Partial |
| `fl-01-workflow-audit` | Workflow audit document | Document | Produces | Preview + link | Claude Project screenshot, target task definitions | Partial |
| `fl-portfolio-proof` | Proof statement document | Document | Produces | Preview + link | AI interview notes, one-line why | Partial |
| `fl-portfolio-sitemap` | Sitemap sketch and Claude pressure-test output | Image / document | Produces | Preview + link | Claude Project screenshot | Partial |
| `fl-portfolio-cases` | Framed case study document | Document | Produces | Preview + link | Voice card, generic line before/after edit | Partial |
| `fl-prompt-ladder` | Prompt ladder document | Document | Produces | Preview + link | Six prompt outputs, final reusable prompt | Partial |
| `fl-02-prompting-fundamentals` | Prompt iteration log | Document | Produces | Preview + link | Claude/ChatGPT comparison, final template | Partial |
| `fl-identity-kit` | Identity kit page | Document / image | Produces | Preview + link | Fonts, palette, logo/favicon, style note | Partial |
| `fl-curate-images` | Final curated image set | Image / document | Produces | Preview + link | Rejection note, real capture decisions | Partial |
| `fl-content-ctas` | Content map and CTA map | Document | Produces | Preview + link | One-line claim, gather-list | Partial |
| `fl-empty-live-page` | Empty or near-blank live URL | Live | Produces | Preview + link | Screenshot, Claude Project context loaded | Partial |
| `fl-stack-choice` | Stack decision rationale | Document | Produces | Preview + link | Three options, trade-off notes | Partial |
| `fl-04-automation-workflow` | Working automation workflow walkthrough | Document / other | Produces | Preview + link | Step diagram, prompts/config, five runs, time estimate | Partial |
| `fl-05-agent-mcp-basics` | Agent/MCP explainer and connector evidence | Document / image | Produces | Preview + link | Three tool-call screenshots | Partial |
| `fl-explain-build` | Plain-words build explanation | Document | Produces | Preview + link | Optional screenshot of the explained build piece | Partial |
| `fl-06-agent-design` | Agent design doc | Document | Produces | Preview + link | Eval cases, guardrails, platform rationale | Partial |
| `fl-07-build-agent` | Working personal agent MVP | Live / other | Produces | Preview + link, embed only if runnable/demoable | Build log, raw run capture | Partial |
| `pf-04-personal-website` | Live personal website | Live | Produces | Embed preferred, preview fallback | DNS walkthrough, LinkedIn/CV links | Partial |
| `fl-dynamic-feature` | Working dynamic portfolio feature | Live | Produces | Embed preferred if stable, preview fallback | Test submission evidence, backend/data-flow explainer | Partial |
| `fl-mobile-audit` | Mobile fix log | Document / image | Produces | Preview + link | Before/after phone screenshots | Partial |
| `fl-crit-review` | Crit feedback and fix record | Document | Produces | Preview + link | Must-fix/nice-to-have sort, live site fix evidence | Partial |
| `fl-site-hardening` | Site hardening list | Document | Produces | Preview + link | SEO/meta proof, speed check, review evidence | Partial |
| `fl-domain-badge` | Final launched site with domain, analytics, badge | Live | Produces | Embed preferred, preview fallback | Analytics screenshot, badge/footer screenshot | Partial |
| `fl-maintenance-plan` | Next-case maintenance note | Document | Produces | Preview + link | Reminder screenshot, named next piece | Partial |
| `fl-09-documentation-demo` | Agent README and demo video | GitHub / video | Documents | Embed video preferred, README preview + link | Architecture sketch, evals, limitations | Partial |
| `fl-10-final-package` | This learning archive / final package | Live / document | Produces | Embed not needed if current site, use direct internal route | Retrospective, hours log reference, build-in-public post, sign-off | Partial |

## 3.3 Shared artifact records to create

These are the major artifact nodes that should exist in `artifacts.ts`.

| Artifact ID | Title | Type | Description | Preferred display |
|---|---|---|---|---|
| `artifact-ml-repo` | Machine Learning GitHub Repository | GitHub | Public repo containing notebooks, outputs, paper URL file, and capstone work. | Preview card + GitHub link |
| `artifact-ml-paper` | ML Research Paper | Live | Deployed research paper built from the ML capstone sequence. | Embed preferred, preview fallback |
| `artifact-portfolio-site` | Personal Portfolio | Live | Public portfolio site built through the AI Fluency portfolio strand. | Embed preferred, preview fallback |
| `artifact-personal-agent` | Personal Agent | Other / live | Working personal AI agent built from the FL-06 spec. | Preview + demo link, embed only if stable |
| `artifact-agent-readme` | Agent README | GitHub / document | Reproducible documentation for the personal agent. | Preview + link |
| `artifact-agent-demo-video` | Agent Demo Video | Video | 3 to 5 minute narrated live run of the agent, including a limitation. | Embed video |
| `artifact-automation-workflow` | Automation Workflow | Document / other | End-to-end no-code research or writing workflow with documented runs. | Preview + link |
| `artifact-learning-archive` | FlyRank Learning Archive | Live | Final indexed package and reflective archive of both tracks. | Internal route / live site |
| `artifact-build-in-public-post` | Build-in-public Post | Document / live | Public post explaining one real decision and one real limitation. | Link |
| `artifact-hours-log` | Hours Log Reference | Document | Completion evidence for tracked programme hours. | Link only, likely private or partial |
| `artifact-final-retrospective` | Final Retrospective | Document | 500 to 800 word reflection required by FL-10. | Internal page |

---

# 4. FINAL GRAPH APPROVAL

## 4.1 Locked concept registry

The 10 concepts are approved.

| Concept ID | Concept name | Description | Approved assignment mappings |
|---|---|---|---|
| `concept-problem-framing` | Problem Framing | Define what you are trying to prove or answer before choosing the tool. | `fl-portfolio-proof`, `fl-portfolio-sitemap`, `fl-content-ctas`, `ml-02-research-question-lane`, `ml-03-ml-task-framing`, `fl-06-agent-design` |
| `concept-data-evidence` | Data & Evidence | Use real evidence and do not ask it to support more than it can. | `ml-01-run-starter-notebooks`, `ml-02-research-question-lane`, `ml-04-data-contract`, `ml-07-baseline-action-score`, `ml-09-validation-claim-audit`, `ml-11-ship-paper` |
| `concept-baseline` | Baseline | Establish a reference point before claiming improvement. | `ml-07-baseline-action-score`, `ml-08-capstone-modeling` |
| `concept-evaluation` | Evaluation | Test the thing rather than trusting the thing. | `fl-prompt-ladder`, `fl-02-prompting-fundamentals`, `ml-08-capstone-modeling`, `ml-09-validation-claim-audit`, `fl-crit-review`, `fl-site-hardening`, `fl-09-documentation-demo`, `fl-06-agent-design` |
| `concept-prompting` | Prompting | Treat AI interaction as a deliberate, testable process. | `fl-01-workflow-audit`, `fl-prompt-ladder`, `fl-02-prompting-fundamentals`, `ml-03-ml-task-framing` |
| `concept-workflow-design` | Workflow Design | Break work into steps, define handoffs, and name where human review belongs. | `fl-01-workflow-audit`, `fl-04-automation-workflow`, `fl-05-agent-mcp-basics`, `ml-10-content-action-playbook` |
| `concept-agents-tools` | Agents & Tools | A real agent has a defined job, tools, constraints, and a way to evaluate it. | `fl-05-agent-mcp-basics`, `fl-06-agent-design`, `fl-07-build-agent`, `fl-09-documentation-demo` |
| `concept-human-judgment` | Human Judgment | The human remains responsible for deciding what to trust, keep, reject, automate, and explain. | `fl-01-workflow-audit`, `fl-02-prompting-fundamentals`, `fl-curate-images`, `fl-05-agent-mcp-basics`, `fl-06-agent-design`, `fl-07-build-agent`, `ml-04-data-contract`, `ml-07-baseline-action-score`, `ml-09-validation-claim-audit`, `fl-crit-review` |
| `concept-deployment` | Deployment | Move work from an internal build into a form someone else can run, access, or inspect. | `fl-empty-live-page`, `pf-04-personal-website`, `fl-dynamic-feature`, `fl-domain-badge`, `ml-11-ship-paper`, `fl-07-build-agent`, `fl-09-documentation-demo` |
| `concept-communication` | Communication | Make the work understandable outside the builder's head. | `fl-portfolio-cases`, `fl-explain-build`, `ml-11-ship-paper`, `ml-12-tell-story`, `fl-09-documentation-demo`, `fl-10-final-package`, `fl-maintenance-plan` |

## 4.2 Approved direct assignment edges

These are direct assignment-to-assignment edges. They should be rare and deliberate.

| Source | Target | Relationship | Confidence | Evidence | Approved | Reason |
|---|---|---|---|---|---:|---|
| `ml-01-run-starter-notebooks` | `ml-02-research-question-lane` | builds-on | High | Explicit | Yes | ML-02 asks students to use real numbers from the starter data already run in ML-01. |
| `ml-02-research-question-lane` | `ml-03-ml-task-framing` | builds-on | High | Explicit | Yes | ML-03 maps the chosen lane from ML-02 onto an ML task. |
| `ml-03-ml-task-framing` | `ml-04-data-contract` | builds-on | High | Explicit | Yes | ML-04 defines the data contract for the lane and target/proxy established earlier. |
| `ml-04-data-contract` | `ml-07-baseline-action-score` | builds-on | High | Explicit | Yes | ML-07 uses real lane signals and safe inputs after the data contract and leakage work. |
| `ml-07-baseline-action-score` | `ml-08-capstone-modeling` | builds-on | High | Explicit | Yes | ML-08 must compare the model against the Week 4 baseline on the same data and metric. |
| `ml-08-capstone-modeling` | `ml-09-validation-claim-audit` | builds-on | High | Explicit | Yes | ML-09 re-runs and audits the Week 5 model. |
| `ml-09-validation-claim-audit` | `ml-10-content-action-playbook` | builds-on | High | Explicit | Yes | ML-10 converts the validated output into a content action playbook. |
| `ml-10-content-action-playbook` | `ml-11-ship-paper` | builds-on | High | Explicit | Yes | ML-10 exports the queue and figures that ML-11 uses in the paper. |
| `ml-11-ship-paper` | `ml-12-tell-story` | builds-on | High | Explicit | Yes | ML-12 starts from the live paper and adapts it for demo and sharing contexts. |
| `fl-portfolio-proof` | `fl-portfolio-sitemap` | builds-on | High | Explicit | Yes | The sitemap is judged against the proof statement and one action. |
| `fl-portfolio-sitemap` | `fl-portfolio-cases` | builds-on | High | Explicit | Yes | The case study work is for every piece the sitemap calls for. |
| `fl-portfolio-cases` | `fl-content-ctas` | builds-on | High | Explicit | Yes | The content map places cases on pages and connects them to CTAs. |
| `fl-content-ctas` | `fl-stack-choice` | builds-on | High | Explicit | Yes | The stack choice assignment asks students to paste the sitemap and content map into the AI prompt. |
| `fl-stack-choice` | `fl-empty-live-page` | builds-on | High | Explicit | Yes | The blank live page must match the chosen stack. |
| `fl-empty-live-page` | `pf-04-personal-website` | builds-on | Medium | Strong inference | Yes | PF-04 builds the real personal site after the earlier blank deployment milestone. |
| `pf-04-personal-website` | `fl-dynamic-feature` | builds-on | Medium | Strong inference | Yes | The dynamic feature is added to the portfolio site. |
| `pf-04-personal-website` | `fl-mobile-audit` | builds-on | High | Explicit | Yes | The mobile audit tests the live portfolio. |
| `fl-mobile-audit` | `fl-crit-review` | builds-on | Medium | Strong inference | Yes | The crit requires a live portfolio ready for external review. |
| `fl-crit-review` | `fl-site-hardening` | builds-on | Medium | Strong inference | Yes | The hardening step extends review into edge cases and launch readiness. |
| `fl-site-hardening` | `fl-domain-badge` | builds-on | High | Explicit | Yes | Break Your Own Site must pass before launch, and Plant Your Flag is the launch step. |
| `fl-domain-badge` | `fl-maintenance-plan` | builds-on | Medium | Strong inference | Yes | The maintenance plan follows the launched portfolio and explains how to keep it current. |
| `fl-01-workflow-audit` | `fl-02-prompting-fundamentals` | builds-on | High | Explicit | Yes | FL-02 requires using a real task from the FL-01 audit. |
| `fl-01-workflow-audit` | `fl-04-automation-workflow` | builds-on | High | Explicit | Yes | FL-04 requires choosing a research or writing pipeline from the audit. |
| `fl-04-automation-workflow` | `fl-05-agent-mcp-basics` | builds-on | High | Explicit | Yes | FL-05 asks students to classify their FL-04 pipeline as a workflow or agent. |
| `fl-05-agent-mcp-basics` | `fl-06-agent-design` | builds-on | Medium | Strong inference | Yes | FL-06 applies the agent/tool/guardrail concepts introduced in FL-05. |
| `fl-06-agent-design` | `fl-07-build-agent` | builds-on | High | Explicit | Yes | FL-07 builds from the FL-06 agent spec. |
| `fl-07-build-agent` | `fl-09-documentation-demo` | builds-on | High | Explicit | Yes | FL-09 documents and demos the working agent. |
| `pf-04-personal-website` | `fl-10-final-package` | builds-on | High | Explicit | Yes | FL-10 packages the live site as part of the final submission. |
| `fl-09-documentation-demo` | `fl-10-final-package` | builds-on | High | Explicit | Yes | FL-10 packages the documented agent deliverables with the rest of the track. |
| `fl-maintenance-plan` | `fl-10-final-package` | connects-to | Medium | Strong inference | Yes | The maintenance plan belongs to the final public-work package, but is not the only input. |

## 4.3 Approved direct cross-track edges

Only these should appear as direct cross-track assignment edges in V1.

| Source | Target | Relationship | Confidence | Evidence | Approved | Reason |
|---|---|---|---|---|---:|---|
| `fl-portfolio-proof` | `ml-02-research-question-lane` | cross-track | High | Editorial | Yes | Both assignments force the student to define the claim or question before choosing tools or building. |
| `fl-portfolio-cases` | `ml-12-tell-story` | cross-track | High | Strong inference | Yes | Both assignments turn real work into audience-specific communication without inventing a generic story. |
| `pf-04-personal-website` | `ml-11-ship-paper` | cross-track | High | Strong inference | Yes | Both require deploying work publicly so someone else can access and inspect it. |
| `fl-09-documentation-demo` | `ml-11-ship-paper` | cross-track | High | Strong inference | Yes | Both require a substantial artifact to be understandable, reproducible, and honest about limits for a stranger. |

## 4.4 Edges not approved for direct display

These should be handled through concept mediation instead.

| Proposed relationship | Decision | Use this instead |
|---|---|---|
| `fl-prompt-ladder` ↔ `ml-09-validation-claim-audit` | Not approved as direct edge | Connect both to `concept-evaluation`. |
| `fl-explain-build` ↔ `ml-09-validation-claim-audit` | Not approved as direct edge | Connect both through `concept-human-judgment` and `concept-communication`. |
| `fl-site-hardening` ↔ `ml-09-validation-claim-audit` | Not approved as direct edge | Connect both to `concept-evaluation` and `concept-human-judgment`. |
| `fl-04-automation-workflow` ↔ `ml-10-content-action-playbook` | Not approved as direct edge for default map | Connect both through `concept-workflow-design` if needed. |
| `ml-04-data-contract` ↔ `fl-04-automation-workflow` | Not approved | ML-04 is data/evidence work, not workflow design by default. |

---

# 5. IMPLEMENTATION LOCK SUMMARY

## Canonical registry

Ready to encode.

Use:

- 35 canonical assignment records
- 2 non-assignment/source records
- no hard-coded public assignment count unless you want to state “canonical records included in this archive”

## Copy

Mostly approved.

Apply only these safeguards:

- use revised ML-03 copy from uploaded spec,
- use revised FL Ship copy from uploaded spec,
- consider source-safe FL-04 wording,
- remove duplicated FL Identity copy if present.

## Artifacts

Ready as a registry structure.

Do not mark artifacts as available until actual URLs/files/screenshots are attached.

Default evidence status should be:

`partial`

until replaced with:

`available`, `private`, `missing`, or `not-applicable`.

## Graph

Ready for V1.

Approved graph rule:

- show concepts,
- show major spines,
- show only approved direct edges,
- use concept mediation for broad similarities,
- keep cross-track direct edges rare.

The strongest V1 cross-track story is:

- **Problem Framing:** `fl-portfolio-proof` ↔ `ml-02-research-question-lane`
- **Deployment:** `pf-04-personal-website` ↔ `ml-11-ship-paper`
- **Communication:** `fl-portfolio-cases` ↔ `ml-12-tell-story`
- **Reproducible documentation:** `fl-09-documentation-demo` ↔ `ml-11-ship-paper`