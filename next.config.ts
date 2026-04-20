import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.yoursite.com", "res.cloudinary.com", "ui-avatars.com"],
  },
};

export default nextConfig;
