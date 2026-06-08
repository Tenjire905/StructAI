/**
 * ESLint-Konfiguration für StructAI.
 *
 * Zielsetzung:
 *  - Strikt gegen `any`, `TODO`, Platzhalter
 *  - Strikt gegen Cross-Feature-Imports (FSD-Import-Gesetz)
 *  - Strikt gegen Hex/rgba in UI-Dateien (Theme-Token-Pflicht)
 *  - Expo- und TypeScript-Best-Practices
 */
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'web-build/',
    'coverage/',
    '*.config.js',
    '.expo/',
    '__pycache__/',
  ],
  rules: {
    // === ZERO TECHNICAL DEBT ===
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-warning-comments': [
      'error',
      { terms: ['todo', 'fixme', 'xxx', 'placeholder'], location: 'anywhere' },
    ],

    // === LIBRARY WHITELIST ===
    // Verbotene Imports (außerhalb der Whitelist aus instructions.md §5)
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { name: 'axios', message: 'axios ist verboten. Nutze native fetch.' },
          { name: 'moment', message: 'moment ist verboten. Nutze Date/Intl.' },
          { name: 'lodash', message: 'lodash ist verboten. Nutze JS-Standard.' },
          { name: '@tanstack/react-query', message: 'tanstack-query ist verboten.' },
          { name: 'redux', message: 'redux ist verboten. Nutze Zustand.' },
          { name: 'mobx', message: 'mobx ist verboten. Nutze Zustand.' },
          { name: 'date-fns', message: 'date-fns Luxus ist verboten. Nutze Date/Intl.' },
        ],
        patterns: [
          {
            group: ['@/src/*', '@/*'],
            message: 'Erfundene Aliases sind verboten. Nutze src/... oder ./...',
          },
          {
            group: ['../../../*'],
            message: 'Tiefe relative Imports sind verboten. Nutze src/... oder ./...',
          },
        ],
      },
    ],

  },
  overrides: [
    {
      // Cross-Feature-Import-Verbot in src/features/*/model/* und src/features/*/ui/*
      files: ['src/features/*/!(model)/**/*.ts', 'src/features/*/!(model)/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['../../*/!(ui|model|api)/**', '../../../*/!(ui|model|api)/**'],
                message: 'FSD-Import-Gesetz: Features dürfen nicht untereinander importieren.',
              },
            ],
          },
        ],
      },
    },
    {
      // Theme-Token-Pflicht: keine Hex/rgba in UI-Dateien
      files: [
        'src/app/**/*.tsx',
        'src/features/*/ui/**/*.tsx',
        'src/shared/ui/**/*.tsx',
      ],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
            message: 'Hex-Farben in UI-Dateien sind verboten. Nutze theme.colors.*',
          },
          {
            selector: "Literal[value=/^rgba?\\(/]",
            message: 'rgba/rgb in UI-Dateien sind verboten. Nutze theme.colors.*',
          },
        ],
      },
    },
    {
      // Tests dürfen alles (Mocks, etc.)
      files: ['**/*.test.ts', '**/*.test.tsx', '__tests__/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-restricted-imports': 'off',
      },
    },
  ],
};
