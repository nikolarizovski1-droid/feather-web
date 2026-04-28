"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto" as const,
    transition: {
      height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      opacity: { duration: 0.2 },
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      opacity: { duration: 0.15 },
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = useLocale();

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
    router.replace(pathname, { locale: newLocale as (typeof routing.locales)[number] });
  }

  const strippedPath = pathname;
  const isHomepage = strippedPath === "/" || strippedPath === "";
  const isDarkContext = isHomepage && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 border-b ${
        scrolled
          ? "bg-card/90 backdrop-blur-md border-black/5 shadow-sm"
          : "bg-transparent border-transparent"
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
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? isDarkContext ? "text-white" : "text-ink-08"
                      : isDarkContext
                        ? "text-white/60 hover:text-white"
                        : "text-ink-05 hover:text-ink-08"
                  }`}
                >
                  {link.label}
                  {/* Animated active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + locale switcher */}
          <div className="hidden md:flex items-center gap-4">
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
              href="https://featherinfo.echo-develop.com"
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu — animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-black/5 bg-card/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = strippedPath.startsWith(link.href);
                return (
                  <motion.div key={link.href} variants={mobileItemVariants}>
                    <Link
                      href={link.href}
                      className={`block text-sm font-medium py-2.5 transition-colors ${
                        isActive ? "text-brand" : "text-ink-05 hover:text-ink-08"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={mobileItemVariants}>
                <div className="pt-3 mt-2 border-t border-black/5 flex flex-col gap-3">
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
                    href="https://featherinfo.echo-develop.com"
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
