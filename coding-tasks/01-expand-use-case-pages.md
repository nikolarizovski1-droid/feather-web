# Task 1: Expand `/for/[type]` Use-Case Pages

*Priority: Medium*
*Source: Marketing strategy Step 4 — Content Engine*

## What

Add 5 new use-case landing pages to the existing `/for/[type]` route. The infrastructure already supports all 8 types — the config in `use-case-data.ts` has entries for all of them. What's missing is the **i18n translations** for the new pages.

## Current state

**Working pages (have translations):**
- `/for/fast-casual`
- `/for/fine-dining`
- `/for/multi-location`

**Config exists but no translations:**
- `/for/food-trucks`
- `/for/bars`
- `/for/hotels`
- `/for/cafes`
- `/for/ghost-kitchens`

## What needs to be done

### 1. Add i18n translations for each new use-case

File: `/messages/en.json` — add entries under `UseCasePage` for each new type.

Each use-case needs these translation keys (follow the existing pattern from `fastCasual`, `fineDining`, `multiLocation`):

```
UseCasePage.[type].hero.eyebrow
UseCasePage.[type].hero.title
UseCasePage.[type].hero.titleHighlight
UseCasePage.[type].hero.subtitle
UseCasePage.[type].features.0.title
UseCasePage.[type].features.0.description
UseCasePage.[type].features.1.title
UseCasePage.[type].features.1.description
UseCasePage.[type].features.2.title
UseCasePage.[type].features.2.description
UseCasePage.[type].testimonial.quote
UseCasePage.[type].testimonial.name
UseCasePage.[type].testimonial.venue
UseCasePage.[type].meta.title
UseCasePage.[type].meta.description
```

### 2. Repeat for Macedonian

File: `/messages/mk.json` — same keys, translated to Macedonian.

### 3. Content direction for each page

Use the product-marketing-context (`.agents/product-marketing-context.md`) for messaging. Each page should speak to the specific pain points of that restaurant type:

| Type | Featured Plan | Key Angle |
|------|--------------|-----------|
| **Food Trucks** | basic | Speed, zero overhead, works on mobile. "No counter space for flyers — your QR code is your entire marketing team" |
| **Bars** | standard | Drink promotions, event nights, push notifications for happy hour. "Fill your slow weeknights without posting on Instagram every day" |
| **Hotels** | premium | Multi-outlet control, multilingual menus, in-room TV displays. "One dashboard for the lobby bar, restaurant, and room service" |
| **Cafes** | basic | Simple menu updates, seasonal promotions, loyalty. "Update your seasonal menu in seconds, not hours" |
| **Ghost Kitchens** | basic | No physical venue marketing needed, online-focused. "Your menu is your only storefront — make it sell" |

### 4. Update sitemap

File: `/src/app/sitemap.ts` — verify all 8 use-case pages are included. The `generateStaticParams()` in the page component already generates all 8, but sitemap may only list the original 3.

### 5. Verify

- All 5 new pages render at `/en/for/[type]` and `/mk/for/[type]`
- Metadata (title, description) is correct per locale
- BreadcrumbJsonLd shows correct path
- Pages appear in sitemap.xml
- Footer already links to all 8 types — verify they resolve

## Reference files

- Config: `src/lib/use-case-data.ts`
- Page component: `src/app/[locale]/for/[type]/page.tsx`
- Translations: `messages/en.json`, `messages/mk.json`
- Sitemap: `src/app/sitemap.ts`
- Product context: `.agents/product-marketing-context.md`
