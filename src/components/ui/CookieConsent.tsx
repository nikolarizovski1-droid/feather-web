"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "feather_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setShow(true);
    if (consent === "accepted") enableGTM();
  }, []);

  function enableGTM() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_granted" });
  }

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    enableGTM();
    setShow(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 lg:p-6">
      <div
        className="mx-auto max-w-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-white/10 bg-ink-08/95 px-6 py-4"
        style={{ backdropFilter: "blur(16px)" }}
      >
        <p className="text-sm text-white/70 flex-1 leading-relaxed">
          We use cookies to understand how visitors interact with our site.
          No personal data is shared with third parties.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-brand text-white hover:bg-[#e5474b] transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
