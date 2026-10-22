import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveServiceArea } from "@/components/live-pages";

export const Route = createFileRoute("/service-area/")({
  head: () => pageHead("service-area", "/service-area"),
  component: LiveServiceArea,
});
