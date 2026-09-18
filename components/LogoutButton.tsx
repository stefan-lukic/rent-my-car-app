'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';
import l from '@/helper/en';

export default function LogoutButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-body-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
    >
      {l.common.logOut}
      <LogoutIcon />
    </button>
  );
}
