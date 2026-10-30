import { describe, expect, it } from "vitest";
import {
  createFaq,
  createPost,
  createScenario,
  deleteFaq,
  deletePost,
  deleteScenario,
  getFaq,
  getPost,
  getScenario,
  listFaqs,
  listPosts,
  listScenarios,
  setFaqStatus,
  setPostStatus,
  setScenarioContentStatus,
  setScenarioStage,
  updateFaq,
  updatePost,
  updateScenario,
} from "@/lib/cms/db";
import type { D1Like } from "@/lib/portal/db";
import type { FaqRow, ParsedScenario, PostRow } from "@/lib/cms/types";

// ---------------------------------------------------------------------------
// Tiny in-memory fake D1 for cms_faqs: implements exactly the surface
// db.ts calls (prepare().bind().all()/first()/run()), same pattern as
// tests/lib/portal/db.test.ts's fake.
// ---------------------------------------------------------------------------

function faq(overrides: Partial<FaqRow> = {}): FaqRow {
  return {
    id: 1,
    question: "How much does it cost?",
    answer: "It depends on the package.",
    display_order: 0,
    status: "draft",
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
    updated_by: null,
    ...overrides,
  };
}

function makeFakeD1(seeded: { faqs?: FaqRow[] } = {}) {
  const state = {
    faqs: [...(seeded.faqs ?? [])],
    nextId: (seeded.faqs?.length ?? 0) + 1,
    now: (): string => "2026-06-01 12:00:00",
  };

  const byOrder = (a: FaqRow, b: FaqRow): number =>
    a.display_order - b.display_order || a.id - b.id;

  const execute = (sql: string, binds: unknown[]): { results: unknown[]; lastRowId?: number } => {
    if (sql.startsWith("UPDATE cms_faqs SET status")) {
      const [status, actorEmail, id] = binds as [FaqRow["status"], string, number];
      const row = state.faqs.find((f) => f.id === id);
      if (row) {
        row.status = status;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE cms_faqs SET question")) {
      const [question, answer, displayOrder, actorEmail, id] = binds as [
        string,
        string,
        number,
        string,
        number,
      ];
      const row = state.faqs.find((f) => f.id === id);
      if (row) {
        row.question = question;
        row.answer = answer;
        row.display_order = displayOrder;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("INSERT INTO cms_faqs")) {
      const [question, answer, displayOrder, actorEmail] = binds as [
        string,
        string,
        number,
        string,
      ];
      const row: FaqRow = {
        id: state.nextId,
        question,
        answer,
        display_order: displayOrder,
        status: "draft",
        created_at: state.now(),
        updated_at: state.now(),
        updated_by: actorEmail,
      };
      state.nextId += 1;
      state.faqs.push(row);
      return { results: [], lastRowId: row.id };
    }
    if (sql.startsWith("DELETE FROM cms_faqs")) {
      const [id] = binds as [number];
      const before = state.faqs.length;
      state.faqs = state.faqs.filter((f) => f.id !== id);
      return { results: [], lastRowId: state.faqs.length < before ? 1 : undefined };
    }
    if (sql.startsWith("SELECT * FROM cms_faqs WHERE status")) {
      const [status] = binds as [FaqRow["status"]];
      return { results: state.faqs.filter((f) => f.status === status).sort(byOrder) };
    }
    if (sql.startsWith("SELECT * FROM cms_faqs WHERE id")) {
      const [id] = binds as [number];
      return { results: state.faqs.filter((f) => f.id === id) };
    }
    if (sql.startsWith("SELECT * FROM cms_faqs ORDER")) {
      return { results: [...state.faqs].sort(byOrder) };
    }
    throw new Error(`fake D1: unhandled query: ${sql}`);
  };

  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          const { results } = execute(sql, binds);
          return { results: results as T[] };
        },
        async first<T = unknown>() {
          const { results } = execute(sql, binds);
          return (results[0] as T) ?? null;
        },
        async run() {
          const { lastRowId } = execute(sql, binds);
          return { success: true, meta: { last_row_id: lastRowId ?? null } };
        },
      };
      return statement;
    },
  };

  return { db, state };
}

