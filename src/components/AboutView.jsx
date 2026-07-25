import PixelTrail from "./PixelTrail.jsx";

const AboutView = () => {
  return (
    <>
      <PixelTrail />
      <div className="relative z-[1] flex min-h-full w-full items-center justify-center overflow-y-auto py-12">
        <div className="flex w-[300px] flex-col gap-[40px] sm:w-[478px]">
          <h1 className="w-md font-diphylleia text-2xl text-[#5C5C5C]">hi, i'm kat!</h1>
          <div className="flex flex-col gap-[1rem]">
            <p className="font-gantari text-[13px] font-light text-[#222222]">
              I’m a design engineer who loves designing creative interfaces with intention, building
              scalable software, and manipulating language in literary and computational ways.
            </p>
            <p className="font-gantari text-[13px] font-light text-[#222222]">
              In my practically non-existent free time, I like to read contemporary and speculative
              fiction, cook while barely avoiding setting the kitchen on fire, and rack up way too
              many hours on Cyberpunk 2077. Check out the{" "}
              <a href="katreeya.me/reading-list">library (WIP)</a> for my recent favorite reads!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutView;
