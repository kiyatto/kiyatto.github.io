import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import edgesSvg from '../assets/graph/edges.svg';
import homeStarSvg from '../assets/graph/home-star.svg';
import activeStarSvg from '../assets/graph/active-star.svg';

const RADIAL_W = 295;
const RADIAL_H = 344;
const COMPACT_W = 140;
const COMPACT_H = 296;
const COMPACT_ROW_TOPS = [10, 81, 152, 223];
const COMPACT_NODE_SIZE = 20;
const COMPACT_LINE_TOP = COMPACT_ROW_TOPS[0] + COMPACT_NODE_SIZE / 2;
const COMPACT_LINE_HEIGHT =
  COMPACT_ROW_TOPS[3] + COMPACT_NODE_SIZE / 2 - COMPACT_LINE_TOP;

const NODE = {
  active: { fill: '#F98972', stroke: '#562016' },
  muted: { fill: '#FFD5CC', stroke: '#F98972' },
};

function ScaledCanvas({ width, height, children, className = '' }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const outer = outerRef.current;
    const parent = outer?.parentElement;
    if (!outer || !parent) return;

    const update = () => {
      const available = parent.clientWidth;
      if (available <= 0) return;
      setScale(Math.min(1, available / width));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(parent);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [width]);

  return (
    <div
      ref={outerRef}
      className={`mx-auto ${className}`}
      style={{ width: width * scale, height: height * scale }}
    >
      <div
        className="relative"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function NodeCircle({ size = 20, muted = false }) {
  const { fill, stroke } = muted ? NODE.muted : NODE.active;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9.5" fill={fill} stroke={stroke} />
    </svg>
  );
}

function HomeStar({ size = 23 }) {
  return (
    <img src={homeStarSvg} alt="" width={size} height={size} className="block" draggable={false} />
  );
}

function ActiveStar({ size = 23 }) {
  return (
    <img src={activeStarSvg} alt="" width={size} height={size} className="block" draggable={false} />
  );
}

function RadialGraph({ isMobile = false }) {
  return (
    <ScaledCanvas width={RADIAL_W} height={RADIAL_H} className="shrink-0">
      <img
        src={edgesSvg}
        alt=""
        className="absolute pointer-events-none"
        style={{ left: 17, top: 36, width: 195, height: 275 }}
        draggable={false}
      />

      <RadialNodeLink
        label="about"
        to="/about"
        style={{ left: 0, top: 56 }}
        labelStyle={{ left: 0, top: 0 }}
        nodeStyle={{ left: 7, top: 21 }}
      />

      <RadialNodeStatic
        label={isMobile ? 'programming' : 'programming projects'}
        style={{ left: isMobile ? 172 : 151, top: 0, width: isMobile ? 80 : 120 }}
        labelStyle={isMobile ? { left: 0, top: 0, width: '100%', textAlign: 'center' } : { left: 0, top: 0 }}
        nodeStyle={{ left: isMobile ? 30 : 51, top: 26 }}
      />

      <RadialNodeStatic
        label="design work"
        style={{ left: 19, top: 301, width: 90 }}
        labelStyle={{ left: 0, top: 27 }}
        nodeStyle={{ left: 24, top: 0 }}
      />

      <div className="absolute pointer-events-none" style={{ left: 130.5, top: 146 }}>
        <HomeStar size={23} />
      </div>
    </ScaledCanvas>
  );
}

function RadialNodeLink({ label, to, style, labelStyle, nodeStyle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      className="absolute no-underline group"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute font-dm-mono text-xs whitespace-nowrap transition-colors duration-150"
        style={{ ...labelStyle, color: hovered ? '#000' : '#888' }}
      >
        {label}
      </span>
      <div className="absolute" style={nodeStyle}>
        <NodeCircle muted={!hovered} />
      </div>
    </Link>
  );
}

function RadialNodeStatic({ label, style, labelStyle, nodeStyle }) {
  return (
    <div className="absolute" style={style} aria-disabled="true">
      <span
        className="absolute font-dm-mono text-xs text-[#888] whitespace-nowrap"
        style={labelStyle}
      >
        {label}
      </span>
      <div className="absolute" style={nodeStyle}>
        <NodeCircle muted />
      </div>
    </div>
  );
}

const COMPACT_ITEMS = [
  { id: 'programming', label: 'programming', route: null },
  { id: 'about', label: 'about', route: '/about' },
  { id: 'home', label: 'home', route: '/' },
  { id: 'design', label: 'design work', route: null },
];

function CompactGraph({ activePage }) {
  return (
    <ScaledCanvas width={COMPACT_W} height={COMPACT_H} className="shrink-0">
      <div
        className="absolute bg-black pointer-events-none"
        style={{ right: 10, top: COMPACT_LINE_TOP, width: 1, height: COMPACT_LINE_HEIGHT }}
      />
      {COMPACT_ITEMS.map((item, index) => (
        <CompactRow
          key={item.id}
          item={item}
          isActive={item.id === activePage}
          isDisabled={!item.route && item.id !== activePage}
          top={COMPACT_ROW_TOPS[index]}
        />
      ))}
    </ScaledCanvas>
  );
}

function CompactRow({ item, isActive, isDisabled, top }) {
  const labelClass = `font-dm-mono text-xs whitespace-nowrap ${
    isActive ? 'text-black' : isDisabled ? 'text-[#888]' : 'text-black'
  }`;

  const iconSize = isActive ? 23 : 20;
  const icon = isActive ? (
    <ActiveStar size={iconSize} />
  ) : (
    <NodeCircle size={iconSize} muted={!isActive} />
  );

  const inner = (
    <>
      <span className={`${labelClass} mr-[13px]`}>{item.label}</span>
      <div className="relative w-0 h-0">
        <div
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{ width: iconSize, height: iconSize }}
        >
          {icon}
        </div>
      </div>
    </>
  );

  const positionStyle = { right: 10, top };

  if (item.route && !isActive) {
    return (
      <Link
        to={item.route}
        className="absolute flex items-center no-underline"
        style={positionStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="absolute flex items-center" style={positionStyle}>
      {inner}
    </div>
  );
}

const Graph = ({ variant = 'home' }) => {
  if (variant === 'comp-about') return <CompactGraph activePage="about" />;
  if (variant === 'comp-programming') return <CompactGraph activePage="programming" />;
  if (variant === 'comp-design') return <CompactGraph activePage="design" />;
  if (variant === 'home-mobile') return <RadialGraph isMobile />;
  return <RadialGraph />;
};

export default Graph;
