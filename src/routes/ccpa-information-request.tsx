import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveCCPA } from "@/components/live-pages";

export const Route = createFileRoute("/ccpa-information-request")({
  head: () => pageHead("ccpa-information-request", "/ccpa-information-request"),
  component: LiveCCPA,
});
