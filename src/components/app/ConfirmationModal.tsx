'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  secondaryText?: string;
  showSecondary?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSecondary?: () => void;
}

export default function ConfirmationModal({
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  secondaryText,
  showSecondary = false,
  isDangerous = false,
  onConfirm,
  onCancel,
  onSecondary,
}: ConfirmationModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1040]"
        onClick={onCancel}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1050] w-[90%] max-w-[400px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-card border border-black/5 rounded-2xl shadow-lg animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <h5 id="modal-title" className="text-lg font-bold text-ink-08">{title}</h5>
            <button onClick={onCancel} className="text-ink-05 hover:text-ink-08" aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <div className="px-5 py-5">
            <p className="text-ink-05 leading-relaxed">{message}</p>
          </div>
          <div className="px-5 py-4 border-t border-black/5 flex gap-3 justify-end flex-wrap">
            <button
              onClick={onCancel}
              className="min-w-[100px] px-4 py-2.5 rounded-full bg-transparent text-ink-08 border border-black/10 font-medium hover:bg-black/5 transition-colors"
            >
              {cancelText}
            </button>
            {showSecondary && secondaryText && (
              <button
                onClick={onSecondary}
                className="min-w-[100px] px-4 py-2.5 rounded-full bg-transparent text-ink-08 border border-black/10 font-medium hover:bg-black/5 transition-colors"
              >
                {secondaryText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`min-w-[100px] px-4 py-2.5 rounded-full font-medium transition-colors ${
                isDangerous
                  ? 'border border-red-300 text-red-600 hover:bg-red-50'
                  : 'bg-brand text-white hover:bg-[#e5474b]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
