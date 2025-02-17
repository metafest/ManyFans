"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/components/TanStackQuery/provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      {/* // ! Temp Show the page */}
      {/* <SignedOut>
        <div className="h-[100vh] flex justify-center items-center">
          <SignIn routing="hash" />
        </div>
      </SignedOut> */}

      <TanstackProvider>
        {/* <SignedIn> */}
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
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
        {/* </SignedIn> */}
      </TanstackProvider>
    </ClerkProvider>
  );
}
