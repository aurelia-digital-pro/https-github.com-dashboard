'use client';

import { useLocalStorage } from './useLocalStorage';
import { getDeviceFingerprint } from '../lib/license/fingerprint';
import { validateLicenseKey } from '../lib/license/validator';
import { UserLicense, LicenseTier } from '../types';
import { useEffect, useState } from 'react';

const DEFAULT_LICENSE: UserLicense = {
  code: '',
  tier: 'free',
  deviceFingerprint: '',
  activatedAt: '',
  expiry: null,
};

/**
 * React hook to manage product licensing state and Tier feature-gating restrictions.
 */
export function useLicense() {
  const [storedLicense, setStoredLicense] = useLocalStorage<UserLicense>('aurelia_license', DEFAULT_LICENSE);
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    // Generate device fingerprint once in client browser
    const handle = requestAnimationFrame(() => {
      setFingerprint(getDeviceFingerprint());
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const activate = (code: string): { success: boolean; error: string | null } => {
    const check = validateLicenseKey(code, fingerprint);

    if (check.isValid) {
      const activeLicense: UserLicense = {
        code: code.trim().toUpperCase(),
        tier: check.tier,
        deviceFingerprint: fingerprint,
        activatedAt: new Date().toISOString(),
        expiry: null,
      };
      setStoredLicense(activeLicense);
      return { success: true, error: null };
    };

    return { success: false, error: check.error };
  };

  const deactivate = (): void => {
    setStoredLicense({
      code: '',
      tier: 'free',
      deviceFingerprint: fingerprint,
      activatedAt: '',
      expiry: null,
    });
  };

  // Determine current effective tier
  const isLicensed = storedLicense.tier === 'pro' || storedLicense.tier === 'elite';
  const currentTier: LicenseTier = storedLicense.tier;

  return {
    license: storedLicense,
    fingerprint,
    currentTier,
    isLicensed,
    activate,
    deactivate,
    // Gated feature capabilities
    canAccessSMC: currentTier === 'pro' || currentTier === 'elite',
    canAccessEliteAI: currentTier === 'elite',
    canTrackInfintePortfolio: currentTier === 'pro' || currentTier === 'elite',
    canCreateWebhookAlerts: currentTier === 'elite',
  };
}
