"use client";

import Link from "next/link";
import { events } from "@/lib/analytics";

interface TrackedCTALinkProps {
  href: string;
  className: string;
  location: string;
  children: React.ReactNode;
}

export default function TrackedCTALink({
  href,
  className,
  location,
  children,
}: TrackedCTALinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => events.ctaClick(location, typeof children === "string" ? children : "cta")}
    >
      {children}
    </Link>
  );
}
