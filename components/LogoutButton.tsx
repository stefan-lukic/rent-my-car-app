'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';
import l from '@/helper/en';

export default function LogoutButton() {
  return (
    <div
      className="flex flex-row items-center gap-1 cursor-pointer"
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
    >
      {l.common.logOut}
      <LogoutIcon />
    </div>
  );
}
