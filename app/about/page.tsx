import Link from 'next/link';
import { CalendarCheck2, CarFront, MapPin, UserRound } from 'lucide-react';
import InformationalPageLayout from '@/components/InformationalPageLayout';
import l from '@/helper/en';

export default function About() {
  const content = l.informational.about;

  return (
    <InformationalPageLayout
      currentPath="/about"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: MapPin,
            title: content.localTitle,
            description: content.localDescription,
          },
          {
            icon: CalendarCheck2,
            title: content.clearTitle,
            description: content.clearDescription,
          },
          {
            icon: UserRound,
            title: content.directTitle,
            description: content.directDescription,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-surface-0 p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-heading text-lg font-semibold text-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-body">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-surface-0 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {content.howEyebrow}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-ink">
          {content.howTitle}
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {[content.stepOne, content.stepTwo, content.stepThree].map(
            (step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-ink-secondary">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-body">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-5 rounded-2xl bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-brand-tint">
            <CarFront className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {content.ctaEyebrow}
            </span>
          </div>
          <h2 className="mt-3 font-heading text-2xl font-bold">
            {content.ctaTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-tint">
            {content.ctaDescription}
          </p>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
        >
          {content.ctaAction}
        </Link>
      </section>
    </InformationalPageLayout>
  );
}
