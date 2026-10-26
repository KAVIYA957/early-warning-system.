/**
 * JWT Security Configuration & Secret Validation
 * Prevents silent fallback to insecure placeholder secrets in production
 */

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is required in production.');
    }
    return 'development_only_insecure_fallback_key_2026';
  }

  if (process.env.NODE_ENV === 'production') {
    if (secret.length < 32 || secret.includes('your_jwt_secret') || secret.includes('change_in_production')) {
      throw new Error('FATAL SECURITY ERROR: Insecure or placeholder JWT_SECRET detected in production environment.');
    }
  }

  return secret;
}

export function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '7d';
}
