import { useSpotifyTopArtist } from '../hooks/useSpotifyTopArtist.js';
import { useWorldClocks } from '../hooks/useWorldClocks.js';

function SoundwaveIcon() {
  return (
    <div
      className="flex h-[18px] w-6 shrink-0 items-center justify-center gap-[3px]"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className={`soundwave-bar soundwave-bar-${index + 1} w-[3px] rounded-sm bg-[#9f9f9f]`}
        />
      ))}
    </div>
  );
}

function CurrentlyListening() {
  const { artist, status } = useSpotifyTopArtist();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <SoundwaveIcon />
      <p className="m-0 min-w-0 truncate font-dm-mono text-xs leading-[18px] text-[#9f9f9f]">
        <span>kat is listening to: </span>
        {artist ? (
          <a
            href={artist.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#9f9f9f] underline decoration-solid underline-offset-[3px]"
          >
            {artist.name}
          </a>
        ) : (
          <span className="text-[#9f9f9f]/70">
            {status === 'error' ? 'unavailable' : '…'}
          </span>
        )}
      </p>
    </div>
  );
}

function WorldClocks() {
  const clocks = useWorldClocks();

  return (
    <p className="hidden font-dm-mono text-xs text-[#9f9f9f] whitespace-nowrap md:block">
      {clocks}
    </p>
  );
}

function Header() {
  return (
    <header className="relative px-[42px] pt-7 md:px-[49px]">
      <div className="flex items-center justify-between gap-6">
        <CurrentlyListening />
        <WorldClocks />
      </div>
    </header>
  );
}

export default Header;
