# Website form endpoint

Browser -> same-origin `POST /api/forms/submit` -> Catalyst Alert_Lead_Management -> CRM

All four forms now call the website backend. The browser never contacts Catalyst, so Catalyst does not need a website-domain CORS whitelist for this path. The server forwards the same JSON structure, preserving consent, repeated CCPA fields and attribution. No Catalyst configuration was changed by this update.

The server defaults to:

https://lead-form-management-918580965.development.catalystserverless.com/server/Alert_Lead_Management/

Optional server configuration:

```env
CATALYST_FORM_URL=https://lead-form-management-918580965.development.catalystserverless.com/server/Alert_Lead_Management/
CATALYST_FORM_API_KEY=
```

The optional key is sent as `X-API-Key` only if configured; the current integration does not require adding a key unless you enable matching validation in Catalyst. Keep it on the website server and out of browser code. The old public `VITE_CATALYST_FORM_URL` value is no longer used. CRM/OAuth credentials stay in Catalyst.

The route runs in the existing TanStack server runtime. It requires server-capable hosting; a static-only website export cannot run this endpoint. No Google Cloud service is required.

## Request

`POST` with `Content-Type: application/json`:

```json
{
  "form": "quote_form",
  "fields": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Example Law",
    "phone": "5551234567",
    "message": "After-hours intake enquiry",
    "privacy": "on",
    "sms_consent": "on",
    "website": ""
  },
  "attribution": {
    "first_touch": { "landing_page": "https://www.alertcommunications.com/", "referrer": "", "timestamp": "2026-10-23T12:00:00Z" },
    "last_touch": { "utm_source": "google", "utm_campaign": "intake", "gclid": "example-click-id", "landing_page": "https://www.alertcommunications.com/contact/", "referrer": "", "timestamp": "2026-10-23T12:00:00Z" },
    "channel": "google_ads",
    "page_url": "https://www.alertcommunications.com/contact/"
  }
}
```

Fields are strings. Unchecked checkboxes are omitted. Repeated field names are joined with `; `, so all selected CCPA inquiry types survive. The empty `website` field is a honeypot; a filled value may be discarded by your backend. Attribution may also include first_channel, page_title, submitted_at, user_agent and available analytics identifiers. First/last touch can be null.

| Form value | Fields |
| --- | --- |
| `quote_form` | name, email, company, phone, message, privacy, sms_consent, website |
| `live_form` | name, email, company, phone, message, privacy, sms_consent, website |
| `client_support` | name, email, company, phone, message, privacy, sms_consent, website |
| `ccpa_request` | date, first_name, last_name, phone, email, email_confirm, inquiry_type, address, address2, city, zip, country, message, privacy, sms_consent, website |

## Required response and browser access

Return a successful 2xx status (including HTTP 201) with JSON:

```json
{ "success": true }
```

Only return this after accepting the submission. The website also accepts the earlier `{ "ok": true }` format. Additional response fields are ignored. Non-2xx responses, invalid JSON, responses without either success flag set to true, timeouts and network errors preserve the form and display a retry message. A plain-text starter response or `{ "status": "ok" }` alone will not trigger success. Conversion analytics fire only after acceptance.

## Same-origin protection

The website endpoint accepts JSON, limits the body to 64 KiB, validates required form fields/privacy acceptance and CCPA email confirmation, and rejects browser requests from a different origin. It forwards server-side without copying the browser's Origin or cookies to Catalyst. A failed or unconfirmed upstream response leaves the form available for retry. No automatic retries are performed, to avoid duplicating created leads.

## Verification status

The user reported a successful submission from the Zoho landing-page test on October 23, 2026: HTTP 201 with `success: true`, `status: "Created"`, and lead/submission IDs. The website response check now accepts that format. This confirms the reported test's backend acceptance; CRM field mapping has not been independently audited. No Catalyst functions or CRM settings were created or modified by this work.

## Future WordPress hosting

This backend belongs to the React/TanStack app; it is not PHP. For WordPress, implement a same-origin WordPress REST endpoint that forwards the same payload to Catalyst using `wp_remote_post`, then point the WordPress form at that route. Any optional key belongs in WordPress server configuration. A Custom HTML block that still fetches Catalyst directly continues to require CORS; this repository update does not change the separately pasted landing-page snippet.
