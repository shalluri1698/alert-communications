# Alert Communications – website leads → Catalyst → Zoho CRM

Every website form (quote, contact, client support, CCPA) posts to one Catalyst function. The function:

1. saves the submission in the Catalyst **Data Store** (table `WebLeads`), so nothing is lost if Zoho is down;
2. creates a **Lead** in Zoho CRM (US), tagged with the form name;
3. records the Zoho result on the row (`synced`, `note_added` or `failed`). Failed rows can be retried.

```
Website form ──POST /leads──▶ Catalyst lead_webhook ──▶ Data Store (WebLeads)
                                        └──────────────▶ Zoho CRM Leads
```

---

## 1. Create the Data Store table

Catalyst console → your project → **Cloud Scale → Data Store → Create Table** → name `WebLeads`.
Add these columns (Catalyst adds `ROWID`, `CREATEDTIME`, `MODIFIEDTIME` itself):

| Column | Type | Notes |
|---|---|---|
| `form_name` | Var Char | quote_form, live_form, client_support, ccpa_request |
| `first_name` | Var Char | |
| `last_name` | Var Char | |
| `email` | Var Char | |
| `phone` | Var Char | |
| `company` | Var Char | |
| `message` | Text | |
| `sms_consent` | Boolean | default false |
| `privacy_accepted` | Boolean | default false |
| `channel` | Var Char | google_ads, organic_search, direct… |
| `utm_source` | Var Char | |
| `utm_medium` | Var Char | |
| `utm_campaign` | Var Char | |
| `gclid` | Var Char | |
| `landing_page` | Var Char | |
| `page_url` | Var Char | page the form was submitted on |
| `submitted_at` | Var Char | ISO timestamp |
| `fields_json` | Text | every form field, as sent |
| `attribution_json` | Text | full tracking data, as sent |
| `zoho_status` | Var Char | pending / synced / note_added / failed |
| `zoho_lead_id` | Var Char | |
| `zoho_error` | Text | last Zoho error, if any |
| `attempts` | Int | default 0 |

Column names must match exactly (lowercase with underscores).
Under the table's **Scopes & Permissions**, leave public access off. The function reads and writes as admin.

## 2. Get Zoho OAuth credentials (one time)

1. https://api-console.zoho.com → **Add Client** → **Self Client** → Create. Copy **Client ID** and **Client Secret**.
2. **Generate Code** tab → scope `ZohoCRM.modules.ALL,ZohoCRM.settings.READ`, 10 minutes → Create → copy the code.
3. Within 10 minutes:

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=authorization_code" -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" -d "code=GENERATED_CODE"
```

4. Keep the `refresh_token` from the response. It doesn't expire, so treat it like a password.

## 3. Deploy the function

```bash
npm install -g zcatalyst-cli
catalyst login
cd alert-lead-webhook
catalyst init                      # pick your Catalyst project; keep existing files when asked
cd functions/lead_webhook && npm install && cd ../..
catalyst deploy
```

The deploy prints the base URL, e.g.
`https://<project>-<id>.development.catalystserverless.com/server/lead_webhook`

Use **Deploy to Production** in the console when going live (the production URL is different).

## 4. Environment variables

Catalyst console → **Serverless → Functions → lead_webhook → Configuration → Environment Variables**.
**Don't** put real values in `catalyst-config.json`, because that file is in Git.

