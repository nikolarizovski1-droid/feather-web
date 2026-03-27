# AGENTS.md

Guidelines for AI agents working in this repository.

## What This Project Is

**Feather** is a restaurant marketing platform & digital menu system. This repo is the **marketing website** (Next.js) — not the product itself. The product is a separate Angular app.

- **Domain**: feathermenu.com
- **Tech**: Next.js 16, TypeScript, Tailwind CSS, next-intl (en/mk)
- **See**: `CLAUDE.md` for full tech details and project structure

## How Work Is Organized

### Two types of conversations

1. **Marketing strategy chat** — decisions about what to do and why. References `marketing-strategy/` and `.agents/product-marketing-context.md`.
2. **Coding chat** — implementation. Picks up tasks from `issues-to-fix/` folder.

### Key files to read first

| File | What it tells you |
|------|-------------------|
| `CLAUDE.md` | Tech stack, project structure, conventions |
| `marketing-strategy/00-overview.md` | The 8-step marketing plan and current progress |
| `.agents/product-marketing-context.md` | Product positioning, personas, competitors, brand voice |
| `issues-to-fix/*.md` | Implementation task lists (coding chats start here) |

### Marketing skills

33 marketing skills are installed in `skills/`. Each is a prompt template (SKILL.md) for a specific marketing task (copywriting, SEO, ads, email, etc.). The strategy docs reference which skills to use per step.

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md) from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills).

## Critical Rules

- **No fake metrics** — stats like "5K+ venues" or "40+ countries" are aspirational. Never use in content, ads, or outbound.
- **No fake testimonials** — existing testimonials are illustrative, not real.
- **Pricing from API only** — never hardcode prices. Use `fetchPricingPlans()`.
- **Both locales always** — every page needs en + mk with hreflang, canonical, and OpenGraph.
- **Consent before tracking** — analytics events only fire after cookie consent via `src/lib/analytics.ts`.

## Tool Integrations

Marketing tools are documented in `tools/`:
- `tools/REGISTRY.md` — index of all tools with capabilities
- `tools/integrations/` — per-tool API guides (ga4, stripe, mailchimp, etc.)
- MCP-enabled tools: ga4, stripe, mailchimp, google-ads, resend, zapier, and more
- Composio for OAuth-heavy tools (HubSpot, Meta Ads, etc.) — see `tools/integrations/composio.md`
