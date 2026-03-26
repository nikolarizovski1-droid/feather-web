# Task 3: Set Up Social Media Profiles & Link Them

*Priority: High*
*Source: Marketing strategy Step 4 — Content Engine*

## What

Create the official Feather social media profiles on Instagram, LinkedIn, and X. Then update the website footer to link to them (currently all social links are `href="#"`).

## Current state

- Footer component (`src/components/layout/Footer.tsx`) has social icon links for Instagram, X (Twitter), and LinkedIn
- All three links point to `href="#"` — they're placeholders
- No social media profiles exist yet (or if they do, they're not connected)
- Week 1 social drafts are ready at `marketing-strategy/drafts/social/2026-W14/`

## What needs to be done

### 1. Create profiles

| Platform | Handle suggestion | Profile type |
|----------|------------------|-------------|
| **Instagram** | @feathermenu | Business account |
| **LinkedIn** | /company/feathermenu | Company page |
| **X (Twitter)** | @feathermenu | Business/creator account |

For each profile:
- Use "Feather" as display name
- Bio: "Turn every QR scan into automatic restaurant marketing. Menus, promotions, events, push notifications — one dashboard, zero effort."
- Link: https://feathermenu.com
- Use the Feather logo as profile picture

### 2. Update Footer social links

File: `src/components/layout/Footer.tsx`

Replace the `href="#"` placeholders with actual profile URLs:
```
Instagram: https://instagram.com/feathermenu
LinkedIn: https://linkedin.com/company/feathermenu
X: https://x.com/feathermenu
```

### 3. Add social links to Organization schema

File: `src/app/[locale]/layout.tsx`

The Organization JSON-LD schema has a `sameAs` field (or should). Add the social profile URLs there — this tells Google these profiles belong to Feather.

```json
"sameAs": [
  "https://instagram.com/feathermenu",
  "https://linkedin.com/company/feathermenu",
  "https://x.com/feathermenu"
]
```

### 4. Post Week 1 content

Once profiles are live, review and post the drafts from `marketing-strategy/drafts/social/2026-W14/`:
- Monday: Instagram carousel
- Tuesday: LinkedIn post
- Wednesday: Instagram reel (needs video/mockup creation)
- Thursday: X post
- Friday: Instagram carousel

### 5. Consider a scheduling tool (optional)

For automated posting in the future, pick a tool:
- **Buffer** — free for 3 channels, simple scheduling
- **Later** — good for Instagram-first workflows
- **Typefully** — great for X/LinkedIn, supports threads

Not needed immediately — manual posting is fine for the first few weeks.

## Reference files

- Footer: `src/components/layout/Footer.tsx`
- Layout schema: `src/app/[locale]/layout.tsx`
- Social drafts: `marketing-strategy/drafts/social/2026-W14/`
- Product context: `.agents/product-marketing-context.md`
