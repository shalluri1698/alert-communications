import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { findRedirect, recordMiss, countRedirectHit } from "./lib/redirects.server";
import { instantMatch } from "./lib/site-pages";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withEdgeCache(request, await applyAiRedirects(request, normalized, env, ctx));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

function isDocumentRequest(request: Request): boolean {
  if (request.method !== "GET") return false;
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("text/html") && accept !== "*/*") return false;
  const path = new URL(request.url).pathname;
  if (path.startsWith("/_") || path.startsWith("/api/") || path.startsWith("/.")) return false;
  return !/\.[a-z0-9]{2,5}$/i.test(path);
}

function background(ctx: unknown, work: Promise<unknown>) {
  const waitUntil = (ctx as { waitUntil?: (p: Promise<unknown>) => void } | undefined)?.waitUntil;
  if (typeof waitUntil === "function") waitUntil.call(ctx, work.catch(() => {}));
  else void work.catch(() => {});
}

/** Site URLs end with "/", so dead paths are stored in that form too. */
const withSlash = (p: string) => (p.endsWith("/") ? p : p + "/");

/**
 * On a 404, serve a stored redirect (303) so Google learns the new destination.
 * Unknown paths get an instant 302 guess and are queued for the AI matcher.
 */
async function applyAiRedirects(request: Request, response: Response, env: unknown, ctx: unknown): Promise<Response> {
  if (response.status !== 404 || !isDocumentRequest(request)) return response;

  const url = new URL(request.url);
  const path = withSlash(url.pathname);
  const hit = await findRedirect(path, env);

  if (hit) {
    background(ctx, countRedirectHit(path, env));
    return new Response(null, {
      status: hit.status || 303,
      headers: { Location: hit.to_path + url.search, "Cache-Control": "no-store", "X-Redirect-Source": "ai-redirect-engine" },
    });
  }

  background(ctx, recordMiss(path, request.headers.get("referer"), env));

  const guess = instantMatch(path);
  const target = guess && guess.path !== path ? guess.path : "/";
  return new Response(null, {
    status: 302,
    headers: { Location: target + url.search, "Cache-Control": "no-store", "X-Redirect-Source": target === "/" ? "home-fallback" : "instant-match" },
  });
}

const UNCACHEABLE = /^\/(api|_serverFn|_|auth|admin)(\/|$)/;

/** Public marketing HTML: let the CDN keep a shared copy (browsers still revalidate). */
function withEdgeCache(request: Request, response: Response): Response {
  const url = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || response.status !== 200) return response;
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  if (url.search || request.headers.get("cookie") || response.headers.get("set-cookie")) return response;
  if (UNCACHEABLE.test(url.pathname)) return response;
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