describe("listFaqs", () => {
  it("returns every FAQ ordered by display_order then id", () => {
    const fake = makeFakeD1({
      faqs: [
        faq({ id: 1, display_order: 2 }),
        faq({ id: 2, display_order: 0 }),
        faq({ id: 3, display_order: 1 }),
      ],
    });
    return listFaqs(fake.db).then((rows) => {
      expect(rows.map((r) => r.id)).toEqual([2, 3, 1]);
    });
  });

  it("filters by status when given", async () => {
    const fake = makeFakeD1({
      faqs: [
        faq({ id: 1, status: "draft" }),
        faq({ id: 2, status: "published" }),
      ],
    });
    const published = await listFaqs(fake.db, "published");
    expect(published.map((r) => r.id)).toEqual([2]);
  });

  it("returns [] when there are no FAQs", async () => {
    const fake = makeFakeD1();
    expect(await listFaqs(fake.db)).toEqual([]);
  });
});

describe("getFaq", () => {
  it("returns the matching row", async () => {
    const fake = makeFakeD1({ faqs: [faq({ id: 7, question: "Specific?" })] });
    const row = await getFaq(fake.db, 7);
    expect(row?.question).toBe("Specific?");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeD1();
    expect(await getFaq(fake.db, 999)).toBeNull();
  });
});

describe("createFaq", () => {
  it("inserts a new FAQ as draft, stamped with the actor email", async () => {
    const fake = makeFakeD1();
    const created = await createFaq(
      fake.db,
      { question: "New question?", answer: "New answer." },
      "jude.gileara@gmail.com",
    );
    expect(created?.question).toBe("New question?");
    expect(created?.status).toBe("draft");
    expect(created?.updated_by).toBe("jude.gileara@gmail.com");
  });

  it("defaults displayOrder to 0 when omitted", async () => {
    const fake = makeFakeD1();
    const created = await createFaq(fake.db, { question: "Q", answer: "A" }, "x@gmail.com");
    expect(created?.display_order).toBe(0);
  });
});

describe("updateFaq", () => {
  it("updates only the given fields, keeping the rest, and stamps the actor", async () => {
    const fake = makeFakeD1({
      faqs: [faq({ id: 1, question: "Old Q", answer: "Old A", display_order: 3 })],
    });
    const updated = await updateFaq(fake.db, 1, { answer: "New A" }, "mary.gileara@gmail.com");
    expect(updated?.question).toBe("Old Q");
    expect(updated?.answer).toBe("New A");
    expect(updated?.display_order).toBe(3);
    expect(updated?.updated_by).toBe("mary.gileara@gmail.com");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeD1();
    expect(await updateFaq(fake.db, 999, { answer: "A" }, "x@gmail.com")).toBeNull();
  });
});

describe("setFaqStatus", () => {
  it("moves a FAQ from draft to published and stamps the actor", async () => {
    const fake = makeFakeD1({ faqs: [faq({ id: 1, status: "draft" })] });
    const updated = await setFaqStatus(fake.db, 1, "published", "jude.gileara@gmail.com");
    expect(updated?.status).toBe("published");
    expect(updated?.updated_by).toBe("jude.gileara@gmail.com");
  });
});

