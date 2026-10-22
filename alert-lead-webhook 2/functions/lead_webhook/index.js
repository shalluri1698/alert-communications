'use strict';

/**
 * Catalyst Advanced I/O function: lead_webhook
 *
 * Receives POSTs from the website (Lovable server function today, WordPress PHP later):
 *   { form, fields: {..}, attribution: {..}, received_at }
 * and creates a Lead in Zoho CRM. All four site forms become Leads, tagged by form name.
 *
 * Env variables (set in catalyst-config.json or the Catalyst console):
 *   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN  - Zoho self-client OAuth (scope ZohoCRM.modules.ALL)
 *   ZOHO_ACCOUNTS_URL   - default https://accounts.zoho.com (US)
 *   ZOHO_API_URL        - default https://www.zohoapis.com  (US)
 *   LEAD_SECRET         - shared secret the website sends in the X-Lead-Secret header
 *   LEAD_SOURCE         - value for the Lead Source picklist (default "Website"; empty = don't set)
 *   ZOHO_TRACKING_FIELDS - optional JSON map of tracking keys -> Zoho custom field API names,
 *                          e.g. {"utm_source":"UTM_Source","gclid":"GCLID"}. Empty = tracking goes in Description only.
 */

const ACCOUNTS = (process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com').replace(/\/$/, '');
const API = (process.env.ZOHO_API_URL || 'https://www.zohoapis.com').replace(/\/$/, '');

const FORM_LABELS = {
  quote_form: 'Quote Form',
  live_form: 'Contact / Quote Form',
  client_support: 'Client Support',
  ccpa_request: 'CCPA Information Request',
};

const TRACK_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'gclid', 'gbraid', 'wbraid', 'gad_source', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id',
];

// ---------- Zoho OAuth (access token cached while the container is warm) ----------
let tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN || '',
    client_id: process.env.ZOHO_CLIENT_ID || '',
    client_secret: process.env.ZOHO_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
  });
  const res = await fetch(`${ACCOUNTS}/oauth/v2/token`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(`Zoho token refresh failed: ${res.status} ${JSON.stringify(json)}`);
  }
  // Refresh 5 minutes before Zoho's expiry (normally 3600s).
  tokenCache = { token: json.access_token, expiresAt: Date.now() + ((json.expires_in || 3600) - 300) * 1000 };
  return tokenCache.token;
}

async function zoho(method, path, payload, retried = false) {
  const token = await getAccessToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 && !retried) {
    tokenCache = { token: null, expiresAt: 0 };
    return zoho(method, path, payload, true);
  }
  return { status: res.status, json };
}

// ---------- Mapping ----------
const clean = (v, max = 255) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const yes = (v) => ['on', 'yes', 'true', '1'].includes(String(v || '').toLowerCase());

function splitName(full) {
  const parts = clean(full).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ['', ''];
  if (parts.length === 1) return ['', parts[0]];
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
}

function trackingLines(attr) {
  const lines = [];
  const add = (label, v) => { if (v) lines.push(`${label}: ${v}`); };
  const lt = attr.last_touch || {};
  const ft = attr.first_touch || {};
  add('Channel (last touch)', attr.channel);
  add('Channel (first touch)', attr.first_channel);
  for (const k of TRACK_KEYS) add(k, lt[k] || ft[k]);
  add('Landing page (first)', ft.landing_page);
  add('Landing page (last)', lt.landing_page);
  add('Referrer', lt.referrer || ft.referrer);
  add('Form page', attr.page_url);
  add('GA client ID', attr.ga_client_id);
  return lines;
}

