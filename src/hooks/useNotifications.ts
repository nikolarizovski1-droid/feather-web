'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { NotificationMessage, NotificationType } from '@/types/subscription';

interface NotificationsContextValue {
  messages: NotificationMessage[];
  showError: (text: string, hideTitle?: boolean) => void;
  showSuccess: (text: string) => void;
  showInfo: (text: string) => void;
  dismiss: (id: number) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export { NotificationsContext };

let nextId = 1;

export function useNotificationsProvider(): NotificationsContextValue {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);

  const dismiss = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const push = useCallback(
    (type: NotificationType, text: string, hideTitle?: boolean) => {
      const id = nextId++;
      setMessages((prev) => [...prev, { id, type, text, hideTitle }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const showError = useCallback(
    (text: string, hideTitle?: boolean) => push('error', text, hideTitle),
    [push],
  );
  const showSuccess = useCallback((text: string) => push('success', text), [push]);
  const showInfo = useCallback((text: string) => push('info', text), [push]);

  return useMemo(
    () => ({ messages, showError, showSuccess, showInfo, dismiss }),
    [messages, showError, showSuccess, showInfo, dismiss],
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
