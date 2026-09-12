import { Link, NavLink, useLocation } from 'react-router';
import homeMark from '../assets/home_node.svg';

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
      <Link
        to="/"
        aria-label="Home"
        className={`absolute left-10 top-0 m-0 hidden items-center gap-2 font-dm-mono text-xs font-light leading-normal text-black no-underline whitespace-nowrap md:flex ${
          isGraphPage ? 'h-14' : 'h-full'
        }`}
      >
        <img src={homeMark} alt="" className="h-full w-auto object-contain" />
        {/* <span>kat ong / キャット / แคทรียา</span> */}
      </Link>
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
