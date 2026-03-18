"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function FeaturesSubNav() {
  const t = useTranslations("FeaturesSubNav");

  const navItems = [
    { label: t("instantAccess"), href: "#instant-access" },
    { label: t("banners"), href: "#banners" },
    { label: t("notifications"), href: "#notifications" },
    { label: t("events"), href: "#events" },
    { label: t("tvApp"), href: "#tv-app" },
    { label: t("service"), href: "#service" },
    { label: t("analytics"), href: "#analytics" },
  ];

  const sectionIds = navItems.map((item) => item.href.slice(1));

  const [activeId, setActiveId] = useState<string>("");
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const stickyObserver = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    stickyObserver.observe(sentinelEl);

    return () => stickyObserver.disconnect();
  }, []);

  useEffect(() => {
    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Sentinel element that tells us when the nav becomes sticky */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div
        className={`sticky top-16 z-40 hidden md:block transition-all duration-300 ${
          stuck
            ? "bg-ink-08/90 backdrop-blur-md border-b border-white/5 shadow-sm"
            : "bg-ink-08"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeId === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`shrink-0 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand/15 text-brand"
                      : "text-ink-05 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
