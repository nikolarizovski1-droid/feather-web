'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const POLL_INTERVAL = 30000;
const SHOP_READY_STEP = 18;

export default function SubscriptionWaitingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const deviceId = typeof window !== 'undefined' ? localStorage.getItem('feather_device_id') : null;
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('feather_access_token') : null;

  useEffect(() => {
    if (!deviceId) {
      router.replace('../subscription');
      return;
    }

    async function checkStatus() {
      try {
        const params = new URLSearchParams({ device_id: deviceId! });
        const res = await fetch(`${API_BASE}/shop/onboardingStatus?${params}`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });

        if (res.status === 429) {
          clearInterval(pollingRef.current);
          return;
        }

        if (res.status === 404 || !res.ok) {
          clearInterval(pollingRef.current);
          router.replace('../subscription');
          return;
        }

        const data = await res.json();
        if (data?.step !== undefined) {
          setCurrentStep(data.step);
          if (data.step >= SHOP_READY_STEP) {
            clearInterval(pollingRef.current);
            router.replace('../subscription');
          }
        } else {
          clearInterval(pollingRef.current);
          router.replace('../subscription');
        }
      } catch {
        console.error('Failed to check onboarding status');
      }
    }

    checkStatus();
    pollingRef.current = setInterval(checkStatus, POLL_INTERVAL);

    return () => clearInterval(pollingRef.current);
  }, [deviceId, accessToken, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-card rounded-2xl border border-black/5 shadow-sm p-8 sm:p-12 text-center max-w-md mx-4 relative overflow-hidden">
        {/* Brand glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,96,100,0.06) 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-brand/10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-brand border-t-transparent" />
          </div>
          <p className="text-2xl font-bold text-ink-08 mb-2">Setting up your shop...</p>
          {currentStep !== null && currentStep < SHOP_READY_STEP && (
            <div className="mb-5">
              <p className="text-base text-ink-05 mb-3">Step {currentStep} of {SHOP_READY_STEP}</p>
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${(currentStep / SHOP_READY_STEP) * 100}%` }} />
              </div>
            </div>
          )}
          <p className="text-sm text-ink-05 italic">
            This usually takes a few minutes. Feel free to grab a coffee!
          </p>
        </div>
      </div>
    </div>
  );
}
