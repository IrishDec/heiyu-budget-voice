import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // 👇 Added your Supabase URL here so the browser allows the login request
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://vercel.live https://bfayditefoslmyqoukun.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;



