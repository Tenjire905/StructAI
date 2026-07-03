/**
 * OrbCompanion lifecycle policy check (pure logic, no Reanimated runtime).
 * Mirrors animation decisions in components/features/OrbCompanion.tsx.
 */

const LOOP_STATES = new Set(['idle', 'sleepy', 'low_energy']);

const MOTION_FAST_MS = 200;
const IDLE_SCALE_PEAK = 1.03;
const IDLE_HALF_MS = 1200;
const LOW_ENERGY_SCALE_PEAK = 1.015;
const LOW_ENERGY_HALF_MS = 1600;
const LOW_ENERGY_BODY_OPACITY = 0.8;
const IDLE_BODY_OPACITY = 1;
const LOW_ENERGY_EYE_HEIGHT = 0.35;
const OPEN_EYE_RADIUS = 1.1;

function sinEaseInOut(progress) {
  return (1 - Math.cos(Math.PI * progress)) / 2;
}

function sampleBreathingScale(elapsedMs, peak, halfDurationMs) {
  const cycleMs = halfDurationMs * 2;
  const phase = (elapsedMs % cycleMs) / cycleMs;

  if (phase < 0.5) {
    return 1 + (peak - 1) * sinEaseInOut(phase * 2);
  }

  return peak - (peak - 1) * sinEaseInOut((phase - 0.5) * 2);
}

function sampleLinearTransition(start, end, durationMs, elapsedMs) {
  const progress = Math.min(1, Math.max(0, elapsedMs / durationMs));
  return start + (end - start) * progress;
}

function hasLoopOverlapViolation(step) {
  if (step.stackedWithoutCancel) {
    return true;
  }

  return step.parallelLoops && !step.cancelledBeforeStart;
}

function resolveScaleDriver(state, isFocused, reduceMotion, isPlayfulPresentation) {
  if (!isFocused || reduceMotion) {
    return { kind: 'stopped', loop: false };
  }

  if (state === 'idle') {
    return { kind: 'breathing', loop: true };
  }

  if (state === 'sleepy' && isPlayfulPresentation) {
    return { kind: 'sleepy-breathing', loop: true };
  }

  if (state === 'low_energy' && isPlayfulPresentation) {
    return { kind: 'low-energy-pulse', loop: true };
  }

  if (isPlayfulPresentation && (state === 'happy' || state === 'celebrating')) {
    return { kind: `${state}-pulse`, loop: false };
  }

  return { kind: 'reset', loop: false };
}

function simulateTransition(previous, next, context) {
  const previousDriver = resolveScaleDriver(previous.state, previous.isFocused, context.reduceMotion, context.isPlayfulPresentation);
  const nextDriver = resolveScaleDriver(next.state, next.isFocused, context.reduceMotion, context.isPlayfulPresentation);

  return {
    cancelledBeforeStart: true,
    previousDriver,
    nextDriver,
    parallelLoops:
      previousDriver.loop && nextDriver.loop && previousDriver.kind !== nextDriver.kind,
    stackedWithoutCancel: false,
  };
}

function runRapidStateScenario() {
  const context = { reduceMotion: false, isPlayfulPresentation: true, isFocused: true };
  const sequence = [
    { state: 'idle' },
    { state: 'celebrating' },
    { state: 'idle' },
    { state: 'happy' },
  ];

  const steps = [];
  let previous = { state: 'idle', isFocused: true };

  for (const next of sequence) {
    steps.push(
      simulateTransition(previous, { ...next, isFocused: true }, context),
    );
    previous = { ...next, isFocused: true };
  }

  const loopSteps = steps.filter((step) => step.nextDriver.loop || step.previousDriver.loop);
  const violations = steps.filter((step) => step.parallelLoops || step.stackedWithoutCancel);

  return {
    sequence: sequence.map((entry) => entry.state),
    steps,
    loopStepsCount: loopSteps.length,
    violations: violations.length,
  };
}

