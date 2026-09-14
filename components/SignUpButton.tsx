'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import l from '@/helper/en';
import { Button } from '@/components/UI/Button';

export default function SignUpButton() {
  const { data: session } = useSession();

  if (session) {
    return null;
  }

  return (
    <Button asChild size="lg">
      <Link href="/sign-up">{l.common.signUpNow}</Link>
    </Button>
  );
}
