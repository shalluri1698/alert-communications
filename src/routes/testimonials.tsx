import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveTestimonials } from "@/components/live-pages";

export const Route = createFileRoute("/testimonials")({
  head: () => pageHead("testimonials", "/testimonials"),
  component: LiveTestimonials,
});
