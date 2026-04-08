/**
 * Interpreteaza cererea utilizatorului cu Claude
 * Returneaza: { action, businessType, city, businessName, lang }
 */

export async function interpretRequest(apiKey, userMessage) {
  const systemPrompt = `Esti un asistent care interpreteaza cereri de creare site-uri web.
Utilizatorul trimite o cerere in romana, germana sau engleza.

Trebuie sa extragi:
- tipul businessului (in engleza, snake_case: "barbershop", "restaurant", "dental_clinic", "beauty_salon", "auto_repair", "real_estate", "fitness_gym", "hotel", "bakery", "lawyer", etc.)
- orasul (exact cum e scris)
- numele businessului (daca e mentionat, altfel null)
- limba site-ului (de obicei "de" pentru Germania, "ro" pentru Romania, "en" pentru engleza)

Raspunde DOAR cu JSON valid:
{"action": "generate_site", "businessType": "barbershop", "city": "Gaggenau", "businessName": null, "lang": "de"}
{"action": "unknown", "clarification": "intrebare catre user"}

Exemple:
- "fa un site pentru o frizerie in Gaggenau" → {"action":"generate_site","businessType":"barbershop","city":"Gaggenau","businessName":null,"lang":"de"}
- "vreau site pt restaurant La Roma in Karlsruhe" → {"action":"generate_site","businessType":"restaurant","city":"Karlsruhe","businessName":"La Roma","lang":"de"}
- "site dentist Baden-Baden" → {"action":"generate_site","businessType":"dental_clinic","city":"Baden-Baden","businessName":null,"lang":"de"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim();

  try {
    return JSON.parse(raw);
  } catch {
    console.error('interpret-request: non-JSON:', raw);
    return null;
  }
}
