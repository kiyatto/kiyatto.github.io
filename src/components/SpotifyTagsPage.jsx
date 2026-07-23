import { Children, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Lottie from 'lottie-react';

import tag_system_mockup from "../assets/work/spotify-media/tag_system_mockup.png";
import hero from "../assets/work/spotify-media/hero.png";
import filtered_songlist from "../assets/work/spotify-media/filtered_songlist.svg";
import tag_filter_2 from "../assets/work/spotify-media/tag_filter_2.svg";
import spotify_playlist_ui from "../assets/work/spotify-media/spotify_playlist_ui.png";
import tag_overlay_v1 from "../assets/work/spotify-media/tag_overlay_v1.png";
import tag_overlay_v1_filled from "../assets/work/spotify-media/tag_overlay_v1_filled.svg";
import tag_overlay_v2 from "../assets/work/spotify-media/tag_overlay_v2.svg";
import filter_v1 from "../assets/work/spotify-media/filter_v1.svg";

import animation from "../assets/work/spotify-media/tag_animation.mp4";
import mergedAnimation from '../assets/work/spotify-media/merged.json';


import playlist_options from "../assets/work/spotify-media/playlist_options.mov";
import add_delete_tags from "../assets/work/spotify-media/add_delete_tags.mov";
import filter_playlist from "../assets/work/spotify-media/filter_playlist.mov";

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

/** Blank media stand-in — swap for real assets later */
const MediaPlaceholder = ({ className = "", label }) => (
    <div
        className={`flex items-center justify-center bg-[#e8e8e8] ${className}`}
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        aria-label={label}
    />
);

const QuoteCard = ({ quote, accent = "#b3b3b3" }) => (
    <div
        className="flex h-[200px] w-full shrink-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-solid bg-white p-4 md:w-[300px]"
        style={{ borderColor: accent }}
    >
        <p className="m-0 w-full font-fragment text-[24px] leading-normal text-[#484848]">“</p>
        <p className="m-0 w-full font-gantari text-[13px] font-semibold leading-[20px] text-[#484848]">
            {quote}
        </p>
        <p className="m-0 w-full text-right font-fragment text-[24px] leading-normal text-[#484848]">”</p>
    </div>
);

const InsightRow = ({ title, body, quote, bg, border, accent }) => (
    <div className="flex w-full flex-col gap-[30px] md:h-[200px] md:flex-row">
        <div
            className="flex w-full flex-1 flex-col justify-between gap-6 rounded-xl border border-solid px-5 py-[30px] md:h-full"
            style={{ backgroundColor: bg, borderColor: border }}
        >
            <p className="m-0 w-full font-diphylleia text-[22px] leading-normal text-white">
                {title}
            </p>
            <p className="m-0 w-full font-gantari text-[13px] leading-[18px] text-[#cecece]">
                {body}
            </p>
        </div>
        <QuoteCard quote={quote} accent={accent} />
    </div>
);

const ChainedAnimation =() => {
    return (
      <Lottie
        animationData={mergedAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 880, height: 400 }}
      />
    );
  }

