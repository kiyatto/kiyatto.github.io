import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { NodeCircle, HomeStar } from './graphPrimitives.jsx';

const FIGMA_W = 295;
const FIGMA_H = 344;

/** Node centers in the Figma radial graph artboard (295×344) */
const FIGMA_NODE_CENTERS = {
  home: { x: 142, y: 157.5 },
  about: { x: 17, y: 87 },
  programming: { x: 202, y: 46 },
  design: { x: 43, y: 311 },
};

const LINKS = [
  { source: 'home', target: 'about' },
  { source: 'home', target: 'programming' },
  { source: 'home', target: 'design' },
];

const NODE_COLLIDE_R = 32;
const STAR_COLLIDE_R = 36;
const BOUNDARY_PAD = 24;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampNodeInBox(node, width, height) {
  const r = node.isStar ? STAR_COLLIDE_R : NODE_COLLIDE_R;
  const pad = BOUNDARY_PAD + r;
  node.x = clamp(node.x, pad, width - pad);
  node.y = clamp(node.y, pad, height - pad);
  if (node.fx != null) {
    node.fx = clamp(node.fx, pad, width - pad);
    node.fy = clamp(node.fy, pad, height - pad);
    node.x = node.fx;
    node.y = node.fy;
  }
}

function createNodes(width, height, isMobile) {
  const sx = width / FIGMA_W;
  const sy = height / FIGMA_H;

  return [
    {
      id: 'home',
      isStar: true,
      route: null,
      label: null,
      x: FIGMA_NODE_CENTERS.home.x * sx,
      y: FIGMA_NODE_CENTERS.home.y * sy,
    },
    {
      id: 'about',
      label: 'about',
      route: '/about',
      labelOffset: { x: -4, y: -28 },
      x: FIGMA_NODE_CENTERS.about.x * sx,
      y: FIGMA_NODE_CENTERS.about.y * sy,
    },
    {
      id: 'programming',
      label: isMobile ? 'programming' : 'programming projects',
      route: null,
      labelOffset: isMobile ? { x: -40, y: -28 } : { x: -52, y: -28 },
      x: FIGMA_NODE_CENTERS.programming.x * sx,
      y: FIGMA_NODE_CENTERS.programming.y * sy,
    },
    {
      id: 'design',
      label: 'design work',
      route: null,
      labelOffset: { x: -4, y: 18 },
      x: FIGMA_NODE_CENTERS.design.x * sx,
      y: FIGMA_NODE_CENTERS.design.y * sy,
    },
  ];
}

function ForceGraphNode({ node, hovered, onHover, onPointerDown, onNavigate, disabled }) {
  const { x, y, label, labelOffset, isStar } = node;
  const labelColor = disabled ? '#888' : hovered ? '#000' : '#888';

  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      role={node.route && !disabled ? 'link' : undefined}
      tabIndex={node.route && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (node.route && !disabled && e.key === 'Enter') {
          e.preventDefault();
          onNavigate(node.route);
        }
      }}
    >
      <div className="relative">
        {label && labelOffset && (
          <span
            className="absolute font-dm-mono text-xs whitespace-nowrap pointer-events-none transition-colors duration-150"
            style={{
              left: labelOffset.x,
              top: labelOffset.y,
              color: labelColor,
            }}
          >
            {label}
          </span>
        )}
        {isStar ? <HomeStar size={23} /> : <NodeCircle muted={!hovered || disabled} />}
      </div>
    </div>
  );
}

const DRAG_CLICK_THRESHOLD = 5;

