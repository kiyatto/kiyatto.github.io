import { useCallback, useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 5 * 60 * 1000;

async function fetchTopArtist(signal) {
  const response = await fetch(`/spotify-top-artist.json?t=${Date.now()}`, {
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Spotify data unavailable (${response.status})`);
  }

  const data = await response.json();

  if (!data?.artistName || !data?.artistUrl) {
    throw new Error('Spotify data is missing artist fields');
  }

  return {
    name: data.artistName,
    url: data.artistUrl,
    updatedAt: data.updatedAt ?? null,
  };
}

export function useSpotifyTopArtist() {
  const [artist, setArtist] = useState(null);
  const [status, setStatus] = useState('loading');
  const artistRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const controller = new AbortController();
      const nextArtist = await fetchTopArtist(controller.signal);

      if (
        artistRef.current?.name !== nextArtist.name ||
        artistRef.current?.url !== nextArtist.url
      ) {
        artistRef.current = nextArtist;
        setArtist(nextArtist);
      }

      setStatus('ready');
    } catch {
      setStatus((prev) => (artistRef.current ? 'ready' : prev === 'loading' ? 'error' : prev));
    }
  }, []);

  useEffect(() => {
    refresh();
    const intervalId = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [refresh]);

  return { artist, status };
}
