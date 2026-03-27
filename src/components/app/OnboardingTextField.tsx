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
    <div className="flex flex-col gap-1">
      {label && (
        <label className="flex items-center gap-0 text-sm font-medium text-white">
          {required && <span className="text-[#FF6064] mr-0.5">*</span>}
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
          className="w-full px-4 py-3.5 text-base rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white placeholder:text-white/40 focus:outline-none focus:border-[#A2A2A4]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFCFCF] hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errorMessage && (
        <span className="text-xs text-[#FF6064] mt-0.5">{errorMessage}</span>
      )}
    </div>
  );
}
