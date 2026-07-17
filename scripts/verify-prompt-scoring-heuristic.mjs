/**
 * Verification harness for lib/promptScoring.ts heuristic improvements.
 * Transpiles promptScoring in-process (no path-alias runtime) and runs example pairs.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, '.verify-dist/prompt-scoring');

mkdirSync(distDir, { recursive: true });

const localeSource = readFileSync(join(root, 'theme/locale.ts'), 'utf8');
const scoringSource = readFileSync(join(root, 'lib/promptScoring.ts'), 'utf8').replace(
  "from '@/theme/locale'",
  "from './locale.js'",
);

writeFileSync(join(distDir, 'locale.js'), localeSource.replace(/\.ts/g, '.js'));
writeFileSync(join(distDir, 'promptScoring.js'), scoringSource);

for (const file of ['locale.js', 'promptScoring.js']) {
  const input = readFileSync(join(distDir, file), 'utf8');
  const output = ts.transpileModule(input, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  writeFileSync(join(distDir, file), output);
}

const scoringModule = await import(pathToFileURL(join(distDir, 'promptScoring.js')).href);

const {
  buildDemoImprovedPrompt,
  comparePromptScores,
  DEMO_WEAK_PROMPT,
  getPrimaryImprovementPath,
  scorePrompt,
} = scoringModule;

const MIN_TOTAL_DELTA = 12;
const MIN_IMPROVEMENTS = 5;

const PAIRS = [
  {
    label: 'demo weak vs improved (de)',
    weak: DEMO_WEAK_PROMPT,
    improved: buildDemoImprovedPrompt('de'),
    locale: 'de',
  },
  {
    label: 'vague vs structured (de)',
    weak: 'Erkläre Prompts.',
    improved:
      'Kontext: Lernende ohne Vorkenntnisse.\nAufgabe: Erkläre Prompts in einfachen Worten.\nFormat: 3 Stichpunkte, maximal 60 Wörter.',
    locale: 'de',
  },
  {
    label: 'english weak vs improved',
    weak: 'Write about AI.',
    improved:
      'Context: beginner audience.\nTask: Write a short intro to prompt engineering.\nFormat: 3 bullet points, max 80 words, friendly tone.',
    locale: 'en',
  },
  {
    label: 'keyword stuffing vs structured',
    weak: 'ziel, format, maximal, stichpunkte, ton, zielgruppe, output, schreibe',
    improved: buildDemoImprovedPrompt('de'),
    locale: 'de',
  },
  {
    label: 'single line vs labeled blocks (de)',
    weak: 'Schreibe einen Blogpost über Prompting für Anfänger in 100 Wörtern',
    improved:
      'Kontext: Blog für Einsteiger.\nAufgabe: Schreibe einen Post über Prompting.\nFormat: 2 Absätze, maximal 100 Wörter, sachlicher Ton.',
    locale: 'de',
  },
  {
    label: 'french weak vs improved',
    weak: 'Parle de IA.',
    improved:
      'Contexte: public debutant.\nTache: Explique le prompt engineering.\nFormat: 3 puces, max 80 mots, ton amical.',
    locale: 'fr',
  },
  {
    label: 'russian weak vs improved',
    weak: 'Напиши про ИИ.',
    improved:
      'Контекст: аудитория новичков.\nЗадача: Напиши короткое введение в prompt engineering.\nФормат: 3 пункта, максимум 80 слов, дружелюбный тон.',
    locale: 'ru',
  },
];

const violations = [];
const results = PAIRS.map((pair) => {
  const weakScore = scorePrompt(pair.weak, pair.locale);
  const improvedScore = scorePrompt(pair.improved, pair.locale);
  const comparison = comparePromptScores(weakScore, improvedScore);
  const pass = comparison.totalDelta >= MIN_TOTAL_DELTA;

  if (!pass) {
    violations.push(`${pair.label}: delta ${comparison.totalDelta} < ${MIN_TOTAL_DELTA}`);
  }

  return {
    label: pair.label,
    weakTotal: weakScore.total,
    improvedTotal: improvedScore.total,
    delta: comparison.totalDelta,
    newlyFound: comparison.newlyFoundSignals.length,
    improvementNotes: comparison.improvementNotes.slice(0, 2),
    pass,
  };
});

const stuffingPrompt = 'ziel, format, maximal, stichpunkte, ton, zielgruppe, output, schreibe';
const structuredPrompt = buildDemoImprovedPrompt('de');
const stuffingScore = scorePrompt(stuffingPrompt, 'de');
const structuredScore = scorePrompt(structuredPrompt, 'de');

if (stuffingScore.total >= structuredScore.total - 5) {
  violations.push(
    `keyword stuffing not penalized enough: stuffing=${stuffingScore.total}, structured=${structuredScore.total}`,
  );
}

if (stuffingScore.gamingPenalty >= 1) {
  violations.push('keyword stuffing should trigger gamingPenalty < 1');
}

const passedPairs = results.filter((entry) => entry.pass).length;

if (passedPairs < MIN_IMPROVEMENTS) {
  violations.push(`only ${passedPairs}/${results.length} pairs improved by >= ${MIN_TOTAL_DELTA}`);
}

const weakPath = getPrimaryImprovementPath(DEMO_WEAK_PROMPT);
const improvedPath = getPrimaryImprovementPath(buildDemoImprovedPrompt('en'));

if (!weakPath?.primary) {
  violations.push('weak demo prompt should yield a primary improvement pillar');
}

if (improvedPath !== null) {
  violations.push(
    `improved demo prompt should cover all pillars, got ${JSON.stringify(improvedPath)}`,
  );
}

console.log(
  JSON.stringify(
    {
      minTotalDelta: MIN_TOTAL_DELTA,
      stuffingCheck: {
        stuffingTotal: stuffingScore.total,
        structuredTotal: structuredScore.total,
        gamingPenalty: stuffingScore.gamingPenalty,
      },
      pairs: results,
      violations,
      pass: violations.length === 0,
    },
    null,
    2,
  ),
);

process.exit(violations.length === 0 ? 0 : 1);
