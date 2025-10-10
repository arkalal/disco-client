/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for bcryptjs in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },

  // Add image domains configuration
  images: {
    domains: [
      "clbrty-img.s3.amazonaws.com",
      "6f2859a7-8667-4b05-9978-a8922e29bf1f.selstorage.ru",
      "8cd4d13f-aa75-4a0c-abdb-0f388a983964.selstorage.ru", 
      "via.placeholder.com",
      "upload.wikimedia.org",
      "encrypted-tbn0.gstatic.com",
      "i.imgur.com",
      "placehold.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.selstorage.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "instagram.f*",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
