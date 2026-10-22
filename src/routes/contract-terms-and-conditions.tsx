import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveLegal } from "@/components/live-pages";

export const Route = createFileRoute("/contract-terms-and-conditions")({
  head: () => pageHead("contract-terms-and-conditions", "/contract-terms-and-conditions"),
  loader: async () => (await import("@/data/legal/contract-terms-and-conditions.json")).default as { title: string; html: string },
  component: Page,
});

function Page() {
  const d = Route.useLoaderData();
  return <LiveLegal title={d.title} html={d.html} />;
}
