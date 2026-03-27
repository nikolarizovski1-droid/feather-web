'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSearchParams } from 'next/navigation';
import type { AuthCredentials } from '@/types/subscription';

const SESSION_STORAGE_KEY = 'feather_subscription_session';
const SESSION_TTL_SECONDS = 30 * 60; // 30 minutes
const AUTH_KEY_HEX = process.env.NEXT_PUBLIC_AUTH_FRAGMENT_KEY ?? '';

interface AuthSessionPayload extends AuthCredentials {
  exp: number;
}

interface AuthState {
  credentials: AuthCredentials | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  setCredentials: (shopId: number, userId: number, token: string) => void;
  clearCredentials: () => void;
}

// --- Crypto helpers ---

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importKey(): Promise<CryptoKey> {
  const keyBytes = hexToBytes(AUTH_KEY_HEX);
  return crypto.subtle.importKey('raw', keyBytes.buffer as ArrayBuffer, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);
}

async function encryptSession(creds: AuthCredentials): Promise<string> {
  const payload: AuthSessionPayload = {
    ...creds,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const key = await importKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, data);
  const ciphertext = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv, 0);
  combined.set(ciphertext, iv.length);
  return base64UrlEncode(combined);
}

async function decryptSession(): Promise<AuthCredentials | null> {
  try {
    const encoded = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!encoded) return null;

    const bytes = base64UrlDecode(encoded);
    if (bytes.length < 28) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    const iv = bytes.slice(0, 12);
    const ciphertextWithTag = bytes.slice(12);
    const key = await importKey();
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      key,
      ciphertextWithTag,
    );

    const payload: AuthSessionPayload = JSON.parse(new TextDecoder().decode(decrypted));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return { shopId: payload.shopId, userId: payload.userId, token: payload.token };
  } catch {
    try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch { /* ignore */ }
    return null;
  }
}

// --- Context ---

const AuthContext = createContext<AuthContextValue | null>(null);

export { AuthContext };

// --- Hook ---

export function useAuthProvider(): AuthContextValue {
  const searchParams = useSearchParams();
  const [state, setState] = useState<AuthState>({
    credentials: null,
    isAuthenticated: false,
    isInitialized: false,
    error: null,
  });

  // Bootstrap auth: session snapshot → URL params
  useEffect(() => {
    async function bootstrap() {
      // 1. Try encrypted session
      const sessionCreds = await decryptSession();
      if (sessionCreds) {
        setState({
          credentials: sessionCreds,
          isAuthenticated: true,
          isInitialized: true,
          error: null,
        });
        return;
      }

      // 2. Try URL search params
      const shopIdStr = searchParams.get('shopId');
      const userIdStr = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!shopIdStr && !userIdStr && !token) {
        setState((prev) => ({
          ...prev,
          isInitialized: true,
          error: prev.isAuthenticated ? null : 'Missing authentication parameters in URL',
        }));
        return;
      }

      const shopId = shopIdStr ? parseInt(shopIdStr, 10) : null;
      const userId = userIdStr ? parseInt(userIdStr, 10) : null;

      if (shopIdStr && (!shopId || isNaN(shopId) || shopId <= 0)) {
        setState({ credentials: null, isAuthenticated: false, isInitialized: true, error: 'Invalid shopId parameter' });
        return;
      }
      if (userIdStr && (!userId || isNaN(userId) || userId <= 0)) {
        setState({ credentials: null, isAuthenticated: false, isInitialized: true, error: 'Invalid userId parameter' });
        return;
      }

      if (!shopId || !userId || !token) {
        const missing: string[] = [];
        if (!shopId) missing.push('shopId');
        if (!userId) missing.push('userId');
        if (!token) missing.push('token');
        setState({
          credentials: null,
          isAuthenticated: false,
          isInitialized: true,
          error: `Missing required parameters: ${missing.join(', ')}`,
        });
        return;
      }

      const creds: AuthCredentials = { shopId, userId, token };
      setState({ credentials: creds, isAuthenticated: true, isInitialized: true, error: null });

      // Persist encrypted session
      try {
        const encrypted = await encryptSession(creds);
        sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
      } catch { /* ignore */ }
    }

    bootstrap();
  }, [searchParams]);

  const setCredentials = useCallback((shopId: number, userId: number, token: string) => {
    const creds: AuthCredentials = { shopId, userId, token };
    setState({ credentials: creds, isAuthenticated: true, isInitialized: true, error: null });
    encryptSession(creds)
      .then((encrypted) => sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted))
      .catch(() => { /* ignore */ });
  }, []);

  const clearCredentials = useCallback(() => {
    setState({ credentials: null, isAuthenticated: false, isInitialized: false, error: null });
    try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return useMemo(
    () => ({ ...state, setCredentials, clearCredentials }),
    [state, setCredentials, clearCredentials],
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
