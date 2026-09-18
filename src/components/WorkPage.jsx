import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";

import auto_sd from "../assets/work/auto_sd.svg";
import plateMag from "../assets/work/plate-static-800.jpg";
import black_placeholder from "../assets/work/black_placeholder.svg";
import spotify_hero from "../assets/work/spotify_static.svg";
import spotify_animation from "../assets/work/spotify_animation.svg?raw";
import kanji_static from "../assets/work/kanji_static.svg";
import kanji_animation from "../assets/work/kanji_anim.svg?raw";
import spotifyHeroPrefetch from "../assets/work/spotify-media/hero-1600.jpg";
import plateHeroPrefetch from "../assets/work/plate-media/hero-1600.jpg";
import localEatsPrefetch from "../assets/work/plate-media/local-eats-800.jpg";
import paperCakePrefetch from "../assets/work/plate-media/paper-cake-800.jpg";
import typeLayoutPrefetch from "../assets/work/plate-media/type-layout-system-1600.jpg";
import colorSystemPrefetch from "../assets/work/plate-media/color-system-1600.jpg";
import c1s3Prefetch from "../assets/work/spotify-media/c1s3-600.jpg";
import borb from "../assets/work/borb.svg";

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
    },
    {
        id: "design-2",
        title: "plate. magazine",
        description: "Web and system design for a playful publication centered around food.",
        image: plateMag,
        imagePosition: "center",
        href: "/work/plate-magazine",
    },
    {
        id: "design-3",
        title: "graph notetaker",
        description: "Native notetaking for researchers",
        image: borb,
        imagePosition: "center",
        comingSoon: true,
        // href: "/work/plate-magazine",
    },
];

const PROGRAMMING_PROJECTS = [
    {
        id: "programming-1",
        title: "kanji reader",
        description: "Recognition system for 2,965 kanji and 71 hiragana characters.",
        image: kanji_static,
        imagePosition: "center",
        mediaClassName: "border-[4px] border-solid border-black",
        comingSoon: false,
        href: "https://github.com/kiyatto/kanji-reader",
        hoverAnimation: kanji_animation.replace(
            /<svg\b/,
            '<svg preserveAspectRatio="xMidYMid slice"'
        ),
        hoverPill: "view on github",
        hoverPillColor: "#8B1A1A",
    },
    {
        id: "programming-2",
        title: "muff",
        description: "Byte-code interpreter for a simple, general-purpose PL.",
        image: black_placeholder,
        imagePosition: "top",
        comingSoon: true,
    },
    // {
    //     id: "programming-3",
    //     title: "stash",
    //     description:
    //         "A modern, minimalist app for creating and organizing ideas and objects. Built with Cursor.",
    //     image: black_placeholder,
    //     imagePosition: "center",
    //     comingSoon: true,
    // },
];

const useHoverPill = (label, color = "#222222") => {
    const [active, setActive] = useState(false);
    const pillRef = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });

    const movePill = (x, y) => {
        posRef.current = { x, y };
        const el = pillRef.current;
        if (!el) return;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    };

    useEffect(() => {
        if (!active) return;
        const { x, y } = posRef.current;
        movePill(x, y);
    }, [active]);

    if (!label) {
        return { handlers: {}, cursorClassName: "", pill: null };
    }

    const handlers = {
        onMouseEnter: (event) => {
            movePill(event.clientX, event.clientY);
            setActive(true);
        },
        onMouseMove: (event) => movePill(event.clientX, event.clientY),
        onMouseLeave: () => setActive(false),
    };

    const pill =
        active &&
        createPortal(
            <div
                ref={pillRef}
                aria-hidden
                className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full px-3.5 py-2 font-fragment text-[11px] leading-none tracking-[0.04em] text-white whitespace-nowrap"
                style={{ left: posRef.current.x, top: posRef.current.y, backgroundColor: color }}
            >
                {label}
            </div>,
            document.body
        );

    return { handlers, cursorClassName: "cursor-none", pill };
};

const ProjectMedia = ({ image, imagePosition, hoverAnimation, className = "" }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <div
            className={`relative aspect-[360/200] w-full overflow-hidden ${className}`}
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
    const pillLabel = project.hoverPill ?? (project.comingSoon ? "COMING SOON!" : null);
    const { handlers, cursorClassName, pill } = useHoverPill(
        pillLabel,
        project.hoverPillColor
    );

    const content = (
        <>
            <ProjectMedia
                image={project.image}
                imagePosition={project.imagePosition}
                hoverAnimation={project.hoverAnimation}
                className={project.mediaClassName}
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
    const isExternal =
        typeof project.href === "string" && /^https?:\/\//i.test(project.href);

    if (isExternal) {
        return (
            <a
                href={project.href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                {...handlers}
            >
                {content}
            </a>
        );
    }

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

    // Warm the HTTP cache with display-sized case-study stills while this
    // page is open, so navigating into a case study reuses those files.
    useEffect(() => {
        if (activeFilter !== FILTERS.design) return;
        const hrefs = [
            spotifyHeroPrefetch,
            plateHeroPrefetch,
            localEatsPrefetch,
            paperCakePrefetch,
            typeLayoutPrefetch,
            colorSystemPrefetch,
            c1s3Prefetch,
        ];
        const links = hrefs.map((href) => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.as = "image";
            link.href = href;
            document.head.appendChild(link);
            return link;
        });
        return () => links.forEach((link) => link.remove());
    }, [activeFilter]);
    const isSoftware = activeFilter === FILTERS.programming;
    const projects = isSoftware ? PROGRAMMING_PROJECTS : DESIGN_PROJECTS;

    return (
        <>
            <PixelTrail />
            <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
                <div className="flex w-full flex-col items-center gap-10 pt-20 pb-0 md:min-h-0 md:h-full md:flex-1 md:flex-row md:items-center md:gap-[clamp(2.5rem,6vw,5rem)] md:pt-0">
                    {/* projects — page scrolls on mobile; column scrolls on desktop */}
                    <div className="flex w-full min-w-0 justify-center md:min-h-0 md:flex-1 md:self-stretch md:overflow-hidden md:justify-start md:pt-16">
                        <div className="flex w-full min-w-0 flex-col py-10 gap-2.5 md:min-h-0 md:h-full md:overflow-hidden">
                            <div className="shrink-0">
                                <WorkFilter active={activeFilter} onChange={setActiveFilter} />
                            </div>
                            <div className="grid w-full grid-cols-1 gap-2.5 md:min-h-0 md:flex-1 md:overflow-x-clip md:overflow-y-auto md:grid-cols-2 md:items-start">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* graph — desktop nav; mobile uses Header */}
                    <div className="hidden h-[342px] min-h-[280px] w-[min(400px,38vw)] max-h-[342px] shrink-0 items-center justify-center self-center md:flex">
                        <Graph onNavigate={navigate} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Work;