describe("deleteFaq", () => {
  it("removes the row and returns true", async () => {
    const fake = makeFakeD1({ faqs: [faq({ id: 1 })] });
    const ok = await deleteFaq(fake.db, 1);
    expect(ok).toBe(true);
    expect(await getFaq(fake.db, 1)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Insight posts (migrations/0005_create-cms-posts.sql)
// ---------------------------------------------------------------------------

function post(overrides: Partial<PostRow> = {}): PostRow {
  return {
    id: 1,
    slug: "a-post",
    title: "A Post",
    excerpt: "An excerpt.",
    post_date: "2026-01-01",
    author: "Amos Frederick Hughes",
    tag: "Operations",
    image: null,
    body: "Some body text.",
    status: "draft",
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
    updated_by: null,
    ...overrides,
  };
}

function makeFakePostsD1(seeded: { posts?: PostRow[] } = {}) {
  const state = {
    posts: [...(seeded.posts ?? [])],
    nextId: (seeded.posts?.length ?? 0) + 1,
    now: (): string => "2026-06-01 12:00:00",
  };

  const byDateDesc = (a: PostRow, b: PostRow): number =>
    a.post_date < b.post_date ? 1 : a.post_date > b.post_date ? -1 : b.id - a.id;

  const execute = (sql: string, binds: unknown[]): { results: unknown[]; lastRowId?: number } => {
    if (sql.startsWith("UPDATE cms_posts SET status")) {
      const [status, actorEmail, id] = binds as [PostRow["status"], string, number];
      const row = state.posts.find((p) => p.id === id);
      if (row) {
        row.status = status;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE cms_posts SET title")) {
      const [title, excerpt, postDate, author, tag, image, body, actorEmail, id] = binds as [
        string,
        string,
        string,
        string,
        PostRow["tag"],
        string | null,
        string,
        string,
        number,
      ];
      const row = state.posts.find((p) => p.id === id);
      if (row) {
        row.title = title;
        row.excerpt = excerpt;
        row.post_date = postDate;
        row.author = author;
        row.tag = tag;
        row.image = image;
        row.body = body;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("INSERT INTO cms_posts")) {
      const [slug, title, excerpt, postDate, author, tag, image, body, actorEmail] = binds as [
        string,
        string,
        string,
        string,
        string,
        PostRow["tag"],
        string | null,
        string,
        string,
      ];
      const row: PostRow = {
        id: state.nextId,
        slug,
        title,
        excerpt,
        post_date: postDate,
        author,
        tag,
        image,
        body,
        status: "draft",
        created_at: state.now(),
        updated_at: state.now(),
        updated_by: actorEmail,
      };
      state.nextId += 1;
      state.posts.push(row);
      return { results: [], lastRowId: row.id };
    }
    if (sql.startsWith("DELETE FROM cms_posts")) {
      const [id] = binds as [number];
      const before = state.posts.length;
      state.posts = state.posts.filter((p) => p.id !== id);
      return { results: [], lastRowId: state.posts.length < before ? 1 : undefined };
    }
    if (sql.startsWith("SELECT * FROM cms_posts WHERE status")) {
      const [status] = binds as [PostRow["status"]];
      return { results: state.posts.filter((p) => p.status === status).sort(byDateDesc) };
    }
    if (sql.startsWith("SELECT * FROM cms_posts WHERE id")) {
      const [id] = binds as [number];
      return { results: state.posts.filter((p) => p.id === id) };
    }
    if (sql.startsWith("SELECT slug FROM cms_posts")) {
      return { results: state.posts.map((p) => ({ slug: p.slug })) };
    }
    if (sql.startsWith("SELECT * FROM cms_posts ORDER")) {
      return { results: [...state.posts].sort(byDateDesc) };
    }
    throw new Error(`fake D1: unhandled query: ${sql}`);
  };

  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          const { results } = execute(sql, binds);
          return { results: results as T[] };
        },
        async first<T = unknown>() {
          const { results } = execute(sql, binds);
          return (results[0] as T) ?? null;
        },
        async run() {
          const { lastRowId } = execute(sql, binds);
          return { success: true, meta: { last_row_id: lastRowId ?? null } };
        },
      };
      return statement;
    },
  };

  return { db, state };
}

describe("listPosts", () => {
  it("returns posts ordered by post_date descending", async () => {
    const fake = makeFakePostsD1({
      posts: [
        post({ id: 1, post_date: "2026-01-01" }),
        post({ id: 2, post_date: "2026-03-01" }),
        post({ id: 3, post_date: "2026-02-01" }),
      ],
    });
    const rows = await listPosts(fake.db);
    expect(rows.map((r) => r.id)).toEqual([2, 3, 1]);
  });

  it("filters by status when given", async () => {
    const fake = makeFakePostsD1({
      posts: [post({ id: 1, status: "draft" }), post({ id: 2, status: "published" })],
    });
    const published = await listPosts(fake.db, "published");
    expect(published.map((r) => r.id)).toEqual([2]);
  });

  it("returns [] when there are no posts", async () => {
    const fake = makeFakePostsD1();
    expect(await listPosts(fake.db)).toEqual([]);
  });
});

describe("getPost", () => {
  it("returns the matching row", async () => {
    const fake = makeFakePostsD1({ posts: [post({ id: 7, title: "Specific" })] });
    const row = await getPost(fake.db, 7);
    expect(row?.title).toBe("Specific");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakePostsD1();
    expect(await getPost(fake.db, 999)).toBeNull();
  });
});

describe("createPost", () => {
  it("inserts a new post as draft, generating a slug from the title", async () => {
    const fake = makeFakePostsD1();
    const created = await createPost(
      fake.db,
      {
        title: "A Brand New Post",
        excerpt: "Excerpt.",
        postDate: "2026-06-01",
        author: "Jude",
        tag: "Growth",
        body: "Body.",
      },
      "jude.gileara@gmail.com",
    );
    expect(created?.slug).toBe("a-brand-new-post");
    expect(created?.status).toBe("draft");
    expect(created?.updated_by).toBe("jude.gileara@gmail.com");
  });

  it("appends a numeric suffix when the generated slug collides", async () => {
    const fake = makeFakePostsD1({ posts: [post({ id: 1, slug: "a-post", title: "A Post" })] });
    const created = await createPost(
      fake.db,
      { title: "A Post", excerpt: "E", postDate: "2026-06-01", author: "A", tag: "Growth", body: "B" },
      "x@gmail.com",
    );
    expect(created?.slug).toBe("a-post-2");
  });

  it("stores a null image when omitted", async () => {
    const fake = makeFakePostsD1();
    const created = await createPost(
      fake.db,
      { title: "T", excerpt: "E", postDate: "2026-06-01", author: "A", tag: "Growth", body: "B" },
      "x@gmail.com",
    );
    expect(created?.image).toBeNull();
  });
});

describe("updatePost", () => {
  it("updates only the given fields, keeping the rest, and stamps the actor", async () => {
    const fake = makeFakePostsD1({
      posts: [post({ id: 1, title: "Old Title", excerpt: "Old excerpt", tag: "Operations" })],
    });
    const updated = await updatePost(fake.db, 1, { excerpt: "New excerpt" }, "mary.gileara@gmail.com");
    expect(updated?.title).toBe("Old Title");
    expect(updated?.excerpt).toBe("New excerpt");
    expect(updated?.tag).toBe("Operations");
    expect(updated?.updated_by).toBe("mary.gileara@gmail.com");
  });

  it("does not touch the slug (it is fixed after creation)", async () => {
    const fake = makeFakePostsD1({ posts: [post({ id: 1, slug: "fixed-slug" })] });
    await updatePost(fake.db, 1, { title: "New title" }, "x@gmail.com");
    const row = await getPost(fake.db, 1);
    expect(row?.slug).toBe("fixed-slug");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakePostsD1();
    expect(await updatePost(fake.db, 999, { title: "T" }, "x@gmail.com")).toBeNull();
  });
});

describe("setPostStatus", () => {
  it("moves a post from draft to published and stamps the actor", async () => {
    const fake = makeFakePostsD1({ posts: [post({ id: 1, status: "draft" })] });
    const updated = await setPostStatus(fake.db, 1, "published", "jude.gileara@gmail.com");
    expect(updated?.status).toBe("published");
    expect(updated?.updated_by).toBe("jude.gileara@gmail.com");
  });
});

describe("deletePost", () => {
  it("removes the row and returns true", async () => {
    const fake = makeFakePostsD1({ posts: [post({ id: 1 })] });
    const ok = await deletePost(fake.db, 1);
    expect(ok).toBe(true);
    expect(await getPost(fake.db, 1)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Playbooks (migrations/0006_create-cms-scenarios.sql)
//
// Unlike FaqRow/PostRow, cms_scenarios has JSON-string columns that
// toParsedScenario() parses internally -- so the fake's stored rows stay
// in the RAW (JSON-as-string) shape, exactly like a real D1 row, and
// every assertion below is against the PARSED (array-shaped) result
// db.ts actually returns.
// ---------------------------------------------------------------------------

interface RawScenarioRow {
  id: number;
  slug: string;
  vertical: string;
  icon: string;
  headline: string;
  pain_points: string;
  package_ids: string;
  implementation: string;
  target_outcomes: string;
  ghana_context: string;
  image: string | null;
  scenario_status: ParsedScenario["scenarioStatus"];
  status: ParsedScenario["status"];
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

function rawScenario(overrides: Partial<RawScenarioRow> = {}): RawScenarioRow {
  return {
    id: 1,
    slug: "pharmacy",
    vertical: "Pharmacy",
    icon: "medication",
    headline: "The pharmacy that always knows its stock",
    pain_points: JSON.stringify(["Stock counts live in notebooks"]),
    package_ids: JSON.stringify(["business-operations"]),
    implementation: JSON.stringify([{ phase: "Diagnose", detail: "Map how stock flows today." }]),
    target_outcomes: JSON.stringify(["Reorder alerts arrive before stockouts"]),
    ghana_context: "Sales arrive over the counter through several channels.",
    image: null,
    scenario_status: "scenario",
    status: "draft",
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
    updated_by: null,
    ...overrides,
  };
}

function makeFakeScenariosD1(seeded: { scenarios?: RawScenarioRow[] } = {}) {
  const state = {
    scenarios: [...(seeded.scenarios ?? [])],
    nextId: (seeded.scenarios?.length ?? 0) + 1,
    now: (): string => "2026-06-01 12:00:00",
  };

  const byVertical = (a: RawScenarioRow, b: RawScenarioRow): number =>
    a.vertical < b.vertical ? -1 : a.vertical > b.vertical ? 1 : a.id - b.id;

  const execute = (sql: string, binds: unknown[]): { results: unknown[]; lastRowId?: number } => {
    if (sql.startsWith("UPDATE cms_scenarios SET status")) {
      const [status, actorEmail, id] = binds as [RawScenarioRow["status"], string, number];
      const row = state.scenarios.find((s) => s.id === id);
      if (row) {
        row.status = status;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE cms_scenarios SET scenario_status")) {
      const [scenarioStatus, actorEmail, id] = binds as [RawScenarioRow["scenario_status"], string, number];
      const row = state.scenarios.find((s) => s.id === id);
      if (row) {
        row.scenario_status = scenarioStatus;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE cms_scenarios SET vertical")) {
      const [
        vertical,
        icon,
        headline,
        painPoints,
        packageIds,
        implementation,
        targetOutcomes,
        ghanaContext,
        image,
        scenarioStatus,
        actorEmail,
        id,
      ] = binds as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string | null,
        RawScenarioRow["scenario_status"],
        string,
        number,
      ];
      const row = state.scenarios.find((s) => s.id === id);
      if (row) {
        row.vertical = vertical;
        row.icon = icon;
        row.headline = headline;
        row.pain_points = painPoints;
        row.package_ids = packageIds;
        row.implementation = implementation;
        row.target_outcomes = targetOutcomes;
        row.ghana_context = ghanaContext;
        row.image = image;
        row.scenario_status = scenarioStatus;
        row.updated_at = state.now();
        row.updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("INSERT INTO cms_scenarios")) {
      const [
        slug,
        vertical,
        icon,
        headline,
        painPoints,
        packageIds,
        implementation,
        targetOutcomes,
        ghanaContext,
        image,
        scenarioStatus,
        actorEmail,
      ] = binds as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string | null,
        RawScenarioRow["scenario_status"],
        string,
      ];
      const row: RawScenarioRow = {
        id: state.nextId,
        slug,
        vertical,
        icon,
        headline,
        pain_points: painPoints,
        package_ids: packageIds,
        implementation,
        target_outcomes: targetOutcomes,
        ghana_context: ghanaContext,
        image,
        scenario_status: scenarioStatus,
        status: "draft",
        created_at: state.now(),
        updated_at: state.now(),
        updated_by: actorEmail,
      };
      state.nextId += 1;
      state.scenarios.push(row);
      return { results: [], lastRowId: row.id };
    }
    if (sql.startsWith("DELETE FROM cms_scenarios")) {
      const [id] = binds as [number];
      const before = state.scenarios.length;
      state.scenarios = state.scenarios.filter((s) => s.id !== id);
      return { results: [], lastRowId: state.scenarios.length < before ? 1 : undefined };
    }
    if (sql.startsWith("SELECT * FROM cms_scenarios WHERE status")) {
      const [status] = binds as [RawScenarioRow["status"]];
      return { results: state.scenarios.filter((s) => s.status === status).sort(byVertical) };
    }
    if (sql.startsWith("SELECT * FROM cms_scenarios WHERE id")) {
      const [id] = binds as [number];
      return { results: state.scenarios.filter((s) => s.id === id) };
    }
    if (sql.startsWith("SELECT slug FROM cms_scenarios")) {
      return { results: state.scenarios.map((s) => ({ slug: s.slug })) };
    }
    if (sql.startsWith("SELECT * FROM cms_scenarios ORDER")) {
      return { results: [...state.scenarios].sort(byVertical) };
    }
    throw new Error(`fake D1: unhandled query: ${sql}`);
  };

  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          const { results } = execute(sql, binds);
          return { results: results as T[] };
        },
        async first<T = unknown>() {
          const { results } = execute(sql, binds);
          return (results[0] as T) ?? null;
        },
        async run() {
          const { lastRowId } = execute(sql, binds);
          return { success: true, meta: { last_row_id: lastRowId ?? null } };
        },
      };
      return statement;
    },
  };

  return { db, state };
}

describe("listScenarios", () => {
  it("returns playbooks ordered by vertical then id", async () => {
    const fake = makeFakeScenariosD1({
      scenarios: [
        rawScenario({ id: 1, vertical: "School", slug: "school" }),
        rawScenario({ id: 2, vertical: "Pharmacy", slug: "pharmacy" }),
      ],
    });
    const rows = await listScenarios(fake.db);
    expect(rows.map((r) => r.vertical)).toEqual(["Pharmacy", "School"]);
  });

  it("filters by (content) status when given", async () => {
    const fake = makeFakeScenariosD1({
      scenarios: [
        rawScenario({ id: 1, status: "draft" }),
        rawScenario({ id: 2, status: "published", slug: "p2" }),
      ],
    });
    const published = await listScenarios(fake.db, "published");
    expect(published.map((r) => r.id)).toEqual([2]);
  });

  it("parses the JSON list columns into real arrays", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario()] });
    const [row] = await listScenarios(fake.db);
    expect(row.painPoints).toEqual(["Stock counts live in notebooks"]);
    expect(row.packageIds).toEqual(["business-operations"]);
    expect(row.implementation).toEqual([{ phase: "Diagnose", detail: "Map how stock flows today." }]);
    expect(row.targetOutcomes).toEqual(["Reorder alerts arrive before stockouts"]);
  });

  it("returns [] when there are no playbooks", async () => {
    const fake = makeFakeScenariosD1();
    expect(await listScenarios(fake.db)).toEqual([]);
  });
});

describe("getScenario", () => {
  it("returns the matching, parsed row", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 7, vertical: "Specific" })] });
    const row = await getScenario(fake.db, 7);
    expect(row?.vertical).toBe("Specific");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeScenariosD1();
    expect(await getScenario(fake.db, 999)).toBeNull();
  });
});

