import type { ReactNode } from 'react';
import AppProviders from './providers';
import AppNavbar from '@/components/app/AppNavbar';
import ToastContainer from '@/components/app/ToastContainer';

export const metadata = {
  title: 'Feather App',
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <div className="min-h-screen bg-surface text-ink-08 relative">
        {/* Decorative ambient gradients */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,96,100,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 100% 100%, rgba(255,96,100,0.03) 0%, transparent 70%)',
            }}
          />
        </div>
        <AppNavbar />
        <main className="relative z-10 pt-16">
          {children}
        </main>
      </div>
      <ToastContainer />
    </AppProviders>
  );
}
