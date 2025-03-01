import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi tambahan bisa ditambahkan di sini
  reactStrictMode: true,

  // Contoh konfigurasi lain yang mungkin diperlukan:
  images: {
    domains: ['example.com'], // Jika perlu load gambar dari domain eksternal
  },

  env: {
    // Environment variables yang perlu diexpose ke client
    APP_URL: process.env.APP_URL,
  },

  // Untuk mengaktifkan fitur experimental
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
