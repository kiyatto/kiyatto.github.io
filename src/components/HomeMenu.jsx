import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import homeStarSvg from '../assets/graph/home-star.svg';

export function PronunciationLine({ className = '' }) {
  return (
    <p className={`text-sm font-light text-black ${className}`}>
      / kat / キャット / <span className="font-athiti">แคทรียา</span>
    </p>
  );
}

export default function HomeMenu({ currentPage = 'about' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const MENU_ITEMS = {
    about: [
      { label: 'home', to: '/' },
      { label: 'design work', to: null },
      { label: 'programming', to: null },
    ],
    design: [
      { label: 'home', to: '/' },
      { label: 'about', to: '/about' },
      { label: 'programming', to: null },
    ],
    programming: [
      { label: 'home', to: '/' },
      { label: 'about', to: '/about' },
      { label: 'design work', to: null },
    ],
  };

  const items = MENU_ITEMS[currentPage] ?? MENU_ITEMS.about;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="block cursor-pointer bg-transparent border-none p-0"
      >
        <img src={homeStarSvg} alt="" className="w-[23px] h-[23px]" draggable={false} />
      </button>

      {open && (
        <div className="absolute right-0 top-[33px] z-10 flex flex-col items-end gap-[10px] rounded bg-[rgba(140,24,63,0.14)] p-2 font-dm-mono text-xs text-black whitespace-nowrap">
          {items.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="no-underline text-black"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="text-[#888] cursor-default">
                {item.label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
