'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface OnboardingButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export default function OnboardingButton({
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  children,
}: OnboardingButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={`w-full py-3.5 px-6 rounded-full text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-brand text-white hover:bg-[#e5474b]'
          : 'bg-transparent text-ink-08 border border-black/10 hover:bg-black/5'
      }`}
    >
      {loading && <Loader2 size={16} className="inline mr-2 animate-spin" />}
      {children}
    </button>
  );
}
