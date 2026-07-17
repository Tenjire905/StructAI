import type { GlossaryTerm } from '@/lib/glossary';

export const GLOSSARY_FR: GlossaryTerm[] = [
  {
    id: 'prompt',
    aliases: ['Prompt', 'Prompts', 'Prompting'],
    definition: {
      focus: 'Une instruction ou question donnée à l’IA. Plus elle est claire, meilleure est la réponse.',
      playful: 'Ce que tu dis à l’IA — comme une consigne ou une question.',
    },
  },
  {
    id: 'context-window',
    aliases: ['fenêtre de contexte', 'mémoire de l\'IA', 'contexte'],
    definition: {
      focus:
        'L’espace limité que l’IA peut garder en même temps : prompt, exemples et documents partagent le même budget.',
      playful: 'La mémoire courte de l’IA — l’essentiel doit y tenir.',
    },
  },
  {
    id: 'hallucination',
    aliases: ['hallucinations', 'hallucination', 'faits inventés'],
    definition: {
      focus: 'Quand l’IA invente une information et la présente comme un fait.',
      playful: 'Quand l’IA invente quelque chose et le dit avec assurance.',
    },
  },
  {
    id: 'token',
    aliases: ['tokens', 'token'],
    definition: {
      focus: 'Petites unités de texte utilisées pour mesurer la longueur et le coût.',
      playful: 'La façon dont l’IA compte le texte.',
    },
  },
  {
    id: 'model',
    aliases: ['modèle de langage', 'modèle', 'modèles'],
    definition: {
      focus: 'Le système d’IA qui comprend et produit du texte.',
      playful: 'L’IA derrière les réponses.',
    },
  },
  {
    id: 'grounding',
    aliases: ['Grounding', 'grounded'],
    definition: {
      focus: 'Répondre seulement à partir du matériel fourni et signaler les manques.',
      playful: 'Règle : répondre seulement avec le texte fourni.',
    },
  },
  {
    id: 'few-shot',
    aliases: ['Few-shot', 'Few-Shot'],
    definition: {
      focus: 'Ajouter un ou plusieurs exemples au prompt pour guider le format.',
      playful: 'Tu montres un exemple à l’IA, puis elle continue pareil.',
    },
  },
  {
    id: 'constraint',
    aliases: ['Constraints', 'Constraint', 'contraintes', 'contrainte'],
    definition: {
      focus: 'Règles strictes du prompt (longueur, format, interdits).',
      playful: 'Des limites claires pour l’IA.',
    },
  },
  {
    id: 'output',
    aliases: ['Output', 'sortie'],
    definition: {
      focus: 'Le résultat renvoyé par l’IA.',
      playful: 'La réponse de l’IA.',
    },
  },
  {
    id: 'input',
    aliases: ['Input', 'entrée'],
    definition: {
      focus: 'Tout ce que tu donnes à l’IA avant la réponse.',
      playful: 'Ce que tu envoies à l’IA.',
    },
  },
  {
    id: 'persona',
    aliases: ['Persona', 'rôle'],
    definition: {
      focus: 'Le rôle dans lequel l’IA doit répondre.',
      playful: 'Tu dis à l’IA « qui » elle doit être.',
    },
  },
  {
    id: 'json',
    aliases: ['JSON'],
    definition: {
      focus: 'Format texte structuré (clés–valeurs).',
      playful: 'Une boîte de texte bien rangée avec des champs clairs.',
    },
  },
  {
    id: 'llm',
    aliases: ['LLM', 'LLMs'],
    definition: {
      focus: 'Large Language Model — grand modèle de langage.',
      playful: 'Une grande IA qui lit et écrit du texte.',
    },
  },
  {
    id: 'api',
    aliases: ['API', 'APIs'],
    definition: {
      focus: 'Interface pour qu’une app parle à l’IA ou à un service.',
      playful: 'La porte par laquelle les apps parlent à l’IA.',
    },
  },
];