function runFocusPauseScenario() {
  const idleFocused = resolveScaleDriver('idle', true, false, true);
  const idleUnfocused = resolveScaleDriver('idle', false, false, true);
  const sleepyBackground = resolveScaleDriver('sleepy', false, false, true);
  const lowEnergyFocusedPlayful = resolveScaleDriver('low_energy', true, false, true);
  const lowEnergyUnfocused = resolveScaleDriver('low_energy', false, false, true);
  const lowEnergyFocusedFocusMode = resolveScaleDriver('low_energy', true, false, false);

  return {
    idleFocused,
    idleUnfocused,
    sleepyBackground,
    lowEnergyFocusedPlayful,
    lowEnergyUnfocused,
    lowEnergyFocusedFocusMode,
    loopsActiveInBackground:
      idleUnfocused.loop || sleepyBackground.loop || lowEnergyUnfocused.loop,
  };
}

function runLowEnergyCelebratingScenario() {
  const context = { reduceMotion: false, isPlayfulPresentation: true, isFocused: true };
  const step = simulateTransition(
    { state: 'low_energy', isFocused: true },
    { state: 'celebrating', isFocused: true },
    context,
  );

  return {
    from: 'low_energy',
    to: 'celebrating',
    step,
    violations: hasLoopOverlapViolation(step) ? 1 : 0,
  };
}

function runLowEnergyIdleScenario() {
  const context = { reduceMotion: false, isPlayfulPresentation: true, isFocused: true };
  const step = simulateTransition(
    { state: 'low_energy', isFocused: true },
    { state: 'idle', isFocused: true },
    context,
  );

  const preTransitionSamples = [0, 400, 800, 1200, 1599, 3199].map((elapsedMs) => ({
    phase: 'low_energy',
    elapsedMs,
    scale: sampleBreathingScale(elapsedMs, LOW_ENERGY_SCALE_PEAK, LOW_ENERGY_HALF_MS),
  }));

  const transitionReset = { phase: 'transition_reset', elapsedMs: 0, scale: 1 };
  const postTransitionSamples = [0, 50, 200, 600, 1200, 2400].map((elapsedMs) => ({
    phase: 'idle',
    elapsedMs,
    scale: sampleBreathingScale(elapsedMs, IDLE_SCALE_PEAK, IDLE_HALF_MS),
  }));

  const scaleSamples = [...preTransitionSamples, transitionReset, ...postTransitionSamples];
  const scaleOutOfBounds = scaleSamples.filter(
    (sample) => sample.scale < 1 || sample.scale > IDLE_SCALE_PEAK,
  );

  const eyeTransitionSamples = [0, 50, 100, 150, 200, 250].map((elapsedMs) => ({
    elapsedMs,
    eyeHeight: sampleLinearTransition(
      LOW_ENERGY_EYE_HEIGHT,
      OPEN_EYE_RADIUS,
      MOTION_FAST_MS,
      elapsedMs,
    ),
    eyeRadius: sampleLinearTransition(OPEN_EYE_RADIUS, OPEN_EYE_RADIUS, MOTION_FAST_MS, elapsedMs),
  }));

  const opacityTransitionSamples = [0, 50, 100, 150, 200, 250].map((elapsedMs) => ({
    elapsedMs,
    bodyOpacity: sampleLinearTransition(
      LOW_ENERGY_BODY_OPACITY,
      IDLE_BODY_OPACITY,
      MOTION_FAST_MS,
      elapsedMs,
    ),
  }));

  const eyeOutOfBounds = eyeTransitionSamples.filter(
    (sample) =>
      sample.eyeHeight < LOW_ENERGY_EYE_HEIGHT ||
      sample.eyeHeight > OPEN_EYE_RADIUS ||
      sample.eyeRadius < OPEN_EYE_RADIUS ||
      sample.eyeRadius > OPEN_EYE_RADIUS,
  );

  const opacityOutOfBounds = opacityTransitionSamples.filter(
    (sample) => sample.bodyOpacity < LOW_ENERGY_BODY_OPACITY || sample.bodyOpacity > IDLE_BODY_OPACITY,
  );

  const eyeOpensWithinFastDuration =
    eyeTransitionSamples.find((sample) => sample.elapsedMs === MOTION_FAST_MS)?.eyeHeight ===
    OPEN_EYE_RADIUS;

  const opacityReachesFullWithinFastDuration =
    opacityTransitionSamples.find((sample) => sample.elapsedMs === MOTION_FAST_MS)?.bodyOpacity ===
    IDLE_BODY_OPACITY;

  const violations = [
    hasLoopOverlapViolation(step) ? 'loop-overlap' : null,
    scaleOutOfBounds.length > 0 ? 'scale-out-of-bounds' : null,
    eyeOutOfBounds.length > 0 ? 'eye-out-of-bounds' : null,
    opacityOutOfBounds.length > 0 ? 'opacity-out-of-bounds' : null,
    !eyeOpensWithinFastDuration ? 'eye-transition-duration' : null,
    !opacityReachesFullWithinFastDuration ? 'opacity-transition-duration' : null,
  ].filter(Boolean);

  return {
    from: 'low_energy',
    to: 'idle',
    trigger: 'orbCount crosses 30/200 while companion is focused (>= 0.15 ratio)',
    step,
    loopPolicy: {
      previousDriver: step.previousDriver,
      nextDriver: step.nextDriver,
      cancelledBeforeStart: step.cancelledBeforeStart,
      loopsRunInParallel: hasLoopOverlapViolation(step),
    },
    scaleTransition: {
      allowedRange: [1, IDLE_SCALE_PEAK],
      lowEnergyPeak: LOW_ENERGY_SCALE_PEAK,
      idlePeak: IDLE_SCALE_PEAK,
      resetToScaleOnTransition: transitionReset.scale,
      outOfBoundsCount: scaleOutOfBounds.length,
      outOfBoundsSamples: scaleOutOfBounds.slice(0, 3),
    },
    eyeTransition: {
      fromHeight: LOW_ENERGY_EYE_HEIGHT,
      toHeight: OPEN_EYE_RADIUS,
      durationMs: MOTION_FAST_MS,
      opensWithinDuration: eyeOpensWithinFastDuration,
      outOfBoundsCount: eyeOutOfBounds.length,
    },
    opacityTransition: {
      from: LOW_ENERGY_BODY_OPACITY,
      to: IDLE_BODY_OPACITY,
      durationMs: MOTION_FAST_MS,
      reachesFullWithinDuration: opacityReachesFullWithinFastDuration,
      outOfBoundsCount: opacityOutOfBounds.length,
    },
    violations: violations.length,
    violationKinds: violations,
  };
}

