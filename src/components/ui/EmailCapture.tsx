"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface EmailCaptureProps {
  heading?: string;
  description?: string;
  buttonLabel?: string;
  source: string;
}

export default function EmailCapture({
  heading,
  description,
  buttonLabel = "Subscribe",
  source,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    trackEvent("email_capture", { source, email });
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="rounded-2xl bg-card border border-black/5 p-8 lg:p-10 shadow-sm">
      {heading && (
        <h3 className="text-xl font-bold text-ink-08 mb-2">{heading}</h3>
      )}
      {description && (
        <p className="text-sm text-ink-05 leading-relaxed mb-6">
          {description}
        </p>
      )}

      {submitted ? (
        <p className="text-sm text-brand font-medium">
          Thanks! We&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@restaurant.com"
            className="flex-1 min-w-0 rounded-full bg-ink-07 border border-black/10 px-5 py-3 text-sm text-ink-08 placeholder:text-ink-05 focus:outline-none focus:border-brand/40 transition-colors"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
          >
            {buttonLabel}
          </button>
        </form>
      )}
    </div>
  );
}