describe("createScenario", () => {
  it("inserts a new playbook as draft/scenario, generating a slug from vertical", async () => {
    const fake = makeFakeScenariosD1();
    const created = await createScenario(
      fake.db,
      {
        vertical: "Restaurant",
        icon: "restaurant",
        headline: "Headline",
        painPoints: ["Pain one"],
        packageIds: ["business-operations"],
        implementation: [{ phase: "Diagnose", detail: "Detail" }],
        targetOutcomes: ["Outcome one"],
        ghanaContext: "Context",
      },
      "jude.gileara@gmail.com",
    );
    expect(created?.slug).toBe("restaurant");
    expect(created?.status).toBe("draft");
    expect(created?.scenarioStatus).toBe("scenario");
    expect(created?.updatedBy).toBe("jude.gileara@gmail.com");
    expect(created?.painPoints).toEqual(["Pain one"]);
    expect(created?.implementation).toEqual([{ phase: "Diagnose", detail: "Detail" }]);
  });

  it("appends a numeric suffix when the generated slug collides", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 1, slug: "pharmacy", vertical: "Pharmacy" })] });
    const created = await createScenario(
      fake.db,
      {
        vertical: "Pharmacy",
        icon: "medication",
        headline: "H",
        painPoints: [],
        packageIds: [],
        implementation: [],
        targetOutcomes: [],
        ghanaContext: "C",
      },
      "x@gmail.com",
    );
    expect(created?.slug).toBe("pharmacy-2");
  });

  it("accepts an explicit scenarioStatus override", async () => {
    const fake = makeFakeScenariosD1();
    const created = await createScenario(
      fake.db,
      {
        vertical: "Salon",
        icon: "content_cut",
        headline: "H",
        painPoints: [],
        packageIds: [],
        implementation: [],
        targetOutcomes: [],
        ghanaContext: "C",
        scenarioStatus: "pilot",
      },
      "x@gmail.com",
    );
    expect(created?.scenarioStatus).toBe("pilot");
  });
});

