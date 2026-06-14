/**
 * One-time helper to obtain a Spotify refresh token.
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/get-spotify-refresh-token.mjs
 *
 * 1. Open the printed URL in your browser and approve access.
 * 2. Paste the full redirect URL from the address bar when Spotify sends you back.
 * 3. Copy the refresh_token from the script output into GitHub Actions secrets.
 */

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:8888/callback';
const scopes = ['user-top-read'];

if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('scope', scopes.join(' '));

console.log('\nOpen this URL and approve access:\n');
console.log(authUrl.toString());
console.log('\nAfter approval, paste the full redirect URL here.\n');

const rl = createInterface({ input, output });
const redirectUrl = await rl.question('Redirect URL: ');
rl.close();

const code = new URL(redirectUrl.trim()).searchParams.get('code');
if (!code) {
  console.error('No authorization code found in the redirect URL.');
  process.exit(1);
}

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
  console.error('Token exchange failed:', await tokenResponse.text());
  process.exit(1);
}

const tokens = await tokenResponse.json();
console.log('\nAdd this refresh token as SPOTIFY_REFRESH_TOKEN:\n');
console.log(tokens.refresh_token);
