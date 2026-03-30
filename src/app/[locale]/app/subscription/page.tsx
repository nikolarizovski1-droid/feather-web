'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import {
  getPlans,
  getSubscriptionStatus,
  getDefaultPaymentMethod,
  getAppConfig,
  createPaymentIntent,
  createSubscription,
  updateSubscription,
  previewUpgrade,
  cancelSubscription,
  reactivateSubscription,
  cancelPendingChange,
} from '@/lib/subscription-api';
import { redirectOnSuccess, redirectOnFailure } from '@/lib/redirect';
import { getPlanTranslatedName } from '@/types/subscription';
import type {
  SubscriptionStatus,
  SubscriptionIntentType,
  PaymentMethod,
} from '@/types/subscription';
import type { Plan, PlansCountry } from '@/types/pricing';

import CurrentPlanCard from '@/components/app/CurrentPlanCard';
import PlanCard from '@/components/app/PlanCard';
import DurationPicker from '@/components/app/DurationPicker';
import PaymentMethods from '@/components/app/PaymentMethods';
import StripePaymentModal from '@/components/app/StripePaymentModal';
import ResultView from '@/components/app/ResultView';
import ConfirmationModal from '@/components/app/ConfirmationModal';
import LoadingOverlay from '@/components/app/LoadingOverlay';

// --- Duration helpers ---

function parseDuration(duration: string): number {
  if (duration.endsWith('m')) return parseInt(duration.slice(0, -1), 10) || 0;
  if (duration.endsWith('y')) return (parseInt(duration.slice(0, -1), 10) || 0) * 12;
  return 0;
}

function getDurationDisplayName(duration: string): string {
  const months = parseDuration(duration);
  if (months === 1) return 'Monthly';
  if (months === 12) return 'Yearly';
  return `${months} months`;
}

function formatDurationText(duration: string): string {
  if (duration.endsWith('m')) {
    const months = parseInt(duration.slice(0, -1), 10) || 1;
    return months === 1 ? 'month' : `${months} months`;
  }
  if (duration.endsWith('y')) {
    const years = parseInt(duration.slice(0, -1), 10) || 1;
    return years === 1 ? 'year' : `${years} years`;
  }
  return duration;
}

// --- Error mapping ---

function mapErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    card_declined: 'Your card was declined. Please try a different payment method.',
    insufficient_funds: 'Insufficient funds. Please try a different card.',
    expired_card: 'Your card has expired. Please update your payment method.',
    processing_error: 'Payment processing error. Please try again.',
    network_error: 'Network error. Please check your connection and try again.',
    no_subscription: 'No active subscription found.',
    invalid_plan: 'Invalid subscription plan selected.',
  };
  for (const [key, message] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key)) return message;
  }
  return error || 'An error occurred. Please try again or contact support.';
}

