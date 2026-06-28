/**
 * One-time helper to obtain a Spotify refresh token.
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/get-spotify-refresh-token.mjs
 *
 * Starts a local callback server, opens your browser, and prints the refresh token
 * after you approve access in Spotify.
 */

import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:8888/callback';
const scopes = ['user-top-read'];

if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const redirect = new URL(redirectUri);
const callbackPath = redirect.pathname || '/callback';
const port = redirect.port ? Number(redirect.port) : redirect.protocol === 'https:' ? 443 : 80;
const hostname = redirect.hostname;

const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('scope', scopes.join(' '));

function sendHtml(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(body);
}

async function exchangeCodeForTokens(code) {
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Token exchange failed: ${await tokenResponse.text()}`);
  }

  return tokenResponse.json();
}

async function openBrowser(url) {
  if (process.platform === 'darwin') {
    await execFileAsync('open', [url]);
    return;
  }
  if (process.platform === 'win32') {
    await execFileAsync('cmd', ['/c', 'start', '', url]);
    return;
  }
  await execFileAsync('xdg-open', [url]);
}

const code = await new Promise((resolve, reject) => {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host}`);

      if (requestUrl.pathname !== callbackPath) {
        sendHtml(res, 404, '<p>Not found.</p>');
        return;
      }

      const error = requestUrl.searchParams.get('error');
      if (error) {
        sendHtml(
          res,
          400,
          `<p>Spotify authorization failed: ${error}</p><p>You can close this tab.</p>`,
        );
        server.close();
        reject(new Error(`Spotify authorization failed: ${error}`));
        return;
      }

      const authorizationCode = requestUrl.searchParams.get('code');
      if (!authorizationCode) {
        sendHtml(res, 400, '<p>Missing authorization code.</p>');
        return;
      }

      sendHtml(
        res,
        200,
        '<p>Authorization successful. Return to your terminal for the refresh token.</p><p>You can close this tab.</p>',
      );
      server.close();
      resolve(authorizationCode);
    } catch (err) {
      server.close();
      reject(err);
    }
  });

  server.on('error', reject);

  server.listen(port, hostname, async () => {
    console.log(`\nListening for Spotify callback at ${redirectUri}`);
    console.log('\nOpening browser for Spotify login...\n');
    console.log(`If the browser does not open, visit:\n${authUrl.toString()}\n`);

    try {
      await openBrowser(authUrl.toString());
    } catch {
      console.warn('Could not open a browser automatically. Use the URL above manually.');
    }
  });

  setTimeout(() => {
    server.close();
    reject(new Error('Timed out waiting for Spotify authorization (5 minutes).'));
  }, 5 * 60 * 1000).unref();
});

const tokens = await exchangeCodeForTokens(code);

if (!tokens.refresh_token) {
  console.error('Spotify did not return a refresh token.');
  process.exit(1);
}

console.log('\nAdd this refresh token as SPOTIFY_REFRESH_TOKEN in GitHub Actions secrets:\n');
console.log(tokens.refresh_token);
console.log('');
