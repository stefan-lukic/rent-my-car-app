'use client';

import { sidebarLinks } from '@/helper/constants';
import Image from 'next/image';

const Sidebar = () => {
  return (
    <div className="items-start border-r border-border bg-surface-0 pt-10">
      <ul className="flex flex-col gap-2">
        {sidebarLinks.map((item, i) => (
          <a key={i} href={item.link}>
            <li className="flex-between mx-2 cursor-pointer gap-2 rounded-lg px-2 py-1 text-body transition-colors hover:bg-surface-muted hover:text-ink">
              {item.label}

              {item.icon && (
                <Image
                  src={item.icon}
                  height={24}
                  width={24}
                  alt="arrow"
                  className="invert"
                />
              )}
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
