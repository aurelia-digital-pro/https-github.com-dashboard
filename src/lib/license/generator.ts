import { LicenseTier } from '../../types';
import { generateOfflineSignature } from './validator';

/**
 * Generates an authentic offline license key matching a given device fingerprint.
 * Format: AURELIA-[TIER]-[RANDOM_HEX]-[SIGNATURE_HASH]
 */
export function generateLicenseKey(
  tier: LicenseTier,
  fingerprint: string
): string {
  if (tier === 'free') {
    return 'AURELIA-FREE-0000-0000';
  }

  // Create random 8-char hex code
  const randomHex = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .toUpperCase()
    .padStart(8, '0');

  const signature = generateOfflineSignature(tier, randomHex, fingerprint);

  return `AURELIA-${tier.toUpperCase()}-${randomHex}-${signature}`;
}
