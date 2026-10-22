import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/integrations")({
  head: () => pageHead("integrations", "/integrations"),
  component: () => <ContentPage pageKey="integrations" />,
});
