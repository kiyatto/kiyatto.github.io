import { useCallback, useEffect, useRef, useState } from "react";

const CELL = 5;
const COLOR = "#3765FD";
const DURATION_MS = 1500;
const STORAGE_KEY = "pixel-trail-enabled";
const TIME_ZONE = "America/Los_Angeles";

const formatSeattleTime = (date = new Date()) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);

/**
 * Lights 5×5 CSS-pixel cells under the cursor to #3765FD, then clears
 * them after 1.5s. Includes footer toggle, coords, and Seattle time.
 * Canvas is DPR-scaled so CELL always maps to CSS pixels (not stretched).
 */
const PixelTrail = () => {
  const canvasRef = useRef(null);
  const coordsRef = useRef(null);
  const timeRef = useRef(null);
  const enabledRef = useRef(true);
  const apiRef = useRef(null);

  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === "1";
    } catch {
      return true;
    }
  });

  enabledRef.current = enabled;

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore quota / private mode */
      }
      if (!next) apiRef.current?.clearAll();
      return next;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const coordsEl = coordsRef.current;
    const timeEl = timeRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const lit = new Map();
    let rafId = 0;
    let lastCx = -1;
    let lastCy = -1;
    let lastCoordX = -1;
    let lastCoordY = -1;
    let cssW = 0;
    let cssH = 0;

    const syncSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.max(1, (w * dpr) | 0);
      const bh = Math.max(1, (h * dpr) | 0);

      if (canvas.width !== bw || canvas.height !== bh || cssW !== w || cssH !== h) {
        lit.clear();
        canvas.width = bw;
        canvas.height = bh;
        // Explicit CSS size so the bitmap isn't stretched by inset-0 alone.
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cssW = w;
        cssH = h;
        lastCx = -1;
        lastCy = -1;
      }
    };

    const paintCell = (cx, cy) => {
      ctx.fillStyle = COLOR;
      ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL);
    };

    const clearCell = (cx, cy) => {
      ctx.clearRect(cx * CELL, cy * CELL, CELL, CELL);
    };

    const clearAll = () => {
      lit.clear();
      lastCx = -1;
      lastCy = -1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    apiRef.current = { clearAll };

    const tick = (now) => {
      for (const [key, expireAt] of lit) {
        if (now >= expireAt) {
          clearCell(key & 0xffff, key >>> 16);
          lit.delete(key);
        }
      }
      rafId = lit.size > 0 ? requestAnimationFrame(tick) : 0;
    };

    const ensureTick = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const updateCoords = (x, y) => {
      if (!coordsEl || (x === lastCoordX && y === lastCoordY)) return;
      lastCoordX = x;
      lastCoordY = y;
      coordsEl.textContent = `${x}, ${y}`;
    };

    const lightAt = (clientX, clientY) => {
      const x = clientX | 0;
      const y = clientY | 0;
      updateCoords(x, y);

      if (!enabledRef.current) return;

      const cx = (clientX / CELL) | 0;
      const cy = (clientY / CELL) | 0;

      if (cx < 0 || cy < 0 || (cx + 1) * CELL > cssW || (cy + 1) * CELL > cssH) {
        return;
      }

      const key = (cy << 16) | cx;
      const now = performance.now();
      const sameCell = cx === lastCx && cy === lastCy;
      lastCx = cx;
      lastCy = cy;

      if (!lit.has(key)) paintCell(cx, cy);
      else if (sameCell) {
        lit.set(key, now + DURATION_MS);
        ensureTick();
        return;
      }
      lit.set(key, now + DURATION_MS);
      ensureTick();
    };

    const onPointerMove = (e) => {
      const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : null;
      if (events && events.length > 1) {
        for (const ev of events) lightAt(ev.clientX, ev.clientY);
      } else {
        lightAt(e.clientX, e.clientY);
      }
    };

    const syncTime = () => {
      if (!timeEl) return;
      const next = `${formatSeattleTime()}    SEATTLE, WA`;
      if (timeEl.textContent !== next) timeEl.textContent = next;
    };

    syncSize();
    syncTime();
    const timeInterval = window.setInterval(syncTime, 1000);
    window.addEventListener("resize", syncSize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", syncSize);
      window.removeEventListener("pointermove", onPointerMove);
      window.clearInterval(timeInterval);
      if (rafId) cancelAnimationFrame(rafId);
      lit.clear();
      apiRef.current = null;
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] flex items-center justify-between bg-transparent px-10 py-5">
        <p
          ref={timeRef}
          className="m-0 font-dm-mono text-xs font-normal leading-normal text-black whitespace-pre"
        >
          {`${formatSeattleTime()}    SEATTLE, WA`}
        </p>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            className={`pointer-events-auto cursor-pointer border-none bg-transparent p-0 font-dm-mono text-xs font-medium leading-normal ${
              enabled ? "text-[#3765fd]" : "text-[#9f9f9f]"
            }`}
          >
            CURSOR: {enabled ? "ON" : "OFF"}
          </button>
          <p
            ref={coordsRef}
            className="m-0 min-w-[5.5em] text-right font-gantari text-xs font-normal leading-normal text-black tabular-nums"
          >
            0, 0
          </p>
        </div>
      </div>
    </>
  );
};

export default PixelTrail;
