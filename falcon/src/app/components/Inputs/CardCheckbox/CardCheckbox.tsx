import { cn } from "@/app/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React from "react";

const CardCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    className?: string; // Optional className prop
    label: string;
    Icon?: JSX.Element;
    checked: boolean;
  }
>(({ className, label, Icon, checked, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "input-focus cursor-pointer rounded-lg border border-grey-300 px-3 py-2 hover:border hover:border-blue-500 w-full",
        checked
          ? "border border-blue-400 bg-gradient-to-br from-blue-50 to-blue-200 inset-shadow-transparent text-blue-700"
          : "bg-white",
        className
      )}
      aria-labelledby={`check-${label}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      ></CheckboxPrimitive.Indicator>
      <div className="flex flex-col items-start">
        <label
          id={`check-${label}`}
          className="flex cursor-pointer flex-row items-center justify-items-center gap-2 text-sm font-medium text-primary-800"
        >
          {Icon}
          {label}
        </label>
      </div>
    </CheckboxPrimitive.Root>
  );
});

CardCheckbox.displayName = "CardCheckbox";

export default CardCheckbox;
