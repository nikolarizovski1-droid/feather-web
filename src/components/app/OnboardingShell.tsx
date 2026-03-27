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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {isSubmitting && <LoadingOverlay message={loadingMessage} />}
      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 pb-32">
        <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
        {children}
      </div>
      {footer && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/90 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-lg mx-auto">{footer}</div>
        </div>
      )}
    </div>
  );
}
