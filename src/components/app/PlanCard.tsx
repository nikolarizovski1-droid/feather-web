'use client';

import { CheckCircle, Tag, Gift, Loader2 } from 'lucide-react';
import type { Plan } from '@/types/pricing';
import type { SubscriptionPlanFeature } from '@/types/subscription';
import {
  getPlanTranslatedName,
  getPlanTranslatedDescription,
  getFeatureTranslatedTitle,
  getFeatureTranslatedDescription,
} from '@/types/subscription';

interface PlanCardProps {
  plan: Plan;
  isPurchased: boolean;
  isPendingPlan: boolean;
  isUpgrade: boolean;
  isDowngrade: boolean;
  canPurchase: boolean;
  isSubscribed: boolean;
  canGetTrial: boolean;
  trialPeriodDays: number | null;
  savings: { amount: number; formatted: string } | null;
  isLoading: boolean;
  formatDurationText: (duration: string) => string;
  onPurchase: () => void;
  onCancelPendingChange: () => void;
}

export default function PlanCard({
  plan,
  isPurchased,
  isPendingPlan,
  isUpgrade,
  isDowngrade,
  canPurchase,
  isSubscribed,
  canGetTrial,
  trialPeriodDays,
  savings,
  isLoading,
  formatDurationText,
  onPurchase,
  onCancelPendingChange,
}: PlanCardProps) {
  const showTrialBadge = !isSubscribed && canGetTrial && trialPeriodDays !== null && trialPeriodDays > 0;

  const displayFeatures = (): (SubscriptionPlanFeature | { name: string; title: string })[] => {
    const direct = plan.direct_features;
    if (direct && direct.length > 0) return direct as SubscriptionPlanFeature[];

    const legacy = plan.features;
    if (legacy && legacy.length > 0) {
      const first = legacy[0];
      if (typeof first === 'object' && first !== null && 'name' in first) {
        return legacy as unknown as SubscriptionPlanFeature[];
      }
      return (legacy as unknown as string[]).map((title, i) => ({ name: `legacy-${i}-${String(title)}`, title: String(title) }));
    }
    return [];
  };

  const formatPrice = () => plan.price.formatted.replace(/\.00(?=\s|$|[^\d])/, '');

  const getButtonText = () => {
    if (isPendingPlan) return 'Cancel Change';
    if (isPurchased && !isPendingPlan) return 'Current Plan';
    if (isSubscribed) return 'Change Plan';
    if (isUpgrade) return 'Upgrade';
    return 'Subscribe';
  };

  const handleClick = () => {
    if (isPendingPlan) onCancelPendingChange();
    else if (canPurchase) onPurchase();
  };

  const isCurrentPlan = isPurchased && !isPendingPlan;
  const features = displayFeatures();

  return (
    <div
      className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 shadow-sm transition-all duration-200 ${
        isCurrentPlan ? 'border-brand/30 ring-1 ring-brand/10' : 'border-black/5'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xl font-bold text-ink-08">{getPlanTranslatedName(plan)}</h3>
          {isCurrentPlan && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
              Current Plan
            </span>
          )}
          {isPendingPlan && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              Scheduled Change
            </span>
          )}
        </div>
        {getPlanTranslatedDescription(plan) && (
          <p className="text-sm text-ink-05">{getPlanTranslatedDescription(plan)}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-ink-08">{formatPrice()}</span>
        <span className="text-base text-ink-05">/ {formatDurationText(plan.duration)}</span>
      </div>

      {/* Savings */}
      {savings && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">
          <Tag size={14} />
          <span>{savings.formatted}</span>
        </div>
      )}

      {/* Trial */}
      {showTrialBadge && (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-xl px-3 py-2">
          <Gift size={14} />
          <span>{trialPeriodDays}-day free trial</span>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-ink-08">Features</h4>
          <div className="flex flex-col gap-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-brand mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink-08">
                    {getFeatureTranslatedTitle(feature as SubscriptionPlanFeature)}
                  </span>
                  {getFeatureTranslatedDescription(feature as SubscriptionPlanFeature) && (
                    <span className="text-xs text-ink-05">
                      {getFeatureTranslatedDescription(feature as SubscriptionPlanFeature)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-black/5" />

      {/* Action */}
      <button
        onClick={handleClick}
        disabled={isLoading || !canPurchase}
        className={`w-full py-3 px-4 rounded-full text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
          isPendingPlan
            ? 'border border-amber-500 text-amber-700 hover:bg-amber-50'
            : isCurrentPlan
              ? 'bg-black/5 text-ink-05 cursor-not-allowed'
              : 'bg-brand text-white hover:bg-[#e5474b] disabled:opacity-50'
        }`}
      >
        {isLoading && <Loader2 size={16} className="inline mr-2 animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  );
}
