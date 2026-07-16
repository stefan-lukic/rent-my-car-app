import l from '@/helper/en';
import Link from 'next/link';

export default function About() {
  return (
    <main className="container mx-auto bg-gradient-to-b p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{l.pages.aboutHeading}</h1>
      <p className="text-lg mb-4 text-gray-700">
        {l.pages.aboutDesc1}
      </p>
      <p className="text-lg mb-4 text-gray-700">
        {l.pages.aboutDesc2}
      </p>
      <p className="text-lg mb-8 text-gray-700">
        {l.pages.aboutDesc3}
      </p>
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        {l.common.backToHome}
      </Link>
    </main>
  );
}
