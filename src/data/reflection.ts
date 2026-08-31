/**
 * Final Reflection (IMPLEMENTATION_PLAN Task 3.2.3, PRODUCT_SPEC §32,
 * DESIGN_SPEC §29).
 *
 * The 500–800 word retrospective is presented as a readable long-form document
 * and must answer the four required questions:
 *   - what you set out to do
 *   - what changed
 *   - what you would build next
 *   - the three most transferable things you learned
 *
 * PLACEHOLDER / EDITABLE DRAFT: the retrospective below is a draft written from
 * the completed assignment copy in this archive so the page and its word-count
 * validation are exercised end-to-end. Replace it with the author's own
 * wording (it must still sit in the 500–800 word range, per the brief). The
 * surrounding UI is already final; only the text below needs swapping.
 */

export interface ReflectionSection {
  /** Stable id used for the section heading anchor. */
  id: string;
  /** Visible heading. */
  heading: string;
  /** Paragraphs of body copy for this section. */
  body: string[];
}

export interface FinalReflection {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ReflectionSection[];
  /** The three most transferable learnings, rendered as a numbered list. */
  learnings: string[];
  /** FL-10 definitive reference; the convergence of both AI Fluency strands. */
  convergenceNote: string;
}

export const finalReflection: FinalReflection = {
  eyebrow: 'Reflection',
  title: 'Final Reflection',
  intro:
    'This is the reflection the FL-10 brief asked for: 500 to 800 words, written for the person I was in Week 1. It is not a summary of the archive; it is an account of what specifically changed in how I work.',
  sections: [
    {
      id: 'set-out',
      heading: 'What I set out to do',
      body: [
        'I started the programme wanting to be able to point at finished things, not to tell people I had tried things. On the Machine Learning side I wanted to take a vague interest in search and turn it into a lane I could defend in a written paper. On the AI Fluency side I wanted a portfolio that existed, a public site that was actually live, and an agent that did a real job rather than a demo.',
        'The first weeks made the job concrete. ML-01 and ML-02 forced me to write down a research question and a decision before I had a model. FL Proving and FL Sitemap did the same thing from the other direction, asking what I was proving and then drawing the path that would prove it. I did not yet know how much of the rest of the programme those framing steps would explain.',
      ],
    },
    {
      id: 'changed',
      heading: 'What changed',
      body: [
        'The biggest change was learning to separate the thing I built from the claim I could honestly make about it. ML-07 and ML-08 made me build a baseline before a model and then compare on the same metric. ML-09 then made me audit that comparison, look for leakage, and rewrite the claim so it said only what the evidence supported. That is not a writing rule; it is a workflow rule.',
        'The prompting and workflow work changed the way I use tools rather than the way I think about them. FL-04 and FL-05 pushed me to treat a pipeline and an agent as things with defined jobs, inputs, and ways to evaluate, and FL-06 wrote the guardrails down so the agent did not drift. By the time I documented it in FL-09, the habit of naming what a tool was for and what it was not for had become automatic.',
        'I also learned to ship early. FL Ship and PF-04 made a blank page live before it was good, and everything after that was added to something real instead of planned in the abstract. FL Crit and FL Break then made me seek out the failure instead of avoiding it.',
        'The two tracks turned out to share more than common vocabulary. Problem framing, evaluation, human judgment, deployment, and communication call from both sides, just with different tools and different artefacts.',
      ],
    },
    {
      id: 'next',
      heading: 'What I would build next',
      body: [
        'I would take the ML lane further in a direction the brief deliberately left open, applying the validation and claim-audit discipline to a live system where the data keeps changing. I would also wire the two strands into a single working habit: one agent, documented and reproducible, that makes the everyday research and writing loop I actually use, not a showcase.',
      ],
    },
    {
      id: 'learnings',
      heading: 'The three most transferable things I learned',
      body: [],
    },
  ],
  learnings: [
    'Define the thing you are trying to prove before you choose the tool. A written claim or question decides more of the outcome than any single library or model choice.',
    'Always have a baseline and a stated metric before you compare anything. Comparison without a reference point produces confidence, not evidence.',
    'Find the failure on purpose. A clearly explained negative result, an honest limit, or a site that breaks when you attack it is worth more than a polished claim you have not tested.',
  ],
  convergenceNote:
    'FL-10 is the point where the Portfolio / Public Work strand and the AI Systems / Agents strand converge into a single final package, and this retrospective is that package in words.',
};
