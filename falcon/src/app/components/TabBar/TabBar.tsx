"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

interface TabBarProps {
  actionButton?: JSX.Element;
  items: {
    Icon?: ReactElement;
    route: string;
    label: string;
  }[];
  className?: string;
  basePath: string;
  onTabChange?: (label: string) => void;
}

export default function TabBar({
  actionButton,
  items,
  className,
  basePath,
  onTabChange,
}: TabBarProps) {
  const pathname = usePathname();
  const { push } = useRouter();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const route = items[selected].route;
    push(basePath + route);
    if (onTabChange) {
      onTabChange(items[selected].label); 
    }
  }, [basePath, items, push, selected, onTabChange]);

  const isSelected = (index: number) => selected === index;

  return (
    <div
      className={`relative flex w-full flex-row items-end justify-between border-b border-b-grey-300 ${className}`}
    >
      <div className="fit flex flex-row justify-between gap-7">
        {items.map((item, index) => (
          <div
            key={index}
            className={`${
              isSelected(index) ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <button
              value={item.label}
              className={`${
                isSelected(index) ? "text-grey-900" : "text-grey-600"
              } flex items-center justify-center gap-2 rounded-md p-2 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-grey-100`}
              onClick={() => setSelected(index)}
            >
              {item.Icon && <div className="h-4 w-4">{item.Icon}</div>}
              {item.label}
            </button>
          </div>
        ))}
      </div>
      <div className="pb-3">{actionButton && actionButton}</div>
    </div>
  );
}
