export const lessonEnCm = {
  "cm-1.s0.body":
    "The context window is the model's working memory: prompt, examples, documents, and previous chat all share the same space. Put the relevant parts first and remove redundancy. Very long inputs can push out earlier instructions.",
  "cm-1.s0.title": "Everything takes up space in the window",
  "cm-1.s1.explanation":
    "With a limited window, all parts compete - prioritization and brevity matter.",
  "cm-1.s1.opt0": "The model automatically becomes faster.",
  "cm-1.s1.opt1": "Earlier instructions or details may lose influence.",
  "cm-1.s1.opt2": "The context window keeps growing without limit.",
  "cm-1.s1.question": "What is most likely to happen with very long context?",
  "cm-1.s2.explanation":
    "Distilled summaries provide signal without unnecessary token volume.",
  "cm-1.s2.opt0": "Repeat the same rule five times.",
  "cm-1.s2.opt1": "Use a compact summary instead of complete raw data.",
  "cm-1.s2.opt2": "Insert all attachments without filtering.",
  "cm-1.s2.question": "Which strategy conserves the context window?",
  "cm-1.title": "Understanding the context window",
  "cm-2.s0.body":
    "A system or role instruction (\"You are an experienced editor...\") calibrates tone, depth, and risk behavior. Roles should fit the task and be specific - not just \"expert\" without a domain.",
  "cm-2.s0.title": "A role sets expectations",
  "cm-2.s1.explanation":
    "Domain, output type, and target audience make the role steerable.",
  "cm-2.s1.opt0": "You are very intelligent.",
  "cm-2.s1.opt1":
    "You are a technical writer for DevOps tools; target audience: junior developers.",
  "cm-2.s1.opt2": "Behave professionally.",
  "cm-2.s1.question": "Which role instruction is the most useful?",
  "cm-2.s2.explanation":
    "Roles guide style and depth - they do not replace fact-checking.",
  "cm-2.s2.opt0": "To keep tone and technical depth consistent.",
  "cm-2.s2.opt1": "To invent mathematical facts you do not verify.",
  "cm-2.s2.opt2": "To frame the answer format and perspective.",
  "cm-2.s2.question": "What do you not need roles for?",
  "cm-2.title": "Assigning roles",
  "cm-3.s0.body":
    "Embed background knowledge as a compact block: product facts, target audience, and project constraints. Mark what is fixed (\"Given:\") versus what may be researched. Too much irrelevant context dilutes the task.",
  "cm-3.s0.title": "Include only relevant knowledge",
  "cm-3.s1.explanation":
    "Separate \"Given\" blocks make facts easy for the model to find.",
  "cm-3.s1.opt0":
    "Scatter it unstructured between the task and the greeting.",
  "cm-3.s1.opt1": "A \"Given:\" section with bullet points, then \"Task:\".",
  "cm-3.s1.opt2": "Mention it only implicitly and hope.",
  "cm-3.s1.question": "What is the cleanest way to embed project knowledge?",
  "cm-3.s2.explanation":
    "Unverified speculation presented as \"Given\" creates hallucinations with an air of authority.",
  "cm-3.s2.opt0": "Confirmed product facts for the text.",
  "cm-3.s2.opt1":
    "Speculation you have not yet verified yourself, presented as facts.",
  "cm-3.s2.opt2": "Target audience and tone guidelines.",
  "cm-3.s2.question": "What does NOT belong in the required context?",
  "cm-3.title": "Embedding background knowledge",
  "cm-4.s0.body":
    "Define style through concrete characteristics: sentence length, informal or formal address, technical level, and allowed rhetoric. A mini example sentence in the target tone is often more effective than \"write casually.\" Do not contradict the tone with examples in a different style.",
  "cm-4.s0.title": "Tone is more than \"friendly\"",
  "cm-4.s1.explanation":
    "Measurable style features are reproducible - vague adjectives are not.",
  "cm-4.s1.instruction": "Put the steps for precise style instructions in a sensible order.",
  "cm-4.s1.item0": "Define measurable traits (sentence length, address form, technical level)",
  "cm-4.s1.item1": "Replace vague adjectives with concrete rules",
  "cm-4.s1.item2": "Add a mini example sentence in the target tone",
  "cm-4.s1.item3": "Remove conflicting examples in a different style",
  "cm-4.s1.opt0": "Please phrase it nicely.",
  "cm-4.s1.opt1":
    "Use formal address, matter-of-fact tone, max. 20 words per sentence, no metaphors.",
  "cm-4.s1.opt2": "Modern and fresh.",
  "cm-4.s1.question": "Which style instruction is the most precise?",
  "cm-4.s2.explanation":
    "Examples are strong signals - they must match the desired style.",
  "cm-4.s2.opt0": "The model always ignores examples.",
  "cm-4.s2.opt1":
    "The example can override the tone - adapt or remove the example.",
  "cm-4.s2.opt2": "More caps lock in the rules helps.",
  "cm-4.s2.question":
    "You want a factual tone, but you provide a casual example. What happens?",
  "cm-4.title": "Controlling tone and style",
  "cm-5.s0.body":
    "A persona combines role, target audience, taboos, and response patterns. It is useful for recurring tasks (support, coaching, review). Keep personas short and internally consistent - too many traits dilute the profile.",
  "cm-5.s0.title": "Persona = role plus behavioral rules",
  "cm-5.s1.explanation":
    "Personas bundle role, boundaries, and typical response patterns for consistency.",
  "cm-5.s1.opt0":
    "Personas include multiple behavior rules and boundaries for repeatable scenarios.",
  "cm-5.s1.opt1": "Personas only work in ChatGPT.",
  "cm-5.s1.opt2": "There is no difference.",
  "cm-5.s1.question":
    "What distinguishes a persona from a one-line role?",
  "cm-5.s2.explanation":
    "Domain, focus, taboo, and output format make the persona operational.",
  "cm-5.s2.opt0": "You are nice and helpful.",
  "cm-5.s2.opt1":
    "Senior dev, focus: readability and tests, no rewrites without justification, bullet-point feedback.",
  "cm-5.s2.opt2": "You like clean code.",
  "cm-5.s2.question": "Which persona is clearest for code review?",
  "cm-5.title": "Persona techniques",
  "cm-6.s0.body":
    "Context overload comes from irrelevant attachments, duplicate information, and contradictory sources. Filter before the prompt: What does the model need to know to solve the task? Everything else is noise.",
  "cm-6.s0.title": "More context does not mean a better answer",
  "cm-6.s1.explanation":
    "Curation and an explicit fact list provide signal without noise.",
  "cm-6.s1.opt0": "Attach all emails from the year \"just in case.\"",
  "cm-6.s1.opt1":
    "Curated excerpts plus an explicit list of authoritative facts.",
  "cm-6.s1.opt2": "Duplicate the prompt so nothing gets lost.",
  "cm-6.s1.question": "Which approach reduces context overload?",
  "cm-6.s2.explanation":
    "Contradictory context without resolution produces random answers.",
  "cm-6.s2.opt0": "Insert both without comment.",
  "cm-6.s2.opt1":
    "State the priority or mark one source as authoritative.",
  "cm-6.s2.opt2": "The model should just guess.",
  "cm-6.s2.question": "Two sources contradict each other. What should you do?",
  "cm-6.title": "Avoid context overload",
  "cm-7.s0.body":
    "Combine compact required context, a fitting role or persona, clear style instructions, and avoid overload. The prompt should remain readable: each paragraph has a job.",
  "cm-7.s0.title": "Using context masterfully",
  "cm-7.s1.explanation":
    "Distilled context, role, and a clear task - without flooding the window.",
  "cm-7.s1.opt0": "Here is a 40-page PDF; summarize something.",
  "cm-7.s1.opt1":
    "Role + 5 \"Given\" bullets + task + style + max length, PDF only as a 10-line summary.",
  "cm-7.s1.opt2": "Summarize it; you know what is important.",
  "cm-7.s1.question": "Which prompt demonstrates context mastery?",
  "cm-7.s2.explanation":
    "Relevance and consistency are the quality gates for context prompts.",
  "cm-7.s2.opt0": "Is every context block relevant and consistent?",
  "cm-7.s2.opt1": "Is the prompt at least twice as long as the task?",
  "cm-7.s2.opt2": "Are at least three roles set at the same time?",
  "cm-7.s2.question": "Final check before sending?",
  "cm-7.title": "Capstone project",
} as const;
