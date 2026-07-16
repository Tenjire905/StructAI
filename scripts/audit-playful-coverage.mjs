/**
 * Audits Playful vs Focus depth coverage for all catalog lessons.
 * Exit 0 when every lesson has structural and copy differentiation.
 */

import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function parseTypeScript(relativePath) {
  const source = readFileSync(join(root, relativePath), 'utf8');
  return ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function findVariableInitializer(sourceFile, variableName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === variableName && declaration.initializer) {
        return declaration.initializer;
      }
    }
  }

  throw new Error(`Could not find ${variableName}`);
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
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

  return initializer.elements.map((element) => {
    const idProperty = objectProperty(element, 'id');
    const id = idProperty.initializer.text;
    return { id, element };
  });
}

function countStepsInProperty(element, propertyNameToFind) {
  const property = objectProperty(element, propertyNameToFind);
  if (!property || !ts.isArrayLiteralExpression(property.initializer)) {
    return 0;
  }

  return property.initializer.elements.filter((step) => ts.isObjectLiteralExpression(step)).length;
}

function readLocaleKeys(relativePath, variableName) {
  const sourceFile = parseTypeScript(relativePath);
  const initializer = findVariableInitializer(sourceFile, variableName);
  const keys = new Set();

  for (const property of initializer.properties) {
    if (ts.isPropertyAssignment(property)) {
      const key = propertyName(property.name);
      if (key) {
        keys.add(key);
      }
    }
  }

  return keys;
}

const deKeys = readLocaleKeys('data/lessonContent/de.ts', 'lessonDe');
const catalog = readCatalog();

const results = catalog.map(({ id, element }) => {
  const focusSteps = countStepsInProperty(element, 'steps');
  const explicitPlayful = countStepsInProperty(element, 'playfulSteps');
  const derivedPlayful = focusSteps <= 2 ? focusSteps : 2;
  const playfulSteps = explicitPlayful > 0 ? explicitPlayful : derivedPlayful;
  const authoredPlayfulKeys = [...deKeys].filter((key) => key.startsWith(`${id}.`) && key.endsWith('.playful')).length;

  return {
    id,
    focusSteps,
    playfulSteps,
    structuralDelta: focusSteps - playfulSteps,
    explicitPlayful,
    authoredPlayfulKeys,
  };
});

const withoutStructuralDelta = results.filter((result) => result.structuralDelta <= 0 && result.focusSteps > 2);
const summary = {
  lessonCount: results.length,
  withExplicitPlayfulSteps: results.filter((result) => result.explicitPlayful > 0).length,
  withStructuralDelta: results.filter((result) => result.structuralDelta > 0).length,
  withAuthoredPlayfulCopy: results.filter((result) => result.authoredPlayfulKeys > 0).length,
  lessonsWithoutStructuralDelta: withoutStructuralDelta.map((result) => result.id),
  allLessonsHavePlayfulDepth: withoutStructuralDelta.length === 0,
};

console.log(JSON.stringify({ summary, results }, null, 2));
process.exit(summary.allLessonsHavePlayfulDepth ? 0 : 1);
