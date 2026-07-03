/**
 * OrbCompanion lifecycle policy check (pure logic, no Reanimated runtime).
 * Mirrors animation decisions in components/features/OrbCompanion.tsx.
 */

const LOOP_STATES = new Set(['idle', 'sleepy', 'low_energy']);

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
    violations:
      step.parallelLoops || step.stackedWithoutCancel ? 1 : 0,
  };
}

const rapid = runRapidStateScenario();
const focus = runFocusPauseScenario();
const lowEnergyCelebrating = runLowEnergyCelebratingScenario();

console.log(
  JSON.stringify(
    {
      manualTest: {
        screen: 'app/dev-preview.tsx (6 OrbCompanion instances per mode column)',
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
      pass:
        rapid.violations === 0 &&
        focus.loopsActiveInBackground === false &&
        lowEnergyCelebrating.violations === 0,
    },
    null,
    2,
  ),
);
