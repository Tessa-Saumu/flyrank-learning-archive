# FlyRank Learning Archive v1 Product + Design + Technical Specification

**Status:** V1 revised; architecture locked, source registry must be reconciled before implementation  
**Scope:** AI Fluency + Machine Learning tracks  
**Primary audience:** Future FlyRank students  
**Secondary audiences:** Employers, mentors, and FlyRank reviewers  
**Primary purpose:** Make the work easier to understand, show how the two tracks connect, and preserve useful lessons for future students.

---

# 1. Product Definition

## Working title

**FlyRank Learning Archive**

### Working description

An interactive map of the work completed across the FlyRank AI Fluency and Machine Learning tracks, showing what each assignment asked for, what it taught, what a future student should know, and how assignments, concepts, and artifacts connect.

The archive should feel like a **visual learning system**, not an internship scrapbook and not another conventional portfolio.

**Source-count rule:** Do not hard-code a final assignment count anywhere in the product until the full programme source inventory has been reconciled. The working material contains more source records than the simplified card set shown in this document, including aliases, overlapping programme labels, and capstone/checkpoint records. The canonical registry is the authority.

## Core idea

The programme may appear to contain two separate tracks, but the archive should reveal the practices that run through both:

- Problem framing
    
- Data and evidence
    
- Baselines
    
- Evaluation
    
- Prompting
    
- Workflow design
    
- Agents and tools
    
- Human judgment
    
- Deployment
    
- Communication
    

The graph is the **map**. It is not the archive itself.

The assignment cards are the **archive**.

The artifacts are the **proof**.

---

# 2. Audience and Jobs To Be Done

## Primary audience: future FlyRank students

They should be able to answer:

- What is this assignment actually asking me to do?
    
- What is the useful thing I am supposed to get from it?
    
- What should I know before I start?
    
- Where does this assignment fit in the larger track?
    
- What connects to it later?
    

The archive should reduce the feeling of having to reverse-engineer the programme alone.

## Secondary audience: employers, mentors, FlyRank reviewers

They should be able to answer:

- What did Flow actually build?
    
- Can she explain why the work matters?
    
- Did she understand the work or merely complete tasks?
    
- Can she see relationships between technical and non-technical work?
    
- Can she communicate technical work to someone outside the immediate build context?
    

## Tertiary audience: future self

The archive should function as a reference for:

- completed work
    
- lessons learned
    
- working methods
    
- reusable patterns
    
- portfolio/artifact links
    

---

# 3. Product Principles

## 3.1 The graph must not be required to understand the site

A user should be able to ignore the graph entirely and browse:

**All Work → Track → Assignment → Task / Lesson / Takeaway → Artifact**

The Learning Map adds synthesis and discovery. It must not become a usability barrier.

## 3.2 Do not flatten the work into equal-weight dots

Assignments have a narrative hierarchy:

- **Tier 1: Core**
    
- **Tier 2: Supporting**
    
- **Tier 3: Reference**
    

Visual weight follows how much an assignment contributes to the archive's story, not programme importance, grading weight, or hours spent.

## 3.3 Do not turn every assignment into a personal memoir

Every assignment gets only three core beats:

1. **Task**
    
2. **Lesson**
    
3. **Takeaway**
    

The writing remains compact and source-grounded.

## 3.4 Preserve evidence

Every assignment should point to the real work where possible.

Use:

- embeds when technically appropriate
    
- artifact previews when embedding is blocked
    
- direct links to GitHub, deployed sites, PDFs, videos, Drive files, and other submitted evidence
    

Never manufacture a screenshot or claim an artifact exists when it does not.

## 3.5 Show relationships, do not manufacture them

Connections should be evidence-based. A relationship must have a reason and a provenance classification.

Do not create a direct assignment-to-assignment edge when the relationship is adequately explained by both assignments connecting to the same concept. Use the concept as the bridge.

## 3.6 Separate programme source from my interpretation

The archive should preserve the distinction between:

**What FlyRank asked**  
and  
**How I distilled what the assignment meant.**

The source assignment/card should remain traceable from the structured content even when only the compact Task / Lesson / Takeaway is shown publicly.

## 3.7 Design should serve the information architecture

Do not use a gimmicky interface merely because it looks interesting.

The visual hook is the Learning Map itself.

## 3.8 The map should reveal the system without requiring the user to study it

The default map is a conceptual overview. Detail appears progressively through track, concept, and assignment selection.

# 4. Information Architecture

```text
HOME
│
├── INTRO
│   ├── What this is
│   ├── Who it is for
│   └── How to use it
│
├── LEARNING MAP
│   ├── AI Fluency
│   ├── Machine Learning
│   ├── Shared Concepts
│   └── Connections
│
├── WORK INDEX
│   ├── All
│   ├── AI Fluency
│   ├── Machine Learning
│   └── Filter by concept
│
├── ASSIGNMENT DETAIL
│   ├── Task
│   ├── Lesson
│   ├── Takeaway
│   ├── Artifacts
│   └── Connections
│
├── ARTIFACTS
│   ├── Portfolio
│   ├── ML Paper
│   ├── Agent
│   ├── Deployed Apps
│   ├── Repositories
│   └── Other deliverables
│
├── WHAT I WISH I KNEW IN WEEK 1
│
├── MY WORKING FRAMEWORK
│
└── FINAL REFLECTION
    ├── 500–800 word retrospective
    ├── Hours log
    ├── Build-in-public post
    └── Final review / sign-off
```

---

# 5. Primary User Flow

## First visit

1. User lands on the archive.
    
2. A short introduction establishes the purpose.
    
3. The Learning Map is visible immediately or after the intro.
    
4. User can explore visually or switch to the Work Index.
    
5. Selecting an assignment opens its detail view.
    
6. The user sees the three beats first.
    
7. Evidence/artifacts follow.
    
8. Related assignments and concepts appear at the bottom.
    

## Important behavior

The user must never need to understand the graph vocabulary before interacting with it.

Use plain labels.

---

# 6. Learning Map

## Product name

Use **Learning Map** in the interface.

Do not call it a "dependency graph" in user-facing copy.

## Purpose

The Learning Map makes the programme's implicit structure visible:

- what builds on what
    
- which ideas recur across assignments
    
- where AI Fluency and Machine Learning overlap
    
- which artifacts sit at the end of meaningful work chains
    

It is a map of the archive, not the archive itself.

## Core visual structure

The map should communicate two tracks with shared practices in between them.

Conceptually:

```text
                    AI FLUENCY
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Prompting      Workflow        Agents
          │              │              │
          └──────────────┼──────────────┘
                         │
                  HUMAN JUDGMENT
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Framing       Evaluation     Deployment
          │              │              │
          └──────────────┼──────────────┘
                         │
                MACHINE LEARNING
```

This is an information-architecture model, not a literal required layout.

## Default graph state

The default state should show a restrained conceptual overview rather than the full assignment universe.

Show:

- the two track identities
    
- the 10 concept nodes
    
