"use client";

import { useEffect } from "react";

/**
 * Mounts a single shared IntersectionObserver that watches all
 * [data-reveal] elements on the page and adds the "revealed" class
 * when each one scrolls into view.
 *
 * Optional [data-reveal-delay="ms"] attribute staggers the transition.
 * Renders nothing — place once anywhere in the component tree.
 */
export default function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.revealDelay ?? "0", 10);
          if (delay > 0) {
            setTimeout(() => el.classList.add("revealed"), delay);
          } else {
            el.classList.add("revealed");
          }
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
