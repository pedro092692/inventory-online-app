import localFont from 'next/font/local';
import './globals.css';

const sfui = localFont({
  src: [
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-ultralight-58646b19bf205.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-ultralight-58646b19bf205.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-light-58646b33e0551.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-medium-58646be638f96.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-semibold-58646eddcae92.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-bold-58646a511e3d9.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-heavy-586470160b9e5.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-ui-display/sf-ui-display-black-58646a6b80d5a.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--sfui-font",
  display: "swap",
});

// metadataBase resuelve las URLs relativas de abajo (como la imagen de openGraph) a
// absolutas — Next.js las necesita completas cuando arma la tarjeta de vista previa.
export const metadata = {
  metadataBase: new URL("https://app.nexa-stock.com"),
  title: {
    default: "Nexastock — Gestión de Inventarios Simplificada",
    // permite que páginas específicas hagan metadata.title = "Facturas" y salga
    // "Facturas | Nexastock" en la pestaña, sin tener que repetir "Nexastock" en cada una.
    template: "%s | Nexastock",
  },
  description:
    "Nexastock es un sistema de gestión de inventario, ventas y facturación con reportes avanzados y envío de facturas por WhatsApp. Ideal para negocios en Venezuela y Latinoamérica.",
  keywords: [
    "inventario",
    "gestión de inventario",
    "facturación",
    "punto de venta",
    "software para negocios",
    "Venezuela",
  ],
  // Open Graph: lo que arma la tarjeta de vista previa al pegar el link en WhatsApp,
  // Slack, Facebook, LinkedIn, etc.
  openGraph: {
    title: "Nexastock — Gestión de Inventarios Simplificada",
    description: "Controla tu inventario, factura y vende desde un solo lugar.",
    url: "https://app.nexa-stock.com",
    siteName: "Nexastock",
    // TODO: /icon.png es cuadrado (512x512) — sirve como imagen temporal, pero una
    // imagen 1200x630 (horizontal) se ve mucho mejor en la mayoría de vistas previas.
    // Cuando tengas una, cámbiala aquí.
    images: [{ url: "/img/home/hero_img_105.png", width: 512, height: 512, alt: "Nexastock" }],
    locale: "es_VE",
    type: "website",
  },
  // Igual que Open Graph pero específico para X/Twitter — usa las mismas imágenes.
  twitter: {
    card: "summary",
    title: "Nexastock — Gestión de Inventarios Simplificada",
    description: "Controla tu inventario, factura y vende desde un solo lugar.",
    images: ["/img/home/hero_img_105.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={sfui.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}

