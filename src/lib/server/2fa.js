import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

/**
 * Generate a 2FA secret for the user.
 *
 * @param {string} username The username of the user.
 * @returns {Promise<{ otpauth_url: string, base32: string }>} The 2FA secret in otp-auth and base32 format.
 */
export async function generate2FASecret(username) {
  const secret = speakeasy.generateSecret({ length: 20, name: username });

  return {
    otpauth_url: secret.otpauth_url,
    base32: secret.base32
  };
}

/**
 * Generate a QR code for the 2FA setup.
 *
 * @param {string} otpauth_url The otp-auth URL to generate a QR code for.
 * @returns {Promise<string>} The QR code as a data URL.
 */
export async function generate2FAQrCode(otpauth_url) {
  try {
    const qrCode = await qrcode.toDataURL(otpauth_url);
    return qrCode;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

/**
 * Verify a 2FA token against a secret.
 *
 * @param {string} secret The 2FA secret to verify the token against.
 * @param {string} token The 2FA token to verify.
 * @returns {boolean} Whether the token is valid.
 */
export async function verify2FAToken(secret, token) {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token });
}
