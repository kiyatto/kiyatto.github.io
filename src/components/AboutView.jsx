const AboutView = () => {

  return (
    <div className="min-h-full w-full flex justify-center items-center py-12 overflow-y-auto">
      <div className="flex flex-col w-[300px] gap-[40px] sm:w-[478px]">
        <h1 className="w-md font-diphylleia text-2xl text-[#5C5C5C]">hi, i'm kat!</h1>
        <div className="flex flex-col gap-[1rem]">
          <p className="text-xs/5 font-gantari font-light text-[#606060]">
            I’m currently studying computer science and linguistics at the University of Washington. I love manipulating language in both literary and computational ways, designing creative interfaces with intention, and learning about + building computer systems.
          </p>
          <p className="text-xs/5 font-gantari font-light text-[#606060]">
            My interests span a huge range of topics, from visual design to systems-level programming to autonomous systems. I'm passionate about building software and designing products that run efficiently, look beautiful, and create positive impact.
          </p>
          <p className="text-xs/5 font-gantari font-light text-[#606060]">
            In my practically non-existent free time, I like to read contemporary and speculative fiction, cook while barely avoiding setting the kitchen on fire, and rack up way too many hours on Cyberpunk 2077. Check out the <a href="/reading-list">library (WIP)</a> for my recent favorite reads!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
