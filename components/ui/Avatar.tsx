import { Image, Text, View, type ImageSourcePropType } from 'react-native';

import { useThemeMode } from '@/theme';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  name: string;
  source?: ImageSourcePropType;
  size?: AvatarSize;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Avatar({ name, source, size = 'md' }: AvatarProps) {
  const { tokens } = useThemeMode();

  const dimension = {
    sm: tokens.spacing.space6,
    md: tokens.spacing.space7,
    lg: tokens.spacing.space8,
  }[size];

  const fontSize = {
    sm: tokens.typography.fontSize.bodySm,
    md: tokens.typography.fontSize.bodyMd,
    lg: tokens.typography.fontSize.bodyLg,
  }[size];

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: tokens.colors.surface.cardHover,
        borderColor: tokens.colors.border.subtle,
        borderRadius: dimension / 2,
        borderWidth: 1,
        height: dimension,
        justifyContent: 'center',
        overflow: 'hidden',
        width: dimension,
      }}>
      {source ? (
        <Image
          accessibilityLabel={name}
          source={source}
          style={{
            height: dimension,
            width: dimension,
          }}
        />
      ) : (
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize,
          }}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
