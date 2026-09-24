/**
 * About copy — left column only.
 * Graph, PixelTrail, and the two-column chrome live in GraphLayout.
 */
const AboutView = () => {
  return (
    <div className="flex w-full h-full min-w-0 flex-col items-start justify-between md:min-h-0 md:flex-1 md:overflow-hidden">
      <div className="flex w-full flex-1 flex-col items-start justify-center gap-10">
        <h1 className="m-0 w-full font-museum text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] font-normal leading-normal text-black">
          A brief characterization:
        </h1>
        <div className="flex w-full flex-col gap-5 font-stellar font-light leading-6 text-[#222]">
          <p className="m-0">
            I study computer science and linguistics at the University
            of Washington, where I play around with computer systems and sketch out new ways to
            interface with AI. My work falls into the gap between an engineer and a designer--on some days I design layouts and
            visual flows, on others I write lines of code and break programs, and the rest of the time, I bridge the two together.
          </p>
          <p className="m-0">
            <span>Some things I’ve recently been tinkering with include an interpreter for my very
              own programming language and small-scale design systems for a myriad of toy
              applications and websites. I've also been endlessly tweaking this website in the pursuit of perfection, alas to no avail.
            </span>
            <span className="text-sm align-super text-blue-600 hover:underline">1</span>
          </p>
          <p className="m-0">
            <span>
              In my free time, you can find me clambering up mountains in the PNW for the views,
              reading speculative fiction, and racking up way too many hours on Cyberpunk 2077.
            </span>
            <span className="text-sm align-super text-blue-600 hover:underline">2</span>
            <span> Or, I may still be toiling away in the library.</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="m-0 w-full font-stellar text-[12px] font-light leading-[22px] text-[#222]">
          <span className="text-sm align-super text-blue-600 hover:underline">1</span>
          <span> Some notes from a self-proclaimed typography geek. The fonts used on this site are: </span>
          <span className="font-dm-mono font-light">DM Mono by Colophon Foundry</span>
          <span>, </span>
          <span className="font-gantari font-light">Gantari by Lafontype</span>
          <span>, Stellar Sans by Pangram Pangram, </span>
          <span className="font-museum">Museum by Pangram Pangram</span>
          <span>, </span>
          <span className="font-kode font-normal">Kode Mono by Isa Ozler</span>
          <span>, </span>
          <span className="font-doto font-black">Doto by Óliver Lalan</span>
          <span>, and </span>
          <span className="font-reenie-beanie text-[16px] font-normal">
            Reenie Beanie by James Grieshaber.
          </span>
        </p>
        <p className="m-0 w-full font-stellar text-[12px] font-light leading-[22px] text-[#222] pb-4">
          <span className="text-sm align-super text-blue-600 hover:underline">2</span>
          <span> No, I have not yet met Hanako at Embers.</span>
        </p>
      </div>
    </div>
  );
};

export default AboutView;
