/**
 * Template generic — Framer-style design
 * Folosit pentru orice tip de business
 */

export async function generateGeneric(anthropicKey, { businessType, city, businessName, lang }) {
  const siteHtml = await generateWithClaude(anthropicKey, { businessType, city, businessName, lang });

  return {
    'index.html': siteHtml,
    'netlify.toml': generateNetlifyToml(),
    'README.md': `# ${businessName} — Demo Site\n\nGenerat automat de Site Factory Bot.`,
  };
}

export async function generateImprovedDesign(anthropicKey, { businessType, city, businessName, lang }) {
  const siteHtml = await generateWithClaude(anthropicKey, { businessType, city, businessName, lang, improved: true });

  return {
    'index.html': siteHtml,
    'netlify.toml': generateNetlifyToml(),
    'README.md': `# ${businessName} — Demo Site (v2)\n\nGenerat automat de Site Factory Bot.`,
  };
}

async function generateWithClaude(apiKey, { businessType, city, businessName, lang = 'de', improved = false }) {
  const improvedNote = improved
    ? `IMPORTANT: Foloseste un design COMPLET DIFERIT si mai modern fata de primul — alta paleta de culori, alt layout hero, alt stil de carduri.`
    : '';

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
        content: `Genereaza un site HTML complet si profesional in ${lang === 'de' ? 'germana' : lang === 'ro' ? 'romana' : 'engleza'} pentru:
Business: ${businessName} (${businessType})
Oras: ${city}
${improvedNote}

DESIGN REQUIREMENTS (Framer-style, premium quality):
- Font: Inter de la Google Fonts (weights 400, 500, 600, 700, 800)
- Design system: curat, modern, minimalist cu un accent color puternic
- Header: fixed, blur backdrop-filter, transparent to solid on scroll (JS simplu)
- Hero: min-height 100vh, gradient background sau imagine de fundal cu overlay dark
  Text hero: titlu mare (font-size: clamp(3rem, 8vw, 7rem)), subtitlu, 2 CTA buttons
- Sectiuni cu padding generos (120px sus/jos)
- Cards: border-radius 16px, box-shadow subtil, hover lift cu transition 0.3s
- Glassmorphism pentru carduri speciale: background rgba(255,255,255,0.1), backdrop-filter blur(10px)
- Animatii CSS: fade-in la scroll cu IntersectionObserver (JS simplu, 20 linii max)
- Gradient text pentru titluri importante: background-clip: text; -webkit-text-fill-color: transparent
- Butoane: padding 14px 32px, border-radius 50px (pill shape), cu hover scale(1.03)
- Footer dark cu links si social media icons (SVG inline)
- Complet responsive (mobile-first, breakpoint la 768px)

STRUCTURA (in ${lang === 'de' ? 'germana' : lang === 'ro' ? 'romana' : 'engleza'}):
1. Header cu nav
2. Hero cu gradient + CTA
3. Servicii (grid 3 coloane, min 4 servicii cu preturi)
4. Despre noi (cu statistici: nr clienti, ani experienta, rating)
5. Testimoniale (3 carduri glassmorphism)
6. Contact cu formular Netlify (data-netlify="true")
7. Footer

SEO:
- Schema.org LocalBusiness in JSON-LD
- Meta tags complete (title, description, og:*)
- Formular cu action="/danke.html"

Returneaza DOAR codul HTML complet (<!DOCTYPE html> ... </html>), fara explicatii, fara markdown.`,
      }],
    }),
  });

  if (!res.ok) return generateFallbackHtml(businessName, city);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  // Curata markdown daca Claude adauga ```html
  return text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim()
    || generateFallbackHtml(businessName, city);
}

function generateFallbackHtml(name, city) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>${name} – ${city}</title></head><body><h1>${name}</h1><p>${city}</p></body></html>`;
}

function generateNetlifyToml() {
  return `[build]
  publish = "."

[[redirects]]
  from = "/:slug"
  to = "/:slug.html"
  status = 301
`;
}
