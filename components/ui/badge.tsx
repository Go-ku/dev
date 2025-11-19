import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantClasses: Record<string, string> = {
  info: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700"
};

export function Badge({ className, variant = "info", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variantClasses }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
