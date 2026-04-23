'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getOnboardingStep, startDomainCreation, activateShop, loginUser } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import { useAuth } from '@/hooks/useAuth';

export default function ShopCreationWaitingPage() {
  const router = useRouter();
  const { setCredentials } = useAuth();
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const t = useTranslations('Onboarding.waiting');

  useEffect(() => {
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    const shop = JSON.parse(shopData);
    const storeType = String(shop?.storeType ?? shop?.store_type ?? '').toLowerCase();
    const isHype = storeType === 'hype';
    const intervalMs = isHype ? 5000 : 30000;

    async function init() {
      const currentStep = parseInt(localStorage.getItem('onboarding_current_step') || '0');
      if (currentStep === OnboardingStep.CreateDomain && shop.id && shop.name) {
        const subdomain = shop.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        try { await startDomainCreation(shop.id, subdomain); } catch { /* continue */ }
      }
      checkStatus();
      pollingRef.current = setInterval(checkStatus, intervalMs);
    }

    async function checkStatus() {
      try {
        const response = await getOnboardingStep();
        if (response && response.step >= OnboardingStep.ShopReadyToUse) {
          clearInterval(pollingRef.current);
          if (isHype) {
            await activateAndFinish(shop.id);
          } else {
            router.replace('../onboarding/menu');
          }
        }
      } catch (err: unknown) {
        if ((err as { status?: number }).status === 429) clearInterval(pollingRef.current);
      }
    }

    async function activateAndFinish(shopId: number) {
      try {
        await activateShop(shopId);
        const creds = localStorage.getItem('onboarding_user_credentials');
        if (creds) {
          const { email, password } = JSON.parse(creds);
          const loginRes = await loginUser(email, password);
          setCredentials(loginRes.shopId, loginRes.userId, loginRes.token);
          localStorage.removeItem('onboarding_user_credentials');
        }
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.Finished));
        router.replace('../../app/subscription');
      } catch (err) {
        console.error('Failed to activate shop:', err);
      }
    }

    init();
    return () => clearInterval(pollingRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-card rounded-2xl border border-black/5 shadow-sm p-8 sm:p-12 text-center max-w-md mx-4 relative overflow-hidden">
        {/* Brand glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,96,100,0.06) 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-brand/10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-brand border-t-transparent" />
          </div>
          <p className="text-2xl font-bold text-ink-08 mb-2">{t('title')}</p>
          <p className="text-ink-05">{t('pleaseWait')}</p>
        </div>
      </div>
    </div>
  );
}
