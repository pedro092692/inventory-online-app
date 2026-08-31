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
