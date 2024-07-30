"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

interface LinkItemProps {
  href: string;
  text: string;
  Icon?: ReactElement;
  isEqual?: boolean;
}

const LinkItem = ({ href, text, Icon, isEqual = false }: LinkItemProps) => {
  const pathname = usePathname();
  const isActive = isEqual ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`input-focus flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-grey-600 transition-all ${
        isActive
          ? "bg-grey-100 text-grey-800 inset-shadow-transparent border border-grey-100"
          : "hover:bg-grey-100"
      }`}
    >
      {Icon && <span className="h-4 w-4">{Icon}</span>}
      {text}
    </Link>
  );
};

export default LinkItem;
