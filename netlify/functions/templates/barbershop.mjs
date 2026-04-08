/**
 * Template Barbershop / Frizerie
 * Genereaza toate fisierele HTML+CSS+JS pentru un site profesional de frizerie
 */

export async function generateBarbershop(anthropicKey, { city, businessName, lang }) {
  const files = {};

  files['index.html'] = generateIndex(businessName, city);
  files['style.css'] = generateCSS();
  files['netlify.toml'] = generateNetlifyToml();
  files['README.md'] = `# ${businessName} — Demo Site\n\nGenerat automat de Site Factory Bot.`;

  // Agenti specifici frizeriei
  files['netlify/functions/submission-created.mjs'] = generateLeadNotifier();
  files['netlify/functions/review-requester.mjs'] = generateReviewRequester(businessName, city);
  files['.github/workflows/blog-content.yml'] = generateBlogWorkflow();
  files['agents/blog-pipeline.mjs'] = generateBlogPipeline(businessName, city);

  return files;
}

// ─── index.html ───────────────────────────────────────────────────────────────

function generateIndex(name, city) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} – Professioneller Barbershop in ${city}</title>
  <meta name="description" content="Professioneller Haarschnitt und Bartpflege in ${city}. ${name} – Ihr Barbershop für Männer. Jetzt Termin buchen!">
  <meta name="keywords" content="Barbershop ${city}, Friseur ${city}, Haarschnitt ${city}, Bartpflege ${city}, Herrenfriseur ${city}">

  <!-- Open Graph -->
  <meta property="og:title" content="${name} – Barbershop ${city}">
  <meta property="og:description" content="Professioneller Haarschnitt & Bartpflege in ${city}.">
  <meta property="og:type" content="website">

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "${name}",
    "description": "Professioneller Barbershop in ${city}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${city}",
      "addressCountry": "DE"
    },
    "priceRange": "€€",
    "openingHours": ["Mo-Fr 09:00-19:00", "Sa 09:00-17:00"]
  }
  </script>

  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>

<!-- HEADER / NAV -->
<header class="header">
  <nav class="nav container">
    <div class="logo">✂ ${name}</div>
    <ul class="nav-links">
      <li><a href="#services">Leistungen</a></li>
      <li><a href="#about">Über uns</a></li>
      <li><a href="#gallery">Galerie</a></li>
      <li><a href="#contact">Kontakt</a></li>
    </ul>
    <a href="#booking" class="btn btn-primary nav-cta">Termin buchen</a>
  </nav>
</header>

<!-- HERO -->
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content container">
    <span class="hero-badge">✂ Barbershop ${city}</span>
    <h1>Ihr Stil.<br>Unser Handwerk.</h1>
    <p>Professionelle Haarschnitte & Bartpflege in ${city}.<br>Klassisch. Modern. Individuell.</p>
    <div class="hero-cta">
      <a href="#booking" class="btn btn-primary btn-lg">Jetzt Termin buchen</a>
      <a href="#services" class="btn btn-outline btn-lg">Leistungen ansehen</a>
    </div>
    <div class="hero-stats">
      <div class="stat"><strong>500+</strong><span>zufriedene Kunden</span></div>
      <div class="stat"><strong>8+</strong><span>Jahre Erfahrung</span></div>
      <div class="stat"><strong>4.9★</strong><span>Google Bewertung</span></div>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section class="services" id="services">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Unsere Leistungen</span>
      <h2>Was wir für Sie tun</h2>
      <p>Wir bieten alles, was der moderne Mann braucht – von klassisch bis trendy.</p>
    </div>
    <div class="services-grid">
      <div class="service-card">
        <div class="service-icon">✂</div>
        <h3>Herrenhaarschnitt</h3>
        <p>Klassisch oder modern – wir schneiden nach Ihren Wünschen. Inklusive Styling und Beratung.</p>
        <div class="service-price">ab 25 €</div>
      </div>
      <div class="service-card featured">
        <div class="service-badge">Beliebt</div>
        <div class="service-icon">🪒</div>
        <h3>Bart & Rasur</h3>
        <p>Professionelle Bartpflege, Konturierung und klassische Nassrasur mit heißem Tuch.</p>
        <div class="service-price">ab 20 €</div>
      </div>
      <div class="service-card">
        <div class="service-icon">👑</div>
        <h3>VIP Paket</h3>
        <p>Haarschnitt + Bart + Gesichtspflege + Kopfmassage. Das komplette Verwöhnprogramm.</p>
        <div class="service-price">ab 55 €</div>
      </div>
      <div class="service-card">
        <div class="service-icon">🎨</div>
        <h3>Colorationen</h3>
        <p>Highlights, Grauabdeckung oder komplett neuer Look – wir sind Experten für Männerfarbe.</p>
        <div class="service-price">ab 40 €</div>
      </div>
      <div class="service-card">
        <div class="service-icon">🧴</div>
        <h3>Haarpflege</h3>
        <p>Intensivbehandlungen für gesundes, glänzendes Haar. Auf Ihre Haarstruktur abgestimmt.</p>
        <div class="service-price">ab 15 €</div>
      </div>
      <div class="service-card">
        <div class="service-icon">👦</div>
        <h3>Kinderhaarschnitt</h3>
        <p>Für die Kleinen bis 12 Jahre. Geduldig, freundlich und immer mit einem Lächeln.</p>
        <div class="service-price">ab 15 €</div>
      </div>
    </div>
  </div>
