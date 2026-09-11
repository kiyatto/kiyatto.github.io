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

const GRAPH_PATHS = new Set(['/', '/about', '/work', '/reading-list']);

const Header = () => {
  const { pathname } = useLocation();
  // Graph pages use the force-directed graph for nav on desktop; the pill
  // bar is the mobile nav instead. The nameplate stays visible on desktop.
  const isGraphPage = GRAPH_PATHS.has(pathname);

  return (
    <header className="relative z-10">
      <p className="pointer-events-none absolute left-10 top-5 m-0 hidden font-dm-mono text-xs font-light leading-normal text-black whitespace-nowrap md:block">
        KATREEYA ONG ・ キャット ・ แคทรียา
      </p>
      <div
        className={`flex items-center justify-center px-10 py-8 ${
          isGraphPage ? 'md:hidden' : ''
        }`}
      >
        <NavBar />
      </div>
    </header>
  );
};

export default Header;
