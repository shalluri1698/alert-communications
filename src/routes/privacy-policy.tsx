import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveLegal } from "@/components/live-pages";

export const Route = createFileRoute("/privacy-policy")({
  head: () => pageHead("privacy-policy", "/privacy-policy"),
  loader: async () => (await import("@/data/legal/privacy-policy.json")).default as { title: string; html: string },
  component: Page,
});

function Page() {
  const d = Route.useLoaderData();
  return <LiveLegal title={d.title} html={d.html} />;
}
