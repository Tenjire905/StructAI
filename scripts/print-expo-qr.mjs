#!/usr/bin/env node
/**
 * Prints Expo Go URL + writes QR PNG.
 * Usage: node scripts/print-expo-qr.mjs [exp-url]
 * Default URL from /tmp/expo-tunnel-url.txt or cloudflared log.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactsDir = process.env.EXPO_QR_OUTPUT_DIR ?? join(root, 'artifacts');
const outputPath = join(artifactsDir, 'expo-go-qr.png');

function resolveExpUrl() {
  if (process.argv[2]) {
    return process.argv[2].startsWith('exp://') ? process.argv[2] : `exp://${process.argv[2]}`;
  }

  const saved = '/tmp/expo-tunnel-url.txt';
  if (existsSync(saved)) {
    return readFileSync(saved, 'utf8').trim();
  }

  const log = '/tmp/cloudflared.log';
  if (existsSync(log)) {
    const match = readFileSync(log, 'utf8').match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
      return `exp://${match[0].replace('https://', '')}`;
    }
  }

  console.error('No exp URL found. Pass as argument or start tunnel first.');
  process.exit(1);
}

const expUrl = resolveExpUrl();

await QRCode.toFile(outputPath, expUrl, { width: 400, margin: 2 });

console.log(JSON.stringify({ expUrl, qrPath: outputPath }, null, 2));
