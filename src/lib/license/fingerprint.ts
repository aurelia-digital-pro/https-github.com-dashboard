/**
 * Browser-based device fingerprint generator.
 * Combines screen data, user agent details, timezone, and language.
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'SSR-ENVIRONMENT';
  }

  try {
    const screenWidth = window.screen?.width || 0;
    const screenHeight = window.screen?.height || 0;
    const colorDepth = window.screen?.colorDepth || 0;
    const userAgent = window.navigator?.userAgent || '';
    const language = window.navigator?.language || '';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Create a composite string of the device characteristics
    const rawString = `${screenWidth}x${screenHeight}:${colorDepth}:${userAgent}:${language}:${timezone}`;
    
    // Quick hashing function
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }

    return `AURELIA-${Math.abs(hash).toString(16).toUpperCase()}`;
  } catch (e) {
    return 'AURELIA-UNKNOWN-CLIENT';
  }
}
