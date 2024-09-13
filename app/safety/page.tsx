export default function Safety() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Safety First</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Our Commitment to Your Safety
            </h2>
            <p className="text-base text-gray-500 mb-4">
              At RentMyCar, your safety is our top priority. We've implemented
              several measures to ensure a secure experience for both car owners
              and renters.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-500">
              <li>Comprehensive insurance coverage for every rental</li>
              <li>Thorough background checks on all users</li>
              <li>24/7 roadside assistance</li>
              <li>Secure payment processing</li>
              <li>In-app messaging for safe communication</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Safety Tips
            </h3>
            <ul className="list-decimal pl-5 space-y-2 text-base text-gray-500">
              <li>Always meet in a public place for car handovers</li>
              <li>
                Thoroughly inspect the vehicle before and after each rental
              </li>
              <li>Keep all communication within our platform</li>
              <li>
                Trust your instincts - if something feels off, contact our
                support team
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
