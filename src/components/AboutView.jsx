import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Graph from './Graph.jsx';
import HomeMenu from './HomeMenu.jsx';
import hikingImg from '../assets/hiking.JPEG';
import icecreamImg from '../assets/icecream.JPG';
import hollowknightImg from '../assets/hollowknight.JPG';

/** Figma 790:89 — pill cursors on about gallery images */
const ABOUT_IMAGE_CURSORS = {
  hiking: {
    bg: '#7f3af6',
    lines: ['at mailbox peak!'],
    className: 'h-5 px-3',
  },
  icecream: {
    bg: '#dd6c92',
    lines: ['ice cream ', '@ kamonegi'],
    className: 'min-h-[30px] px-[10px] py-[3px]',
  },
  hollowknight: {
    bg: '#272d44',
    lines: ['hollow knight'],
    className: 'h-[22px] px-3',
  },
};

const NOTION_EMBED_BASE =
  'https://maiakamaboko.notion.site/ebd//2e744d4fe20b8040808bcf8f9213a173?v=2e744d4fe20b81a889ec000c66a73983';

const NOTION_EMBED_URL = (() => {
  const url = new URL(NOTION_EMBED_BASE);
  url.searchParams.set('theme', 'light');
  return url.toString();
})();

const ABOUT_COL_TEXT_W = 381;
const ABOUT_COL_GRAPH_W = 140;
const ABOUT_GAP_MIN = 24;
/** Minimum content width before columns collide — switch to stacked medium layout */
const ABOUT_DESKTOP_MIN_WIDTH =
  ABOUT_COL_TEXT_W +
  ABOUT_GAP_MIN +
  489 +
  ABOUT_GAP_MIN +
  ABOUT_COL_GRAPH_W;

const GALLERY_HIKING_H = 343;
const GALLERY_GAP = 10;
const GALLERY_THUMB_H = 180;
const ABOUT_GALLERY_H = GALLERY_HIKING_H + GALLERY_GAP + GALLERY_THUMB_H;

function getDesktopRowWidth(containerWidth) {
  const horizontalPadding = containerWidth >= 1024 ? 100 : 48;
  return containerWidth - horizontalPadding;
}

function resolveAboutLayoutMode(containerWidth, isMdUp) {
  if (!isMdUp) return 'small';
  return getDesktopRowWidth(containerWidth) >= ABOUT_DESKTOP_MIN_WIDTH
    ? 'desktop'
    : 'medium';
}

/** Stable width for layout breakpoints — avoids Safari scrollbar feedback loops. */
function getAboutContainerWidth() {
  if (typeof window === 'undefined') return 0;
  return Math.min(window.innerWidth, 1200);
}

function getInitialAboutLayoutMode() {
  if (typeof window === 'undefined') return 'small';
  const isMdUp = window.matchMedia('(min-width: 768px)').matches;
  return resolveAboutLayoutMode(getAboutContainerWidth(), isMdUp);
}

function useAboutLayoutMode() {
  const [mode, setMode] = useState(getInitialAboutLayoutMode);

  useEffect(() => {
    const mdMq = window.matchMedia('(min-width: 768px)');

    const update = () => {
      const next = resolveAboutLayoutMode(getAboutContainerWidth(), mdMq.matches);
      setMode((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener('resize', update);
    mdMq.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mdMq.removeEventListener('change', update);
    };
  }, []);

  return mode;
}

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return fine;
}

function blockScrollDelta(e) {
  e.preventDefault();
  e.stopPropagation();
}

function AboutImageCursor({ config, x, y }) {
  if (!config) return null;

  return createPortal(
    <div
      className={`fixed z-[9999] pointer-events-none flex flex-col justify-center rounded-[20px] font-dm-mono text-[9px] font-normal leading-normal text-white ${config.className}`}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        backgroundColor: config.bg,
      }}
      aria-hidden="true"
    >
      {config.lines.map((line) => (
        <p key={line} className="mb-0 whitespace-pre">
          {line}
        </p>
      ))}
    </div>,
    document.body,
  );
}

