'use client';

import { useId } from 'react';
import type { ReactNode, Ref } from 'react';

interface OnboardingSelectProps {
  ref?: Ref<HTMLSelectElement>;
  label?: string;
  required?: boolean;
  value: number | string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  children: ReactNode;
  name?: string;
}

export default function OnboardingSelect({
  ref,
  label,
  required,
  value,
  onChange,
  onBlur,
  error,
  children,
  name,
}: OnboardingSelectProps) {
  const id = useId();
  const errorId = useId();
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="flex items-center text-sm font-medium text-ink-08">
          <span>{label}</span>
          {required && <span className="text-ink-05 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={`w-full px-4 py-3 rounded-xl border bg-card text-ink-08 focus:outline-none focus:ring-2 transition-colors ${
          hasError
            ? 'border-brand focus:ring-brand/30 focus:border-brand'
            : 'border-black/10 focus:ring-brand/20 focus:border-brand'
        }`}
      >
        {children}
      </select>
      {hasError && (
        <span id={errorId} role="alert" className="text-xs text-brand mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
