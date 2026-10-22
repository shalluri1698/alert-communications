import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LivePartnerships } from "@/components/live-pages";

export const Route = createFileRoute("/partnerships")({
  head: () => pageHead("partnerships", "/partnerships"),
  component: LivePartnerships,
});