function AboutPhoto({ src, alt, className = '', style, cursorKey, cursorEnabled = true }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cursorConfig =
    cursorEnabled && cursorKey ? ABOUT_IMAGE_CURSORS[cursorKey] : null;

  return (
    <>
      <div
        className={`overflow-hidden rounded-[4px] ${cursorConfig ? 'cursor-none' : ''} ${className}`}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      >
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-cover"
          draggable={false}
        />
      </div>
      {hovered && cursorConfig && (
        <AboutImageCursor config={cursorConfig} x={pos.x} y={pos.y} />
      )}
    </>
  );
}

function AboutBio({ className = '' }) {
  return (
    <div className={`text-[13px] md:text-sm font-extralight md:font-light leading-5 text-black ${className}`}>
      <p className="mb-0">
        Hi there! I&apos;m currently a sophomore studying computer science, linguistics, and informatics at the University of Washington. I love manipulating language in both literary and computational ways, designing creative interfaces with intention, and learning about + building computer systems.
      </p>
      <p className="mb-0">&nbsp;</p>
      <p className="mb-0">
        In my practically non-existent free time, I like to read, cook while barely avoiding setting the kitchen on fire, and rack up way too many hours on Cyberpunk 2077.
      </p>
    </div>
  );
}

function AboutText({ className = '', titleClassName = 'text-[26px]' }) {
  return (
    <div className={`flex flex-col gap-[40px] shrink-0 ${className}`}>
      <h1 className={`font-semibold text-[#222] ${titleClassName}`}>kat ong</h1>
      <AboutBio />
    </div>
  );
}

