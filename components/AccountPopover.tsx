'use client';

import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { accountDropDownList } from '@/helper/constants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';

const AccountPopover = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Popover open={open} modal onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Image
          src="/icons/apple.svg"
          height={24}
          width={24}
          alt="user"
          className="cursor-pointer"
        />
      </PopoverTrigger>

      <PopoverContent
        className=" w-60 bg-white text-black px-4 py-4 rounded-md border-none space-y-1 font-poppins"
        align="end"
      >
        {accountDropDownList.map((item, i) =>
          item.label === 'Logout' ? (
            <button
              key={i}
              className="flex items-center text-sm font-normal gap-3 w-full hover:bg-[var(--secondary)] p-2 rounded-md"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              <Image
                src={item.icon}
                width={22}
                height={22}
                alt="user"
                className="h-6 object-cover filter invert "
              />
              {item.label}
            </button>
          ) : (
            <button
              key={i}
              className="flex items-center text-sm font-normal gap-3 w-full hover:bg-[var(--secondary)] p-2 rounded-md"
              onClick={() => {
                setOpen((prev) => !prev);
                router.push(item.route);
              }}
            >
              <Image
                src={item.icon}
                width={22}
                height={22}
                alt="user"
                className={`${item.icon == '/icons/user.svg' && 'h-7'} ${
                  item.icon == '/icons/logout.svg' && 'h-6'
                } object-cover filter invert`}
              />
              {item.label}
            </button>
          )
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;
