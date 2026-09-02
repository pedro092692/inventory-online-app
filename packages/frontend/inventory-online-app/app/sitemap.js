// app/sitemap.js
// Lista de páginas públicas que quieres que Google indexe. Por ahora es solo
// la página principal (login/landing) — cuando agregues páginas públicas
// nuevas (ej. una landing de precios), agrégalas aquí como otro objeto.
export default function sitemap() {
  return [
    {
      url: 'https://app.nexa-stock.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
