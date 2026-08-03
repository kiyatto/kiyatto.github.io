import { useState } from "react";
import { Link } from "react-router";

import hero from "../assets/work/spotify-media/hero.png";

import tag_animation from '../assets/work/spotify-media/videos/tag_animation.svg';
import playlist_options from "../assets/work/spotify-media/videos/playlist_options.mov";
import add_delete_tags from "../assets/work/spotify-media/videos/add_delete_tags.mov";
import filter_playlist from "../assets/work/spotify-media/videos/filter_playlist.mov";
import filterv1 from "../assets/work/spotify-media/videos/filterv1.mov";
import filterv2 from "../assets/work/spotify-media/videos/filterv2.mov";

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

const ProcessBody = ({ children, className = "" }) => (
    <div className={`font-gantari text-[13px] font-normal leading-[22px] text-[#606060] ${className}`}>
        {children}
    </div>
);

const FINAL_DESIGN_VIDEOS = [
    { id: "tagging", label: "adding tags", src: add_delete_tags },
    { id: "filtering", label: "filtering", src: filter_playlist },
];

const FinalDesignDemo = () => {
    const [activeId, setActiveId] = useState(FINAL_DESIGN_VIDEOS[0].id);
    const activeVideo = FINAL_DESIGN_VIDEOS.find((video) => video.id === activeId);

    return (
        <div className="relative flex h-[480px] w-full flex-col overflow-hidden border border-solid border-[#b3b3b3] bg-black md:h-[690px] pt-2 pb-6">
            <div
                className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-[8px] bg-black/70 p-1 backdrop-blur-sm"
                role="tablist"
                aria-label="Final design demos"
            >
                {FINAL_DESIGN_VIDEOS.map((video) => {
                    const isActive = video.id === activeId;
                    return (
                        <button
                            key={video.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveId(video.id)}
                            className={`cursor-pointer border-none px-2.5 py-1.5 font-fragment text-[12px] leading-none transition-colors ${
                                isActive
                                    ? "rounded-[6px] bg-white text-[#222222]"
                                    : "bg-transparent text-[#c9c9c9] hover:text-white"
                            }`}
                        >
                            {video.label}
                        </button>
                    );
                })}
            </div>
            <video
                key={activeVideo.id}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
            >
                <source src={activeVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

const SpotifyTagsPage = () => {
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

                            <FinalDesignDemo />
                        </section>

                        {/* Process */}
                        <section className="flex w-full min-w-0 flex-col gap-10">
                            <div className="flex w-full flex-col gap-10">
                                <SectionLabel>design process</SectionLabel>

                                <div className="flex w-full flex-col gap-[100px]">
                                    {/* Tag system iterations */}
                                    <div className="flex w-full flex-col gap-20">
                                        <div className="flex w-full flex-col items-center gap-10 md:flex-row justify-between">
                                            <div className="flex w-full max-w-[483px] flex-col gap-10 md:shrink-0">
                                                <p className="m-0 font-gantari text-[18px] font-semibold leading-[22px] text-[#606060]">
                                                    How should users interface with tags?
                                                </p>
                                                <ProcessBody>
                                                    <p className="m-0">
                                                        While considering how users would add and remove tags from
                                                        songs in their library, I looked for inspiration from
                                                        existing interactions in Spotify, especially ones that took
                                                        advantage of spatial and temporal locality.
                                                    </p>
                                                    <p className="m-0 mt-[18px]">
                                                        The first design iteration was clean and minimal, bouncing
                                                        off of the colored checkboxes from Spotify’s own interface,
                                                        but users found that it was difficult to{" "}
                                                        <strong className="font-bold">distinguish</strong> one tag
                                                        from another. Misclicks were common, and some users noted
                                                        that adding tags felt more empty and transactional rather
                                                        than meaningful.
                                                    </p>
                                                </ProcessBody>
                                            </div>
                                            <img src={c1s2} />
                                        </div>

                                        <div className="flex w-full flex-col-reverse items-center gap-10 md:flex-row justify-between">

                                            <ProcessBody className="w-full max-w-[483px] md:shrink-0">
                                                <p className="m-0">
                                                    On the second iteration, I switched to a pill-like structure for
                                                    tags.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    This structure added visual differentiation, separating the
                                                    tagging system from Spotify’s checkbox-style of adding songs to
                                                    playlists and making it easier and more compact to filter
                                                    through.
                                                </p>
                                            </ProcessBody>
                                            <img src={c1s3} />
                                        </div>
                                    </div>

                                    {/* Filtering intro */}
                                    <div className="flex w-full max-w-[1000px] flex-col gap-10">
                                        <p className="m-0 font-gantari text-[18px] font-semibold leading-[22px] text-[#606060]">
                                            How can users use tags to filter for songs they want to play?
                                        </p>
                                        <ProcessBody>
                                            <p className="m-0">
                                                <strong className="font-bold">
                                                    Intuitive, frictionless actions{" "}
                                                </strong>
                                                were the priority when designing how to filter through playlists for
                                                songs with certain tags.
                                            </p>
                                            <p className="m-0 mt-[22px]">
                                                Spotify’s interface already displayed a number of actions available
                                                for personal playlists, for example, Add, Mix, Edit. This made it
                                                risky to add too many buttons to the existing screen for fear of
                                                overwhelming the user with potential options.
                                            </p>
                                        </ProcessBody>
                                    </div>

                                    {/* Filtering iteration 1 */}
                                    <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:gap-[120px]">
                                        <ProcessBody className="flex w-full max-w-[450px] flex-col gap-5 md:shrink-0">
                                            <p className="m-0">
                                                In the first iteration of designing a flow for filtering tagged songs
                                                in user playlists, a{" "}
                                                <strong className="font-bold">filter option</strong> nested in
                                                Spotify’s existing action bar was added. Clicking it brought up an
                                                overlay for users to select from the tags they wanted to include.
                                            </p>
                                            <div>
                                                <p className="m-0">
                                                    An additional{" "}
                                                    <strong className="font-bold">button</strong> to “activate” the
                                                    filter in the playlist was added next to the shuffle button,
                                                    intended to make it easier for users to toggle tag filtering on
                                                    and off without having to manually deselect all tags.
                                                </p>
                                                <p className="m-0 mt-[22px]">
                                                    However, nearly{" "}
                                                    <strong className="font-semibold">all users</strong> struggled to
                                                    recognize during testing that clicking this secondary button was
                                                    necessary to “activate” the filter in the playlist.
                                                </p>
                                            </div>
                                        </ProcessBody>
                                        <div className="relative h-[560px] w-full max-w-[430px] flex-1 overflow-hidden bg-black pb-4">
                                            <video
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 pb-4"
                                            >
                                                <source src={filterv1} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>

                                    {/* Filtering iteration 2 */}
                                    <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:gap-[120px]">
                                        <div className="relative h-[560px] w-full max-w-[430px] flex-1 overflow-hidden bg-black">
                                            <video
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 pb-4"
                                            >
                                                <source src={filterv2} type="video/mp4" />
                                            </video>
                                        </div>
                                        <ProcessBody className="w-full max-w-[440px] flex-1">
                                            <p className="m-0">
                                                In revising this design, the secondary button for filtering was
                                                removed in order to simplify the interface.
                                            </p>
                                            <p className="m-0 mt-[22px]">
                                                The filtering overlay was then updated to include a{" "}
                                                <strong className="font-bold">Clear All </strong>
                                                option as the way to easily reset a playlist’s state.
                                            </p>
                                            <p className="m-0 mt-[22px]">
                                                Test users preferred this second design to the first, noting that it
                                                felt more intuitive to other applications with similar filtering
                                                systems.
                                            </p>
                                        </ProcessBody>
                                    </div>
                                </div>
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
