import type { GlossaryTerm } from '@/lib/glossary';

export const GLOSSARY_EN: GlossaryTerm[] = [
  {
    id: 'prompt',
    aliases: ['Prompt', 'Prompts', 'Prompting'],
    definition: {
      focus: 'An instruction or question you give the AI. Clearer prompts yield more useful answers.',
      playful: 'What you tell the AI — like a task or question for it.',
    },
  },
  {
    id: 'context-window',
    aliases: ['context window', 'AI memory', 'context overload'],
    definition: {
      focus:
        'The limited space the AI can hold at once: prompt, examples, and documents share the same budget.',
      playful: 'The AI’s short-term memory — important stuff must fit or older bits drop out.',
    },
  },
  {
    id: 'hallucination',
    aliases: ['hallucinations', 'hallucination', 'made-up facts', 'made-up fact'],
    definition: {
      focus: 'When the AI invents information and presents it confidently as fact.',
      playful: 'When the AI pretends it knows something it actually made up.',
    },
  },
  {
    id: 'token',
    aliases: ['token volume', 'tokens', 'token'],
    definition: {
      focus: 'Small text units the AI uses to measure length. More tokens use more context and cost.',
      playful: 'How the AI counts text — more text fills its memory faster.',
    },
  },
  {
    id: 'model',
    aliases: ['language model', 'language models', 'model', 'models'],
    definition: {
      focus: 'The AI system that understands and generates text (e.g. a large language model).',
      playful: 'The AI behind the answers — the “brain” you’re talking to.',
    },
  },
  {
    id: 'grounding',
    aliases: ['Grounding', 'grounded'],
    definition: {
      focus: 'Require answers only from provided material and say when something is missing.',
      playful: 'Rule: answer only from the text you give — and say “not sure” if something’s missing.',
    },
  },
  {
    id: 'few-shot',
    aliases: ['Few-shot', 'Few-Shot'],
    definition: {
      focus: 'Include one or more examples in the prompt so the AI can mirror format and style.',
      playful: 'You show the AI an example — then it continues in a similar way.',
    },
  },
  {
    id: 'constraint',
    aliases: ['Constraints', 'Constraint'],
    definition: {
      focus: 'Hard rules in the prompt (length, format, bans) that shape the output.',
      playful: 'Clear limits for the AI: what it may and may not do.',
    },
  },
  {
    id: 'output',
    aliases: ['Output', 'output'],
    definition: {
      focus: 'The result the AI returns after your prompt.',
      playful: 'The AI’s answer — what it writes back to you.',
    },
  },
  {
    id: 'input',
    aliases: ['Input', 'input'],
    definition: {
      focus: 'Everything you give the AI: prompt, context, examples, files.',
      playful: 'Everything you send the AI before it replies.',
    },
  },
  {
    id: 'persona',
    aliases: ['Persona', 'persona'],
    definition: {
      focus: 'A fixed role or stance the AI should answer in (e.g. teacher, coach).',
      playful: 'You tell the AI “who” to be — like a teacher.',
    },
  },
  {
    id: 'distractor',
    aliases: ['distractors', 'distractor', 'wrong answers'],
    definition: {
      focus: 'Incorrect options in exercises meant to pull attention away from the right answer.',
      playful: 'Wrong answers — so you have to look carefully.',
    },
  },
  {
    id: 'json',
    aliases: ['JSON'],
    definition: {
      focus: 'A structured text format of keys and values that machines and people can read.',
      playful: 'A neat text box with clear fields — great for the AI to fill in.',
    },
  },
  {
    id: 'primacy-recency',
    aliases: ['Primacy', 'Recency'],
    definition: {
      focus: 'Start and end of a long prompt are often noticed more than the middle.',
      playful: 'The AI remembers the start and end best — the middle less so.',
    },
  },
  {
    id: 'temperature',
    aliases: ['Temperature', 'temperature'],
    definition: {
      focus: 'How creative or random the AI is. Low = more predictable; high = freer.',
      playful: 'How wild the AI may answer: low = steady, high = more surprising.',
    },
  },
  {
    id: 'llm',
    aliases: ['LLM', 'LLMs'],
    definition: {
      focus: 'Large Language Model — a big model that understands and generates text.',
      playful: 'A big AI that can read and write text.',
    },
  },
  {
    id: 'chain-of-thought',
    aliases: ['Chain-of-Thought', 'Chain of Thought'],
    definition: {
      focus: 'Ask the AI to reason step by step before answering — often better on hard tasks.',
      playful: 'The AI thinks out loud step by step, then answers.',
    },
  },
  {
    id: 'rag',
    aliases: ['RAG'],
    definition: {
      focus: 'Retrieval-Augmented Generation: fetch relevant docs, then answer from them.',
      playful: 'The AI searches your files first, then answers from them.',
    },
  },
  {
    id: 'embedding',
    aliases: ['Embedding', 'Embeddings'],
    definition: {
      focus: 'Numeric representation of text used for similarity and search.',
      playful: 'How the AI turns text into numbers to find similar things.',
    },
  },
  {
    id: 'api',
    aliases: ['API', 'APIs'],
    definition: {
      focus: 'An interface apps use to talk to an AI or other service.',
      playful: 'The door apps use to talk to the AI.',
    },
  },
];
