import assert from "node:assert/strict";
import { test } from "node:test";
import { handleLeadSubmission } from "../src/lib/submit-lead.server.ts";

const data = () => ({
  form: "live_form",
  fields: { name: "Test Person", company: "Test Law", email: "test@example.com", phone: "5551234567", privacy: "on", message: "Mocked test" },
  attribution: { last_touch: { utm_source: "google" } },
});
const request = (payload, origin = "https://alert.example") => new Request("https://alert.example/api/forms/submit", {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(payload),
});

test("relay forwards payload and optional key server-side without browser Origin", async (t) => {
  const originalUrl = process.env.CATALYST_FORM_URL;
  const originalKey = process.env.CATALYST_FORM_API_KEY;
  t.after(() => {
    if (originalUrl === undefined) delete process.env.CATALYST_FORM_URL; else process.env.CATALYST_FORM_URL = originalUrl;
    if (originalKey === undefined) delete process.env.CATALYST_FORM_API_KEY; else process.env.CATALYST_FORM_API_KEY = originalKey;
  });
  process.env.CATALYST_FORM_URL = "https://catalyst.example/lead";
  process.env.CATALYST_FORM_API_KEY = "test-private-key";
  const payload = data();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://catalyst.example/lead");
    assert.equal(options.headers["X-API-Key"], "test-private-key");
    assert.equal(new Headers(options.headers).has("origin"), false);
    assert.equal(new Headers(options.headers).has("cookie"), false);
    assert.deepEqual(JSON.parse(options.body), payload);
    return new Response(JSON.stringify({ success: true, createdLeadId: "private-id" }), { status: 201 });
  });
  const result = await handleLeadSubmission(request(payload));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
});

test("cross-origin, invalid and oversized requests never reach Catalyst", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected upstream call"); });
  assert.equal((await handleLeadSubmission(request(data(), "https://foreign.example"))).status, 403);
  const missingPrivacy = data(); delete missingPrivacy.fields.privacy;
  assert.equal((await handleLeadSubmission(request(missingPrivacy))).status, 400);
  const ccpa = data(); ccpa.form = "ccpa_request";
  Object.assign(ccpa.fields, { first_name: "Test", last_name: "Person", email_confirm: "other@example.com" });
  assert.equal((await handleLeadSubmission(request(ccpa))).status, 400);
  assert.equal((await handleLeadSubmission(request({ blob: "a".repeat(70000) }))).status, 413);
  const bot = data(); bot.fields.website = "spam";
  assert.deepEqual(await (await handleLeadSubmission(request(bot))).json(), { ok: true });
  assert.equal(globalThis.fetch.mock.calls.length, 0);
});

test("only successful HTTP responses with a true acceptance flag count as delivery", async (t) => {
  let status = 200;
  let body = '{"ok":true}';
  t.mock.method(globalThis, "fetch", async () => new Response(body, { status }));
  assert.equal((await handleLeadSubmission(request(data()))).status, 200);
  for (const [code, value] of [[500, '{"success":true}'], [200, '{"success":false}'], [201, '{}'], [200, 'I am Live and Ready.']]) {
    status = code; body = value;
    assert.equal((await handleLeadSubmission(request(data()))).status, 502);
  }
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Offline"); });
  assert.equal((await handleLeadSubmission(request(data()))).status, 502);
});
