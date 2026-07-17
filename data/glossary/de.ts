import type { GlossaryTerm } from '@/lib/glossary';

/** Core AI / prompting terms for DE lessons (Focus + Playful aliases). */
export const GLOSSARY_DE: GlossaryTerm[] = [
  {
    id: 'prompt',
    aliases: ['Prompt', 'Prompts', 'Prompting', 'Prompt-Schreiben'],
    definition: {
      focus:
        'Eine Anweisung oder Frage an die KI. Je klarer der Prompt, desto gezielter die Antwort.',
      playful:
        'Das, was du der KI sagst oder schreibst — wie eine Aufgabe oder Frage an sie.',
    },
  },
  {
    id: 'context-window',
    aliases: ['Kontextfenster', 'Gedächtnis der KI', 'Kontext-Overload'],
    definition: {
      focus:
        'Der begrenzte Platz, den die KI gleichzeitig „im Kopf“ behalten kann: Prompt, Beispiele und Dokumente teilen sich denselben Raum.',
      playful:
        'Das Kurzzeitgedächtnis der KI — alles Wichtige muss reinpassen, sonst fällt Altes raus.',
    },
  },
  {
    id: 'hallucination',
    aliases: ['Halluzinationen', 'Halluzination', 'erfundene Fakten', 'erfundene Fakt'],
    definition: {
      focus:
        'Wenn die KI etwas Erfundenes selbstbewusst als Fakt darstellt — ohne es aus dem Kontext ableiten zu können.',
      playful:
        'Wenn die KI so tut, als wüsste sie etwas — obwohl sie es sich nur ausgedacht hat.',
    },
  },
  {
    id: 'token',
    aliases: ['Token-Volumen', 'Token', 'Tokens', 'Textmenge'],
    definition: {
      focus:
        'Kleine Textstücke, in denen die KI Sprache misst. Mehr Tokens = mehr Platz im Kontextfenster und oft höhere Kosten.',
      playful:
        'So zählt die KI Text — je mehr Text, desto voller ihr Gedächtnis.',
    },
  },
  {
    id: 'model',
    aliases: ['Sprachmodell', 'Sprachmodelle', 'Modell', 'Modelle'],
    definition: {
      focus:
        'Das KI-System, das Text versteht und erzeugt (z. B. ein großes Sprachmodell / LLM).',
      playful: 'Die KI hinter den Antworten — das „Gehirn“, mit dem du sprichst.',
    },
  },
  {
    id: 'grounding',
    aliases: ['Grounding', 'grounded'],
    definition: {
      focus:
        'Die KI soll nur aus bereitgestelltem Material antworten und Lücken klar benennen statt zu raten.',
      playful:
        'Regel: Nur aus dem Text antworten, den du mitgibst — und „weiß ich nicht“ sagen, wenn etwas fehlt.',
    },
  },
  {
    id: 'few-shot',
    aliases: ['Few-shot', 'Few-Shot', 'Beispiel-Trick'],
    definition: {
      focus:
        'Dem Prompt ein oder mehrere Beispiele beilegen, damit die KI Format und Stil nachahmen kann.',
      playful:
        'Du zeigst der KI ein Beispiel — dann macht sie es ähnlich weiter.',
    },
  },
  {
    id: 'constraint',
    aliases: ['Constraints', 'Constraint', 'Grenzen'],
    definition: {
      focus:
        'Feste Regeln im Prompt (Länge, Format, Verbotenes), die die Ausgabe einschränken.',
      playful: 'Klare Grenzen für die KI: was sie darf und was nicht.',
    },
  },
  {
    id: 'output',
    aliases: ['Output', 'Ausgabe'],
    definition: {
      focus: 'Das Ergebnis, das die KI nach dem Prompt zurückgibt.',
      playful: 'Die Antwort der KI — das, was sie dir zurückschreibt.',
    },
  },
  {
    id: 'input',
    aliases: ['Input', 'Eingabe'],
    definition: {
      focus: 'Alles, was du der KI gibst: Prompt, Kontext, Beispiele, Dateien.',
      playful: 'Alles, was du der KI schickst, bevor sie antwortet.',
    },
  },
  {
    id: 'persona',
    aliases: ['Persona', 'Rolle'],
    definition: {
      focus:
        'Eine festgelegte Rolle oder Haltung, in der die KI antworten soll (z. B. Lehrer, Coach).',
      playful: 'Du sagst der KI, „wer“ sie sein soll — z. B. wie ein Lehrer.',
    },
  },
  {
    id: 'distractor',
    aliases: ['Distraktoren', 'Distraktor', 'falsche Antworten'],
    definition: {
      focus: 'Falsche Antwortoptionen in Übungen, die vom Richtigen ablenken sollen.',
      playful: 'Antworten, die falsch sind — damit du genau hinschauen musst.',
    },
  },
  {
    id: 'json',
    aliases: ['JSON'],
    definition: {
      focus:
        'Ein strukturiertes Textformat (Schlüssel–Werte), das Maschinen und Menschen lesen können.',
      playful: 'Eine ordentliche Text-Kiste mit klaren Feldern — gut für die KI zum Ausfüllen.',
    },
  },
  {
    id: 'primacy-recency',
    aliases: ['Primacy', 'Recency'],
    definition: {
      focus:
        'Anfang (Primacy) und Ende (Recency) eines langen Prompts werden oft stärker beachtet als die Mitte.',
      playful:
        'Die KI merkt sich Anfang und Ende besonders gut — die Mitte weniger.',
    },
  },
  {
    id: 'temperature',
    aliases: ['Temperature', 'Temperatur'],
    definition: {
      focus:
        'Einstellung, wie „kreativ“ bzw. zufällig die KI antwortet. Niedrig = vorhersehbarer, hoch = freier.',
      playful:
        'Wie wild die KI antworten darf: niedrig = brav und gleich, hoch = überraschender.',
    },
  },
  {
    id: 'llm',
    aliases: ['LLM', 'LLMs'],
    definition: {
      focus: 'Large Language Model — großes Sprachmodell, das Text versteht und erzeugt.',
      playful: 'Eine große KI, die Texte lesen und schreiben kann.',
    },
  },
  {
    id: 'chain-of-thought',
    aliases: ['Chain-of-Thought', 'Chain of Thought', 'Gedankenkette'],
    definition: {
      focus:
        'Die KI Schritt für Schritt denken lassen, bevor sie zur Antwort kommt — oft genauer bei komplexen Aufgaben.',
      playful:
        'Die KI soll erst laut nachdenken (Schritt für Schritt), dann antworten.',
    },
  },
  {
    id: 'rag',
    aliases: ['RAG'],
    definition: {
      focus:
        'Retrieval-Augmented Generation: die KI holt passende Dokumente und antwortet damit grounded.',
      playful:
        'Die KI sucht erst in deinen Unterlagen und antwortet dann daraus.',
    },
  },
  {
    id: 'embedding',
    aliases: ['Embedding', 'Embeddings'],
    definition: {
      focus:
        'Zahlen-Darstellung von Text, mit der Ähnlichkeit und Suche möglich werden.',
      playful:
        'So verwandelt die KI Text in Zahlen, um Ähnliches wiederzufinden.',
    },
  },
  {
    id: 'api',
    aliases: ['API', 'APIs'],
    definition: {
      focus:
        'Schnittstelle, über die Programme (z. B. Apps) mit einer KI oder einem Dienst sprechen.',
      playful: 'Die Tür, durch die Apps mit der KI reden.',
    },
  },
];
