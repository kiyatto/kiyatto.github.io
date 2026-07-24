import { Children, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Lottie from 'lottie-react';

import hero from "../assets/work/spotify-media/hero.png";
import tag_system_mockup from "../assets/work/spotify-media/tag_system_mockup.png";

import tag_animation from '../assets/work/spotify-media/videos/tag_animation.svg';
import playlist_options from "../assets/work/spotify-media/videos/playlist_options.mov";
import add_delete_tags from "../assets/work/spotify-media/videos/add_delete_tags.mov";
import filter_playlist from "../assets/work/spotify-media/videos/filter_playlist.mov";

import c1s1 from "../assets/work/spotify-media/c1s1.svg";
import c1s2 from "../assets/work/spotify-media/c1s2.svg";
import c1s3 from "../assets/work/spotify-media/c1s3.svg";
import c2s1 from "../assets/work/spotify-media/c2s1.svg";
import c2s2 from "../assets/work/spotify-media/c2s2.svg";
import c2s3 from "../assets/work/spotify-media/c2s3.svg";
import c2s4 from "../assets/work/spotify-media/c2s4.svg";
import c2s5 from "../assets/work/spotify-media/c2s5.svg";
import c2s6 from "../assets/work/spotify-media/c2s6.svg";

const SectionLabel = ({ children }) => (
    <h2 className="m-0 w-full font-fragment text-[16px] leading-normal text-[#007228]">
        {children}
    </h2>
);

const BodyText = ({ children, className = "" }) => (
    <p className={`m-0 font-gantari font-normal text-sm leading-relaxed text-[#606060] ${className}`}>
        {children}
    </p>
);

const Heading = ({ children, className = "" }) => (
    <p className={`m-0 font-diphylleia text-[22px] leading-[18px] text-[#222222] ${className}`}>
        {children}
    </p>
);

/** Accent bar spans the full insight block (title + body). */
const ResearchInsight = ({ title, body, accent }) => (
    <div className="flex w-full items-start gap-5 overflow-hidden">
        <div
            className="w-[6px] shrink-0 self-stretch"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-5">
            <p className="m-0 font-diphylleia text-[22px] leading-normal text-[#1f1f1f]">
                {title}
            </p>
            <p className="m-0 font-gantari text-[14px] font-normal leading-normal text-[#606060]">
                {body}
            </p>
        </div>
    </div>
);

const ProcessCard = ({ title, children, tone = "white", size = "carousel", className = "" }) => {
    const sizes = {
        carousel: "h-[320px] w-[min(480px,85vw)] shrink-0 p-10 md:h-[500px] md:w-[min(750px,85vw)]",
        tagProcess:
            "h-auto min-h-[403px] w-[min(858px,90vw)] shrink-0 p-5 md:h-[572px] md:w-[min(858px,85vw)]",
        // Figma filter-process slide scaled +10% then +30%: 858×572
        filterProcess: "box-border h-[572px] w-[858px] shrink-0 p-[29px]",
        full: "h-[320px] w-full p-10 md:h-[500px]",
    };

    return (
        <article
            className={`flex ${sizes[size]} flex-col overflow-hidden border border-[#b3b3b3] bg-white ${className}`}
        >
            {title && (
                <p
                    className={`m-0 mb-5 shrink-0 font-gantari font-bold leading-[18px] ${tone === "dark" ? "text-[13px] text-white" : "text-[16px] text-black"
                        }`}
                >
                    {title}
                </p>
            )}
            {children}
        </article>
    );
};

const CarouselArrow = ({ direction, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9c9c9] bg-white transition-colors ${disabled
            ? "cursor-not-allowed opacity-30"
            : "cursor-pointer hover:border-[#606060] hover:bg-[#f3f3f3]"
            }`}
    >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
                d={direction === "prev" ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"}
                stroke="#222222"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </button>
);

const CarouselDots = ({ count, activeIndex, onSelect }) => (
    <div className="flex items-center gap-[6px]" role="tablist" aria-label="Slide navigation">
        {Array.from({ length: count }).map((_, index) => (
            <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => onSelect(index)}
                className={`h-[6px] cursor-pointer rounded-full border-0 p-0 transition-all ${index === activeIndex ? "w-6 bg-[#222222]" : "w-[6px] bg-[#c9c9c9] hover:bg-[#a3a3a3]"
                    }`}
            />
        ))}
    </div>
);

/** Position of `card` relative to `container`'s own scrollable content, independent of any ancestor positioning */
const getRelativeLeft = (container, card) =>
    card.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;

const ProcessCarousel = ({ children }) => {
    const scrollRef = useRef(null);
    // Tracks the index we've navigated to (or are navigating to), independent of the
    // async scroll/onScroll cycle, so rapid clicks always step by exactly one card.
    const targetIndexRef = useRef(0);
    // While a programmatic (button/dot triggered) scroll is in flight, ignore the
    // scroll events it produces so they don't clobber targetIndexRef mid-animation.
    const isProgrammaticRef = useRef(false);
    const programmaticTimeoutRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const items = Children.toArray(children);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const atStart = el.scrollLeft <= 4;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setCanScrollPrev(!atStart);
        setCanScrollNext(!atEnd);

        const cards = Array.from(el.children);
        if (!cards.length) return;

        let index;
        if (atStart) {
            index = 0;
        } else if (atEnd) {
            index = cards.length - 1;
        } else {
            let closestIndex = 0;
            let closestDistance = Infinity;
            cards.forEach((card, i) => {
                const distance = Math.abs(getRelativeLeft(el, card) - el.scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });
            index = closestIndex;
        }

        setActiveIndex(index);
        // Only resync the nav target from real (e.g. manual swipe/drag) scrolling —
        // not from the scroll events our own smooth-scroll animation generates.
        if (!isProgrammaticRef.current) {
            targetIndexRef.current = index;
        }
    }, []);

    useEffect(() => {
        updateScrollState();
        window.addEventListener("resize", updateScrollState);
        return () => {
            window.removeEventListener("resize", updateScrollState);
            window.clearTimeout(programmaticTimeoutRef.current);
        };
    }, [updateScrollState]);

    const scrollToIndex = (index) => {
        const el = scrollRef.current;
        if (!el || !items.length) return;
        const clampedIndex = Math.min(Math.max(index, 0), items.length - 1);
        const card = el.children[clampedIndex];
        if (!card) return;

        targetIndexRef.current = clampedIndex;
        setActiveIndex(clampedIndex);

        isProgrammaticRef.current = true;
        window.clearTimeout(programmaticTimeoutRef.current);
        programmaticTimeoutRef.current = window.setTimeout(() => {
            isProgrammaticRef.current = false;
        }, 600);

        el.scrollTo({ left: getRelativeLeft(el, card), behavior: "smooth" });
    };

    const scrollByCard = (direction) => {
        scrollToIndex(targetIndexRef.current + direction);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((child, index) => (
                    <div key={index} className="shrink-0 snap-start">
                        {child}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <CarouselDots count={items.length} activeIndex={activeIndex} onSelect={scrollToIndex} />
                <div className="flex items-center gap-3">
                    <p className="m-0 font-fragment text-[13px] leading-normal text-[#8a8a8a]">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </p>
                    <div className="flex items-center gap-2">
                        <CarouselArrow direction="prev" onClick={() => scrollByCard(-1)} disabled={!canScrollPrev} />
                        <CarouselArrow direction="next" onClick={() => scrollByCard(1)} disabled={!canScrollNext} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpotifyTagsPage = () => {
    return (
        <div className="w-full bg-[#f3f3f3] pb-16 pt-6">
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

                    {/* Hero + title share the same width */}
                    <div className="flex w-full flex-col gap-[30px]">
                        <img src={hero} alt="Project hero image displaying Spotify interface with tags" className="w-full h-auto" />
                        <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <h1 className="m-0 max-w-[460px] font-diphylleia text-[26px] font-normal leading-normal text-[#222222]">
                                Introducing{" "}
                                <span
                                    className="text-[40px] font-normal leading-normal"
                                    style={{ fontFamily: '"Reenie Beanie", cursive' }}
                                >
                                    tags
                                </span>{" "}
                                for Spotify
                            </h1>

                            <div className="flex shrink-0 flex-wrap gap-[25px] text-[#222222]">
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">role</p>
                                    <p className="m-0 font-gantari font-extralight text-[14px] leading-normal">
                                        UX Designer
                                    </p>
                                </div>
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">
                                        timeline
                                    </p>
                                    <p className="m-0 font-gantari font-extralight text-[14px] leading-normal">
                                        1 week Sprint
                                    </p>
                                </div>
                                <div className="flex w-[91px] flex-col gap-[5px]">
                                    <p className="m-0 font-fragment text-[13px] leading-normal">tools</p>
                                    <div className="font-gantari font-extralight text-[14px] leading-normal">
                                        <p className="m-0">Typeform</p>
                                        <p className="m-0">Figma</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-40">
                        {/* Context */}
                        <section className="flex w-full flex-col gap-10">
                            <SectionLabel>context</SectionLabel>
                            <Heading>Sound carries memories.</Heading>
                            <div className="flex">
                                <BodyText className="text-[14px]">
                                    Much like how smells can evoke faint recollections of the past,
                                    music can also transport us back to lived experiences: a specific mood, a
                                    version of ourselves, a moment in time.
                                </BodyText>
                            </div>
                        </section>

                        {/* Problem */}
                        <section className="flex w-full flex-col md:flex-row gap-10">
                            <div className="flex flex-1 flex-col gap-10">
                                <SectionLabel>problem</SectionLabel>

                                <div className="flex w-full flex-col gap-[20px]">
                                    <BodyText>
                                        <span className="font-bold text-[#1fa21d]">Spotify</span>, the most
                                        popular music streaming service in the world, allows users to organize
                                        songs into playlists, built to hold collections of songs and bundle them all
                                        together under one description and name.
                                    </BodyText>
                                    <BodyText>
                                        Playlists have a variety of customizations available, but sometimes they can prevent users from fully connecting with their music.
                                    </BodyText>
                                </div>
                            </div>

                            <div className="flex flex-1 items-center justify-center">
                                <div className="flex w-full max-w-[350px] flex-col gap-2">
                                    <video autoPlay loop muted playsInline width="100%">
                                        <source src={playlist_options} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <p className="m-0 w-full text-center font-gantari text-[11px] leading-[18px] text-[#b3b3b3]">
                                        Variations of music organizing options in Spotify
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* User research */}
                        <section className="flex w-full flex-col gap-10">
                            <SectionLabel>user research</SectionLabel>
                            <BodyText>
                                Consulting with several longtime Spotify users about how they used the app to
                                interact with music revealed three main points:
                            </BodyText>
                            <div className="flex w-full flex-col gap-10">
                                <ResearchInsight
                                    title="Moods drive listening sessions"
                                    body="What one user thinks is ‘relaxing’ might be ‘sad’ for another. Moving between genres should be fluidly personalizable for everyone."
                                    accent="#009635"
                                />
                                <ResearchInsight
                                    title="Playlists can be too rigid, forcing premature commitment"
                                    body="Users don’t want to create new playlists for each time their moods shift."
                                    accent="#007429"
                                />
                                <ResearchInsight
                                    title="Songs carry meaning to users that isn’t defined by their placement in a playlist or collection"
                                    body="Users want to record unique connections to individual songs."
                                    accent="#004418"
                                />
                            </div>
                        </section>

                        {/* Question */}
                        <section className="flex w-full flex-col gap-10 py-5">
                            <SectionLabel>question of interest</SectionLabel>
                            <Heading className="max-w-[625px] leading-normal">
                                How might Spotify allow users to flexibly organize songs by feelings or
                                associations without relying solely on playlists?
                            </Heading>
                            <div className="flex flex-col gap-2.5 font-gantari text-[13px] leading-normal text-[#606060]">
                                <BodyText>
                                    Existing playlists may not represent the exact mood a user is chasing, and
                                    building new playlists for each unique feeling easily becomes redundant and
                                    unsustainable.
                                </BodyText>
                                <BodyText>
                                    Meanwhile, Spotify’s “curated” playlists don’t always embody
                                    what a user wants to hear nor what their listening preferences are.
                                </BodyText>
                            </div>
                        </section>

                        {/* Solution */}
                        <section className="flex w-full flex-col gap-10">
                            <SectionLabel>solution</SectionLabel>
                            <div className="flex w-full flex-col gap-10">
                                <Heading>
                                    Introducing: <span className="underline">Tags</span>
                                </Heading>
                                <div className="flex flex-col gap-2.5 font-gantari text-[13px] leading-normal text-[#606060]">
                                    <BodyText>
                                        Tags are flat, customizable attributes that can be created and attached to
                                        any song in a user’s library.
                                    </BodyText>
                                    <BodyText>
                                        Sort of like labels that live within a song’s
                                        metadata in your personal library, visible only to yourself.
                                    </BodyText>
                                </div>

                            </div>

                            <div className="flex justify-center items-center w-full overflow-hidden border border-solid border-[#b3b3b3] bg-white">
                                <img src={tag_animation} alt="Tag animation" className="w-full h-auto max-h-[400px]" />
                            </div>

                            <div className="flex w-full flex-col gap-10 pt-5">
                                <Heading>Tagging allows you to shape your listening, song by song.</Heading>
                                <div className="flex flex-col gap-2.5 font-gantari text-[13px] leading-normal text-[#606060]">
                                    <BodyText>
                                        Filtering through your library happens with the click of a button.
                                    </BodyText>
                                    <BodyText>
                                        Play songs that are “nostalgic”, “good party-vibes”, and “for road
                                        trips” all in one listening session without creating a new playlist.
                                        Want to change up the flow? Simply change up your selected tags!
                                    </BodyText>
                                </div>
                            </div>

                            <div className="relative h-[280px] flex items-center justify-center w-full overflow-hidden border border-solid border-[#b3b3b3] bg-white md:h-[400px]">
                                <img src={tag_system_mockup} alt="Tag system mockup" />
                            </div>
                        </section>

                        {/* Process */}
                        <section className="flex w-full min-w-0 flex-col gap-10">
                            <div className="flex flex-col pt-8">
                                <SectionLabel>
                                    design process - tag system
                                </SectionLabel>
                            </div>

                            <ProcessCarousel>
                                <ProcessCard size="tagProcess">
                                    <div className="flex h-full min-h-0 w-full flex-col gap-6 sm:flex-row sm:gap-10">
                                        <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-[#121212]">
                                            <img src={c1s1} alt="Spotify's playlist interface" className="w-full h-auto" />
                                        </div>
                                        <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 sm:p-5">
                                            <p className="m-0 font-gantari text-[18px] font-semibold leading-[22px] text-[#606060]">
                                                How should users interface with tags?
                                            </p>
                                            <p className="m-0 font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                While considering how users would add and remove tags from songs
                                                in their library, I looked for inspiration from existing
                                                interactions in Spotify, especially ones that took advantage of
                                                spatial and temporal locality.
                                            </p>
                                        </div>
                                    </div>
                                </ProcessCard>

                                <ProcessCard size="tagProcess">
                                    <div className="flex h-full min-h-0 w-full flex-col-reverse gap-6 sm:flex-row sm:items-center sm:gap-10">
                                        <div className="flex min-h-0 w-full flex-col justify-center sm:w-[384px] sm:shrink-0 sm:p-5">
                                            <div className="font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                <p className="m-0">
                                                    The first design iteration bounced
                                                    off of the colored checkboxes from Spotify’s own interface,
                                                    but users found that it was difficult to{" "}
                                                    <strong className="font-bold">distinguish</strong> one tag
                                                    from another.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    Misclicks were common, and some users noted that adding tags
                                                    felt more empty and transactional rather than meaningful.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                                            <img src={c1s2} alt="First iteration of the tag system" className="w-full h-auto" />
                                        </div>
                                    </div>
                                </ProcessCard>

                                <ProcessCard size="tagProcess">
                                    <div className="flex h-full min-h-0 w-full flex-col-reverse gap-6 sm:flex-row sm:items-center sm:gap-10">
                                        <div className="flex min-h-0 w-full flex-col sm:w-[384px] sm:shrink-0 sm:p-5">
                                            <div className="font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                <p className="m-0">
                                                    On the second iteration, I switched to a pill-like structure
                                                    for tags.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    This structure added visual differentiation, separating the
                                                    tagging system from Spotify’s checkbox-style of adding songs
                                                    to playlists and making it easier and more compact to filter
                                                    through.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                                            <img src={c1s3} alt="Second iteration of the tag system" className="w-full h-auto" />
                                        </div>
                                    </div>
                                </ProcessCard>
                            </ProcessCarousel>

                            <SectionLabel>
                                final design - tag system
                            </SectionLabel>
                            <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-black pb-8">
                                <video autoPlay loop muted playsInline className="h-full w-full object-contain">
                                    <source src={add_delete_tags} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            <div className="flex flex-col pt-8">
                                <SectionLabel>
                                    design process - filtering for tags
                                </SectionLabel>
                            </div>

                            <ProcessCarousel>
                                {/* 1 — text 264 + gap 44 + image 308 */}
                                <ProcessCard size="filterProcess">
                                    <div className="flex h-full w-full gap-[57px]">
                                        <div className="flex h-full w-[343px] shrink-0 flex-col justify-between p-[29px] text-[#606060]">
                                            <p className="m-0 font-gantari text-[18px] font-semibold leading-[22px]">
                                                Filtering for moods
                                            </p>
                                            <p className="m-0 font-gantari text-[13px] font-normal leading-[22px]">
                                                A unique function of the tagging system is the ability to filter
                                                through playlists for songs with certain tags, narrowing down
                                                variety to current preferences.
                                            </p>
                                        </div>
                                        <div className="flex h-full w-[400px] shrink-0 items-center justify-center overflow-hidden bg-[#121212]">
                                            <img
                                                src={c2s1}
                                                alt="Filtered playlist song list"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </ProcessCard>

                                {/* 2 — text flex + gap 22 + phone 213; full-bleed height (px only) */}
                                <ProcessCard size="filterProcess" className="!px-[29px] !py-0">
                                    <div className="flex h-full w-full items-center gap-[29px]">
                                        <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center p-[29px]">
                                            <div className="w-full font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                <p className="m-0">
                                                    <strong className="font-bold text-[#1f1f1f]">
                                                        Intuitive, frictionless actions
                                                    </strong>{" "}
                                                    were the priority when designing how to filter for tags.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    Spotify’s interface already displayed a number of actions
                                                    available for personal playlists:{" "}
                                                    <strong className="font-bold">Add, Mix, Edit...</strong>
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    This made it risky to add too many buttons to the existing
                                                    screen for fear of overwhelming the user with potential
                                                    options.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-full w-[277px] shrink-0 overflow-hidden">
                                            <img
                                                src={c2s2}
                                                alt="Playlist interface"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </ProcessCard>

                                {/* 3 — image 308 + gap 44 + text 264 */}
                                <ProcessCard size="filterProcess">
                                    <div className="flex h-full w-full gap-[57px]">
                                        <div className="flex h-full w-[400px] shrink-0 items-center justify-center overflow-hidden bg-[#121212]">
                                            <img
                                                src={c2s3}
                                                alt="Filter option in playlist action bar"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex h-full w-[343px] shrink-0 items-end p-[29px]">
                                            <p className="m-0 font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                In the first iteration of designing a flow for filtering tagged
                                                songs in user playlists, a{" "}
                                                <strong className="font-bold">filter option</strong> nested in
                                                Spotify’s existing action bar was added.
                                            </p>
                                        </div>
                                    </div>
                                </ProcessCard>

                                {/* 4 — text 264 + gap 44 + image 308 */}
                                <ProcessCard size="filterProcess">
                                    <div className="flex h-full w-full gap-[57px]">
                                        <div className="flex h-full w-[343px] shrink-0 items-end p-[29px]">
                                            <p className="m-0 font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                Clicking the <strong className="font-bold">Filter</strong> button
                                                brought up an overlay for users to select from the tags they
                                                wanted to include.
                                            </p>
                                        </div>
                                        <div className="flex h-full w-[400px] shrink-0 items-center justify-center overflow-hidden bg-[#121212]">
                                            <img
                                                src={c2s4}
                                                alt="Select tags overlay"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </ProcessCard>

                                {/* 5 — text 264 + gap 44 + image 308 */}
                                <ProcessCard size="filterProcess">
                                    <div className="flex h-full w-full gap-[57px]">
                                        <div className="flex h-full w-[343px] shrink-0 items-end p-[29px]">
                                            <div className="font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                <p className="m-0">
                                                    An additional{" "}
                                                    <strong className="font-bold">button</strong> to trigger the
                                                    filter in the playlist was added next to the shuffle button,
                                                    intended to make it easier for users to toggle tag filtering
                                                    on and off without having to manually deselect all tags.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    However, nearly{" "}
                                                    <strong className="font-semibold">all users</strong>{" "}
                                                    struggled to recognize during testing that clicking this
                                                    secondary button was necessary to “activate” the filter in
                                                    the playlist.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex h-full w-[400px] shrink-0 items-center justify-center overflow-hidden bg-[#121212]">
                                            <img
                                                src={c2s5}
                                                alt="Filter button"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </ProcessCard>

                                {/* 6 — text 264 + gap 44 + image 308 */}
                                <ProcessCard size="filterProcess">
                                    <div className="flex h-full w-full gap-[57px]">
                                        <div className="flex h-full w-[343px] shrink-0 items-end p-[29px]">
                                            <div className="font-gantari text-[13px] font-normal leading-[22px] text-[#606060]">
                                                <p className="m-0">
                                                    In revising this design, the secondary button for filtering
                                                    was removed, simplifying the already busy interface and
                                                    removing a roadblock from aforementioned usability testing.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    The filtering overlay was then updated to include a{" "}
                                                    <strong className="font-bold">Clear All</strong> option as an
                                                    alternative way to reset a playlist’s state.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    The greater majority of users preferred this second design to
                                                    the first, noting that it felt more intuitive to other
                                                    applications with similar filtering systems.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex h-full w-[400px] shrink-0 items-center justify-center overflow-hidden bg-[#121212]">
                                            <img
                                                src={c2s6}
                                                alt="Clear all tags overlay"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </ProcessCard>
                            </ProcessCarousel>

                            <SectionLabel>
                                final design - filtering for tags
                            </SectionLabel>
                            <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-black pb-8">
                                <video autoPlay loop muted playsInline className="h-full w-full object-contain">
                                    <source src={filter_playlist} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </section>

                        {/* Final thoughts */}
                        <section className="flex w-full flex-col gap-5">
                            <SectionLabel>final thoughts</SectionLabel>
                            <BodyText>
                                This project was strictly scoped to a 1 week timeline, which meant I had to be
                                deliberate with which parts of the research and design project to spend more
                                time on. I chose to conduct a few short but impactful surveys and interviews for my research, ultimately focusing more on developing and prototyping the solution.
                            </BodyText>
                            <BodyText>
                                Given a
                                longer timeline, I would have spent more time working with users during the research phase and added in longer, more detailed user testing sessions during
                                the design process to validate whether actions felt fluid and necessary rather
                                than relying heavily on previous research, heuristic evaluation, and comparison
                                with Spotify’s existing interface.
                            </BodyText>
                            <BodyText>
                                All frames, prototypes, and animations were created in Figma. AI was used to generate initial survey questions and refine concepts.
                            </BodyText>
                            <p className="m-0 font-gantari font-semibold text-sm leading-relaxed text-[#606060]">
                                Want to hear more about the process? Feel free to reach out by email at katong
                                [at] uw [dot] edu.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotifyTagsPage;
