import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import raleway700 from "@fontsource/raleway/files/raleway-latin-700-normal.woff2?url";
import lato400 from "@fontsource/lato/files/lato-latin-400-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureAttribution } from "../lib/tracking";
import { initAnalytics } from "../lib/analytics";
import { ld, siteGraph } from "../lib/schema";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Alert Communications" },
      { name: "description", content: "24/7 legal answering and intake services for law firms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      // Preload the two fonts the banner and form use so text doesn't reflow (layout shift) when they arrive.
      { rel: "preload", as: "font", type: "font/woff2", href: raleway700, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: lato400, crossOrigin: "anonymous" },
    ],
    scripts: [
      ld(siteGraph()),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TF57DN4K"
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function injectScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.id = id;
  s.async = true;
  s.src = src;
  document.body.appendChild(s);
}

/** Runs after the page has painted, or on first interaction, so third-party scripts never compete with the initial render. */
function runDeferred(fn: () => void, delayMs: number) {
  const events = ["pointerdown", "scroll", "keydown", "touchstart"] as const;
  const run = () => { cleanup(); fn(); };
  const onAct = () => run();
  const cleanup = () => { window.clearTimeout(t); events.forEach((e) => window.removeEventListener(e, onAct)); };
  events.forEach((e) => window.addEventListener(e, onAct, { passive: true, once: true }));
  const t = window.setTimeout(run, delayMs);
}

function loadGtm() {
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  injectScript("gtm-script", "https://www.googletagmanager.com/gtm.js?id=GTM-TF57DN4K");
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => { captureAttribution(); }, []);
  useEffect(() => { void initAnalytics((cb) => { router.subscribe("onResolved", cb); }); }, [router]);
  // Third-party scripts: loaded after first paint, or on first interaction, so they never slow the page.
  useEffect(() => {
    // Consent banner first, then the tag manager (which respects consent).
    runDeferred(() => injectScript("osano-script", "https://cmp.osano.com/16CVvZSmPFx0VPvo9/c991e24a-07c0-4d7f-ab46-02c0ff9d027e/osano.js"), 1500);
    runDeferred(loadGtm, 2500);
    // Live chat widget: starts about a second after the page opens.
    runDeferred(() => injectScript("bb2c488a8a75_prompt", "https://platform.clientchatlive.com/chat/init/FuEqOw/prompt.js"), 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
