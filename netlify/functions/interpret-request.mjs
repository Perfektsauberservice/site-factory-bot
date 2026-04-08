/**
 * Interpreteaza cererea utilizatorului cu Claude
 * Actions: generate_site | improve_site | recommend_agents | unknown
 * city poate fi null daca nu e mentionat
 * includeAgents=true daca userul cere si agenti in aceeasi cerere
 */

export async function interpretRequest(apiKey, userMessage) {
  const systemPrompt = `Esti un asistent care interpreteaza cereri legate de site-uri web si agenti AI.
Utilizatorul trimite o cerere in romana, germana sau engleza.

Exista 4 tipuri de actiuni:

1. GENERATE_SITE — utilizatorul vrea sa creeze un site nou
   Extrage: businessType (engleza snake_case), city (sau null daca nu e mentionat), businessName (sau null), lang (de/ro/en)
   Daca cererea include si agenti AI, pune includeAgents: true
   Exemple: "fa un site pentru o frizerie in Gaggenau", "fa un site pentru agentie imobiliara"

2. IMPROVE_SITE — utilizatorul vrea sa imbunatateasca/redeseneze un site existent
   Exemple: "imbunatateste designul", "fa un design mai bun", "alt design"

3. RECOMMEND_AGENTS — utilizatorul intreaba DOAR ce agenti AI ar fi utili (fara sa ceara site nou)

4. UPGRADE_TO_FULL — utilizatorul intreaba despre trecerea de la demo la site real/complet, sau despre pret/timp/ce include un site full
   Exemple: "cat costa site-ul full", "in cat timp faci site-ul complet", "vreau sa nu mai fie demo", "vreau site real", "cat dureaza", "ce include site-ul full"
   Extrage: businessType daca e mentionat (sau null)
   Exemple: "ce agenti ai sunt utili", "ce automatizari recomanzi"

Raspunde DOAR cu JSON valid, fara explicatii:
{"action":"generate_site","businessType":"barbershop","city":"Gaggenau","businessName":null,"lang":"de","includeAgents":false}
{"action":"generate_site","businessType":"real_estate","city":null,"businessName":null,"lang":"de","includeAgents":true}
{"action":"improve_site"}
{"action":"recommend_agents","businessType":"barbershop"}
{"action":"upgrade_to_full"}
{"action":"unknown","clarification":"intrebare clara catre user"}

Exemple complete:
- "fa un site pentru o frizerie in Gaggenau" → {"action":"generate_site","businessType":"barbershop","city":"Gaggenau","businessName":null,"lang":"de","includeAgents":false}
- "fa un site demo pentru o agentie imobiliara, integreaza si agentii AI" → {"action":"generate_site","businessType":"real_estate","city":null,"businessName":null,"lang":"de","includeAgents":true}
- "site pt dentist, include si agenti AI utili" → {"action":"generate_site","businessType":"dental_clinic","city":null,"businessName":null,"lang":"de","includeAgents":true}
- "imbunatateste designul" → {"action":"improve_site"}
- "ce agenti ai sunt utili pentru frizerie" → {"action":"recommend_agents","businessType":"barbershop"}
- "vreau site pt restaurant La Roma in Karlsruhe" → {"action":"generate_site","businessType":"restaurant","city":"Karlsruhe","businessName":"La Roma","lang":"de","includeAgents":false}
- "in cat timp faci site-ul complet" → {"action":"upgrade_to_full"}
- "vreau sa nu mai fie demo, vreau full site" → {"action":"upgrade_to_full"}
- "cat costa site-ul real" → {"action":"upgrade_to_full"}`;

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

  const cleaned = raw?.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('interpret-request: non-JSON:', raw);
    return null;
  }
}
