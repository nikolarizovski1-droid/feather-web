// ============================================
// SUBSCRIPTION & PAYMENT TYPES
// Migrated from Angular featherSubscriptionsWebApp
// ============================================

// Re-export plan types already defined in pricing.ts
export type { Plan, PlanPrice, PlanFeature, PlanDuration, PlanKey, PlansCountry, PlansApiResponse } from './pricing';

// --- Auth ---

export interface AuthCredentials {
  shopId: number;
  userId: number;
  token: string;
}

// --- Subscription Status ---

export interface SubscriptionPlanInfo {
  id: number;
  name: string;
  tier: number;
  planKey: string;
  duration: string;
  nameTranslations?: Record<string, string>;
}

export interface SubscriptionPriceInfo {
  amount: number;
  currency: string;
}

export interface SubscriptionInfo {
  id: number;
  plan: SubscriptionPlanInfo;
  status: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  price?: SubscriptionPriceInfo;
  pending_plan?: SubscriptionPlanInfo;
  pending_change_applied?: boolean;
  pending_change_scheduled_at?: string;
  cancel_at_period_end?: boolean;
}

export interface AccessibleFeature {
  name: string;
  enabled: boolean;
  grantedBy?: string;
}

export interface LastPaymentError {
  message: string;
  type?: string;
  code?: string;
}

export interface FailedInvoice {
  id: string;
  amountDue: number;
  currency: string;
  dueDate?: string;
  hostedInvoiceUrl?: string;
  lastPaymentError?: LastPaymentError;
}

export interface CanceledSubscription {
  id: number;
  planName: string;
  canceledAt?: string;
  endedAt?: string;
}

export interface SubscriptionStatus {
  active: boolean;
  trialing: boolean;
  trialDaysLeft?: number;
  can_get_trial: boolean;
  subscription?: SubscriptionInfo;
  accessibleFeatures?: AccessibleFeature[];
  hasFailedPayment?: boolean;
  failedInvoice?: FailedInvoice;
  canceledSubscription?: CanceledSubscription;
}

// --- Payment Methods ---

export interface PaymentMethodCard {
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: PaymentMethodCard;
  is_default: boolean;
  created?: string;
}

export interface PaymentMethodsResponse {
  payment_methods: PaymentMethod[];
}

export interface SetupIntentResponse {
  client_secret: string;
  setup_intent_id: string;
}

// --- API Request/Response Types ---

export type SubscriptionIntentType = 'payment_intent' | 'setup_intent' | 'none';

export interface SubscriptionIntentResponse {
  intent_type: SubscriptionIntentType;
  client_secret: string;
  intent_id: string;
  customer_id?: string;
  ephemeral_key_secret?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
}

export interface CancelPendingChangeResponse {
  success: boolean;
  message?: string;
}

export interface UpgradePreview {
  prorated_amount: number;
  currency: string;
  formatted_amount: string;
  full_plan_price: number;
  new_plan_id: number;
  new_plan_name: string;
}

export interface AppConfigResponse {
  trial_period_days?: number;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  statusCode?: number;
}

// --- Redirect ---

export type RedirectResult = 'success' | 'failure';

export interface RedirectParams {
  plan_id?: number;
  plan_name?: string;
  error?: string;
  error_code?: string;
}

// --- Notifications ---

export type NotificationType = 'error' | 'success' | 'info';

export interface NotificationMessage {
  id: number;
  type: NotificationType;
  text: string;
  hideTitle?: boolean;
}

// --- Helper Functions ---

export type SubscriptionStatusType =
  | 'active'
  | 'trialing'
  | 'trial'
  | 'past_due'
  | 'canceled'
  | 'cancelled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'canceling'
  | 'inactive';

export interface StatusDisplayInfo {
  text: string;
  className: string;
}

