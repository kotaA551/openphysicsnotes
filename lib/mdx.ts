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
  }).sort((a, b) => a.slug.localeCompare(b.slug)); // keeps 01,02,03 order
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
