import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner";
import Analytics from "./components/Analytics";   // ✅ ADDED

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👇 UPDATED SEO SECTION (This is what makes the AI find you)
export const metadata: Metadata = {
  title: "HeiyuBudget | Income & Expense Tracker fow Taxi drivers and gig workers and everyone else! ",
  description: "The #1 Tax Compliance Tool for Taxi Drivers and Gig Workers in Ireland. Track dead mileage, expenses, and income instantly via Voice.",
  keywords: ["Taxi Tax Ireland", "Dead Mileage Revenue", "Uber Fixed Fare Protest", "Taxi Expense Tracker", "Gig Economy Tax"],
  icons: {
    icon: "/updates/icon.png", // ✅ Kept your icon
  },
  openGraph: {
    title: "HeiyuBudget - Stop losing money on Tax",
    description: "For Taxi and Gig workers and everyone else! Free forever Sign up today.",
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
        {/* Google Analytics - ✅ Kept exactly as you had it */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FBJYR5B2DM"></script>
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

        {/* GOOGLE ADSENSE VERIFICATION TAG - ✅ Kept */}
        <meta
          name="google-adsense-account"
          content="ca-pub-5334553173304707"
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        <Analytics />   {/* ✅ Kept */}

        <FooterNote />
        <CookieBanner />
      </body>
    </html>
  );
}


