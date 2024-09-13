import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="container mx-auto bg-gradient-to-b p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Terms of Service
      </h1>
      <p className="text-lg mb-4 text-gray-700">
        Welcome to RentMyCar. By using our services, you agree to comply with
        and be bound by the following terms and conditions.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        1. Acceptance of Terms
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        By accessing or using RentMyCar, you agree to these Terms of Service and
        our Privacy Policy.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        2. User Responsibilities
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        Users are responsible for maintaining the confidentiality of their
        accounts and for all activities that occur under their accounts.
      </p>
      {/* Add more sections as needed */}
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Back to Home
      </Link>
    </main>
  );
}
