/**
 * Netlify API helpers
 * - createNetlifySite: creeaza un site Netlify conectat la un repo GitHub
 * Returneaza URL-ul live al site-ului
 */

const NETLIFY_API = 'https://api.netlify.com/api/v1';

export async function createNetlifySite(netlifyPat, accountSlug, repoFullName, githubPat) {
  if (!netlifyPat || !accountSlug) {
    console.error('netlify-api: NETLIFY_PAT sau NETLIFY_ACCOUNT_SLUG lipsa');
    return null;
  }

  // Obtine installation ID GitHub pentru Netlify (necesar pentru linking)
  // Mai simplu: cream site fara GitHub link si uploadam fisierele direct via Netlify API

  // Varianta simplificata: creeaza site gol, returneaza URL si lasam GitHub Pages ca fallback
  const siteName = repoFullName.split('/').pop(); // doar numele repo-ului

  const res = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${netlifyPat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: siteName,
      account_slug: accountSlug,
      repo: {
        provider: 'github',
        repo: repoFullName,
        branch: 'main',
        deploy_key_id: null,
        cmd: '',
        dir: '.',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('createNetlifySite error:', errText);

    // Fallback: incearca fara repo linking (manual deploy)
    return await createNetlifySiteManual(netlifyPat, siteName);
  }

  const data = await res.json();
  return data.ssl_url || data.url || null;
}

async function createNetlifySiteManual(netlifyPat, siteName) {
  // Creeaza site gol — va fi populat prin GitHub Pages sau manual deploy
  const res = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${netlifyPat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: siteName }),
  });

  if (!res.ok) {
    console.error('createNetlifySiteManual error:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.ssl_url || data.url || null;
}

export async function triggerDeploy(netlifyPat, siteId) {
  const res = await fetch(`${NETLIFY_API}/sites/${siteId}/builds`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${netlifyPat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  return res.ok;
}
