'use client';

import type { StatusDisplayInfo } from '@/types/subscription';

const classMap: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400',
  trial: 'bg-blue-500/20 text-blue-400',
  canceling: 'bg-amber-500/20 text-amber-400',
  'past-due': 'bg-red-500/20 text-red-400',
  canceled: 'bg-gray-500/20 text-gray-400',
  unpaid: 'bg-red-500/20 text-red-400',
  incomplete: 'bg-amber-500/20 text-amber-400',
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
