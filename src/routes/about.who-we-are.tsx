import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveWhoWeAre } from "@/components/live-pages";

export const Route = createFileRoute("/about/who-we-are")({
  head: () => pageHead("about/who-we-are", "/about/who-we-are"),
  component: LiveWhoWeAre,
});
