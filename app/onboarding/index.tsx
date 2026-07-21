import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  View,
  type ViewToken,
} from 'react-native';

import { OnboardingChrome } from '@/components/features/onboarding/OnboardingChrome';
import {
  OnboardingFeatureVisual,
  type OnboardingFeatureVisualKind,
} from '@/components/features/onboarding/OnboardingFeatureVisual';
import { OnboardingPageDots } from '@/components/features/onboarding/OnboardingPageDots';
import { playSfx } from '@/lib/sfx';
import { useThemeMode } from '@/theme';

type IntroSlide = {
  kind: OnboardingFeatureVisualKind;
  valueKey: string;
};

const SLIDES: IntroSlide[] = [
  {
    kind: 'score',
    valueKey: 'onboarding.introSlide1Value',
  },
  {
    kind: 'path',
    valueKey: 'onboarding.introSlide2Value',
  },
  {
    kind: 'coach',
    valueKey: 'onboarding.introSlide3Value',
  },
];

/**
 * Liftoff-style marketing carousel: swipeable iPhone mocks + value lines,
 * page dots, full-width CTA + Anmelden. Start SFX once on mount.
 */
export default function OnboardingWelcomeScreen() {
  const { tokens, t, mode } = useThemeMode();
  const router = useRouter();
  const listRef = useRef<FlatList<IntroSlide>>(null);
  const [index, setIndex] = useState(0);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const soundEnabled = tokens.presentation.soundEnabled;
  const lastIndexRef = useRef(0);
  const suppressSwipeSfxRef = useRef(false);

  useEffect(() => {
    playSfx('start', soundEnabled);
  }, [soundEnabled]);

  const goToMeet = useCallback(() => {
    playSfx('tap', soundEnabled);
    router.push('/onboarding/meet');
  }, [router, soundEnabled]);

  const syncIndex = useCallback(
    (next: number, playSwipeSfx: boolean) => {
      if (next === lastIndexRef.current) {
        return;
      }
      lastIndexRef.current = next;
      setIndex(next);
      if (playSwipeSfx && !suppressSwipeSfxRef.current) {
        playSfx('tap', soundEnabled);
      }
      suppressSwipeSfxRef.current = false;
    },
    [soundEnabled],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((item) => item.isViewable && item.index != null);
      if (first?.index != null) {
        // Dots follow mid-swipe; SFX fires from momentum end only.
        if (first.index !== lastIndexRef.current) {
          lastIndexRef.current = first.index;
          setIndex(first.index);
        }
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const advance = () => {
    playSfx('tap', soundEnabled);
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      suppressSwipeSfxRef.current = true;
      lastIndexRef.current = next;
      setIndex(next);
      listRef.current?.scrollToIndex({ animated: true, index: next });
      return;
    }
    router.push('/onboarding/meet');
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageSize.width <= 0) {
      return;
    }
    const next = Math.round(event.nativeEvent.contentOffset.x / pageSize.width);
    const clamped = Math.min(SLIDES.length - 1, Math.max(0, next));
    syncIndex(clamped, true);
  };

  const renderItem: ListRenderItem<IntroSlide> = ({ item }) => (
    <View
      style={{
        alignItems: 'center',
        gap: tokens.spacing.space4,
        height: pageSize.height || undefined,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.space1,
        width: pageSize.width || undefined,
      }}>
      <OnboardingFeatureVisual kind={item.kind} />
      <Text
        style={{
          color: tokens.colors.text.primary,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize:
            mode === 'focus'
              ? tokens.typography.fontSize.headingMd
              : tokens.typography.fontSize.headingLg,
          lineHeight:
            (mode === 'focus'
              ? tokens.typography.fontSize.headingMd
              : tokens.typography.fontSize.headingLg) * 1.3,
          paddingHorizontal: tokens.spacing.space2,
          textAlign: 'center',
        }}>
        {t(item.valueKey)}
      </Text>
    </View>
  );

  return (
    <OnboardingChrome
      ctaLabel={
        index < SLIDES.length - 1
          ? t('onboarding.introNext')
          : t('onboarding.welcomeCta')
      }
      footerExtra={
        <OnboardingPageDots
          count={SLIDES.length}
          index={index}
          onSelect={(next) => {
            if (next === index) {
              return;
            }
            playSfx('tap', soundEnabled);
            suppressSwipeSfxRef.current = true;
            lastIndexRef.current = next;
            setIndex(next);
            listRef.current?.scrollToIndex({ animated: true, index: next });
          }}
        />
      }
      onCta={advance}
      onSecondary={() => {
        playSfx('tap', soundEnabled);
        router.push('/auth');
      }}
      onSkip={goToMeet}
      secondaryLabel={t('onboarding.introSignIn')}
      showBrand
      skipLabel={t('onboarding.skip')}>
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          const next = { width: Math.round(width), height: Math.round(height) };
          if (
            next.width > 0 &&
            next.height > 0 &&
            (next.width !== pageSize.width || next.height !== pageSize.height)
          ) {
            setPageSize(next);
          }
        }}
        style={{ flex: 1 }}>
        {pageSize.width > 0 && pageSize.height > 0 ? (
          <FlatList
            ref={listRef}
            data={SLIDES}
            decelerationRate="fast"
            getItemLayout={(_, itemIndex) => ({
              index: itemIndex,
              length: pageSize.width,
              offset: pageSize.width * itemIndex,
            })}
            horizontal
            keyExtractor={(item) => item.kind}
            onMomentumScrollEnd={onScrollEnd}
            onViewableItemsChanged={onViewableItemsChanged}
            pagingEnabled
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            viewabilityConfig={viewabilityConfig}
          />
        ) : null}
      </View>
    </OnboardingChrome>
  );
}