</section>

<!-- BOOKING -->
<section class="booking" id="booking">
  <div class="container">
    <div class="booking-inner">
      <div class="booking-text">
        <span class="section-badge">Termin</span>
        <h2>Jetzt online buchen</h2>
        <p>Wählen Sie Ihren Wunschtermin bequem online. Kein Warten, keine Überraschungen.</p>
        <ul class="booking-benefits">
          <li>✓ Sofortige Bestätigung</li>
          <li>✓ Erinnerung per SMS</li>
          <li>✓ Kostenlose Stornierung bis 24h vorher</li>
        </ul>
      </div>
      <div class="booking-form-wrap">
        <form class="booking-form" name="booking" method="POST" data-netlify="true" action="/danke.html">
          <input type="hidden" name="form-name" value="booking">
          <div class="form-group">
            <label>Ihr Name *</label>
            <input type="text" name="name" required placeholder="Max Mustermann">
          </div>
          <div class="form-group">
            <label>Telefon *</label>
            <input type="tel" name="phone" required placeholder="+49 ...">
          </div>
          <div class="form-group">
            <label>E-Mail</label>
            <input type="email" name="email" placeholder="ihre@email.de">
          </div>
          <div class="form-group">
            <label>Gewünschte Leistung *</label>
            <select name="service" required>
              <option value="">Bitte wählen...</option>
              <option>Herrenhaarschnitt (ab 25 €)</option>
              <option>Bart & Rasur (ab 20 €)</option>
              <option>VIP Paket (ab 55 €)</option>
              <option>Coloration (ab 40 €)</option>
              <option>Kinderhaarschnitt (ab 15 €)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Wunschtermin *</label>
            <input type="datetime-local" name="datetime" required>
          </div>
          <div class="form-group">
            <label>Nachricht</label>
            <textarea name="message" rows="3" placeholder="Besondere Wünsche..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Termin anfragen →</button>
          <p class="form-note">Wir melden uns innerhalb von 1 Stunde bei Ihnen.</p>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about" id="about">
  <div class="container">
    <div class="about-inner">
      <div class="about-image">
        <div class="about-img-placeholder">
          <span>✂</span>
          <p>Foto folgt</p>
        </div>
      </div>
      <div class="about-text">
        <span class="section-badge">Über uns</span>
        <h2>Leidenschaft fürs Handwerk</h2>
        <p>Bei ${name} in ${city} verbinden wir traditionelles Barbier-Handwerk mit modernem Stil. Seit über 8 Jahren sind wir Anlaufstelle für Männer, die Wert auf gepflegtes Auftreten legen.</p>
        <p>Unser Team aus erfahrenen Barberern nimmt sich Zeit für jeden Kunden – weil ein guter Haarschnitt mehr ist als nur Haare schneiden.</p>
        <div class="about-features">
          <div class="feature">
            <span class="feature-icon">🏆</span>
            <div>
              <strong>Ausgebildete Profis</strong>
              <span>Zertifizierte Friseur- & Barbermeister</span>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">🧴</span>
            <div>
              <strong>Premium Produkte</strong>
              <span>Nur hochwertige Markenprodukte</span>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">😊</span>
            <div>
              <strong>Entspannte Atmosphäre</strong>
              <span>Kaffee, Musik, gutes Gespräch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Bewertungen</span>
      <h2>Was unsere Kunden sagen</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p>"Bester Barbershop in ${city}! Professionell, freundlich und immer top Ergebnis. Komme seit 2 Jahren hierher."</p>
        <div class="testimonial-author">— Michael K.</div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p>"Das VIP-Paket ist einfach grandios. Haarschnitt, Bart und Massage – danach fühlt man sich wie ein neuer Mensch!"</p>
        <div class="testimonial-author">— Thomas B.</div>
      </div>
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p>"Sehr angenehme Atmosphäre, faire Preise und perfekte Arbeit. Absolute Empfehlung für jeden Mann in ${city}."</p>
        <div class="testimonial-author">— Stefan R.</div>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="contact" id="contact">
  <div class="container">
    <div class="contact-inner">
      <div class="contact-info">
        <span class="section-badge">Kontakt</span>
        <h2>Besuchen Sie uns</h2>
        <div class="contact-details">
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <div>
              <strong>Adresse</strong>
              <span>Musterstraße 1, ${city}</span>
            </div>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <div>
              <strong>Telefon</strong>
              <span><a href="tel:+49XXXXXXXXX">+49 XXX XXXXXXX</a></span>
            </div>
          </div>
          <div class="contact-item">
            <span class="contact-icon">⏰</span>
            <div>
              <strong>Öffnungszeiten</strong>
              <span>Mo–Fr: 09:00–19:00<br>Sa: 09:00–17:00<br>So: geschlossen</span>
            </div>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <div>
              <strong>WhatsApp</strong>
              <a href="https://wa.me/49XXXXXXXXX" class="btn btn-whatsapp">WhatsApp schreiben</a>
            </div>
          </div>
        </div>
      </div>
      <div class="contact-map">
        <div class="map-placeholder">
          <span>🗺️</span>
          <p>Google Maps<br>wird hier eingebettet</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="logo">✂ ${name}</div>
        <p>Ihr Barbershop in ${city}</p>
      </div>
      <div class="footer-links">
        <a href="#services">Leistungen</a>
        <a href="#booking">Termin</a>
        <a href="#contact">Kontakt</a>
        <a href="/impressum.html">Impressum</a>
        <a href="/datenschutz.html">Datenschutz</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${name}. Alle Rechte vorbehalten.</p>
    </div>
  </div>
