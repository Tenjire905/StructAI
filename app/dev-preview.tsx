import { ScrollView, Text, View } from 'react-native';

import { Avatar, Badge, Button, Card, ProgressBar } from '@/components/ui';
import { ThemeModeScope, useThemeMode } from '@/theme';

function PreviewColumn({ modeLabel }: { modeLabel: 'Playful' | 'Focus' }) {
  const { tokens } = useThemeMode();

  return (
    <View
      style={{
        flex: 1,
        gap: tokens.spacing.space3,
        padding: tokens.spacing.space3,
      }}>
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.heading,
          fontSize: tokens.typography.fontSize.headingMd,
          marginBottom: tokens.spacing.space2,
        }}>
        {modeLabel}
      </Text>

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
          marginBottom: tokens.spacing.space2,
        }}>
        Basis-Komponenten in Playful und Focus nebeneinander
      </Text>

      <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
        <ModePreviewPanel modeLabel="Playful" />
        <ModePreviewPanel modeLabel="Focus" />
      </View>
    </ScrollView>
  );
}
