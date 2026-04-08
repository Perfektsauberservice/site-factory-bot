/**
 * Site Factory Bot — procesare principala (background, pana la 15 min)
 *
 * Env vars:
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ANTHROPIC_API_KEY
 *   GITHUB_PAT, NETLIFY_PAT
 */

import { transcribeVoice } from './transcribe-voice.mjs';
import { interpretRequest } from './interpret-request.mjs';
import { generateSite } from './generate-site.mjs';
import { createGithubRepo, pushFilesToRepo } from './github-api.mjs';
import { deployToNetlify } from './netlify-api.mjs';

// ─── Telegram helpers ─────────────────────────────────────────────────────────

async function sendTelegram(botToken, chatId, text, parseMode = 'Markdown') {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });
}

async function getVoiceFileUrl(botToken, fileId) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
  const data = await res.json();
  if (!data.ok) return null;
  return `https://api.telegram.org/file/bot${botToken}/${data.result.file_path}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const allowedChatId = process.env.TELEGRAM_CHAT_ID;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const githubPat = process.env.GITHUB_PAT;
  const netlifyPat = process.env.NETLIFY_PAT;

  let update;
  try {
    update = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const message = update?.message;
  if (!message) return { statusCode: 200, body: 'OK' };

  const chatId = String(message.chat?.id);
  if (chatId !== String(allowedChatId)) {
    return { statusCode: 200, body: 'OK' };
  }

  // ── Extrage textul ────────────────────────────────────────────────────────
  let userText = message.text || '';

  if (message.voice) {
    await sendTelegram(botToken, chatId, `🎤 Am primit vocal. Transcriu...`);
    const voiceUrl = await getVoiceFileUrl(botToken, message.voice.file_id);
    if (voiceUrl) {
      userText = await transcribeVoice(anthropicKey, voiceUrl);
      if (!userText) {
        await sendTelegram(botToken, chatId, `❌ Nu am putut transcrie vocala. Incearca textual.`);
        return { statusCode: 200, body: 'OK' };
      }
      await sendTelegram(botToken, chatId, `📝 Am inteles: _"${userText}"_`);
    }
  }

  if (!userText.trim()) return { statusCode: 200, body: 'OK' };

  const lower = userText.toLowerCase().trim();

  // ── Comenzi speciale ──────────────────────────────────────────────────────
  if (lower === '/start' || lower === '/help' || lower === 'help' || lower === 'ajutor') {
    await sendTelegram(botToken, chatId, buildHelpMessage());
    return { statusCode: 200, body: 'OK' };
  }

  if (lower === '/lista' || lower === 'lista' || lower === '/list') {
    await sendTelegram(botToken, chatId, buildBusinessList());
    return { statusCode: 200, body: 'OK' };
  }

  // ── Interpreteaza cererea ─────────────────────────────────────────────────
  await sendTelegram(botToken, chatId, `🧠 Analizez cererea ta...`);

  const interpreted = await interpretRequest(anthropicKey, userText);

  if (!interpreted || interpreted.action === 'unknown') {
    const msg = interpreted?.clarification || 'Nu am inteles. Exemplu: _"fa un site pentru o frizerie in Gaggenau"_';
    await sendTelegram(botToken, chatId, `❓ ${msg}`);
    return { statusCode: 200, body: 'OK' };
  }

  // ── Imbunatateste designul ────────────────────────────────────────────────
  if (interpreted.action === 'improve_site') {
    await sendTelegram(botToken, chatId,
      `🎨 *Redesenez cu un design complet diferit...*\n\n` +
      `Trimite o cerere noua completa, de exemplu:\n_"fa un site pentru frizeria din Gaggenau"_\n\n` +
      `De fiecare data generez un design unic Framer-style cu alta paleta de culori.`
    );
    return { statusCode: 200, body: 'OK' };
  }

  // ── Recomanda agenti AI ───────────────────────────────────────────────────
  if (interpreted.action === 'recommend_agents') {
    await sendTelegram(botToken, chatId, `🤖 Analizez ce agenti AI ar fi utili...`);
    const agentsMsg = await recommendAgents(anthropicKey, interpreted.businessType);
    await sendTelegram(botToken, chatId, agentsMsg);
    return { statusCode: 200, body: 'OK' };
  }

  // ── Genereaza site ────────────────────────────────────────────────────────
  if (interpreted.action === 'generate_site') {
    const { businessType, city: rawCity, businessName, lang, includeAgents } = interpreted;
    const city = rawCity || 'Deutschland';

    await sendTelegram(botToken, chatId,
      `✅ Am inteles!\n\n` +
      `🏪 *Tip:* ${businessType}\n` +
      `📍 *Oras:* ${city}\n` +
      `🌐 *Limba:* ${lang || 'germana'}\n` +
      (includeAgents ? `🤖 *Includ si agenti AI*\n` : ``) +
      `\n⏳ Generez site-ul demo... (1-2 minute)`
    );

    const siteFiles = await generateSite(anthropicKey, { businessType, city, businessName, lang });

    if (!siteFiles) {
      await sendTelegram(botToken, chatId, `❌ Eroare la generarea site-ului. Incearca din nou.`);
      return { statusCode: 200, body: 'OK' };
    }

    await sendTelegram(botToken, chatId, `📁 Site generat. Creez repo GitHub...`);

    const repoSlug = `demo-${businessType.toLowerCase().replace(/[\s_]+/g, '-')}-${city.toLowerCase().replace(/[\s+,_]+/g, '-')}-${Date.now()}`;
    const repoUrl = await createGithubRepo(githubPat, repoSlug, `Demo: ${businessName || businessType} in ${city}`);

    if (!repoUrl) {
      await sendTelegram(botToken, chatId, `❌ Nu am putut crea repo-ul GitHub. Verifica GITHUB_PAT.`);
      return { statusCode: 200, body: 'OK' };
    }

    await pushFilesToRepo(githubPat, repoSlug, siteFiles);
    await sendTelegram(botToken, chatId, `📤 Fisiere in GitHub. Deployez pe Netlify...`);

    const netlifyUrl = await deployToNetlify(netlifyPat, repoSlug, siteFiles);

    if (!netlifyUrl) {
      await sendTelegram(botToken, chatId,
        `⚠️ GitHub ok dar Netlify deploy a esuat.\n\nRepo: https://github.com/${repoUrl}`
      );
      return { statusCode: 200, body: 'OK' };
    }

    await sendTelegram(botToken, chatId,
      `🎉 *Site demo gata!*\n\n` +
      `🔗 *URL:* ${netlifyUrl}\n` +
      `📦 *GitHub:* https://github.com/${repoUrl}\n\n` +
      `_Poti prezenta acest link clientului._`
    );

    if (includeAgents) {
      await sendTelegram(botToken, chatId, `🤖 Generez recomandari agenti AI pentru ${businessType}...`);
      const agentsMsg = await recommendAgents(anthropicKey, businessType);
      await sendTelegram(botToken, chatId, agentsMsg);
    }
  }

  return { statusCode: 200, body: 'OK' };
};

