# Website form endpoint

All four existing website form types submit directly to:

https://lead-form-management-918580965.development.catalystserverless.com/server/Alert_Lead_Management/

The URL is the default in `src/lib/send-lead.ts`; no environment variable is required. `VITE_CATALYST_FORM_URL` can override it for another environment. The browser sends no API key, cookies or authentication header. You manage the Catalyst function and CRM integration separately.

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

Because the site calls Catalyst directly, your function/platform must handle browser CORS preflight (`OPTIONS`) and return matching headers on POST responses, including errors:

```http
Access-Control-Allow-Origin: https://www.alertcommunications.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Vary: Origin
```

Allow each actual website or preview origin explicitly in your Catalyst configuration. Keep all CRM/OAuth credentials in Catalyst.

## Verification status

The user reported a successful submission from the Zoho landing-page test on October 23, 2026: HTTP 201 with `success: true`, `status: "Created"`, and lead/submission IDs. The website response check now accepts that format. This confirms the reported test's backend acceptance; CRM field mapping has not been independently audited. No Catalyst functions or CRM settings were created or modified by this work.

When moving to WordPress later, its forms can post the same JSON to this endpoint; update the allowed origin if the domain changes.
