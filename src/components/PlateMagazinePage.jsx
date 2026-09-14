import { Link } from "react-router";

const SectionLabel = ({ children }) => (
    <h2 className="m-0 w-full font-fragment text-[16px] leading-normal text-[#9f280e]">
        {children}
    </h2>
);

const BodyText = ({ children, className = "" }) => (
    <p
        className={`m-0 font-gantari font-normal text-[14px] leading-[18px] text-[#606060] ${className}`}
    >
        {children}
    </p>
);

const MediaPlaceholder = ({ className = "", label }) => (
    <div
        role="img"
        aria-label={label}
        className={`border border-solid border-[#b3b3b3] bg-[#e8e8e8] ${className}`}
    />
);

/**
 * Plate magazine case study — Figma node 1735:4579.
 * Layout mirrors SpotifyTagsPage; media is placeholder until assets are added.
 */
const PlateMagazinePage = () => {
    return (
        <div className="w-full bg-white pb-16 pt-6">
            <div className="grid w-full grid-cols-1 px-6 md:grid-cols-[220px_1fr] md:px-0 md:pr-40">
                <div className="hidden justify-start pl-10 pt-1 md:flex">
                    <Link
                        to="/work"
                        className="sticky top-4 h-fit font-fragment text-[14px] leading-normal text-[#606060] no-underline"
                    >
                        &lt; back
                    </Link>
                </div>

                <div className="flex min-w-0 w-full flex-col gap-20 pb-10">
                    <Link
                        to="/work"
                        className="font-fragment text-[14px] leading-normal text-[#606060] no-underline md:hidden"
                    >
                        &lt; back
                    </Link>

                    <div className="flex w-full flex-col gap-[30px]">
                        <MediaPlaceholder
                            className="aspect-[1160/360] w-full"
                            label="Project hero placeholder"
                        />
                        <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <h1 className="m-0 max-w-[460px] font-diphylleia text-[26px] font-normal leading-normal text-[#222222]">
                                Building a design system for{" "}
                                <span className="font-source-serif font-semibold">
                                    plate. magazine
                                </span>
                                ’s first online presence
                            </h1>

                            <div className="flex shrink-0 flex-wrap gap-[25px] text-[#222222]">
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">
                                        role
                                    </p>
                                    <div className="font-gantari font-extralight text-[14px] leading-normal">
                                        <p className="m-0">Designer +</p>
                                        <p className="m-0">Developer</p>
                                    </div>
                                </div>
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">
                                        timeline
                                    </p>
                                    <p className="m-0 font-gantari font-extralight text-[14px] leading-normal">
                                        2 Months
                                    </p>
                                </div>
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">
                                        tools
                                    </p>
                                    <div className="font-gantari font-extralight text-[14px] leading-normal">
                                        <p className="m-0">Figma</p>
                                        <p className="m-0">Cursor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-20">
                        <section className="flex w-full flex-col gap-10">
                            <SectionLabel>brief</SectionLabel>
                            <BodyText>
                                plate. magazine is an early-stage publication centered around
                                stories and experiences with food.
                            </BodyText>
                            <BodyText>
                                Over the summer, I built a micro-design system in order to build
                                scalable consistency for their brand. I also designed and deployed
                                their first public-facing website, serving as a home for online
                                articles, print issue orders, and information.
                            </BodyText>
                        </section>

                        <section className="flex w-full flex-col items-center gap-10 md:flex-row md:justify-between">
                            <div className="flex flex-1 items-center justify-center">
                                <MediaPlaceholder
                                    className="h-[284px] w-[203px]"
                                    label="Magazine cover placeholder"
                                />
                            </div>
                            <div className="flex w-full flex-1 flex-col gap-5">
                                <SectionLabel>why design system?</SectionLabel>
                                <div className="flex flex-col gap-[60px]">
                                    <BodyText className="text-[13px]">
                                        When I joined the team, design was largely freeform. Magazine
                                        and social media layouts differed greatly based on content and
                                        themes, and graphics had no standardized style.
                                    </BodyText>
                                    <BodyText className="text-[13px]">
                                        plate. had just released their first issue and was working on
                                        their second, so there wasn’t a large archive of past design
                                        material to work off of.
                                    </BodyText>
                                </div>
                            </div>
                        </section>

                        <section className="flex w-full flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
                            <div className="flex w-full flex-1 flex-col gap-6">
                                <BodyText className="text-[13px]">
                                    It seemed at first a little unnatural and backwards to develop a
                                    design system for a magazine that didn’t want to be constrained by
                                    strict formatting guidelines. But as I recognized, part of what
                                    plate. was developing was a brand, and for a brand to be
                                    recognizable, it must be consistent.
                                </BodyText>
                                <BodyText className="text-[13px]">
                                    Design systems allow for replication at scale and a focus on
                                    information flows, but most importantly, they allow for different
                                    products and teams to work with a coordinated design language that
                                    ensures visual consistency.
                                </BodyText>
                                <BodyText className="text-[13px]">
                                    A small system, even limited, would help define what made this
                                    brand memorable, and ensure that it could scale well in the future.
                                </BodyText>
                            </div>
                            <div className="flex flex-1 items-center justify-center">
                                <MediaPlaceholder
                                    className="h-[284px] w-[203px]"
                                    label="Magazine spread placeholder"
                                />
                            </div>
                        </section>

                        <section className="flex w-full flex-col gap-10 py-5">
                            <SectionLabel>defining standards</SectionLabel>
                            <div className="flex w-full flex-col gap-6">
                                <MediaPlaceholder
                                    className="aspect-[4096/2525] w-full"
                                    label="Typography, color, and layout system placeholder"
                                />
                                <BodyText className="text-[16px] leading-normal">
                                    I defined typography hierarchies and color systems, documenting
                                    occasions on which to use specific text styles or colors.
                                </BodyText>
                            </div>
                        </section>

                        <section className="flex w-full flex-col gap-10 py-5">
                            <SectionLabel>creating style</SectionLabel>
                            <div className="flex w-full flex-col gap-6">
                                <MediaPlaceholder
                                    className="aspect-[2560/1664] w-full"
                                    label="Website screenshot placeholder"
                                />
                                <div className="flex w-full flex-col gap-6 md:flex-row">
                                    <MediaPlaceholder
                                        className="h-[202px] w-full md:w-[63.8%]"
                                        label="Events section screenshot placeholder"
                                    />
                                    <MediaPlaceholder
                                        className="h-[202px] w-full md:flex-1"
                                        label="Plate object placeholder"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="flex w-full flex-col">
                            <BodyText>
                                Want to hear more about the process? Feel free to reach out by email
                                at katong [at] uw [dot] edu.
                            </BodyText>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlateMagazinePage;
