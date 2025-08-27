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
  { slug: "1-Newton-mechanics",            title: "1 Newton mechanics" },
  { slug: "2-Oscillations-and-waves",      title: "2 Oscillations and waves" },
  { slug: "3-Thermodynamics",              title: "3 Thermodynamics" },
  { slug: "4-Electromagnetics",            title: "4 Electromagnetics" },
  { slug: "5-Relativity",                  title: "5 Relativity" },
  { slug: "6-Early-quantum-theory.mdx",    title: "6 Early quantum theory" },
  { slug: "7-Quantum-mechanics",           title: "7 Quantum mechanics" },
  { slug: "8-Quantum-field-theory",        title: "8 Quantum field theory" },
  { slug: "9-Statistical-physics",         title: "9 Statistical physics" },
  { slug: "10-Condensed-matter-physics",   title: "10 Condensed matter physics" },
  { slug: "11-Cosmology-and-astrophysics", title: "11 Cosmology and astrophysics" },
  { slug: "12-Frontiers-of-physics",       title: "12 Frontiers of physics" },
];
