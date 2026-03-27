'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { X } from 'lucide-react';

const typeStyles: Record<string, string> = {
  error: 'bg-red-600',
  success: 'bg-emerald-600',
  info: 'bg-blue-600',
};

const typeLabels: Record<string, string> = {
  error: 'Error',
  success: 'Success',
  info: 'Info',
};

export default function ToastContainer() {
  const { messages, dismiss } = useNotifications();

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${typeStyles[msg.type]} text-white rounded-lg px-4 py-3 shadow-lg flex items-start gap-3 animate-in slide-in-from-right`}
        >
          <div className="flex-1">
            {!msg.hideTitle && (
              <p className="font-semibold text-sm">{typeLabels[msg.type]}</p>
            )}
            <p className="text-sm">{msg.text}</p>
          </div>
          <button
            onClick={() => dismiss(msg.id)}
            className="shrink-0 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
