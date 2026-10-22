import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveCaseStudies } from "@/components/live-pages";

export const Route = createFileRoute("/case-studies")({
  head: () => pageHead("case-studies", "/case-studies"),
  component: LiveCaseStudies,
});
