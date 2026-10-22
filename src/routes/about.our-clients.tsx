import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveOurClients } from "@/components/live-pages";

export const Route = createFileRoute("/about/our-clients")({
  head: () => pageHead("about/our-clients", "/about/our-clients"),
  component: LiveOurClients,
});
