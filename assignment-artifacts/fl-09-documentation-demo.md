# Repo Tutor

Repo Tutor is an AI agent that helps ML and AI engineers understand and take ownership of an unfamiliar code repository.

It works in two stages:

1. **Repository analysis**: it builds an evidence-based picture of the repository, including file responsibilities, entrypoints, data flow, design decisions, and improvements.
2. **Socratic tutoring**: it tests whether the user actually understands the system through adaptive multiple-choice questions, one question at a time.

The agent is designed for engineers who need to understand a repository quickly without relying on assumptions about how the code works.

## What the agent does

Repo Tutor takes a connected GitHub repository and produces a structured analysis using repository evidence only.

It identifies:

* what the repository contains
* what each relevant file is responsible for
* explicit application entrypoints
* the path from input to output
* important implementation choices and their tradeoffs
* evidence-grounded improvements
* confidence in each part of the analysis

The agent then switches into a tutoring mode.

It asks one WHY/HOW multiple-choice question at a time. The next question changes based on the previous answer:

* **Correct** → harder related question
* **Partially correct** → question targeting the missing concept
* **Incorrect** → simpler question targeting the misconception

After the configured number of questions, the agent asks the user to restate the system in no more than three sentences. The current demo is configured for five questions.

The goal is not just to produce a repository summary. It is to find out whether the user can explain the system themselves.

## Who it is for

Repo Tutor is mainly for:

* ML and AI engineers onboarding to an unfamiliar repository
* engineers reviewing projects they did not build
* students learning to trace ML systems from code
* developers preparing to take ownership of an existing project

It is less useful when the repository itself is incomplete or when the user needs runtime debugging rather than repository understanding.

## Setup

The current implementation runs on **Arena.ai** with a GitHub repository connector.

### 1. Connect the repository

In Arena.ai, create or open the Repo Tutor agent and connect the GitHub repository you want to analyse.

Select the repository and branch before starting the session.

The connector must provide repository content to the agent. Uploaded documents can also be used when they are relevant to the repository analysis.

### 2. Configure the agent

Add the final Repo Tutor system prompt to the agent configuration.

The prompt contains the grounding, safety, analysis, and tutoring rules. The final implementation does **not** depend on the original Markdown skill files being registered as callable tools.

The current demo is capped at **5 Socratic questions** so that a complete end-to-end demonstration can finish within a time that can be run in a live demo.

The five-question limit is **not a fundamental requirement of the agent design**.

To run a longer tutoring session, edit the **`PHASE 2 — SOCRATIC MCQ MODE`** section of the Repo Tutor system prompt.

Specifically, change:

```text
Continue through Q5.
```

and the related five-question limit to the desired number of questions.

For example, a 10-question session would use:

```text
Continue through Q10.
```

The final restatement and scoring stage should remain after the last question.

### Important

Increasing the number of questions increases token usage and runtime. With the current Arena.ai implementation, longer sessions can therefore take substantially longer to complete.

The current **5-question configuration exists to make the demo practical**, not because the tutoring design requires exactly five questions.

### 3. Start a session

After pasting the full repo tutor system prompt the agent should first complete all seven Phase 1 sections:

1. Elevator Summary
2. File Responsibility Map
3. Entrypoint Evidence
4. Data Flow
5. Top 3 Design Decisions + Tradeoffs
6. Prioritized Improvements
7. Confidence

Only after those sections should it ask the first Socratic question.

### 4. Answer the questions

Respond to each multiple-choice question with:

```text
A
```

or:

```text
B
```

and so on.

The agent will adapt the next question based on the previous answer.

### 5. Complete the final restatement

After Q5, give a system explanation in no more than three sentences.

The agent scores the explanation using:

* Coverage: 0–4
* Correctness: 0–4
* Clarity: 0–2

## Usage examples

### Understand an unfamiliar ML repository

```text
Analyse this repository and explain how the ML system works.
```

The agent should trace the repository from the available evidence rather than assuming how components are connected.

### Test whether you actually understand it

After the Phase 1 analysis, answer the Socratic questions one at a time.

For example:

```text
C
```

The next question should depend on that answer rather than following a fixed script.

### Use the agent for onboarding

A useful workflow is:

```text
1. Connect the repository.
2. Run Repo Tutor analysis.
3. Read the evidence-backed Phase 1 output.
4. Answer Q1–Q5.
5. Write the final three-sentence system restatement.
6. Use the score to identify what you still do not understand.
```

## Architecture

The final architecture is intentionally small.

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Arena.ai        │
                    │    Repo Tutor       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ GitHub Connector│        │ Uploaded Docs   │
        │ Repository data │        │ where applicable│
        └────────┬────────┘        └────────┬────────┘
                 └─────────────┬─────────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │     System Prompt        │
                 │                          │
                 │ Grounding + safety       │
                 │ Analysis + tutoring      │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Phase 1: Repository     │
                 │ Analysis                 │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Phase 2: Adaptive        │
                 │ Socratic MCQs             │
                 │ Q1 → Q2 → Q3 → Q4 → Q5  │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Final System Restatement │
                 │ + Score                  │
                 └──────────────────────────┘
