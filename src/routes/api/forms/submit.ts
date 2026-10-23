import { createFileRoute } from "@tanstack/react-router";
import { handleLeadSubmission } from "@/lib/submit-lead.server";

export const Route = createFileRoute("/api/forms/submit")({
  server: {
    handlers: {
      POST: ({ request }) => handleLeadSubmission(request),
    },
  },
});