</footer>

<script>
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Set min datetime for booking
  const dtInput = document.querySelector('input[type="datetime-local"]');
  if (dtInput) {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    dtInput.min = now.toISOString().slice(0, 16);
  }
</script>
</body>
</html>`;
}

// ─── style.css ────────────────────────────────────────────────────────────────

function generateCSS() {
  return `/* ─── Reset & Base ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --black: #0a0a0a;
  --dark: #111111;
  --dark2: #1a1a1a;
  --gold: #c9a84c;
  --gold-light: #e8c97e;
  --white: #ffffff;
  --gray: #888888;
  --light: #f5f5f5;
  --green: #25D366;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --shadow: 0 4px 24px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 48px rgba(0,0,0,0.20);
  --radius: 12px;
  --transition: 0.3s ease;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font-sans); color: var(--dark); background: var(--white); line-height: 1.6; }

/* ─── Typography ────────────────────────────────────────────────── */
h1, h2, h3 { font-family: var(--font-serif); line-height: 1.2; }
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
h3 { font-size: 1.25rem; }
a { text-decoration: none; color: inherit; }

/* ─── Layout ────────────────────────────────────────────────────── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 80px 0; }

/* ─── Buttons ───────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 1rem;
  cursor: pointer; border: 2px solid transparent; transition: var(--transition);
  white-space: nowrap;
}
.btn-primary { background: var(--gold); color: var(--black); border-color: var(--gold); }
.btn-primary:hover { background: var(--gold-light); border-color: var(--gold-light); transform: translateY(-1px); box-shadow: var(--shadow); }
.btn-outline { background: transparent; color: var(--white); border-color: rgba(255,255,255,0.6); }
.btn-outline:hover { background: rgba(255,255,255,0.1); border-color: var(--white); }
.btn-lg { padding: 16px 36px; font-size: 1.05rem; }
.btn-full { width: 100%; }
.btn-whatsapp { background: var(--green); color: var(--white); padding: 10px 20px; border-radius: 8px; font-weight: 600; display: inline-block; margin-top: 8px; }
.btn-whatsapp:hover { background: #1ebe5a; }

/* ─── Badges ────────────────────────────────────────────────────── */
.section-badge, .hero-badge {
  display: inline-block; background: rgba(201,168,76,0.15); color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3); padding: 4px 16px; border-radius: 100px;
  font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  margin-bottom: 16px;
}