export function getStatusDisplayInfo(status: SubscriptionStatus): StatusDisplayInfo {
  if (status.subscription) {
    const sub = status.subscription;

    if (sub.cancel_at_period_end && sub.status.toLowerCase() === 'active') {
      return { text: 'Canceling', className: 'canceling' };
    }

    switch (sub.status.toLowerCase()) {
      case 'active':
        return { text: 'Active', className: 'active' };
      case 'trialing':
      case 'trial':
        return { text: 'Trial', className: 'trial' };
      case 'past_due':
        return { text: 'Past Due', className: 'past-due' };
      case 'canceled':
      case 'cancelled':
        return { text: 'Canceled', className: 'canceled' };
      case 'unpaid':
        return { text: 'Unpaid', className: 'unpaid' };
      case 'incomplete':
      case 'incomplete_expired':
        return { text: 'Incomplete', className: 'incomplete' };
    }
  }

  if (status.trialing) {
    return { text: 'Trial', className: 'trial' };
  } else if (status.active) {
    return { text: 'Active', className: 'active' };
  }
  return { text: 'Inactive', className: 'canceled' };
}

export function getPlanInfoTranslatedName(
  planInfo: SubscriptionPlanInfo,
  languageCode: string = 'en',
): string {
  return planInfo.nameTranslations?.[languageCode] || planInfo.name;
}

export function formatCardDisplay(card: PaymentMethodCard): string {
  return `•••• ${card.last4 || '****'}`;
}

export function formatCardExpiry(card: PaymentMethodCard): string {
  if (card.exp_month && card.exp_year) {
    const month = String(card.exp_month).padStart(2, '0');
    const year = String(card.exp_year).slice(-2);
    return `${month}/${year}`;
  }
  return '';
}

// --- Plan Translation Helpers ---

function fromTranslationObject(
  obj: Record<string, string> | undefined,
  fallback: string | undefined,
  languageCode: string = 'en',
): string | undefined {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const value = obj[languageCode] ?? obj['en'];
    if (typeof value === 'string') return value;
  }
  return typeof fallback === 'string' ? fallback : undefined;
}

export function getPlanTranslatedName(
  plan: { name: string; name_translations?: Record<string, string>; translations?: Array<{ languageCode: string; name: string }> },
  languageCode: string = 'en',
): string {
  const fromObj = fromTranslationObject(plan.name_translations, plan.name, languageCode);
  if (fromObj) return fromObj;
  const translation = plan.translations?.find((t) => t.languageCode === languageCode);
  return translation?.name || plan.name || '';
}

export function getPlanTranslatedDescription(
  plan: { description?: string; description_translations?: Record<string, string>; translations?: Array<{ languageCode: string; description?: string }> },
  languageCode: string = 'en',
): string | undefined {
  const fromObj = fromTranslationObject(plan.description_translations, plan.description, languageCode);
  if (fromObj) return fromObj;
  const translation = plan.translations?.find((t) => t.languageCode === languageCode);
  return translation?.description ?? plan.description;
}

export interface SubscriptionPlanFeature {
  name: string;
  title?: string;
  description?: string;
  title_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  translations?: Array<{ languageCode: string; title: string; description?: string }>;
}

export function getFeatureTranslatedTitle(
  feature: SubscriptionPlanFeature,
  languageCode: string = 'en',
): string {
  const fromObj = fromTranslationObject(feature.title_translations, feature.title ?? feature.name, languageCode);
  if (fromObj) return fromObj;
  const translation = feature.translations?.find((t) => t.languageCode === languageCode);
  const title = translation?.title ?? feature.title ?? feature.name;
  return typeof title === 'string' ? title : (feature.name ?? '');
}

export function getFeatureTranslatedDescription(
  feature: SubscriptionPlanFeature,
  languageCode: string = 'en',
): string | undefined {
  const fromObj = fromTranslationObject(feature.description_translations, feature.description, languageCode);
  if (fromObj) return fromObj;
  const translation = feature.translations?.find((t) => t.languageCode === languageCode);
  return translation?.description ?? (typeof feature.description === 'string' ? feature.description : undefined);
}
