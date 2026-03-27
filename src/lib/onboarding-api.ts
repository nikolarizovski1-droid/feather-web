import { getDeviceId } from './device-id';
import type {
  OnboardingStepResponse,
  Country,
  Currency,
  CreateVenueRequest,
  CreateVenueResponse,
  CreateUserRequest,
  LoginResponse,
  CreateMenuResponse,
  MenuProductCategory,
  MenuProduct,
  AppConfig,
} from '@/types/onboarding';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const V2_BASE = API_BASE.replace('/v3', '/v2');

function getToken(): string {
  const token = localStorage.getItem('feather_access_token');
  if (!token) throw new Error('No access token available');
  return token;
}

async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message || err.error || `API error ${res.status}`), { status: res.status });
  }
  return res.json();
}

// --- Device Login ---

export async function deviceLogin(): Promise<string> {
  const deviceId = getDeviceId();
  const res = await fetch(`${V2_BASE}/device/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guid: deviceId, os_type: 3, is_extension: 0 }),
  });
  if (!res.ok) throw new Error('Device login failed');
  const data = await res.json();
  if (!data.token) throw new Error('No token returned');
  localStorage.setItem('feather_access_token', data.token);
  localStorage.setItem('device_registered', 'true');
  return data.token;
}

// --- Onboarding ---

export async function getOnboardingStep(): Promise<OnboardingStepResponse | null> {
  const deviceId = getDeviceId();
  try {
    const response = await authFetch<Record<string, unknown>>(`${API_BASE}/shop/onboardingStatus?device_id=${deviceId}`);
    if (response?.shop && typeof response.shop_onboarding_status_id !== 'undefined') {
      const mapped: OnboardingStepResponse = { step: response.shop_onboarding_status_id as number, shop: response.shop as OnboardingStepResponse['shop'] };
      localStorage.setItem('onboarding_current_step', String(mapped.step));
      localStorage.setItem('onboarding_shop_data', JSON.stringify(mapped.shop));
      return mapped;
    }
    return null;
  } catch (err: unknown) {
    if ((err as { status?: number }).status === 404) {
      localStorage.removeItem('onboarding_current_step');
      localStorage.removeItem('onboarding_shop_data');
      return null;
    }
    throw err;
  }
}

export async function getAppConfigOnboarding(): Promise<AppConfig> {
  return authFetch<AppConfig>(`${API_BASE}/config/app`);
}

// --- Venue ---

export async function getCountries(): Promise<Country[]> {
  const raw = await authFetch<Array<{ id: number; name: string; code: string; country_flag_value?: string; phone_prefix?: string; supported_shop_types?: number[] }>>(`${API_BASE}/countries/list`);
  return raw.map((c) => ({ id: c.id, name: c.name, code: c.code, countryFlag: c.country_flag_value, phonePrefix: c.phone_prefix, supportedShopTypes: c.supported_shop_types }));
}

export async function getCurrencies(): Promise<Currency[]> {
  return authFetch<Currency[]>(`${API_BASE}/currency/list`);
}

export async function createVenue(data: CreateVenueRequest): Promise<CreateVenueResponse> {
  return authFetch<CreateVenueResponse>(`${API_BASE}/shop/create`, { method: 'POST', body: JSON.stringify(data) });
}

export async function updateLanguages(shopId: number, languages: Array<{ id: number; is_default: boolean }>): Promise<void> {
  await authFetch(`${API_BASE}/shop/update-languages`, { method: 'POST', body: JSON.stringify({ shop_id: shopId, languages }) });
}

export async function startDomainCreation(shopId: number, subdomain: string): Promise<void> {
  await authFetch(`${API_BASE}/shop/startDomainCreationProcess`, { method: 'POST', body: JSON.stringify({ shop_id: shopId, subdomain }) });
}

export async function activateShop(shopId: number): Promise<void> {
  await authFetch(`${API_BASE}/shop/activate/${shopId}`, { method: 'POST', body: JSON.stringify({}) });
}

// --- User ---

export async function createUser(data: CreateUserRequest): Promise<unknown> {
  return authFetch(`${API_BASE}/user/create`, { method: 'POST', body: JSON.stringify(data) });
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const raw = await res.json();
  const token = raw.token;
  const shopId = raw.shop?.id;
  const userId = raw.user?.id;
  if (!token || shopId == null || userId == null) throw new Error('Login response missing data');
  return { token, shopId, userId };
}

// --- Menu ---

export async function createMenu(shopId: number, images: string[]): Promise<CreateMenuResponse> {
  return authFetch<CreateMenuResponse>(`${API_BASE}/menu/create`, {
    method: 'POST',
    body: JSON.stringify({ shop_id: shopId, menu_images: images, cached_response: false }),
  });
}

export async function getProcessedMenuResponse(shopId: number): Promise<unknown> {
  return authFetch(`${API_BASE}/menu/processed-response?shop_id=${shopId}`);
}

export async function batchCreateCategories(shopId: number, payload: { create: Array<{ name: string; description?: string }> }): Promise<MenuProductCategory[]> {
  const res = await authFetch<{ create: MenuProductCategory[] }>(`${API_BASE}/shops/${shopId}/products/categories/batch`, { method: 'POST', body: JSON.stringify(payload) });
  return res.create || [];
}

export async function batchCreateProducts(shopId: number, payload: { create: unknown[] }): Promise<MenuProduct[]> {
  const res = await authFetch<{ create: MenuProduct[] }>(`${API_BASE}/shops/${shopId}/products/batch`, { method: 'POST', body: JSON.stringify(payload) });
  return res.create || [];
}

export async function submitLanguages(shopId: number, languageIds: number[], defaultLanguageId: number): Promise<void> {
  await authFetch(`${API_BASE}/shops/${shopId}/languages`, {
    method: 'POST',
    body: JSON.stringify({ language_ids: languageIds, default_language_id: defaultLanguageId }),
  });
}
