"use client";

import { sidebarLinks } from "@/helper/constants";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="items-start bg-white border-r pt-10">
      <ul className="flex flex-col gap-2">
        {sidebarLinks.map((item, i) => (
          <a key={i} href={item.link}>
            <li className="flex-between gap-2 mr-2 ml-2 px-2 py-1 cursor-pointer hover:bg-gray-600 hover:rounded-md">
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
