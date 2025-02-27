import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol
        hostname: "images.pexels.com", // Allow this hostname
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
