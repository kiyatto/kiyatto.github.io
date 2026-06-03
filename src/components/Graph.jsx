import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import activeStarSvg from '../assets/graph/active-star.svg';
import ForceHomeGraph from './ForceHomeGraph.jsx';
import { NodeCircle } from './graphPrimitives.jsx';
const COMPACT_W = 140;
const COMPACT_H = 296;
const COMPACT_ROW_TOPS = [10, 81, 152, 223];
const COMPACT_NODE_SIZE = 20;
const COMPACT_LINE_TOP = COMPACT_ROW_TOPS[0] + COMPACT_NODE_SIZE / 2;
const COMPACT_LINE_HEIGHT =
  COMPACT_ROW_TOPS[3] + COMPACT_NODE_SIZE / 2 - COMPACT_LINE_TOP;

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

function ActiveStar({ size = 23 }) {
  return (
    <img src={activeStarSvg} alt="" width={size} height={size} className="block" draggable={false} />
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

const Graph = ({ variant = 'home', boundaryRef = null }) => {
  if (variant === 'comp-about') return <CompactGraph activePage="about" />;
  if (variant === 'comp-programming') return <CompactGraph activePage="programming" />;
  if (variant === 'comp-design') return <CompactGraph activePage="design" />;
  if (variant === 'home-mobile') return <ForceHomeGraph boundaryRef={boundaryRef} isMobile />;
  return <ForceHomeGraph boundaryRef={boundaryRef} isMobile={false} />;
};

export default Graph;
