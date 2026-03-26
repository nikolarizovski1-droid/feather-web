"use client";

import { events } from "@/lib/analytics";

interface TrackedDetailsProps {
  question: string;
  children: React.ReactNode;
  className?: string;
}

export default function TrackedDetails({
  question,
  children,
  className,
}: TrackedDetailsProps) {
  return (
    <details
      className={className}
      onToggle={(e) => {
        if ((e.target as HTMLDetailsElement).open) {
          events.faqExpand(question);
        }
      }}
    >
      {children}
    </details>
  );
}
