import { cn } from "@/app/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import React from "react";

interface CardRadioProps {
  value: string;
  label: string;
  Icon?: JSX.Element;
}
const CardRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    className?: string; // Optional className prop
    option: CardRadioProps;
    currentValue: string;
  }
>(({ className, option, currentValue, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "input-focus cursor-pointer rounded-lg border border-grey-300 p-3 hover:border-blue-500 w-full",
        currentValue == option.value
          ? "border border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100"
          : "bg-white",
        className
      )}
      aria-labelledby={`radio-${option.value}`}
      {...props}
    >
      <div className="flex flex-col items-start">
        <label
          id={`radio-${option.value}`}
          className="flex cursor-pointer flex-row items-center justify-items-center gap-3 text-sm font-medium text-primary-800"
        >
          {option.Icon}
          {option.label}
        </label>
      </div>
    </RadioGroupPrimitive.Item>
  );
});

CardRadioGroupItem.displayName = "CardRadioGroupItem";

export default CardRadioGroupItem;
