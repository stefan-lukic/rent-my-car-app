import { Scale } from 'lucide-react';
import InformationalPageLayout from '@/components/InformationalPageLayout';
import l from '@/helper/en';

export default function TermsOfService() {
  const content = l.informational.terms;

  return (
    <InformationalPageLayout
      currentPath="/terms"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          {content.sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand/90">
                  {index + 1}
                </span>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-ink">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-body-muted">
                    {section.description}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-brand-tint bg-brand-tint p-6 lg:sticky lg:top-6">
          <Scale className="h-6 w-6 text-brand" />
          <h2 className="mt-4 font-heading font-semibold text-ink">
            {content.noteTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-body-muted">
            {content.noteDescription}
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-body-subtle">
            {content.lastUpdated}
          </p>
        </aside>
      </div>
    </InformationalPageLayout>
  );
}
