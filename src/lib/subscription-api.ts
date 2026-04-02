import type {
  AuthCredentials,
  SubscriptionStatus,
  SubscriptionIntentResponse,
  CancelSubscriptionResponse,
  CancelPendingChangeResponse,
  UpgradePreview,
  PaymentMethod,
  PaymentMethodsResponse,
  SetupIntentResponse,
  AppConfigResponse,
} from '@/types/subscription';
import type { PlansApiResponse } from '@/types/pricing';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

// --- Authenticated Fetch Wrapper ---

async function authFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Subscription API ---

export async function getPlans(
  credentials: AuthCredentials,
): Promise<PlansApiResponse> {
  const params = new URLSearchParams({ shop_id: String(credentials.shopId) });
  return authFetch<PlansApiResponse>(
    `/subscription/plans-with-prices?${params}`,
    credentials.token,
  );
}

export async function getSubscriptionStatus(
  credentials: AuthCredentials,
): Promise<SubscriptionStatus> {
  const params = new URLSearchParams({ shop_id: String(credentials.shopId) });
  return authFetch<SubscriptionStatus>(
    `/subscription/status?${params}`,
    credentials.token,
  );
}

export async function createPaymentIntent(
  credentials: AuthCredentials,
  planId: number,
): Promise<SubscriptionIntentResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any = await authFetch(
    '/paymentIntent/create',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        plan_id: planId,
        user_id: credentials.userId,
      }),
    },
  );

  // The API may return field names in camelCase or snake_case — normalize
  return {
    intent_type: raw.intent_type ?? raw.intentType ?? 'payment_intent',
    client_secret: raw.client_secret ?? raw.clientSecret ?? raw.payment_intent_client_secret ?? raw.setup_intent_client_secret ?? '',
    intent_id: raw.intent_id ?? raw.intentId ?? raw.payment_intent_id ?? raw.setup_intent_id ?? '',
    customer_id: raw.customer_id ?? raw.customerId,
    ephemeral_key_secret: raw.ephemeral_key_secret ?? raw.ephemeralKeySecret,
  };
}

export async function createSubscription(
  credentials: AuthCredentials,
  planId: number,
  options: {
    payment_intent_id?: string;
    setup_intent_id?: string;
    change_timing?: 'immediate' | 'end_of_period';
  } = {},
): Promise<unknown> {
  return authFetch(
    '/subscription/create',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        plan_id: planId,
        user_id: credentials.userId,
        change_timing: options.change_timing ?? 'immediate',
        ...(options.payment_intent_id && { payment_intent_id: options.payment_intent_id }),
        ...(options.setup_intent_id && { setup_intent_id: options.setup_intent_id }),
      }),
    },
  );
}

export async function updateSubscription(
  credentials: AuthCredentials,
  newPlanId: number,
  changeTiming: 'immediate' | 'end_of_period' = 'immediate',
): Promise<unknown> {
  return authFetch(
    '/subscription/update',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        new_plan_id: newPlanId,
        change_timing: changeTiming,
      }),
    },
  );
}

export async function previewUpgrade(
  credentials: AuthCredentials,
  newPlanId: number,
): Promise<UpgradePreview> {
  return authFetch<UpgradePreview>(
    '/subscription/preview-upgrade',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        new_plan_id: newPlanId,
      }),
    },
  );
}

export async function cancelSubscription(
  credentials: AuthCredentials,
  cancelImmediately: boolean = false,
): Promise<CancelSubscriptionResponse> {
  return authFetch<CancelSubscriptionResponse>(
    '/subscription/cancel',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        cancel_immediately: cancelImmediately,
      }),
    },
  );
}

export async function reactivateSubscription(
  credentials: AuthCredentials,
): Promise<unknown> {
  return authFetch(
    '/subscription/reactivate',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
      }),
    },
  );
}

export async function cancelPendingChange(
  credentials: AuthCredentials,
): Promise<CancelPendingChangeResponse> {
  return authFetch<CancelPendingChangeResponse>(
    '/subscription/cancel-pending-change',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
      }),
    },
  );
}

export async function getAppConfig(
  token: string,
): Promise<AppConfigResponse> {
  return authFetch<AppConfigResponse>('/config/app', token);
}

// --- Payment API ---

export async function getPaymentMethods(
  credentials: AuthCredentials,
): Promise<PaymentMethod[]> {
  const params = new URLSearchParams({
    shop_id: String(credentials.shopId),
    user_id: String(credentials.userId),
  });
  const response = await authFetch<PaymentMethodsResponse | PaymentMethod[]>(
    `/payment-methods?${params}`,
    credentials.token,
  );
  return Array.isArray(response) ? response : response.payment_methods || [];
}

export async function getDefaultPaymentMethod(
  credentials: AuthCredentials,
): Promise<PaymentMethod | null> {
  const methods = await getPaymentMethods(credentials);
  return methods.find((m) => m.is_default) || null;
}

export async function createSetupIntent(
  credentials: AuthCredentials,
): Promise<SetupIntentResponse> {
  return authFetch<SetupIntentResponse>(
    '/payment-methods/setup-intent',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        user_id: credentials.userId,
      }),
    },
  );
}

export async function attachPaymentMethod(
  credentials: AuthCredentials,
  setupIntentId: string,
): Promise<PaymentMethod> {
  return authFetch<PaymentMethod>(
    '/payment-methods',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        user_id: credentials.userId,
        setup_intent_id: setupIntentId,
      }),
    },
  );
}

export async function setDefaultPaymentMethod(
  credentials: AuthCredentials,
  paymentMethodId: string,
): Promise<unknown> {
  return authFetch(
    `/payment-methods/${paymentMethodId}/default`,
    credentials.token,
    {
      method: 'PUT',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        user_id: credentials.userId,
      }),
    },
  );
}

export async function deletePaymentMethod(
  credentials: AuthCredentials,
  paymentMethodId: string,
): Promise<unknown> {
  const params = new URLSearchParams({
    shop_id: String(credentials.shopId),
    user_id: String(credentials.userId),
  });
  return authFetch(
    `/payment-methods/${paymentMethodId}?${params}`,
    credentials.token,
    { method: 'DELETE' },
  );
}

export async function createEphemeralKey(
  credentials: AuthCredentials,
): Promise<string> {
  const response = await authFetch<{ ephemeral_key: string } | string>(
    '/payment-methods/ephemeral-key',
    credentials.token,
    {
      method: 'POST',
      body: JSON.stringify({
        shop_id: credentials.shopId,
        user_id: credentials.userId,
      }),
    },
  );
  return typeof response === 'string' ? response : response.ephemeral_key;
}
