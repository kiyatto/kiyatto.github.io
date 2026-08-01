import { NavLink, useLocation } from 'react-router';

const NavBar = () => {
  return (
    <nav className="w-[300px] flex-shrink-0 rounded-[10px] bg-[#E9E9E9] px-[12px] py-[6px] sm:w-[360px]">
      <ul className="flex flex-row items-center justify-between">
        {[
          { to: '/', label: 'home', end: true },
          { to: '/about', label: 'about', end: true },
          { to: '/work', label: 'work', end: false },
          { to: '/reading-list', label: 'library', end: true },
        ].map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-xs no-underline ${
                  isActive ? 'font-medium text-[#545454]' : 'font-normal text-[#868686]'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Header = () => {
  const { pathname } = useLocation();
  // Graph pages use PixelTrail chrome + graph nav instead of the pill bar.
  if (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/work' ||
    pathname === '/reading-list'
  ) {
    return null;
  }

  return (
    <header className="relative z-10 flex items-center justify-center px-10 py-8">
      <NavBar />
    </header>
  );
};

export default Header;
