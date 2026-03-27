import type { ReactNode } from 'react';
import AppProviders from './providers';
import ToastContainer from '@/components/app/ToastContainer';

export const metadata = {
  title: 'Feather App',
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <main className="min-h-screen bg-gray-950 text-white">
        {children}
      </main>
      <ToastContainer />
    </AppProviders>
  );
}
