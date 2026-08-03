import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";
import { useNavigate } from "react-router";

/**
 * About layout mirrors Figma node 1594:2246 —
 * same chrome as home (PixelTrail); bio left + graph right.
 * Mobile: page scrolls. Desktop: locked to viewport.
 */
const AboutView = () => {
  const navigate = useNavigate();

  return (
    <>
      <PixelTrail />
      <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
        <div className="flex w-full flex-col items-center gap-10 py-20 md:min-h-0 md:flex-1 md:flex-row md:gap-10 md:py-16">
          {/* bio */}
          <div className="flex w-full min-w-0 flex-col items-start justify-center md:min-h-0 md:flex-1 md:overflow-y-auto">
            <div className="flex w-full max-w-[388px] flex-col gap-5">
              <h1 className="m-0 font-gantari text-[clamp(1.5rem,1rem+1.2vw,2rem)] font-normal leading-normal text-black">
                hi, i’m kat!
              </h1>
              <div className="flex flex-col gap-5 font-gantari text-[14px] font-normal leading-[22px] text-[#222]">
                <p className="m-0">
                  I’m currently studying computer science and linguistics at the University of
                  Washington, where I think of new ways to interface with AI and play around with
                  computer systems.
                </p>
                <p className="m-0">
                  Some things I’ve recently been tinkering with include interpreters for programming
                  languages and design for autonomous vehicle safety systems.
                </p>
                <p className="m-0">
                  In my free time, you can find me clambering up mountains in the PNW, reading
                  speculative fiction, and racking up way too many hours on Cyberpunk 2077.
                </p>
              </div>
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

export default AboutView;
