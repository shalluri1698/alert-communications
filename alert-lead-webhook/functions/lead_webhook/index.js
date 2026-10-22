'use strict';

/**
 * Catalyst Advanced I/O function: lead_webhook
 * Base URL: https://<project>-<id>.<env>.catalystserverless.com/server/lead_webhook
 *
 * Website API (header X-Lead-Secret: LEAD_SECRET)
 *   POST /leads            save submission to Data Store, then create Zoho Lead   (POST / also works)
 * Admin API (header X-Admin-Key: ADMIN_KEY)
 *   GET  /leads?status=failed&limit=50   list stored submissions by Zoho sync status
 *   GET  /leads/:id                      one stored submission
 *   POST /leads/retry                    re-send all failed/pending submissions to Zoho (max 5 attempts each)
 *   POST /leads/:id/retry                re-send one submission
 * Public
 *   GET  /health
 */

const crypto = require('crypto');
const express = require('express');
const { buildLead, createLead, normalise } = require('./lib/zoho');
const { catalystStore } = require('./lib/store');

const MAX_ATTEMPTS = 5;

const app = express();
app.use(express.json({ limit: '200kb' }));
app.locals.storeFactory = catalystStore; // swapped in tests

// ---------- helpers ----------
function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y);
}

const requireKey = (envName, header) => (req, res, next) => {
  const expected = process.env[envName];
  if (!expected) return res.status(500).json({ ok: false, error: `${envName} is not configured` });
  if (!safeEqual(req.get(header), expected)) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  next();
};
const websiteAuth = requireKey('LEAD_SECRET', 'X-Lead-Secret');
const adminAuth = requireKey('ADMIN_KEY', 'X-Admin-Key');

const truncate = (s, n) => String(s || '').slice(0, n);

/** Row stored in the WebLeads table. */
function toRow(payload) {
  const n = normalise(payload);
  return {
    form_name: n.form,
    first_name: n.first_name,
    last_name: n.last_name,
    email: n.email,
    phone: n.phone,
    company: n.company,
    message: n.message,
    sms_consent: n.sms_consent,
    privacy_accepted: n.privacy_accepted,
    channel: n.channel,
    utm_source: n.utm_source,
    utm_medium: n.utm_medium,
    utm_campaign: n.utm_campaign,
    gclid: n.gclid,
    landing_page: n.landing_page,
    page_url: n.page_url,
    submitted_at: n.submitted_at,
    fields_json: JSON.stringify(payload.fields || {}),
    attribution_json: JSON.stringify(payload.attribution || {}),
    zoho_status: 'pending',
    zoho_lead_id: '',
    zoho_error: '',
    attempts: 0,
  };
}

function payloadFromRow(row) {
  return {
    form: row.form_name,
    fields: JSON.parse(row.fields_json || '{}'),
    attribution: JSON.parse(row.attribution_json || '{}'),
    received_at: row.submitted_at,
  };
}

/** Push one stored submission to Zoho and record the outcome. */
async function syncToZoho(store, rowId, payload, previousAttempts = 0) {
  try {
    const result = await createLead(buildLead(payload));
    if (rowId) {
      await store.update(rowId, {
        zoho_status: result.created ? 'synced' : 'note_added',
        zoho_lead_id: String(result.id),
        zoho_error: '',
        attempts: previousAttempts + 1,
      });
    }
    return { status: result.created ? 'synced' : 'note_added', zoho_lead_id: String(result.id) };
  } catch (e) {
    console.error('[lead] zoho error', rowId, e.message);
    if (rowId) {
      await store.update(rowId, { zoho_status: 'failed', zoho_error: truncate(e.message, 2000), attempts: previousAttempts + 1 })
        .catch((u) => console.error('[lead] could not record failure', u.message));
    }
    return { status: 'failed', error: 'Zoho sync failed; stored for retry' };
  }
}

// ---------- routes ----------
app.get('/health', (req, res) => res.json({ ok: true, service: 'lead_webhook' }));

async function handleCreate(req, res) {
  const payload = req.body || {};
  const f = payload.fields || {};
  if (typeof payload !== 'object' || typeof f !== 'object') return res.status(400).json({ ok: false, error: 'Invalid body' });

  // Honeypot: bots fill the hidden "website" field. Accept silently, store nothing.
  if (f.website) return res.json({ ok: true, skipped: 'honeypot' });
  if (!String(f.email || '').trim() && !String(f.phone || '').trim()) {
    return res.status(400).json({ ok: false, error: 'Email or phone required' });
  }

  const store = req.app.locals.storeFactory(req);
  let rowId = null;
  try {
    rowId = await store.insert(toRow(payload));
  } catch (e) {
    console.error('[lead] data store insert failed', e.message); // still try Zoho so the lead isn't lost
  }

  const zoho = await syncToZoho(store, rowId, payload);
  console.log(`[lead] ${payload.form} row=${rowId} zoho=${zoho.status} ${zoho.zoho_lead_id || ''}`);

  if (!rowId && zoho.status === 'failed') return res.status(502).json({ ok: false, error: 'Lead could not be saved' });
  return res.status(zoho.status === 'failed' ? 202 : 200).json({ ok: true, id: rowId, zoho });
}
app.post('/', websiteAuth, handleCreate);
app.post('/leads', websiteAuth, handleCreate);

app.get('/leads', adminAuth, async (req, res) => {
  try {
    const statuses = String(req.query.status || 'failed').split(',');
    const rows = await req.app.locals.storeFactory(req).listByStatus(statuses, req.query.limit, 1000);
    res.json({ ok: true, count: rows.length, rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/leads/retry', adminAuth, async (req, res) => {
  try {
    const store = req.app.locals.storeFactory(req);
    const rows = await store.listByStatus(['failed', 'pending'], req.query.limit || 50, MAX_ATTEMPTS);
    const results = [];
    for (const row of rows) {
      const r = await syncToZoho(store, row.ROWID, payloadFromRow(row), Number(row.attempts) || 0);
      results.push({ id: row.ROWID, ...r });
    }
    res.json({ ok: true, retried: results.length, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/leads/:id', adminAuth, async (req, res) => {
  try {
    const row = await req.app.locals.storeFactory(req).get(req.params.id);
    res.json({ ok: true, row });
  } catch (e) {
    res.status(404).json({ ok: false, error: 'Not found' });
  }
});

app.post('/leads/:id/retry', adminAuth, async (req, res) => {
  try {
    const store = req.app.locals.storeFactory(req);
    const row = await store.get(req.params.id);
    const r = await syncToZoho(store, row.ROWID, payloadFromRow(row), Number(row.attempts) || 0);
    res.json({ ok: true, id: row.ROWID, ...r });
  } catch (e) {
    res.status(404).json({ ok: false, error: 'Not found' });
  }
});

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

module.exports = app;
