'use client';

import { useState, useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { SubscriptionIntentType } from '@/types/subscription';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

interface StripePaymentModalProps {
  clientSecret: string;
  intentType: SubscriptionIntentType;
  amountLabel: string | null;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

function PaymentForm({
  intentType,
  amountLabel,
  onSuccess,
  onError,
  onCancel,
}: Omit<StripePaymentModalProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleReady = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isProcessing) onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, onCancel]);

  const submitPayment = async () => {
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const result = intentType === 'setup_intent'
        ? await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: 'if_required',
          })
        : await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: 'if_required',
          });

      if (result.error) {
        setPaymentError(result.error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during payment';
      setPaymentError(message);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1040]" onClick={() => !isProcessing && onCancel()} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1050] w-[95%] max-w-[450px] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
      >
        <div className="bg-card border border-black/5 rounded-2xl shadow-lg animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <h5 id="payment-title" className="text-lg font-bold text-ink-08">Payment Details</h5>
            <button onClick={() => !isProcessing && onCancel()} className="text-ink-05 hover:text-ink-08" aria-label="Close">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 min-h-[200px]">
            <div className="bg-surface border border-black/5 rounded-xl p-4">
              <PaymentElement onReady={handleReady} options={{ layout: 'tabs' }} />
            </div>

            {paymentError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {paymentError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-black/5">
            {amountLabel && (
              <p className="text-[15px] font-semibold text-brand">{amountLabel}</p>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => !isProcessing && onCancel()}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-full bg-transparent text-ink-08 border border-black/10 font-medium hover:bg-black/5 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                disabled={isProcessing || !isReady}
                className="px-4 py-2.5 rounded-full bg-brand text-white font-semibold hover:bg-[#e5474b] disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="inline mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  intentType === 'setup_intent' ? 'Save Card' : 'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#FF6064',
    colorBackground: '#FFFFFF',
    colorText: '#1C1917',
    colorDanger: '#FF6064',
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { backgroundColor: '#FAF8F5', borderColor: '#E5E7EB' },
    '.Input:focus': { borderColor: '#FF6064', boxShadow: '0 0 0 2px rgba(255,96,100,0.2)' },
    '.Label': { color: '#6B7280' },
  },
};

export default function StripePaymentModal(props: StripePaymentModalProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: props.clientSecret, appearance: stripeAppearance }}
    >
      <PaymentForm
        intentType={props.intentType}
        amountLabel={props.amountLabel}
        onSuccess={props.onSuccess}
        onError={props.onError}
        onCancel={props.onCancel}
      />
    </Elements>
  );
}
