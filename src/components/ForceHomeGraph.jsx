import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { NodeCircle, HomeStar } from './graphPrimitives.jsx';

/** Figma home light — frame "graph outer wrapping" (532:145) */
const FIGMA_WRAPPER_W = 575;
const FIGMA_WRAPPER_H = 560;
/** Graph instance (529:225) centered inside the wrapper */
const FIGMA_GRAPH_OFFSET_X = 151;
const FIGMA_GRAPH_OFFSET_Y = 109;
const FIGMA_GRAPH_W = 273;
const FIGMA_GRAPH_H = 342;

/** Node circle centers in graph-local space (273×342, Figma symbol 513:24) */
const FIGMA_NODE_CENTERS = {
  home: { x: 142, y: 157.5 },
  about: { x: 17, y: 87 },
  programming: { x: 212, y: 36 },
  design: { x: 53, y: 311 },
};

/**
 * Label placement relative to the node circle (Figma symbol 513:24).
 * gap = graph-local px between label and circle edge.
 */
const FIGMA_LABEL_LAYOUT = {
  about: { placement: 'above', gap: 9 },
  programming: { placement: 'above', gap: 14 },
  'programming-mobile': { placement: 'above', gap: 9 },
  design: { placement: 'below', gap: 7 },
};

/** Immutable edge list for rendering (never pass to d3-force directly — it mutates links in place). */
const LINK_SPECS = [
  { source: 'home', target: 'about' },
  { source: 'home', target: 'programming' },
  { source: 'home', target: 'design' },
];

function createSimLinks() {
  return LINK_SPECS.map((link) => ({ source: link.source, target: link.target }));
}

const BOX_PAD = 8;
const NODE_COLLIDE_R = 28;
const STAR_COLLIDE_R = 14;
const DRAG_CLICK_THRESHOLD = 5;
const SNAP_DURATION_MS = 1100;

