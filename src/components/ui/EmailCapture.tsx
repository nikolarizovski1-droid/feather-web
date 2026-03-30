"use client";

import { useState } from "react";
import { events } from "@/lib/analytics";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      events.emailCapture(source);
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              disabled={loading}
              className="flex-1 min-w-0 rounded-full bg-ink-07 border border-black/10 px-5 py-3 text-sm text-ink-08 placeholder:text-ink-05 focus:outline-none focus:border-brand/40 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : buttonLabel}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
