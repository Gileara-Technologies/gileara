import { describe, expect, it, vi } from "vitest";
import {
  buildResumeObjectKey,
  persistResume,
  resumeExtension,
  sanitizeRoleSlug,
} from "@/lib/portal/resume-storage";
import type { D1Like, D1PreparedStatementLike } from "@/lib/portal/db";

function makeFakeDb(): D1Like {
  const prepares: string[] = [];
  const binds: unknown[][] = [];
  const runs: boolean[] = [];
  return {
    prepare(sql: string): D1PreparedStatementLike {
      prepares.push(sql);
      return {
        bind(...values: unknown[]): D1PreparedStatementLike {
          binds.push(values);
          return this;
        },
        all<T = unknown>(): Promise<{ results: T[] }> {
          return Promise.resolve({ results: [] as T[] });
        },
        first<T = unknown>(): Promise<T | null> {
          return Promise.resolve(null);
        },
        run(): Promise<{ success: boolean; meta: { last_row_id: number | null } }> {
          runs.push(true);
          return Promise.resolve({
            success: true,
            meta: { last_row_id: null },
          });
        },
      };
    },
  } as D1Like;
}

class FakeBucket {
  puts: Array<{ key: string; value: ArrayBuffer; options?: unknown }> = [];
  put(key: string, value: ArrayBuffer, options?: unknown) {
    this.puts.push({ key, value, options });
    return Promise.resolve({});
  }
}

function makeFile(name: string, bytes: string | Uint8Array, type = "application/pdf"): File {
  const content = typeof bytes === "string" ? new TextEncoder().encode(bytes) : new Uint8Array(bytes);
  return new File([content], name, { type });
}

describe("resume storage helpers", () => {
  it("buildResumeObjectKey interpolates timestamp, id, slug, ext", () => {
    const key = buildResumeObjectKey({
      roleSlug: "frontend-engineer",
      applicationId: 42,
      extension: "pdf",
      timestampMs: 1730000000000,
    });
    expect(key).toBe("applications/frontend-engineer/1730000000000-42.pdf");
  });

  it("sanitizeRoleSlug lowercases, replaces non-alnum, trims, falls back to general", () => {
    expect(sanitizeRoleSlug("Frontend Engineer")).toBe("frontend-engineer");
    expect(sanitizeRoleSlug("UI/UX")).toBe("ui-ux");
    expect(sanitizeRoleSlug("")).toBe("general");
    expect(sanitizeRoleSlug("   ")).toBe("general");
    expect(sanitizeRoleSlug("!!!")).toBe("general");
  });

  it("resumeExtension extracts lowercased extension and falls back to bin", () => {
    expect(resumeExtension("resume.PDF")).toBe("pdf");
    expect(resumeExtension("my.CV.docx")).toBe("docx");
    expect(resumeExtension("file.DOC")).toBe("doc");
    expect(resumeExtension("file")).toBe("bin");
    expect(resumeExtension("file.tar.gz")).toBe("gz");
    expect(resumeExtension('file"weird.pdf')).toBe("pdf");
  });

  it("persistResume uploads to R2 and updates D1 resume_key (success path)", async () => {
    const db = makeFakeDb();
    const bucket = new FakeBucket();
    const file = makeFile("resume.pdf", "abc");
    const ok = await persistResume({
      bucket,
      db,
      applicationId: 7,
      roleSlug: "frontend",
      file,
      nowMs: 1000,
    });
    expect(ok).toBe(true);
    expect(bucket.puts).toHaveLength(1);
    expect(bucket.puts[0].key).toBe("applications/frontend/1000-7.pdf");
    expect(bucket.puts[0].options).toEqual({
      httpMetadata: { contentType: "application/pdf" },
    });
  });

  it("persistResume is fail-open when bucket missing", async () => {
    const db = makeFakeDb();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const ok = await persistResume({
      bucket: undefined,
      db,
      applicationId: 1,
      roleSlug: "general",
      file: makeFile("r.pdf", "x"),
    });
    expect(ok).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("persistResume is fail-open when bucket.put throws", async () => {
    const db = makeFakeDb();
    const bucket = {
      put: () => Promise.reject(new Error("r2 boom")),
    } as unknown as { put: () => Promise<unknown> };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const ok = await persistResume({
      bucket: bucket as never,
      db,
      applicationId: 2,
      roleSlug: "backend",
      file: makeFile("r.docx", "y"),
    });
    expect(ok).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("persistResume is fail-open when db.update throws", async () => {
    const db = {
      prepare() {
        return {
          bind() {
            return this;
          },
          all() {
            return Promise.resolve({ results: [] });
          },
          first() {
            return Promise.resolve(null);
          },
          run() {
            return Promise.reject(new Error("d1 boom"));
          },
        } as D1PreparedStatementLike;
      },
    } as D1Like;
    const bucket = new FakeBucket();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const ok = await persistResume({
      bucket,
      db,
      applicationId: 3,
      roleSlug: "devops",
      file: makeFile("r.doc", "z"),
    });
    expect(ok).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("key uses roleSlug fallback 'general' when unresolved/empty", () => {
    const key = buildResumeObjectKey({
      roleSlug: "",
      applicationId: 5,
      extension: "pdf",
      timestampMs: 1,
    });
    expect(key).toBe("applications/general/1-5.pdf");
  });
});
