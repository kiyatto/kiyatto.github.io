import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  console.error(
    'Missing Spotify credentials. Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN.',
  );
  process.exit(1);
}

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
  },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }),
});

if (!tokenResponse.ok) {
  console.error('Failed to refresh Spotify access token:', await tokenResponse.text());
  process.exit(1);
}

const { access_token: accessToken } = await tokenResponse.json();

const artistResponse = await fetch(
  'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1',
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
);

if (!artistResponse.ok) {
  console.error('Failed to fetch top artist:', await artistResponse.text());
  process.exit(1);
}

const { items } = await artistResponse.json();
const topArtist = items?.[0];

if (!topArtist?.name || !topArtist?.external_urls?.spotify) {
  console.error('Spotify returned no short-term top artist.');
  process.exit(1);
}

const payload = {
  artistName: topArtist.name.toLowerCase(),
  artistUrl: topArtist.external_urls.spotify,
  updatedAt: new Date().toISOString(),
};

const outputPath = resolve('public/spotify-top-artist.json');
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Updated ${outputPath} with ${payload.artistName}`);
