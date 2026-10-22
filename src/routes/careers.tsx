import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveCareers } from "@/components/live-pages";

export const Route = createFileRoute("/careers")({
  head: () => pageHead("careers", "/careers"),
  component: LiveCareers,
});
