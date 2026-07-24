import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import designFlower from "../assets/work/design-flower.png";
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
                <span className="font-reenie-beanie text-[20px] leading-5 md:text-[22px]">
                    tags
                </span>{" "}
                for Spotify
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
        description:
            "Designing interfaces for autonomous vehicles.",
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
        description: "A modern, minimalist app for creating and organizing ideas and objects. Built with Cursor.",
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

const ProjectMedia = ({
    image,
    imagePosition,
    hoverAnimation,
    className = "",
    imageClassName = "",
}) => {
    const [playing, setPlaying] = useState(false);

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={hoverAnimation ? () => setPlaying(true) : undefined}
            onMouseLeave={hoverAnimation ? () => setPlaying(false) : undefined}
        >
            <img
                src={image}
                alt=""
                className={`h-full w-full object-cover transition-opacity duration-200 ${
                    playing ? "opacity-0" : "opacity-100"
                } ${imagePosition === "top" ? "object-[center_20%]" : ""} ${imageClassName}`}
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
    <div className="flex items-center gap-5 p-1.5">
        {Object.values(FILTERS).map((filter) => {
            const isActive = active === filter;
            return (
                <button
                    key={filter}
                    type="button"
                    onClick={() => onChange(filter)}
                    aria-pressed={isActive}
                    className={`font-fragment text-[13px] leading-none text-[#545454] cursor-pointer border-none p-[5px] rounded-[10px] ${
                        isActive
                            ? "bg-[#cacaca] min-w-[63px] text-center"
                            : "bg-transparent"
                    }`}
                >
                    {filter}
                </button>
            );
        })}
    </div>
);

const ProjectDescription = ({
    title,
    description,
    titleClassName = "text-[14px]",
    gapClassName = "gap-2.5",
    className = "",
}) => (
    <div className={`flex flex-col ${gapClassName} ${className}`}>
        <p className={`font-diphylleia text-black ${titleClassName}`}>{title}</p>
        <div className="font-gantari font-light text-[12px] leading-5 text-[#606060]">
            <p className="m-0">{description}</p>
        </div>
    </div>
);

