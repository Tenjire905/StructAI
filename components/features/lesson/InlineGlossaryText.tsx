import { Text, type StyleProp, type TextStyle } from 'react-native';

import { getGlossaryTerms } from '@/data/glossary';
import { findGlossaryMatches, splitTextWithGlossaryMatches } from '@/lib/glossary';
import { useThemeMode } from '@/theme';

import { getGlossaryTermHighlightStyle } from './glossaryHighlightStyle';
import { useOptionalLessonGlossary } from './LessonGlossaryContext';

type InlineGlossaryTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  /** When true, render only nested spans for use inside a parent Text. */
  nested?: boolean;
};

/**
 * Renders lesson prose with tappable glossary highlights for uncommon AI terms.
 * Works in Focus and Playful via theme tokens + mode-aware definitions.
 * Within a GlossaryHighlightPass, each term id is marked at most once (title wins over body).
 */
export function InlineGlossaryText({ text, style, nested = false }: InlineGlossaryTextProps) {
  const { tokens, mode, locale, t } = useThemeMode();
  const glossary = useOptionalLessonGlossary();

  if (!glossary) {
    if (nested) {
      return <Text>{text}</Text>;
    }

    return <Text style={style}>{text}</Text>;
  }

  const matches = findGlossaryMatches(text, getGlossaryTerms(locale), mode).filter((match) =>
    glossary.claimHighlightTerm(match.id),
  );
  const segments = splitTextWithGlossaryMatches(text, matches);

  const content = segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <Text key={`t-${index}`}>{segment.value}</Text>;
    }

    return (
      <Text
        accessibilityHint={t('lesson.glossaryTapHint')}
        accessibilityLabel={segment.value}
        accessibilityRole="link"
        key={`g-${segment.match.id}-${index}`}
        onPress={() =>
          glossary.showTerm({
            id: segment.match.id,
            label: segment.value,
            definition: segment.match.definition,
          })
        }
        style={getGlossaryTermHighlightStyle(tokens)}>
        {segment.value}
      </Text>
    );
  });

  if (nested) {
    return <>{content}</>;
  }

  return <Text style={style}>{content}</Text>;
}
