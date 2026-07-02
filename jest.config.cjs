/**
 * Jest-Konfiguration für StructAI.
 *
 * - jest-expo-Preset für React-Native-Umgebung
 * - Tests unter __tests__/ und *.test.ts/tsx
 * - Coverage nur für getestete Business-Logic-Module (80 % / 70 % Branches)
 */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/web-build/',
    '/__pycache__/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native-async-storage/.*|zustand|@react-native-community/.*))',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/features/Gamification/model/store.ts',
    'src/features/PromptLab/api/**/*.ts',
    'src/features/APIKeyManager/model/**/*.ts',
    '!**/*.d.ts',
    '!**/types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
  verbose: true,
};
