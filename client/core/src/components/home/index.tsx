import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { MagicBorderButton } from "@/components/ui/magic-border-button";
import { CoolMode } from "@/components/ui/cool-mode";
import FanIcon from "@/assests/icon/fan";

export function Home() {
  return (
    <div className="flex flex-col items-center dark">
      <BackgroundLines
        svgOptions={{ duration: 7 }}
        className="flex items-center justify-center w-full flex-col px-4"
      >
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          ManyFans!
          <br />
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-400 text-center">
          Many is better than one. Experience the thrill of exclusive content.
          {/* who know exactly what you desire. */}
        </p>

        <CoolMode
          options={{
            particle: <FanIcon />,
            burstCount: 20, // Number of fans to generate on click
            initialSize: 30, // Starting size of fans
            finalSize: 120, // Final size when falling
            speedUp: 25, // Initial upward speed
            speedHorz: 8, // Horizontal speed
          }}
        >
          <div className="pt-5">
            <MagicBorderButton className="h-10 w-28 ">
              <p className="text-base text-gray-300">Turn on!</p>
            </MagicBorderButton>
          </div>
        </CoolMode>
      </BackgroundLines>
    </div>
  );
}
