import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/law-firms")({
  head: () => pageHead("law-firms", "/law-firms"),
  component: () => <ContentPage pageKey="law-firms" />,
});
