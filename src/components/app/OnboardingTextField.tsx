'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OnboardingTextFieldProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  autoCapitalize?: boolean;
}

export default function OnboardingTextField({
  label,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  errorMessage,
  autoCapitalize = false,
}: OnboardingTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center gap-0 text-sm font-medium text-ink-08">
          {required && <span className="text-brand mr-0.5">*</span>}
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            let v = e.target.value;
            if (autoCapitalize && v.length > 0) {
              v = v.charAt(0).toUpperCase() + v.slice(1);
            }
            onChange(v);
          }}
          className="w-full px-4 py-3 text-base rounded-xl border border-black/10 bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-05 hover:text-ink-08"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errorMessage && (
        <span className="text-xs text-brand mt-0.5">{errorMessage}</span>
      )}
    </div>
  );
}
