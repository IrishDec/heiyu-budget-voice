import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNote from "./components/FooterNote";
import CookieBanner from "./components/CookieBanner";

// 🔥 ADD THESE
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageview } from "./ga";

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

  // 🔥 ADD THIS
  const pathname = usePathname();

  // 🔥 ADD THIS
  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4FG0YF84Q9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4FG0YF84Q9', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

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



