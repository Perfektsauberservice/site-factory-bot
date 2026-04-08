# Site Factory Bot — Setup

## Ce face acest bot

Trimiti pe Telegram (vocal sau text): **"fa un site pentru o frizerie in Gaggenau"**
Botul genereaza automat:
- Site demo profesional in germana
- Repo GitHub nou
- Deploy live pe Netlify
- Agenti specifici (blog SEO, notificari lead, review requester)
- Trimite link-ul de prezentat clientului

---

## Pasul 1 — Creeaza bot Telegram nou

1. Deschide Telegram → cauta **@BotFather**
2. Trimite `/newbot`
3. Alege un nume (ex: `Site Factory`) si username (ex: `myfactory_bot`)
4. Copiaza tokenul primit

---

## Pasul 2 — Obtine chat_id-ul tau

1. Trimite orice mesaj catre noul bot
2. Deschide in browser: `https://api.telegram.org/botTOKEN/getUpdates`
3. Gaseste `"chat":{"id":XXXXXXX}` — acesta e chat_id-ul tau

---

## Pasul 3 — Creeaza repo GitHub

1. Mergi la github.com → New repository
2. Nume: `site-factory-bot`
3. Public
4. **NU** bifa "Add README"
5. Urca fisierele din acest folder in repo

---

## Pasul 4 — Deploy pe Netlify

1. netlify.com → Add new site → Import from GitHub
2. Selecteaza repo-ul `site-factory-bot`
3. Build command: (gol)
4. Publish directory: `.`
5. Deploy

---

## Pasul 5 — Env vars in Netlify

Settings → Environment Variables → adauga:

| Variabila | Valoare |
|-----------|---------|
| `TELEGRAM_BOT_TOKEN` | tokenul de la BotFather |
| `TELEGRAM_CHAT_ID` | chat_id-ul tau |
| `ANTHROPIC_API_KEY` | cheia Anthropic (aceeasi ca la perfektsauberservice) |
| `GITHUB_PAT` | Personal Access Token GitHub (scopes: repo) |
| `NETLIFY_PAT` | Netlify Personal Access Token (netlify.com → User Settings → OAuth) |
| `NETLIFY_ACCOUNT_SLUG` | slug-ul contului Netlify (apare in URL: app.netlify.com/teams/SLUG) |
| `OPENAI_API_KEY` | (optional) pentru transcrierea vocala cu Whisper |

---

## Pasul 6 — Inregistreaza webhook Telegram

Dupa deploy, ruleaza o singura data in Git Bash (inlocuieste TOKEN):

```bash
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://SITE_TU.netlify.app/.netlify/functions/telegram-bot"}'
```

---

## Gata! Testeaza

Trimite in Telegram: `/help`
Apoi: `fa un site pentru o frizerie in Gaggenau`

---

## Comenzi disponibile

- `/help` — lista comenzi
- `fa un site pentru o [tip business] in [oras]` — genereaza site demo
- Vocal: vorbeste direct (necesita OPENAI_API_KEY)
