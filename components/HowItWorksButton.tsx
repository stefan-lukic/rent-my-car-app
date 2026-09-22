'use client';

import { useState } from 'react';
import l from '@/helper/en';
import HowItWorksModal from '@/components/HowItWorksModal';

export default function HowItWorksButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Isolate modal state so the rest of the homepage stays server-rendered. */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-11 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-body transition-colors hover:border-brand-light hover:bg-brand-tint hover:text-brand-dark"
      >
        {l.navigation.howItWorksNav}
      </button>
      <HowItWorksModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
