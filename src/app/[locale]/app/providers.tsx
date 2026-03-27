'use client';

import { Suspense, type ReactNode } from 'react';
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import { NotificationsContext, useNotificationsProvider } from '@/hooks/useNotifications';

function AuthProviderInner({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function NotificationsProvider({ children }: { children: ReactNode }) {
  const notifications = useNotificationsProvider();
  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthProviderInner>
        <NotificationsProvider>{children}</NotificationsProvider>
      </AuthProviderInner>
    </Suspense>
  );
}