| Variable | Value |
|---|---|
| `ZOHO_CLIENT_ID` | from step 2 |
| `ZOHO_CLIENT_SECRET` | from step 2 |
| `ZOHO_REFRESH_TOKEN` | from step 2 |
| `ZOHO_ACCOUNTS_URL` | `https://accounts.zoho.com` |
| `ZOHO_API_URL` | `https://www.zohoapis.com` |
| `LEAD_SECRET` | long random string the **website** sends (`openssl rand -hex 24`) |
| `ADMIN_KEY` | a **different** long random string, for the admin calls |
| `LEAD_SOURCE` | `Website` (add this option to Zoho's Lead Source picklist, or use an existing value) |
| `DATASTORE_TABLE` | `WebLeads` |
| `ZOHO_TRACKING_FIELDS` | optional, see step 7 |

---

## 5. API reference

Base URL: `https://<project>-<id>.<env>.catalystserverless.com/server/lead_webhook`

### Website call

**`POST /leads`** — header `X-Lead-Secret: <LEAD_SECRET>`, `Content-Type: application/json`
(`POST /` does the same thing.)

```json
{
  "form": "quote_form",
  "fields": {
    "name": "Jane Smith",
    "email": "jane@smithlaw.com",
    "company": "Smith Law",
    "phone": "5555555555",
    "message": "Looking for after-hours intake",
    "privacy": "on",
    "sms_consent": "on",
    "website": ""
  },
  "attribution": {
    "channel": "google_ads",
    "first_channel": "organic_search",
    "first_touch": { "landing_page": "https://…", "referrer": "https://google.com/" },
    "last_touch":  { "utm_source": "google", "utm_campaign": "intake", "gclid": "…" },
    "page_url": "https://…/contact/"
  },
  "received_at": "2026-10-22T18:00:00Z"
}
```

| Form | `form` value | Fields |
|---|---|---|
| Quote form | `quote_form` | name, email, company, phone, message, privacy, sms_consent |
| Contact / quote (About pages) | `live_form` | same as above |
| Client support | `client_support` | same as above |
| CCPA request | `ccpa_request` | date, first_name, last_name, phone, email, email_confirm, inquiry_type ("Data Access; Data Deletion"), address, address2, city, zip, country, message, privacy, sms_consent |

Rules: email **or** phone required. `website` is a hidden honeypot field; if it is filled, the request is accepted but nothing is stored.

Responses:

| Status | Meaning | Body |
|---|---|---|
| 200 | Stored and sent to Zoho | `{"ok":true,"id":"<ROWID>","zoho":{"status":"synced","zoho_lead_id":"…"}}` |
| 202 | Stored, Zoho failed (will be retried) | `{"ok":true,"id":"<ROWID>","zoho":{"status":"failed",…}}` |
| 400 | Missing email/phone or bad JSON | `{"ok":false,"error":"…"}` |
| 401 | Wrong/missing `X-Lead-Secret` | |
| 502 | Neither Data Store nor Zoho accepted it | |

The website should show the thank-you message for any 200 or 202.

### Admin calls — header `X-Admin-Key: <ADMIN_KEY>`

| Call | What it does |
|---|---|
| `GET /leads?status=failed&limit=50` | List stored submissions by status (`failed`, `pending`, `synced`, `note_added`; comma-separate several) |
| `GET /leads/<ROWID>` | One stored submission |
| `POST /leads/retry` | Re-send every `failed`/`pending` row to Zoho (rows stop retrying after 5 attempts) |
| `POST /leads/<ROWID>/retry` | Re-send one row, regardless of attempts |
| `GET /health` | No key needed; returns `{"ok":true}` |

## 6. Test

```bash
BASE="https://<project>-<id>.development.catalystserverless.com/server/lead_webhook"

curl "$BASE/health"

curl -X POST "$BASE/leads" -H "Content-Type: application/json" -H "X-Lead-Secret: $LEAD_SECRET" \
  -d '{"form":"quote_form","fields":{"name":"Test Lead","email":"test@example.com","company":"Test Law","phone":"5555555555","message":"Test","privacy":"on"},"attribution":{"channel":"direct"}}'

curl "$BASE/leads?status=synced,failed" -H "X-Admin-Key: $ADMIN_KEY"
```

Check: a row in **Data Store → WebLeads** with `zoho_status = synced`, and a Lead tagged `quote_form` in Zoho. Delete the test records afterwards.
Logs: Catalyst console → **Logs** → lead_webhook (`[lead] quote_form row=… zoho=synced …`).

## 7. Optional: tracking in reportable Zoho fields

Tracking always goes into the Lead's Description, and the main values are in their own Data Store columns. To also report on them in Zoho, create these Lead custom fields, then set `ZOHO_TRACKING_FIELDS` to this JSON, using the API names Zoho shows for your fields:

```json
{"utm_source":"UTM_Source","utm_medium":"UTM_Medium","utm_campaign":"UTM_Campaign","utm_term":"UTM_Term","utm_content":"UTM_Content","gclid":"GCLID","fbclid":"FBCLID","msclkid":"MSCLKID","channel":"Lead_Channel","landing_page":"Landing_Page","form_name":"Website_Form","sms_consent":"SMS_Consent"}
```

## What lands in Zoho

| Website field | Zoho Lead field |
|---|---|
| name (split) / first_name, last_name | First Name, Last Name |
| email, phone, company | Email, Phone, Company (CCPA without company → "CCPA Request") |
| address, address2, city, zip, country | Street, City, Zip Code, Country |
| form | Tag |
| message, inquiry type, consents, tracking | Description |
| – | Lead Source = `LEAD_SOURCE` |

Workflow rules, approvals and blueprints fire on insert. If Email is unique in your CRM and the person exists, the submission becomes a **Note** on that lead (`zoho_status = note_added`).

## Files

```
alert-lead-webhook/
├── catalyst.json
└── functions/lead_webhook/
    ├── index.js            routes (Express)
    ├── lib/zoho.js         Zoho OAuth, field mapping, lead creation
    ├── lib/store.js        Data Store access (WebLeads)
    ├── package.json
    └── catalyst-config.json   (no secrets in here)
```
