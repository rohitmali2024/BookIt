

import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../app/providers"; // 

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookIt - Experience & Slots Booking",
  description: "Book amazing travel experiences and adventures",
  icons: {
    icon: "/HDlogo.png", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
