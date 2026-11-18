/**
 * Reads one Instagram account's credentials from a Cloudflare env record.
 * Each account in src/content/site-config.ts's `instagramAccounts` has an
 * `envSuffix`: "" reads INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID,
 * "_INS" reads INSTAGRAM_ACCESS_TOKEN_INS / INSTAGRAM_BUSINESS_ACCOUNT_ID_INS.
 *
 * Pure: takes the env as an argument so the admin page, the sync action,
 * and tests all share one rule for "is this account configured?".
 */

export interface InstagramCredentials {
  accessToken: string;
  businessAccountId: string;
}

export function instagramSecretNames(account: { envSuffix: string }): {
  token: string;
  accountId: string;
} {
  return {
    token: `INSTAGRAM_ACCESS_TOKEN${account.envSuffix}`,
    accountId: `INSTAGRAM_BUSINESS_ACCOUNT_ID${account.envSuffix}`,
  };
}

/** Both secrets as non-empty strings, or null when either is missing. */
export function readInstagramCredentials(
  env: Record<string, unknown>,
  account: { envSuffix: string },
): InstagramCredentials | null {
  const names = instagramSecretNames(account);
  const accessToken = env[names.token];
  const businessAccountId = env[names.accountId];
  if (typeof accessToken !== "string" || accessToken === "") return null;
  if (typeof businessAccountId !== "string" || businessAccountId === "") return null;
  return { accessToken, businessAccountId };
}