- a small number of Tier 1 anchor assignments that establish the main spines
    
- only approved, high-confidence major edges
    

Do not render every assignment, every artifact, and every edge at once.

## Progressive disclosure

### Selecting a track

Reveal that track's main strands and relevant assignments.

### Selecting a concept

- highlight directly connected assignments
    
- dim unrelated nodes
    
- show the strongest connections
    
- allow drilling into an assignment
    

### Selecting an assignment

- highlight its direct build-on relationships
    
- highlight its connected concepts
    
- highlight cross-track relationships if approved
    
- show its evidence/artifacts
    

### Selecting an artifact

- show which assignments produced it
    
- show which assignments use/document it
    
- show which concepts it demonstrates
    

## Graph principle

Concept nodes should carry shared meaning.

Do not draw a direct assignment-to-assignment connection merely because both assignments involve testing, explanation, or another broad similarity. If a concept adequately explains the relationship, let the concept mediate the discovery.

# 7. Node Types

Use exactly three primary node types.

## 7.1 Assignment node

Represents a canonical FlyRank assignment.

Examples:

- ML-09 Validation and Research Claim Audit
    
- FL-07 Build the Agent
    

Assignment nodes are the main content nodes.

## 7.2 Concept node

Represents a recurring practice or idea that appears across assignments.

The initial concept set is:

1. Problem Framing
    
2. Data & Evidence
    
3. Baseline
    
4. Evaluation
    
5. Prompting
    
6. Workflow Design
    
7. Agents & Tools
    
8. Human Judgment
    
9. Deployment
    
10. Communication
    

Do not add more concept nodes without a clear product reason.

## 7.3 Artifact node

Represents a real output or public artifact.

Examples:

- ML Research Paper
    
- Personal Portfolio
    
- Personal Agent
    
- Automation Workflow
    
- GitHub Repository
    
- Demo Video
    

Artifact nodes should be used selectively. They are evidence, not decoration.

## Track and strand labels

Track labels and AI Fluency strand labels are grouping/layout metadata, not a fourth semantic node type.

AI Fluency should be presented as two visible strands:

- **Portfolio / Public Work**
    
- **AI Systems / Agents**
    

Machine Learning remains a primary sequential spine.

# 8. Source Reconciliation Gate

This gate must be completed **before implementation**.

The archive must not assume that the number of cards manually extracted into this document equals the number of distinct programme assignments. Source material may contain:

- duplicate representations of one assignment
    
- aliases such as programme page titles versus assignment labels
    
- capstone records that sit outside the ordinary assignment transcript
    
- programme checkpoints or administrative records that should not become assignment nodes
    

## Canonicalisation procedure

1. Inventory every assignment/source record supplied by the programme.
    
2. Give every source record a temporary source ID.
    
3. Resolve duplicates and aliases.
    
4. Assign exactly one canonical assignment ID to every genuine assignment.
    
5. Record aliases/source titles on the canonical record.
    
6. Record programme metadata where available.
    
7. Explicitly mark capstones, checkpoints, administrative items, or other non-assignment records rather than silently dropping them.
    
8. Do not publish or encode a final numeric assignment total until this reconciliation is complete.
    

## Implementation consequence

The assignment examples and locked copy later in this document represent the material currently captured for V1 design. They are **not** a canonical count of the programme. The canonical registry must be reconciled against the complete programme source inventory before routes, graph nodes, search, filters, or analytics are considered final.

A source record may map to one canonical node, while several source labels may map to the same node. No source record should map to two canonical assignment nodes unless the programme source explicitly establishes that they are separate assignments.

# 9. Assignment Tiers

Tiers describe **narrative weight inside this archive**, not how important the assignment was to the internship.

## Tier 1: Core

These form the primary narrative spines.

### Machine Learning

- ML-02 Research Question and Provisional Lane
    
- ML-03 Frame Your Lane as an ML Task
    
- ML-04 Search Intelligence Data Contract
    
- ML-07 Baseline Action Score and Top-10 Review
    
- ML-08 Capstone Modeling Lane
    
- ML-09 Validation and Research Claim Audit
    
- ML-10 Content Action Playbook
    
- ML-11 Ship the Paper
    
- ML-12 Tell the Story
    

### AI Fluency

- What Are You Proving?
    
- Frame It as Cases
    
- FL-04 Ship an Automation Workflow v2
    
- FL-05 Agent Concepts and MCP Basics
    
- FL-06 Design Your Personal Agent
    
- FL-07 Build the Agent
    
- PF-04 Personal Website Live on the FlyRank Domain
    
- FL-09 Documentation and Demo Video
    
- FL-10 Final Package, Retrospective, and Capstone
    

## Tier 2: Supporting

These enable, sharpen, test, or prepare the core work.

- ML-01 Run the Starter Notebooks
    
- FL-01 AI Workflow Audit and Tool Setup
    
- Draw the Path: Portfolio Sitemap + Toolkit
    
- The Prompt Ladder
    
- FL-02 Prompting Fundamentals on Real Tasks v2
    
- Decide Once: Build Your Identity Kit
    
- The Through-Line: Map Content and CTAs
    
- Empty but Live: Ship a Blank Page
    
- Three Roads: Choose Your Stack with AI
    
- Explain It Like You Built It
    
- Make It Do Something
    
- Open It on Your Phone
    
- Survive the Crit
    
- Break Your Own Site
    
- The Plan to Keep Building
    

## Tier 3: Reference / polish

These remain part of the archive but are visually quieter.

- Kill Your Darlings: Curate Your Images
    
- Plant Your Flag: Domain + Badge
    

### Tier note

A lower tier does not mean low value. A Tier 2 or Tier 3 assignment may become visually prominent when a user explores a concept, because the concept layer can temporarily promote its relevance.

For example, **Kill Your Darlings** may remain Tier 3 in the default map while becoming prominent under **Human Judgment**.

# 10. Relationship Types

Only three relationship types should appear visually.

## BUILDS ON

Use when one assignment genuinely extends or relies on earlier work.

Visual treatment: strongest / most direct line.

Examples:

- ML-02 → ML-03
    
- ML-07 → ML-08
    
- FL-06 → FL-07
    

## CONNECTS TO

Use when assignments share a meaningful concept or practice without being strict prerequisites.

Visual treatment: lighter line.

Use concept mediation when the concept explains the connection better than a direct assignment edge.

## CROSS-TRACK

Use when an AI Fluency assignment and Machine Learning assignment reveal the same underlying practice strongly enough to justify a direct relationship.

Visual treatment: distinct but restrained line treatment.

Strong examples:

- What Are You Proving? ↔ ML-02
    
- Frame It as Cases ↔ ML-12
    
- PF-04 ↔ ML-11
    
- FL-09 ↔ ML-11
    

## Edge evidence

Each edge must record both confidence and provenance.

- **explicit**: directly supported by assignment source material
    
- **strong-inference**: not literally stated, but strongly supported by multiple source details
    
- **editorial**: a useful synthesis added by the archive author
    

