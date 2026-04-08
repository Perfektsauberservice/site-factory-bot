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

// ─── Stiluri de design disponibile ───────────────────────────────────────────

const DESIGN_STYLES = ['framer', 'lovable', 'bold', 'linear', 'webflow', 'minimal'];

function getDesignPrompt(style, theme, langName, businessName, businessType, city) {
  const base = `Genereaza un site HTML complet in ${langName} pentru:
Business: ${businessName} (${businessType})
Oras: ${city}
PALETA DE CULORI: ${theme.palette}
MOOD: ${theme.mood}

REGULA CRITICA: FARA opacity:0 initial, FARA IntersectionObserver. Toate elementele vizibile imediat.
Formular contact cu data-netlify="true", campuri: Nume, Email, Telefon, Mesaj.
Schema.org LocalBusiness in JSON-LD. Meta tags SEO complete.
COMPLET RESPONSIVE (breakpoint 768px).
Returneaza DOAR codul HTML complet, fara explicatii, fara markdown.`;

  if (style === 'framer') {
    return `${base}

DESIGN FRAMER-STYLE:
- Font: Inter de la Google Fonts (300,400,500,600,700,800)
- Header: position fixed, backdrop-filter blur(20px), semi-transparent
- Hero: min-height 100vh, background gradient dark cu culorile principale
  Titlu: clamp(3.5rem,8vw,7rem), font-weight 800. 2 butoane CTA pill-shape.
- Cards servicii: background rgba(255,255,255,0.04), border rgba(255,255,255,0.08), border-radius 20px, hover lift
- Statistici: 3-4 numere mari. Testimoniale glassmorphism. Footer dark.
- CSS @keyframes pentru animatii (nu JS).
STRUCTURA: Header, Hero+statistici, Servicii cu preturi EUR, Despre noi, Testimoniale, Contact+form, Footer.`;
  }

  if (style === 'lovable') {
    return `${base}

DESIGN LOVABLE/TAILWIND-STYLE:
- Foloseste Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>
- Font: Inter de la Google Fonts
- Fundal: alb sau gri foarte deschis (#f8fafc). Text: slate-900.
- Header: bg-white/80 backdrop-blur sticky top-0, shadow-sm, border-b border-slate-100
- Hero: padding-top mare, titlu foarte mare (text-6xl md:text-8xl font-black), badge colorat, subtitlu slate-600, 2 butoane (primar bg accent rounded-xl, secundar outline)
- Cards servicii: bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition
- Sectiune cu background colorat (bg-accent/10) pentru statistici
- Testimoniale: cards albe cu avatar placeholder, stele, citat
- Footer: bg-slate-900 text-white
- FARA clase Tailwind cu culori hardcodate — foloseste accent color din paleta ca variabila CSS sau inline style
STRUCTURA: Header, Hero, Servicii cu preturi EUR, Despre noi, Statistici, Testimoniale, Contact+form, Footer.`;
  }

  if (style === 'bold') {
    return `${base}

DESIGN BOLD/EDITORIAL-STYLE:
- Font: titluri Playfair Display (700,900) + body Inter — ambele de la Google Fonts
- Fundal: alb pur sau negru pur (in functie de mood). Contrast maxim.
- Layout asimetric: hero cu text aliniat stanga, imagine/gradient dreapta
- Titlu hero: font-size clamp(4rem,10vw,9rem), font-weight 900, line-height 0.95, poate fi taiat de marginea ecranului
- Accent color folosit agresiv: background-uri solide pe sectiuni, bordere groase, underline decorativ
- Cards: border groasa 2-3px solid accent, NO shadow, hover: background solid accent + text invers
- Sectiune cu background full accent color (contrasting)
- Tipografie ca element de design: litere mari, tracking-wide, quote-uri mari
- Footer: full color accent sau full black
STRUCTURA: Header minimal, Hero editorial, Servicii cu preturi EUR, Citat/testimonial mare, Despre noi, Contact+form, Footer.`;
  }

  if (style === 'linear') {
    return `${base}

DESIGN LINEAR/STRIPE-STYLE (high-end SaaS):
- Font: Inter de la Google Fonts (400,500,600,700)
- Fundal: #0a0a0a (aproape negru) sau alb pur, in functie de mood
- Header: transparent, devine frosted glass la scroll (backdrop-blur + bg semi-transparent)
- Hero: centrat, titlu mediu (clamp(2.5rem,5vw,5rem)) dar cu gradient text spectaculos pe cuvantul cheie (background: linear-gradient → -webkit-background-clip: text → -webkit-text-fill-color: transparent)
  Badge mic cu border gradient deasupra titlului. 1 buton CTA principal + 1 link secundar.
- Cards servicii: bg #111 border border-white/10 rounded-xl p-6, hover: border-white/30 + subtle glow box-shadow cu accent color
- Gradient mesh background subtil pe hero (culori soft, nu agresiv)
- Sectiune "features" cu icoane SVG simple si text scurt — grid 3 coloane
- Testimoniale: simple quote-uri cu avatar si nume, fara card elaborat
- Footer: minimal, 1-2 linii
STRUCTURA: Header, Hero cu gradient text, Features/Servicii, Statistici, Testimoniale minimal, Contact+form, Footer minimal.`;
  }

  if (style === 'webflow') {
    return `${base}

DESIGN WEBFLOW/AGENCY-STYLE:
- Font: titluri Syne sau DM Sans (import Google Fonts) + body Inter
- Layout: asimetric, grid CSS cu coloane neegale
- Hero: split layout — stanga text (60%), dreapta element decorativ (gradient blob sau grid pattern CSS)
  Titlu: font-weight 800, text mare, cu un cuvant evidentiat cu culoare accent
- Header: linie subtire jos, background alb/dark, nav cu hover underline animat
- Cards servicii: layout masonry sau grid neuniform, numere mari (01, 02, 03) ca decoratii
- Culori: combina dark si light sections alternand — sectiune alba, sectiune colorata accent, sectiune neagra
- Detalii: border-radius mic (8px max) pe butoane — look mai serios/agency
- Testimoniale: quote mare cu ghilimele decorative gigant ca fundal
- Footer: dark cu grid de links si newsletter form
STRUCTURA: Header, Hero split, Servicii numerotate cu preturi EUR, Sectiune colorata despre noi, Testimoniale cu quote mare, Contact+form, Footer dark.`;
  }

  if (style === 'minimal') {
    return `${base}

DESIGN MINIMAL/SWISS-STYLE (tipografie ca design):
- Font: un singur font — DM Serif Display pentru titluri + DM Sans pentru body (Google Fonts)
- Fundal: alb pur #ffffff. Text: #111111. Accent color folosit cu parcimonie.
- FARA gradiente, FARA shadows (maxim shadow-sm pe cards), FARA efecte vizuale complexe
- Header: alb, border-bottom 1px solid #eee, logo text simplu, nav minimal
- Hero: padding 160px sus/jos, titlu ENORM (clamp(5rem,12vw,10rem)) aliniat stanga, font-weight 400 (nu bold — eleganta), 1 singura linie subtitlu, 1 buton CTA simplu cu border
- Spatiu alb: sectiunile au padding minim 120px sus/jos
- Grid servicii: tabel-like sau lista cu separator lines, nu carduri — tip "editorial list"
- Sectiune statistics: numere mari izolate cu mult spatiu alb in jurul lor
- Testimoniale: citat italic mare, linie separator, nume mic
- Accent color: folosit DOAR pe butonul principal si 1-2 elemente cheie
- Footer: 1 linie, centrat, minimal
STRUCTURA: Header, Hero mare minimal, Servicii ca lista eleganta cu preturi EUR, Statistici cu spatiu, Testimoniale citat, Contact+form minimal, Footer 1 linie.`;
  }

  return base;
}

async function generateWithClaude(apiKey, { businessType, city, businessName, lang = 'de' }) {
  const theme = BUSINESS_THEMES[businessType] || {
    palette: '#0f172a, #1e293b, accent #6366f1 (indigo)',
    mood: 'modern, profesional, curat',
  };

  const langName = lang === 'de' ? 'germana' : lang === 'ro' ? 'romana' : 'engleza';

  // Alege un stil random la fiecare generare
  const style = DESIGN_STYLES[Math.floor(Math.random() * DESIGN_STYLES.length)];
  console.log(`Design style ales: ${style}`);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      messages: [{
        role: 'user',
        content: getDesignPrompt(style, theme, langName, businessName, businessType, city),
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
