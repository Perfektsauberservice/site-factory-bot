/**
 * GitHub API helpers
 * - createGithubRepo: creeaza un repo nou sub contul asociat PAT-ului
 * - pushFilesToRepo: push toate fisierele dintr-un obiect { path: content }
 */

const GITHUB_API = 'https://api.github.com';

export async function createGithubRepo(pat, repoName, description = '') {
  const res = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      description,
      private: false,
      auto_init: true, // creeaza cu README ca sa existe branch master
    }),
  });

  if (!res.ok) {
    console.error('createGithubRepo error:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.full_name; // "username/repo-name"
}

export async function pushFilesToRepo(pat, repoFullName, files) {
  // Obtine username din PAT
  const userRes = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!userRes.ok) return false;
  const user = await userRes.json();
  const owner = user.login;
  const repo = repoFullName.includes('/') ? repoFullName.split('/')[1] : repoFullName;

  // Obtine SHA-ul README.md (necesar pentru update)
  const readmeShaRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/README.md`, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
    },
  });
  let readmeSha = null;
  if (readmeShaRes.ok) {
    const readmeData = await readmeShaRes.json();
    readmeSha = readmeData.sha;
  }

  // Push fiecare fisier
  for (const [filePath, content] of Object.entries(files)) {
    const encoded = Buffer.from(content, 'utf8').toString('base64');

    // Verifica daca fisierul exista deja (pentru SHA)
    let existingSha = null;
    if (filePath === 'README.md' && readmeSha) {
      existingSha = readmeSha;
    } else {
      const checkRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: 'application/vnd.github+json',
        },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    }

    const body = {
      message: `Add ${filePath}`,
      content: encoded,
    };
    if (existingSha) body.sha = existingSha;

    const pushRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!pushRes.ok) {
      console.error(`pushFilesToRepo: eroare la ${filePath}:`, await pushRes.text());
      // continua cu urmatorul fisier in loc sa opreasca tot
    }
  }

  return true;
}
