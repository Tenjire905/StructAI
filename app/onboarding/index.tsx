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
 * Liftoff marketing carousel:
 * - Swipeable cropped phone reveals (not full handsets)
 * - Caption + dots sit in a reserved band — no overlaps with the device
 * - Layout is locked after first paint (no compact/windowHeight flips on refresh)
 */
export default function OnboardingWelcomeScreen() {
  const { tokens, t, mode, isReady } = useThemeMode();
  const router = useRouter();
  const listRef = useRef<FlatList<IntroSlide>>(null);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const lockedPageWidthRef = useRef(0);
  const soundEnabled = tokens.presentation.soundEnabled;
  const lastIndexRef = useRef(0);
  const suppressSwipeSfxRef = useRef(false);

  // Stable caption size: mode-only (never windowHeight). Same after every refresh.
  const captionSize =
    mode === 'focus'
      ? tokens.typography.fontSize.headingMd
      : tokens.typography.fontSize.headingLg;
  const captionLineHeight = captionSize * 1.3;

  useEffect(() => {
    if (!isReady) {
      return;
    }
    playSfx('start', soundEnabled);
  }, [isReady, soundEnabled]);

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
      if (first?.index != null && first.index !== lastIndexRef.current) {
        lastIndexRef.current = first.index;
        setIndex(first.index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const jumpTo = (next: number) => {
    if (next === index || next < 0 || next >= SLIDES.length) {
      return;
    }
    playSfx('tap', soundEnabled);
    suppressSwipeSfxRef.current = true;
    lastIndexRef.current = next;
    setIndex(next);
    listRef.current?.scrollToIndex({ animated: true, index: next });
  };

  const advance = () => {
    if (index < SLIDES.length - 1) {
      jumpTo(index + 1);
      return;
    }
    playSfx('tap', soundEnabled);
    router.push('/onboarding/meet');
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) {
      return;
    }
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    const clamped = Math.min(SLIDES.length - 1, Math.max(0, next));
    syncIndex(clamped, true);
  };

  const renderItem: ListRenderItem<IntroSlide> = ({ item }) => (
    <View
      style={{
        height: '100%',
        overflow: 'hidden',
        paddingHorizontal: tokens.spacing.space1,
        width: pageWidth || undefined,
      }}>
      <OnboardingFeatureVisual kind={item.kind} />
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
        <View style={{ gap: tokens.spacing.space4 }}>
          {/* Reserved caption band — wraps fully; no fixed height clip. */}
          <Text
            numberOfLines={3}
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.typography.fontFamily.display,
              fontSize: captionSize,
              lineHeight: captionLineHeight,
              minHeight: captionLineHeight * 2,
              opacity: isReady ? 1 : 0,
              textAlign: 'center',
            }}>
            {isReady ? t(SLIDES[index].valueKey) : ' '}
          </Text>
          <OnboardingPageDots
            count={SLIDES.length}
            index={index}
            onSelect={jumpTo}
          />
        </View>
      }
      onCta={advance}
      onSecondary={() => {
        playSfx('tap', soundEnabled);
        router.push('/auth');
      }}
      secondaryLabel={t('onboarding.introSignIn')}
      showBrand>
      <View
        onLayout={(event) => {
          const nextWidth = Math.round(event.nativeEvent.layout.width);
          if (nextWidth <= 0) {
            return;
          }
          // Lock width after first measure — ignore refresh jitter that shrinks.
          if (lockedPageWidthRef.current > 0) {
            if (nextWidth < lockedPageWidthRef.current) {
              return;
            }
            if (Math.abs(nextWidth - lockedPageWidthRef.current) < tokens.spacing.space2) {
              return;
            }
          }
          lockedPageWidthRef.current = nextWidth;
          if (nextWidth !== pageWidth) {
            setPageWidth(nextWidth);
          }
        }}
        style={{ flex: 1, overflow: 'hidden' }}>
        {isReady && pageWidth > 0 ? (
          <FlatList
            ref={listRef}
            data={SLIDES}
            decelerationRate="fast"
            getItemLayout={(_, itemIndex) => ({
              index: itemIndex,
              length: pageWidth,
              offset: pageWidth * itemIndex,
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
