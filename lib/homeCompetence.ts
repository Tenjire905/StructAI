import { getMockLesson } from '@/data/mockLessons';
import { buildLessonSkillSummary, type LessonSkillSummary } from '@/lib/lessonSkillSummary';
import type { PathProgressRecord, PersistedSkillSummary } from '@/lib/progressTypes';
import type { Locale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

function toLessonSkillSummary(record: PersistedSkillSummary): LessonSkillSummary {
  return {
    practiced: record.practiced,
    improved: record.improved,
    missed: record.missed,
  };
}

/**
 * Home competence signal: prefer last session summary, else derive practiced
 * tags from the most recently completed lessons (no improved/missed without answers).
 */
export function resolveHomeCompetence(
  lastSkillSummary: PersistedSkillSummary | null | undefined,
  pathProgress: Record<string, PathProgressRecord>,
  locale: Locale,
  mode: ThemeMode,
): LessonSkillSummary | null {
  if (lastSkillSummary && lastSkillSummary.practiced.length > 0) {
    return toLessonSkillSummary(lastSkillSummary);
  }

  const recentLessonIds = Object.values(pathProgress)
    .flatMap((record) => [...record.completedLessonIds].reverse())
    .slice(0, 4);

  const seen = new Set<string>();
  const practiced: LessonSkillSummary['practiced'] = [];

  for (const lessonId of recentLessonIds) {
    const lesson = getMockLesson(lessonId, locale, mode);

    if (!lesson) {
      continue;
    }

    const summary = buildLessonSkillSummary(lesson, [], locale, mode, 3);

    if (!summary) {
      continue;
    }

    for (const tag of summary.practiced) {
      if (seen.has(tag.id) || practiced.length >= 3) {
        continue;
      }

      seen.add(tag.id);
      practiced.push(tag);
    }

    if (practiced.length >= 3) {
      break;
    }
  }

  if (practiced.length === 0) {
    return null;
  }

  return {
    practiced,
    improved: [],
    missed: [],
  };
}
