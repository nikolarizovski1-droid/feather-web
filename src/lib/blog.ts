import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { routing } from "@/i18n/routing";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string;
  locale: string;
  image?: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getPostBySlug(
  locale: string,
  slug: string
): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
      keywords: data.keywords ?? "",
      locale,
      image: data.image,
    },
    content,
  };
}

export function getAllPosts(locale: string): BlogPostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const post = getPostBySlug(locale, slug);
      return post?.meta;
    })
    .filter((meta): meta is BlogPostMeta => meta !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPostSlugs(): { locale: string; slug: string }[] {
  return routing.locales.flatMap((locale) => {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((filename) => ({
        locale,
        slug: filename.replace(/\.mdx$/, ""),
      }));
  });
}
