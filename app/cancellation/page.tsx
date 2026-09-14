import l from '@/helper/en';

export default function CancellationOptions() {
  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          RentMyCar policy
        </p>
        <h1 className="mb-6 mt-2 font-heading text-3xl font-bold text-ink">
          {l.pages.cancellationOptions}
        </h1>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold leading-6 text-ink">
              {l.pages.flexiblePolicy}
            </h2>
            <p className="mb-4 text-sm leading-7 text-slate-600">
              {l.pages.cancellationDesc}
            </p>

            <h3 className="mb-2 mt-6 font-heading font-semibold text-ink-secondary">
              {l.pages.forClients}
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 marker:text-brand">
              <li>{l.pages.clientCancellationWindow}</li>
              <li>{l.pages.clientCancellationCutoff}</li>
              <li>{l.pages.clientCancellationResult}</li>
            </ul>

            <h3 className="mb-2 mt-6 font-heading font-semibold text-ink-secondary">
              {l.pages.forCarOwners}
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 marker:text-brand">
              <li>{l.pages.ownerCancellationUnavailable}</li>
              <li>{l.pages.noOwnerCancellationPenalties}</li>
              <li>{l.pages.paymentArrangements}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold leading-6 text-ink">
              {l.pages.howToCancel}
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600 marker:font-semibold marker:text-brand">
              <li>{l.pages.stepLogin}</li>
              <li>{l.pages.stepGoToReservations}</li>
              <li>{l.pages.stepFindReservation}</li>
              <li>{l.pages.stepClickCancel}</li>
              <li>{l.pages.stepConfirmation}</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