const rapid = runRapidStateScenario();
const focus = runFocusPauseScenario();
const lowEnergyCelebrating = runLowEnergyCelebratingScenario();
const lowEnergyIdle = runLowEnergyIdleScenario();

console.log(
  JSON.stringify(
    {
      manualTest: {
        screen: 'app/(dev)/dev-preview.tsx (6 OrbCompanion instances per mode column)',
        futureScreens: 'B4: Home, Lektion, Prompt Lab — each instance uses useIsFocused() from its host screen',
        steps: [
          'Open dev-preview, enable Playful, pick idle companion',
          'Within 500ms toggle props: idle → celebrating → idle → happy (e.g. fast state picker or temporary dev buttons)',
          'Confirm scale settles at 1 with no repeating pulse after final happy spring completes',
          'Switch tab or navigate away — idle/sleepy/low_energy loops must stop on unfocused tab instances',
          'Watch Metro/console: no Reanimated warnings about overlapping animations',
        ],
      },
      loopStates: [...LOOP_STATES],
      rapidStateScenario: rapid,
      focusPauseScenario: focus,
      lowEnergyCelebratingScenario: lowEnergyCelebrating,
      lowEnergyIdleScenario: lowEnergyIdle,
      pass:
        rapid.violations === 0 &&
        focus.loopsActiveInBackground === false &&
        lowEnergyCelebrating.violations === 0 &&
        lowEnergyIdle.violations === 0,
    },
    null,
    2,
  ),
);
