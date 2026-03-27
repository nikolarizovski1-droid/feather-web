'use client';

import { X } from 'lucide-react';

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
  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-[1040]"
        onClick={onCancel}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1050] w-[90%] max-w-[400px]">
        <div className="bg-[#171716] border border-[#3D3D3D] rounded-2xl">
          <div className="px-5 py-4 border-b border-[#282626]">
            <h5 className="text-lg font-bold text-white">{title}</h5>
          </div>
          <div className="px-5 py-5">
            <p className="text-[#CFCFCF] leading-relaxed">{message}</p>
          </div>
          <div className="px-5 py-4 border-t border-[#282626] flex gap-3 justify-end flex-wrap">
            <button
              onClick={onCancel}
              className="min-w-[100px] px-4 py-2.5 rounded-lg bg-[#313131] text-white font-medium hover:bg-[#3D3D3D] transition-colors"
            >
              {cancelText}
            </button>
            {showSecondary && secondaryText && (
              <button
                onClick={onSecondary}
                className="min-w-[100px] px-4 py-2.5 rounded-lg bg-[#313131] text-white font-medium hover:bg-[#3D3D3D] transition-colors"
              >
                {secondaryText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`min-w-[100px] px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isDangerous
                  ? 'border border-red-500 text-red-500 hover:bg-red-500/10'
                  : 'bg-[#FF6064] text-white hover:bg-[#e5565a]'
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
