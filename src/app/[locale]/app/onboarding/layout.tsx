'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const STEPS = [
  { label: 'Venue', segment: 'venue' },
  { label: 'Account', segment: 'user' },
  { label: 'Menu', segment: 'menu' },
  { label: 'Review', segment: 'menu-overview' },
] as const;

function getCurrentStep(pathname: string): number {
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  if (last === 'venue') return 0;
  if (last === 'user') return 1;
  if (last === 'menu' || last === 'languages' || last === 'waiting') return 2;
  if (last === 'menu-overview' || last === 'edit') return 3;
  return -1; // index page or unknown — hide progress
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = getCurrentStep(pathname);

  if (current < 0) return <>{children}</>;

  return (
    <>
      {/* Progress indicator */}
      <div className="w-full bg-card border-b border-black/5">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isCompleted = i < current;
              const isCurrent = i === current;
              return (
                <div key={step.segment} className="flex items-center flex-1 last:flex-none">
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-brand text-white'
                          : isCurrent
                            ? 'bg-brand/10 text-brand border-2 border-brand'
                            : 'bg-black/5 text-ink-05'
                      }`}
                    >
                      {isCompleted ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent ? 'text-brand' : isCompleted ? 'text-ink-08' : 'text-ink-05'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                        i < current ? 'bg-brand' : 'bg-black/10'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
