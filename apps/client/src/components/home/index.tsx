import React, { useEffect, useState } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { MagicBorderButton } from "@/components/ui/button/home-magic-border-button";
import { CoolMode } from "@/components/ui/cool-mode";
import FanIcon from "@/assests/icon/fan";
import { useTheme } from "next-themes";

export function Home() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTheme = isMounted ? resolvedTheme : "system";

  const headingGradient =
    currentTheme === "light"
      ? "bg-gradient-to-b from-neutral-300 to-neutral-950"
      : "bg-gradient-to-b from-neutral-600 to-white";

  const paragraphTextColor =
    currentTheme === "light" ? "text-neutral-700" : "text-neutral-400";

  if (!isMounted)
    return <div className="min-h-screen bg-white dark:bg-black" />;

  return (
    <div
      className={`flex flex-col items-center ${currentTheme === "dark" ? "dark" : ""}`}
    >
      <BackgroundLines
        svgOptions={{ duration: 7 }}
        className="flex items-center justify-center w-full flex-col px-4"
      >
        <h2
          className={`bg-clip-text text-transparent text-center ${headingGradient} text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight`}
        >
          ManyFans!
          <br />
        </h2>
        <p
          className={`max-w-xl mx-auto text-sm md:text-lg ${paragraphTextColor} text-center`}
        >
          Many is better than one. Experience the thrill of exclusive content.
        </p>

        <CoolMode
          options={{
            particle: <FanIcon />,
            burstCount: 15,
            initialSize: 20,
            finalSize: 80,
            speedUp: 15,
            speedHorz: 5,
          }}
        >
          <div className="pt-5">
            <MagicBorderButton className="h-10 w-28 cursor-pointer">Turn on!</MagicBorderButton>
          </div>
        </CoolMode>
      </BackgroundLines>
    </div>
  );
}
