# Task 2: Email Capture — Connect to Backend

*Priority: High*
*Source: Marketing strategy Step 4 — Content Engine (Lead Magnet) + Step 5 — Email Sequences*

## What

The `EmailCapture` component (`src/components/ui/EmailCapture.tsx`) already exists with a working form UI, but it only fires a GA4 analytics event on submit. It doesn't actually store the email anywhere. Connect it to a real backend so captured emails can be used for email sequences (Step 5).

## Current state

- `EmailCapture.tsx` renders an email input + submit button
- On submit: calls `trackEvent("email_capture", { source, email })` then shows "Thanks! We'll be in touch"
- No API call, no database write, no email service integration
- Component accepts a `source` prop for tracking where the capture happened (e.g., "blog-post", "playbook-landing")

## What needs to be done

### 1. Choose an email service

Pick one and integrate. Options in order of simplicity:

| Service | Why | Cost |
|---------|-----|------|
| **Resend** | Simple API, great DX, can also send transactional emails later | Free up to 3,000 emails/month |
| **Mailchimp** | Industry standard, built-in sequences | Free up to 500 contacts |
| **ConvertKit (Kit)** | Built for creators/makers, good automation | Free up to 10,000 subscribers |
| **Firebase** (you already use it) | Store emails in Firestore, send via Cloud Functions | Already in your stack |

**Recommendation:** Resend or Firebase. Resend if you want a dedicated email tool. Firebase if you want to keep everything in one stack.

### 2. Create API route

File: `src/app/api/email-capture/route.ts`

```
POST /api/email-capture
Body: { email: string, source: string }
Response: { success: boolean }
```

The route should:
- Validate the email format
- Store the email + source + timestamp
- Return success/failure
- Rate limit to prevent abuse (optional but recommended)

### 3. Update EmailCapture component

Modify `src/components/ui/EmailCapture.tsx`:
- On submit: call `/api/email-capture` API route
- Keep the GA4 tracking event as-is
- Handle error states (show error message if API fails)
- Prevent duplicate submissions

### 4. Create lead magnet landing page

File: `src/app/[locale]/playbook/page.tsx`

This is the landing page for Lead Magnet #1 (QR Code Marketing Playbook). Content is drafted at `marketing-strategy/drafts/lead-magnets/qr-marketing-playbook/content.md`.

Page structure:
- Hero: headline + subhead from the draft
- Bullet points: 4 benefits
- EmailCapture component with `source="playbook-landing"`
- After submission: show download link or redirect to PDF

### 5. Add EmailCapture to blog posts

Place the EmailCapture component at the bottom of blog post pages, above the CTA band.
- `source="blog-{slug}"` so you know which posts convert
- Heading: "Get the free QR Marketing Playbook"

### 6. Host the PDF

- Create the PDF from the playbook draft content
- Host at `/public/downloads/qr-marketing-playbook.pdf`
- Or use a service like Resend to send it as an email attachment

## Reference files

- Component: `src/components/ui/EmailCapture.tsx`
- Playbook draft: `marketing-strategy/drafts/lead-magnets/qr-marketing-playbook/content.md`
- Product context: `.agents/product-marketing-context.md`
