import Link from 'next/link';

export default function About() {
  return (
    <main className="container mx-auto bg-gradient-to-b p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">About RentMyCar</h1>
      <p className="text-lg mb-4 text-gray-700">
        RentMyCar is a leading peer-to-peer car rental platform, connecting car
        owners with renters to create a seamless and affordable car rental
        experience.
      </p>
      <p className="text-lg mb-4 text-gray-700">
        Founded in 2024, our mission is to revolutionize the car rental industry
        by providing a secure, flexible, and cost-effective alternative to
        traditional rental companies.
      </p>
      <p className="text-lg mb-8 text-gray-700">
        We're committed to building a community of trust, where car owners can
        earn extra income and renters can find the perfect vehicle for their
        needs.
      </p>
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Back to Home
      </Link>
    </main>
  );
}
