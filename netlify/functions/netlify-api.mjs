/**
 * Netlify API — deploy direct cu fisiere (fara GitHub link)
 * Foloseste Netlify File Digest Deploy API
 */

import { createHash } from 'crypto';

const NETLIFY_API = 'https://api.netlify.com/api/v1';

export async function deployToNetlify(netlifyPat, siteName, files) {
  if (!netlifyPat) {
    console.error('netlify-api: NETLIFY_PAT lipsa');
    return null;
  }

  // 1. Creeaza site nou
  const siteRes = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${netlifyPat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: siteName }),
  });

  if (!siteRes.ok) {
    console.error('deployToNetlify createSite error:', await siteRes.text());
    return null;
  }

  const site = await siteRes.json();
  const siteId = site.id;
  const siteUrl = site.ssl_url || site.url;

  // 2. Calculeaza SHA1 hash pentru fiecare fisier
  const fileHashes = {};
  for (const [filePath, content] of Object.entries(files)) {
    const hash = createHash('sha1').update(content, 'utf8').digest('hex');
    fileHashes[`/${filePath}`] = hash;
  }

  // 3. Porneste deploy-ul cu lista de fisiere
  const deployRes = await fetch(`${NETLIFY_API}/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${netlifyPat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: fileHashes }),
  });

  if (!deployRes.ok) {
    console.error('deployToNetlify startDeploy error:', await deployRes.text());
    return siteUrl; // site creat, dar deploy esuat
  }

  const deploy = await deployRes.json();
  const required = deploy.required || [];

  // Mapa hash → cale fisier (fara slash initial)
  const hashToPath = {};
  for (const [fullPath, hash] of Object.entries(fileHashes)) {
    if (!hashToPath[hash]) hashToPath[hash] = fullPath.slice(1);
  }

  // 4. Uploadeaza fisierele cerute de Netlify
  for (const hash of required) {
    const filePath = hashToPath[hash];
    if (!filePath || !files[filePath]) continue;

    const uploadRes = await fetch(`${NETLIFY_API}/deploys/${deploy.id}/files/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${netlifyPat}`,
        'Content-Type': 'application/octet-stream',
      },
      body: files[filePath],
    });

    if (!uploadRes.ok) {
      console.error(`deployToNetlify upload error (${filePath}):`, await uploadRes.text());
    }
  }

  return siteUrl;
}
