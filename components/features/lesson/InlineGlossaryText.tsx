import { useMemo } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { getGlossaryTerms } from '@/data/glossary';
import {
  splitTextsWithGlossary,
  splitTextWithGlossary,
  type GlossaryMatch,
  type GlossarySegment,
} from '@/lib/glossary';
import { useThemeMode } from '@/theme';

import { getGlossaryTermHighlightStyle } from './glossaryHighlightStyle';
import { useOptionalLessonGlossary } from './LessonGlossaryContext';

type InlineGlossaryTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  /** When true, render only nested spans for use inside a parent Text. */
  nested?: boolean;
  /**
   * Optional precomputed segments (e.g. from a step-wide once-per-term pass).
   * When set, local splitting is skipped.
   */
  segments?: GlossarySegment[];
};

function GlossarySegments({
  segments,
  onShowTerm,
  tapHint,
  highlightStyle,
}: {
  segments: GlossarySegment[];
  onShowTerm: (term: { id: string; label: string; definition: string }) => void;
  tapHint: string;
  highlightStyle: TextStyle;
}) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <Text key={`t-${index}`}>{segment.value}</Text>;
        }

        return (
          <Text
            accessibilityHint={tapHint}
            accessibilityLabel={segment.value}
            accessibilityRole="link"
            key={`g-${segment.match.id}-${index}`}
            onPress={() =>
              onShowTerm({
                id: segment.match.id,
                label: segment.value,
                definition: segment.match.definition,
              })
            }
            style={highlightStyle}>
            {segment.value}
          </Text>
        );
      })}
    </>
  );
}

/**
 * Renders lesson prose with tappable glossary highlights for uncommon AI terms.
 * Each term id is highlighted at most once per text block (first hit wins).
 */
export function InlineGlossaryText({
  text,
  style,
  nested = false,
  segments: presetSegments,
}: InlineGlossaryTextProps) {
  const { tokens, mode, locale, t } = useThemeMode();
  const glossary = useOptionalLessonGlossary();

  const segments = useMemo(() => {
    if (presetSegments) {
      return presetSegments;
    }

    if (!glossary) {
      return [{ type: 'text' as const, value: text }];
    }

    return splitTextWithGlossary(text, getGlossaryTerms(locale), mode);
  }, [glossary, locale, mode, presetSegments, text]);

  if (!glossary) {
    if (nested) {
      return <Text>{text}</Text>;
    }

    return <Text style={style}>{text}</Text>;
  }

  const content = (
    <GlossarySegments
      highlightStyle={getGlossaryTermHighlightStyle(tokens)}
      onShowTerm={glossary.showTerm}
      segments={segments}
      tapHint={t('lesson.glossaryTapHint')}
    />
  );

  if (nested) {
    return content;
  }

  return <Text style={style}>{content}</Text>;
}

type StepGlossaryTextsProps = {
  texts: string[];
  styles: StyleProp<TextStyle>[];
};

/**
 * Step-wide glossary pass: one shared claim set across title/body (and similar).
 * Prevents the same term lighting up in every block on the same step.
 */
export function StepGlossaryTexts({ texts, styles }: StepGlossaryTextsProps) {
  const { tokens, mode, locale, t } = useThemeMode();
  const glossary = useOptionalLessonGlossary();

  const segmentBlocks = useMemo(() => {
    if (!glossary) {
      return texts.map((value) => [{ type: 'text' as const, value }]);
    }

    return splitTextsWithGlossary(texts, getGlossaryTerms(locale), mode);
    // texts joined so a stable content fingerprint drives recomputation
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional content key
  }, [glossary, locale, mode, texts.join('\u0001')]);

  if (!glossary) {
    return (
      <>
        {texts.map((value, index) => (
          <Text key={`plain-${index}`} style={styles[index]}>
            {value}
          </Text>
        ))}
      </>
    );
  }

  return (
    <>
      {segmentBlocks.map((segments, index) => (
        <Text key={`block-${index}`} style={styles[index]}>
          <GlossarySegments
            highlightStyle={getGlossaryTermHighlightStyle(tokens)}
            onShowTerm={glossary.showTerm}
            segments={segments}
            tapHint={t('lesson.glossaryTapHint')}
          />
        </Text>
      ))}
    </>
  );
}

export type { GlossaryMatch, GlossarySegment };
