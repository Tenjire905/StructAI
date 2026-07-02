#!/bin/bash
set -e

echo "🔍 [Quality Gate] TypeScript Check..."
npx tsc --noEmit
echo "✅ TypeScript: OK"

echo "🔍 [Quality Gate] ESLint..."
npx eslint . --max-warnings 0
echo "✅ ESLint: OK"

echo "🔍 [Quality Gate] Tests..."
npx jest --passWithNoTests
echo "✅ Tests: OK"

echo "🔍 [Quality Gate] Expo Doctor..."
npx expo-doctor || npx expo doctor
echo "✅ Expo Doctor: OK"

echo ""
echo "✅ Quality Gate: PASSED — bereit für nächste Agent-Phase"
