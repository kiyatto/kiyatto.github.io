import { useEffect, useRef, useState } from 'react';
import { Routes, useLocation } from 'react-router-dom';

const FADE_MS = 300;

/**
 * Brief cross-fade between routes so page changes are not instantaneous.
 * Uses a frozen route location during fade-out, then swaps and fades in.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [visible, setVisible] = useState(true);
  const pendingRef = useRef(location);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.pathname === displayLocation.pathname) return;

    pendingRef.current = location;

    const rafId = requestAnimationFrame(() => {
      setVisible(false);
    });

    const timer = window.setTimeout(() => {
      setDisplayLocation(pendingRef.current);
      setVisible(true);
    }, FADE_MS);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timer);
    };
  }, [location, displayLocation.pathname]);

  return (
    <div
      className={`page-transition-root min-h-screen transition-opacity ease-in-out ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}
