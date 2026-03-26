"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackPageViewProps {
  event: string;
  params?: Record<string, string>;
}

export default function TrackPageView({ event, params }: TrackPageViewProps) {
  useEffect(() => {
    trackEvent(event, params);
  }, [event, params]);

  return null;
}
