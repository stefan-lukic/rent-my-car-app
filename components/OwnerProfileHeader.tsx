'use client';

import { useState } from 'react';
import Header from './UI/Header';
import HowItWorksModal from './HowItWorksModal';

export default function OwnerProfileHeader() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <>
      <Header onHowItWorksClick={() => setIsHowItWorksOpen(true)} />
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </>
  );
}