/* ─── Section Header ────────────────────────────────────────────── */
.section-header { text-align: center; max-width: 600px; margin: 0 auto 60px; }
.section-header p { color: var(--gray); margin-top: 12px; font-size: 1.05rem; }

/* ─── HEADER / NAV ──────────────────────────────────────────────── */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 16px 0;
  background: transparent;
  transition: background var(--transition), box-shadow var(--transition);
}
.header.scrolled { background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
.nav { display: flex; align-items: center; gap: 40px; }
.logo { font-family: var(--font-serif); font-size: 1.5rem; color: var(--gold); font-weight: 700; flex-shrink: 0; }
.nav-links { display: flex; gap: 32px; list-style: none; margin-left: auto; }
.nav-links a { color: var(--white); font-weight: 500; opacity: 0.85; transition: opacity var(--transition); }
.nav-links a:hover { opacity: 1; color: var(--gold); }
.nav-cta { margin-left: 16px; }

/* ─── HERO ──────────────────────────────────────────────────────── */
.hero {
  min-height: 100vh; position: relative; display: flex; align-items: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1209 50%, #0a0a0a 100%);
  overflow: hidden;
}
.hero::before {
  content: '✂'; position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
  font-size: 40vw; opacity: 0.03; line-height: 1; pointer-events: none;
}
.hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%); }
.hero-content { position: relative; z-index: 1; padding: 120px 0 80px; }
.hero-content h1 { color: var(--white); margin-bottom: 20px; }
.hero-content p { color: rgba(255,255,255,0.7); font-size: 1.2rem; max-width: 500px; margin-bottom: 40px; }
.hero-cta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 60px; }
.hero-stats { display: flex; gap: 48px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; }
.stat strong { font-size: 2rem; color: var(--gold); font-family: var(--font-serif); }
.stat span { color: rgba(255,255,255,0.6); font-size: 0.9rem; }

/* ─── SERVICES ──────────────────────────────────────────────────── */
.services { background: var(--light); }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.service-card {
  background: var(--white); border-radius: var(--radius); padding: 32px;
  position: relative; transition: transform var(--transition), box-shadow var(--transition);
  border: 1px solid rgba(0,0,0,0.06);
}
.service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.service-card.featured { border: 2px solid var(--gold); }
.service-badge {
  position: absolute; top: -12px; right: 20px;
  background: var(--gold); color: var(--black); padding: 4px 14px; border-radius: 100px;
  font-size: 0.8rem; font-weight: 700;
}
.service-icon { font-size: 2.5rem; margin-bottom: 16px; }
.service-card h3 { margin-bottom: 12px; }
.service-card p { color: var(--gray); font-size: 0.95rem; line-height: 1.7; }
.service-price { margin-top: 20px; font-size: 1.1rem; font-weight: 700; color: var(--gold); }

/* ─── BOOKING ───────────────────────────────────────────────────── */
.booking { background: var(--dark); }
.booking-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.booking-text h2 { color: var(--white); margin-bottom: 16px; }
.booking-text p { color: rgba(255,255,255,0.6); margin-bottom: 24px; }
.booking-benefits { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.booking-benefits li { color: rgba(255,255,255,0.8); font-weight: 500; }
.booking-form-wrap { background: var(--white); border-radius: var(--radius); padding: 40px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; color: var(--dark); }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 12px 16px; border: 2px solid #e5e5e5; border-radius: 8px;
  font-size: 1rem; font-family: var(--font-sans); transition: border-color var(--transition);
  background: var(--white); color: var(--dark);
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none; border-color: var(--gold);
}
.form-group textarea { resize: vertical; }
.form-note { text-align: center; color: var(--gray); font-size: 0.85rem; margin-top: 12px; }

