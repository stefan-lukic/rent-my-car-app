import React from 'react';
import l from '@/helper/en';
import { Dialog } from '@/components/UI/Dialog';

const steps = [
  {
    number: '1',
    title: l.howItWorks.browseMatch,
    description: l.howItWorks.browseDesc,
    icon: (
      <svg
        className="w-5 h-5 text-brand"
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
    iconBg: 'bg-brand-tint',
  },
  {
    number: '2',
    title: l.howItWorks.reserveInstantly,
    description: l.howItWorks.reserveDesc,
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
    title: l.howItWorks.smartHandover,
    description: l.howItWorks.handoverDesc,
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
    title: l.howItWorks.embarkSafely,
    description: l.howItWorks.embarkDesc,
    icon: (
      <svg
        className="w-5 h-5 text-brand"
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
    iconBg: 'bg-brand-tint',
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
    <Dialog
      onClose={onClose}
      ariaLabelledBy="how-it-works-title"
      closeOnBackdrop
      overlayClassName="z-[100] bg-ink/60 p-4 backdrop-blur-sm"
      panelClassName="w-full max-w-lg rounded-2xl border border-border bg-white shadow-xl"
    >
      {/* Shared dialog behavior keeps every entry point keyboard-accessible. */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-body-faint"
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
          <h2
            id="how-it-works-title"
            className="font-heading text-lg font-bold text-ink"
          >
            {l.howItWorks.modalTitle}
          </h2>
        </div>

        <button
          type="button"
          aria-label={l.common.close}
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-body-faint transition-colors hover:bg-surface-muted hover:text-body-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {l.common.close}
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
              <p className="mb-0.5 font-heading text-sm font-semibold text-ink">
                {step.number}. {step.title}
              </p>
              <p className="text-sm leading-relaxed text-body-subtle">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 pt-2">
        <button
          onClick={onClose}
          className="min-h-11 w-full rounded-xl bg-ink-secondary py-3 font-semibold text-white transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {l.howItWorks.gotIt}
        </button>
      </div>
    </Dialog>
  );
};

export default HowItWorksModal;
