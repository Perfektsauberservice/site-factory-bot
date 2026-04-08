/**
 * Template generic — Framer-style, design unic per tip de business
 */

export async function generateGeneric(anthropicKey, { businessType, city, businessName, lang }) {
  const siteHtml = await generateWithClaude(anthropicKey, { businessType, city, businessName, lang });
  return {
    'index.html': siteHtml,
    'netlify.toml': generateNetlifyToml(),
    'README.md': `# ${businessName} — Demo Site\n\nGenerat automat de Site Factory Bot.`,
  };
}

// ─── Paleta de culori per tip de business ────────────────────────────────────

const BUSINESS_THEMES = {
  // Frumusete & ingrijire
  barbershop:    { palette: '#1a1a2e, #16213e, accent #c9a84c (auriu mat)',    mood: 'premium, masculin, clasic modern' },
  hair_salon:    { palette: '#2d1b4e, #1a0a3c, accent #e91e8c (roz vibrant)', mood: 'elegant, feminin, luxos' },
  beauty_salon:  { palette: '#1c1218, #2d1b26, accent #ff6b9d (roz coral)',   mood: 'sofisticat, luxos, feminin' },
  nail_salon:    { palette: '#f8f0ff, #fff5fb, accent #c084fc (violet)',       mood: 'pastel, girly, luminos' },
  spa:           { palette: '#1a2a2a, #0d1f1f, accent #4db89e (verde teal)',   mood: 'calm, zen, natural' },
  massage:       { palette: '#1e1a2e, #12102a, accent #a78bfa (lavanda)',      mood: 'relaxant, calm, premium' },
  tattoo:        { palette: '#0a0a0a, #111111, accent #e63946 (rosu)',         mood: 'dark, edgy, artistic' },

  // Food & Drink
  restaurant:    { palette: '#1a0a00, #2d1200, accent #f59e0b (amber)',        mood: 'cald, gastronomic, apetisant' },
  cafe:          { palette: '#1e1208, #2a1a0a, accent #d97706 (cafeniu)',      mood: 'cozy, warm, artisan' },
  bistro:        { palette: '#1a1a1a, #222222, accent #84cc16 (verde lime)',   mood: 'urban, modern, fresh' },
  pizzeria:      { palette: '#1a0500, #2a0800, accent #ef4444 (rosu italian)', mood: 'italian, traditional, vivid' },
  bakery:        { palette: '#fef3c7, #fffbeb, accent #92400e (maro)',         mood: 'luminos, artisan, cald' },
  bar:           { palette: '#0f0a1e, #1a1035, accent #7c3aed (violet)',       mood: 'night, premium, misterios' },

  // Sanatate
  dental_clinic: { palette: '#f0f9ff, #e0f2fe, accent #0284c7 (albastru)',    mood: 'curat, profesional, de incredere' },
  medical:       { palette: '#f8fafc, #f1f5f9, accent #0f766e (teal)',        mood: 'curat, calm, profesional' },
  psychology:    { palette: '#1e1b4b, #1e1035, accent #818cf8 (indigo)',      mood: 'calm, empatic, sigur' },
  physiotherapy: { palette: '#f0fdf4, #dcfce7, accent #16a34a (verde)',       mood: 'activ, sanatos, pozitiv' },
  pharmacy:      { palette: '#eff6ff, #dbeafe, accent #1d4ed8 (albastru)',    mood: 'curat, medical, de incredere' },

  // Auto
  auto_repair:   { palette: '#0f172a, #1e293b, accent #f97316 (portocaliu)', mood: 'industrial, puternic, profesional' },
  car_wash:      { palette: '#0c4a6e, #075985, accent #38bdf8 (albastru ice)', mood: 'curat, modern, fresh' },
  car_detailing: { palette: '#111827, #1f2937, accent #fbbf24 (galben)',      mood: 'premium, lux, performance' },

  // Imobiliare & constructii
  real_estate:   { palette: '#0f172a, #1e293b, accent #3b82f6 (albastru)',   mood: 'profesional, de incredere, modern' },
  construction:  { palette: '#1c1917, #292524, accent #f59e0b (galben)',     mood: 'solid, industrial, puternic' },
  renovation:    { palette: '#1a1a1a, #2a2a2a, accent #22d3ee (cyan)',       mood: 'modern, precis, curat' },

  // Profesionisti
  lawyer:        { palette: '#1a1a2e, #16213e, accent #c9a84c (auriu)',      mood: 'serios, autoritar, de incredere' },
  accountant:    { palette: '#0f172a, #1e293b, accent #10b981 (verde)',      mood: 'precis, de incredere, profesional' },
  marketing:     { palette: '#18181b, #27272a, accent #a855f7 (purple)',     mood: 'creativ, dinamic, modern' },

  // Sport & Educatie
  fitness_gym:   { palette: '#0a0a0a, #111111, accent #ef4444 (rosu)',       mood: 'energic, puternic, motivational' },
  yoga:          { palette: '#1a1a2e, #0d0d1a, accent #a78bfa (lavanda)',    mood: 'calm, spiritual, echilibrat' },
  dance:         { palette: '#1a0a2e, #2d0a4e, accent #ec4899 (roz)',        mood: 'dinamic, creativ, expresiv' },
  tutoring:      { palette: '#eff6ff, #dbeafe, accent #1d4ed8 (albastru)',   mood: 'prietenos, inteligent, clar' },
  kindergarten:  { palette: '#fefce8, #fef9c3, accent #f59e0b (galben)',     mood: 'vesel, colorat, prietenos' },

  // Altele
  hotel:         { palette: '#1a0a00, #2d1a08, accent #d97706 (auriu)',      mood: 'lux, ospitalier, confortabil' },
  guesthouse:    { palette: '#f9f5f0, #f3ede6, accent #78716c (maro)',       mood: 'cald, acasa, traditional' },
  florist:       { palette: '#0f2d1a, #122a1a, accent #86efac (verde)',      mood: 'natural, fresh, romantic' },
  cleaning:      { palette: '#eff6ff, #dbeafe, accent #0ea5e9 (albastru)',   mood: 'curat, fresh, de incredere' },
  catering:      { palette: '#1a0a00, #2d1200, accent #f59e0b (auriu)',      mood: 'gastronomic, elegant, festiv' },
  pet_shop:      { palette: '#fef9c3, #fefce8, accent #f97316 (portocaliu)', mood: 'prietenos, vesel, iubitor' },
};

