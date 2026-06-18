import { LicenseTier } from '../../types';

// Deterministic salt to secure our client-side license keys
const SECRETE_SALT = 'AURELIA_INTELLIGENCE_SYSTEM_2026';

/**
 * Validates a license key client-side.
 * Format: AURELIA-[TIER]-[RANDOM_HEX]-[HASH]
 */
export function validateLicenseKey(
  key: string,
  fingerprint: string
): { isValid: boolean; tier: LicenseTier; error: string | null } {
  if (!key || typeof key !== 'string') {
    return { isValid: false, tier: 'free', error: 'License key is missing or empty' };
  }

  const cleanKey = key.trim().toUpperCase();
  const parts = cleanKey.split('-');

  if (parts.length !== 4 || parts[0] !== 'AURELIA') {
    return { isValid: false, tier: 'free', error: 'Invalid key structure. Format: AURELIA-[TIER]-[HEX]-[HASH]' };
  }

  const tierStr = parts[1].toLowerCase();
  if (tierStr !== 'pro' && tierStr !== 'elite') {
    return { isValid: false, tier: 'free', error: 'Unknown product tier encoded in license' };
  }

  const randomHex = parts[2];
  const givenHash = parts[3];

  // Recalculate local signature
  const calculatedHash = generateOfflineSignature(tierStr as LicenseTier, randomHex, fingerprint);

  if (givenHash !== calculatedHash) {
    return { isValid: false, tier: 'free', error: 'License integrity check failed (signature mismatch)' };
  }

  return {
    isValid: true,
    tier: tierStr as LicenseTier,
    error: null,
  };
}

/**
 * Computes hash signature using a deterministic checksum method
 */
export function generateOfflineSignature(tier: LicenseTier, randomHex: string, fingerprint: string): string {
  const payload = `${tier.toUpperCase()}:${randomHex}:${fingerprint}:${SECRETE_SALT}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}
