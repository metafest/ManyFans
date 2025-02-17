// TODO: Fix Dark and Light Mode

"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    // <ShineBorder className="h-screen w-screen" color={borderColor}>
    // <section className="h-full w-full px-5 py-5">{children}</section>
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      <div>{children}</div>
    </SidebarInset>
  </SidebarProvider>
   
    // </ShineBorder>
  );
}
