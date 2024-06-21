/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    scrollRestoration: false,
  },
};

export default nextConfig;
