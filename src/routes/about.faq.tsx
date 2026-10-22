import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveFaq } from "@/components/live-pages";

export const Route = createFileRoute("/about/faq")({
  head: () => pageHead("about/faq", "/about/faq"),
  component: LiveFaq,
});
