import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      // Debe ser mayor al límite de multer en el backend (5MB) para dejar
      // margen al overhead del multipart/form-data.
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig;
