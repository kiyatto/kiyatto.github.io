import { Link } from "react-router";

const SectionLabel = ({ children }) => (
    <p className="m-0 w-full font-fragment text-[16px] leading-normal text-[#007228]">
        {children}
    </p>
);

const BodyText = ({ children, className = "" }) => (
    <p className={`m-0 font-gantari font-normal text-[13px] leading-[18px] text-[#606060] ${className}`}>
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

const QuoteCard = ({ quote, bg }) => (
    <div
        className="flex h-[180px] w-full shrink-0 flex-col items-center justify-between overflow-hidden rounded-[2px] p-4"
        style={{ backgroundColor: bg }}
    >
        <p className="m-0 w-full font-fragment text-[24px] leading-none text-[#484848]">“</p>
        <p className="m-0 w-full font-gantari text-[12px] leading-normal text-[#3d3d3d]">{quote}</p>
        <p className="m-0 w-full text-right font-fragment text-[24px] leading-none text-[#484848]">”</p>
    </div>
);

const InsightColumn = ({ title, body, quote, quoteBg }) => (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-6 overflow-hidden md:h-[300px] md:gap-0">
        <div className="flex w-full flex-col gap-4">
            <p className="m-0 w-full font-gantari font-medium text-[16px] leading-normal text-[#222222]">
                {title}
            </p>
            <BodyText>{body}</BodyText>
        </div>
        <QuoteCard quote={quote} bg={quoteBg} />
    </div>
);

const ProcessCard = ({ title, children, tone = "peach", className = "" }) => {
    const tones = {
        peach: "bg-[#f7dccc]",
        sand: "bg-[#f4e7cb]",
        dark: "bg-black text-white",
    };

    return (
        <article
            className={`flex h-[400px] w-[min(600px,85vw)] shrink-0 flex-col overflow-hidden border border-[#b3b3b3] p-10 ${tones[tone]} ${className}`}
        >
            {title && (
                <p
                    className={`m-0 mb-5 shrink-0 font-gantari font-bold leading-[18px] ${
                        tone === "dark" ? "text-[13px] text-white" : "text-[16px] text-black"
                    }`}
                >
                    {title}
                </p>
            )}
            {children}
        </article>
    );
};

const ProcessCarousel = ({ children }) => (
    <div className="flex w-full items-start overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
        <div className="flex gap-5">{children}</div>
    </div>
);

const RichText = ({ children }) => (
    <div className="font-gantari text-[12px] leading-[22px] text-[#606060] [&_b]:font-bold [&_strong]:font-bold">
        {children}
    </div>
);

const SpotifyTagsPage = () => {
    return (
        <div className="w-full bg-[#f3f3f3] pb-16 pt-6">
            {/*
              3-column grid keeps the 880px content truly centered.
              Back lives in the left 1fr gutter, flush toward the content.
            */}
            <div className="grid w-full grid-cols-1 px-6 md:grid-cols-[1fr_minmax(0,880px)_1fr] md:px-0">
                <div className="hidden justify-end pr-10 pt-1 md:flex">
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
                        <MediaPlaceholder
                            className="h-[180px] w-full sm:h-[220px] md:h-[272px]"
                            label="Project hero"
                        />

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
                    <BodyText className="text-[14px]">
                        Much like how smells can evoke faint recollections of the past and people,
                        music can also transport us back to lived experiences: a specific mood, a
                        version of ourselves, a moment in time.
                    </BodyText>
                </section>

                {/* Problem */}
                <section className="flex w-full flex-col gap-10">
                    <SectionLabel>problem</SectionLabel>
                    <div className="flex flex-col gap-[30px] md:flex-row">
                        <div className="flex w-full max-w-[425px] flex-col gap-[60px]">
                            <BodyText>
                                <span className="font-bold text-[#1fa21d]">Spotify</span>, the most
                                popular music streaming service in the world, allows users to organize
                                songs into customizable playlists.
                            </BodyText>
                            <div className="flex flex-col gap-[18px]">
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
                        <div className="flex w-full max-w-[425px] flex-col items-center gap-2">
                            <MediaPlaceholder
                                className="h-[264px] w-[242px] rounded-[4px]"
                                label="Spotify organizing options"
                            />
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
                        interact music revealed three main pain points:
                    </BodyText>
                    <div className="flex w-full flex-col gap-10 md:flex-row md:gap-[30px]">
                        <InsightColumn
                            title="1. Playlists are too rigid, forcing premature commitment"
                            body="Users don’t want to create new playlists for each time their moods shift."
                            quote="“As someone who likes to listen to certain music depending on my mood... [song] labels would be really nice for being able to organize music without necessarily needing to put said music into a playlist.”"
                            quoteBg="#a5b910"
                        />
                        <div className="hidden w-px shrink-0 self-stretch bg-[#d0d0d0] md:block" />
                        <InsightColumn
                            title="2. Moods and genres don’t map cleanly to playlist structures"
                            body="Moving between different genres/moods of music should feel freeform, fluid, and customizable."
                            quote="“I’ve always wanted to categorize music by “vibe”, since most of my playlists are based off of moods.”"
                            quoteBg="#f79d37"
                        />
                        <div className="hidden w-px shrink-0 self-stretch bg-[#d0d0d0] md:block" />
                        <InsightColumn
                            title="3. Songs carry meaning independent of playlists"
                            body="Users want to record connections to songs that are unique to the song itself."
                            quote="“…then I could add associations to songs without having to associate songs with other songs.”"
                            quoteBg="#f67d7d"
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
                    <p className="m-0 w-full font-gantari text-[12px] leading-[18px] text-[#606060]">
                        Existing playlists may not represent the exact mood a user is chasing, and
                        building new playlists for each unique feeling easily becomes redundant and
                        unsustainable. Meanwhile, Spotify’s “curated” playlists don’t always embody
                        what a user wants to hear nor what their listening preferences are.
                    </p>
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

                    <div className="w-full overflow-hidden border border-solid border-[#b3b3b3] bg-[#fbfbfb]">
                        <MediaPlaceholder
                            className="h-[280px] w-full md:h-[400px]"
                            label="Tag assignment animation"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-10 pt-5">
                        <Heading>Tagging allows you to shape your listening, song by song.</Heading>
                        <div className="flex flex-col gap-2.5 font-gantari text-[13px] leading-normal text-[#606060]">
                            <p className="m-0">
                                Filtering through your library happens with the click of a button.
                            </p>
                            <p className="m-0">
                                Play songs that are “nostalgic”, “good party-vibes”, and “for road
                                trips” all in one listening session without creating a new playlist.
                                Want to change up the flow? Simply change up your selected tags!
                            </p>
                        </div>
                    </div>

                    <div className="relative h-[280px] w-full overflow-hidden border border-solid border-[#b3b3b3] bg-white md:h-[400px]">
                        <MediaPlaceholder
                            className="absolute inset-0 size-full"
                            label="Tag filtering UI"
                        />
                    </div>
                </section>

                {/* Process */}
                <section className="flex w-full flex-col gap-10 overflow-x-auto">
                    <SectionLabel>process + final designs</SectionLabel>

                    <ProcessCarousel>
                        <ProcessCard title="Designing the Tag System" tone="peach">
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
                                        <MediaPlaceholder
                                            className="aspect-[414/837] w-full rounded-[6px]"
                                            label="Spotify UI"
                                        />
                                        <p className="m-0 text-center font-gantari text-[12px] leading-[22px] text-[#626262]">
                                            Spotify UI
                                        </p>
                                    </div>
                                    <div className="flex w-[123px] flex-col gap-2.5">
                                        <MediaPlaceholder
                                            className="aspect-[804/1024] w-full rounded-[6px]"
                                            label="Tag System V1"
                                        />
                                        <p className="m-0 text-center font-gantari text-[12px] leading-[22px] text-[#606060]">
                                            Tag System V1
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Designing the Tag System" tone="peach">
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
                                <MediaPlaceholder
                                    className="h-[214px] w-[168px] shrink-0 rounded-[6px]"
                                    label="Tag system iteration"
                                />
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Designing the Tag System" tone="peach">
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
                                <MediaPlaceholder
                                    className="h-[214px] w-[168px] shrink-0 rounded-[6px]"
                                    label="Pill tag iteration"
                                />
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Tag System - Final Design" tone="dark">
                            <MediaPlaceholder
                                className="min-h-0 flex-1 w-full"
                                label="Tag system final design video"
                            />
                        </ProcessCard>
                    </ProcessCarousel>

                    <ProcessCarousel>
                        <ProcessCard title="Filtering for Tags" tone="sand">
                            <div className="flex min-h-0 flex-1 items-center gap-[60px]">
                                <RichText>
                                    <p className="m-0">
                                        A unique function of the tagging system is the ability to
                                        filter through playlists for songs with certain tags, narrowing
                                        down a wide variety to a user’s current preference.
                                    </p>
                                </RichText>
                                <MediaPlaceholder
                                    className="aspect-[804/1088] h-full max-h-[280px] shrink-0 rounded-[8px]"
                                    label="Filter tags mockup"
                                />
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Filtering for Tags" tone="sand">
                            <div className="flex min-h-0 flex-1 items-center gap-5">
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
                                <MediaPlaceholder
                                    className="h-[310px] w-[162px] shrink-0"
                                    label="Filter actions screenshot"
                                />
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Filtering for Tags" tone="sand">
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

                        <ProcessCard title="Filtering for Tags" tone="sand">
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
                                <MediaPlaceholder
                                    className="h-full w-[153px] shrink-0 rounded-[6px]"
                                    label="Secondary filter button"
                                />
                            </div>
                        </ProcessCard>

                        <ProcessCard title="Filtering for Tags" tone="sand">
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

                        <ProcessCard title="Filtering for Tags" tone="sand">
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

                        <ProcessCard title="Tag System - Final Design" tone="dark">
                            <MediaPlaceholder
                                className="min-h-0 flex-1 w-full"
                                label="Filter system final design video"
                            />
                        </ProcessCard>
                    </ProcessCarousel>
                </section>

                {/* Final thoughts */}
                <section className="flex w-full flex-col gap-5">
                    <SectionLabel>final thoughts</SectionLabel>
                    <p className="m-0 w-full font-gantari text-[13px] leading-5 text-[#606060]">
                        This project was strictly scoped to a 1 week timeline, which meant I had to be
                        deliberate with which parts of the research and design project to spend more
                        time on. I ultimately chose to prioritize user research and solution formation
                        through conducting a few short but impactful surveys and interviews. Given a
                        longer timeline, I would have added in additional formal user testing during
                        the design process to validate whether actions felt fluid and necessary rather
                        than relying heavily on previous research, heuristic evaluation, and comparison
                        with Spotify’s existing interface.
                    </p>
                    <BodyText>
                        Want to hear more about the process? Feel free to reach out by email at katong
                        [at] uw [dot] edu.
                    </BodyText>
                </section>
                </div>

                {/* right gutter — mirrors left so content stays centered */}
                <div className="hidden md:block" aria-hidden="true" />
            </div>
        </div>
    );
};

export default SpotifyTagsPage;
