'use client';

import React from 'react';

//da li steps staviti u neki utils, helper ili constants fajl ili ostaviti ovde?
const steps = [
  {
    number: '1',
    title: 'Browse & Match',
    description:
      'Discover a curated network of reliable, privately-owned local cars. Filter by make, body style, price, or hybrid/electric engine types to match your exact itinerary style.',
    icon: (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    iconBg: 'bg-blue-50',
  },
  {
    number: '2',
    title: 'Reserve Instantly',
    description:
      'Pick your departure and return schedule. Review fully transparent day-rates, and confirm your holding reservation. The local car host will authorize approval instantly.',
    icon: (
      <svg
        className="w-5 h-5 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    iconBg: 'bg-amber-50',
  },
  {
    number: '3',
    title: 'Smart Handover',
    description:
      'Arrange personal pickup or convenient curbside handling at designated city transfer points in Belgrade, Novi Sad, or local suburbs. Enjoy quick ID check & digital key sign-off.',
    icon: (
      <svg
        className="w-5 h-5 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
    iconBg: 'bg-emerald-50',
  },
  {
    number: '4',
    title: 'Embark Safely',
    description:
      'Travel with comprehensive coverage, full mechanical verification, and active 24/7 client relations assistance. Return easily with a complete fuel status and share a host review.',
    icon: (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    iconBg: 'bg-blue-50',
  },
];

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">
              How RentMyCar Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-4 space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">
                  {step.number}. {step.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Got It, Let&apos;s Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
