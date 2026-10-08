// Session utilities for admin auth
// Uses Web Crypto API (crypto.subtle) with AES-GCM for encrypted session tokens
// No external auth dependencies.

export interface SessionPayload {
  email: string;
  exp: number; // expiration timestamp in seconds
}

export const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Convert ArrayBuffer to base64url
function bufferToBase64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Convert base64url to ArrayBuffer
function base64urlToBuffer(base64url: string): ArrayBuffer {
  // Add padding if needed
  let padded = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4 !== 0) {
    padded += '=';
  }
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-GCM key from secret (must be 32 bytes for AES-256)
async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const hashedKey = await crypto.subtle.digest('SHA-256', keyData);
  return crypto.subtle.importKey('raw', hashedKey, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Create an encrypted session token
 */
export async function createSessionToken(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
  const key = await deriveKey(secret);
  const data = encoder.encode(JSON.stringify(payload));

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  // Format: iv.base64url.ciphertext.base64url
  return `${bufferToBase64url(iv.buffer)}.${bufferToBase64url(ciphertext)}`;
}

/**
 * Read and decrypt a session token. Returns null if invalid, tampered, or expired.
 */
export async function readSessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [ivB64, cipherB64] = parts;
    const iv = new Uint8Array(base64urlToBuffer(ivB64));
    const ciphertext = base64urlToBuffer(cipherB64);

    const key = await deriveKey(secret);
    const decoder = new TextDecoder();

    let plaintext: ArrayBuffer;
    try {
      plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    } catch {
      return null; // Tampered or invalid
    }

    const payload = JSON.parse(decoder.decode(plaintext)) as SessionPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if email is allowed for HR access.
 * Allow if lowercase email has domain @gileara.org OR matches an exact comma-separated entry in hrEmails (trim, case-insensitive).
 * HR_EMAILS unset/empty → domain check only.
 */
export function isAllowedHrEmail(email: string, hrEmails?: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Always allow @gileara.org domain
  if (normalizedEmail.endsWith('@gileara.org')) {
    return true;
  }

  // Check exact comma-separated entries if provided
  if (hrEmails && hrEmails.trim()) {
    const entries = hrEmails.split(',').map((e) => e.toLowerCase().trim()).filter((e) => e.length > 0);
    if (entries.some((entry) => entry === normalizedEmail)) {
      return true;
    }
  }

  return false;
}

/**
 * Create a session payload with 7-day expiry
 */
export function createSessionPayload(email: string): SessionPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    email: email.toLowerCase().trim(),
    exp: now + Math.floor(SESSION_EXPIRY_MS / 1000),
  };
}
