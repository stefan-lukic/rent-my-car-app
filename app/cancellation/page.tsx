import l from '@/helper/en';

export default function CancellationOptions() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {l.pages.cancellationOptions}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {l.pages.flexiblePolicy}
            </h2>
            <p className="text-base text-gray-500 mb-4">
              {l.pages.cancellationDesc}
            </p>

            <h3 className="text-md font-medium text-gray-900 mt-6 mb-2">
              {l.pages.forClients}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>{l.pages.freeCancellationClient}</li>
              <li>{l.pages.partialRefund}</li>
              <li>{l.pages.noRefund}</li>
            </ul>

            <h3 className="text-md font-medium text-gray-900 mt-6 mb-2">
              {l.pages.forRenters}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>{l.pages.freeCancellationRenter}</li>
              <li>{l.pages.penaltyCancellation}</li>
              <li>{l.pages.repeatedCancellations}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {l.pages.howToCancel}
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-base text-gray-500">
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
