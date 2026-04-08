/**
 * Interpreteaza cererea utilizatorului cu Claude
 * Returneaza: { action, businessType, city, businessName, lang }
 * Actions: generate_site | improve_site | recommend_agents | unknown
 */

export async function interpretRequest(apiKey, userMessage) {
  const systemPrompt = `Esti un asistent care interpreteaza cereri legate de site-uri web si agenti AI.
Utilizatorul trimite o cerere in romana, germana sau engleza.

Exista 3 tipuri de actiuni:

1. GENERATE_SITE — utilizatorul vrea sa creeze un site nou
   Extrage: businessType (engleza snake_case), city, businessName (sau null), lang (de/ro/en)
   Exemple: "fa un site pentru o frizerie in Gaggenau", "vreau site restaurant Karlsruhe"

2. IMPROVE_SITE — utilizatorul vrea sa imbunatateasca/redeseneze un site existent
   Exemple: "imbunatateste designul", "fa un design mai bun", "redeseneaza site-ul", "alt design"

3. RECOMMEND_AGENTS — utilizatorul intreaba ce agenti AI ar fi utili
   Exemple: "ce agenti ai sunt utili", "ce automatizari recomanzi", "ce agenti pentru frizerie"
   Extrage: businessType daca e mentionat (sau null daca nu)

Raspunde DOAR cu JSON valid, fara explicatii:
{"action":"generate_site","businessType":"barbershop","city":"Gaggenau","businessName":null,"lang":"de"}
{"action":"improve_site"}
{"action":"recommend_agents","businessType":"barbershop"}
{"action":"unknown","clarification":"intrebare clara catre user"}

Exemple:
- "fa un site pentru o frizerie in Gaggenau" → {"action":"generate_site","businessType":"barbershop","city":"Gaggenau","businessName":null,"lang":"de"}
- "imbunatateste designul" → {"action":"improve_site"}
- "fa un design mai bun" → {"action":"improve_site"}
- "redeseneaza" → {"action":"improve_site"}
- "ce agenti ai sunt utili pentru aceasta frizerie" → {"action":"recommend_agents","businessType":"barbershop"}
- "ce automatizari recomanzi" → {"action":"recommend_agents","businessType":null}
- "vreau site pt restaurant La Roma in Karlsruhe" → {"action":"generate_site","businessType":"restaurant","city":"Karlsruhe","businessName":"La Roma","lang":"de"}`;

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

  if (!res.ok) {
    console.error('interpret-request API error:', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim();

  // Curata markdown code blocks daca Claude le adauga
  const cleaned = raw?.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('interpret-request: non-JSON:', raw);
    return null;
  }
}
