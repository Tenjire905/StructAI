/**
 * Verifies catalog-backed lesson content for one explicit lesson range.
 *
 * Usage:
 *   node scripts/verify-lesson-content-locales.mjs --from pb-9 --to pb-13
 *   node scripts/verify-lesson-content-locales.mjs --range pb-9..pb-13
 *   node scripts/verify-lesson-content-locales.mjs --ids pb-9,pb-10,pb-11
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const localeNames = ['de', 'en', 'fr', 'ru'];
const neutralWordTokens = new Set([
  'B2B',
  'CSV',
  'CTA',
  'HTML',
  'JSON',
  'LinkedIn',
  'Markdown',
  'SaaS',
  'SQL',
  'URL',
  'XML',
]);
const legacyUnreferencedKeys = new Set([
  'pb-2.s1.opt0',
  'pb-2.s1.opt1',
  'pb-2.s1.opt2',
  'pb-2.s1.question',
]);

function failUsage(message) {
  console.error(message);
  console.error(
    'Usage: node scripts/verify-lesson-content-locales.mjs ' +
      '--from pb-9 --to pb-13 | --range pb-9..pb-13 | --ids pb-9,pb-10',
  );
  process.exit(2);
}

function parseLessonId(id) {
  const match = /^(.+)-(\d+)$/.exec(id);
  if (!match) {
    failUsage(`Invalid lesson ID: ${id}`);
  }

  return { id, prefix: match[1], number: Number(match[2]) };
}

function parseSelection(args) {
  let ids;

  if (args[0] === '--from' && args[2] === '--to' && args.length === 4) {
    const from = parseLessonId(args[1]);
    const to = parseLessonId(args[3]);
    if (from.prefix !== to.prefix || from.number > to.number) {
      failUsage('Range endpoints must share a prefix and be in ascending order.');
    }
    ids = Array.from(
      { length: to.number - from.number + 1 },
      (_, index) => `${from.prefix}-${from.number + index}`,
    );
  } else if (args[0] === '--range' && args.length === 2) {
    const endpoints = args[1].split('..');
    if (endpoints.length !== 2) {
      failUsage('A range must use the form pb-9..pb-13.');
    }
    return parseSelection(['--from', endpoints[0], '--to', endpoints[1]]);
  } else if (args[0] === '--ids' && args.length === 2) {
    ids = args[1].split(',').map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      failUsage('--ids requires at least one lesson ID.');
    }
  } else {
    failUsage('An explicit lesson range or ID list is required.');
  }

  const parsedIds = ids.map(parseLessonId);
  const prefixes = new Set(parsedIds.map(({ prefix }) => prefix));
  if (prefixes.size !== 1) {
    failUsage('All selected lesson IDs must share one path prefix.');
  }

  return { ids, prefix: parsedIds[0].prefix };
}

function parseTypeScript(relativePath) {
  const absolutePath = join(root, relativePath);
  const sourceFile = ts.createSourceFile(
    absolutePath,
    readFileSync(absolutePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  if (sourceFile.parseDiagnostics.length > 0) {
    const diagnostics = ts.formatDiagnosticsWithColorAndContext(sourceFile.parseDiagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    });
    throw new Error(`Unable to parse ${relativePath}:\n${diagnostics}`);
  }

  return sourceFile;
}

function findVariableInitializer(sourceFile, variableName) {
  let initializer;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName
    ) {
      initializer = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  if (!initializer) {
    throw new Error(`Could not find ${variableName} in ${sourceFile.fileName}`);
  }
  return initializer;
}

function isStringLiteral(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function propertyName(node) {
  if (ts.isIdentifier(node) || isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function objectProperty(object, name) {
  return object.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  );
}

function readCatalog() {
  const sourceFile = parseTypeScript('data/mockLessons.catalog.ts');
  const initializer = findVariableInitializer(sourceFile, 'MOCK_LESSONS_CATALOG');
  if (!ts.isArrayLiteralExpression(initializer)) {
    throw new Error('MOCK_LESSONS_CATALOG must be an array literal.');
  }

  return initializer.elements.map((element) => {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error('Every catalog lesson must be an object literal.');
    }
    const idProperty = objectProperty(element, 'id');
    if (!idProperty || !isStringLiteral(idProperty.initializer)) {
      throw new Error('Every catalog lesson must have a string-literal id.');
    }

    const id = idProperty.initializer.text;
    const referencedKeys = new Set();
    function collectKeys(node) {
      if (isStringLiteral(node) && node.text.startsWith(`${id}.`)) {
        referencedKeys.add(node.text);
      }
      ts.forEachChild(node, collectKeys);
    }
    collectKeys(element);

    return { id, referencedKeys: [...referencedKeys].sort() };
  });
}

function readLocale(relativePath, variableName) {
  const sourceFile = parseTypeScript(relativePath);
  const initializer = findVariableInitializer(sourceFile, variableName);
  if (!ts.isObjectLiteralExpression(initializer)) {
    throw new Error(`${variableName} must be an object literal.`);
  }

  const values = new Map();
  const duplicateKeys = [];
  for (const property of initializer.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }
    const key = propertyName(property.name);
    if (key === undefined || !isStringLiteral(property.initializer)) {
      continue;
    }
    if (values.has(key)) {
      duplicateKeys.push(key);
    }
    values.set(key, property.initializer.text);
  }

  return { values, duplicateKeys };
}

function isLanguageNeutral(value) {
  const trimmed = value.trim();
  if (/^[\p{N}\p{P}\p{S}\p{Zs}]+$/u.test(trimmed)) {
    return true;
  }

  const wordTokens = trimmed.match(/[\p{L}\p{N}]+/gu) ?? [];
  return wordTokens.length > 0 && wordTokens.every((token) => neutralWordTokens.has(token));
}

const selection = parseSelection(process.argv.slice(2));
const requestedIds = new Set(selection.ids);
const catalog = readCatalog();
const lessonsById = new Map(catalog.map((lesson) => [lesson.id, lesson]));
const selectedLessons = selection.ids.flatMap((id) => {
  const lesson = lessonsById.get(id);
  return lesson ? [lesson] : [];
});
const expectedKeys = new Set(selectedLessons.flatMap(({ referencedKeys }) => referencedKeys));
const missingCatalogLessons = selection.ids.filter((id) => !lessonsById.has(id));

const localeFiles = {
  de: ['data/lessonContent/de.ts', 'lessonDe'],
  en: [`data/lessonContent/en_${selection.prefix}.ts`, `lessonEn${selection.prefix[0].toUpperCase()}${selection.prefix.slice(1)}`],
  fr: [`data/lessonContent/fr_${selection.prefix}.ts`, `lessonFr${selection.prefix[0].toUpperCase()}${selection.prefix.slice(1)}`],
  ru: [`data/lessonContent/ru_${selection.prefix}.ts`, `lessonRu${selection.prefix[0].toUpperCase()}${selection.prefix.slice(1)}`],
};
const localeData = Object.fromEntries(
  localeNames.map((locale) => {
    const [relativePath, variableName] = localeFiles[locale];
    return [locale, readLocale(relativePath, variableName)];
  }),
);
const isSelectedKey = (key) => selection.ids.some((id) => key.startsWith(`${id}.`));
const selectedKeysByLocale = Object.fromEntries(
  localeNames.map((locale) => [
    locale,
    new Set([...localeData[locale].values.keys()].filter(isSelectedKey)),
  ]),
);
const localeKeyUnion = new Set(
  localeNames.flatMap((locale) => [...selectedKeysByLocale[locale]]),
);

const violations = {
  missingCatalogLessons,
  missingCatalogKeys: [],
  localeKeyParity: [],
  emptyValues: [],
  identicalTranslations: [],
  unreferencedLocaleKeys: [],
  duplicateLocaleKeys: [],
};

for (const key of expectedKeys) {
  const missingLocales = localeNames.filter((locale) => !localeData[locale].values.has(key));
  if (missingLocales.length > 0) {
    violations.missingCatalogKeys.push({ key, missingLocales });
  }
}

for (const key of [...localeKeyUnion].sort()) {
  const missingLocales = localeNames.filter((locale) => !selectedKeysByLocale[locale].has(key));
  if (missingLocales.length > 0) {
    violations.localeKeyParity.push({ key, missingLocales });
  }
  if (!expectedKeys.has(key) && !legacyUnreferencedKeys.has(key)) {
    violations.unreferencedLocaleKeys.push(key);
  }

  const values = localeNames.map((locale) => localeData[locale].values.get(key));
  const isIntentionalEmptySuffix =
    key.endsWith('.suffix') && values.every((value) => value === '');
  for (let index = 0; index < localeNames.length; index += 1) {
    if (
      values[index] !== undefined &&
      values[index].trim().length === 0 &&
      !isIntentionalEmptySuffix
    ) {
      violations.emptyValues.push({ key, locale: localeNames[index] });
    }
  }
  if (
    values.every((value) => value !== undefined) &&
    values.every((value) => value === values[0]) &&
    !isLanguageNeutral(values[0]) &&
    !isIntentionalEmptySuffix
  ) {
    violations.identicalTranslations.push({ key, value: values[0] });
  }
}

for (const locale of localeNames) {
  for (const key of localeData[locale].duplicateKeys.filter(isSelectedKey)) {
    violations.duplicateLocaleKeys.push({ key, locale });
  }
}

const totalViolations = Object.values(violations).reduce(
  (total, entries) => total + entries.length,
  0,
);
const result = {
  selection: {
    requestedIds: [...requestedIds],
    selectedCatalogIds: selectedLessons.map(({ id }) => id),
  },
  catalog: {
    lessonCount: selectedLessons.length,
    referencedKeyCount: expectedKeys.size,
    keysPerLesson: Object.fromEntries(
      selectedLessons.map(({ id, referencedKeys }) => [id, referencedKeys.length]),
    ),
  },
  localeKeyCounts: Object.fromEntries(
    localeNames.map((locale) => [locale, selectedKeysByLocale[locale].size]),
  ),
  ignoredLegacyUnreferencedKeys: [...localeKeyUnion]
    .filter((key) => legacyUnreferencedKeys.has(key))
    .sort(),
  violations,
  totalViolations,
  pass: totalViolations === 0,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.pass ? 0 : 1);
