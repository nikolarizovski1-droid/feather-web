"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { events } from "@/lib/analytics";

export default function MobileCTABar() {
  const t = useTranslations("MobileCTABar");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.8;

    function onScroll() {
      setVisible(window.scrollY > threshold);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 border-t border-white/10"
        style={{ background: "rgba(10,10,12,0.92)", backdropFilter: "blur(16px)" }}
      >
        <p className="text-xs text-white/45 leading-snug flex-1">{t("text")}</p>
        <Link
          href="/signup"
          onClick={() => events.ctaClick("mobile_sticky_bar", "start_trial")}
          className="shrink-0 inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-full bg-brand text-white hover:bg-[#e5474b] transition-colors duration-200"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
