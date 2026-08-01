import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";

import auto_sd from "../assets/work/auto_sd.svg";
import plateMag from "../assets/work/plate-mag.png";
import black_placeholder from "../assets/work/black_placeholder.svg";
import spotify_hero from "../assets/work/spotify_static.svg";
import spotify_animation from "../assets/work/spotify_animation.svg?raw";

const FILTERS = {
    design: "design",
    programming: "software",
};

const DESIGN_PROJECTS = [
    {
        id: "design-1",
        title: (
            <>
                Introducing{" "}
                <span className="font-reenie-beanie text-[22px] leading-5">tags</span> for Spotify
            </>
        ),
        description: "Reinventing how we record memories and feelings through music.",
        image: spotify_hero,
        imagePosition: "top",
        href: "/work/spotify-tags",
        hoverAnimation: spotify_animation.replace(
            /<svg\b/,
            '<svg preserveAspectRatio="xMidYMid slice"'
        ),
        comingSoon: false,
    },
    {
        id: "design-2",
        title: "plate. magazine",
        description: "Web and system design for a playful publication centered around food.",
        image: plateMag,
        imagePosition: "center",
        comingSoon: true,
    },
    {
        id: "design-3",
        title: "Autonomous SD",
        description: "Designing interfaces for autonomous vehicles.",
        image: auto_sd,
        imagePosition: "center",
        comingSoon: true,
    },
];

const PROGRAMMING_PROJECTS = [
    {
        id: "programming-1",
        title: "muff",
        description: "Byte-code interpreter for a simple, general-purpose PL.",
        image: black_placeholder,
        imagePosition: "top",
        comingSoon: true,
    },
    {
        id: "programming-2",
        title: "stash",
        description:
            "A modern, minimalist app for creating and organizing ideas and objects. Built with Cursor.",
        image: black_placeholder,
        imagePosition: "center",
        comingSoon: true,
    },
    {
        id: "programming-3",
        title: "kanji reader",
        description: "Recognition system for 2,965 kanji and 71 hiragana characters.",
        image: black_placeholder,
        imagePosition: "center",
        comingSoon: true,
    },
];

const useComingSoonCursor = (enabled) => {
    const [cursor, setCursor] = useState(null);

    if (!enabled) {
        return { handlers: {}, cursorClassName: "", pill: null };
    }

    const handlers = {
        onMouseEnter: (event) => setCursor({ x: event.clientX, y: event.clientY }),
        onMouseMove: (event) => setCursor({ x: event.clientX, y: event.clientY }),
        onMouseLeave: () => setCursor(null),
    };

    const pill =
        cursor &&
        createPortal(
            <div
                aria-hidden
                className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#222222] px-3.5 py-2 font-fragment text-[11px] leading-none tracking-[0.04em] text-white whitespace-nowrap"
                style={{ left: cursor.x, top: cursor.y }}
            >
                COMING SOON!
            </div>,
            document.body
        );

    return { handlers, cursorClassName: "cursor-none", pill };
};

const ProjectMedia = ({ image, imagePosition, hoverAnimation }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <div
            className="relative aspect-[360/200] w-full overflow-hidden"
            onMouseEnter={hoverAnimation ? () => setPlaying(true) : undefined}
            onMouseLeave={hoverAnimation ? () => setPlaying(false) : undefined}
        >
            <img
                src={image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                    playing ? "opacity-0" : "opacity-100"
                } ${imagePosition === "top" ? "object-[center_20%]" : ""}`}
            />
            {hoverAnimation && playing ? (
                <div
                    className="pointer-events-none absolute inset-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                    aria-hidden
                    dangerouslySetInnerHTML={{ __html: hoverAnimation }}
                />
            ) : null}
        </div>
    );
};

const WorkFilter = ({ active, onChange }) => (
    <div className="flex items-center gap-5 overflow-clip rounded-[10px] p-1.5">
        {Object.values(FILTERS).map((filter) => {
            const isActive = active === filter;
            return (
                <button
                    key={filter}
                    type="button"
                    onClick={() => onChange(filter)}
                    aria-pressed={isActive}
                    className={`cursor-pointer border-none p-[5px] font-fragment text-[13px] leading-none text-[#545454] ${
                        isActive
                            ? "min-w-[63px] rounded-[10px] bg-[#cacaca] text-center"
                            : "bg-transparent"
                    }`}
                >
                    {filter}
                </button>
            );
        })}
    </div>
);

const ProjectCard = ({ project }) => {
    const { handlers, cursorClassName, pill } = useComingSoonCursor(project.comingSoon);

    const content = (
        <>
            <ProjectMedia
                image={project.image}
                imagePosition={project.imagePosition}
                hoverAnimation={project.hoverAnimation}
            />
            <div className="flex w-full flex-col gap-2.5 overflow-clip p-[15px]">
                <p className="m-0 font-diphylleia text-[16px] leading-5 text-black">
                    {project.title}
                </p>
                <p className="m-0 font-gantari text-[12px] font-light leading-5 text-[#606060]">
                    {project.description}
                </p>
            </div>
            {pill}
        </>
    );

    const className = `flex w-full flex-col items-start overflow-clip text-inherit no-underline ${cursorClassName}`;

    if (project.href) {
        return (
            <Link to={project.href} className={className} {...handlers}>
                {content}
            </Link>
        );
    }

    return (
        <article className={className} {...handlers}>
            {content}
        </article>
    );
};

/**
 * Work layout mirrors Figma node 1598:2294 —
 * sticky design/software toggle, scrollable project list, graph on the right.
 */
const Work = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState(FILTERS.design);
    const projects =
        activeFilter === FILTERS.design ? DESIGN_PROJECTS : PROGRAMMING_PROJECTS;

    return (
        <>
            <PixelTrail />
            <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
                <div className="flex w-full flex-col gap-10 py-14 md:min-h-0 md:flex-1 md:flex-row md:items-stretch md:gap-[clamp(2.5rem,6vw,5rem)]">
                    {/* projects — page scrolls on mobile; column scrolls on desktop */}
                    <div className="flex w-full min-w-0 flex-col gap-2.5 md:min-h-0 md:flex-1 md:overflow-hidden">
                        <div className="sticky top-0 z-[1] shrink-0 bg-white md:static">
                            <WorkFilter active={activeFilter} onChange={setActiveFilter} />
                        </div>
                        <div className="flex flex-col gap-2.5 md:min-h-0 md:flex-1 md:overflow-x-clip md:overflow-y-auto">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>

                    {/* graph */}
                    <div className="hidden h-full w-[min(400px,38vw)] shrink-0 items-center justify-center md:flex">
                        <div className="h-full w-full max-h-[342px]">
                            <Graph onNavigate={navigate} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Work;
