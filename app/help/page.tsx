import l from '@/helper/en';
import Link from 'next/link';

export default function HelpCenter() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{l.pages.helpCenterHeading}</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {l.pages.faqHeading}
            </h2>
            <dl className="space-y-8">
              {[
                {
                  question: l.pages.faqQ1,
                  answer: l.pages.faqA1,
                },
                {
                  question: l.pages.faqQ2,
                  answer: l.pages.faqA2,
                },
                {
                  question: l.pages.faqQ3,
                  answer: l.pages.faqA3,
                },
              ].map((faq, index) => (
                <div key={index}>
                  <dt className="text-base font-semibold text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-500">
            {l.pages.cantFind}
            <Link
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {l.pages.contactSupport}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