describe("updateScenario", () => {
  it("updates only the given fields, keeping the rest, and stamps the actor", async () => {
    const fake = makeFakeScenariosD1({
      scenarios: [rawScenario({ id: 1, headline: "Old headline" })],
    });
    const updated = await updateScenario(fake.db, 1, { headline: "New headline" }, "mary.gileara@gmail.com");
    expect(updated?.headline).toBe("New headline");
    expect(updated?.vertical).toBe("Pharmacy");
    expect(updated?.painPoints).toEqual(["Stock counts live in notebooks"]);
    expect(updated?.updatedBy).toBe("mary.gileara@gmail.com");
  });

  it("does not touch the slug (it is fixed after creation)", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 1, slug: "fixed-slug" })] });
    await updateScenario(fake.db, 1, { headline: "New" }, "x@gmail.com");
    const row = await getScenario(fake.db, 1);
    expect(row?.slug).toBe("fixed-slug");
  });

  it("replaces list fields wholesale when patched", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 1 })] });
    const updated = await updateScenario(
      fake.db,
      1,
      { painPoints: ["New pain"], implementation: [{ phase: "Run", detail: "New detail" }] },
      "x@gmail.com",
    );
    expect(updated?.painPoints).toEqual(["New pain"]);
    expect(updated?.implementation).toEqual([{ phase: "Run", detail: "New detail" }]);
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeScenariosD1();
    expect(await updateScenario(fake.db, 999, { headline: "H" }, "x@gmail.com")).toBeNull();
  });
});

