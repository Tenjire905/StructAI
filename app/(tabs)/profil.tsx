import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ProPlanStrip, SkillRankStrip, StatBlock } from '@/components/features';
import { GuestSaveProgressHint } from '@/components/features/GuestSaveProgressHint';
import { ByokKeysManager } from '@/components/features/profile/ByokKeysManager';
import { ProfileCertificatesSection } from '@/components/features/profile/ProfileCertificatesSection';
import { ProfileResetSection } from '@/components/features/profile/ProfileResetSection';
import { SpendingLimitSettings } from '@/components/features/profile/SpendingLimitSettings';
import { Avatar, Button, Card } from '@/components/ui';
import { resolveGuestDisplayName, resolveProfileDisplayName } from '@/lib/profileDisplayName';
import { resolveSkillRankProgress } from '@/lib/skillRank';
import { useAuth } from '@/providers/AuthProvider';
import { useProgressStore } from '@/store/progressStore';
import {
  LOCALE_LABEL_KEYS,
  LOCALES,
  useThemeMode,
  type ThemeMode,
} from '@/theme';

export default function ProfilScreen() {
  const { tokens, t, mode, setMode, locale, setLocale } = useThemeMode();
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const orbCount = useProgressStore((state) => state.orbCount);
  const completedPathIds = useProgressStore((state) => state.completedPathIds);
  const skillRank = useMemo(
    () =>
      resolveSkillRankProgress({
        completedLessons,
        completedPathCount: completedPathIds.length,
        orbCount,
      }),
    [completedLessons, completedPathIds.length, orbCount],
  );

  const displayName = session
    ? resolveProfileDisplayName(user)
    : resolveGuestDisplayName(t('profile.guestDisplayName'));

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: tokens.spacing.space5,
        paddingBottom: tokens.spacing.space7,
        paddingHorizontal: tokens.spacing.screenPadding,
        paddingTop: tokens.spacing.space5,
      }}
      style={{ backgroundColor: tokens.colors.background.base, flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: tokens.spacing.space4,
        }}>
        <Avatar name={displayName} size="lg" />
        <View style={{ flex: 1, gap: tokens.spacing.space2 }}>
          <Text
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: tokens.typography.fontSize.headingLg,
            }}>
            {displayName}
          </Text>
          {user?.email ? (
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
              }}>
              {user.email}
            </Text>
          ) : null}
        </View>
      </View>

      <GuestSaveProgressHint />

      <SkillRankStrip progress={skillRank} variant="detailed" />

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.statsSection')}
        </Text>
        <View style={{ flexDirection: 'row', gap: tokens.spacing.space3 }}>
          <StatBlock copyKey="statBlock.completedLessons" value={completedLessons} />
          <StatBlock copyKey="statBlock.currentStreak" value={currentStreak} />
        </View>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('pro.planSection')}
        </Text>
        <ProPlanStrip />
      </View>

      <ProfileCertificatesSection />

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.modeSection')}
        </Text>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <View style={{ flexDirection: 'row', gap: tokens.spacing.space2 }}>
              <ModeOption
                isActive={mode === 'playful'}
                label={t('profile.modePlayful')}
                onSelect={() => setMode('playful')}
                targetMode="playful"
              />
              <ModeOption
                isActive={mode === 'focus'}
                label={t('profile.modeFocus')}
                onSelect={() => setMode('focus')}
                targetMode="focus"
              />
            </View>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
              }}>
              {t('profile.modeDescription')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.languageSection')}
        </Text>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.space2 }}>
              {LOCALES.map((targetLocale) => (
                <LocaleOption
                  isActive={locale === targetLocale}
                  key={targetLocale}
                  label={t(LOCALE_LABEL_KEYS[targetLocale])}
                  onSelect={() => setLocale(targetLocale)}
                />
              ))}
            </View>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodySm,
                lineHeight: tokens.typography.fontSize.bodySm * 1.5,
              }}>
              {t('profile.languageDescription')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.accountSection')}
        </Text>

        <Card variant="solid">
          <View style={{ gap: tokens.spacing.space3 }}>
            <Text
              style={{
                color: tokens.colors.text.secondary,
                fontFamily: tokens.typography.fontFamily.body,
                fontSize: tokens.typography.fontSize.bodyMd,
                lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
              }}>
              {session ? t('profile.accountDescription') : t('profile.guestAccountDescription')}
            </Text>
            {session ? (
              <Button label={t('profile.signOut')} onPress={handleSignOut} variant="ghost" />
            ) : (
              <Button
                label={t('guest.saveProgressCta')}
                onPress={() => router.push('/auth')}
                variant="ghost"
              />
            )}
          </View>
        </Card>
      </View>

      <View style={{ gap: tokens.spacing.space3 }}>
        <Text
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.headingMd,
          }}>
          {t('profile.privacySection')}
        </Text>

        <Card variant="solid">
          <Text
            style={{
              color: tokens.colors.text.secondary,
              fontFamily: tokens.typography.fontFamily.body,
              fontSize: tokens.typography.fontSize.bodyMd,
              lineHeight: tokens.typography.fontSize.bodyMd * 1.5,
            }}>
            {t('profile.analyticsDisclosure')}
          </Text>
        </Card>
      </View>

      <ByokKeysManager />
      <SpendingLimitSettings />
      <ProfileResetSection />
    </ScrollView>
  );
}

type ModeOptionProps = {
  label: string;
  targetMode: ThemeMode;
  isActive: boolean;
  onSelect: () => void;
};

function ModeOption({ label, isActive, onSelect }: ModeOptionProps) {
  return (
    <View style={{ flex: 1 }}>
      <Button
        label={label}
        onPress={onSelect}
        variant={isActive ? 'primary' : 'ghost'}
      />
    </View>
  );
}

type LocaleOptionProps = {
  label: string;
  isActive: boolean;
  onSelect: () => void;
};

function LocaleOption({ label, isActive, onSelect }: LocaleOptionProps) {
  return (
    <View style={{ minWidth: '47%' }}>
      <Button
        label={label}
        onPress={onSelect}
        variant={isActive ? 'primary' : 'ghost'}
      />
    </View>
  );
}
