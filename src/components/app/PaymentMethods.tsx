'use client';

import { CreditCard, Apple } from 'lucide-react';
import type { PaymentMethod } from '@/types/subscription';
import { formatCardDisplay, formatCardExpiry } from '@/types/subscription';

interface PaymentMethodsProps {
  defaultPaymentMethod: PaymentMethod | null;
}

export default function PaymentMethods({ defaultPaymentMethod }: PaymentMethodsProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-ink-08">Payment Methods</h2>

      {defaultPaymentMethod ? (
        <div className="bg-card border border-black/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            {defaultPaymentMethod.type.toLowerCase() === 'apple_pay' ? (
              <Apple size={20} className="text-brand" />
            ) : (
              <CreditCard size={20} className="text-brand" />
            )}

            <div className="flex flex-col gap-1 flex-1">
              {defaultPaymentMethod.type.toLowerCase() === 'apple_pay' ? (
                <span className="text-base font-semibold text-ink-08">Apple Pay</span>
              ) : defaultPaymentMethod.card ? (
                <>
                  <span className="text-base font-semibold text-ink-08">
                    {formatCardDisplay(defaultPaymentMethod.card)}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-ink-05">
                    {defaultPaymentMethod.card.brand && (
                      <span className="capitalize">{defaultPaymentMethod.card.brand}</span>
                    )}
                    {defaultPaymentMethod.card.exp_month && defaultPaymentMethod.card.exp_year && (
                      <span>• {formatCardExpiry(defaultPaymentMethod.card)}</span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-base font-semibold text-ink-08">Payment Method</span>
              )}
            </div>

            {defaultPaymentMethod.is_default && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand text-white">
                Default
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-black/5 rounded-2xl p-5 shadow-sm flex items-center gap-3">
          <CreditCard size={20} className="text-ink-05" />
          <span className="text-sm text-ink-05">No payment method set</span>
        </div>
      )}
    </section>
  );
}