// ─── Recomanda agenti AI ──────────────────────────────────────────────────────

async function recommendAgents(apiKey, businessType) {
  const businessLabel = businessType || 'business local';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `Esti un consultant AI pentru afaceri mici. Clientul are un business de tip: "${businessLabel}".

Recomanda 5-6 agenti AI care se potrivesc EXACT acestui tip de business.
Pentru fiecare agent explica:
1. Ce face concret (1 fraza)
2. De ce se potriveste SPECIFIC acestui business (nu generic) — ce problema reala rezolva
3. Ce rezultat concret aduce (ex: "reduce timpul de raspuns la programari cu 80%")

Format Telegram Markdown:
🤖 *Nume Agent*
📌 _Ce face:_ ...
✅ _De ce se potriveste:_ ...
📈 _Rezultat:_ ...

Fii specific si practic. Evita raspunsuri generice. Gandeste-te la problemele reale ale unui proprietar de ${businessLabel}.`,
      }],
    }),
  });

  if (!res.ok) return `❌ Nu am putut genera recomandari.`;
  const data = await res.json();
  return data.content?.[0]?.text || `❌ Raspuns gol.`;
}

// ─── Help & Lista ─────────────────────────────────────────────────────────────

function buildHelpMessage() {
  return [
    `🤖 *Site Factory Bot*`,
    ``,
    `*Genereaza site nou:*`,
    `• _"fa un site pentru o frizerie in Gaggenau"_`,
    `• _"site pentru dentist in Karlsruhe, include si agenti AI"_`,
    ``,
    `*Recomandari agenti AI:*`,
    `• _"ce agenti AI sunt utili pentru frizerie?"_`,
    ``,
    `*Alte comenzi:*`,
    `• /lista — toate tipurile de afaceri suportate`,
    ``,
    `✅ Design Framer-style unic la fiecare generare`,
    `✅ Deploy live pe Netlify in 2-3 minute`,
  ].join('\n');
}

function buildBusinessList() {
  return [
    `📋 *Tipuri de afaceri suportate*`,
    ``,
    `✂ *Servicii personale*`,
    `Frizerie, beauty salon, nail salon, tatuaje, masaj, spa`,
    ``,
    `🍕 *Food & Drink*`,
    `Restaurant, café, bistro, pizzerie, brutarie, cofetarie, bar`,
    ``,
    `🏥 *Sanatate*`,
    `Dentist, medic familie, psiholog, fizioterapie, optician, farmacie`,
    ``,
    `🚗 *Auto*`,
    `Service auto, vulcanizare, detailing, spalatorie auto`,
    ``,
    `🏠 *Imobiliare & Constructii*`,
    `Agentie imobiliara, constructor, renovari, instalatii`,
    ``,
    `💼 *Profesionisti*`,
    `Avocat, contabil, notar, agentie marketing, web design`,
    ``,
    `💪 *Sport & Educatie*`,
    `Sala fitness, yoga, dans, meditatii, gradinita`,
    ``,
    `🌿 *Altele*`,
    `Hotel, pensiune, florarie, curatenie, catering, pet shop`,
    ``,
    `_Trimite orice cerere si generez site-ul in 2-3 minute!_`,
  ].join('\n');
}