```

The original design included five separate Markdown skills. Arena did not reliably expose those files as callable tools, so their behaviour was moved into the system prompt.

This made the final implementation simpler and less dependent on tool registration.

## V2 evaluation results

| Eval case                   | Agentic BI Builder       | Africa Growth Explorer |
| --------------------------- | ------------------------ | ---------------------- |
| **1. Entrypoint detection** | **PASS**                 | **PASS**               |
| **2. Data flow**            | **PASS**                 | **PASS**               |
| **3. Decision extraction**  | **PASS**                 | **PASS**               |
| **4. Test/CI coverage**     | **PASS**                 | **PARTIAL**            |
| **5. Teaching outcome**     | **4/10 learner outcome** | **Not completed**      |

### Summary

Repo Tutor passed the first three repository-analysis evals on both repositories, showing that the evidence-grounded analysis transferred across two different codebases.

Test/CI coverage was fully established for Agentic BI Builder, where the agent identified and ran the test suite. For Africa Growth Explorer, the agent found the documented `pytest -q` command and identified the lack of CI, but did not execute the tests, so this was only partially established.

The Agentic BI Builder tutoring run produced a **4/10 learner outcome**. This reflects the learner's final understanding, not an isolated measure of agent accuracy. The agent correctly identified and repeatedly targeted the learner's misconception about the retry mechanism, but the learner still carried that misconception into the final restatement.

The Africa Growth Explorer run had reached the Socratic stage, but the supplied transcript did not include a final restatement, so no teaching score is reported.

### Cross-repository result

The first four analysis tasks transferred well across two different repositories: an agentic BI system and a Streamlit ML decision-support application.

The main result from the tutoring evaluation is different. Repository analysis can be strong while the learner's final understanding remains incomplete. That is why the teaching outcome is recorded separately from the agent's analysis accuracy.

## Limitations

### 1. Infrastructure and model choice

The current agent depends on **Arena.ai** because the repository-analysis stage is computationally expensive. A full run can take roughly **20–30 minutes**, but the analysis can run without user input, so that latency does not block the learning interaction itself.

I chose Arena partly because the alternative I evaluated, **OpenCode**, had substantially higher latency for the complex reasoning workload required by this agent. The available model path could take up to roughly **3× the Arena runtime** for the same type of task.

In principle, the agent could be hosted directly on a provider such as Claude, GPT, or Mistral. In practice, the free tiers available to this project do not currently support a complete end-to-end run at the required token and reasoning budget.

This creates two constraints:

* **Model selection is not fully controlled.** Arena determines which available model handles the task, so the system depends on Arena resolving the workload to a sufficiently capable model.
* **The current infrastructure is vendor-dependent.** The agent's core behaviour lives in the system prompt and is portable in principle, but the current free execution path is tied to Arena's platform and limits.

A possible future architecture would split the analysis into smaller subtasks using a workflow tool such as n8n and call a free API repeatedly as limits are reached. That would reduce the dependency on a single long reasoning run, but it would also require a significantly more complex orchestration layer and may produce weaker results because the freely available API models are less capable for this workload.

For this project, the strict requirement for a **genuinely free** solution made Arena the most practical tradeoff.

### 2. Evidence does not guarantee correct inference

The agent can still make a technically plausible inference that goes beyond what the cited evidence actually proves.

The prompt now distinguishes between:

* **FACT**
* **SUPPORTED INFERENCE**
* **UNCONFIRMED**

but some inference-boundary errors remain possible.

### 3. No runtime verification

Repo Tutor analyses repository evidence. It does not execute the repository to verify runtime behaviour.

A claim about what the system actually does at runtime therefore remains **UNCONFIRMED** unless the available evidence establishes it.

### 4. Test coverage may be unclear

The agent only treats a testing framework or CI system as present when it is explicitly evidenced.

Otherwise it reports:

```text
NO REPRODUCIBLE TEST COMMAND ESTABLISHED
```

This is deliberate. The agent should not invent a pytest or unittest workflow because one is common for the type of project being inspected.

### 5. Repository write access requires prompt-level protection

Arena's GitHub connector provided read/write capability, so the original read-only assumption was unsafe.

The final prompt explicitly prohibits repository modification, commits, and pushes.

This is a prompt-enforced safety boundary rather than a connector-level permission guarantee.

### 6. Secret handling depends on the agent following the rule

The final configuration requires credentials to be replaced with:

```text
[REDACTED SECRET]
```

The agent should never reproduce passwords, API keys, tokens, or connection strings. Secret protection was a failure during the adversarial audit before this correction was added.

### 7. The tutoring outcome is not always strong

The Socratic mechanism can run correctly while the resulting learning outcome is still weak.

The final recorded restatement scored **3/10**, which is useful evidence about the limits of the current tutor rather than a success condition.

### 8. Arena UI behaviour is platform-dependent

The agent's reasoning display and clickable multiple-choice rendering depend on Arena's interface. The underlying interaction rules are defined by the system prompt, but the presentation is not fully controlled by the agent.

## Current status

**Core agent:** Working

**GitHub connection:** Working

**Evidence grounding:** Working

**Citation discipline:** Working

**Adaptive Socratic loop:** Working

**Write/execution restrictions:** Prompt-enforced

**Final end-to-end run:** Recorded

**Known limitations:** Documented

The current implementation is frozen after the final correction run. The main remaining gap is not whether the agent can analyse and question the user. It is improving the quality of the final teaching outcome while keeping the infrastructure genuinely free and the evidence-grounding rules intact.