Editorial edges must be manually approved before appearing in the default map.

# 11. Core Learning Paths

## Machine Learning spine

ML-01 should remain visibly at the entrance to the Machine Learning path as orientation and setup, even though it is Tier 2.

```text
ML-01 · Run / orient
  ↓
ML-02 · Frame
  ↓
ML-03 · Define
  ↓
ML-04 · Understand data
  ↓
ML-07 · Establish baseline
  ↓
ML-08 · Model
  ↓
ML-09 · Validate
  ↓
ML-10 · Apply
  ↓
ML-11 · Deploy / publish
  ↓
ML-12 · Communicate
```

The intellectual capstone spine begins at ML-02, but ML-01 belongs at the visible beginning because later work explicitly assumes the starter notebooks and data have already been run.

## AI Fluency: two strands

Do not force AI Fluency into one chain. It contains two parallel strands that converge at FL-10.

### Portfolio / Public Work

```text
What Are You Proving?
  ↓
Draw the Path
  ↓
Frame It as Cases
  ↓
The Through-Line
  ↓
Three Roads
  ↓
Empty but Live
  ↓
PF-04
  ↓
Make It Do Something
  ↓
Open It on Your Phone
  ↓
Survive the Crit
  ↓
Break Your Own Site
  ↓
Plant Your Flag
  ↓
The Plan to Keep Building
```

### AI Systems / Agents

```text
FL-01
  ↓
Prompt Ladder / FL-02
  ↓
FL-04
  ↓
FL-05
  ↓
FL-06
  ↓
FL-07
  ↓
FL-09
```

### FL-10 convergence

FL-10 is a convergence node, not merely the next step after FL-09.

```text
Portfolio / Public Work ──┐
                          ├→ FL-10 Final Package
AI Systems / Agents ──────┘
```

It packages the whole track, including the public site, agent work, retrospective, hours log, and build-in-public post.

# 12. Cross-Track Concept Layer

The 10 concepts should not be treated as equally cross-track. Some are primarily Machine Learning concepts, some primarily AI Fluency concepts, and a smaller group are the real bridges. That asymmetry is useful.

## Problem Framing

Connect:

- What Are You Proving?
    
- Draw the Path
    
- The Through-Line
    
- ML-02
    
- ML-03
    

Core idea:

**Define what you are trying to prove before building.**

## Data & Evidence

Connect:

- ML-04
    
- ML-07
    
- ML-09
    
- ML-11
    

Core idea:

**Do not ask the evidence to support more than it actually does.**

Do **not** use Break Your Own Site or Survive the Crit as Data & Evidence by default. Those belong under Evaluation and Human Judgment.

## Baseline

Connect:

- ML-07
    
- ML-08
    

Core idea:

**Have a reference point before declaring improvement.**

The Prompt Ladder and FL-02 should not be mapped here merely because they compare versions. Their stronger home is Evaluation.

## Evaluation

Connect:

- ML-08
    
- ML-09
    
- The Prompt Ladder
    
- FL-02
    
- Survive the Crit
    
- Break Your Own Site
    
- FL-09
    

Core idea:

**Test the thing rather than trusting the thing.**

## Prompting

Connect:

- FL-01
    
- The Prompt Ladder
    
- FL-02
    
- ML-03
    

Core idea:

**AI interaction can be treated as a deliberate, testable process.**

Do not use ML-08 here as a generic model-comparison analogy.

## Workflow Design

Connect:

- FL-01
    
- FL-04
    
- FL-05
    
- ML-10
    

Core idea:

**Break work into steps, define handoffs, and make human review explicit.**

Do not map ML-04 here by default. Its stronger concepts are Data & Evidence, Evaluation, and Human Judgment.

## Agents & Tools

Connect:

- FL-05
    
- FL-06
    
- FL-07
    
- FL-09
    

Core idea:

**A real agent has a defined job, tools, constraints, and a way to evaluate it.**

## Human Judgment

Connect:

- FL-01
    
- FL-02
    
- FL-05
    
- FL-06
    
- FL-07
    
- ML-04
    
- ML-07
    
- ML-09
    
- Kill Your Darlings
    
- Survive the Crit
    

Core idea:

**The human remains responsible for deciding what to trust, keep, reject, automate, and explain.**

## Deployment

Define Deployment as:

**Moving work from an internal build into a form that can actually be run, accessed, or inspected.**

Connect:

- Empty but Live
    
- PF-04
    
- Make It Do Something
    
- Plant Your Flag
    
- ML-11
    
- FL-07
    
- FL-09
    

FL-07 fits because its MVP becomes runnable with a real tool connection. It is not being treated as web hosting.

## Communication

Connect:

- Frame It as Cases
    
- Explain It Like You Built It
    
- ML-11
    
- ML-12
    
- FL-09
    
- FL-10
    

Core idea:

**The work must survive outside the builder's head.**

## Concept mediation rule

If two assignments are related mainly because they share one of these concepts, connect both assignments to the concept rather than drawing a direct assignment-to-assignment edge.

# 13. Assignment Card Specification

Every completed assignment uses the same content structure.

## Header

- Track
    
- Assignment identifier
    
- Assignment title
    
- Tier
    
- Status
    

## Three beats

### TASK

What the assignment asked the student to do.

### LESSON

The useful thing the assignment taught or made concrete.

### TAKEAWAY

The most useful thing a future student should know before doing it.

## Evidence block

Label this **PROOF** or **ARTIFACTS**.

Possible items:

- Live demo
    
- GitHub
    
- Notebook
    
- Paper
    
- PDF
    
- Video
    
- Portfolio
    
- Drive file
    
- Other submitted evidence
    

## Connections block

Show:

- connected concepts
    
- directly connected assignments
    
- cross-track connections
    

Do not display a huge list. Prioritise the strongest connections.

---

# 14. Copy Rules

The final assignment copy is intentionally compact.

## Voice

Use:

- direct
    
- plain
    
- conversational
    
- analytical
    
- technically precise
    
- grounded
    
- human
    

Avoid:

- corporate language
    
- generic professional-development language
    
- motivational filler
    
- exaggerated transformation language
    
- "passionate"
    
- "results-driven"
    
- "dynamic"
    
- "leveraged"
    
- "empowered"
    
- "AI-powered" unless technically necessary
    
- generic AI clichés
    

Do not use em dashes.

Do not rewrite the assignments as success stories.

Do not claim a lesson that is not supported by the source material.

Do not make the student sound as if they understood everything from the beginning.

The writing should sound like someone documenting real work, not writing a graduation speech.

---

# 15. Current V1 Assignment Copy

This is the current source-of-truth copy. Do not rewrite these lines during implementation unless explicitly asked.

## ML-01

**Task:** Clone the starter repo, run a live ML pipeline on real search data, and observe a hand-written rule get outperformed by a learned model before you have studied any theory.

**Lesson:** The gap between a rule and a model is not abstract. Seeing it computed in front of you, before you know the theory, is what makes the concept stick.

