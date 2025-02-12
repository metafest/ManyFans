// TODO: Fix Dark and Light Mode

"use client";

import { ShineBorder } from "@/components/magicui/shine-border";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  // const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by mounting after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default color while loading
  const borderColor = ["#A07C", "#FE85", "#FBB"];

  // const borderColor = mounted
  //   ? theme === "dark"
  //     ? "white"
  //     : "black"
  //   : "white";

  return (
    <ShineBorder className=" h-screen w-screen" color={borderColor}>
      <div className="px-5 py-5">{children}</div>
    </ShineBorder>
  );
}
