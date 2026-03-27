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
      className={`w-full py-4 px-6 rounded-2xl text-base font-semibold transition-colors disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-[#FF6064] text-white hover:bg-[#e5565a]'
          : 'bg-[#313131] text-white hover:bg-[#3D3D3D]'
      }`}
    >
      {loading && <Loader2 size={16} className="inline mr-2 animate-spin" />}
      {children}
    </button>
  );
}
