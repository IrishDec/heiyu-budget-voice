import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner"; // 👈 IMPORT THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heiyu Taxi",
  description: "Fast voice or text budgeting app for taxi drivers",
   icons: {
    icon: "/updates/icon.png",
 },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <FooterNote />
        <CookieBanner /> {/* 👈 ADD THIS HERE */}
      </body>
    </html>
  );
}

