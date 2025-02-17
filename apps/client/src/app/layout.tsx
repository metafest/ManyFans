import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@/components/theme";
import { PostHogProvider } from "@/components/posthog/providers";
import TanstackProvider from "@/components/TanStackQuery/provider";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Many Fans",
  description: "Many Fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <head />
        <body>
          <ClerkProvider>
            <TanstackProvider>
              <PostHogProvider>
                <ThemeProvider attribute="class" defaultTheme="system">
                  <SignedOut>
                    <div className="h-[100vh] flex justify-center items-center">
                      <SignIn routing="hash" />
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <header className="flex justify-between z-50 absolute top-5 right-5">
                      <UserButton showName/>
                    </header>
                    {children}
                  </SignedIn>
                  <Theme />
                </ThemeProvider>
              </PostHogProvider>
            </TanstackProvider>
            <SpeedInsights />
          </ClerkProvider>
        </body>
      </html>
    </>
  );
}