function ImageGallery({ layout = 'desktop' }) {
  const cursorEnabled = useFinePointer();

  if (layout === 'mobile' || layout === 'medium') {
    const thumbClass =
      layout === 'medium'
        ? 'flex-1 min-w-0 aspect-[4/3]'
        : 'w-[135px] h-[101.25px] shrink-0';

    return (
      <div className="flex flex-col gap-[10px] w-full overflow-hidden">
        <AboutPhoto
          src={hikingImg}
          alt="Hiking in the mountains"
          className="w-full aspect-[489/343]"
          cursorKey="hiking"
          cursorEnabled={cursorEnabled}
        />
        <div className="flex gap-[10px] w-full">
          <AboutPhoto
            src={icecreamImg}
            alt="Ice cream"
            className={thumbClass}
            cursorKey="icecream"
            cursorEnabled={cursorEnabled}
          />
          <AboutPhoto
            src={hollowknightImg}
            alt="Hollow Knight mask"
            className={thumbClass}
            cursorKey="hollowknight"
            cursorEnabled={cursorEnabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] w-[489px] shrink-0 items-start">
      <AboutPhoto
        src={hikingImg}
        alt="Hiking in the mountains"
        className="w-full aspect-[489/343]"
        cursorKey="hiking"
        cursorEnabled={cursorEnabled}
      />
      <div className="flex gap-[10px]">
        <AboutPhoto
          src={icecreamImg}
          alt="Ice cream"
          className="w-[240px] h-[180px] shrink-0"
          cursorKey="icecream"
          cursorEnabled={cursorEnabled}
        />
        <AboutPhoto
          src={hollowknightImg}
          alt="Hollow Knight mask"
          className="w-[240px] h-[180px] shrink-0"
          cursorKey="hollowknight"
          cursorEnabled={cursorEnabled}
        />
      </div>
    </div>
  );
}

function RecentReads({ variant = 'stacked' }) {
  const cropRef = useRef(null);
  const isDesktopColumn = variant === 'desktop';

  useEffect(() => {
    const el = cropRef.current;
    if (!el) return;

    const blockTouchMove = (e) => {
      e.preventDefault();
    };

    const shields = el.querySelectorAll('.notion-embed-shield');
    shields.forEach((shield) => {
      shield.addEventListener('wheel', blockScrollDelta, { passive: false });
      shield.addEventListener('touchmove', blockTouchMove, { passive: false });
    });
    return () => {
      shields.forEach((shield) => {
        shield.removeEventListener('wheel', blockScrollDelta);
        shield.removeEventListener('touchmove', blockTouchMove);
      });
    };
  }, []);

  return (
    <div
      className={`flex flex-col gap-5 text-sm text-black w-full shrink-0 ${
        isDesktopColumn ? 'min-h-0 flex-1 overflow-hidden' : ''
      }`}
    >
      <p className="font-dm-mono shrink-0">recent reads:</p>
      <div
        ref={cropRef}
        className={`notion-embed-crop notion-embed-crop--mobile w-full shrink-0 rounded ${
          isDesktopColumn ? 'h-auto min-h-0 flex-1' : 'h-[210px]'
        }`}
      >
        <div className="notion-embed-shield notion-embed-shield--top" aria-hidden="true" />
        <div className="notion-embed-shield notion-embed-shield--bottom" aria-hidden="true" />
        <p>coming soon!</p>
        {/* <iframe
          src={NOTION_EMBED_URL}
          title="Recent reads"
          className="notion-embed-iframe bg-transparent"
          loading="lazy"
          allowFullScreen
        /> */}
      </div>
    </div>
  );
}

function AboutDesktopPanel() {
  return (
    <div
      className="flex w-full items-center justify-between gap-6 xl:gap-8"
      style={{ minHeight: ABOUT_GALLERY_H }}
    >
      <div className="flex min-w-0 items-start shrink gap-12">
        <div
          className="flex flex-col gap-[40px] shrink-0 min-h-0 overflow-hidden"
          style={{
            width: ABOUT_COL_TEXT_W,
            height: ABOUT_GALLERY_H,
            maxHeight: ABOUT_GALLERY_H,
          }}
        >
          <AboutText />
          <hr className="border-0 border-t border-[#ccc] w-full shrink-0" />
          <RecentReads variant="desktop" />
        </div>
        <div className="shrink w-[50px] min-w-[24px]" aria-hidden="true" />
        <ImageGallery layout="desktop" />
      </div>
      <div
        className="shrink-0 flex justify-end self-center"
        style={{ width: ABOUT_COL_GRAPH_W }}
      >
        <Graph variant="comp-about" />
      </div>
    </div>
  );
}

/** Stacked layout (Figma 670:542) — mobile narrow column or medium wider column */
function AboutStackedLayout({ contentMaxWidth, galleryLayout, titleClassName }) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-start px-6 py-[46px] sm:px-10 md:px-12">
      <div
        className={`w-full ${contentMaxWidth} mx-auto flex flex-col gap-[40px]`}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <h1 className={`font-semibold text-[#222] min-w-0 ${titleClassName}`}>
            kat ong
          </h1>
          <HomeMenu currentPage="about" />
        </div>

        <AboutBio />

        <ImageGallery layout={galleryLayout} />

        <hr className="border-0 border-t border-[#ccc] w-full shrink-0" />

        <RecentReads />
      </div>
    </div>
  );
}

const AboutView = () => {
  const layoutMode = useAboutLayoutMode();

  return (
    <div className="min-h-screen flex w-full bg-[#f3f3f3] max-md:bg-white font-gantari">
      {layoutMode === 'desktop' && (
        <div className="min-h-screen flex w-full items-center pl-6 lg:pl-[50px] pr-4 sm:pr-6 lg:pr-8 py-10">
          <AboutDesktopPanel />
        </div>
      )}

      {layoutMode !== 'desktop' && (
        <div className="w-full max-w-[1200px] mx-auto">
          {layoutMode === 'medium' && (
            <AboutStackedLayout
              contentMaxWidth="max-w-[480px]"
              galleryLayout="medium"
              titleClassName="text-[26px]"
            />
          )}

          {layoutMode === 'small' && (
            <AboutStackedLayout
              contentMaxWidth="max-w-[280px]"
              galleryLayout="mobile"
              titleClassName="text-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AboutView;
