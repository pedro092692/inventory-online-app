// app/robots.js
// Le dice a los buscadores (Google, Bing, etc.) qué pueden rastrear e indexar.
// La ruta /store/ es el panel interno (requiere login) — no tiene sentido que
// aparezca en resultados de búsqueda, así que la excluimos.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/store/'],
    },
    sitemap: 'https://app.nexa-stock.com/sitemap.xml',
  };
}
