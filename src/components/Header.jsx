import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useSpotifyTopArtist } from '../hooks/useSpotifyTopArtist.js';
import { useWorldClocks } from '../hooks/useWorldClocks.js';

import moonIcon from '../assets/moon.svg';
import sunIcon from '../assets/sun.svg';

const SoundwaveIcon = () => {
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

const CurrentlyListening = () => {
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

const WorldClocks = () => {
  const clocks = useWorldClocks();
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = clocks[selectedIndex];

  // close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (ref.current && !ref.current.contains(e.target)) {
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <div ref={ref} className="relative hidden min-[1048px]:block">
      {/* trigger */}
      <div
        // onClick={() => setOpen(o => !o)}
        className="flex items-center gap-4 font-dm-mono text-xs text-[#9f9f9f] whitespace-nowrap bg-transparent border-none"
      >
        {selected.isNight ? <img src={moonIcon} alt="Moon" /> : <img src={sunIcon} alt="Sun" />}
        {selected.time} | {selected.label}
      </div>

      {/* dropdown
      {open && (
        <ul className="absolute right-0 z-50 min-w-max">
          {clocks.map((clock, i) => (
            <li key={clock.label}>
              <button
                onClick={() => { setSelectedIndex(i); setOpen(false); }}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 font-dm-mono text-xs text-[#545454] hover:bg-[#d9d9d9] cursor-pointer bg-transparent border-none text-left"
              >
                {clock.time} | {clock.label}
              </button>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

const NavBar = () => {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  return (

    <nav className="w-[300px] sm:w-[360px] flex-shrink-0 bg-[#E9E9E9] rounded-[10px] px-[12px] py-[6px]">
      <ul className="flex flex-row justify-between items-center">
        {[
          { to: '/', label: 'home' },
          { to: '/about', label: 'about' },
          { to: '/work', label: 'work' },
          { to: '/reading-list', label: 'library' },
        ].map(({ to, label }) => (
          <li key={ to }>
            <NavLink to={ to } 
            end 
            className={({ isActive }) => `text-xs no-underline ${ isActive ? 'font-medium text-[#545454]' : 'font-normal text-[#868686]'}`}>
              { label }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const Header = () => {
  return (
    <header className="relative z-10 flex justify-center min-[1048px]:grid min-[1048px]:grid-cols-3 items-center px-10 py-8">
      {/* spotify */}
      <div className="hidden min-[1048px]:flex">
        <CurrentlyListening />
      </div>

      <div className="flex justify-center">
        <NavBar />
      </div>

      {/* time */}
      <div className="hidden min-[1048px]:flex justify-end">
        <WorldClocks />
      </div>
    </header>
  );
}

export default Header;
