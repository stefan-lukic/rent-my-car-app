import Link from 'next/link';

export default function HelpCenter() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-8">
              {[
                {
                  question: 'How do I list my car?',
                  answer:
                    "To list your car, log in to your account and click on 'List a Car' in your dashboard. Follow the prompts to add details about your vehicle.",
                },
                {
                  question: 'What if my car gets damaged?',
                  answer:
                    "All rentals include insurance coverage. If your car is damaged, report it immediately through our app or website, and we'll guide you through the claims process.",
                },
                {
                  question: 'How do I get paid?',
                  answer:
                    'Payments are processed automatically after each completed rental. Funds are typically deposited into your linked bank account within 3-5 business days.',
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
            Can't find what you're looking for?{' '}
            <Link
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
