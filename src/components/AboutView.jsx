import { useEffect, useRef, useState } from 'react';
import Graph from './Graph.jsx';
import HomeMenu from './HomeMenu.jsx';
import hikingImg from '../assets/hiking.JPEG';
import icecreamImg from '../assets/icecream.JPG';
import hollowknightImg from '../assets/hollowknight.JPG';

const NOTION_EMBED_BASE =
  'https://maiakamaboko.notion.site/ebd//2e744d4fe20b8040808bcf8f9213a173?v=2e744d4fe20b81a889ec000c66a73983';

const NOTION_EMBED_URL = (() => {
  const url = new URL(NOTION_EMBED_BASE);
  url.searchParams.set('theme', 'light');
  return url.toString();
})();

const ABOUT_PAGE_W = 1200;
const GALLERY_HIKING_H = 343;
const GALLERY_GAP = 10;
const GALLERY_THUMB_H = 180;
const ABOUT_GALLERY_H = GALLERY_HIKING_H + GALLERY_GAP + GALLERY_THUMB_H;

function useAboutPageScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const padding = window.innerWidth >= 1024 ? 100 : 48;
      setScale(Math.min(1, (window.innerWidth - padding) / ABOUT_PAGE_W));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}

function blockScrollDelta(e) {
  e.preventDefault();
  e.stopPropagation();
}

function AboutPhoto({ src, alt, className = '', style }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`block object-cover rounded-[4px] ${className}`}
      style={style}
      draggable={false}
    />
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

function AboutText({ className = '' }) {
  return (
    <div className={`flex flex-col gap-10 md:gap-[40px] shrink-0 ${className}`}>
      <h1 className="text-lg md:text-[26px] font-semibold text-[#222]">kat ong</h1>
      <AboutBio />
    </div>
  );
}

function ImageGallery({ layout = 'desktop' }) {
  if (layout === 'mobile') {
    return (
      <div className="flex flex-col gap-[10px] w-full overflow-hidden">
        <AboutPhoto
          src={hikingImg}
          alt="Hiking in the mountains"
          className="w-full aspect-[489/343]"
        />
        <div className="flex gap-[10px] w-full">
          <AboutPhoto
            src={icecreamImg}
            alt="Ice cream"
            className="w-[135px] h-[101.25px] shrink-0"
          />
          <AboutPhoto
            src={hollowknightImg}
            alt="Hollow Knight mask"
            className="w-[135px] h-[101.25px] shrink-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] w-[489px] max-w-full shrink-0 items-start">
      <AboutPhoto
        src={hikingImg}
        alt="Hiking in the mountains"
        className="w-full aspect-[489/343]"
      />
      <div className="flex gap-[10px]">
        <AboutPhoto
          src={icecreamImg}
          alt="Ice cream"
          className="w-[240px] h-[180px] shrink-0"
        />
        <AboutPhoto
          src={hollowknightImg}
          alt="Hollow Knight mask"
          className="w-[240px] h-[180px] shrink-0"
        />
      </div>
    </div>
  );
}

function RecentReads() {
  const cropRef = useRef(null);

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
    <div className="flex flex-col gap-5 text-sm text-black w-full shrink-0 md:min-h-0 md:flex-1 md:overflow-hidden">
      <p className="font-dm-mono shrink-0">recent reads:</p>
      <div
        ref={cropRef}
        className="notion-embed-crop notion-embed-crop--mobile w-full h-[210px] md:h-auto shrink-0 md:min-h-0 md:flex-1 rounded"
      >
        <div className="notion-embed-shield notion-embed-shield--top" aria-hidden="true" />
        <div className="notion-embed-shield notion-embed-shield--bottom" aria-hidden="true" />
        <iframe
          src={NOTION_EMBED_URL}
          title="Recent reads"
          className="notion-embed-iframe bg-transparent"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function AboutDesktopPanel() {
  return (
    <div
      className="flex items-center justify-between w-[1200px] shrink-0"
      style={{ height: ABOUT_GALLERY_H }}
    >
      <div className="flex gap-[50px] items-start w-[920px] shrink-0">
        <div
          className="flex flex-col gap-[40px] w-[381px] shrink-0 min-h-0 overflow-hidden"
          style={{ height: ABOUT_GALLERY_H, maxHeight: ABOUT_GALLERY_H }}
        >
          <AboutText />
          <hr className="border-0 border-t border-[#ccc] w-full shrink-0" />
          <RecentReads />
        </div>
        <ImageGallery layout="desktop" />
      </div>
      <div className="w-[140px] shrink-0 flex justify-center self-center">
        <Graph variant="comp-about" />
      </div>
    </div>
  );
}

const AboutView = () => {
  const scale = useAboutPageScale();

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto max-md:min-h-screen md:h-screen md:overflow-hidden bg-[#f3f3f3] max-md:bg-white font-gantari flex justify-center">
      {/* md+ — 1200px artboard scales as one unit (Figma 670:460) */}
      <div className="hidden md:flex h-full min-h-0 flex-col overflow-hidden">
        <div className="about-page-scale-host px-6 lg:px-[50px]">
          <div
            style={{
              width: ABOUT_PAGE_W * scale,
              height: ABOUT_GALLERY_H * scale,
            }}
          >
            <div
              style={{
                width: ABOUT_PAGE_W,
                height: ABOUT_GALLERY_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <AboutDesktopPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — Figma 670:542 */}
      <div className="md:hidden flex min-h-screen flex-col px-[57px] py-[46px]">
        <div className="w-full max-w-[280px] mx-auto flex flex-col gap-[40px] flex-1">
          <div className="flex items-center justify-between w-full gap-2">
            <h1 className="text-lg font-semibold text-[#222] min-w-0">kat ong</h1>
            <HomeMenu currentPage="about" />
          </div>

          <AboutBio />

          <ImageGallery layout="mobile" />

          <hr className="border-0 border-t border-[#ccc] w-full shrink-0" />

          <RecentReads />
        </div>
      </div>
    </div>
  );
};

export default AboutView;
