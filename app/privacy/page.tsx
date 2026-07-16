import l from '@/helper/en';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto bg-gradient-to-b p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{l.pages.privacyHeading}</h1>
      <p className="text-lg mb-4 text-gray-700">
        {l.pages.privacyDesc1}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        {l.pages.infoCollect}
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        {l.pages.privacyDesc2}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
        {l.pages.howWeUse}
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        {l.pages.privacyDesc3}
      </p>
      {/* Add more sections as needed */}
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        {l.common.backToHome}
      </Link>
    </main>
  );
}
