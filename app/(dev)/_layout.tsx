import { Redirect, Stack } from 'expo-router';

/**
 * Dev-only preview routes. Route group (dev) keeps URLs unchanged (/dev-preview, …).
 * Production: root layout omits this group; this redirect is defense in depth.
 */
export default function DevLayout() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
