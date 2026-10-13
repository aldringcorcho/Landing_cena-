import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF pesa bastante menos que WebP con la misma calidad; el navegador que no lo admita recibe WebP
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
