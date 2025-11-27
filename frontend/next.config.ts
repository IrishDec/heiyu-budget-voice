import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com;
              connect-src 'self' https://vercel.live https://bfayditefoslmyqoukun.supabase.co https://www.google-analytics.com https://region1.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://www.google-analytics.com;
              media-src 'self' blob:;
              frame-src https://www.googletagmanager.com;
            `.replace(/\s{2,}/g, " "), // clean whitespace
          },
        ],
      },
    ];
  },
};

export default nextConfig;




