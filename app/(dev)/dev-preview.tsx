import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import {
  OrbCompanion,
  OrbCounter,
  PathCard,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { CategorizeStepView, ErrorFindingStepView, MatchingStepView } from '@/components/features/lesson-steps';
import { Avatar, Badge, Button, Card, ProgressBar } from '@/components/ui';
import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import type {
  ResolvedCategorizeStep,
  ResolvedErrorFindingStep,
  ResolvedMatchingStep,
} from '@/data/mockLessons';
import { ThemeModeScope, useThemeMode, type ThemeMode } from '@/theme';

const MATCHING_PREVIEW_STEP: ResolvedMatchingStep = {
  type: 'matching',
  instruction: 'Ordne jeden Begriff der richtigen Definition zu.',
  pairs: [
    { term: 'Prompt', definition: 'Eingabe an ein KI-Modell' },
    { term: 'Token', definition: 'Kleinste Texteinheit' },
    { term: 'Kontext', definition: 'Vorheriger Gesprächsverlauf' },
    { term: 'Halluzination', definition: 'Erfundene Modell-Antwort' },
  ],
  definitionOrder: [2, 0, 3, 1],
  explanation: 'Jeder Begriff hat genau eine passende Definition.',
};

const ERROR_FINDING_PREVIEW_STEP: ResolvedErrorFindingStep = {
  type: 'error_finding',
  instruction: 'Finde das Wort, das diesen Prompt unnötig vage macht.',
  textSegments: [
    { text: 'Schreibe ', isError: false },
    { text: 'irgendwie ', isError: true },
    { text: 'einen ', isError: false },
    { text: 'guten ', isError: false },
    { text: 'Prompt ', isError: false },
    { text: 'über ', isError: false },
    { text: 'KI.', isError: false },
  ],
  explanation: 'Vage Wörter wie „irgendwie“ liefern keine klare Anweisung.',
};

const CATEGORIZE_PREVIEW_STEP: ResolvedCategorizeStep = {
  type: 'categorize',
  instruction: 'Ordne jedes Element der richtigen Prompt-Kategorie zu.',
  categories: ['Ziel', 'Format', 'Kontext'],
  items: [
    { text: 'Zielgruppe nennen', correctCategoryIndex: 0 },
    { text: 'Max. 120 Wörter', correctCategoryIndex: 1 },
    { text: 'Vorherige Antwort', correctCategoryIndex: 2 },
    { text: 'Hauptaufgabe definieren', correctCategoryIndex: 0 },
    { text: 'Als Bulletpoints', correctCategoryIndex: 1 },
  ],
  explanation: 'Ziel, Format und Kontext sollten klar getrennt formuliert sein.',
};

const COMPANION_STATES: OrbCompanionState[] = [
  'idle',
  'attentive',
  'happy',
  'low_energy',
  'celebrating',
  'sleepy',
];

function MatchingStepPreviewPanel({ testId }: { testId: string }) {
  const { tokens } = useThemeMode();

  return (
    <View
      nativeID={testId}
      style={{
        backgroundColor: tokens.colors.background.base,
        gap: tokens.spacing.space2,
        padding: tokens.spacing.space3,
      }}
      testID={testId}>
      <MatchingStepView
        isChecked={false}
        matches={{ 0: 1, 2: 0 }}
        onSelectDefinition={() => undefined}
        onSelectTerm={() => undefined}
        selectedTermIndex={3}
        step={MATCHING_PREVIEW_STEP}
      />
    </View>
  );
}

function MatchingStepDevSection() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        MatchingStepView
      </Text>
      <ThemeModeScope mode="playful">
        <MatchingStepPreviewPanel testId="matching-preview-playful" />
      </ThemeModeScope>
      <ThemeModeScope mode="focus">
        <MatchingStepPreviewPanel testId="matching-preview-focus" />
      </ThemeModeScope>
    </View>
  );
}

function ErrorFindingStepPreviewPanel({ testId }: { testId: string }) {
  const { tokens } = useThemeMode();

  return (
    <View
      nativeID={testId}
      style={{
        backgroundColor: tokens.colors.background.base,
        gap: tokens.spacing.space2,
        padding: tokens.spacing.space3,
      }}
      testID={testId}>
      <ErrorFindingStepView
        isChecked={false}
        onSelectSegment={() => undefined}
        selectedIndex={null}
        step={ERROR_FINDING_PREVIEW_STEP}
        wrongIndices={[1]}
      />
    </View>
  );
}

function ErrorFindingStepDevSection() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        ErrorFindingStepView
      </Text>
      <ThemeModeScope mode="playful">
        <ErrorFindingStepPreviewPanel testId="error-finding-preview-playful" />
      </ThemeModeScope>
      <ThemeModeScope mode="focus">
        <ErrorFindingStepPreviewPanel testId="error-finding-preview-focus" />
      </ThemeModeScope>
    </View>
  );
}

function ErrorFindingOnlyPreview({ mode }: { mode: ThemeMode }) {
  const { tokens } = useThemeMode();
  const testId =
    mode === 'focus' ? 'error-finding-preview-focus' : 'error-finding-preview-playful';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tokens.spacing.screenPadding,
        paddingBottom: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <ErrorFindingStepPreviewPanel testId={testId} />
    </ScrollView>
  );
}

function CategorizeStepPreviewPanel({ testId }: { testId: string }) {
  const { tokens } = useThemeMode();

  return (
    <View
      nativeID={testId}
      style={{
        backgroundColor: tokens.colors.background.base,
        gap: tokens.spacing.space2,
        padding: tokens.spacing.space3,
      }}
      testID={testId}>
      <CategorizeStepView
        assignments={{ 0: 0, 3: 0, 1: 1 }}
        isChecked={false}
        onSelectCategory={() => undefined}
        onSelectItem={() => undefined}
        selectedItemIndex={2}
        step={CATEGORIZE_PREVIEW_STEP}
      />
    </View>
  );
}

