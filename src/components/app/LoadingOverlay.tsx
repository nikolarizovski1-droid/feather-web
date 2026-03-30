'use client';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1060] flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-lg px-8 py-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand border-t-transparent mx-auto mb-4" />
        <p className="text-ink-08 font-medium">{message}</p>
      </div>
    </div>
  );
}
