"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = routing.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  ) ?? routing.defaultLocale;

  const navLinks = [
    { label: t("features"), href: "/features" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("faq"), href: "/faq" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/") || "/");
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink-08/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold tracking-tight text-white">
              feather
            </span>
            <span className="text-xl font-bold text-brand">.</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-05 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + locale switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1 py-0.5">
              {routing.locales.map((locale, i) => (
                <button
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 uppercase ${
                    currentLocale === locale
                      ? "bg-white/15 text-white"
                      : "text-ink-05 hover:text-white"
                  }`}
                >
                  {locale}
                  {i < routing.locales.length - 1 && (
                    <span className="sr-only">/</span>
                  )}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="text-sm font-medium text-ink-05 hover:text-white transition-colors duration-200"
            >
              {t("signIn")}
            </Link>
            <Button href="/signup" size="sm">
              {t("startFreeTrial")}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-ink-08/95 backdrop-blur-md">
          <div className="px-4 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-05 hover:text-white py-2.5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-white/5 flex flex-col gap-3">
              {/* Mobile language switcher */}
              <div className="flex items-center gap-2">
                {routing.locales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => {
                      switchLocale(locale);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full uppercase transition-all duration-200 border ${
                      currentLocale === locale
                        ? "bg-white/15 border-white/20 text-white"
                        : "border-white/10 text-ink-05 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {locale}
                  </button>
                ))}
              </div>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-05 hover:text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("signIn")}
              </Link>
              <Button href="/signup" className="w-full">
                {t("startFreeTrial")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
