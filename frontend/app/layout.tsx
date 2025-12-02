import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner";
import Analytics from "./components/Analytics";
import ClientWrapper from "../app/ClientWrapper";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* All pages */}
        {children}

        {/* GA */}
        <Analytics />

        {/* ↓ modal + contact button handled here */}
        <ClientWrapper />

        <FooterNote />
        <CookieBanner />
      </body>
    </html>
  );
}



