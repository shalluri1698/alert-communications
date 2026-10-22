# Alert Communications – website leads → Catalyst → Zoho CRM

Every website form (quote, contact, client support, CCPA) posts to this Catalyst function, which creates a **Lead** in Zoho CRM (US data center), tagged with the form name.

```
Website form → Lovable server function (later: WordPress PHP) → Catalyst lead_webhook → Zoho CRM Leads
```

## 1. Get Zoho OAuth credentials (one time, ~5 min)

1. Go to https://api-console.zoho.com → **Add Client** → **Self Client** → Create.
2. Copy the **Client ID** and **Client Secret**.
3. On the **Generate Code** tab enter scope `ZohoCRM.modules.ALL,ZohoCRM.settings.READ`, duration 10 minutes, description "Website leads" → Create. Copy the code.
4. Within 10 minutes, exchange it for a refresh token (replace the three values):

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=authorization_code" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "code=GENERATED_CODE"
```

5. Save the `refresh_token` from the response. It doesn't expire; treat it like a password.

> Use a Zoho user that can create Leads. Leads will show that user as creator unless an assignment rule reassigns them.

## 2. Deploy the function

```bash
npm install -g zcatalyst-cli
catalyst login
cd alert-lead-webhook
catalyst init          # choose your Catalyst project; when asked, keep existing files
catalyst deploy
```

The deploy output gives the URL, like
`https://<project>-<id>.development.catalystserverless.com/server/lead_webhook/`
(Use **Deploy to Production** in the Catalyst console when you go live; the production URL differs.)

## 3. Set environment variables

Catalyst console → **Serverless → Functions → lead_webhook → Configuration → Environment Variables** (or fill `catalyst-config.json` before deploying – but don't commit secrets to Git):

| Variable | Value |
|---|---|
| `ZOHO_CLIENT_ID` | from step 1 |
| `ZOHO_CLIENT_SECRET` | from step 1 |
| `ZOHO_REFRESH_TOKEN` | from step 1 |
| `ZOHO_ACCOUNTS_URL` | `https://accounts.zoho.com` |
| `ZOHO_API_URL` | `https://www.zohoapis.com` |
| `LEAD_SECRET` | any long random string (e.g. `openssl rand -hex 24`) |
| `LEAD_SOURCE` | `Website` (add this value to the Lead Source picklist in Zoho, or set to an existing value) |
| `ZOHO_TRACKING_FIELDS` | leave empty for now – see step 6 |

## 4. Point the website at it (Lovable)

In Lovable → project **Secrets**, add:

- `LEAD_WEBHOOK_URL` = the function URL from step 2
- `LEAD_WEBHOOK_SECRET` = the same value as `LEAD_SECRET`

The site code changes in `website-form-fixes.patch` must be in the repo (they send the secret header and fix two form bugs).

## 5. Test

```bash
curl -X POST "FUNCTION_URL" -H "Content-Type: application/json" -H "X-Lead-Secret: YOUR_SECRET" \
  -d '{"form":"quote_form","fields":{"name":"Test Lead","email":"test@example.com","company":"Test Law","phone":"5555555555","message":"Test","privacy":"on"},"attribution":{"channel":"direct"}}'
```

Expect `{"ok":true,"id":"...","created":true}` and a new Lead tagged `quote_form` in Zoho. Then submit each form on the Lovable preview. Delete the test leads afterwards.

Logs: Catalyst console → **Logs** → lead_webhook (each lead logs `[lead] quote_form -> Zoho Lead <id>`).

## What lands in Zoho

| Website field | Zoho Lead field |
|---|---|
| name (split) / first_name, last_name | First Name, Last Name |
| email, phone, company | Email, Phone, Company (CCPA without company → "CCPA Request") |
| address, address2, city, zip, country | Street, City, Zip Code, Country |
| form name | Tag (quote_form, live_form, client_support, ccpa_request) |
| message, inquiry type, consents, UTMs, click IDs, landing page, referrer | Description |
| – | Lead Source = `LEAD_SOURCE` |

Workflow rules, approvals and blueprints fire on insert, so existing Zoho assignment/notification rules apply.
If Email is a unique field in your CRM and the person already exists, the submission is added as a **Note** on the existing lead instead of failing.
Bots that fill the hidden `website` field are dropped silently.

## 6. Optional: tracking in reportable fields

To report on ad sources in Zoho, create these custom fields on Leads (Setup → Modules → Leads → Layout), then set `ZOHO_TRACKING_FIELDS` to the JSON below using the API names Zoho shows (Setup → Developer Hub → APIs → API names):

| Field label | Type |
|---|---|
| UTM Source, UTM Medium, UTM Campaign, UTM Term, UTM Content | Single line |
| GCLID, FBCLID, MSCLKID | Single line |
| Lead Channel | Single line |
| Landing Page | URL |
| Website Form | Single line |
| SMS Consent | Checkbox |

```json
{"utm_source":"UTM_Source","utm_medium":"UTM_Medium","utm_campaign":"UTM_Campaign","utm_term":"UTM_Term","utm_content":"UTM_Content","gclid":"GCLID","fbclid":"FBCLID","msclkid":"MSCLKID","channel":"Lead_Channel","landing_page":"Landing_Page","form_name":"Website_Form","sms_consent":"SMS_Consent"}
```

Tracking still goes into Description either way.

## Later: WordPress

The WordPress theme will post the same JSON to the same URL with the same `X-Lead-Secret` header (URL and secret stored in `wp-config.php`), so nothing here changes.
