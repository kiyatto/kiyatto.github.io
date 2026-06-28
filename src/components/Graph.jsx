// Graph.jsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const graphObjects = {
    nodes: [
        { id: "home", x0: 0, y0: 0 },
        { id: "about", x0: -3, y0: -2 },
        { id: "work", x0: 2, y0: -3 },
        { id: "library", x0: -2, y0: 3 },
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

export default function Graph({ onNavigate }) {
    const ref = useRef(null);

    useEffect(() => {
        const container = ref.current;
        const width = container.clientWidth || 575;
        const height = container.clientHeight || 560;
        const scale = Math.min(width, height) / 7;
        const edgeLength = 1.5;

        const nodes = graphObjects.nodes.map(n => ({ ...n }));
        const edges = graphObjects.edges.map(e => ({ ...e }));

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // shift origin to center
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        svg.append("defs").append("symbol")
            .attr("id", "home-icon")
            .attr("viewBox", "0 0 24 24")  // match your SVG's viewBox
            .html(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6691 0.798216C11.711 0.400596 12.289 0.400593 12.3309 0.798216L12.9337 6.52006C12.987 7.02564 13.6344 7.19969 13.9333 6.78876L17.3186 2.13527C17.5537 1.81206 18.054 2.102 17.8913 2.46719L15.552 7.7186C15.3451 8.18326 15.8191 8.65882 16.2834 8.45236L21.5384 6.11588C21.9034 5.95358 22.192 6.45537 21.8687 6.69013L17.2197 10.0658C16.8081 10.3647 16.9816 11.0145 17.4872 11.0676L23.2021 11.6686C23.5993 11.7104 23.5993 12.2896 23.2021 12.3314L17.4872 12.9324C16.9816 12.9855 16.8081 13.6353 17.2197 13.9342L21.8687 17.3099C22.192 17.5447 21.9034 18.0464 21.5384 17.8841L16.2834 15.5476C15.8191 15.3412 15.3451 15.8168 15.552 16.2814L17.8913 21.5328C18.054 21.898 17.5537 22.1879 17.3186 21.8647L13.9333 17.2112C13.6344 16.8003 12.987 16.9743 12.9337 17.48L12.3309 23.2018C12.289 23.5994 11.711 23.5994 11.6691 23.2018L11.0663 17.48C11.013 16.9743 10.3656 16.8003 10.0667 17.2112L6.68141 21.8647C6.4463 22.1879 5.94602 21.898 6.10871 21.5328L8.44797 16.2814C8.65493 15.8168 8.18091 15.3412 7.71659 15.5476L2.46162 17.8841C2.09659 18.0464 1.80799 17.5447 2.13134 17.3099L6.78033 13.9342C7.19193 13.6353 7.01838 12.9855 6.51277 12.9324L0.797945 12.3314C0.400687 12.2896 0.400683 11.7104 0.797945 11.6686L6.51277 11.0676C7.01838 11.0145 7.19193 10.3647 6.78033 10.0658L2.13133 6.69013C1.80799 6.45537 2.09659 5.95358 2.46162 6.11588L7.71659 8.45236C8.18091 8.65882 8.65493 8.18326 8.44797 7.7186L6.10871 2.46719C5.94602 2.10201 6.4463 1.81206 6.68144 2.13527L10.0667 6.78876C10.3656 7.19969 11.013 7.02564 11.0663 6.52006L11.6691 0.798216Z" fill="#222222" stroke="#222222"/>
</svg>
  `);

        const edge = g
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke", "#545454");

        const node = g
            .selectAll("circle")
            .data(nodes.filter(d => d.id !== "home"))
            .join("circle")
            .attr("r", 10)
            .attr("fill", "#3765FD")
            .style("cursor", "pointer");

        const size = 24;
        const homeNode = g
            .selectAll(".home-node")
            .data(nodes.filter(d => d.id === "home"))
            .join("use")
            .attr("class", "home-node")
            .attr("href", "#home-icon")
            .attr("width", size)
            .attr("height", size)
            .attr("x", -size / 2)
            .attr("y", -size / 2)
            .style("cursor", "pointer");

        // labels
        const label = g
            .selectAll("text")
            .data(nodes.filter(d => d.id !== "home"))
            .join("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", d => d.id === "library" ? 26 : -16)
            .attr("font-size", 12)
            .attr("fill", "#222222")
            .style("font-family", "Fragment Mono SC")
            .style("pointer-events", "none");

        // click to navigate
        node.on("click", (event, d) => {
            if (onNavigate && routes[d.id]) {
                onNavigate(routes[d.id]);
            }
        });

        const simulation = d3
            .forceSimulation(nodes)
            .force("x", d3.forceX(d => d.x0 * scale).strength(0.1))
            .force("y", d3.forceY(d => d.y0 * scale).strength(0.1))
            .force(
                "link",
                d3.forceLink(edges).id(d => d.id).distance(edgeLength * scale).strength(0.5)
            )
            .force("charge", d3.forceManyBody().strength(-30))
            .velocityDecay(0.3);

        function dragstarted(event, d) {
            simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            simulation.alphaTarget(0.1).restart();
            setTimeout(() => simulation.alphaTarget(0), 500);
            d.fx = null;
            d.fy = null;
        }

        const dragBehavior = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        node.call(dragBehavior);
        homeNode.call(dragBehavior);

        node.on("click", (event, d) => {
            if (onNavigate && routes[d.id]) onNavigate(routes[d.id]);
        });
        homeNode.on("click", (event, d) => {
            if (onNavigate && routes[d.id]) onNavigate(routes[d.id]);
        });
        label.on("click", (event, d) => {
            if (onNavigate && routes[d.id]) onNavigate(routes[d.id]);
        });

        simulation.on("tick", () => {
            edge
                .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

            node.attr("cx", d => d.x).attr("cy", d => d.y);

            homeNode
                .attr("x", d => d.x - size / 2)
                .attr("y", d => d.y - size / 2);

            label.attr("x", d => d.x).attr("y", d => d.y);
        });

        return () => {
            simulation.stop();
            svg.remove();
        };
    }, [onNavigate]);

    return <div ref={ref} className="w-full h-full" />;
}