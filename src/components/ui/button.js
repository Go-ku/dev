"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

const variantStyles = {
  default: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-brand-200 text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-200",
  ghost: "text-brand-700 hover:bg-brand-50"
};

export const Button = forwardRef(function Button(
  { className, variant = "default", size = "md", ...props },
  ref
) {
  const resolvedVariant = variantStyles[variant] ?? variantStyles.default;
  const resolvedSize = sizeStyles[size] ?? sizeStyles.md;
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        resolvedSize,
        resolvedVariant,
        className
      )}
      {...props}
    />
  );
});
