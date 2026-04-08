/**
 * Site Factory Bot — Telegram Handler
 *
 * Primeste text sau voice → Claude interpreteaza business + locatie
 * → Genereaza site demo → creaza repo GitHub → deploy Netlify → trimite URL
 *
 * Env vars necesare in Netlify:
 *   TELEGRAM_BOT_TOKEN   — token de la BotFather
 *   TELEGRAM_CHAT_ID     — chat_id autorizat (al tau)
 *   ANTHROPIC_API_KEY    — pentru Claude
 *   GITHUB_PAT           — Personal Access Token (scopes: repo)
 *   NETLIFY_PAT          — Netlify Personal Access Token
 *   NETLIFY_ACCOUNT_SLUG — slug-ul contului tau Netlify (ex: "lauracraciun")
 */

import { transcribeVoice } from './transcribe-voice.mjs';
import { interpretRequest } from './interpret-request.mjs';
import { generateSite } from './generate-site.mjs';
import { createGithubRepo, pushFilesToRepo } from './github-api.mjs';
import { createNetlifySite, triggerDeploy } from './netlify-api.mjs';

// ─── Telegram helpers ────────────────────────────────────────────────────────

async function sendTelegram(botToken, chatId, text, parseMode = 'Markdown') {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
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

// ─── Handler principal ────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const allowedChatId = process.env.TELEGRAM_CHAT_ID;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const githubPat = process.env.GITHUB_PAT;
  const netlifyPat = process.env.NETLIFY_PAT;
  const netlifyAccount = process.env.NETLIFY_ACCOUNT_SLUG;

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
    console.warn(`Mesaj ignorat de la chat_id necunoscut: ${chatId}`);
    return { statusCode: 200, body: 'OK' };
  }

  // ── Extrage textul (text sau voice transcris) ──────────────────────────────
  let userText = message.text || '';

  if (message.voice) {
    await sendTelegram(botToken, chatId, `🎤 Am primit vocal. Transcriu...`);
    const voiceUrl = await getVoiceFileUrl(botToken, message.voice.file_id);
    if (voiceUrl) {
      userText = await transcribeVoice(anthropicKey, voiceUrl);
      if (!userText) {
        await sendTelegram(botToken, chatId, `❌ Nu am putut transcrie vocala. Incearca sa scrii textual.`);
        return { statusCode: 200, body: 'OK' };
      }
      await sendTelegram(botToken, chatId, `📝 Am inteles: _"${userText}"_`);
    }
  }

  if (!userText.trim()) return { statusCode: 200, body: 'OK' };

  const lower = userText.toLowerCase().trim();

  // ── Comenzi speciale ───────────────────────────────────────────────────────
  if (lower === '/start' || lower === '/help' || lower === 'help' || lower === 'ajutor') {
    await sendTelegram(botToken, chatId, buildHelpMessage());
    return { statusCode: 200, body: 'OK' };
  }

  // ── Genereaza site ─────────────────────────────────────────────────────────
  await sendTelegram(botToken, chatId, `🧠 Analizez cererea ta...`);

  const interpreted = await interpretRequest(anthropicKey, userText);

  if (!interpreted || interpreted.action === 'unknown') {
    const msg = interpreted?.clarification || 'Nu am inteles. Exemplu: _"fa un site pentru o frizerie in Gaggenau"_';
    await sendTelegram(botToken, chatId, `❓ ${msg}`);
    return { statusCode: 200, body: 'OK' };
  }

  if (interpreted.action === 'generate_site') {
    const { businessType, city, businessName, lang } = interpreted;

    await sendTelegram(botToken, chatId,
      `✅ Am inteles!\n\n` +
      `🏪 *Tip:* ${businessType}\n` +
      `📍 *Oras:* ${city}\n` +
      `🌐 *Limba:* ${lang || 'germana'}\n\n` +
      `⏳ Generez site-ul demo... (1-2 minute)`
    );

    // 1. Genereaza fisierele site-ului
    const siteFiles = await generateSite(anthropicKey, { businessType, city, businessName, lang });

    if (!siteFiles) {
      await sendTelegram(botToken, chatId, `❌ Eroare la generarea site-ului. Incearca din nou.`);
      return { statusCode: 200, body: 'OK' };
    }

    await sendTelegram(botToken, chatId, `📁 Site generat (${Object.keys(siteFiles).length} fisiere). Creez repo GitHub...`);

    // 2. Creeaza repo GitHub
    const repoSlug = `demo-${businessType.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const repoUrl = await createGithubRepo(githubPat, repoSlug, `Demo site: ${businessName || businessType} in ${city}`);

    if (!repoUrl) {
      await sendTelegram(botToken, chatId, `❌ Nu am putut crea repo-ul GitHub. Verifica GITHUB_PAT.`);
      return { statusCode: 200, body: 'OK' };
    }

    // 3. Push fisiere in repo
    const pushed = await pushFilesToRepo(githubPat, repoSlug, siteFiles);

    if (!pushed) {
      await sendTelegram(botToken, chatId, `❌ Nu am putut uploada fisierele in GitHub.`);
      return { statusCode: 200, body: 'OK' };
    }

    await sendTelegram(botToken, chatId, `📤 Fisiere in GitHub. Deployez pe Netlify...`);

    // 4. Creeaza site Netlify + deploy
    const netlifyUrl = await createNetlifySite(netlifyPat, netlifyAccount, repoSlug, githubPat);

    if (!netlifyUrl) {
      await sendTelegram(botToken, chatId,
        `⚠️ GitHub repo creat dar Netlify deploy a esuat.\n\nRepo: https://github.com/${repoSlug}\n\nPoti face deploy manual pe netlify.com`
      );
      return { statusCode: 200, body: 'OK' };
    }

    // 5. Trimite rezultatul
    await sendTelegram(botToken, chatId,
      `🎉 *Site demo gata!*\n\n` +
      `🔗 *URL:* ${netlifyUrl}\n` +
      `📦 *GitHub:* https://github.com/${repoSlug}\n\n` +
      `_Poti prezenta acest link clientului. Dupa confirmare, personalizam si mutam pe domeniu propriu._`
    );
  }

  return { statusCode: 200, body: 'OK' };
};

// ─── Help message ─────────────────────────────────────────────────────────────

function buildHelpMessage() {
  return [
    `🤖 *Site Factory Bot*`,
    ``,
    `Trimite-mi o cerere vocala sau scrisa, de exemplu:`,
    ``,
    `• _"fa un site pentru o frizerie in Gaggenau"_`,
    `• _"vreau un site pentru un restaurant in Karlsruhe"_`,
    `• _"creeaza site pentru un dentist in Baden-Baden"_`,
    ``,
    `Voi genera automat:`,
    `✅ Site demo profesional in germana`,
    `✅ Agenti SEO + social media specifici`,
    `✅ Deploy live pe Netlify`,
    `✅ Link de prezentat clientului`,
  ].join('\n');
}
