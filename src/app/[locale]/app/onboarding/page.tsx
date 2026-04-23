'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deviceLogin, getOnboardingStep } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import LoadingOverlay from '@/components/app/LoadingOverlay';

function getRouteForStep(basePath: string, step: OnboardingStep, storeType?: string): string {
  const domainSteps = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  if (domainSteps.includes(step)) {
    const isHype = String(storeType || '').toLowerCase() === 'hype';
    return isHype ? `${basePath}/waiting` : `${basePath}/menu`;
  }
  const map: Record<number, string> = {
    [OnboardingStep.CreateVenue]: `${basePath}/venue`,
    [OnboardingStep.CreateUser]: `${basePath}/user`,
    [OnboardingStep.CreateMenu]: `${basePath}/menu`,
    [OnboardingStep.EditMenu]: `${basePath}/menu-overview`,
    [OnboardingStep.SetLanguages]: `${basePath}/languages`,
    [OnboardingStep.Finished]: basePath.replace(/\/onboarding$/, '/subscription'),
  };
  return map[step] ?? `${basePath}/venue`;
}

export default function OnboardingFlowPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Onboarding.common');
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);

  // pathname is e.g. "/en/app/onboarding" — use it as the base for child routes
  const basePath = pathname.replace(/\/$/, '');

  useEffect(() => {
    async function init() {
      try {
        const plan = searchParams.get('plan');
        if (plan) {
          localStorage.setItem('onboarding_plan', plan);
        }

        const storedToken = localStorage.getItem('feather_access_token');
        if (!storedToken) {
          await deviceLogin();
        }
        setLoginError(false);

        const response = await getOnboardingStep();
        if (response) {
          const storeType = (response.shop as Record<string, unknown>)?.storeType ?? (response.shop as Record<string, unknown>)?.store_type;
          router.replace(getRouteForStep(basePath, response.step as OnboardingStep, storeType as string));
        } else {
          router.replace(`${basePath}/venue`);
        }
      } catch (err) {
        console.error('Onboarding init failed:', err);
        setLoginError(true);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, basePath]);

  if (loading) return <LoadingOverlay message={t('loadingOnboarding')} />;

  if (loginError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-6">
          <p className="text-lg text-ink-08 mb-4">{t('failedToConnect')}</p>
          <button
            onClick={() => { setLoading(true); setLoginError(false); window.location.reload(); }}
            className="px-6 py-3 rounded-full bg-brand text-white font-semibold hover:bg-[#e5474b] transition-all duration-200 active:scale-[0.98]"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
