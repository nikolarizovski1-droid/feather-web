'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import ConfirmationModal from '@/components/app/ConfirmationModal';

function getCurrentStep(pathname: string): number {
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  if (last === 'venue') return 0;
  if (last === 'user') return 1;
  if (last === 'menu' || last === 'waiting') return 2;
  if (last === 'menu-overview' || last === 'edit' || last === 'languages') return 3;
  return -1; // index page or unknown — hide progress
}

function getStepSubLabelKey(pathname: string): string | null {
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  if (last === 'waiting') return 'settingUp';
  if (last === 'menu') return 'creatingMenu';
  if (last === 'languages') return 'setLanguages';
  if (last === 'edit') return 'editItem';
  return null;
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Onboarding');
  const [showExitModal, setShowExitModal] = useState(false);
  const current = getCurrentStep(pathname);
  const subLabelKey = getStepSubLabelKey(pathname);
  const STEPS = [
    { label: t('steps.venue'), segment: 'venue' },
    { label: t('steps.account'), segment: 'user' },
    { label: t('steps.menu'), segment: 'menu' },
    { label: t('steps.review'), segment: 'menu-overview' },
  ] as const;

  if (current < 0) return <>{children}</>;

  return (
    <>
      {/* Progress indicator */}
      <div className="w-full bg-card border-b border-black/5">
        <div className="max-w-2xl mx-auto px-5 pt-3 pb-4" aria-live="polite">
          <div className="flex justify-end mb-1">
            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="text-xs font-medium text-ink-05 hover:text-ink-08 transition-colors px-1 py-1"
            >
              {t('common.saveAndExit')}
            </button>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isCompleted = i < current;
              const isCurrent = i === current;
              return (
                <div key={step.segment} className="flex items-center flex-1 last:flex-none">
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-brand text-white'
                          : isCurrent
                            ? 'bg-brand/10 text-brand border-2 border-brand'
                            : 'bg-black/5 text-ink-05'
                      }`}
                    >
                      {isCompleted ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent ? 'text-brand' : isCompleted ? 'text-ink-08' : 'text-ink-05'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                        i < current ? 'bg-brand' : 'bg-black/10'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {subLabelKey ? (
            <p className="mt-3 text-center text-xs text-ink-06">{t(`subLabels.${subLabelKey}`)}</p>
          ) : current === 0 ? (
            <p className="mt-3 text-center text-xs text-ink-05">{t('common.takesAbout2Minutes')}</p>
          ) : null}
        </div>
      </div>
      {children}

      {showExitModal && (
        <ConfirmationModal
          title={t('common.exitModalTitle')}
          message={t('common.exitModalMessage')}
          confirmText={t('common.exit')}
          cancelText={t('common.keepGoing')}
          onConfirm={() => {
            setShowExitModal(false);
            router.push('/');
          }}
          onCancel={() => setShowExitModal(false)}
        />
      )}
    </>
  );
}
