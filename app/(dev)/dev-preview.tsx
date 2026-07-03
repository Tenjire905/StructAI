import { ScrollView, Text, View } from 'react-native';

import {
  OrbCompanion,
  OrbCounter,
  PathCard,
  StatBlock,
  StreakTracker,
} from '@/components/features';
import { Avatar, Badge, Button, Card, ProgressBar } from '@/components/ui';
import type { OrbCompanionState } from '@/hooks/useOrbCompanionState';
import { ThemeModeScope, useThemeMode } from '@/theme';

const COMPANION_STATES: OrbCompanionState[] = [
  'idle',
  'attentive',
  'happy',
  'low_energy',
  'celebrating',
  'sleepy',
];

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
  const { tokens } = useThemeMode();

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
    </ScrollView>
  );
}
