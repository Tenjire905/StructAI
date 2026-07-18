import * as Sharing from 'expo-sharing';
import { Platform, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';

/** On-screen layout size (~4:5 portrait, social-friendly; taller for skill claim). */
export const CERTIFICATE_LAYOUT_WIDTH = 360;
export const CERTIFICATE_LAYOUT_HEIGHT = 520;

/** High-resolution export target for sharing. */
export const CERTIFICATE_EXPORT_WIDTH = 1080;
export const CERTIFICATE_EXPORT_HEIGHT = 1560;

export type CertificateExportResult = 'shared' | 'downloaded' | 'unavailable';

export async function isCertificateSharingAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return typeof document !== 'undefined';
  }

  return Sharing.isAvailableAsync();
}

async function captureCertificateUri(viewRef: RefObject<View | null>): Promise<string> {
  return captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
    width: CERTIFICATE_EXPORT_WIDTH,
    height: CERTIFICATE_EXPORT_HEIGHT,
  });
}

async function downloadCertificateOnWeb(uri: string, fileName: string): Promise<boolean> {
  if (typeof document === 'undefined') {
    return false;
  }

  const link = document.createElement('a');
  link.href = uri;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

export async function exportCertificateImage(
  viewRef: RefObject<View | null>,
  dialogTitle: string,
  downloadFileName: string,
): Promise<CertificateExportResult> {
  if (Platform.OS === 'web') {
    try {
      const uri = await captureCertificateUri(viewRef);
      const downloaded = await downloadCertificateOnWeb(uri, downloadFileName);
      return downloaded ? 'downloaded' : 'unavailable';
    } catch {
      return 'unavailable';
    }
  }

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    return 'unavailable';
  }

  try {
    const uri = await captureCertificateUri(viewRef);

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      UTI: 'public.png',
      dialogTitle,
    });

    return 'shared';
  } catch {
    return 'unavailable';
  }
}

/** @deprecated Prefer exportCertificateImage */
export async function shareCertificateImage(
  viewRef: RefObject<View | null>,
  dialogTitle: string,
): Promise<'shared' | 'unavailable'> {
  const result = await exportCertificateImage(viewRef, dialogTitle, 'structai-certificate.png');

  if (result === 'downloaded') {
    return 'shared';
  }

  return result;
}