const ProcessCard = ({ title, children, tone = "white", size = "carousel", className = "" }) => {
    const tones = {
        white: "bg-white",
        dark: "bg-black text-white",
    };
    const sizes = {
        carousel: "h-[320px] w-[min(480px,85vw)] shrink-0 md:h-[500px] md:w-[min(750px,85vw)]",
        full: "h-[320px] w-full md:h-[500px]",
    };

    return (
        <article
            className={`flex ${sizes[size]} flex-col overflow-hidden border border-[#b3b3b3] p-10 bg-white ${className}`}
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

const RichText = ({ children }) => (
    <div className="font-gantari text-[12px] leading-[22px] text-[#606060] [&_b]:font-bold [&_strong]:font-bold">
        {children}
    </div>
);

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

                <div className="flex min-w-0 w-full flex-col gap-40 pb-10">
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
                    </div>

                    {/* Context */}
                    <section className="flex w-full flex-col gap-10">
                        <SectionLabel>context</SectionLabel>
                        <Heading>Sound carries memories.</Heading>
                        <div className="flex max-w-[710px]">
                            <BodyText className="text-[14px]">
                                Much like how smells can evoke faint recollections of the past and people,
                                music can also transport us back to lived experiences: a specific mood, a
                                version of ourselves, a moment in time.
                            </BodyText>
                        </div>
                    </section>

                    {/* Problem */}
                    <section className="flex w-full flex-row gap-10">
                        <div className="flex flex-col gap-10">
                            <SectionLabel>problem</SectionLabel>
                            <div className="flex flex-col gap-[30px] md:flex-row"> 
                                <div className="flex w-full max-w-[600px] flex-col gap-[20px]">
                                    <BodyText>
                                        <span className="font-bold text-[#1fa21d]">Spotify</span>, the most
                                        popular music streaming service in the world, allows users to organize
                                        songs into customizable playlists.
                                    </BodyText>
                                    <BodyText>
                                        Playlists are built to hold collections of songs, bundling them all
                                        together under one description and name.
                                    </BodyText>
                                    <BodyText>
                                        However, they can lack the ability to capture what a singular song
                                        may mean to us or how it makes us feel, without having to group it
                                        with others.
                                    </BodyText>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full max-w-[425px] flex-col items-center">
                            <div className="flex flex-col items-center justify-center max-w-[300px] gap-2">
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
                            <InsightRow
                                title="1. Moods drive listening sessions"
                                body="What one user thinks is ‘relaxing’ might be ‘sad’ for another. Moving between genres should be fluidly personalizable for everyone."
                                quote="I’ve always wanted to categorize music by “vibe”, since most of my playlists are based off of moods."
                                bg="#3e3e3e"
                                border="#924307"
                                accent="#ec7418"
                            />
                            <InsightRow
                                title="2. Playlists can be too rigid, forcing premature commitment"
                                body="Users don’t want to create new playlists for each time their moods shift."
                                quote="As someone who likes to listen to certain music depending on my mood... labels would be really nice for being able to organize music without necessarily needing to put said music into a playlist."
                                bg="#2f2e2e"
                                border="#13269f"
                                accent="#62aadd"
                            />
                            <InsightRow
                                title="3. Songs carry meaning to users that isn’t defined by their placement in a playlist or collection"
                                body="Users want to record unique connections to individual songs."
                                quote="…then I could add associations to songs without having to associate songs with other songs."
                                bg="#1c1c1c"
                                border="#0a845b"
                                accent="#73c5b7"
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
                        <BodyText>
                            Existing playlists may not represent the exact mood a user is chasing, and
                            building new playlists for each unique feeling easily becomes redundant and
                            unsustainable. Meanwhile, Spotify’s “curated” playlists don’t always embody
                            what a user wants to hear nor what their listening preferences are.
                        </BodyText>
                    </section>

                    {/* Solution */}
                    <section className="flex w-full flex-col gap-10">
                        <SectionLabel>solution</SectionLabel>
                        <div className="flex w-full flex-col gap-10">
                            <Heading>
                                Introducing: <span className="underline">Tags</span>
                            </Heading>
                            <BodyText>
                                Tags are flat, customizable attributes that can be created and attached to
                                any song in a user’s library. Sort of like labels that live within a song’s
                                metadata in your personal library, visible only to yourself.
                            </BodyText>
                        </div>

                        <div className="flex justify-center items-center w-full overflow-hidden border border-solid border-[#b3b3b3] bg-white">
                            <ChainedAnimation />
                            {/* <video autoPlay loop muted playsInline width="100%">
                                <source src={animation} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video> */}
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
                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 gap-10">
                                    <RichText>
                                        <p className="m-0 w-[191px]">
                                            While designing the interface for users to create and add tags
                                            to a song, I took inspiration from existing interactions in
                                            Spotify, especially ones that took advantage of spatial and
                                            temporal locality.
                                        </p>
                                    </RichText>
                                    <div className="flex min-w-0 flex-1 items-end justify-between gap-4">
                                        <div className="flex w-[128px] flex-col gap-2.5">
                                            <img src={spotify_playlist_ui} alt="Spotify playlist UI" className="w-full h-auto max-h-[1024px] rounded-[6px]" />
                                            <p className="m-0 text-center font-gantari text-[12px] leading-[22px] text-[#626262]">
                                                Spotify UI
                                            </p>
                                        </div>
                                        <div className="flex w-[123px] flex-col gap-2.5">
                                            <img src={tag_overlay_v1} alt="Tag overlay V1" className="w-full h-auto max-h-[1024px] rounded-[6px]" />
                                            <p className="m-0 text-center font-gantari text-[12px] leading-[22px] text-[#606060]">
                                                Tag System V1
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 items-center gap-10">
                                    <RichText>
                                        <p className="m-0 w-[268px]">
                                            Version 1 was clean and minimal, but lacked{" "}
                                            <span className="underline">visual features</span> that would
                                            help distinguish one tag from another more easily. As a result,
                                            adding tags felt empty and transactional rather than
                                            meaningful.
                                        </p>
                                    </RichText>
                                    <img src={tag_overlay_v1_filled} alt="Tag overlay V1 filled" className="w-full h-auto max-h-[214px] rounded-[6px]" />
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 items-center gap-10">
                                    <RichText>
                                        <p className="m-0 w-[276px]">
                                            On the second iteration, I switched to a pill-like structure for
                                            tags. This structure added visual differentiation, separating
                                            the tagging system from Spotify’s checkbox-style of adding songs
                                            to playlists and making it easier and more{" "}
                                            <span className="underline">compact</span> for users to filter
                                            through.
                                        </p>
                                    </RichText>
                                    <img src={tag_overlay_v2} alt="Tag overlay V2" className="w-full h-auto max-h-[214px] rounded-[6px]" />
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
                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 items-center gap-[60px]">
                                    <RichText>
                                        <p className="m-0">
                                            A unique function of the tagging system is the ability to
                                            filter through playlists for songs with certain tags, narrowing
                                            down a wide variety to a user’s current preference.
                                        </p>
                                    </RichText>
                                    <img src={filtered_songlist} alt="Mock up of a filtered songlist on Spotify" className="w-full h-auto max-h-[280px] rounded-[8px]" />
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 items-center gap-20">
                                    <RichText>
                                        <p className="m-0">
                                            <strong>Intuitive, frictionless actions</strong> were the
                                            priority when designing how to filter for tags.
                                        </p>
                                        <p className="m-0 mt-[22px]">
                                            Spotify’s interface already displayed a number of actions
                                            available for personal playlists. This made it risky to add too
                                            many buttons to the existing screen for fear of overwhelming the
                                            user with potential options.
                                        </p>
                                    </RichText>
                                    <img src={tag_filter_2} alt="Spotify's UI" className="h-[400px] rounded-[8px]" />
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 gap-6">
                                    <MediaPlaceholder
                                        className="h-full w-[153px] shrink-0 rounded-t-[6px]"
                                        label="Filter option iteration"
                                    />
                                    <RichText>
                                        <p className="m-0">
                                            In the first iteration of designing a flow for filtering tagged
                                            songs in user playlists, a{" "}
                                            <strong className="text-[#e74f84]">filter option</strong> nested
                                            in Spotify’s existing action bar was added.
                                        </p>
                                        <p className="m-0 mt-[22px]">
                                            Clicking this option brought up an overlay for users to select
                                            from existing tags they wanted to include.
                                        </p>
                                    </RichText>
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 gap-6">
                                    <RichText>
                                        <p className="m-0">
                                            An additional{" "}
                                            <strong className="text-[#e74f84]">button</strong> to trigger
                                            the filter in the playlist was added next to the shuffle
                                            button.
                                        </p>
                                        <p className="m-0 mt-[22px]">
                                            This action was intended to make it easier for users to toggle
                                            tag filtering on and off without having to revisit the
                                            filtration settings.
                                        </p>
                                        <p className="m-0 mt-[22px]">
                                            However, usability testing revealed that nearly{" "}
                                            <strong>all participants</strong> struggled to recognize that
                                            this secondary button was necessary to “activate” the filter,
                                            instead becoming confused.
                                        </p>
                                    </RichText>
                                    <div className="flex">
                                        <img src={filter_v1} alt="Filter V1" className="w-full h-auto max-h-[153px] rounded-[6px]" />
                                    </div>
                                </div>
                            </ProcessCard>

                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 flex-col gap-6">
                                    <RichText>
                                        <p className="m-0">
                                            In the second iteration, the secondary button was removed with
                                            the goal of both simplifying the crowded interface and removing
                                            an extra step that had blockaded success.
                                        </p>
                                        <p className="m-0 mt-[22px]">
                                            The filter setting’s overlay was then updated to include a{" "}
                                            <strong>Clear All</strong> option as an alternative way to
                                            reset a playlist’s state.
                                        </p>
                                    </RichText>
                                    <div className="mt-auto flex gap-6">
                                        <MediaPlaceholder
                                            className="h-[166px] w-[130px]"
                                            label="Clear all overlay A"
                                        />
                                        <MediaPlaceholder
                                            className="h-[166px] w-[130px]"
                                            label="Clear all overlay B"
                                        />
                                    </div>
                                </div>
                            </ProcessCard>
                        
                            <ProcessCard>
                                <div className="flex min-h-0 flex-1 flex-col gap-6">
                                    <RichText>
                                        <p className="m-0">
                                            The greater majority of users preferred this second design to
                                            the first, noting that it felt more intuitive to other
                                            applications with similar filtering systems.
                                        </p>
                                    </RichText>
                                    <MediaPlaceholder
                                        className="mx-auto mt-auto h-[240px] w-[188px]"
                                        label="Preferred filter design"
                                    />
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
                            time on. I ultimately chose to prioritize user research and solution formation
                            through conducting a few short but impactful surveys and interviews. Given a
                            longer timeline, I would have added in additional formal user testing during
                            the design process to validate whether actions felt fluid and necessary rather
                            than relying heavily on previous research, heuristic evaluation, and comparison
                            with Spotify’s existing interface.
                        </BodyText>
                        <BodyText>
                            Want to hear more about the process? Feel free to reach out by email at katong
                            [at] uw [dot] edu.
                        </BodyText>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SpotifyTagsPage;
