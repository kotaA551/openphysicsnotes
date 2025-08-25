import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';


export type ChapterMeta = {
slug: string;
title: string;
description?: string;
order: number;
tags: string[];
level?: 'beginner' | 'intermediate' | 'advanced' | string;
};


export type Chapter = ChapterMeta & { content: string };


const CHAPTERS_DIR = path.join(process.cwd(), 'content', 'chapters');


function readChapterFile(slug: string) {
const file = path.join(CHAPTERS_DIR, `${slug}.mdx`);
const raw = fs.readFileSync(file, 'utf8');
return matter(raw);
}


export function getAllSlugs(): string[] {
return fs
.readdirSync(CHAPTERS_DIR)
.filter((f) => f.endsWith('.mdx'))
.map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllChapters(): ChapterMeta[] {
const slugs = getAllSlugs();
const metas = slugs.map((slug) => {
const { data } = readChapterFile(slug);
return {
slug,
title: data.title ?? slug,
description: data.description ?? '',
order: Number(data.order ?? 9999),
tags: Array.isArray(data.tags) ? data.tags : [],
level: data.level ?? 'beginner',
} as ChapterMeta;
});
return metas.sort((a, b) => a.order - b.order);
}


export function getChapter(slug: string): Chapter {
const { data, content } = readChapterFile(slug);
return {
slug,
title: data.title ?? slug,
description: data.description ?? '',
order: Number(data.order ?? 9999),
tags: Array.isArray(data.tags) ? data.tags : [],
level: data.level ?? 'beginner',
content,
} as Chapter;
}


export function getAllTags(): { tag: string; count: number }[] {
const counts = new Map<string, number>();
for (const c of getAllChapters()) {
for (const t of c.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
}
return Array.from(counts.entries())
.map(([tag, count]) => ({ tag, count }))
.sort((a, b) => a.tag.localeCompare(b.tag));
}