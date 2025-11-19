"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
