# Feather Website

Marketing website for **Feather** — a restaurant marketing platform & digital menu system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl (locales: `en`, `mk`)
- **Blog**: MDX files in `/content/blog/` via next-mdx-remote + gray-matter
- **Analytics**: GA4 (G-YGJL9TVEYQ) via GTM (GTM-WQX9GZQB), consent-gated
- **Domain**: feathermenu.com

## Commands

```bash
npm run dev    # Local dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Project Structure

```
src/
├── app/[locale]/          # Pages (en, mk)
│   ├── page.tsx           # Homepage
│   ├── about/
│   ├── blog/              # Blog listing + [slug] posts
│   ├── faq/
│   ├── features/
│   ├── for/[type]/        # Use-case pages (fast-casual, fine-dining, multi-location)
│   ├── how-it-works/
│   └── pricing/
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Page sections (Hero, CTABand, PricingPlans, etc.)
│   ├── seo/               # BreadcrumbJsonLd, ArticleJsonLd
│   └── ui/                # Button, CookieConsent, MobileCTABar, etc.
├── lib/
│   ├── analytics.ts       # GTM dataLayer events (consent-gated)
│   ├── api.ts             # Backend API (pricing plans)
│   ├── seo.ts             # Shared SEO helpers (buildAlternates, BASE_URL)
│   └── i18n-helpers.ts
└── messages/              # i18n translation JSON (en.json, mk.json)

content/blog/              # MDX blog posts with frontmatter
marketing-strategy/        # 8-step marketing automation plan (see below)
issues-to-fix/             # Implementation task lists for coding chats
```

## Key Conventions

- **Pricing comes from API** — never hardcode prices. Use `fetchPricingPlans()` from `src/lib/api.ts`.
- **All pages need both locales** — every page must have hreflang, canonical, and OpenGraph metadata. Use `buildAlternates()` from `src/lib/seo.ts`.
- **Analytics events** go through `src/lib/analytics.ts` — they only fire after cookie consent.
- **No fake metrics** — website stats (5K+ venues, 40+ countries) are aspirational. Never use them in content, ads, or anywhere requiring truthful claims.
- **No fake testimonials** — existing testimonials are illustrative. Don't reference them as real.
- **Blog posts** are MDX files in `/content/blog/` with frontmatter (title, slug, date, description, keywords, locale).

## Marketing Strategy

An 8-step automated marketing plan lives in `marketing-strategy/`. Read `00-overview.md` for the full picture.

| Step | Status | Summary |
|------|--------|---------|
| 1. Product Marketing Context | DONE | Positioning, personas, competitors in `.agents/product-marketing-context.md` |
| 2. Analytics Setup | DONE | GA4 + GTM + cookie consent + 5 custom events |
| 3. SEO Foundation | DONE | robots.txt, sitemap, hreflang, canonical, schema markup |
| 4. Content Engine | SETUP DONE | Blog infrastructure built, drafts folder structure ready |
| 5-8 | Not started | Email, Paid Ads, CRO, Growth Loops |

## Working With This Project

- **Marketing strategy decisions** happen in a dedicated marketing chat — not in coding chats.
- **Implementation tasks** are written to `issues-to-fix/` as markdown checklists. Coding chats pick these up.
- **Product marketing context** at `.agents/product-marketing-context.md` is the source of truth for all messaging, copy, and content.
- **Marketing skills** (33 total) are in `skills/` — these are prompt templates for content, SEO, ads, etc.
