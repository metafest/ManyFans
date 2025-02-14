"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const MagicBorderButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { theme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use resolvedTheme only after the component has mounted
  const currentTheme = isMounted ? resolvedTheme : 'system';

  const bgColor = currentTheme === "light" ? "bg-white" : "bg-slate-950";
  const textColor = currentTheme === "light" ? "text-slate-900" : "text-white";

  if (!isMounted) return <div className="min-h-10 bg-white dark:bg-black" />;

  return (
    <button
      {...props}
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[2.5px]  focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className,
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full px-2 py-1 text-sm font-medium backdrop-blur-3xl",
          bgColor,
          textColor,
        )}
      >
        {children}
      </span>
    </button>
  );
};