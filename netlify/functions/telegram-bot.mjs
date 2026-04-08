/**
 * Telegram webhook receiver — raspunde imediat 200
 * Paseaza procesarea catre telegram-bot-background (15 min timeout)
 */

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Trimite catre background function si asteapta confirmarea (202)
  // Background function returneaza 202 imediat si continua in background
  const siteUrl = process.env.URL || 'https://idyllic-palmier-906fc6.netlify.app';

  try {
    await fetch(`${siteUrl}/.netlify/functions/telegram-bot-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });
  } catch (err) {
    console.error('Failed to trigger background function:', err.message);
  }

  // Raspunde imediat la Telegram (nu asteapta procesarea)
  return { statusCode: 200, body: 'OK' };
};
