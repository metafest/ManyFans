import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@/components/theme";
import { PostHogProvider } from "@/components/posthog/providers";
import TanstackProvider from "@/components/TanStackQuery/provider";

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
          <TanstackProvider>
          <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme="system">
              {children}
              <Theme />
            </ThemeProvider>
          </PostHogProvider>
          </TanstackProvider>
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}
