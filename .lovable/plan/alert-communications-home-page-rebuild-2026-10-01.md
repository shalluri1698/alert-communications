# Alert Communications home page rebuild

Recreate https://www.alertcommunications.com/ as the home page, matching layout, copy, colors (black, white, signature red) and section order from the live site and the screenshot.

## Sections (top to bottom)
1. Top announcement bar + header: logo, nav (Services, Pricing, About, Resources, Contact), red "Free Assessment" and dark phone buttons.
2. Dark hero with photo background: headline with red highlighted words, intro text, 3 stats (1,000+ firms, 24/7, HIPAA), red call button, trusted-by avatars.
3. "24/7 Legal Intake..." with 4 dark image service cards and Learn More buttons.
4. "How Legal Answering Services Convert Missed Calls" text block with CTA.
5. Testimonials: "Why Choose Alert?" with 4 dark review cards.
6. "What Should Law Firms Expect..." image + checklist + CTA.
7. Pricing: Basic, Advanced (red featured), Premier, plus wide Alert Go bar and footnote.
8. FAQ-style "Legal Intake Decisions..." text + office photo.
9. "Intake-to-Retainer System" with photo, 67% and 24/7/365 stat badges.
10. Integrations logo row (Salesforce, SmartAdvocate, Lawmatics, Zapier, Litify).
11. Accordion FAQ (5 questions).
12. "From Ring To Retained" 3 icon steps.
13. Red CTA band "Stop Leaving Money On The Table" with growth plan card.
14. Dark footer with link columns, contact info, socials.

All remaining copy will be pulled from the live page. Calls use tel:844-236-2485.

## Images
Pull the real images (logo, photos, partner logos) from the live site and host them as project assets. Generate stand-ins only if a file can't be downloaded.

## Technical details
- Rewrite src/routes/index.tsx and split sections into components under src/components/home/.
- Add brand tokens (red, near-black) to src/styles.css. Load Raleway-style headings and a sans body font via the root head.
- Add head() metadata for the page. Make the layout work on mobile.
- No em dashes in copy.
