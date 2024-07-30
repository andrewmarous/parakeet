import { cn } from "@/app/utils";
import React from "react";

// Define the props interface
interface IconBubbleProps {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size: "sm" | "md" | "lg";
}

// IconBubble component
export default function IconBubble({ Icon, size }: IconBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border bg-gradient-to-b from-grey-100 to-grey-200 inset-shadow-transparent",
        "border-grey-200",
        size === "sm" && "h-10 w-10",
        size === "md" && "h-11 w-11",
        size === "lg" && "h-16 w-16"
      )}
    >
      <Icon
        className={cn(
          size === "sm" && "h-[12px] w-[12px] fill-grey-700",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-8 w-8 fill-grey-600"
        )}
      />
    </div>
  );
}