describe("setScenarioContentStatus", () => {
  it("moves a playbook from draft to published (visibility) without touching scenario_status", async () => {
    const fake = makeFakeScenariosD1({
      scenarios: [rawScenario({ id: 1, status: "draft", scenario_status: "scenario" })],
    });
    const updated = await setScenarioContentStatus(fake.db, 1, "published", "jude.gileara@gmail.com");
    expect(updated?.status).toBe("published");
    expect(updated?.scenarioStatus).toBe("scenario");
    expect(updated?.updatedBy).toBe("jude.gileara@gmail.com");
  });
});

describe("setScenarioStage", () => {
  it("moves a playbook from scenario to pilot (the honesty-contract label) without touching status", async () => {
    const fake = makeFakeScenariosD1({
      scenarios: [rawScenario({ id: 1, status: "published", scenario_status: "scenario" })],
    });
    const updated = await setScenarioStage(fake.db, 1, "pilot", "jude.gileara@gmail.com");
    expect(updated?.scenarioStatus).toBe("pilot");
    expect(updated?.status).toBe("published");
    expect(updated?.updatedBy).toBe("jude.gileara@gmail.com");
  });

  it("moves all the way to case-study", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 1, scenario_status: "pilot" })] });
    const updated = await setScenarioStage(fake.db, 1, "case-study", "x@gmail.com");
    expect(updated?.scenarioStatus).toBe("case-study");
  });
});

describe("deleteScenario", () => {
  it("removes the row and returns true", async () => {
    const fake = makeFakeScenariosD1({ scenarios: [rawScenario({ id: 1 })] });
    const ok = await deleteScenario(fake.db, 1);
    expect(ok).toBe(true);
    expect(await getScenario(fake.db, 1)).toBeNull();
  });
});
