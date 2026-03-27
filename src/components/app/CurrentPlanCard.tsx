'use client';

import { useState, useRef, useEffect } from 'react';
import { CreditCard, MoreVertical, RotateCcw, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { SubscriptionStatus } from '@/types/subscription';
import { getStatusDisplayInfo, getPlanInfoTranslatedName } from '@/types/subscription';
import StatusBadge from './StatusBadge';

interface CurrentPlanCardProps {
  subscriptionStatus: SubscriptionStatus | null;
  isCanceling: boolean;
  isReactivating: boolean;
  onCancelRequest: () => void;
  onReactivateRequest: () => void;
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function CurrentPlanCard({
  subscriptionStatus,
  isCanceling,
  isReactivating,
  onCancelRequest,
  onReactivateRequest,
}: CurrentPlanCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusInfo = subscriptionStatus
    ? getStatusDisplayInfo(subscriptionStatus)
    : { text: 'Inactive', className: 'canceled' };

  const sub = subscriptionStatus?.subscription;
  const canShowMenu = sub && (
    sub.status.toLowerCase() === 'active' ||
    sub.status.toLowerCase() === 'trialing' ||
    sub.cancel_at_period_end === true
  );
  const showReactivate = sub?.cancel_at_period_end === true;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FF6064]/20">
            <CreditCard size={14} className="text-[#FF6064]" />
          </div>
          <span className="text-[15px] font-bold text-white">Current Plan</span>
        </div>

        {canShowMenu && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              disabled={isCanceling || isReactivating}
              className="p-2 text-white hover:text-[#CFCFCF] disabled:opacity-50"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#252525] border border-[#3D3D3D] rounded-lg shadow-lg z-10 min-w-[200px]">
                {showReactivate ? (
                  <button
                    onClick={() => { onReactivateRequest(); setMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#313131] flex items-center gap-2 rounded-lg"
                  >
                    <RotateCcw size={14} /> Reactivate Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => { onCancelRequest(); setMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-[#313131] flex items-center gap-2 rounded-lg"
                  >
                    <XCircle size={14} /> Cancel Subscription
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 mb-4" />

      {/* Content */}
      {sub ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-bold text-white">
              {getPlanInfoTranslatedName(sub.plan)}
            </span>
            <StatusBadge status={statusInfo} />
          </div>

          {sub.cancel_at_period_end && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertTriangle size={14} />
              <span>Canceling</span>
              {sub.current_period_end && (
                <span className="text-[#CFCFCF]">on {formatDate(sub.current_period_end)}</span>
              )}
            </div>
          )}

          {sub.pending_plan && !sub.pending_change_applied && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Clock size={14} />
              <span>Scheduled Change</span>
              <span className="text-white">→ {getPlanInfoTranslatedName(sub.pending_plan)}</span>
            </div>
          )}

          {sub.pending_plan && !sub.pending_change_applied && sub.pending_change_scheduled_at && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[#CFCFCF]">Change Scheduled For</span>
              <span className="text-[15px] font-semibold text-white">
                {formatDate(sub.pending_change_scheduled_at)}
              </span>
            </div>
          )}

          {sub.current_period_end && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[#CFCFCF]">
                {sub.cancel_at_period_end ? 'Cancels On' : 'Expires'}
              </span>
              <span className="text-[15px] font-semibold text-white">
                {formatDate(sub.current_period_end)}
              </span>
            </div>
          )}
        </div>
      ) : subscriptionStatus?.active ? (
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">Active subscription</span>
          <StatusBadge status={statusInfo} />
        </div>
      ) : (
        <span className="text-sm text-[#CFCFCF]">No active subscription</span>
      )}
    </div>
  );
}
