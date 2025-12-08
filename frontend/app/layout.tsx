import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner";
import Analytics from "./components/Analytics";

// Replace Geist with Inter (stable + supported)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans", // keeps your existing CSS variable
});

export const metadata: Metadata = {
  title: "HeiyuBudget | Income & Expense Tracker for Taxi drivers and gig workers",
  description:
    "The #1 Tax Compliance Tool for Taxi Drivers and Gig Workers in Ireland.",
  icons: {
    icon: "/updates/icon.png",
  },
  openGraph: {
    title: "HeiyuBudget - Stop losing money on Tax",
    description: "For Taxi and Gig workers and everyone else!",
    url: "https://heiyubudget.com",
    siteName: "HeiyuBudget",
    locale: "en_IE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FBJYR5B2DM"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FBJYR5B2DM');
            `,
          }}
        />

        <meta
          name="google-adsense-account"
          content="ca-pub-5334553173304707"
        />
      </head>

      {/* FIXED: Inter replaces Geist */}
      <body className={`${inter.variable} antialiased`}>
        {children}

        <Analytics />
        <FooterNote />
        <CookieBanner />
      </body>
    </html>
  );
}




