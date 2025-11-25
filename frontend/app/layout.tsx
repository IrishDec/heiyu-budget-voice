import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heiyu Budget",
  description: "Fast voice or text budgeting app.",
  icons: {
    icon: "/updates/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GOOGLE ADSENSE VERIFICATION TAG */}
        <meta
          name="google-adsense-account"
          content="ca-pub-5334553173304707"
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <FooterNote />
        <CookieBanner />
      </body>
    </html>
  );
}


