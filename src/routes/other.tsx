import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/other")({
  head: () => pageHead("other", "/other"),
  component: () => <ContentPage pageKey="other" />,
});