**Takeaway:** The repo structure matters as much as the notebooks. Read GUIDE.md before you start so you know which folders are yours and which you should not touch.

## ML-02

**Task:** Pick a provisional project lane and write a framing notebook that defines your research question, the decision it improves, the action it enables, and the cost of a wrong answer, backed by real numbers from the starter data.

**Lesson:** An ML project that does not name a decision and an action is just a modelling exercise. The framing question forces you to connect the output to something that matters.

**Takeaway:** The lane can change until Week 4, so do not agonise over it. What you cannot defer is being concrete: vague questions produce vague projects.

## ML-03

**Task:** Translate your research question into a precise ML task definition, including task type, target column, and success metric, and make the unit of analysis visible as real data.

**Lesson:** The gap between wanting to predict something useful and defining X for unit Y with a measurable success metric is what this assignment makes concrete.

**Takeaway:** Use AI to explore options for task type and target, but write the explanation yourself. The graded part is your reasoning, not what the model suggested.

## ML-04

**Task:** Document your lane's slice of the data pipeline in plain language, verify three facts about it with real queries, build a five-feature frame with availability justifications, and deliberately trigger label leakage to see what it looks like before removing it.

**Lesson:** The deliberate leakage experiment is the assignment's most useful moment. Watching your score jump toward perfect when you include a label-derived column makes the problem real in a way that reading about it does not.

**Takeaway:** The sample table is the final month only, not a random sample. Do not use it to develop label logic. Iterate on a mid-panel month and treat the final month as sealed.

## ML-07

**Task:** Check two signals your rule relies on with real data, encode one hand-written rule with a score and reason code, write the ranked queue to a CSV, and review your top ten outputs row by row with a skeptic's eye.

**Lesson:** Building the baseline rule before the model forces you to be honest about what the rule actually leans on, and the signal checks reveal whether those assumptions hold.

**Takeaway:** A clearly explained negative signal verdict is not a failure. The brief says so explicitly. If your signal check comes back OPPOSITE or FALSE, that is useful information that may just have saved your rule design.

## ML-08

**Task:** Build the appropriate model or analysis for your lane, then produce a clear model-versus-baseline comparison table on the same data and same metric, with an interpretation of what the errors look like.

**Lesson:** Modeling comes last in the sequence because by this point you have something honest to beat and clean features to beat it with. The order of operations is not arbitrary.

**Takeaway:** The assignment explicitly says it does not reward complexity alone. A simpler model that beats the baseline on the right metric is better than a sophisticated one you cannot explain.

## ML-09

**Task:** Audit your Week 5 model by re-running it under a grouped or time-aware split, checking features for leakage, reviewing real failure examples, and rewriting any claims that go further than the evidence, while also applying the same critical reading to two findings from the FlyRank research paper.

**Lesson:** Running your own model under a stricter validation design and seeing the before/after difference is what turns a model result into a trustworthy claim.

**Takeaway:** The paper audit is not about finding fault. It is practice for applying the same rigor to your own work. Frame both parts the way you would want your own work reviewed.

## ML-10

**Task:** Convert your validated model output into a structured content action playbook with ranked actions, reason codes, human-review rules, monitoring triggers, and an explicit list of what should not be automated, then export the files your paper will use.

**Lesson:** A model score is not the end product. The playbook is the step where analytical output becomes something a person can actually use, with known limits attached.

**Takeaway:** Build this carefully because it becomes the recommendations section of your paper. Poor work here costs you twice.

## ML-11

**Task:** Research how good research pages are structured, make deliberate choices about format and presentation, then deploy a paper that includes baseline, validation, interpretation, ranked recommendations, and honest claim language throughout.

**Lesson:** "Finding and judging best practices yourself is part of the assignment." This is the first place in the track where presentation decisions are explicitly your own to research and make.

**Takeaway:** Anyone with your repo should be able to rerun or inspect the work. Reproducibility is a required section, not an afterthought.

## ML-12

**Task:** Reframe your paper's findings as a case study tied to a real FlyRank content problem, and prepare two audience-specific versions of the work for sharing and for a potential live demo.

**Lesson:** The case study lives inside the paper, not in a separate file. The assignment is mostly about making sure the paper already contains what you need, rather than adding more documents.

**Takeaway:** The demo outline is optional to present but worth writing either way. It forces you to identify your one honest result and one recommendation, which sharpens the paper itself.

## FL-01

**Task:** Audit your real workflow against an AI task-classification framework, configure your tooling including a Claude Project with custom instructions, and define what "done well" looks like for each of your three target tasks.

**Lesson:** Defining what "done well" means before you start prompting is what separates deliberate practice from just running more prompts.

**Takeaway:** At least two tasks must honestly be "just me" with a reason. That is not a formality. It is the most important part of the audit.

## FL Sitemap

**Task:** Design a sitemap with only the pages that earn their place, and immediately test it against your claim by prompting Claude to find the weaknesses.

**Lesson:** Using AI to pressure-test a plan you have just made is a different skill from using AI to generate ideas. The value is in having something concrete to test.

**Takeaway:** Resist adding pages. The brief says so directly and the pass criteria enforce it. Extra pages are a sign the claim is not narrow enough yet.

## FL Proving

**Task:** Define the single most important thing your portfolio must prove, who it must prove it to, and what you want them to do, with AI as a questioning partner rather than a drafter.

**Lesson:** Everything downstream of this assignment is easier once the claim is settled. The brief says so plainly. The time spent here is not wasted on framing. It is the work.

**Takeaway:** Push back on the AI's output until the claim sounds like yours, not like something generated. The pass criterion explicitly says "could only describe your proof, not any portfolio."

## FL Frame

**Task:** Build case studies for every piece the sitemap calls for, using AI as an interviewer to pull out the honest messy version, then edit until it sounds like a specific person talking about a specific project.

**Lesson:** A portfolio is mostly the framing around the work. The framing is what a stranger reads first, and it is what makes them trust you or scroll past.

**Takeaway:** Start with the work you are making in this internship. The brief suggests it explicitly, and it means you are building the case study alongside the project rather than reconstructing it from memory.

## FL Prompt Ladder

**Task:** Take a genuinely weak prompt from your own work, improve it across five versions where each version adds exactly one named layer, and document what actually changed in the output at each step.

**Lesson:** Changing one thing at a time is the only way to know which change caused the improvement. Changing several things at once and seeing a better result teaches you nothing.

**Takeaway:** The note that matters is "what improved in the output," not "what I changed in the prompt." If you can only write the second kind, you are not looking closely enough at the results.

## FL-02 | Prompting

**Task:** Work through Anthropic's prompt engineering tutorial, apply five named techniques to a real task from your FL-01 audit, run the final prompt on both Claude and ChatGPT, and distill the result into a reusable template.

**Lesson:** Practicing on a real task from your own audit is what makes the techniques stick. Toy examples do not surface the same failure points.

**Takeaway:** The cross-model comparison needs to say something specific. "Both were fine" does not pass. Compare tone, accuracy, structure, and failure points separately.

