'use client';

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { SubscriptionIntentType } from '@/types/subscription';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
      <div className="fixed inset-0 bg-black/80 z-[1040]" onClick={() => !isProcessing && onCancel()} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1050] w-[95%] max-w-[450px] max-h-[90vh] overflow-y-auto">
        <div className="bg-[#171716] border border-[#3D3D3D] rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#282626]">
            <h5 className="text-lg font-bold text-white">Payment Details</h5>
            <button onClick={() => !isProcessing && onCancel()} className="text-white hover:text-[#CFCFCF]">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 min-h-[200px]">
            <div className="bg-[#252525] border border-[#3D3D3D] rounded-lg p-4">
              <PaymentElement onReady={handleReady} options={{ layout: 'tabs' }} />
            </div>

            {paymentError && (
              <div className="mt-4 p-3 bg-[#FF6064]/10 border border-[#FF6064]/30 rounded-lg text-[#FF6064] text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {paymentError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#282626]">
            {amountLabel && (
              <p className="text-[15px] font-semibold text-[#FF6064]">{amountLabel}</p>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => !isProcessing && onCancel()}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-lg bg-[#313131] text-white font-medium hover:bg-[#3D3D3D] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                disabled={isProcessing || !isReady}
                className="px-4 py-2.5 rounded-lg bg-[#FF6064] text-white font-semibold hover:bg-[#e5565a] disabled:opacity-50 transition-colors"
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
  theme: 'night' as const,
  variables: {
    colorPrimary: '#FF6064',
    colorBackground: '#252525',
    colorText: '#FFFFFF',
    colorDanger: '#FF6064',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { backgroundColor: '#313131', borderColor: '#3D3D3D' },
    '.Input:focus': { borderColor: '#FF6064' },
    '.Label': { color: '#CFCFCF' },
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
