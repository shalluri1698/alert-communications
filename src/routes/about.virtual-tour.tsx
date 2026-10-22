import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { LiveVirtualTour } from "@/components/live-pages";

export const Route = createFileRoute("/about/virtual-tour")({
  head: () => pageHead("about/virtual-tour", "/about/virtual-tour"),
  component: LiveVirtualTour,
});
