import "./globals.css";

import { User } from "@prisma/client";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { extractRouterConfig } from "uploadthing/server";

import { auth } from "@/auth";

import { ourFileRouter } from "./api/uploadthing/core";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: process.env.SITE_NAME,
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const { user } = (session as unknown as { user: User }) || {};

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${sans.variable}`} suppressHydrationWarning>
        <SessionProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
