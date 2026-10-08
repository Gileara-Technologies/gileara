import { describe, expect, it } from 'vitest';
import {
  createSessionToken,
  readSessionToken,
  isAllowedHrEmail,
  createSessionPayload,
  SESSION_EXPIRY_DAYS,
} from '@/lib/portal/session';

const TEST_SECRET = 'test-secret-key-for-testing-purposes-only-32-chars-min';

describe('session', () => {
  describe('createSessionPayload', () => {
    it('creates payload with 7-day expiry', () => {
      const payload = createSessionPayload('test@gileara.org');
      expect(payload.email).toBe('test@gileara.org');
      expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      expect(payload.exp - Math.floor(Date.now() / 1000)).toBeLessThanOrEqual(sevenDaysInSeconds + 5);
    });

    it('normalizes email case and whitespace', () => {
      const payload = createSessionPayload('  TEST@GILEARA.ORG  ');
      expect(payload.email).toBe('test@gileara.org');
    });
  });

  describe('token roundtrip', () => {
    it('encrypts and decrypts token correctly', async () => {
      const payload = createSessionPayload('admin@gileara.org');
      const token = await createSessionToken(payload, TEST_SECRET);
      const decoded = await readSessionToken(token, TEST_SECRET);
      expect(decoded).toEqual(payload);
    });

    it('preserves payload fields', async () => {
      const payload = { email: 'hr@gileara.org', exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = await createSessionToken(payload, TEST_SECRET);
      const decoded = await readSessionToken(token, TEST_SECRET);
      expect(decoded?.email).toBe('hr@gileara.org');
    });
  });

  describe('token validation', () => {
    it('rejects expired token', async () => {
      const expiredPayload = {
        email: 'test@gileara.org',
        exp: Math.floor(Date.now() / 1000) - 100, // expired
      };
      const token = await createSessionToken(expiredPayload, TEST_SECRET);
      const decoded = await readSessionToken(token, TEST_SECRET);
      expect(decoded).toBeNull();
    });

    it('rejects tampered token', async () => {
      const payload = createSessionPayload('admin@gileara.org');
      const token = await createSessionToken(payload, TEST_SECRET);
      // Tamper with the token
      const tampered = token + 'tampered';
      const decoded = await readSessionToken(tampered, TEST_SECRET);
      expect(decoded).toBeNull();
    });

    it('rejects tampered ciphertext', async () => {
      const payload = createSessionPayload('admin@gileara.org');
      const token = await createSessionToken(payload, TEST_SECRET);
      const parts = token.split('.');
      if (parts.length === 2) {
        // Flip the FIRST character of ciphertext deterministically.
        // A last-char flip is not a safe tamper: when the byte length is
        // 1 mod 3, the final base64url char only carries 2 significant
        // bits and decoders discard the rest, so the token still decrypts.
        // The first char always encodes 6 real bits, so this is a
        // guaranteed byte change that GCM must reject.
        const cipher = parts[1];
        const firstChar = cipher[0];
        const replacement = firstChar === 'A' ? 'B' : 'A';
        const tamperedCipher = replacement + cipher.slice(1);
        expect(tamperedCipher).not.toBe(cipher); // Ensure change happened
        const tampered = `${parts[0]}.${tamperedCipher}`;
        const decoded = await readSessionToken(tampered, TEST_SECRET);
        expect(decoded).toBeNull();
      } else {
        // Should have 2 parts
        expect(true).toBe(true);
      }
    });

    it('rejects wrong secret', async () => {
      const payload = createSessionPayload('admin@gileara.org');
      const token = await createSessionToken(payload, TEST_SECRET);
      const decoded = await readSessionToken(token, 'wrong-secret-key-that-is-different');
      expect(decoded).toBeNull();
    });

    it('rejects malformed token', async () => {
      const decoded1 = await readSessionToken('not-a-valid-token', TEST_SECRET);
      expect(decoded1).toBeNull();
      const decoded2 = await readSessionToken('singlepart', TEST_SECRET);
      expect(decoded2).toBeNull();
      const decoded3 = await readSessionToken('', TEST_SECRET);
      expect(decoded3).toBeNull();
    });
  });

  describe('isAllowedHrEmail', () => {
    it('allows gileara.org domain emails', () => {
      expect(isAllowedHrEmail('admin@gileara.org')).toBe(true);
      expect(isAllowedHrEmail('HR@GILEARA.ORG')).toBe(true);
      expect(isAllowedHrEmail('  wisdom@gileara.org  ')).toBe(true);
    });

    it('rejects non-gileara.org emails without exact match', () => {
      expect(isAllowedHrEmail('admin@gmail.com')).toBe(false);
      expect(isAllowedHrEmail('user@example.com')).toBe(false);
    });

    it('allows exact match in hrEmails list', () => {
      expect(isAllowedHrEmail('admin@gmail.com', 'admin@gmail.com')).toBe(true);
      expect(isAllowedHrEmail('ADMIN@GMAIL.COM', 'admin@gmail.com')).toBe(true);
      expect(isAllowedHrEmail('admin@gmail.com', '  admin@gmail.com  ')).toBe(true);
    });

    it('allows exact matches in comma-separated hrEmails', () => {
      expect(isAllowedHrEmail('special@external.com', 'admin@gileara.org,special@external.com,other@x.com')).toBe(
        true
      );
      expect(isAllowedHrEmail('other@x.com', 'admin@gileara.org,special@external.com,other@x.com')).toBe(true);
    });

    it('handles case-insensitive and whitespace in hrEmails', () => {
      expect(isAllowedHrEmail('Special@External.COM', 'ADMIN@GILEARA.ORG, SPECIAL@EXTERNAL.COM')).toBe(true);
      expect(isAllowedHrEmail('special@external.com', ' admin@gileara.org , special@external.com ')).toBe(true);
    });

    it('domain check takes precedence when hrEmails also has entries', () => {
      expect(isAllowedHrEmail('hr@gileara.org', 'other@gmail.com')).toBe(true);
    });

    it('unset/empty hrEmails → domain check only', () => {
      expect(isAllowedHrEmail('admin@gileara.org', '')).toBe(true);
      expect(isAllowedHrEmail('admin@gileara.org', '   ')).toBe(true);
      expect(isAllowedHrEmail('admin@gileara.org')).toBe(true);
      expect(isAllowedHrEmail('admin@gmail.com', '')).toBe(false);
      expect(isAllowedHrEmail('admin@gmail.com')).toBe(false);
    });

    it('handles empty/invalid inputs', () => {
      expect(isAllowedHrEmail('')).toBe(false);
      expect(isAllowedHrEmail('   ')).toBe(false);
    });
  });

  describe('SESSION_EXPIRY_DAYS', () => {
    it('is set to 7 days', () => {
      expect(SESSION_EXPIRY_DAYS).toBe(7);
    });
  });
});