function buildLead(payload) {
  const f = payload.fields || {};
  const attr = payload.attribution || {};
  const form = clean(payload.form, 100) || 'website';

  let first = clean(f.first_name, 40);
  let last = clean(f.last_name, 80);
  if (!first && !last) [first, last] = splitName(f.name);
  if (!last) last = first || clean(f.email) || 'Website Lead'; // Last_Name is mandatory in Zoho
  if (last === first) first = '';

  const desc = [`Form: ${FORM_LABELS[form] || form}`];
  if (f.message) desc.push('', 'Message:', clean(f.message, 5000));
  if (f.inquiry_type) desc.push('', `Inquiry type: ${clean(f.inquiry_type, 500)}`);
  if (f.date) desc.push(`Request date: ${clean(f.date, 40)}`);
  desc.push('', `Privacy policy accepted: ${yes(f.privacy) ? 'Yes' : 'No / not captured'}`);
  desc.push(`SMS consent: ${yes(f.sms_consent) ? 'Yes' : 'No'}`);
  const tl = trackingLines(attr);
  if (tl.length) desc.push('', '--- Tracking ---', ...tl);
  desc.push(`Submitted: ${payload.received_at || new Date().toISOString()}`);

  const lead = {
    First_Name: first || undefined,
    Last_Name: last,
    Email: clean(f.email, 100) || undefined,
    Phone: clean(f.phone, 30) || undefined,
    Company: clean(f.company, 200) || (form === 'ccpa_request' ? 'CCPA Request' : 'Not provided'),
    Street: [clean(f.address), clean(f.address2)].filter(Boolean).join(', ') || undefined,
    City: clean(f.city, 100) || undefined,
    Zip_Code: clean(f.zip, 30) || undefined,
    Country: clean(f.country, 100) || undefined,
    Description: desc.join('\n').slice(0, 32000),
    Tag: [{ name: form }],
  };
  if (process.env.LEAD_SOURCE) lead.Lead_Source = process.env.LEAD_SOURCE;

  // Optional: tracking into dedicated custom fields.
  if (process.env.ZOHO_TRACKING_FIELDS) {
    try {
      const map = JSON.parse(process.env.ZOHO_TRACKING_FIELDS);
      const lt = attr.last_touch || {};
      const ft = attr.first_touch || {};
      const values = {
        ...Object.fromEntries(TRACK_KEYS.map((k) => [k, lt[k] || ft[k]])),
        channel: attr.channel,
        first_channel: attr.first_channel,
        landing_page: ft.landing_page,
        referrer: lt.referrer || ft.referrer,
        form_page: attr.page_url,
        form_name: form,
        sms_consent: yes(f.sms_consent),
      };
      for (const [key, apiName] of Object.entries(map)) {
        const v = values[key];
        if (v !== undefined && v !== '') lead[apiName] = typeof v === 'string' ? clean(v) : v;
      }
    } catch (e) {
      console.error('ZOHO_TRACKING_FIELDS is not valid JSON; skipping custom fields', e.message);
    }
  }
  for (const k of Object.keys(lead)) if (lead[k] === undefined) delete lead[k];
  return lead;
}

async function createLead(lead) {
  const { status, json } = await zoho('POST', '/crm/v6/Leads', { data: [lead], trigger: ['workflow', 'approval', 'blueprint'] });
  const row = json && json.data && json.data[0];
  if (row && row.code === 'SUCCESS') return { id: row.details.id, created: true };

  // A unique field (e.g. Email) already exists: attach this submission as a Note on that Lead.
  if (row && row.code === 'DUPLICATE_DATA' && row.details && row.details.duplicate_record) {
    const id = row.details.duplicate_record.id;
    await zoho('POST', '/crm/v6/Notes', {
      data: [{ Note_Title: 'New website submission', Note_Content: lead.Description, Parent_Id: id, se_module: 'Leads' }],
    });
    return { id, created: false };
  }
  throw new Error(`Zoho insert failed: ${status} ${JSON.stringify(json)}`);
}

// ---------- HTTP handler ----------
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 200000) reject(new Error('Body too large')); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'POST only' });

    const secret = process.env.LEAD_SECRET;
    if (secret && req.headers['x-lead-secret'] !== secret) return send(res, 401, { ok: false, error: 'Unauthorized' });

    let payload;
    try { payload = JSON.parse(await readBody(req)); } catch { return send(res, 400, { ok: false, error: 'Invalid JSON' }); }
    const f = (payload && payload.fields) || {};

    // Honeypot: bots fill the hidden "website" field. Accept silently, create nothing.
    if (f.website) return send(res, 200, { ok: true, skipped: 'honeypot' });
    if (!clean(f.email) && !clean(f.phone)) return send(res, 400, { ok: false, error: 'Email or phone required' });

    const lead = buildLead(payload);
    const result = await createLead(lead);
    console.log(`[lead] ${payload.form} -> Zoho Lead ${result.id} (${result.created ? 'created' : 'note on existing'})`);
    return send(res, 200, { ok: true, ...result });
  } catch (e) {
    console.error('[lead] error', e && e.message);
    return send(res, 502, { ok: false, error: 'Lead could not be saved' });
  }
}

module.exports = handler;
module.exports.buildLead = buildLead; // exported for local tests
