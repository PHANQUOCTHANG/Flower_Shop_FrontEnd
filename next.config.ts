import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.yoursite.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "freepnglogo.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  // Proxy API qua Vercel để tránh lỗi Third-party cookies (Bị chặn bởi Safari/Chrome)
  async rewrites() {
    // URL Backend thực tế (Render) được lấy từ env
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000/api/v1";
    
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/:path*`, // Forward toàn bộ request /api/v1/... sang backend
      },
    ];
  },
};

export default nextConfig;
