import { Text, View } from 'react-native';

import { AutoDismissPeek } from '@/components/ui/AutoDismissPeek';
import { Card } from '@/components/ui';
import { useThemeMode } from '@/theme';

type GlossaryTermPeekProps = {
  visible: boolean;
  revealNonce?: number;
  termLabel: string;
  definition: string;
  onDismiss: () => void;
};

/**
 * Compact definition bar for glossary terms — small by design, not a full modal.
 */
export function GlossaryTermPeek({
  visible,
  revealNonce = 0,
  termLabel,
  definition,
  onDismiss,
}: GlossaryTermPeekProps) {
  const { tokens } = useThemeMode();

  return (
    <AutoDismissPeek
      maxHeight={120}
      onDismiss={onDismiss}
      revealNonce={revealNonce}
      visible={visible}>
      <Card variant="solid">
        <View style={{ gap: tokens.spacing.space1 }}>
          <Text
            style={{
              color: tokens.colors.accent.primary,
              fontFamily: tokens.typography.fontFamily.bodyMedium,
              fontSize: tokens.typography.fontSize.bodySm,
            }}>
            {termLabel}
          </Text>
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodySm,
              lineHeight: tokens.typography.fontSize.bodySm * 1.45,
            }}>
            {definition}
          </Text>
        </View>
      </Card>
    </AutoDismissPeek>
  );
}
