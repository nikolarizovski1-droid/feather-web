'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deviceLogin, getOnboardingStep } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import LoadingOverlay from '@/components/app/LoadingOverlay';

function getRouteForStep(step: OnboardingStep, storeType?: string): string {
  const domainSteps = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  if (domainSteps.includes(step)) {
    const isHype = String(storeType || '').toLowerCase() === 'hype';
    return isHype ? './onboarding/waiting' : './onboarding/menu';
  }
  const map: Record<number, string> = {
    [OnboardingStep.CreateVenue]: './onboarding/venue',
    [OnboardingStep.CreateUser]: './onboarding/user',
    [OnboardingStep.CreateMenu]: './onboarding/menu',
    [OnboardingStep.EditMenu]: './onboarding/menu-overview',
    [OnboardingStep.SetLanguages]: './onboarding/languages',
    [OnboardingStep.Finished]: './subscription',
  };
  return map[step] ?? './onboarding/venue';
}

export default function OnboardingFlowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const storedToken = localStorage.getItem('feather_access_token');
        if (!storedToken) {
          await deviceLogin();
        }
        setLoginError(false);

        const response = await getOnboardingStep();
        if (response) {
          const storeType = (response.shop as Record<string, unknown>)?.storeType ?? (response.shop as Record<string, unknown>)?.store_type;
          router.replace(getRouteForStep(response.step as OnboardingStep, storeType as string));
        } else {
          router.replace('./onboarding/venue');
        }
      } catch (err) {
        console.error('Onboarding init failed:', err);
        setLoginError(true);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading) return <LoadingOverlay message="Loading onboarding..." />;

  if (loginError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center max-w-md px-6">
          <p className="text-lg mb-4">Failed to connect. Please check your connection and try again.</p>
          <button
            onClick={() => { setLoading(true); setLoginError(false); window.location.reload(); }}
            className="px-6 py-3 rounded-lg bg-[#FF6064] text-white font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}
