import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveClientSupport } from "@/components/live-pages";

export const Route = createFileRoute("/client-support")({
  head: () => pageHead("client-support", "/client-support"),
  component: LiveClientSupport,
});
