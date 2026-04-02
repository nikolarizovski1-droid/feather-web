import type { RedirectResult, RedirectParams } from '@/types/subscription';

const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? '';
const REDIRECT_DELAY = Number(process.env.NEXT_PUBLIC_REDIRECT_DELAY_SECONDS ?? 5);

export function buildRedirectUrl(result: RedirectResult, params?: RedirectParams): string {
  const baseUrl = `${APP_SCHEME}://subscription/${result}`;
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

export function redirectToApp(result: RedirectResult, params?: RedirectParams): void {
  const url = buildRedirectUrl(result, params);
  window.location.href = url;
}

export function redirectOnSuccess(planId: number, planName?: string): void {
  redirectToApp('success', { plan_id: planId, plan_name: planName });
}

export function redirectOnFailure(error: string, errorCode?: string): void {
  redirectToApp('failure', { error, error_code: errorCode });
}

export function getRedirectDelay(): number {
  return REDIRECT_DELAY;
}