/** Fallback insets from node center to visual bounds (px at Figma scale) */
const FIGMA_INSETS = {
  home: { left: 14, right: 14, top: 14, bottom: 14 },
  about: { left: 48, right: 12, top: 32, bottom: 12 },
  programming: { left: 158, right: 12, top: 32, bottom: 12 },
  'programming-mobile': { left: 88, right: 12, top: 32, bottom: 12 },
  design: { left: 88, right: 12, top: 12, bottom: 36 },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toWrapperPosition(graphX, graphY, wrapperW, wrapperH) {
  const sx = wrapperW / FIGMA_WRAPPER_W;
  const sy = wrapperH / FIGMA_WRAPPER_H;
  return {
    x: (FIGMA_GRAPH_OFFSET_X + graphX) * sx,
    y: (FIGMA_GRAPH_OFFSET_Y + graphY) * sy,
  };
}

function scaleLabelGap(gap, wrapperH) {
  return gap * (wrapperH / FIGMA_WRAPPER_H);
}

function getLabelLayout(nodeId, isMobile) {
  if (nodeId === 'programming' && isMobile) return FIGMA_LABEL_LAYOUT['programming-mobile'];
  return FIGMA_LABEL_LAYOUT[nodeId];
}

function getFallbackInsets(nodeId, isMobile) {
  if (nodeId === 'programming' && isMobile) return FIGMA_INSETS['programming-mobile'];
  return FIGMA_INSETS[nodeId] ?? { left: 20, right: 20, top: 20, bottom: 20 };
}

function clampNodeInBox(node, width, height, insetsById, isMobile) {
  const scale = width / FIGMA_WRAPPER_W;
  const measured = insetsById[node.id];
  const fallback = getFallbackInsets(node.id, isMobile);
  const ins = measured ?? {
    left: fallback.left * scale,
    right: fallback.right * scale,
    top: fallback.top * scale,
    bottom: fallback.bottom * scale,
  };

  const minX = BOX_PAD + ins.left;
  const maxX = width - BOX_PAD - ins.right;
  const minY = BOX_PAD + ins.top;
  const maxY = height - BOX_PAD - ins.bottom;

  node.x = clamp(node.x, minX, maxX);
  node.y = clamp(node.y, minY, maxY);

  if (node.fx != null) {
    node.fx = clamp(node.fx, minX, maxX);
    node.fy = clamp(node.fy, minY, maxY);
    node.x = node.fx;
    node.y = node.fy;
  }
}

function createNodes(width, height, isMobile) {
  const attachLabelLayout = (node) => {
    const layout = getLabelLayout(node.id, isMobile);
    if (!layout) return node;
    return {
      ...node,
      labelPlacement: layout.placement,
      labelGap: scaleLabelGap(layout.gap, height),
    };
  };

  return [
    {
      id: 'home',
      isStar: true,
      route: null,
      label: null,
      ...toWrapperPosition(FIGMA_NODE_CENTERS.home.x, FIGMA_NODE_CENTERS.home.y, width, height),
    },
    attachLabelLayout({
      id: 'about',
      label: 'about',
      route: '/about',
      ...toWrapperPosition(FIGMA_NODE_CENTERS.about.x, FIGMA_NODE_CENTERS.about.y, width, height),
    }),
    attachLabelLayout({
      id: 'programming',
      label: isMobile ? 'programming' : 'programming projects',
      route: null,
      ...toWrapperPosition(
        FIGMA_NODE_CENTERS.programming.x,
        FIGMA_NODE_CENTERS.programming.y,
        width,
        height,
      ),
    }),
    attachLabelLayout({
      id: 'design',
      label: 'design work',
      route: null,
      ...toWrapperPosition(FIGMA_NODE_CENTERS.design.x, FIGMA_NODE_CENTERS.design.y, width, height),
    }),
  ].map((node) => ({
    ...node,
    targetX: node.x,
    targetY: node.y,
  }));
}

function snapshotNodes(nodeData) {
  return nodeData.map((n) => ({ ...n }));
}

function ForceGraphNode({ node, hovered, onHover, onPointerDown, onNavigate, disabled, nodeRef }) {
  if (!node || node.x == null || node.y == null) return null;

  const { x, y, label, labelPlacement, labelGap, isStar } = node;
  const labelColor = disabled ? '#888' : hovered ? '#000' : '#888';
  const gap = labelGap ?? 0;

  const iconEl = isStar ? (
    <HomeStar size={23} />
  ) : (
    <NodeCircle muted={!hovered || disabled} />
  );

  return (
    <div
      ref={nodeRef}
      className="absolute z-[2] cursor-grab active:cursor-grabbing select-none touch-none"
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
      <div className="relative inline-block">
        {label && labelPlacement === 'above' && (
          <span
            className="absolute left-1/2 -translate-x-1/2 font-dm-mono text-xs leading-none whitespace-nowrap pointer-events-none transition-colors duration-150"
            style={{
              bottom: `calc(100% + ${gap}px)`,
              color: labelColor,
            }}
          >
            {label}
          </span>
        )}
        {iconEl}
        {label && labelPlacement === 'below' && (
          <span
            className="absolute left-1/2 -translate-x-1/2 font-dm-mono text-xs leading-none whitespace-nowrap pointer-events-none transition-colors duration-150"
            style={{
              top: `calc(100% + ${gap}px)`,
              color: labelColor,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ForceHomeGraph({ boundaryRef, isMobile = false }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const nodesRef = useRef([]);
  const insetsRef = useRef({});
  const nodeElRefs = useRef({});
  const dragIdRef = useRef(null);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const snapFrameRef = useRef(null);
  const snapFromRef = useRef([]);
  const [dimensions, setDimensions] = useState({
    width: FIGMA_WRAPPER_W,
    height: FIGMA_WRAPPER_H,
  });
  const [nodes, setNodes] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const publishNodes = useCallback(() => {
    setNodes(snapshotNodes(nodesRef.current));
  }, []);

  const measureNodeInsets = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const next = {};

    nodesRef.current.forEach((node) => {
      const el = nodeElRefs.current[node.id];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = node.x;
      const cy = node.y;
      const left = cx - (rect.left - containerRect.left);
      const top = cy - (rect.top - containerRect.top);
      const right = rect.right - containerRect.left - cx;
      const bottom = rect.bottom - containerRect.top - cy;

      next[node.id] = {
        left: Math.max(left, BOX_PAD),
        right: Math.max(right, BOX_PAD),
        top: Math.max(top, BOX_PAD),
        bottom: Math.max(bottom, BOX_PAD),
      };
    });

    insetsRef.current = next;
  }, []);

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
      setDimensions({ width, height: (width * FIGMA_WRAPPER_H) / FIGMA_WRAPPER_W });
    }
  }, [boundaryRef]);

  const resetToFigmaLayout = useCallback(
    (width, height) => {
      const nodeData = createNodes(width, height, isMobile);
      nodesRef.current = nodeData;
      publishNodes();
      requestAnimationFrame(measureNodeInsets);
    },
    [isMobile, measureNodeInsets, publishNodes],
  );

  const stopSimulation = useCallback(() => {
    simRef.current?.stop();
    simRef.current = null;
  }, []);

  const startSnapBack = useCallback(() => {
    stopSimulation();
    const nodeData = nodesRef.current;
    if (!nodeData.length) return;

    snapFromRef.current = nodeData.map((n) => ({ x: n.x, y: n.y }));
    const startTime = performance.now();
    const { width, height } = dimensions;

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / SNAP_DURATION_MS);
      const ease = 1 - (1 - t) ** 3;

      nodeData.forEach((node, i) => {
        node.fx = null;
        node.fy = null;
        node.x = snapFromRef.current[i].x + (node.targetX - snapFromRef.current[i].x) * ease;
        node.y = snapFromRef.current[i].y + (node.targetY - snapFromRef.current[i].y) * ease;
        clampNodeInBox(node, width, height, insetsRef.current, isMobile);
      });

      publishNodes();

      if (t < 1) {
        snapFrameRef.current = requestAnimationFrame(tick);
      } else {
        nodeData.forEach((node) => {
          node.x = node.targetX;
          node.y = node.targetY;
        });
        publishNodes();
        snapFrameRef.current = null;
      }
    };

    if (snapFrameRef.current) cancelAnimationFrame(snapFrameRef.current);
    snapFrameRef.current = requestAnimationFrame(tick);
  }, [dimensions, isMobile, publishNodes, stopSimulation]);

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

    if (snapFrameRef.current) cancelAnimationFrame(snapFrameRef.current);
    stopSimulation();
    resetToFigmaLayout(width, height);
  }, [dimensions, isMobile, resetToFigmaLayout, stopSimulation]);

  useLayoutEffect(() => {
    if (!nodes.length) return;
    measureNodeInsets();
  }, [nodes, measureNodeInsets, dimensions]);

  const startDragSimulation = useCallback(() => {
    const { width, height } = dimensions;
    const nodeData = nodesRef.current;
    if (!nodeData.length) return;

    stopSimulation();

    const linkDistance = Math.min(width, height) * 0.38;
    const sim = forceSimulation(nodeData)
      .force(
        'link',
        forceLink(createSimLinks())
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.9),
      )
      .force(
        'charge',
        forceManyBody().strength(
          -60 * Math.sqrt((width * height) / (FIGMA_WRAPPER_W * FIGMA_WRAPPER_H)),
        ),
      )
      .force(
        'collide',
        forceCollide()
          .radius((d) => (d.isStar ? STAR_COLLIDE_R : NODE_COLLIDE_R))
          .strength(0.85)
          .iterations(2),
      )
      .alpha(0.65)
      .alphaDecay(0.05);

    sim.on('tick', () => {
      nodeData.forEach((n) => {
        if (n.id !== dragIdRef.current) {
          clampNodeInBox(n, width, height, insetsRef.current, isMobile);
        }
      });
      publishNodes();
    });

    simRef.current = sim;
  }, [dimensions, isMobile, publishNodes, stopSimulation]);

  const clientToLocal = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback(
    (e, nodeId) => {
      if (e.button !== 0) return;
      e.preventDefault();

      if (snapFrameRef.current) {
        cancelAnimationFrame(snapFrameRef.current);
        snapFrameRef.current = null;
      }
      stopSimulation();

      containerRef.current?.setPointerCapture(e.pointerId);

      const node = nodesRef.current.find((n) => n.id === nodeId);
      if (!node) return;

      const local = clientToLocal(e.clientX, e.clientY);
      if (!local) return;

      dragIdRef.current = nodeId;
      dragMovedRef.current = false;
      dragStartRef.current = local;
      setIsDragging(true);

      node.fx = local.x;
      node.fy = local.y;
      node.x = local.x;
      node.y = local.y;
      clampNodeInBox(node, dimensions.width, dimensions.height, insetsRef.current, isMobile);
      publishNodes();
      startDragSimulation();
      simRef.current?.alphaTarget(0.35).restart();
    },
    [
      clientToLocal,
      dimensions,
      isMobile,
      publishNodes,
      startDragSimulation,
      stopSimulation,
    ],
  );

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

      node.fx = local.x;
      node.fy = local.y;
      node.x = local.x;
      node.y = local.y;
      clampNodeInBox(node, dimensions.width, dimensions.height, insetsRef.current, isMobile);
      publishNodes();
      simRef.current?.alpha(0.3).restart();
    },
    [clientToLocal, dimensions, isMobile, publishNodes],
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
    setIsDragging(false);
    simRef.current?.alphaTarget(0);
    stopSimulation();
    startSnapBack();
  }, [navigate, startSnapBack, stopSimulation]);

  useEffect(() => () => {
    if (snapFrameRef.current) cancelAnimationFrame(snapFrameRef.current);
    stopSimulation();
  }, [stopSimulation]);

  const { width, height } = dimensions;
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const setNodeRef = useCallback((id) => (el) => {
    if (el) nodeElRefs.current[id] = el;
    else delete nodeElRefs.current[id];
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative shrink-0 touch-none ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ width, height }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Site navigation graph"
    >
      <svg
        className="absolute inset-0 z-[1] pointer-events-none block"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        {LINK_SPECS.map((link) => {
          const source = nodeById[link.source];
          const target = nodeById[link.target];
          if (!source || !target) return null;
          if (
            source.x == null ||
            target.x == null ||
            Number.isNaN(source.x) ||
            Number.isNaN(target.x)
          ) {
            return null;
          }
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#000000"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <ForceGraphNode
          key={node.id}
          node={node}
          nodeRef={setNodeRef(node.id)}
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