function CategorizeStepDevSection() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        CategorizeStepView
      </Text>
      <ThemeModeScope mode="playful">
        <CategorizeStepPreviewPanel testId="categorize-preview-playful" />
      </ThemeModeScope>
      <ThemeModeScope mode="focus">
        <CategorizeStepPreviewPanel testId="categorize-preview-focus" />
      </ThemeModeScope>
    </View>
  );
}

function CategorizeOnlyPreview({ mode }: { mode: ThemeMode }) {
  const { tokens } = useThemeMode();
  const testId = mode === 'focus' ? 'categorize-preview-focus' : 'categorize-preview-playful';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tokens.spacing.screenPadding,
        paddingBottom: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <CategorizeStepPreviewPanel testId={testId} />
    </ScrollView>
  );
}

function parseMode(value: string | string[] | undefined): ThemeMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'focus' ? 'focus' : 'playful';
}

function MatchingOnlyPreview({ mode }: { mode: ThemeMode }) {
  const { tokens } = useThemeMode();
  const testId = mode === 'focus' ? 'matching-preview-focus' : 'matching-preview-playful';

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tokens.spacing.screenPadding,
        paddingBottom: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <MatchingStepPreviewPanel testId={testId} />
    </ScrollView>
  );
}
function CompanionStatesPreview() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space2 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space3 }}>
        {COMPANION_STATES.map((state) => (
          <View
            key={state}
            style={{
              alignItems: 'center',
              gap: tokens.spacing.space1,
              minWidth: 72,
            }}>
            <OrbCompanion size={tokens.icons.sizes.xl} state={state} />
            <Text
              style={{
                color: tokens.colors.text.tertiary,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: tokens.typography.fontSize.bodySm,
                textAlign: 'center',
              }}>
              {state}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AtomsPreview() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space3 }}>
      <Button label="Primary" onPress={() => undefined} variant="primary" />
      <Button label="Ghost" onPress={() => undefined} variant="ghost" />

      <Card variant="solid">
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
          }}>
          Solid Card
        </Text>
      </Card>

      <Card variant="glass">
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.bodyMd,
          }}>
          Glass Card
        </Text>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
        <Badge label="Primary" tone="primary" />
        <Badge label="Structure" tone="structure" />
        <Badge label="Warning" tone="warning" />
      </View>

      <ProgressBar color="primary" progress={0.72} />
      <ProgressBar color="structure" progress={0.45} />

      <Avatar name="Struct AI" size="md" />
      <Avatar name="Max Mustermann" size="lg" />
    </View>
  );
}

function FeaturesPreview() {
  const { tokens } = useThemeMode();

  return (
    <View style={{ gap: tokens.spacing.space4 }}>
      <OrbCounter count={128} max={200} />
      <StreakTracker completedDays={[true, true, true, false, false, false, false]} />
      <PathCard
        currentChapter={3}
        progress={0.42}
        title="Prompt-Grundlagen"
        totalChapters={8}
      />
      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <StatBlock copyKey="statBlock.completedLessons" value={24} />
        <StatBlock copyKey="statBlock.currentStreak" value={4} />
      </View>
    </View>
  );
}

function PreviewColumn({ modeLabel }: { modeLabel: 'Playful' | 'Focus' }) {
  const { tokens } = useThemeMode();

  return (
    <View
      style={{
        flex: 1,
        gap: tokens.spacing.space4,
        padding: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
        }}>
        {modeLabel}
      </Text>

      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.bodyMedium,
          fontSize: tokens.typography.fontSize.bodySm,
        }}>
        OrbCompanion
      </Text>
      <CompanionStatesPreview />

      <AtomsPreview />
      <FeaturesPreview />
    </View>
  );
}

function ModePreviewPanel({ modeLabel }: { modeLabel: 'Playful' | 'Focus' }) {
  const mode = modeLabel === 'Playful' ? 'playful' : 'focus';

  return (
    <ThemeModeScope mode={mode}>
      <PreviewColumn modeLabel={modeLabel} />
    </ThemeModeScope>
  );
}

export default function DevPreviewScreen() {
  const { view, mode } = useLocalSearchParams<{ view?: string; mode?: string }>();
  const previewMode = parseMode(mode);
  const { tokens } = useThemeMode();

  if (view === 'matching') {
    return (
      <ThemeModeScope mode={previewMode}>
        <MatchingOnlyPreview mode={previewMode} />
      </ThemeModeScope>
    );
  }

  if (view === 'error-finding') {
    return (
      <ThemeModeScope mode={previewMode}>
        <ErrorFindingOnlyPreview mode={previewMode} />
      </ThemeModeScope>
    );
  }

  if (view === 'categorize') {
    return (
      <ThemeModeScope mode={previewMode}>
        <CategorizeOnlyPreview mode={previewMode} />
      </ThemeModeScope>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space4,
        padding: tokens.spacing.screenPadding,
        paddingBottom: tokens.spacing.space7,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.headingLg,
        }}>
        UI Preview
      </Text>
      <Text
        style={{
          color: tokens.colors.text.secondary,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.bodyMd,
        }}>
        Atoms und Composite-Komponenten in Playful und Focus nebeneinander
      </Text>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <ModePreviewPanel modeLabel="Playful" />
        <ModePreviewPanel modeLabel="Focus" />
      </View>

      <MatchingStepDevSection />
      <ErrorFindingStepDevSection />
      <CategorizeStepDevSection />
    </ScrollView>
  );
}
