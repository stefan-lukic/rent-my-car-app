export default function CancellationOptions() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Cancellation Options
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Our Flexible Cancellation Policy
            </h2>
            <p className="text-base text-gray-500 mb-4">
              We understand that plans can change. That`s why we offer flexible
              cancellation options for both car owners and renters.
            </p>

            <h3 className="text-md font-medium text-gray-900 mt-6 mb-2">
              For Renters:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>
                Free cancellation up to 24 hours before the rental start time
              </li>
              <li>
                50% refund for cancellations made less than 24 hours before the
                rental start time
              </li>
              <li>No refund for cancellations after the rental has started</li>
            </ul>

            <h3 className="text-md font-medium text-gray-900 mt-6 mb-2">
              For Car Owners:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>
                Free cancellation up to 48 hours before the rental start time
              </li>
              <li>
                Cancellations made less than 48 hours before the rental start
                time may incur a penalty
              </li>
              <li>
                Repeated cancellations may affect your listing`s visibility
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              How to Cancel a Reservation
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-base text-gray-500">
              <li>Log in to your RentMyCar account</li>
              <li>Go to `My Reservations`` in your dashboard</li>
              <li>Find the reservation you want to cancel</li>
              <li>Click on `Cancel Reservation` and follow the prompts</li>
              <li>
                You`ll receive a confirmation email once the cancellation is
                processed
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