## FL Identity

**Task:** Choose your fonts, colour palette, and logo, write a two-line style note, and add the style note to your Claude Project so all future build work inherits the same decisions.

**Lesson:** Visual consistency comes from making a small number of decisions once, not from having design talent. The kit makes every later page cheaper to build.

**Takeaway:** The palette should be calm enough that your work is the loudest thing on the page. That constraint is the design principle, not just a preference.

## FL Curate

**Task:** Identify every image your portfolio actually needs, use real captures for your work and generate only connective-tissue images in a consistent style, and write a short note explaining at least one generated image you rejected and why.

**Lesson:** The skill is not generation. It is knowing when a real screenshot of your work beats anything generated, and being able to explain the difference.

**Takeaway:** The rejection note is graded. "I liked this one better" is not enough. The brief asks for genuine judgment about what serves your proof.

## FL Map Content

**Task:** Write a single memorable one-line claim, build a content map that puts sections in order per page with the strongest work leading, and list anything you still need to gather before the build week.

**Lesson:** A good case in the wrong place still fails. The content map is what prevents you from building a site that is complete but incoherent.

**Takeaway:** The gather-list is not an optional extra. The brief says it exists so the build week is not blocked. Do it honestly.

## FL Ship

**Task:** Get a near-blank page live on a real public URL, confirm it works on your phone, and load your identity kit, case studies, and content map into your Claude Project so the build week can start without setup.

**Lesson:** Getting something live on a URL, even if it just says your name, removes a major setup barrier before the build week. The point is to start the build with something already deployed.

**Takeaway:** Test the URL on a second device, not just a resized browser. The pass criteria require it.

## FL Stack

**Task:** Use AI as an options generator, not a decision-maker, to compare three genuine build paths for your portfolio, then commit to one in writing with reasons that include maintainability and whether it shows your work properly.

**Lesson:** Three genuine options with trade-offs considered, not one answer obeyed. The habit of extracting options before deciding is what the assignment is actually teaching.

**Takeaway:** The rationale must include "can I maintain this." Future-you has to update this site. That constraint rules out a lot of tempting options.

## FL-04

**Task:** Build an end-to-end automated pipeline that runs on a brand new input without your intervention, time it against doing the same task manually, and document what it cannot do.

**Lesson:** Timing yourself against the manual version and being honest about the setup cost is what distinguishes a genuine productivity tool from a demonstration.

**Takeaway:** Sketch the flow before you build. The brief says to do this and it is good advice. Building a multi-step workflow without a step diagram usually ends in an unworkable structure.

## FL-05

**Task:** Classify your FL-04 pipeline accurately as a workflow or an agent, demonstrate one real MCP connection working, and write a technically correct explainer that describes what your pipeline would need to become a true agent.

**Lesson:** MCP's three primitives, tools, resources, and prompts, are a useful framework. Understanding them is what lets you evaluate whether a tool's "agent" claims hold up.

**Takeaway:** One concrete agent upgrade named for your own pipeline is a required part of the explainer. Vague gestures toward "adding more tools" do not count.

## FL Explain

**Task:** Close one genuine gap in your understanding of your own build by using AI as a tutor, then prove you closed it by writing the explanation without jargon.

**Lesson:** Using AI to tutor you into genuine understanding, then explaining it yourself, is a different skill from using AI to explain something you do not care about understanding. The writing proves whether the learning happened.

**Takeaway:** Read every line out loud before submitting. If you would not say it to a friend, cut it.

## FL-06

**Task:** Scope one job for an agent, justify your platform choice against at least one alternative, and specify what the agent must confirm and what it must never do before you write a line of configuration.

**Lesson:** The guardrails section is not an afterthought. Naming what the agent must never do is part of the design, not a disclaimer you add at the end.

**Takeaway:** Scope it to one job done well. The brief is explicit. The grading criteria cap the expected build time at roughly ten hours. If your spec requires more, the scope is too large.

## FL-07

**Task:** Ship an MVP agent that completes its core job end to end without mid-run hand-editing, with at least one live tool connection and a build log that shows real iteration.

**Lesson:** Build logs that show real iteration, including what you cut and why, are more credible than clean retrospective stories. The honest version of what happened is the valuable record.

**Takeaway:** Deviating from your FL-06 spec is normal. The requirement is to document why, not to pretend it did not happen.

## PF-04

**Task:** Plan and deploy a simple personal site on a free host with HTTPS, rename it to a clean URL, and write a plain-language DNS walkthrough explaining what actually happens between a browser request and the host responding.

**Lesson:** Building and deploying the site teaches you hosting, HTTPS, and basic web infrastructure regardless of what stack you choose. The DNS walkthrough forces you to understand the infrastructure rather than just following instructions.

**Takeaway:** You must be able to explain every file in the deployed site. That requirement is in the pass criteria. It is the practical test of whether you built it or just clicked through a template.

## FL Do Something

**Task:** Choose one dynamic feature your portfolio actually needs, build it to work on a free tier with AI as a build partner, and explain the data flow in your own words.

**Lesson:** The assignment calls this the most directly employable skill in the whole track. Wiring one real feature and understanding it is the line between a portfolio that tells and one that does.

**Takeaway:** One feature, not several. The pass criteria repeat this. Pick the one thing your portfolio most needs and make it work properly.

## FL Phone

**Task:** Conduct a real device audit of your portfolio across mobile, tablet, and desktop, fix the obvious breaks, and document what you found and changed.

**Lesson:** Testing on a resized browser is not the same as testing on a real phone. Issues that are invisible in a browser window show up on a real device, and some of them matter.

**Takeaway:** Click every link including demo and repo. The fix log requires real problems found and fixed. If your log is empty, you did not look hard enough.

## FL Crit

**Task:** Get external feedback on whether your portfolio communicates what you do in ten seconds and whether the work backs it up, then act on the must-fixes before proceeding.

**Lesson:** The two questions to ask first, "what do I do?" and "would you believe I'm good at it?", are structured so you get the most useful signal before the reviewer has a chance to be polite.

**Takeaway:** Engaging with feedback rather than defending is itself a graded criterion. If the must-fixes are acknowledged but not fixed on the live site, you have not passed.

## FL Break

**Task:** Conduct real edge-case testing on your own site, add findability and speed basics, and submit a triage document that distinguishes between what you fixed and what you are acknowledging as a known limitation.

**Lesson:** The SEO and meta step is often treated as optional decoration. It is in this assignment because a portfolio that cannot be found or shared properly is missing a functional requirement.

**Takeaway:** This checkpoint must pass to proceed to launch. Do not treat it as a formality.

## FL Flag

**Task:** Complete the final public launch: custom domain, analytics, HTTPS confirmed, share preview working, and the badge installed.

**Lesson:** Launch hygiene, the social share preview, favicon, and page titles on the real address, is the last check before the site is genuinely public rather than just reachable.

**Takeaway:** Open the final address on your phone one more time after pointing the custom domain. DNS propagation can take time, and what worked on the old URL may not have transferred cleanly.

