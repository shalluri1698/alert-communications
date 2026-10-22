import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveLegal } from "@/components/live-pages";

export const Route = createFileRoute("/data-processing-addendum")({
  head: () => pageHead("data-processing-addendum", "/data-processing-addendum"),
  loader: async () => (await import("@/data/legal/data-processing-addendum.json")).default as { title: string; html: string },
  component: Page,
});

function Page() {
  const d = Route.useLoaderData();
  return <LiveLegal title={d.title} html={d.html} />;
}
