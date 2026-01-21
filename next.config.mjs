/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Turbopack config (Next.js 16+)
  turbopack: {
    // Empty config to silence warning - Turbopack is enabled by default in Next.js 16
  },
};

export default nextConfig;
