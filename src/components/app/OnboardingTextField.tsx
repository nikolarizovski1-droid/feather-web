'use client';

import { useId, useState } from 'react';
import type { Ref } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';

interface OnboardingTextFieldProps {
  ref?: Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  name?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'url' | 'search';
  autoCapitalize?: boolean;
}

export default function OnboardingTextField({
  ref,
  label,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  onBlur,
  error,
  name,
  autoComplete,
  inputMode,
  autoCapitalize = false,
}: OnboardingTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const inputId = useId();
  const errorId = useId();
  const hasError = Boolean(error);
  const tc = useTranslations('Onboarding.common');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="flex items-center gap-0 text-sm font-medium text-ink-08">
          <span>{label}</span>
          {required && <span className="text-ink-05 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            let v = e.target.value;
            if (autoCapitalize && v.length > 0) {
              v = v.charAt(0).toUpperCase() + v.slice(1);
            }
            onChange(v);
          }}
          className={`w-full px-4 py-3 text-base rounded-xl border bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-brand focus:ring-brand/30 focus:border-brand'
              : 'border-black/10 focus:ring-brand/20 focus:border-brand'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? tc('hidePassword') : tc('showPassword')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-05 hover:text-ink-08"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hasError && (
        <span id={errorId} role="alert" className="text-xs text-brand mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