export default function SubscriptionPage() {
  const { credentials, isAuthenticated, isInitialized, error: authError } = useAuth();
  const { showError, showSuccess } = useNotifications();

  // Data
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [country, setCountry] = useState<PlansCountry | null>(null);
  const [currency, setCurrency] = useState('');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod | null>(null);
  const [trialPeriodDays, setTrialPeriodDays] = useState<number | null>(null);

  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('');

  // Payment flow
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [currentIntentType, setCurrentIntentType] = useState<SubscriptionIntentType>('payment_intent');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentAmountLabel, setPaymentAmountLabel] = useState<string | null>(null);
  const [isCompletingSubscription, setIsCompletingSubscription] = useState(false);

  // Confirmation modals
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showChangeTimingAlert, setShowChangeTimingAlert] = useState(false);
  const [showDowngradeConfirmation, setShowDowngradeConfirmation] = useState(false);
  const [showCancelPendingChangeConfirmation, setShowCancelPendingChangeConfirmation] = useState(false);
  const [changeTiming, setChangeTiming] = useState<'immediate' | 'end_of_period'>('immediate');

  // Action state
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  // Result view
  const [showResultView, setShowResultView] = useState(false);
  const [resultType, setResultType] = useState<'success' | 'error'>('success');
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  // --- Computed ---

  const isSubscribed = subscriptionStatus?.active ?? false;

  const currentSubscriptionTier = subscriptionStatus?.subscription?.plan.tier ?? null;

  const currentSubscriptionDurationMonths = useMemo(() => {
    const duration = subscriptionStatus?.subscription?.plan.duration;
    return duration ? parseDuration(duration) : null;
  }, [subscriptionStatus]);

  const groupedPlansByDuration = useMemo(() => {
    const grouped: Record<string, Plan[]> = {};
    plans.forEach((plan) => {
      if (!grouped[plan.duration]) grouped[plan.duration] = [];
      grouped[plan.duration].push(plan);
    });
    return grouped;
  }, [plans]);

  const sortedDurations = useMemo(
    () => Object.keys(groupedPlansByDuration).sort((a, b) => parseDuration(a) - parseDuration(b)),
    [groupedPlansByDuration],
  );

  const filteredPlans = useMemo(() => {
    const durationPlans = groupedPlansByDuration[selectedDuration] || [];
    return [...durationPlans].sort((a, b) => a.price.amount - b.price.amount);
  }, [groupedPlansByDuration, selectedDuration]);

  // --- Plan helpers ---

  const isPlanPurchased = (plan: Plan) => subscriptionStatus?.subscription?.plan.id === plan.id;

  const isUpgrade = (plan: Plan) => {
    if (currentSubscriptionTier === null) return false;
    if (plan.plan_tier > currentSubscriptionTier) return true;
    if (plan.plan_tier === currentSubscriptionTier && currentSubscriptionDurationMonths !== null) {
      return parseDuration(plan.duration) > currentSubscriptionDurationMonths;
    }
    return false;
  };

  const isDowngrade = (plan: Plan) => {
    if (currentSubscriptionTier === null) return false;
    if (plan.plan_tier < currentSubscriptionTier) return true;
    if (plan.plan_tier === currentSubscriptionTier && currentSubscriptionDurationMonths !== null) {
      return parseDuration(plan.duration) < currentSubscriptionDurationMonths;
    }
    return false;
  };

  const canPurchasePlan = (plan: Plan) => {
    if (isPlanPurchased(plan)) {
      const sub = subscriptionStatus?.subscription;
      if (sub?.pending_plan && !sub.pending_change_applied) return true;
      return false;
    }
    return true;
  };

  const isPendingPlan = (plan: Plan) => {
    const sub = subscriptionStatus?.subscription;
    return sub?.pending_plan?.id === plan.id && sub?.pending_change_applied === false;
  };

  const calculateSavings = (plan: Plan): { amount: number; formatted: string } | null => {
    if (plan.duration === '1m') return null;
    const planMonths = parseDuration(plan.duration);
    if (planMonths <= 0) return null;

    const tierPlans = plans.filter((p) => p.plan_tier === plan.plan_tier);
    let referencePlan = tierPlans.find((p) => p.duration === '1m') ?? null;

    if (!referencePlan) {
      const shorter = tierPlans.filter((p) => parseDuration(p.duration) < planMonths && parseDuration(p.duration) > 0);
      if (shorter.length === 0) return null;
      referencePlan = shorter.reduce((s, p) => (parseDuration(p.duration) < parseDuration(s.duration) ? p : s));
    }
    if (!referencePlan) return null;

    const refMonths = parseDuration(referencePlan.duration);
    if (refMonths <= 0) return null;

    const equivalentCost = Math.round((referencePlan.price.amount / refMonths) * planMonths);
    const savingsAmount = equivalentCost - plan.price.amount;
    if (savingsAmount <= 0) return null;

    const savingsVal = savingsAmount / 100;
    const formatted = savingsVal % 1 === 0 ? savingsVal.toFixed(0) : savingsVal.toFixed(2);
    const curr = referencePlan.price.currency;

    if (planMonths === 12) return { amount: savingsAmount, formatted: `Save ${formatted} ${curr}/year` };
    if (planMonths > 12) {
      const perYear = savingsVal / (planMonths / 12);
      const fmtYear = perYear % 1 === 0 ? perYear.toFixed(0) : perYear.toFixed(2);
      return { amount: savingsAmount, formatted: `Save ${fmtYear} ${curr} per year` };
    }
    return { amount: savingsAmount, formatted: `Save ${formatted} ${curr}` };
  };

  // --- Data loading ---

  const loadPaymentMethod = useCallback(async () => {
    if (!credentials) return;
    try {
      const method = await getDefaultPaymentMethod(credentials);
      setDefaultPaymentMethod(method);
    } catch (err) {
      console.error('Failed to load payment method:', err);
    }
  }, [credentials]);

  const loadStatus = useCallback(async () => {
    if (!credentials) return;
    try {
      const status = await getSubscriptionStatus(credentials);
      setSubscriptionStatus(status);
      loadPaymentMethod();
    } catch (err) {
      console.error('Failed to load subscription status:', err);
    }
  }, [credentials, loadPaymentMethod]);

  useEffect(() => {
    if (!isAuthenticated || !credentials) return;

    async function loadAll() {
      setIsLoading(true);
      try {
        const [plansRes, status, config] = await Promise.all([
          getPlans(credentials!),
          getSubscriptionStatus(credentials!),
          getAppConfig(credentials!.token).catch(() => null),
        ]);

        setPlans(plansRes.plans);
        setCountry(plansRes.country);
        setCurrency(plansRes.currency);
        setSubscriptionStatus(status);
        setTrialPeriodDays(config?.trial_period_days ?? null);

        // Set initial duration to longest
        const durations = Object.keys(
          plansRes.plans.reduce((g: Record<string, boolean>, p) => { g[p.duration] = true; return g; }, {}),
        ).sort((a, b) => parseDuration(a) - parseDuration(b));
        if (durations.length > 0) setSelectedDuration(durations[durations.length - 1]);

        loadPaymentMethod();
      } catch (err) {
        console.error('Failed to load data:', err);
        showError('Failed to load subscription plans');
      } finally {
        setIsLoading(false);
      }
    }

    loadAll();
  }, [isAuthenticated, credentials]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Clear payment state ---

  const clearPaymentState = () => {
    setCurrentPlanId(null);
    setCurrentIntentType('payment_intent');
    setPaymentIntentId(null);
    setSetupIntentId(null);
    setClientSecret('');
    setPaymentAmountLabel(null);
  };

  // --- Purchase flow ---

  const initiatePayment = async (plan: Plan) => {
    if (!credentials) return;
    setIsLoading(true);
    setCurrentPlanId(plan.id);

    try {
      const isImmediateUpgrade = isSubscribed && changeTiming === 'immediate';

      if (isImmediateUpgrade) {
        const preview = await previewUpgrade(credentials, plan.id);
        setPaymentAmountLabel(preview.formatted_amount ?? null);
      } else {
        setPaymentAmountLabel(plan.price?.formatted ?? null);
      }

      const response = await createPaymentIntent(credentials, plan.id);
      const intentType = response.intent_type ?? 'payment_intent';

      // If no payment is required (e.g. free trial), skip payment modal
      // and create subscription directly
      if (intentType === 'none' || !response.client_secret) {
        setIsLoading(false);
        setIsCompletingSubscription(true);
        try {
          await createSubscription(credentials, plan.id, {
            change_timing: isSubscribed && changeTiming === 'immediate' ? 'immediate' : changeTiming,
          });
          setIsCompletingSubscription(false);
          clearPaymentState();
          loadStatus();
          setResultType('success');
          setResultTitle('Subscription Activated!');
          setResultMessage('Your subscription has been successfully activated. Welcome to Feather!');
          setShowResultView(true);
        } catch (subErr: unknown) {
          setIsCompletingSubscription(false);
          setResultType('error');
          setResultTitle('Subscription Failed');
          setResultMessage(mapErrorMessage(subErr instanceof Error ? subErr.message : 'An error occurred'));
          setShowResultView(true);
        }
        return;
      }

      setCurrentIntentType(intentType);
      setClientSecret(response.client_secret);

      if (intentType === 'setup_intent') {
        setSetupIntentId(response.intent_id ?? null);
        setPaymentIntentId(null);
      } else {
        setPaymentIntentId(response.intent_id ?? null);
        setSetupIntentId(null);
      }

      setIsLoading(false);
      setShowPaymentModal(true);
    } catch (err: unknown) {
      setIsLoading(false);
      setPaymentAmountLabel(null);
      showError(err instanceof Error ? err.message : 'Failed to create payment intent');
    }
  };

  const purchasePlan = (plan: Plan) => {
    if (!canPurchasePlan(plan)) return;

    if (isPendingPlan(plan)) {
      setShowCancelPendingChangeConfirmation(true);
      return;
    }

    if (isSubscribed) {
      setCurrentPlanId(plan.id);
      if (isDowngrade(plan)) {
        setChangeTiming('end_of_period');
        setShowDowngradeConfirmation(true);
      } else {
        setShowChangeTimingAlert(true);
      }
      return;
    }

    initiatePayment(plan);
  };

  // --- Change timing ---

  const selectChangeTiming = async (timing: 'immediate' | 'end_of_period') => {
    setChangeTiming(timing);
    setShowChangeTimingAlert(false);

    const plan = plans.find((p) => p.id === currentPlanId);
    if (!plan || !credentials) {
      showError('Plan not found');
      return;
    }

    if (timing === 'immediate' && isUpgrade(plan)) {
      initiatePayment(plan);
    } else {
      updateSubscriptionPlan();
    }
  };

  // --- Subscription updates ---

  const updateSubscriptionPlan = async () => {
    if (!currentPlanId || !credentials) {
      showError('Missing plan information');
      return;
    }

    setIsCompletingSubscription(true);
    try {
      await updateSubscription(credentials, currentPlanId, changeTiming);
      setIsCompletingSubscription(false);
      clearPaymentState();
      loadStatus();
      showSuccess('Subscription updated successfully');
    } catch (err: unknown) {
      setIsCompletingSubscription(false);
      showError(err instanceof Error ? err.message : 'Failed to update subscription');
    }
  };

  // --- Payment completion ---

  const onPaymentSuccess = async () => {
    setShowPaymentModal(false);
    setIsCompletingSubscription(true);

    if (!currentPlanId || !credentials) {
      showError('Missing subscription information');
      setIsCompletingSubscription(false);
      return;
    }

    try {
      await createSubscription(credentials, currentPlanId, {
        payment_intent_id: paymentIntentId || undefined,
        setup_intent_id: setupIntentId || undefined,
        change_timing: isSubscribed && changeTiming === 'immediate' ? 'immediate' : changeTiming,
      });

      setIsCompletingSubscription(false);
      clearPaymentState();
      loadStatus();

      const plan = plans.find((p) => p.id === currentPlanId);
      setResultType('success');
      setResultTitle('Subscription Activated!');
      setResultMessage('Your subscription has been successfully activated. Welcome to Feather!');
      setShowResultView(true);
    } catch (err: unknown) {
      setIsCompletingSubscription(false);
      setResultType('error');
      setResultTitle('Subscription Failed');
      setResultMessage(mapErrorMessage(err instanceof Error ? err.message : 'An error occurred'));
      setShowResultView(true);
    }
  };

  const onPaymentError = (error: string) => {
    setShowPaymentModal(false);
    setIsCompletingSubscription(false);
    showError(error);
  };

  const onPaymentCancel = () => {
    setShowPaymentModal(false);
    setIsCompletingSubscription(false);
    clearPaymentState();
  };

  // --- Cancel / Reactivate ---

  const confirmCancel = async () => {
    setShowCancelConfirmation(false);
    if (!credentials) return;
    setIsCanceling(true);
    try {
      await cancelSubscription(credentials, false);
      setIsCanceling(false);
      loadStatus();
      showSuccess('Subscription will be canceled at period end');
    } catch (err: unknown) {
      setIsCanceling(false);
      showError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    }
  };

  const handleReactivate = async () => {
    if (!credentials) return;
    setIsReactivating(true);
    try {
      await reactivateSubscription(credentials);
      setIsReactivating(false);
      loadStatus();
      showSuccess('Subscription reactivated');
    } catch (err: unknown) {
      setIsReactivating(false);
      showError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    }
  };

  const confirmCancelPending = async () => {
    setShowCancelPendingChangeConfirmation(false);
    if (!credentials) return;
    setIsLoading(true);
    try {
      await cancelPendingChange(credentials);
      setIsLoading(false);
      loadStatus();
      showSuccess('Pending plan change cancelled');
    } catch (err: unknown) {
      setIsLoading(false);
      showError(err instanceof Error ? err.message : 'Failed to cancel pending change');
    }
  };

  // --- Result view handlers ---

  const onResultRedirect = useCallback(() => {
    const plan = currentPlanId ? plans.find((p) => p.id === currentPlanId) : null;
    const planName = plan ? getPlanTranslatedName(plan) : undefined;

    if (resultType === 'success') {
      redirectOnSuccess(currentPlanId || 0, planName);
    } else {
      redirectOnFailure(resultMessage);
    }
  }, [currentPlanId, plans, resultType, resultMessage]);

  const onResultRetry = () => {
    setShowResultView(false);
    if (currentPlanId) {
      const plan = plans.find((p) => p.id === currentPlanId);
      if (plan) initiatePayment(plan);
    }
  };

  // --- Auth states ---

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !credentials) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-6">
          <h1 className="text-xl font-semibold text-ink-08 mb-2">Authentication Error</h1>
          <p className="text-ink-05">{authError || 'Please access this page from the Feather app.'}</p>
        </div>
      </div>
    );
  }

  // --- Render ---

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-08">Subscriptions<span className="text-brand">.</span></h1>
      </header>

      {/* Loading */}
      {isLoading && plans.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
          <span className="ml-3 text-ink-05">Loading plans...</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && plans.length === 0 && (
        <div className="text-center py-20">
          <p className="text-ink-05">No subscription plans available</p>
        </div>
      )}

      {/* Plans Content */}
      {plans.length > 0 && (
        <div className="flex flex-col gap-6">
          {/* Current Plan */}
          {isSubscribed && (
            <CurrentPlanCard
              subscriptionStatus={subscriptionStatus}
              isCanceling={isCanceling}
              isReactivating={isReactivating}
              onCancelRequest={() => setShowCancelConfirmation(true)}
              onReactivateRequest={handleReactivate}
            />
          )}

          {/* Payment Methods */}
          {isSubscribed && <PaymentMethods defaultPaymentMethod={defaultPaymentMethod} />}

          {/* Duration Picker */}
          {sortedDurations.length > 1 && (
            <section>
              <h2 className="text-xl font-bold text-ink-08 mb-4">Available Plans</h2>
              <DurationPicker
                durations={sortedDurations}
                selectedDuration={selectedDuration}
                getDurationDisplayName={getDurationDisplayName}
                onDurationChange={setSelectedDuration}
              />
            </section>
          )}

          {/* Plan Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isPurchased={isPlanPurchased(plan)}
                isPendingPlan={isPendingPlan(plan)}
                isUpgrade={isUpgrade(plan)}
                isDowngrade={isDowngrade(plan)}
                canPurchase={canPurchasePlan(plan)}
                isSubscribed={isSubscribed}
                canGetTrial={subscriptionStatus?.can_get_trial ?? false}
                trialPeriodDays={trialPeriodDays}
                savings={calculateSavings(plan)}
                isLoading={isLoading}
                formatDurationText={formatDurationText}
                onPurchase={() => purchasePlan(plan)}
                onCancelPendingChange={() => setShowCancelPendingChangeConfirmation(true)}
              />
            ))}
          </section>
        </div>
      )}

      {/* Loading Overlays */}
      {isCompletingSubscription && <LoadingOverlay message="Completing subscription..." />}
      {isCanceling && <LoadingOverlay message="Canceling subscription..." />}
      {isReactivating && <LoadingOverlay message="Reactivating subscription..." />}

      {/* Stripe Payment Modal */}
      {showPaymentModal && clientSecret && (
        <StripePaymentModal
          clientSecret={clientSecret}
          intentType={currentIntentType}
          amountLabel={paymentAmountLabel}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          onCancel={onPaymentCancel}
        />
      )}

      {/* Result View */}
      {showResultView && (
        <ResultView
          type={resultType}
          title={resultTitle}
          message={resultMessage}
          onRedirect={onResultRedirect}
          onClose={() => { setShowResultView(false); clearPaymentState(); }}
          onRetry={onResultRetry}
        />
      )}

      {/* Confirmation Modals */}
      {showCancelConfirmation && (
        <ConfirmationModal
          title="Cancel Subscription"
          message="Are you sure you want to cancel your subscription? Your subscription will remain active until the end of the current billing period."
          confirmText="Cancel at Period End"
          cancelText="Keep Subscription"
          isDangerous
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelConfirmation(false)}
        />
      )}

      {showChangeTimingAlert && (
        <ConfirmationModal
          title="Select Change Timing"
          message="When should the plan change take effect?"
          confirmText="Change Immediately"
          secondaryText="Change at Period End"
          cancelText="Cancel"
          showSecondary
          onConfirm={() => selectChangeTiming('immediate')}
          onSecondary={() => selectChangeTiming('end_of_period')}
          onCancel={() => { setShowChangeTimingAlert(false); setCurrentPlanId(null); }}
        />
      )}

      {showDowngradeConfirmation && (
        <ConfirmationModal
          title="Confirm Plan Change"
          message="Downgrades can only take effect at the end of your current billing period. Are you sure you want to change your plan?"
          confirmText="Change at Period End"
          cancelText="Cancel"
          isDangerous
          onConfirm={() => { setShowDowngradeConfirmation(false); setChangeTiming('end_of_period'); updateSubscriptionPlan(); }}
          onCancel={() => { setShowDowngradeConfirmation(false); setCurrentPlanId(null); }}
        />
      )}

      {showCancelPendingChangeConfirmation && (
        <ConfirmationModal
          title="Cancel Scheduled Change"
          message="Are you sure you want to cancel the scheduled plan change? Your current plan will remain active."
          confirmText="Confirm"
          cancelText="Cancel"
          isDangerous
          onConfirm={confirmCancelPending}
          onCancel={() => setShowCancelPendingChangeConfirmation(false)}
        />
      )}
    </div>
  );
}
