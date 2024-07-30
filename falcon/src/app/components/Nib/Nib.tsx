import { cn } from "@/app/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const nibVariants = cva(
  "py-1 px-2 rounded-md text-xs font-medium cursor-default w-fit h-fit inset-shadow-transparent",
  {
    variants: {
      variant: {
        primary: "bg-blue-50 border border-blue-200 text-blue-700",
        green:
          "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-700",
        yellow: "bg-yellow-50 border border-yellow-200 text-yellow-700",
        red: "bg-red-50 border border-red-200 text-red-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface NibProps extends VariantProps<typeof nibVariants> {
  text: string;
  leadIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
}

export default function Nib({
  text,
  leadIcon,
  trailingIcon,
  variant,
}: NibProps) {
  const iconClass = "w-3 h-3";
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center truncate",
        nibVariants({ variant })
      )}
    >
      {leadIcon && React.cloneElement(leadIcon, { className: iconClass })}
      {text}
      {trailingIcon &&
        React.cloneElement(trailingIcon, { className: iconClass })}
    </div>
  );
}