export default function ForceHomeGraph({ boundaryRef, isMobile = false }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const nodesRef = useRef([]);
  const dragIdRef = useRef(null);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 400, height: 344 });
  const [nodes, setNodes] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const measureBoundary = useCallback(() => {
    const target = boundaryRef?.current;
    if (target) {
      const { offsetWidth, offsetHeight } = target;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
      return;
    }

    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    if (width > 0) {
      setDimensions({ width, height: (width * FIGMA_H) / FIGMA_W });
    }
  }, [boundaryRef]);

  useEffect(() => {
    const target = boundaryRef?.current;
    const observed = target ?? containerRef.current?.parentElement;
    if (!observed) return;

    const ro = new ResizeObserver(measureBoundary);
    ro.observe(observed);
    const frame = requestAnimationFrame(measureBoundary);
    window.addEventListener('resize', measureBoundary);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', measureBoundary);
    };
  }, [boundaryRef, measureBoundary]);

  useEffect(() => {
    const { width, height } = dimensions;
    if (width <= 0 || height <= 0) return;

    simRef.current?.stop();

    const nodeData = createNodes(width, height, isMobile);
    nodesRef.current = nodeData;
    // Simulation bootstrap — initial node snapshot before first tick
    // eslint-disable-next-line react-hooks/set-state-in-effect -- d3-force setup
    setNodes(nodeData.map((n) => ({ ...n })));

    const linkDistance = Math.min(width, height) * 0.38;

    const sim = forceSimulation(nodeData)
      .force(
        'link',
        forceLink(LINKS)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.85),
      )
      .force(
        'charge',
        forceManyBody().strength(-80 * Math.sqrt((width * height) / (FIGMA_W * FIGMA_H))),
      )
      .force('center', forceCenter(width / 2, height / 2).strength(0.06))
      .force(
        'collide',
        forceCollide()
          .radius((d) => (d.isStar ? STAR_COLLIDE_R : NODE_COLLIDE_R))
          .strength(0.9)
          .iterations(2),
      )
      .alpha(0.95)
      .alphaDecay(0.028);

    sim.on('tick', () => {
      nodeData.forEach((n) => clampNodeInBox(n, width, height));
      setNodes(nodeData.map((n) => ({ ...n })));
    });

    simRef.current = sim;
    return () => sim.stop();
  }, [dimensions, isMobile]);

  const clientToLocal = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e, nodeId) => {
    if (e.button !== 0) return;
    e.preventDefault();
    containerRef.current?.setPointerCapture(e.pointerId);

    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (!node) return;

    const local = clientToLocal(e.clientX, e.clientY);
    if (!local) return;

    dragIdRef.current = nodeId;
    dragMovedRef.current = false;
    dragStartRef.current = local;
    node.fx = local.x;
    node.fy = local.y;
    node.x = local.x;
    node.y = local.y;
    simRef.current?.alphaTarget(0.35).restart();
  }, [clientToLocal]);

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragIdRef.current) return;
      const local = clientToLocal(e.clientX, e.clientY);
      if (!local) return;

      const dx = local.x - dragStartRef.current.x;
      const dy = local.y - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > DRAG_CLICK_THRESHOLD) {
        dragMovedRef.current = true;
      }

      const node = nodesRef.current.find((n) => n.id === dragIdRef.current);
      if (!node) return;

      const { width, height } = dimensions;
      const r = node.isStar ? STAR_COLLIDE_R : NODE_COLLIDE_R;
      const pad = BOUNDARY_PAD + r;
      node.fx = clamp(local.x, pad, width - pad);
      node.fy = clamp(local.y, pad, height - pad);
      node.x = node.fx;
      node.y = node.fy;
      simRef.current?.alpha(0.25).restart();
    },
    [clientToLocal, dimensions],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragIdRef.current) return;
    const node = nodesRef.current.find((n) => n.id === dragIdRef.current);
    if (node) {
      if (!dragMovedRef.current && node.route) {
        navigate(node.route);
      }
      node.fx = null;
      node.fy = null;
    }
    dragIdRef.current = null;
    dragMovedRef.current = false;
    simRef.current?.alphaTarget(0);
  }, [navigate]);

  const { width, height } = dimensions;

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 overflow-hidden touch-none"
      style={{ width, height }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Site navigation graph"
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
        aria-hidden="true"
      >
        {LINKS.map((link) => {
          const source = nodeById[link.source];
          const target = nodeById[link.target];
          if (!source || !target) return null;
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="black"
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <ForceGraphNode
          key={node.id}
          node={node}
          hovered={hoveredId === node.id}
          disabled={!node.route && !node.isStar}
          onHover={setHoveredId}
          onPointerDown={handlePointerDown}
          onNavigate={navigate}
        />
      ))}
    </div>
  );
}
