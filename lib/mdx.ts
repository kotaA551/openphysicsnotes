import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const chaptersDir = path.join(process.cwd(), 'content/chapters');

export function getAllChapters() {
  return fs.readdirSync(chaptersDir).map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const source = fs.readFileSync(path.join(chaptersDir, file), 'utf8');
    const { data, content } = matter(source);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      content,
    };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getChapter(slug: string) {
  const file = path.join(chaptersDir, `${slug}.mdx`);
  const source = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(source);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    content,
  };
}

export const chapters = [
  { slug: "1-Newton-mechanics", title: "Newton mechanics" },
  { slug: "2-Electromagnetics", title: "Electromagnetics" },
  { slug: "3-Relativity", title: "Relativity as Geometry" },
  { slug: "4-Quantum-mechanics", title: "Quantum mechanics" },
  { slug: "5-Quantum-field", title: "Quantum field theory" },
  { slug: "6-Gauge-theory", title: "Gauge theory" },
  { slug: "7-Quantum-gravity-theory", title: "Quantum gravity theory" },
];
