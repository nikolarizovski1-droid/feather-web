import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABand from "@/components/sections/CTABand";
import RevealObserver from "@/components/ui/RevealObserver";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import BlogPostCard from "@/components/sections/BlogPostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("BlogPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      siteName: "Feather",
    },
    alternates: buildAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("BlogPage");
  const posts = getAllPosts(locale);

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: t("breadcrumb"), path: "/blog" }]}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div
              data-reveal="up"
              className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                {t("hero.eyebrow")}
              </span>
            </div>
            <h1
              data-reveal="up"
              data-reveal-delay="80"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-08 tracking-tight leading-[1.1] mb-5"
            >
              {t("hero.title")}
            </h1>
            <p
              data-reveal="up"
              data-reveal-delay="160"
              className="text-base lg:text-lg text-ink-05 leading-relaxed max-w-2xl mx-auto"
            >
              {t("hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Post grid */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <p
                data-reveal="up"
                className="text-center text-ink-05 text-base"
              >
                {t("noPosts")}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <BlogPostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    date={post.date}
                    description={post.description}
                    locale={locale}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
