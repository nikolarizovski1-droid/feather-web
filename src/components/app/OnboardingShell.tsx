'use client';

import type { ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface OnboardingShellProps {
  title: string;
  isSubmitting?: boolean;
  loadingMessage?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function OnboardingShell({
  title,
  isSubmitting = false,
  loadingMessage = 'Loading...',
  children,
  footer,
}: OnboardingShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {isSubmitting && <LoadingOverlay message={loadingMessage} />}
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-8 pb-32">
        {title && (
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-08 mb-6">
            {title}<span className="text-brand">.</span>
          </h1>
        )}
        <div className="bg-card rounded-2xl border border-black/5 shadow-sm p-6 sm:p-8">
          {children}
        </div>
      </div>
      {footer && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-black/5 p-4 z-20">
          <div className="max-w-2xl mx-auto">{footer}</div>
        </div>
      )}
    </div>
  );
}
