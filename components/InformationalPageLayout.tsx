import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import l from '@/helper/en';

type InformationalPagePath = '/about' | '/help' | '/terms' | '/privacy';

type InformationalPageLayoutProps = {
  currentPath: InformationalPagePath;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const informationalLinks: Array<{
  href: InformationalPagePath;
  label: string;
}> = [
  { href: '/about', label: l.landing.aboutUs },
  { href: '/help', label: l.landing.helpCenter },
  { href: '/terms', label: l.landing.termsOfService },
  { href: '/privacy', label: l.landing.privacyPolicy },
];

export default function InformationalPageLayout({
  currentPath,
  eyebrow,
  title,
  description,
  children,
}: InformationalPageLayoutProps) {
  return (
    <div className="min-h-full bg-surface pb-28 text-ink md:pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="rounded-xl bg-brand p-2 text-white shadow-sm">
              <Compass className="h-5 w-5" />
            </span>

            <span className="font-heading text-lg font-bold tracking-tight">
              RentMy<span className="text-brand">Car</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">{l.pages.backToCatalog}</span>
            <span className="sm:hidden">{l.common.backToHome}</span>
          </Link>
        </div>
      </header>

      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/40">
            {eyebrow}
          </p>

          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>

          <nav
            aria-label={l.informational.common.navigationLabel}
            className="mt-10 grid grid-cols-2 gap-2 sm:flex"
          >
            {informationalLinks.map((link) => {
              const isCurrent = currentPath === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`w-full rounded-xl border px-4 py-2 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-auto ${
                    isCurrent
                      ? 'border-brand/70 bg-brand text-white'
                      : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {children}
      </div>
    </div>
  );
}
