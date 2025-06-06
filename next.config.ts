/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // ✅ evita errores en desarrollo
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
};

module.exports = withPWA(nextConfig);
