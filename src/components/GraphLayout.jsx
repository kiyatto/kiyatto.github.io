import { Outlet, useLocation } from "react-router";

import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";

const SCROLL_PATHS = new Set(["/work", "/reading-list"]);

/**
 * Shared chrome for home / about / work / library.
 * PixelTrail and Graph stay mounted so the force layout is not redrawn
 * when only the left-column page content swaps.
 */
const GraphLayout = () => {
  const { pathname } = useLocation();
  const isScrollPage = SCROLL_PATHS.has(pathname);

  const rowClass = isScrollPage
    ? "flex w-full flex-col items-center gap-10 pt-20 pb-0 md:min-h-0 md:h-full md:flex-1 md:flex-row md:items-center md:gap-[clamp(2.5rem,6vw,5rem)] md:pt-0"
    : "flex w-full flex-col items-center gap-10 py-20 md:min-h-0 md:flex-1 md:flex-row md:items-center md:gap-10 md:py-0";

  return (
    <>
      <PixelTrail />
      <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
        <div className={rowClass}>
          <Outlet />
          {/* desktop nav; mobile uses Header. Fixed box so Graph does not
              redraw when left-column height changes between pages. */}
          <div className="hidden h-[342px] min-h-[280px] w-[min(400px,38vw)] max-h-[342px] shrink-0 items-center justify-center self-center md:flex">
            <Graph />
          </div>
        </div>
      </div>
    </>
  );
};

export default GraphLayout;