## FL09

**Task:** Make your agent legible to a stranger through a setup-reproducible README and an honest demo that includes one real limitation explained on camera.

**Lesson:** Including one limitation explained on camera is a required criterion, not a nice-to-have. Honesty about limitations reads as credibility, not weakness.

**Takeaway:** Add a line in the README naming what you built with AI and how. The brief explicitly requires transparency about AI involvement.

## FL Plan

**Task:** Make a concrete maintenance plan for your portfolio, naming the next project and when you will add it, before the context from building it is gone.

**Lesson:** Setting a calendar nudge now, while you still remember how everything works, is the practical difference between a site that grows and one that stagnates.

**Takeaway:** The three-beat shape from Week 2, problem, what you did, what came of it, is reusable for every future case. You do not need to reinvent the format.

## FL10

**Task:** Assemble every deliverable from the whole track in one indexed place, write a 500-to-800 word retrospective aimed at the person you were in Week 1, complete your hours log, publish your site, and submit for final sign-off.

**Lesson:** The retrospective is where you account for what specifically changed in how you work, not what you learned in general. That specificity is what makes it useful.

**Takeaway:** The retrospective must be specific to your build. Generic reflection does not pass. The brief says so directly.

---

# 16. Artifacts and Embeds

Artifacts are the proof layer of the archive.

## Embedded artifact strategy

Embed only where the external platform supports a stable, useful experience.

For **Tier 1 assignments with substantial, stable artifacts**, default to an embedded or directly experienced artifact when technically feasible. This includes substantial notebooks, the deployed ML paper, the live portfolio, the working agent, and other sizeable build outputs.

Do not embed merely because a platform technically allows it. Small or supporting evidence should remain a compact preview/link.

Priority embeds:

- personal portfolio
    
- deployed ML paper
    
- deployed interactive ML/AI applications
    
- agent/demo experiences where appropriate
    

For anything that does not embed reliably, use an artifact preview card with:

- title
    
- short description
    
- artifact type
    
- live/repository link
    
- optional screenshot or preview image
    

## Artifact roles

Each assignment-artifact relationship must record what the artifact does in the learning chain:

- **produces**: assignment creates the artifact
    
- **uses**: assignment consumes an artifact created earlier
    
- **documents**: artifact records or explains work
    
- **demonstrates**: artifact is evidence of a capability or lesson
    

## Embed fallback

If an embed fails or is blocked:

1. show the artifact card
    
2. explain what the artifact is in one sentence
    
3. provide the direct link
    
4. never fake an embedded experience
    

The archive must remain useful even when external services change or block iframes.

# 17. Future Work Placeholders

Future assignments should appear only when the programme source confirms their existence and identity.

A confirmed upcoming assignment may have a visible node with:

- title
    
- track
    
- status = upcoming
    
- placeholder detail state
    

Do not invent generic future nodes such as "advanced ML" or "future agent work".

The current programme progress should be allowed to grow without restructuring the graph.

When a placeholder becomes complete:

- add Task / Lesson / Takeaway
    
- add source reference
    
- add artifact relationships
    
- assign concepts
    
- assign a narrative tier
    
- add approved graph edges
    

The node itself does not need to be redesigned.

# 18. Status Model

Completion status and evidence availability are separate.

## Programme status

```ts
status: "complete" | "in-progress" | "upcoming"
```

## Evidence status

```ts
evidenceStatus:
  | "available"
  | "partial"
  | "private"
  | "missing"
  | "not-applicable";
```

A completed assignment may have private or missing evidence without being marked incomplete.

The UI should communicate this honestly where relevant.

# 19. Visual Direction

## Overall visual concept

**Obsidian knowledge graph × editorial field guide × technical documentation**

The visual experience should feel considered and slightly experimental without becoming gimmicky.

## Design priorities

1. Readability
    
2. Information hierarchy
    
3. Graph clarity
    
4. Artifact visibility
    
5. Motion as feedback, not decoration
    

## Avoid

- fake operating-system interfaces
    
- fake desktop environments
    
- gratuitous 3D
    
- excessive gradients
    
- AI robot imagery
    
- decorative AI icons
    
- floating magical particles
    
- giant glassmorphism panels
    
- dashboard clutter
    
- animations that obscure text
    

The knowledge map itself is the visual concept.

---

# 20. Typography

Use the existing portfolio typography system where possible:

- **Headings:** Sora
    
- **Body:** Inter
    

Do not introduce additional display fonts unless there is a compelling information-design reason.

Typography should establish a clear hierarchy:

- page title
    
- section label
    
- assignment title
    
- Task / Lesson / Takeaway labels
    
- body copy
    
- metadata
    
- artifact labels
    

---

# 21. Colour Strategy

Reuse the established portfolio identity where practical rather than inventing an unrelated visual identity.

The graph may introduce:

- a restrained track distinction
    
- a concept distinction
    
- an artifact distinction
    

But color must never be the only way to understand node type.

Use:

- shape
    
- label
    
- size
    
- line treatment
    

as additional signals.

The palette should remain quiet enough that actual work is the focus.

---

# 22. Node Visual Hierarchy

## Tier 1

- largest assignment nodes
    
- strongest contrast
    
- highest initial visibility
    
- may use short labels in graph
    
- full title on hover/click
    

## Tier 2

- medium nodes
    
- normal contrast
    
- visible when relevant
    

## Tier 3

- smaller / quieter nodes
    
- discoverable through filters or related nodes
    

## Concept nodes

Use a shape clearly distinct from assignment nodes.

## Artifact nodes

Use a third shape distinct from both assignment and concept nodes.

Exact shapes can be chosen during implementation but must be consistent.

---

# 23. Graph Interaction Spec

## Hover

On hover:

- enlarge slightly
    
- reveal title tooltip
    
- highlight immediate relationships
    
- dim unrelated nodes slightly
    

Hover should never be the only way to access information.

## Click

On click:

- focus the selected node
    
- highlight connected nodes and lines
    
- open the corresponding detail drawer/panel or route
    

## Escape / close

Return to the previous map state without losing the user's zoom/filter where practical.

## Filter

Provide:

**ALL**

**AI FLUENCY**

**MACHINE LEARNING**

**CONCEPTS**

**ARTIFACTS**

Optionally expose **CORE / SUPPORTING / REFERENCE** as a secondary filter.

## Search

Search should find:

- assignment titles
    
- assignment identifiers
    
- concept names
    
- artifact names
    

Search results should open the relevant node/detail view.

---

# 24. Motion

Motion should communicate state change.

Use only subtle transitions for:

- node focus
    
- graph filtering
    
- panel open/close
    
- hover
    
- connection highlighting
    

Avoid:

- automatic graph spinning
    
- excessive zooming
    
- perpetual particle animation
    
- long entrance animations
    

Respect reduced-motion preferences.

---

# 25. Responsive Behavior

## Desktop

Primary graph experience.

Graph can occupy a large portion of the viewport.

