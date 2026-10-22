import { createFileRoute, redirect } from "@tanstack/react-router";

// The Downloads page was retired; its articles live on the Blog.
export const Route = createFileRoute("/downloads")({
  beforeLoad: () => { throw redirect({ to: "/blog/", statusCode: 301 }); },
});
