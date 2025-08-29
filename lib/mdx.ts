// /lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** ---------- Types ---------- */
export type Chapter = {
  slug: string;
  title: string;
  description?: string;
  content: string;
  order?: number; // optional frontmatter sort key
};

export type Curiosity = {
  slug: string;
  title: string;
  summary?: string;
  content: string;
  order?: number; // optional frontmatter sort key
};

/** ---------- Paths ---------- */
const ROOT_DIR = process.cwd();
const CHAPTERS_DIR = path.join(ROOT_DIR, "content", "chapters");
const CURIOSITIES_DIR = path.join(ROOT_DIR, "content", "curiosities");

/** ---------- Helpers ---------- */
function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .sort();
}

function fileToSlug(filename: string): string {
  return filename.replace(/\.mdx$/i, "");
}

// fallback: make a human title from slug like "1-Newton-mechanics" → "1 Newton mechanics"
function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function readMdxFull(fp: string) {
  const raw = fs.readFileSync(fp, "utf8");
  const { content, data } = matter(raw);
  return { content, data: (data ?? {}) as Record<string, any> };
}

/** ---------- Chapters API ---------- */
export function getAllChapters(): Chapter[] {
  const files = listMdxFiles(CHAPTERS_DIR);

  const items: Chapter[] = files.map((filename) => {
    const slug = fileToSlug(filename);
    const { content, data } = readMdxFull(path.join(CHAPTERS_DIR, filename));

    const title =
      (typeof data.title === "string" && data.title.trim()) || titleFromSlug(slug);
    const description =
      typeof data.description === "string" ? data.description : undefined;
    const order =
      typeof data.order === "number"
        ? data.order
        : // try to parse leading numeric prefix in slug for ordering
          (() => {
            const m = slug.match(/^(\d+)[-_]/);
            return m ? parseInt(m[1], 10) : undefined;
          })();

    return { slug, title, description, content, order };
  });

  // Sort: explicit order asc → fallback alphabetic by slug
  items.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.slug.localeCompare(b.slug);
  });

  return items;
}

export function getChapter(slug: string): Chapter {
  // try exact filename first
  const fp = path.join(CHAPTERS_DIR, `${slug}.mdx`);
  if (fs.existsSync(fp)) {
    const { content, data } = readMdxFull(fp);
    const title =
      (typeof data.title === "string" && data.title.trim()) || titleFromSlug(slug);
    const description =
      typeof data.description === "string" ? data.description : undefined;
    const order = typeof data.order === "number" ? data.order : undefined;
    return { slug, title, description, content, order };
  }

  // otherwise search by basename (case-insensitive)
  const match = listMdxFiles(CHAPTERS_DIR).find(
    (f) => fileToSlug(f).toLowerCase() === slug.toLowerCase()
  );
  if (match) return getChapter(fileToSlug(match));

  throw new Error(`Chapter not found for slug: ${slug}`);
}

/** ---------- Curiosities API ---------- */
export function getAllCuriosities(): Curiosity[] {
  const files = listMdxFiles(CURIOSITIES_DIR);

  const items: Curiosity[] = files.map((filename) => {
    const slug = fileToSlug(filename);
    const { content, data } = readMdxFull(path.join(CURIOSITIES_DIR, filename));

    const title =
      (typeof data.title === "string" && data.title.trim()) || titleFromSlug(slug);
    const summary =
      typeof data.summary === "string" ? data.summary : undefined;
    const order =
      typeof data.order === "number"
        ? data.order
        : undefined;

    return { slug, title, summary, content, order };
  });

  // Sort by optional order, then slug
  items.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.slug.localeCompare(b.slug);
  });

  return items;
}

export function getCuriosity(slug: string): Curiosity {
  const fp = path.join(CURIOSITIES_DIR, `${slug}.mdx`);
  if (fs.existsSync(fp)) {
    const { content, data } = readMdxFull(fp);
    const title =
      (typeof data.title === "string" && data.title.trim()) || titleFromSlug(slug);
    const summary =
      typeof data.summary === "string" ? data.summary : undefined;
    const order = typeof data.order === "number" ? data.order : undefined;
    return { slug, title, summary, content, order };
  }

  const match = listMdxFiles(CURIOSITIES_DIR).find(
    (f) => fileToSlug(f).toLowerCase() === slug.toLowerCase()
  );
  if (match) return getCuriosity(fileToSlug(match));

  throw new Error(`Curiosity not found for slug: ${slug}`);
}
