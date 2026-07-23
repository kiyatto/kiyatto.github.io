import { useState } from "react";
import { Link } from "react-router";

import designFlower from "../assets/work/design-flower.png";
import designBird from "../assets/work/design-bird.png";
import plateMag from "../assets/work/plate-mag.png";

import spotify_hero from "../assets/work/spotify-media/hero.png";

const FILTERS = {
    design: "design",
    programming: "software",
};

const DESIGN_PROJECTS = [
    {
        id: "design-1",
        title: "Introducing tags for Spotify",
        description: "Reinventing how we record memories and feelings through music.",
        image: spotify_hero,
        imagePosition: "top",
        href: "/work/spotify-tags",
    },
    {
        id: "design-2",
        title: "plate. magazine",
        description: "Web and system design for a playful publication centered around food.",
        image: plateMag,
        imagePosition: "center",
    },
    {
        id: "design-3",
        title: "Autonomous SD",
        description:
            "Designing interfaces for autonomous vehicles.",
        image: designBird,
        imagePosition: "center",
    },
];

const PROGRAMMING_PROJECTS = [
    {
        id: "programming-1",
        title: "muff",
        description: "Byte-code interpreter for a simple, general-purpose PL.",
        image: designFlower,
        imagePosition: "top",
    },
    {
        id: "programming-2",
        title: "stash",
        description: "A modern, minimalist app for creating and organizing ideas and objects.",
        note: "Built with Cursor.",
        image: designBird,
        imagePosition: "center",
    },
    {
        id: "programming-3",
        title: "kanji reader",
        description: "Recognition system for 2,965 kanji and 71 hiragana characters.",
        image: plateMag,
        imagePosition: "center",
    },
];

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
    note,
    titleClassName = "text-[14px]",
    gapClassName = "gap-2.5",
    className = "",
}) => (
    <div className={`flex flex-col ${gapClassName} ${className}`}>
        <p className={`font-diphylleia text-black ${titleClassName}`}>{title}</p>
        <div className="font-gantari font-light text-[12px] leading-5 text-[#606060]">
            <p className="m-0">{description}</p>
            {note ? <p className="m-0 mt-5">{note}</p> : null}
        </div>
    </div>
);

const MobileProjectCard = ({ project }) => {
    const content = (
        <>
            <div className="relative h-[200px] w-full overflow-hidden">
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
                note={project.note}
                className="px-2.5 pb-[5px]"
            />
        </>
    );

    const className =
        "flex w-full flex-col gap-2.5 overflow-hidden rounded-[4px] border border-[#e2e2e2] text-inherit no-underline";

    if (project.href) {
        return (
            <Link to={project.href} className={className}>
                {content}
            </Link>
        );
    }

    return <article className={className}>{content}</article>;
};

const DesktopFeaturedCard = ({ project }) => {
    const content = (
        <>
            <div className="relative min-h-0 flex-1 overflow-hidden">
                <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover object-[center_20%]"
                />
            </div>
            <ProjectDescription
                title={project.title}
                description={project.description}
                titleClassName="text-[18px]"
                className="p-[15px]"
            />
        </>
    );

    const className =
        "flex h-full min-w-0 flex-[725] flex-col overflow-hidden rounded-[4px] border border-[#e2e2e2] text-inherit no-underline";

    if (project.href) {
        return (
            <Link to={project.href} className={className}>
                {content}
            </Link>
        );
    }

    return <article className={className}>{content}</article>;
};

const DesktopSideCard = ({ project }) => (
    <article className="flex min-h-0 flex-1 overflow-hidden border border-[#e2e2e2]">
        <div className="relative min-w-0 flex-1 overflow-hidden">
            <img src={project.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-[100px] max-w-[167px] shrink basis-[35%] flex-col justify-between px-[15px] py-2.5">
            <p className="font-diphylleia text-[16px] text-black">{project.title}</p>
            <p className="font-gantari font-light text-[12px] leading-5 text-[#606060]">
                {project.description}
            </p>
        </div>
    </article>
);

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
                note={project.note}
                titleClassName="text-[16px]"
                gapClassName="gap-[15px]"
                className="flex-1 px-[15px] py-2.5"
            />
        </>
    );

    const className =
        "flex min-h-0 w-full flex-col overflow-hidden border border-[#e2e2e2] text-inherit no-underline md:h-[388px]";

    if (project.href) {
        return (
            <Link to={project.href} className={className}>
                {content}
            </Link>
        );
    }

    return <article className={className}>{content}</article>;
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
