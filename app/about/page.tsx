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
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          {content.howEyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
          {content.howTitle}
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {[content.stepOne, content.stepTwo, content.stepThree].map(
            (step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-5 rounded-3xl bg-blue-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-blue-100">
            <CarFront className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {content.ctaEyebrow}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-black">{content.ctaTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
            {content.ctaDescription}
          </p>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
        >
          {content.ctaAction}
        </Link>
      </section>
    </InformationalPageLayout>
  );
}
