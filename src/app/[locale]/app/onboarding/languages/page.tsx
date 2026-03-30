'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitLanguages } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import type { Language } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';

const AVAILABLE_LANGUAGES: Language[] = [
  { id: 1, code: 'en', name: 'English' },
  { id: 2, code: 'mk', name: 'Macedonian' },
  { id: 3, code: 'sq', name: 'Albanian' },
];

const selectStyles = 'w-full px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { showError } = useNotifications();

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [defaultLangId, setDefaultLangId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLanguages = AVAILABLE_LANGUAGES.filter((l) => selected.has(l.id));
  const isValid = selected.size > 0 && defaultLangId !== '';

  function toggleLanguage(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); if (defaultLangId === id) setDefaultLangId(''); }
      else next.add(id);
      return next;
    });
  }

  async function onSubmit() {
    if (!isValid) { showError('Please select at least one language and a default.'); return; }
    setIsSubmitting(true);
    try {
      const shopData = localStorage.getItem('onboarding_shop_data');
      if (!shopData) throw new Error('Shop data not found');
      const shop = JSON.parse(shopData);
      await submitLanguages(shop.id, Array.from(selected), defaultLangId as number);
      localStorage.setItem('onboarding_current_step', String(OnboardingStep.CreateMenu));
      router.push('./menu');
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to save languages');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell title="Select Languages" isSubmitting={isSubmitting} loadingMessage="Saving languages..." footer={<OnboardingButton disabled={!isValid} loading={isSubmitting} onClick={onSubmit}>Continue</OnboardingButton>}>
      <p className="text-ink-05 mb-6">Select at least one language as default for your shop.</p>
      <div className="flex flex-col gap-3 mb-6">
        {AVAILABLE_LANGUAGES.map((lang) => (
          <label key={lang.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-black/5 cursor-pointer hover:border-brand/20 transition-colors">
            <input type="checkbox" checked={selected.has(lang.id)} onChange={() => toggleLanguage(lang.id)} className="w-5 h-5 rounded accent-brand" />
            <span className="text-ink-08">{lang.name}</span>
          </label>
        ))}
      </div>
      {selectedLanguages.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-08">Default Language</label>
          <select value={defaultLangId} onChange={(e) => setDefaultLangId(Number(e.target.value) || '')} className={selectStyles}>
            <option value="">Select default language</option>
            {selectedLanguages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      )}
    </OnboardingShell>
  );
}