/* ─── ABOUT ─────────────────────────────────────────────────────── */
.about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.about-img-placeholder {
  background: var(--light); border-radius: var(--radius); aspect-ratio: 4/3;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: var(--gray); border: 2px dashed #ddd;
}
.about-img-placeholder span { font-size: 4rem; }
.about-text h2 { margin-bottom: 16px; }
.about-text p { color: var(--gray); margin-bottom: 16px; }
.about-features { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
.feature { display: flex; gap: 16px; align-items: flex-start; }
.feature-icon { font-size: 1.5rem; flex-shrink: 0; }
.feature strong { display: block; font-weight: 600; margin-bottom: 2px; }
.feature span { color: var(--gray); font-size: 0.9rem; }

/* ─── TESTIMONIALS ──────────────────────────────────────────────── */
.testimonials { background: var(--light); }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.testimonial-card { background: var(--white); border-radius: var(--radius); padding: 32px; border: 1px solid rgba(0,0,0,0.06); }
.stars { color: var(--gold); font-size: 1.2rem; margin-bottom: 16px; }
.testimonial-card p { color: var(--gray); font-style: italic; line-height: 1.7; margin-bottom: 16px; }
.testimonial-author { font-weight: 600; font-size: 0.9rem; }

/* ─── CONTACT ───────────────────────────────────────────────────── */
.contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.contact-details { display: flex; flex-direction: column; gap: 24px; margin-top: 32px; }
.contact-item { display: flex; gap: 16px; align-items: flex-start; }
.contact-icon { font-size: 1.5rem; flex-shrink: 0; }
.contact-item strong { display: block; font-weight: 600; margin-bottom: 4px; }
.contact-item span, .contact-item a { color: var(--gray); line-height: 1.6; }
.map-placeholder {
  background: var(--light); border-radius: var(--radius); aspect-ratio: 4/3;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: var(--gray); border: 2px dashed #ddd;
}
.map-placeholder span { font-size: 3rem; }

/* ─── FOOTER ────────────────────────────────────────────────────── */
.footer { background: var(--dark); color: var(--white); padding: 48px 0 24px; }
.footer-inner { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; flex-wrap: wrap; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.footer-brand .logo { margin-bottom: 8px; }
.footer-brand p { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
.footer-links { display: flex; gap: 24px; flex-wrap: wrap; align-items: center; }
.footer-links a { color: rgba(255,255,255,0.6); font-size: 0.9rem; transition: color var(--transition); }
.footer-links a:hover { color: var(--gold); }
.footer-bottom { text-align: center; padding-top: 24px; color: rgba(255,255,255,0.4); font-size: 0.85rem; }

/* ─── Responsive ────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-links, .nav-cta { display: none; }
  .hero-stats { gap: 24px; }
  .booking-inner, .about-inner, .contact-inner { grid-template-columns: 1fr; gap: 40px; }
  .hero-cta { flex-direction: column; }
  .footer-inner { flex-direction: column; }
  .footer-links { flex-direction: column; gap: 12px; }
  section { padding: 60px 0; }
}`;
}

// ─── netlify.toml ─────────────────────────────────────────────────────────────

function generateNetlifyToml() {
  return `[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/:slug"
  to = "/:slug.html"
  status = 301
  conditions = {Country = []}

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
`;
}

// ─── Lead Notifier (Agent 8) ──────────────────────────────────────────────────

function generateLeadNotifier() {
  return `/**
 * Agent 8 — Lead Notifier
 * Trimite notificare Telegram la fiecare programare noua
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
export const handler = async (event) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return { statusCode: 200, body: 'OK' };

  const payload = JSON.parse(event.body);
  const data = payload.payload || {};

  const msg = [
    '🔔 *Programare noua!*',
    '',
    \`👤 *Nume:* \${data.name || '—'}\`,
    \`📞 *Telefon:* \${data.phone || '—'}\`,
    \`✂ *Serviciu:* \${data.service || '—'}\`,
    \`📅 *Data:* \${data.datetime || '—'}\`,
    data.message ? \`💬 *Mesaj:* \${data.message}\` : '',
  ].filter(Boolean).join('\\n');

  await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
  });

  return { statusCode: 200, body: 'OK' };
};
`;
}

// ─── Review Requester (Agent 9) ───────────────────────────────────────────────

function generateReviewRequester(name, city) {
  return `/**
 * Agent 9 — Review Requester
 * Trimite WhatsApp dupa lucrare cu link Google Review
 * Apelat manual sau din dashboard: POST /.netlify/functions/review-requester
 * Body: { "phone": "+49...", "name": "Max" }
 * Env: WHATSAPP_API_KEY (CallMeBot) sau TELEGRAM_BOT_TOKEN
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { phone, name } = JSON.parse(event.body || '{}');
  if (!phone) return { statusCode: 400, body: 'phone required' };

  // Inlocuieste cu linkul tau Google Review real
  const reviewUrl = 'https://g.page/r/YOUR_GOOGLE_REVIEW_ID/review';

  const msg = encodeURIComponent(
    \`Hallo \${name || 'lieber Kunde'}! 😊\\n\\n\` +
    \`Danke für Ihren Besuch bei ${name} in ${city}!\\n\` +
    \`Wir würden uns sehr über Ihre Bewertung freuen:\\n\${reviewUrl}\\n\\n\` +
    \`Bis zum nächsten Mal! ✂\`
  );

  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (apiKey) {
    await fetch(\`https://api.callmebot.com/whatsapp.php?phone=\${phone}&text=\${msg}&apikey=\${apiKey}\`);
  }

  return { statusCode: 200, body: 'Sent' };
};
`;
}

// ─── Blog Workflow ─────────────────────────────────────────────────────────────

function generateBlogWorkflow() {
  return `name: Blog Content Generator
on:
  schedule:
    - cron: '0 9 * * 1,3,5'  # Luni, Miercuri, Vineri la 09:00
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install @anthropic-ai/sdk
      - run: node agents/blog-pipeline.mjs
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
      - name: Commit articles
        run: |
          git config user.email "bot@github.com"
          git config user.name "Blog Bot"
          git add blog/ content/
          git diff --staged --quiet || git commit -m "Add new blog articles"
          git push
`;
}

// ─── Blog Pipeline (Agent 1-4) ────────────────────────────────────────────────

function generateBlogPipeline(name, city) {
  return `/**
 * Agent 1-4 — Blog Content Pipeline
 * Genereaza articole SEO pentru frizerie
 * Ruleaza automat via GitHub Actions (blog-content.yml)
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOPICS = [
  'Die besten Haarschnitte für Männer 2024',
  'Bartpflege Tipps für zuhause',
  'Undercut oder Fade – was passt zu dir?',
  'Nassrasur vs. Trockenrasur: Vor- und Nachteile',
  'Haarpflege Routine für Männer in 5 Minuten',
  'Welcher Haarschnitt passt zu meiner Gesichtsform?',
  'Pomade, Wachs oder Gel – was ist der Unterschied?',
  'Die Geschichte des Barbershops',
  'Wie oft sollte man zum Friseur gehen?',
  'Top 5 Trending Frisuren für ${city}',
];

async function generateArticle(topic) {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: \`Schreibe einen SEO-optimierten Blog-Artikel auf Deutsch für einen Barbershop in ${city}.
Thema: \${topic}
Name des Barbershops: ${name}

Format: komplettes HTML-Fragment (nur <article> Tag, kein <html>/<head>/<body>).
Struktur: H1 Titel, Einleitung (2 Sätze), 3-4 H2 Abschnitte mit je 2-3 Absätzen, Fazit mit CTA.
Tonalität: professionell, freundlich, informativ.
SEO: Nutze natürliche Keywords rund um das Thema + "${city}" + "Barbershop".
Länge: ~600-800 Wörter.\`
    }],
  });

  return res.content[0].text;
}

async function main() {
  await fs.mkdir('blog', { recursive: true });

  // Generaza 1 articol per rulare
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(\`Generez articol: \${topic}\`);

  const content = await generateArticle(topic);

  const slug = topic.toLowerCase()
    .replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c]))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const date = new Date().toISOString().split('T')[0];
  const filename = \`blog/\${date}-\${slug}.html\`;

  const html = \`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${topic} | ${name}</title>
  <meta name="description" content="Informationen rund um \${topic} – von ${name} in ${city}.">
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header class="header scrolled">
    <nav class="nav container">
      <div class="logo">✂ ${name}</div>
      <a href="/" class="btn btn-primary">← Zurück zur Startseite</a>
    </nav>
  </header>
  <main style="padding: 120px 24px 80px; max-width: 800px; margin: 0 auto;">
    \${content}
    <div style="margin-top: 48px; padding: 32px; background: #f5f5f5; border-radius: 12px; text-align: center;">
      <h3>Termin buchen bei ${name}</h3>
      <p>Lust auf einen neuen Look? Wir freuen uns auf Sie!</p>
      <a href="/#booking" class="btn btn-primary" style="margin-top: 16px; display: inline-block;">Jetzt Termin buchen →</a>
    </div>
  </main>
</body>
</html>\`;

  await fs.writeFile(filename, html);
  console.log(\`Articol salvat: \${filename}\`);
}

main().catch(console.error);
`;
}
