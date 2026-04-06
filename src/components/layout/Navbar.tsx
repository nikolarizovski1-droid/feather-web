"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
    pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  ) ?? routing.defaultLocale;

  const navLinks = [
    { label: t("features"), href: "/features" },
    { label: t("howItWorks"), href: "/how-it-works" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("faq"), href: "/faq" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") || "/");
  }

  // Homepage has a dark hero — navbar text stays white when not scrolled.
  // All other pages have light backgrounds — navbar text should be dark.
  const strippedPath = pathname.replace(/^\/(en|mk|sq)/, "") || "/";
  const isHomepage = strippedPath === "/" || strippedPath === "";
  const isDarkContext = isHomepage && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/90 backdrop-blur-md border-b border-black/5 shadow-sm"
          : "bg-transparent"
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
            <span className={`text-xl font-bold tracking-tight ${isDarkContext ? "text-white" : "text-ink-08"}`}>
              feathermenu
            </span>
            <span className="text-xl font-bold text-brand">.</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = strippedPath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? isDarkContext ? "text-white" : "text-ink-08"
                      : isDarkContext
                        ? "text-white/60 hover:text-white"
                        : "text-ink-05 hover:text-ink-08"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + locale switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <div className={`flex items-center gap-1 rounded-full border px-1 py-0.5 ${
              isDarkContext ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
            }`}>
              {routing.locales.map((locale, i) => (
                <button
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 uppercase ${
                    currentLocale === locale
                      ? isDarkContext ? "bg-white/15 text-white" : "bg-black/10 text-ink-08"
                      : isDarkContext ? "text-white/50 hover:text-white" : "text-ink-05 hover:text-ink-08"
                  }`}
                >
                  {locale}
                  {i < routing.locales.length - 1 && (
                    <span className="sr-only">/</span>
                  )}
                </button>
              ))}
            </div>

            <a
              href="https://feather.echo-develop.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors duration-200 ${
                isDarkContext ? "text-white/60 hover:text-white" : "text-ink-05 hover:text-ink-08"
              }`}
            >
              {t("forMalls")}
            </a>
            <Button href="/app/onboarding" size="sm">
              {t("startFreeTrial")}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 -mr-2 rounded-lg transition-colors ${
              isDarkContext ? "text-white hover:bg-white/10" : "text-ink-08 hover:bg-black/10"
            }`}
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
        <div className="md:hidden border-t border-black/5 bg-card/95 backdrop-blur-md">
          <div className="px-4 py-5 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = strippedPath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-2.5 transition-colors ${
                    isActive ? "text-brand" : "text-ink-05 hover:text-ink-08"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-black/5 flex flex-col gap-3">
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
                        ? "bg-black/10 border-black/20 text-ink-08"
                        : "border-black/10 text-ink-05 hover:text-ink-08 hover:border-black/20"
                    }`}
                  >
                    {locale}
                  </button>
                ))}
              </div>
              <a
                href="https://feather.echo-develop.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-05 hover:text-ink-08 py-2.5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("forMalls")}
              </a>
              <Button href="/app/onboarding" className="w-full">
                {t("startFreeTrial")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
