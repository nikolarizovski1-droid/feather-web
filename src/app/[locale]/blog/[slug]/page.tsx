import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { buildAlternates } from "@/lib/seo";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { mdxComponents } from "@/lib/mdx-components";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import TrackPageView from "@/components/ui/TrackPageView";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";

interface PageParams {
  locale: string;
  slug: string;
}

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};

  return {
    title: `${post.meta.title} — Feather Blog`,
    description: post.meta.description,
    keywords: post.meta.keywords,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      siteName: "Feather",
      ...(post.meta.image ? { images: [post.meta.image] } : {}),
    },
    alternates: buildAlternates(locale, `/blog/${slug}`),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("BlogPage");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.meta.date));

  return (
    <>
      <TrackPageView
        event="blog_post_view"
        params={{ post_slug: slug }}
      />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("breadcrumb"), path: "/blog" },
          { name: post.meta.title },
        ]}
      />
      <ArticleJsonLd
        title={post.meta.title}
        description={post.meta.description}
        datePublished={post.meta.date}
        slug={slug}
        locale={locale}
        image={post.meta.image}
      />
      <Navbar />
      <main>
        <article className="py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-12" data-reveal="up">
              <time className="text-sm text-ink-05">{formattedDate}</time>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mt-3 mb-4 leading-[1.1]">
                {post.meta.title}
              </h1>
              <p className="text-lg text-white/55 leading-relaxed">
                {post.meta.description}
              </p>
            </header>

            {/* Content */}
            <div data-reveal="up" data-reveal-delay="80">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>
          </div>
        </article>

        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