Assignment details can use a side panel or adjacent content area.

## Tablet

Graph remains interactive but can simplify labels.

## Mobile

Do not attempt to squeeze the full graph into a tiny viewport.

Use a mobile-friendly learning map:

- simplified graph view
    
- list/card representation of nodes
    
- tap to expand connections
    
- track and concept filters
    

The mobile experience should preserve the relationships without requiring desktop-level graph navigation.

---

# 26. Technical Stack

## Frontend

**Astro**

Primary framework for site structure, content rendering, routing, and static generation.

## Language

**TypeScript** where interactivity or data typing benefits from it.

Plain HTML/CSS remains appropriate for static presentation.

## Graph

**Cytoscape.js**

Use it for:

- graph rendering
    
- node/edge management
    
- zoom/pan
    
- selection
    
- highlighting
    
- graph layout
    

Do not build a custom SVG graph engine unless a later requirement makes Cytoscape insufficient.

## Content

Use Astro content collections / Markdown or another simple structured content layer.

Recommended structure:

```text
src/
├── content/
│   ├── assignments/
│   │   ├── ai-fluency/
│   │   └── machine-learning/
│   ├── reflections/
│   └── guidance/
│
├── data/
│   ├── assignments.ts
│   ├── concepts.ts
│   ├── artifacts.ts
│   └── graph.ts
│
├── components/
│   ├── LearningMap.astro
│   ├── GraphView.ts
│   ├── AssignmentCard.astro
│   ├── ArtifactCard.astro
│   ├── ConceptCard.astro
│   ├── FilterBar.astro
│   └── DetailPanel.astro
│
└── pages/
    ├── index.astro
    ├── work/
    ├── concepts/
    ├── artifacts/
    └── reflection/
```

This is a recommended structure, not a rigid requirement.

## Hosting

Reuse the existing portfolio deployment approach, preferably the existing Netlify workflow.

Do not introduce a backend unless a future requirement genuinely requires one.

---

# 27. Data Model

## 26.1 Canonical assignment registry

Every source card must resolve to exactly one canonical assignment.

The canonical registry is the source of truth for routes, graph edges, filtering, search, and analytics.

Do not use unstable editorial labels such as `FL Sitemap` as canonical machine IDs.

Example:

```ts
interface Assignment {
  id: string;
  track: "ai-fluency" | "machine-learning";
  title: string;
  displayLabel?: string;
  officialCode?: string;
  sourceAliases?: string[];
  tier: "core" | "supporting" | "reference";
  status: "complete" | "in-progress" | "upcoming";
  evidenceStatus: "available" | "partial" | "private" | "missing" | "not-applicable";
  week?: number;
  workloadHours?: number;
  phase?: string;
  task?: string;
  lesson?: string;
  takeaway?: string;
  concepts: string[];
  artifactLinks: string[];
  sourceUrl?: string;
  sourceReference?: string;
  canonicalisationStatus?: "unreviewed" | "reviewed";
}
```

### Canonicalisation rule

If multiple programme pages represent the same assignment, keep one canonical node and store the other labels as aliases.

Example:

```ts
{
  id: "fl-09-documentation-demo",
  officialCode: "FL-09",
  title: "Documentation and Demo Video",
  sourceAliases: ["Show It / Tell the Story", "Assignment 8.1"]
}
```

Do not hard-code a total assignment count until this registry has been checked against all programme source pages.

## 26.2 Concept

```ts
interface Concept {
  id: string;
  name: string;
  description: string;
  assignments: string[];
}
```

## 26.3 Artifact

```ts
interface Artifact {
  id: string;
  title: string;
  type: "live" | "github" | "pdf" | "video" | "document" | "image" | "other";
  url?: string;
  embedUrl?: string;
  previewImage?: string;
  description: string;
}
```

## 26.4 Assignment-artifact relationship

```ts
interface ArtifactLink {
  assignmentId: string;
  artifactId: string;
  role: "produces" | "uses" | "documents" | "demonstrates";
}
```

The relationship is separate from the artifact itself because the same artifact may play different roles at different points in the programme.

## 26.5 Graph edge

```ts
interface GraphEdge {
  source: string;
  target: string;
  relationship: "builds-on" | "connects-to" | "cross-track";
  confidence: "high" | "medium" | "low";
  evidence: "explicit" | "strong-inference" | "editorial";
  approved: boolean;
  reason: string;
  sourceReference?: string;
  canonicalisationStatus?: "unreviewed" | "reviewed";
}
```

Confidence and evidence provenance are separate fields.

# 28. Graph Data Rules

## Default visibility

The initial view should expose:

- the 10 concept nodes
    
- the two tracks / strand groups
    
- a restrained set of Tier 1 anchor assignments
    
- ML-01 at the entrance to the ML path
    
- only approved high-confidence major connections
    

Not every assignment should be visible on first render.

## Track expansion

Selecting Machine Learning reveals the full ML spine, including ML-01.

Selecting AI Fluency reveals the portfolio/public-work strand and the AI-systems strand.

## Concept expansion

Selecting a concept temporarily promotes all assignments connected to it, including lower-tier assignments such as Kill Your Darlings when Human Judgment is selected.

## Connection rule

Never create a direct edge simply because two assignments have similar words or both involve a broad practice.

If the relationship is adequately explained by a shared concept, use concept mediation instead.

Strong direct edges should be rare and deliberate.

## Edge approval

Only edges with `approved: true` may appear in the default map.

Low-confidence or editorial edges should remain hidden unless explicitly approved or surfaced through a later exploratory mode.

## Provenance

Every non-obvious relationship should retain a source reference or editorial reason so future revisions can audit why the relationship exists.

# 29. Key Cross-Track Story

The archive should gradually reveal this synthesis:

> The two tracks look separate at first, but they repeatedly teach overlapping ways of working from different directions.

The recurring shape is:

```text
DEFINE
  ↓
BUILD
  ↓
TEST
  ↓
AUDIT
  ↓
COMMUNICATE
```

The ML track expresses this through:

- research questions
    
- data contracts
    
- baselines
    
- models
    
- validation
    
- action playbooks
    
- research publication
    

The AI Fluency track expresses this through:

- proof statements
    
- prompting
    
- workflows
    
- agents
    
- portfolio construction
    
- deployment
    
- critique
    
- documentation
    

The archive should not overstate that every assignment is a direct analogue. The stronger claim is that several recurring practices bridge the tracks: **Problem Framing, Evaluation, Human Judgment, Deployment, and Communication.**

The most useful discovery relationships should come through those concept bridges rather than through a dense web of direct assignment edges.

## Reproducibility thread

Reproducibility should be represented as evidence metadata and copy, not as an additional concept node.

It appears through:

- committed and runnable notebooks
    
- repo structure
    
- metrics/figure receipts
    
- ML-11 reproducibility
    
- FL-09 stranger-followable setup
    
- understanding deployed files
    

This is one of the clearest ways the archive can distinguish **"I made something"** from **"someone else can inspect and verify what I made."**

