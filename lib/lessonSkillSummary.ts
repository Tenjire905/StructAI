import { getGlossaryTerms } from '@/data/glossary';
import type { ResolvedLesson, ResolvedLessonStep } from '@/data/mockLessons';
import { findGlossaryMatches } from '@/lib/glossary';
import type { LessonAnswerResult } from '@/lib/lessonRewards';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

export type LessonSkillTag = {
  id: string;
  term: string;
};

export type LessonSkillSummary = {
  practiced: LessonSkillTag[];
  improved: LessonSkillTag[];
  missed: LessonSkillTag[];
};

/** Ultra-generic glossary ids — keep out of the skill card unless nothing else matches. */
const GENERIC_SKILL_IDS = new Set([
  'prompt',
  'input',
  'output',
  'model',
  'llm',
  'api',
  'distractor',
]);

function collectStepTexts(step: ResolvedLessonStep): string[] {
  switch (step.type) {
    case 'info':
      return [step.title, step.body];
    case 'choice':
      return [step.question, ...step.options, step.explanation];
    case 'fill_blank':
      return [step.prefix, step.suffix, ...step.options, step.explanation];
    case 'true_false':
      return [step.statement, step.explanation];
    case 'reorder':
      return [step.instruction, ...step.items, step.explanation];
    case 'matching':
      return [
        step.instruction,
        ...step.pairs.flatMap((pair) => [pair.term, pair.definition]),
        step.explanation,
      ];
    case 'error_finding':
      return [
        step.instruction,
        ...step.textSegments.map((segment) => segment.text),
        step.explanation,
      ];
    case 'categorize':
      return [
        step.instruction,
        ...step.categories,
        ...step.items.map((item) => item.text),
        step.explanation,
      ];
  }
}

function uniqueTags(tags: LessonSkillTag[]): LessonSkillTag[] {
  const seen = new Set<string>();
  const result: LessonSkillTag[] = [];

  for (const tag of tags) {
    if (seen.has(tag.id)) {
      continue;
    }

    seen.add(tag.id);
    result.push(tag);
  }

  return result;
}

function preferSpecific(tags: LessonSkillTag[]): LessonSkillTag[] {
  const specific = tags.filter((tag) => !GENERIC_SKILL_IDS.has(tag.id));
  return specific.length > 0 ? specific : tags;
}

/**
 * Builds an end-of-lesson skill summary from glossary hits in the lesson
 * plus correct/incorrect outcomes per graded step.
 */
export function buildLessonSkillSummary(
  lesson: ResolvedLesson,
  results: LessonAnswerResult[],
  locale: Locale,
  mode: ThemeMode,
  maxPracticed = 3,
): LessonSkillSummary | null {
  const terms = getGlossaryTerms(locale);
  const counts = new Map<string, { term: string; count: number }>();

  const bump = (id: string, term: string, weight = 1) => {
    const existing = counts.get(id);
    if (existing) {
      existing.count += weight;
      return;
    }

    counts.set(id, { term, count: weight });
  };

  const scanText = (text: string, weight = 1) => {
    for (const match of findGlossaryMatches(text, terms, mode)) {
      bump(match.id, match.alias, weight);
    }
  };

  scanText(lesson.title, 2);

  for (const step of lesson.steps) {
    for (const text of collectStepTexts(step)) {
      scanText(text, 1);
    }
  }

  const resultByStep = new Map(results.map((result) => [result.stepIndex, result]));
  const improved: LessonSkillTag[] = [];
  const missed: LessonSkillTag[] = [];

  lesson.steps.forEach((step, stepIndex) => {
    if (step.type === 'info') {
      return;
    }

    const result = resultByStep.get(stepIndex);
    if (!result) {
      return;
    }

    const stepMatches = findGlossaryMatches(
      collectStepTexts(step).join('\n'),
      terms,
      mode,
    );
    const tags = uniqueTags(
      preferSpecific(
        stepMatches.map((match) => ({
          id: match.id,
          term: match.alias,
        })),
      ),
    ).slice(0, 2);

    for (const tag of tags) {
      if (result.correct) {
        improved.push(tag);
      } else {
        missed.push(tag);
      }
    }
  });

  const practiced = preferSpecific(
    [...counts.entries()]
      .sort((left, right) => right[1].count - left[1].count)
      .map(([id, value]) => ({ id, term: value.term })),
  ).slice(0, maxPracticed);

  if (practiced.length === 0) {
    return null;
  }

  return {
    practiced,
    improved: uniqueTags(preferSpecific(improved)).slice(0, 2),
    missed: uniqueTags(preferSpecific(missed)).slice(0, 2),
  };
}
