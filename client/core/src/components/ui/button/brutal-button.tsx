"use client";
import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const BrutalButton = ({
  children,
  className,
  ...props
}: BrutalButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "px-8 py-0.5  border-2 border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] ",
        className
      )}
    >
      {children}
    </button>
  );
};
