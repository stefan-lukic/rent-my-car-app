import React from 'react';
import { signOut } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutButton() {
  return (
    <div
      className="flex flex-row items-center gap-2 cursor-pointer"
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
    >
      Log out
      <LogoutIcon />
    </div>
  );
}
