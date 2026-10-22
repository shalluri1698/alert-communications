import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("contact", "/contact"),
  component: () => <ContentPage pageKey="contact" />,
});
