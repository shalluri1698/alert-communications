'use strict';

/** Zoho CRM client: OAuth refresh, lead mapping and lead creation. */

const ACCOUNTS = () => (process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com').replace(/\/$/, '');
const API = () => (process.env.ZOHO_API_URL || 'https://www.zohoapis.com').replace(/\/$/, '');

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

const clean = (v, max = 255) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const yes = (v) => ['on', 'yes', 'true', '1'].includes(String(v || '').toLowerCase());

// ---------- OAuth (access token cached while the container is warm) ----------
let tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN || '',
    client_id: process.env.ZOHO_CLIENT_ID || '',
    client_secret: process.env.ZOHO_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
  });
  const res = await fetch(`${ACCOUNTS()}/oauth/v2/token`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) throw new Error(`Zoho token refresh failed: ${res.status} ${JSON.stringify(json)}`);
  tokenCache = { token: json.access_token, expiresAt: Date.now() + ((json.expires_in || 3600) - 300) * 1000 };
  return tokenCache.token;
}

async function zoho(method, path, payload, retried = false) {
  const token = await getAccessToken();
  const res = await fetch(`${API()}${path}`, {
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
function splitName(full) {
  const parts = clean(full).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ['', ''];
  if (parts.length === 1) return ['', parts[0]];
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
}

/** Normalised view of a submission, shared by the Data Store row and the Zoho lead. */
function normalise(payload) {
  const f = payload.fields || {};
  const attr = payload.attribution || {};
  const lt = attr.last_touch || {};
  const ft = attr.first_touch || {};
  let first = clean(f.first_name, 40);
  let last = clean(f.last_name, 80);
  if (!first && !last) [first, last] = splitName(f.name);
  if (!last) { last = first; first = ''; }
  const pick = (k) => clean(lt[k] || ft[k]);
  return {
    form: clean(payload.form, 100) || 'website',
    first_name: first,
    last_name: last,
    email: clean(f.email, 100).toLowerCase(),
    phone: clean(f.phone, 30),
    company: clean(f.company, 200),
    message: clean(f.message, 5000),
    sms_consent: yes(f.sms_consent),
    privacy_accepted: yes(f.privacy),
    channel: clean(attr.channel),
    first_channel: clean(attr.first_channel),
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    gclid: pick('gclid'),
    landing_page: clean(ft.landing_page || lt.landing_page),
    page_url: clean(attr.page_url),
    submitted_at: clean(payload.received_at, 40) || new Date().toISOString(),
  };
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
  const n = normalise(payload);

  const desc = [`Form: ${FORM_LABELS[n.form] || n.form}`];
  if (n.message) desc.push('', 'Message:', n.message);
  if (f.inquiry_type) desc.push('', `Inquiry type: ${clean(f.inquiry_type, 500)}`);
  if (f.date) desc.push(`Request date: ${clean(f.date, 40)}`);
  desc.push('', `Privacy policy accepted: ${n.privacy_accepted ? 'Yes' : 'No / not captured'}`);
  desc.push(`SMS consent: ${n.sms_consent ? 'Yes' : 'No'}`);
  const tl = trackingLines(attr);
  if (tl.length) desc.push('', '--- Tracking ---', ...tl);
  desc.push(`Submitted: ${n.submitted_at}`);

  const lead = {
    First_Name: n.first_name || undefined,
    Last_Name: n.last_name || n.email || 'Website Lead', // mandatory in Zoho
    Email: n.email || undefined,
    Phone: n.phone || undefined,
    Company: n.company || (n.form === 'ccpa_request' ? 'CCPA Request' : 'Not provided'),
    Street: [clean(f.address), clean(f.address2)].filter(Boolean).join(', ') || undefined,
    City: clean(f.city, 100) || undefined,
    Zip_Code: clean(f.zip, 30) || undefined,
    Country: clean(f.country, 100) || undefined,
    Description: desc.join('\n').slice(0, 32000),
    Tag: [{ name: n.form }],
  };
  if (process.env.LEAD_SOURCE) lead.Lead_Source = process.env.LEAD_SOURCE;

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
        form_name: n.form,
        sms_consent: n.sms_consent,
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

/** Creates the lead; if a unique field already exists, adds a Note to that lead instead. */
async function createLead(lead) {
  const { status, json } = await zoho('POST', '/crm/v6/Leads', { data: [lead], trigger: ['workflow', 'approval', 'blueprint'] });
  const row = json && json.data && json.data[0];
  if (row && row.code === 'SUCCESS') return { id: row.details.id, created: true };
  if (row && row.code === 'DUPLICATE_DATA' && row.details && row.details.duplicate_record) {
    const id = row.details.duplicate_record.id;
    await zoho('POST', '/crm/v6/Notes', {
      data: [{ Note_Title: 'New website submission', Note_Content: lead.Description, Parent_Id: id, se_module: 'Leads' }],
    });
    return { id, created: false };
  }
  throw new Error(`Zoho insert failed: ${status} ${JSON.stringify(json).slice(0, 1000)}`);
}

module.exports = { buildLead, createLead, normalise, clean };
