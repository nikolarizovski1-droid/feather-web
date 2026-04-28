'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;
    router.replace(pathname, { locale: newLocale as (typeof routing.locales)[number] });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/90 backdrop-blur-md border-b border-black/5 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Feather"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-xl font-bold tracking-tight text-ink-08">
              feather
            </span>
            <span className="text-xl font-bold text-brand">.</span>
          </Link>

          {/* Locale switcher */}
          <div className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-1 py-0.5">
            {routing.locales.map((locale, i) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 uppercase ${
                  currentLocale === locale
                    ? 'bg-black/10 text-ink-08'
                    : 'text-ink-05 hover:text-ink-08'
                }`}
              >
                {locale}
                {i < routing.locales.length - 1 && (
                  <span className="sr-only">/</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
