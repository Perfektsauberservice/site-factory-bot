/**
 * Template generic — pentru orice tip de business
 * Folosit ca fallback cand nu exista template specific
 */

export async function generateGeneric(anthropicKey, { businessType, city, businessName, lang }) {
  // Foloseste Claude Sonnet pentru a genera un site personalizat
  const siteHtml = await generateWithClaude(anthropicKey, { businessType, city, businessName });

  return {
    'index.html': siteHtml,
    'netlify.toml': generateNetlifyToml(),
    'README.md': `# ${businessName} — Demo Site\n\nGenerat automat de Site Factory Bot.`,
  };
}

async function generateWithClaude(apiKey, { businessType, city, businessName }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Genereaza un site HTML complet si profesional in germana pentru:
Business: ${businessName} (${businessType})
Oras: ${city}

Cerinte:
- HTML complet (<!DOCTYPE html> ... </html>)
- CSS inline in <style> tag (design modern, profesional, dark + gold/color accent)
- Sectiuni: Hero, Servicii (minim 4), Despre noi, Contact cu formular Netlify, Footer
- Schema.org LocalBusiness in <script type="application/ld+json">
- Meta tags SEO complete
- Responsive (mobile-first)
- Formular cu data-netlify="true" si action="/danke.html"
- Design specific tipului de business (${businessType})

Returneaza DOAR codul HTML complet, fara explicatii.`
      }],
    }),
  });

  if (!res.ok) return '<html><body><h1>Eroare generare site</h1></body></html>';
  const data = await res.json();
  return data.content?.[0]?.text || '<html><body><h1>Eroare</h1></body></html>';
}

function generateNetlifyToml() {
  return `[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/:slug"
  to = "/:slug.html"
  status = 301
`;
}
