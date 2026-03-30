'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, ExternalLink, RotateCcw } from 'lucide-react';

const REDIRECT_DELAY = Number(process.env.NEXT_PUBLIC_REDIRECT_DELAY_SECONDS ?? 5);

interface ResultViewProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onRedirect: () => void;
  onClose: () => void;
  onRetry: () => void;
}

export default function ResultView({
  type,
  title,
  message,
  onRedirect,
  onClose,
  onRetry,
}: ResultViewProps) {
  const [countdown, setCountdown] = useState(type === 'success' ? REDIRECT_DELAY : 0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (type !== 'success') return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [type, onRedirect]);

  const handleRedirect = () => {
    clearInterval(intervalRef.current);
    onRedirect();
  };

  const handleRetry = () => {
    clearInterval(intervalRef.current);
    onRetry();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1100] p-5">
      <div className="bg-card border border-black/5 rounded-2xl max-w-[400px] w-full text-center p-8 shadow-lg animate-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="mb-6">
          {type === 'success' ? (
            <CheckCircle size={64} className="text-emerald-500 mx-auto" />
          ) : (
            <XCircle size={64} className="text-brand mx-auto" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-ink-08 mb-4">{title}</h2>

        {/* Message */}
        <p className="text-base font-medium text-ink-05 mb-6 leading-relaxed">{message}</p>

        {/* Countdown */}
        {type === 'success' && countdown > 0 && (
          <p className="text-sm text-ink-06 mb-4">
            Redirecting to app in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {type === 'success' ? (
            <button
              onClick={handleRedirect}
              className="w-full py-3 px-4 rounded-full bg-brand text-white font-semibold hover:bg-[#e5474b] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} /> Open App Now
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="w-full py-3 px-4 rounded-full bg-brand text-white font-semibold hover:bg-[#e5474b] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <button
                onClick={handleRedirect}
                className="w-full py-3 px-4 rounded-full bg-transparent text-ink-08 border border-black/10 font-medium hover:bg-black/5 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} /> Return to App
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
