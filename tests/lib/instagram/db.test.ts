import { describe, expect, it } from "vitest";
import { listInstagramPosts, setInstagramPostVisible } from "@/lib/instagram/db";
import type { D1Like } from "@/lib/portal/db";

interface FakeRow {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption: string | null;
  thumbnail_url: string | null;
  posted_at: string;
  display_order: number | null;
  visible: number;
  synced_at: string;
}

function fakeRow(overrides: Partial<FakeRow> = {}): FakeRow {
  return {
    id: "1",
    media_type: "IMAGE",
    media_url: "https://example.com/1.jpg",
    permalink: "https://instagram.com/p/1",
    caption: "hello",
    thumbnail_url: null,
    posted_at: "2026-01-02T00:00:00+0000",
    display_order: null,
    visible: 1,
    synced_at: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

function makeFakeD1(seeded: FakeRow[] = []) {
  const rows = [...seeded];
  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          if (sql.startsWith("SELECT * FROM cms_instagram_posts ORDER")) {
            const sorted = [...rows].sort(
              (a, b) => (a.posted_at < b.posted_at ? 1 : -1) || (a.id < b.id ? 1 : -1),
            );
            return { results: sorted as unknown as T[] };
          }
          throw new Error(`fake D1: unhandled all(): ${sql}`);
        },
        async first<T = unknown>() {
          if (sql.startsWith("SELECT * FROM cms_instagram_posts WHERE id")) {
            const [id] = binds as [string];
            return (rows.find((r) => r.id === id) as unknown as T) ?? null;
          }
          throw new Error(`fake D1: unhandled first(): ${sql}`);
        },
        async run() {
          if (sql.startsWith("UPDATE cms_instagram_posts SET visible")) {
            const [visible, id] = binds as [number, string];
            const existing = rows.find((r) => r.id === id);
            if (existing) {
              existing.visible = visible;
            }
            return { success: true, meta: { last_row_id: null } };
          }
          throw new Error(`fake D1: unhandled run(): ${sql}`);
        },
      };
      return statement;
    },
  };
  return { db, rows };
}

describe("listInstagramPosts", () => {
  it("returns every row, newest posted_at first", async () => {
    const { db } = makeFakeD1([
      fakeRow({ id: "old", posted_at: "2026-01-01T00:00:00+0000" }),
      fakeRow({ id: "new", posted_at: "2026-02-01T00:00:00+0000" }),
    ]);
    const result = await listInstagramPosts(db);
    expect(result.map((r) => r.id)).toEqual(["new", "old"]);
  });

  it("coerces the stored 0/1 visible column to a boolean", async () => {
    const { db } = makeFakeD1([fakeRow({ id: "a", visible: 0 }), fakeRow({ id: "b", visible: 1 })]);
    const result = await listInstagramPosts(db);
    expect(result.find((r) => r.id === "a")?.visible).toBe(false);
    expect(result.find((r) => r.id === "b")?.visible).toBe(true);
  });

  it("returns [] for an empty table", async () => {
    const { db } = makeFakeD1([]);
    expect(await listInstagramPosts(db)).toEqual([]);
  });
});

describe("setInstagramPostVisible", () => {
  it("flips the visible flag and returns the updated row", async () => {
    const { db } = makeFakeD1([fakeRow({ id: "a", visible: 1 })]);
    const updated = await setInstagramPostVisible(db, "a", false);
    expect(updated?.visible).toBe(false);
  });

  it("returns null when the id does not exist", async () => {
    const { db } = makeFakeD1([]);
    const updated = await setInstagramPostVisible(db, "missing", true);
    expect(updated).toBeNull();
  });
});
