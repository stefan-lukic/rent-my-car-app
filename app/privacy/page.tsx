import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto bg-gradient-to-b p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <p className="text-lg mb-4 text-gray-700">
        At RentMyCar, we are committed to protecting your privacy and ensuring
        the security of your personal information.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        1. Information We Collect
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        We collect information you provide directly to us, such as when you
        create an account, list a car, or make a reservation.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        2. How We Use Your Information
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        We use the information we collect to provide, maintain, and improve our
        services, as well as to communicate with you.
      </p>
      {/* Add more sections as needed */}
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Back to Home
      </Link>
    </main>
  );
}
