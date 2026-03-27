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
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-5 flex flex-col gap-4 ${
        isCurrentPlan ? 'border-[#FF6064]/40' : 'border-white/10'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xl font-bold text-white">{getPlanTranslatedName(plan)}</h3>
          {isCurrentPlan && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FF6064]/20 text-[#FF6064]">
              Current Plan
            </span>
          )}
          {isPendingPlan && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
              Scheduled Change
            </span>
          )}
        </div>
        {getPlanTranslatedDescription(plan) && (
          <p className="text-sm text-[#CFCFCF]">{getPlanTranslatedDescription(plan)}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{formatPrice()}</span>
        <span className="text-base text-[#CFCFCF]">/ {formatDurationText(plan.duration)}</span>
      </div>

      {/* Savings */}
      {savings && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
          <Tag size={14} />
          <span>{savings.formatted}</span>
        </div>
      )}

      {/* Trial */}
      {showTrialBadge && (
        <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 rounded-lg px-3 py-2">
          <Gift size={14} />
          <span>{trialPeriodDays}-day free trial</span>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-white">Features</h4>
          <div className="flex flex-col gap-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-[#FF6064] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">
                    {getFeatureTranslatedTitle(feature as SubscriptionPlanFeature)}
                  </span>
                  {getFeatureTranslatedDescription(feature as SubscriptionPlanFeature) && (
                    <span className="text-xs text-[#CFCFCF]">
                      {getFeatureTranslatedDescription(feature as SubscriptionPlanFeature)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/10" />

      {/* Action */}
      <button
        onClick={handleClick}
        disabled={isLoading || !canPurchase}
        className={`w-full py-3 px-4 rounded-lg text-base font-semibold transition-colors ${
          isPendingPlan
            ? 'border border-amber-500 text-amber-400 hover:bg-amber-500/10'
            : isCurrentPlan
              ? 'bg-[#5A5A5A] text-white cursor-not-allowed opacity-70'
              : 'bg-[#FF6064] text-white hover:bg-[#e5565a] disabled:opacity-50'
        }`}
      >
        {isLoading && <Loader2 size={16} className="inline mr-2 animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  );
}
