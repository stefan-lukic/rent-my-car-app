import l from '@/helper/en';

export default function Safety() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {l.pages.safetyFirst}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {l.pages.safetyCommitment}
            </h2>
            <p className="text-base text-gray-500 mb-4">{l.pages.safetyDesc}</p>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>{l.pages.insurance}</li>
              <li>{l.pages.backgroundChecks}</li>
              <li>{l.pages.roadsideAssistance}</li>
              <li>{l.pages.securePayment}</li>
              <li>{l.pages.inAppMessaging}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {l.pages.safetyTips}
            </h3>
            <ul className="list-decimal pl-5 space-y-2 text-base text-gray-500">
              <li>{l.pages.meetPublic}</li>
              <li>{l.pages.inspectVehicle}</li>
              <li>{l.pages.keepCommunication}</li>
              <li>{l.pages.trustInstincts}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
