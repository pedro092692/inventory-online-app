import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained .next/standalone build (server + only the node_modules it
  // actually needs) instead of requiring the full node_modules tree at runtime — this is
  // what keeps the production Docker image small. See Dockerfile.
  output: 'standalone',
  experimental: {
    authInterrupts: true,
    serverActions: {
      // Debe ser mayor al límite de multer en el backend (5MB) para dejar
      // margen al overhead del multipart/form-data.
      bodySizeLimit: '6mb',
    },
  },
  async redirects() {
    return [
      {
        // /store/reports no tiene contenido propio, es un alias del reporte
        // de ventas. Resolverlo aquí evita compilar/renderizar la página
        // (app/(store)/store/reports/page.jsx) solo para redirigir, y no
        // depende del cache de navegación del router como sí ocurre con un
        // redirect() dentro de un Server Component.
        source: '/store/reports',
        destination: '/store/reports/sales',
        permanent: false,
      },
    ]
  },
}

export default nextConfig;
