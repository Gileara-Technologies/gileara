import { describe, expect, it, vi } from "vitest";
import {
  buildMediaObjectKey,
  isMediaPrefix,
  mediaExtension,
  persistMedia,
} from "@/lib/cms/media-storage";

class FakeBucket {
  puts: Array<{ key: string; value: ArrayBuffer; options?: unknown }> = [];
  put(key: string, value: ArrayBuffer, options?: unknown) {
    this.puts.push({ key, value, options });
    return Promise.resolve({});
  }
}

function makeFile(name: string, bytes: string, type = "image/jpeg"): File {
  const content = new TextEncoder().encode(bytes);
  return new File([content], name, { type });
}

describe("isMediaPrefix", () => {
  it("accepts the two known content types", () => {
    expect(isMediaPrefix("insights")).toBe(true);
    expect(isMediaPrefix("playbooks")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isMediaPrefix("roles")).toBe(false);
    expect(isMediaPrefix("")).toBe(false);
    expect(isMediaPrefix("../etc")).toBe(false);
  });
});

describe("mediaExtension", () => {
  it("extracts lowercased extension and falls back to bin", () => {
    expect(mediaExtension("cover.JPG")).toBe("jpg");
    expect(mediaExtension("photo.webp")).toBe("webp");
    expect(mediaExtension("file")).toBe("bin");
    expect(mediaExtension('weird"name.png')).toBe("png");
  });
});

describe("buildMediaObjectKey", () => {
  it("interpolates prefix, timestamp, random, ext", () => {
    const key = buildMediaObjectKey({
      prefix: "insights",
      extension: "jpg",
      timestampMs: 1730000000000,
      random: "abc123",
    });
    expect(key).toBe("insights/1730000000000-abc123.jpg");
  });

  it("slugifies the random token (path-safety)", () => {
    const key = buildMediaObjectKey({
      prefix: "playbooks",
      extension: "png",
      timestampMs: 1,
      random: "../../etc/passwd",
    });
    expect(key).toBe("playbooks/1-etc-passwd.png");
  });

  it("falls back to 'x' when the random token slugifies to empty", () => {
    const key = buildMediaObjectKey({
      prefix: "insights",
      extension: "jpg",
      timestampMs: 1,
      random: "!!!",
    });
    expect(key).toBe("insights/1-x.jpg");
  });
});

describe("persistMedia", () => {
  it("uploads to R2 and returns the public serve path (success path)", async () => {
    const bucket = new FakeBucket();
    const file = makeFile("cover.jpg", "abc");
    const result = await persistMedia({
      bucket,
      prefix: "insights",
      file,
      nowMs: 1000,
      random: "r1",
    });
    expect(result).toEqual({ ok: true, path: "/api/cms/media/insights/1000-r1.jpg" });
    expect(bucket.puts).toHaveLength(1);
    expect(bucket.puts[0].key).toBe("insights/1000-r1.jpg");
    expect(bucket.puts[0].options).toEqual({ httpMetadata: { contentType: "image/jpeg" } });
  });

  it("returns ok:false when the bucket is missing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await persistMedia({
      bucket: undefined,
      prefix: "playbooks",
      file: makeFile("x.jpg", "a"),
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
    warn.mockRestore();
  });

  it("returns ok:false when bucket.put throws", async () => {
    const bucket = { put: () => Promise.reject(new Error("r2 boom")) };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await persistMedia({
      bucket: bucket as never,
      prefix: "insights",
      file: makeFile("x.jpg", "a"),
    });
    expect(result.ok).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
