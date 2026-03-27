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
      <h2 className="text-xl font-bold text-white">Payment Methods</h2>

      {defaultPaymentMethod ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            {defaultPaymentMethod.type.toLowerCase() === 'apple_pay' ? (
              <Apple size={20} className="text-[#FF6064]" />
            ) : (
              <CreditCard size={20} className="text-[#FF6064]" />
            )}

            <div className="flex flex-col gap-1 flex-1">
              {defaultPaymentMethod.type.toLowerCase() === 'apple_pay' ? (
                <span className="text-base font-semibold text-white">Apple Pay</span>
              ) : defaultPaymentMethod.card ? (
                <>
                  <span className="text-base font-semibold text-white">
                    {formatCardDisplay(defaultPaymentMethod.card)}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[#CFCFCF]">
                    {defaultPaymentMethod.card.brand && (
                      <span className="capitalize">{defaultPaymentMethod.card.brand}</span>
                    )}
                    {defaultPaymentMethod.card.exp_month && defaultPaymentMethod.card.exp_year && (
                      <span>• {formatCardExpiry(defaultPaymentMethod.card)}</span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-base font-semibold text-white">Payment Method</span>
              )}
            </div>

            {defaultPaymentMethod.is_default && (
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#FF6064] text-white">
                Default
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-3">
          <CreditCard size={20} className="text-[#CFCFCF]" />
          <span className="text-sm text-[#CFCFCF]">No payment method set</span>
        </div>
      )}
    </section>
  );
}