# 30. "What I Wish I Knew in Week 1"

This section is a practical resource for future students.

It should contain a small number of concrete lessons derived from the completed work.

Do not make it a motivational essay.

Initial candidate themes:

- You do not need to understand the entire track before starting.
    
- Define the thing you are trying to prove before choosing the tool.
    
- Build something small enough to test.
    
- Treat AI output as something to evaluate, not automatically accept.
    
- A working artifact with clear limits is more useful than a polished explanation of an untested idea.
    
- Document the work while the decisions are still fresh.
    

Final wording should be drafted from the completed assignment material and retrospective, not invented now.

---

# 31. Working Framework

The final framework is provisional until the completed body of work and retrospective support it.

Candidate structure:

```text
DEFINE
  ↓
DECIDE WHAT GOOD LOOKS LIKE
  ↓
BUILD SMALL
  ↓
TEST
  ↓
FIND FAILURE
  ↓
EXPLAIN
  ↓
SHIP
```

Every step should eventually link to the assignments that earned it.

Example:

### DEFINE

- What Are You Proving?
    
- ML-02
    
- ML-03
    
- FL-06
    

### TEST

- The Prompt Ladder
    
- ML-08
    
- ML-09
    
- Break Your Own Site
    

### SHIP

- Empty but Live
    
- PF-04
    
- FL-07
    
- ML-11
    

Do not present this framework as a conclusion before the evidence supports it. It should be an earned synthesis of the archive.

# 32. Final Reflection

The required 500–800 word retrospective should be presented as part of the archive rather than as a detached document.

It should answer the original assignment's requirements:

- what you set out to do
    
- what changed
    
- what you would build next
    
- the three most transferable things you learned
    

The final reflection should be written for the person you were in Week 1.

The surrounding UI can provide context, but the actual retrospective should remain within the required word range.

---

# 33. Final Package Section

The archive itself should provide a clear completion section containing:

- master index
    
- live site
    
- hours log reference
    
- build-in-public post
    
- final reflection
    
- final review / sign-off reference
    

The final section should make it obvious that this archive is also the completion package for the assignment.

---

# 34. Accessibility

Minimum requirements:

- keyboard navigable controls
    
- visible focus states
    
- meaningful button labels
    
- semantic headings
    
- sufficient contrast
    
- alternative text for meaningful images
    
- no information conveyed by color alone
    
- graph interactions have a non-graph alternative
    
- reduced-motion support
    

A screen-reader user must be able to access the assignment index and assignment content without interacting with the graph.

---

# 35. Performance

Priorities:

- static-render assignment content
    
- lazy-load heavy embeds
    
- lazy-load videos and PDFs where appropriate
    
- do not load large artifact previews until needed
    
- keep graph initialization lightweight
    
- avoid unnecessary JavaScript outside the map interaction
    

The graph is the main interactive dependency. Everything else should remain as simple as possible.

---

# 36. SEO / Sharing

Each assignment should be independently linkable.

Each assignment page/view should have:

- title
    
- description
    
- canonical URL
    
- appropriate Open Graph metadata
    

The overall archive should have a clear description explaining that it covers both AI Fluency and Machine Learning work at FlyRank.

---

# 37. Implementation Constraints

## Must have

- Astro
    
- responsive layout
    
- accessible non-graph navigation
    
- Learning Map
    
- three-tier hierarchy
    
- three node types
    
- three relationship types
    
- assignment detail pages/cards
    
- artifact links
    
- future placeholders
    
- search/filter
    
- final reflection
    

## Should have

- selected live embeds
    
- graph filtering
    
- concept pages
    
- artifact pages
    
- smooth but restrained transitions
    
- mobile-specific graph fallback
    

## Nice to have later

- animated journey replay
    
- timeline mode
    
- export/shareable map image
    
- "show me everything connected to X"
    
- visual progress through the two tracks
    

Do not allow nice-to-have features to expand the scope of V1.

---

# 38. Definition of Done

1. Every programme source record has been reconciled to one canonical assignment or an explicitly documented non-assignment record.  
    V1 is done when:
    
2. A future student can understand what the archive is within seconds.
    
3. The user can browse all canonical completed assignments without using the graph.
    
4. Every canonical assignment has Task, Lesson, Takeaway, and evidence status.
    
5. Every source card has been resolved to one canonical assignment ID.
    
6. The graph makes meaningful relationships visible without becoming visually overloaded.
    
7. The two tracks are distinguishable but clearly connected where evidence supports it.
    
8. Tier 1 assignments receive visibly greater default weight than Tier 2 and Tier 3.
    
9. The 10 concepts make useful patterns visible without pretending every concept is equally cross-track.
    
10. Major artifacts can be opened or experienced directly where technically possible.
    
11. Artifact links record whether an assignment produced, used, documented, or demonstrated the artifact.
    
12. Upcoming work appears only where the programme source confirms the assignment exists.
    
13. The final retrospective and completion package live inside the archive.
    
14. The graph can be ignored completely without reducing the site's usefulness.
    
15. The Learning Map uses concept mediation to prevent graph spaghetti.
    
16. Cross-track edges are manually approved and retain provenance metadata.
    
17. The site works on mobile without requiring the full desktop graph experience.
    
18. The design feels like a coherent learning archive, not a generic portfolio and not a gimmick.
    

# 39. Recommended Build Order

Do not build everything at once.

## Phase 1: Content and data

- build the canonical assignment registry
    
- resolve aliases/source duplicates
    
- encode task / lesson / takeaway
    
- encode tiers
    
- encode programme status and evidence status
    
- encode week / workload / phase where available
    
- encode concepts
    
- encode artifacts
    
- encode assignment-artifact roles
    
- encode approved graph edges with provenance
    

## Phase 2: Non-graph archive

- homepage
    
- track index
    
- assignment cards
    
- artifact cards
    
- final reflection
    

## Phase 3: Learning Map

- Cytoscape integration
    
- concept-first default view
    
- ML spine expansion
    
- AI Fluency two-strand expansion
    
- tier-based node weight
    
- approved relationships only
    
- concept mediation
    
- filtering
    
- selection
    
- detail panel
    

## Phase 4: Embeds and evidence

- portfolio
    
- ML paper
    
- agent/demo artifacts
    
- repositories
    

## Phase 5: Responsive and accessibility pass

- mobile fallback
    
- keyboard navigation
    
- reduced motion
    
- contrast
    
- graph alternative
    

## Phase 6: Polish

- transitions
    
- spacing
    
- typography tuning
    
- final visual hierarchy
    
- metadata / social preview
    

Do not begin with animation.

Do not begin with graph aesthetics.

Build the information system first.

---

# 40. Final Creative Direction

The experience should leave the viewer with this impression:

> **This person did a lot of work, but more importantly, she can see how the pieces fit together.**

For a future student, the feeling should be:

> **I can actually see what this programme is asking me to do now.**

For an employer or reviewer:

> **She did not just complete assignments. She extracted a way of working from them.**

That is the purpose of the archive.