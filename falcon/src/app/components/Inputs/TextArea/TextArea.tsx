"use client";

import React from "react";
import { cn } from "../../../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[36px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm overflow-hidden focus:border focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-50/50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
TextArea.displayName = "Textarea";

export { TextArea };
