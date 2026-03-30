'use client';

import type { StatusDisplayInfo } from '@/types/subscription';

const classMap: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  trial: 'bg-blue-50 text-blue-700',
  canceling: 'bg-amber-50 text-amber-700',
  'past-due': 'bg-red-50 text-red-700',
  canceled: 'bg-gray-100 text-gray-600',
  unpaid: 'bg-red-50 text-red-700',
  incomplete: 'bg-amber-50 text-amber-700',
};

export default function StatusBadge({ status }: { status: StatusDisplayInfo }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        classMap[status.className] || classMap.canceled
      }`}
    >
      {status.text}
    </span>
  );
}
