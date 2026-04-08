/**
 * Transcrie un fisier audio OGG/MP4 de la Telegram folosind OpenAI Whisper API
 * Necesita env var: OPENAI_API_KEY
 * Daca nu exista, incearca cu Claude (mai lent, mai scump)
 */

export async function transcribeVoice(anthropicKey, voiceUrl) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    return await transcribeWithWhisper(openaiKey, voiceUrl);
  }

  // Fallback: descarca fisierul si trimite ca base64 catre Claude
  // (Claude nu suporta audio direct, deci acest fallback e limitat)
  console.warn('OPENAI_API_KEY lipsa — transcrierea vocala nu e disponibila');
  return null;
}

async function transcribeWithWhisper(openaiKey, voiceUrl) {
  try {
    // Descarca fisierul audio
    const audioRes = await fetch(voiceUrl);
    if (!audioRes.ok) return null;
    const audioBuffer = await audioRes.arrayBuffer();

    // Trimite la Whisper API
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/ogg' });
    formData.append('file', blob, 'voice.ogg');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ro'); // incearca romana, Whisper detecteaza automat daca e gresit

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: formData,
    });

    if (!res.ok) {
      console.error('Whisper error:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.text || null;
  } catch (err) {
    console.error('transcribeVoice error:', err);
    return null;
  }
}
