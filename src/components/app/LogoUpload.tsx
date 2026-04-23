'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Loader2, X } from 'lucide-react';
import { compressImage, fileToDataURL } from '@/lib/image-compression';

interface LogoUploadProps {
  /** Data URL for display (e.g. "data:image/png;base64,..."). Strip the prefix when sending. */
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export default function LogoUpload({ value, onChange, disabled }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const t = useTranslations('Onboarding.venue.logo');

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      const dataUrl = await fileToDataURL(compressed);
      onChange(dataUrl);
    } finally {
      setIsCompressing(false);
    }
  }

  const isDisabled = disabled || isCompressing;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
          disabled={isDisabled}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isDisabled}
          aria-label={t('upload')}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-colors ${
            value
              ? 'border-2 border-black/10 hover:border-black/20'
              : 'border-2 border-dashed border-black/20 hover:border-brand hover:bg-brand/5'
          } ${isDisabled ? 'opacity-60 pointer-events-none' : ''}`}
        >
          {isCompressing ? (
            <Loader2 size={22} className="animate-spin text-ink-05" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-ink-05">
              <Camera size={20} />
              <span className="text-[11px] font-medium">{t('upload')}</span>
            </div>
          )}
        </button>
        {value && !isCompressing && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={t('remove')}
            className="absolute -top-1 -right-1 bg-card border border-black/10 rounded-full p-1 text-ink-05 hover:text-brand shadow-sm"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <p className="text-xs text-ink-05">{t('hint')}</p>
    </div>
  );
}
