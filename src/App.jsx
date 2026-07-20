import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import AboutView from './components/AboutView.jsx';
import WorkPage from './components/WorkPage.jsx';
import SpotifyTagsPage from './components/SpotifyTagsPage.jsx';
import LibraryView from './components/LibraryView.jsx';

function AppShell() {
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const lastScrollY = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const { pathname } = useLocation();

  // The header is overlaid on top of the main content so that content can be
  // centered relative to the whole viewport. We measure its height and reserve
  // an equal amount of space above and below the content, which keeps the
  // centering symmetric and prevents the header from hiding the topmost content
  // when the page overflows and is scrolled to the top.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Always show the header after navigating to a new page.
  useEffect(() => {
    setHeaderHidden(false);
    lastScrollY.current = mainRef.current?.scrollTop ?? 0;
  }, [pathname]);

  // Hide the header when scrolling down; reveal it again when scrolling up.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const threshold = 8;

    const onScroll = () => {
      const currentY = main.scrollTop;
      const delta = currentY - lastScrollY.current;

      if (currentY <= headerHeight) {
        setHeaderHidden(false);
      } else if (delta > threshold) {
        setHeaderHidden(true);
      } else if (delta < -threshold) {
        setHeaderHidden(false);
      }

      lastScrollY.current = currentY;
    };

    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, [headerHeight]);

  return (
    <div className="relative h-dvh">
      <div
        ref={headerRef}
        className={`absolute inset-x-0 top-0 z-10 transition-transform duration-300 ease-out ${
          headerHidden ? '-translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
      >
        <Header />
      </div>
      <main
        ref={mainRef}
        className="h-full overflow-auto"
        style={{ paddingTop: headerHeight, paddingBottom: headerHeight }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/spotify-tags" element={<SpotifyTagsPage />} />
          <Route path="/reading-list" element={<LibraryView />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
