import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { sendLead } from "./send-lead";

export function useLeadForm(form: string) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      await sendLead(event.currentTarget, form);
      setSent(true);
    } catch {
      setError("Your request could not be sent. Please try again or contact us by phone.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return { sent, pending, error, onSubmit };
}
