const AboutView = () => {

  return (
    <div className="min-h-full w-full flex justify-center items-center py-12 overflow-y-auto">
      <div className="flex flex-col w-[300px] gap-[40px] sm:w-[478px]">
        <h1 className="w-md font-diphylleia text-2xl text-[#5C5C5C]">hi, i'm kat!</h1>
        <div className="flex flex-col gap-[1rem]">
          <p className="text-xs/5 font-gantari font-light text-[#606060]">
          I’m a design engineer who loves designing creative interfaces with intention, building scalable software, and manipulating language in literary and computational ways.
          </p>
          <p className="text-xs/5 font-gantari font-light text-[#606060]">
            In my practically non-existent free time, I like to read contemporary and speculative fiction, cook while barely avoiding setting the kitchen on fire, and rack up way too many hours on Cyberpunk 2077. Check out the <a href="katreeya.me/reading-list">library (WIP)</a> for my recent favorite reads!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
