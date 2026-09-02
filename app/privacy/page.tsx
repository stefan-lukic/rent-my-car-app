import Link from 'next/link';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import InformationalPageLayout from '@/components/InformationalPageLayout';
import l from '@/helper/en';

export default function PrivacyPolicy() {
  const content = l.informational.privacy;

  return (
    <InformationalPageLayout
      currentPath="/privacy"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          {content.sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-3 text-lg font-bold text-slate-950">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {section.description}
              </p>
            </section>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-emerald-100 bg-emerald-50 p-6 lg:sticky lg:top-6">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 font-bold text-slate-950">
            {content.rightsTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {content.rightsDescription}
          </p>
          <Link
            href="https://poverenik.rs/zastita-podataka/kako-da-ostvarite-svoja-prava/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            {content.rightsAction}
            <ExternalLink className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {content.lastUpdated}
          </p>
        </aside>
      </div>
    </InformationalPageLayout>
  );
}
