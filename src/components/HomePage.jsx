import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";
import { useNavigate } from "react-router";

import me_img from "../assets/me.png";

/**
 * Home layout mirrors Figma node 1733:2285 —
 * nameplate comes from Header; top time / bottom cursor chrome from PixelTrail;
 * this fills the middle: greeting + tagline (flex) + graph (400px).
 * Mobile: page scrolls. Desktop: locked to viewport.
 */
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <PixelTrail />
            <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
                <div className="flex w-full flex-col items-center gap-10 py-20 md:min-h-0 md:flex-1 md:flex-row md:gap-10 md:py-0">
                    {/* greeting + tagline */}
                    <div className="flex w-full min-w-0 flex-col items-start justify-center px-0 md:min-h-0 md:flex-1 md:overflow-hidden">
                        <div className="flex w-full max-w-[720px] gap-8 flex-col">
                            <div className="flex w-full flex-col items-start text-black">
                                <p className="m-0 w-full font-museum text-[clamp(1.75rem,1.1rem+2.2vw,2.5rem)] font-normal leading-normal">
                                    <span>Hey! I'm Kat. </span>
                                    <span><img src={me_img} className="h-[1.1em] w-auto inline align-top"></img></span>
                                    <span> Welcome to my tiny corner of the internet.</span>
                                </p>
                                    {/* <p className="m-0 w-full font-museum text-[clamp(1.25rem,0.95rem+1.1vw,1.625rem)] font-normal leading-normal">
                                        welcome to my tiny corner of the internet.
                                    </p> */}
                            </div>
                            <div className="flex w-full flex-col items-start gap-4">
                                <p className="m-0 w-full font-stellar text-base font-light leading-normal">
                                    <span>I’m a design engineer who loves to tell stories through </span>
                                    <span className="font-kode text-[14px] font-bold">code</span>
                                    <span>,</span>
                                    <span className="font-doto text-base font-black">
                                        {" "}creative identity
                                    </span>
                                    <span>, and</span>
                                    <span className="font-reenie-beanie text-[22px] font-normal">
                                        {" "}language
                                    </span>
                                    <span>.</span>
                                    
                                </p>
                                <p className="m-0 w-full hidden md:block font-stellar text-base font-light leading-normal">
                                Currently taking shelter under a large pile of musty books in the library as I work my way through college. 
                                Occasional sightings and appearances may feature burnt pancakes, unimagineably cluttered Figma files, and way too many cups of cold brew.
                                Approach at your own risk.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* graph — desktop nav; mobile uses Header */}
                    <div className="hidden h-full min-h-[280px] w-[min(400px,38vw)] max-h-[342px] shrink-0 items-center justify-center md:flex">
                        <Graph onNavigate={navigate} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
