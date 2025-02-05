import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { MagicBorderButton } from "@/components/ui/magic-border-button";

export function Home() {
  return (
    <div className="flex flex-col items-center ">
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          ManyFans, <br /> is better than OnlyFans.
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          Experience the thrill of exclusive content. who know exactly what you
          desire.
          <br />
          Turn on! (I mean the fans)
        </p>
        <div className="pt-5">
          <MagicBorderButton className="h-10 w-28 ">
            Get Started
          </MagicBorderButton>
        </div>
      </BackgroundLines>
    </div>
  );
}
