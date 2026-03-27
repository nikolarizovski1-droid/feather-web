import type { ReactNode } from 'react';

// Onboarding layout — Phase 3 will add step progress indicator and guards.

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-950">{children}</div>;
}
