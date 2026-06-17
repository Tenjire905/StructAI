import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

interface SFProgressPillProps {
  progress: number;
  height?: number;
  accentColor?: string;
  label?: string;
  showPercent?: boolean;
}

export function SFProgressPill({
  progress,
  height = 12,
  accentColor = theme.colors.accent.everyday,
  label,
  showPercent = false,
}: SFProgressPillProps): React.JSX.Element {
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View>
      {label || showPercent ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercent ? <Text style={styles.percent}>{percent}%</Text> : null}
        </View>
      ) : null}
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2 },
        ]}
      >
        <View
          style={[
            styles.fillWrap,
            { width: `${percent}%`, borderRadius: height / 2 },
          ]}
        >
          <LinearGradient
            colors={[accentColor, theme.colors.accent.code]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.fill, { borderRadius: height / 2 }]}
          />
          <View
            style={[
              styles.cap,
              {
                width: height * 1.2,
                height: height * 1.2,
                borderRadius: height,
                backgroundColor: accentColor,
                shadowColor: accentColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.muted,
  },
  percent: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.accent.everyday,
  },
  track: {
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
  },
  fillWrap: {
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    minWidth: 4,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  cap: {
    position: 'absolute',
    right: -2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
});
