import * as Sharing from 'expo-sharing';
import { Platform, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';

/** On-screen layout size (4:5 portrait, social-friendly). */
export const CERTIFICATE_LAYOUT_WIDTH = 360;
export const CERTIFICATE_LAYOUT_HEIGHT = 450;

/** High-resolution export target for sharing. */
export const CERTIFICATE_EXPORT_WIDTH = 1080;
export const CERTIFICATE_EXPORT_HEIGHT = 1350;

export async function isCertificateSharingAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  return Sharing.isAvailableAsync();
}

export async function shareCertificateImage(
  viewRef: RefObject<View | null>,
  dialogTitle: string,
): Promise<'shared' | 'unavailable'> {
  if (Platform.OS === 'web') {
    return 'unavailable';
  }

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    return 'unavailable';
  }

  const uri = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
    width: CERTIFICATE_EXPORT_WIDTH,
    height: CERTIFICATE_EXPORT_HEIGHT,
  });

  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle,
  });

  return 'shared';
}
