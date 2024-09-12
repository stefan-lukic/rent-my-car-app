'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SignUpButton() {
  const { data: session } = useSession();

  if (session) {
    return null;
  }

  return (
    <Link
      href="/sign-up"
      className="inline-block bg-blue-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      Sign Up Now
    </Link>
  );
}
