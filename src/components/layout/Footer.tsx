import Link from "next/link";
import { getTranslations } from "next-intl/server";

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default async function Footer() {
  const t = await getTranslations("Footer");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    [t("categories.product")]: [
      { label: t("links.features"), href: "/features" },
      { label: t("links.howItWorks"), href: "/how-it-works" },
      { label: t("links.pricing"), href: "/pricing" },
      { label: t("links.tvDisplayApp"), href: "/features#tv-app" },
      { label: t("links.pushNotifications"), href: "/features#notifications" },
    ],
    [t("categories.useCases")]: [
      { label: t("useCases.fastCasual"), href: "/for/fast-casual" },
      { label: t("useCases.fineDining"), href: "/for/fine-dining" },
      { label: t("useCases.multiLocation"), href: "/for/multi-location" },
    ],
    [t("categories.resources")]: [
      { label: t("links.blog"), href: "/blog" },
      { label: t("links.faq"), href: "/faq" },
      { label: t("links.documentation"), href: "/docs" },
    ],
    [t("categories.company")]: [
      { label: t("links.about"), href: "/about" },
      { label: t("links.contact"), href: "/contact" },
    ],
    [t("categories.legal")]: [
      { label: t("links.privacyPolicy"), href: "/privacy" },
      { label: t("links.termsOfService"), href: "/terms" },
    ],
  };

  return (
    <footer className="bg-ink-08 border-t border-white/5" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-7 gap-8">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-xl font-bold tracking-tight text-white">
                feather
              </span>
              <span className="text-xl font-bold text-brand">.</span>
            </Link>
            <p className="text-sm text-ink-05 leading-relaxed max-w-[220px]">
              {t("tagline")}
            </p>
            {/* App store badges */}
            <div className="flex flex-col gap-2 mt-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-ink-07 px-3 py-2 hover:border-white/20 transition-colors w-fit"
                aria-label={t("downloadOnAppStore")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-white shrink-0"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-[9px] text-white/40 leading-none">
                    {t("downloadOnThe")}
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {t("appStore")}
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-ink-07 px-3 py-2 hover:border-white/20 transition-colors w-fit"
                aria-label={t("getItOnGooglePlay")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-white shrink-0"
                >
                  <path d="M3.18 23.76a2 2 0 0 1-.87-1.86V2.1a2 2 0 0 1 .87-1.86l.11-.06 12.05 12.05-.1.1L3.18 23.76zm13.5-7.9L4.04 22.62l9.85-9.85 2.79 3.09zm2.47-5.35c.53.3.88.85.88 1.49s-.35 1.19-.88 1.49l-2.25 1.3-3.06-3.06 3.06-3.06 2.25 1.3zM4.04 1.38l12.64 6.76-2.79 3.09L3.84 1.44l.2-.06z" />
                </svg>
                <div>
                  <div className="text-[9px] text-white/40 leading-none">
                    {t("getItOn")}
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {t("googlePlay")}
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                {category}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-05 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-06">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-ink-06 hover:text-white transition-colors"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