// ─── Generator principal ──────────────────────────────────────────────────────

async function generateWithClaude(apiKey, { businessType, city, businessName, lang = 'de' }) {
  const theme = BUSINESS_THEMES[businessType] || {
    palette: '#0f172a, #1e293b, accent #6366f1 (indigo)',
    mood: 'modern, profesional, curat',
  };

  const langName = lang === 'de' ? 'germana' : lang === 'ro' ? 'romana' : 'engleza';

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
        content: `Genereaza un site HTML complet in ${langName} pentru:
Business: ${businessName} (${businessType})
Oras: ${city}

PALETA DE CULORI: ${theme.palette}
MOOD / ATMOSFERA: ${theme.mood}

DESIGN FRAMER-STYLE (respecta strict):
- Font: Inter de la Google Fonts (300, 400, 500, 600, 700, 800)
- Culori: foloseste EXACT paleta specificata mai sus
- Header: position fixed, backdrop-filter blur(20px), border-bottom 1px solid rgba(255,255,255,0.08)
- Hero: min-height 100vh, background gradient cu culorile principale, text centrat
  Titlu: font-size clamp(3.5rem,8vw,7rem), font-weight 800, line-height 1.05
  Subtitlu: font-size 1.2rem, opacity 0.7, max-width 560px margin auto
  2 butoane: primar solid accent color, secundar outline
- Animatii: FARA IntersectionObserver si FARA opacity:0 initial pe elemente. Foloseste DOAR CSS @keyframes cu animation pe sectiuni/carduri. Toate elementele TREBUIE sa fie vizibile imediat la incarcare.
- Cards servicii: background rgba(255,255,255,0.04), border 1px solid rgba(255,255,255,0.08), border-radius 20px, hover: translateY(-6px) + border-color accent
- Sectiunea statistici: 3-4 numere mari cu label (clienti, ani, rating etc.)
- Testimoniale: 3 carduri glassmorphism
- Formular contact cu data-netlify="true", campuri: Nume, Email, Telefon, Mesaj
- Footer: dark, cu links si copyright
- COMPLET RESPONSIVE (breakpoint 768px, hamburger menu pe mobile)

STRUCTURA IN ${langName.toUpperCase()}:
1. Header + nav
2. Hero cu gradient + statistici
3. Servicii (grid, min 4 cu preturi realiste in EUR)
4. Despre noi
5. Testimoniale
6. Contact + formular Netlify
7. Footer

SEO:
- <title> si <meta description> optimizate
- Schema.org LocalBusiness in JSON-LD
- Open Graph tags

Returneaza DOAR codul HTML complet (<!DOCTYPE html>...</html>), fara explicatii, fara markdown.`,
      }],
    }),
  });

  if (!res.ok) return generateFallbackHtml(businessName, city);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim()
    || generateFallbackHtml(businessName, city);
}

function generateFallbackHtml(name, city) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>${name} – ${city}</title></head><body><h1>${name}</h1><p>${city}</p></body></html>`;
}

function generateNetlifyToml() {
  return `[build]\n  publish = "."\n\n[[redirects]]\n  from = "/:slug"\n  to = "/:slug.html"\n  status = 301\n`;
}
