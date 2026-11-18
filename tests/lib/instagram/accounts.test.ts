import { describe, expect, it } from "vitest";
import { instagramSecretNames, readInstagramCredentials } from "@/lib/instagram/accounts";
import { instagramAccounts, socialProfiles } from "@/content/site-config";

describe("instagramAccounts", () => {
  it("lists @gileara and @ins.gileara with distinct secret suffixes", () => {
    expect(instagramAccounts.map((a) => a.handle)).toEqual(["gileara", "ins.gileara"]);
    expect(new Set(instagramAccounts.map((a) => a.envSuffix)).size).toBe(instagramAccounts.length);
  });

  it("is mirrored in socialProfiles (footer + JSON-LD sameAs) after LinkedIn", () => {
    expect(socialProfiles.map((p) => p.label)).toEqual(["LinkedIn", "@gileara", "@ins.gileara"]);
  });
});

describe("instagramSecretNames", () => {
  it("keeps the original names for the unsuffixed account", () => {
    expect(instagramSecretNames({ envSuffix: "" })).toEqual({
      token: "INSTAGRAM_ACCESS_TOKEN",
      accountId: "INSTAGRAM_BUSINESS_ACCOUNT_ID",
    });
  });

  it("suffixes both names for the second account", () => {
    expect(instagramSecretNames({ envSuffix: "_INS" })).toEqual({
      token: "INSTAGRAM_ACCESS_TOKEN_INS",
      accountId: "INSTAGRAM_BUSINESS_ACCOUNT_ID_INS",
    });
  });
});

describe("readInstagramCredentials", () => {
  const env = {
    INSTAGRAM_ACCESS_TOKEN: "tok-main",
    INSTAGRAM_BUSINESS_ACCOUNT_ID: "111",
    INSTAGRAM_ACCESS_TOKEN_INS: "tok-ins",
    INSTAGRAM_BUSINESS_ACCOUNT_ID_INS: "",
  };

  it("returns both values when both secrets are non-empty strings", () => {
    expect(readInstagramCredentials(env, { envSuffix: "" })).toEqual({
      accessToken: "tok-main",
      businessAccountId: "111",
    });
  });

  it("returns null when either secret is missing or empty", () => {
    expect(readInstagramCredentials(env, { envSuffix: "_INS" })).toBeNull();
    expect(readInstagramCredentials({}, { envSuffix: "" })).toBeNull();
    expect(readInstagramCredentials({ INSTAGRAM_ACCESS_TOKEN: 5, INSTAGRAM_BUSINESS_ACCOUNT_ID: "1" }, { envSuffix: "" })).toBeNull();
  });
});
