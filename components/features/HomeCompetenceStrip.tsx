import { LessonSkillCard } from '@/components/features/lesson/LessonSkillCard';
import type { LessonSkillSummary } from '@/lib/lessonSkillSummary';

type HomeCompetenceStripProps = {
  summary: LessonSkillSummary;
};

/**
 * Home competence recast — same Skill Card signal as lesson end,
 * framed as “what you’re getting better at” rather than orbs.
 */
export function HomeCompetenceStrip({ summary }: HomeCompetenceStripProps) {
  return <LessonSkillCard summary={summary} titleKey="home.competence.title" />;
}
