import Link from 'next/link';
import { AlertTriangle, CircleHelp } from 'lucide-react';
import InformationalPageLayout from '@/components/InformationalPageLayout';
import l from '@/helper/en';

export default function HelpCenter() {
  const content = l.informational.help;

  return (
    <InformationalPageLayout
      currentPath="/help"
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CircleHelp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {content.faqEyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {content.faqTitle}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {content.questions.map((faq) => (
            <article key={faq.question}>
              <h3 className="font-bold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex gap-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h2 className="font-bold text-amber-950">{content.safetyTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900/80">
              {content.safetyDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{content.nextTitle}</h2>
          <p className="mt-1 text-sm text-slate-300">
            {content.nextDescription}
          </p>
        </div>
        <Link
          href="/profile/my-profile"
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-blue-500"
        >
          {content.nextAction}
        </Link>
      </section>
    </InformationalPageLayout>
  );
}
