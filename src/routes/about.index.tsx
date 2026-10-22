import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveAbout } from "@/components/live-pages";

export const Route = createFileRoute("/about/")({
  head: () => pageHead("about", "/about"),
  component: LiveAbout,
});
