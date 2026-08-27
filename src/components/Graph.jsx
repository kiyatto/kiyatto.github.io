// Graph.jsx
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Figma node 1151:166 — graph frame is 226.5 × 342 px.
const DESIGN = {
    width: 226.5,
    height: 342,
    nodes: [
        { id: "home", cx: 142, cy: 157.5, r: 11.5 },
        { id: "about", cx: 17, cy: 87, r: 10, labelAbove: true },
        { id: "work", cx: 212, cy: 34, r: 10, labelAbove: true },
        { id: "library", cx: 52.25, cy: 311, r: 10, labelAbove: false },
    ],
    edges: [
        { source: "home", target: "about" },
        { source: "home", target: "work" },
        { source: "home", target: "library" },
    ],
};

const routes = {
    home: "/",
    about: "/about",
    work: "/work",
    library: "/reading-list",
};

const LABEL_FONT = '12px "Fragment Mono SC"';
const labelDy = (above, r) => (above ? -(r + 17) : r + 17);

export default function Graph({ onNavigate }) {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const container = ref.current;
        if (!container) return;

        const updateSize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (!width || !height) return;
            setSize(prev =>
                prev.width === width && prev.height === height ? prev : { width, height }
            );
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const container = ref.current;
        const { width, height } = size;
        if (!container || !width || !height) return;

        const scale = Math.min(width / DESIGN.width, height / DESIGN.height);
        const offsetX = (width - DESIGN.width * scale) / 2;
        const offsetY = (height - DESIGN.height * scale) / 2;
        const toScreen = (x, y) => ({
            x: offsetX + x * scale,
            y: offsetY + y * scale,
        });

        const nodes = DESIGN.nodes.map(def => {
            const { x, y } = toScreen(def.cx, def.cy);
            const r = def.r * scale;
            return { ...def, r, x, y, x0: x, y0: y };
        });

        const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
        const edges = DESIGN.edges.map(e => ({
            source: nodeById[e.source],
            target: nodeById[e.target],
            distance: Math.hypot(
                nodeById[e.source].x0 - nodeById[e.target].x0,
                nodeById[e.source].y0 - nodeById[e.target].y0
            ),
        }));

        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

        const clampNode = d => {
            const padL = d.padLeft ?? d.r;
            const padR = d.padRight ?? d.r;
            const padT = d.padTop ?? d.r;
            const padB = d.padBottom ?? d.r;
            d.x = clamp(d.x, padL, width - padR);
            d.y = clamp(d.y, padT, height - padB);
        };

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const homeIconPath = "M11.6691 0.798216C11.711 0.400596 12.289 0.400593 12.3309 0.798216L12.9337 6.52006C12.987 7.02564 13.6344 7.19969 13.9333 6.78876L17.3186 2.13527C17.5537 1.81206 18.054 2.102 17.8913 2.46719L15.552 7.7186C15.3451 8.18326 15.8191 8.65882 16.2834 8.45236L21.5384 6.11588C21.9034 5.95358 22.192 6.45537 21.8687 6.69013L17.2197 10.0658C16.8081 10.3647 16.9816 11.0145 17.4872 11.0676L23.2021 11.6686C23.5993 11.7104 23.5993 12.2896 23.2021 12.3314L17.4872 12.9324C16.9816 12.9855 16.8081 13.6353 17.2197 13.9342L21.8687 17.3099C22.192 17.5447 21.9034 18.0464 21.5384 17.8841L16.2834 15.5476C15.8191 15.3412 15.3451 15.8168 15.552 16.2814L17.8913 21.5328C18.054 21.898 17.5537 22.1879 17.3186 21.8647L13.9333 17.2112C13.6344 16.8003 12.987 16.9743 12.9337 17.48L12.3309 23.2018C12.289 23.5994 11.711 23.5994 11.6691 23.2018L11.0663 17.48C11.013 16.9743 10.3656 16.8003 10.0667 17.2112L6.68141 21.8647C6.4463 22.1879 5.94602 21.898 6.10871 21.5328L8.44797 16.2814C8.65493 15.8168 8.18091 15.3412 7.71659 15.5476L2.46162 17.8841C2.09659 18.0464 1.80799 17.5447 2.13134 17.3099L6.78033 13.9342C7.19193 13.6353 7.01838 12.9855 6.51277 12.9324L0.797945 12.3314C0.400687 12.2896 0.400683 11.7104 0.797945 11.6686L6.51277 11.0676C7.01838 11.0145 7.19193 10.3647 6.78033 10.0658L2.13133 6.69013C1.80799 6.45537 2.09659 5.95358 2.46162 6.11588L7.71659 8.45236C8.18091 8.65882 8.65493 8.18326 8.44797 7.7186L6.10871 2.46719C5.94602 2.10201 6.4463 1.81206 6.68144 2.13527L10.0667 6.78876C10.3656 7.19969 11.013 7.02564 11.0663 6.52006L11.6691 0.798216Z";

        const edge = svg
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke", "#545454");

        const node = svg
            .selectAll("circle")
            .data(nodes.filter(d => d.id !== "home"))
            .join("circle")
            .attr("r", d => d.r)
            .attr("fill", "#3765FD")
            .style("cursor", "pointer");

        const homeNode = svg
            .selectAll(".home-node")
            .data(nodes.filter(d => d.id === "home"))
            .join("path")
            .attr("class", "home-node")
            .attr("d", homeIconPath)
            .attr("fill", "#222222")
            .style("cursor", "pointer");

        const label = svg
            .selectAll("text")
            .data(nodes.filter(d => d.id !== "home"))
            .join("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", d => (d.labelAbove ? "auto" : "hanging"))
            .attr("font-size", 12 * scale)
            .attr("fill", "#222222")
            .style("font-family", "Fragment Mono SC")
            .style("pointer-events", "none");

        const render = () => {
            edge
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            homeNode.attr("transform", d => {
                const iconScale = (d.r * 2) / 24;
                return `translate(${d.x}, ${d.y}) scale(${iconScale}) translate(-12, -12)`;
            });

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y + labelDy(d.labelAbove, d.r));
        };

        const measureLabels = () => {
            render();
            label.each(function (d) {
                const box = this.getBBox();
                d.padLeft = Math.max(d.r, d.x - box.x);
                d.padRight = Math.max(d.r, box.x + box.width - d.x);
                d.padTop = Math.max(d.r, d.y - box.y);
                d.padBottom = Math.max(d.r, box.y + box.height - d.y);
            });
            const home = nodeById.home;
            home.padLeft = home.r;
            home.padRight = home.r;
            home.padTop = home.r;
            home.padBottom = home.r;
        };

        const simulation = d3
            .forceSimulation(nodes)
            .force("x", d3.forceX(d => d.x0).strength(0.12))
            .force("y", d3.forceY(d => d.y0).strength(0.12))
            .force(
                "link",
                d3
                    .forceLink(edges)
                    .distance(d => d.distance)
                    .strength(0.55)
            )
            .force("charge", d3.forceManyBody().strength(-28))
            .force(
                "collide",
                d3
                    .forceCollide()
                    .radius(d => d.r + 6)
                    .strength(0.9)
            )
            .velocityDecay(0.35)
            .alphaDecay(0.04);

        function ticked() {
            nodes.forEach(clampNode);
            render();
        }

        simulation.on("tick", ticked);

        let didDrag = false;

        function dragstarted(event, d) {
            didDrag = false;
            if (!event.active) simulation.alphaTarget(0.35).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function onDrag(event, d) {
            didDrag = true;
            d.fx = event.x;
            d.fy = event.y;
            clampNode(d);
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        const dragBehavior = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", onDrag)
            .on("end", dragended);

        node.call(dragBehavior);
        homeNode.call(dragBehavior);

        const navigate = (_event, d) => {
            if (didDrag) return;
            if (onNavigate && routes[d.id]) onNavigate(routes[d.id]);
        };

        node.on("click", navigate);
        homeNode.on("click", navigate);

        measureLabels();
        ticked();
        simulation.alpha(0);

        let cancelled = false;
        const refreshAfterFonts = () => {
            if (cancelled) return;
            measureLabels();
            ticked();
        };

        if (document.fonts?.load) {
            document.fonts.load(LABEL_FONT).then(refreshAfterFonts).catch(() => {});
        } else if (document.fonts?.ready) {
            document.fonts.ready.then(refreshAfterFonts);
        }

        return () => {
            cancelled = true;
            simulation.stop();
            svg.remove();
        };
    }, [onNavigate, size.width, size.height]);

    return <div ref={ref} className="h-full w-full min-h-[240px]" />;
}
