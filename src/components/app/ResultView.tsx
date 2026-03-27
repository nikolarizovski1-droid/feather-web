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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1100] p-5">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-[400px] w-full text-center p-8 animate-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="mb-6">
          {type === 'success' ? (
            <CheckCircle size={64} className="text-emerald-400 mx-auto" />
          ) : (
            <XCircle size={64} className="text-[#FF6064] mx-auto" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

        {/* Message */}
        <p className="text-base font-medium text-white/80 mb-6 leading-relaxed">{message}</p>

        {/* Countdown */}
        {type === 'success' && countdown > 0 && (
          <p className="text-sm text-[#CFCFCF] mb-4">
            Redirecting to app in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {type === 'success' ? (
            <button
              onClick={handleRedirect}
              className="w-full py-3 px-4 rounded-lg bg-[#FF6064] text-white font-semibold hover:bg-[#e5565a] transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} /> Open App Now
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="w-full py-3 px-4 rounded-lg bg-[#FF6064] text-white font-semibold hover:bg-[#e5565a] transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <button
                onClick={handleRedirect}
                className="w-full py-3 px-4 rounded-lg bg-[#313131] text-white font-medium hover:bg-[#3D3D3D] transition-colors flex items-center justify-center gap-2"
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
