import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";
import { useNavigate } from "react-router";

/**
 * Home layout mirrors Figma node 1497:2502 —
 * top time / bottom cursor chrome come from PixelTrail;
 * this fills the middle: tagline (flex) + graph (400px).
 * Mobile: page scrolls. Desktop: locked to viewport.
 */
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <PixelTrail />
            <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
                <div className="flex w-full flex-col items-center gap-10 py-14 md:min-h-0 md:flex-1 md:flex-row md:gap-10 md:py-0">
                    {/* tagline */}
                    <div className="flex w-full min-w-0 flex-col items-start justify-center md:min-h-0 md:flex-1 md:overflow-hidden">
                        <div className="w-full max-w-[680px]">
                            <p className="m-0 w-full font-gantari text-[clamp(1.25rem,0.85rem+1.4vw,2rem)] font-medium leading-normal text-black">
                                <span>kat is a design engineer telling stories through </span>
                                <span className="font-fragment font-normal">code</span>
                                <span>, </span>
                                <span className="font-diphylleia font-normal">visual craft</span>
                                <span>, and </span>
                                <span className="font-reenie-beanie text-[clamp(1.5rem,1rem+1.8vw,2.5rem)] font-normal">
                                    language
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* graph */}
                    <div className="flex h-[min(360px,45vh)] w-full shrink-0 items-center justify-center md:h-full md:w-[min(400px,38vw)]">
                        <div className="h-full w-full max-h-[342px]">
                            <Graph onNavigate={navigate} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
