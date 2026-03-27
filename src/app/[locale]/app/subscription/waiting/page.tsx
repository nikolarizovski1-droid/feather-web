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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center px-10 max-w-md">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-8" />
        <p className="text-2xl font-semibold text-white mb-2">Setting up your shop...</p>
        {currentStep !== null && currentStep < SHOP_READY_STEP && (
          <p className="text-base text-white/80 mb-5">Step {currentStep} of {SHOP_READY_STEP}</p>
        )}
        <p className="text-sm text-white/70 italic">
          This usually takes a few minutes. Feel free to grab a coffee!
        </p>
      </div>
    </div>
  );
}