const MobileProjectCard = ({ project }) => {
    const { handlers, cursorClassName, pill } = useComingSoonCursor(project.comingSoon);

    const content = (
        <>
            <ProjectMedia
                image={project.image}
                imagePosition={project.imagePosition}
                hoverAnimation={project.hoverAnimation}
                className="h-[200px] w-full"
            />
            <ProjectDescription
                title={project.title}
                description={project.description}
                className="px-2.5 pb-[5px]"
            />
            {pill}
        </>
    );

    const className =
        `flex w-full flex-col gap-2.5 overflow-hidden rounded-[4px] border border-[#e2e2e2] text-inherit no-underline ${cursorClassName}`;

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

const DesktopFeaturedCard = ({ project }) => {
    const { handlers, cursorClassName, pill } = useComingSoonCursor(project.comingSoon);

    const content = (
        <>
            <ProjectMedia
                image={project.image}
                imagePosition={project.imagePosition}
                hoverAnimation={project.hoverAnimation}
                className="min-h-0 flex-1"
                imageClassName="object-[center_20%]"
            />
            <ProjectDescription
                title={project.title}
                description={project.description}
                titleClassName="text-[16px] leading-5"
                gapClassName="gap-2.5"
                className="p-[15px]"
            />
            {pill}
        </>
    );

    const className =
        `flex h-full min-w-0 flex-[725] flex-col overflow-hidden rounded-[4px] border border-[#e2e2e2] text-inherit no-underline ${cursorClassName}`;

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

const DesktopSideCard = ({ project }) => {
    const { handlers, cursorClassName, pill } = useComingSoonCursor(project.comingSoon);

    return (
        <article
            className={`flex min-h-0 flex-1 overflow-hidden border border-[#e2e2e2] ${cursorClassName}`}
            {...handlers}
        >
            <div className="relative min-w-0 flex-1 overflow-hidden">
                <img src={project.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex min-w-[100px] max-w-[167px] shrink basis-[35%] flex-col justify-between px-[15px] py-2.5">
                <p className="font-diphylleia text-[16px] text-black">{project.title}</p>
                <p className="font-gantari font-light text-[12px] leading-5 text-[#606060]">
                    {project.description}
                </p>
            </div>
            {pill}
        </article>
    );
};

const DesignDesktopLayout = ({ projects }) => {
    const [featured, ...sideProjects] = projects;

    return (
        <div className="flex h-full min-h-0 w-full gap-[25px]">
            <DesktopFeaturedCard project={featured} />
            <div className="flex min-w-0 flex-[400] flex-col gap-[25px]">
                {sideProjects.map((project) => (
                    <DesktopSideCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

const ProgrammingCard = ({ project }) => {
    const { handlers, cursorClassName, pill } = useComingSoonCursor(project.comingSoon);

    const content = (
        <>
            <div className="relative h-[200px] w-full shrink-0 overflow-hidden md:h-[250px]">
                <img
                    src={project.image}
                    alt=""
                    className={`h-full w-full object-cover ${
                        project.imagePosition === "top" ? "object-[center_20%]" : ""
                    }`}
                />
            </div>
            <ProjectDescription
                title={project.title}
                description={project.description}
                titleClassName="text-[16px]"
                gapClassName="gap-[15px]"
                className="flex-1 px-[15px] py-2.5"
            />
            {pill}
        </>
    );

    const className =
        `flex min-h-0 w-full flex-col overflow-hidden border border-[#e2e2e2] text-inherit no-underline md:h-[388px] ${cursorClassName}`;

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

const ProgrammingDesktopLayout = ({ projects }) => (
    <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
            <ProgrammingCard key={project.id} project={project} />
        ))}
    </div>
);

const Work = () => {
    const [activeFilter, setActiveFilter] = useState(FILTERS.design);
    const projects = activeFilter === FILTERS.design ? DESIGN_PROJECTS : PROGRAMMING_PROJECTS;

    return (
        <div className="h-full w-full md:overflow-hidden pt-6">
            {/* mobile */}
            <div className="md:hidden flex min-h-full w-full justify-center overflow-y-auto py-12">
                <div
                    className="flex flex-col gap-5"
                    style={{ width: "82vw", maxWidth: "336px" }}
                >
                    <h1 className="font-diphylleia text-2xl text-[#222222]">work</h1>
                    <WorkFilter active={activeFilter} onChange={setActiveFilter} />
                    <hr className="m-0 w-full border-0 border-t border-[#e2e2e2]" />
                    {projects.length > 0 && (
                        <div className="flex flex-col gap-[30px]">
                            {activeFilter === FILTERS.design
                                ? projects.map((project) => (
                                      <MobileProjectCard key={project.id} project={project} />
                                  ))
                                : projects.map((project) => (
                                      <ProgrammingCard key={project.id} project={project} />
                                  ))}
                        </div>
                    )}
                </div>
            </div>

            {/* desktop — fills the viewport content area, no page scroll */}
            <div className="hidden md:flex h-full w-full justify-center">
                <div
                    className="flex h-full min-h-0 flex-col gap-[30px]"
                    style={{ width: "80vw", maxWidth: "1150px" }}
                >
                    <div className="flex w-full shrink-0 items-center justify-between">
                        <h1 className="font-diphylleia text-[26px] text-black">work</h1>
                        <WorkFilter active={activeFilter} onChange={setActiveFilter} />
                    </div>
                    <div
                        className={`min-h-0 flex-1 ${
                            activeFilter === FILTERS.design ? "" : "overflow-y-auto"
                        }`}
                    >
                        {activeFilter === FILTERS.design ? (
                            <DesignDesktopLayout projects={projects} />
                        ) : (
                            <ProgrammingDesktopLayout projects={projects} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Work;
