import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import AboutView from './components/AboutView.jsx';
import WorkPage from './components/WorkPage.jsx';
import LibraryView from './components/LibraryView.jsx';

function App() {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

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

  return (
    <BrowserRouter>
      <div className="relative h-dvh">
        <div ref={headerRef} className="absolute inset-x-0 top-0 z-10">
          <Header />
        </div>
        <main
          className="h-full overflow-auto"
          style={{ paddingTop: headerHeight, paddingBottom: headerHeight }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/reading-list" element={<LibraryView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
