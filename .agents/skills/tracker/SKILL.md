---
name: tracker
description: Build a lead source tracker that captures UTM tags plus Google Ads (gclid, gbraid, wbraid), Meta/Facebook (fbclid) and Microsoft (msclkid) click IDs, keeps first and last touch across pages, and attaches them to every form submission sent to a webhook. Use when the user asks for UTM tracking, ad tracking, lead source or lead attribution on forms.
---

# Tracker: lead attribution on form submits

Goal: every lead arrives at the client's webhook tagged with where it came from, even if the visitor browsed several pages before submitting.

## Build steps (TanStack Start)
1. `src/lib/tracking.ts`: copy `references/tracking.ts.txt`. Captures UTMs and click IDs from the URL, stores first touch (never overwritten) and last touch (overwritten only on new campaign params or an external referrer) in localStorage for 90 days, and builds the payload with a `channel` label (google_ads, meta_ads, microsoft_ads, organic_search, organic_social, referral, direct), page URL, `_fbp`/`_fbc`, GA client id.
2. Call `captureAttribution()` in a `useEffect` in the root route component (`src/routes/__root.tsx`). Browser-only; never at module scope or in SSR.
3. `src/lib/lead.functions.ts`: copy `references/lead.functions.ts.txt`. createServerFn with zod validation that POSTs `{ form, fields, attribution, received_at }` to the `LEAD_WEBHOOK_URL` secret, read inside the handler. Without the secret it logs the lead to the server instead.
4. `src/lib/send-lead.ts`: copy `references/send-lead.ts.txt`. Reads the form fields with FormData, attaches attribution, sends the lead, and fires `dataLayer generate_lead` and `fbq Lead` if those tags exist.
5. Find every `<form` in the project and change onSubmit to `void sendLead(e.currentTarget, "<form_name>")` before showing the thank-you state. Give each form a distinct name. Inputs need `name` attributes.
6. Ask the user for the webhook URL (Zapier, Make, CRM) and store it with add_secret as `LEAD_WEBHOOK_URL`. Never put it in client code.

## Rules
- The webhook URL stays server-side only.
- Lead sending must never block or break the thank-you screen (try/catch).
- Do not add visible fields to the form.
- Record the decision in AGENTS.md.

## Verify
With Playwright, open `/?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=TEST123`, navigate to another page, submit a form, then confirm the dev server log (or webhook) shows the lead with first_touch.gclid = TEST123 and channel = google_ads.
