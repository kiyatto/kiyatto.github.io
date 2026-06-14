import { useState, useEffect, useRef } from 'react';
import Graph from './Graph.jsx';
import { PronunciationLine } from './HomeMenu.jsx';

const LINKEDIN_URL = 'https://www.linkedin.com/in/katreeya-ong';
const GITHUB_URL = 'https://github.com/kiyatto';

function EmailLink() {
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (!showEmail) return;
    const handler = () => setShowEmail(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showEmail]);

  return (
    <span className="relative">
      <button
        type="button"
        className="bg-transparent border-none p-0 font-inherit text-inherit cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowEmail((prev) => !prev);
        }}
      >
        email
      </button>
      {showEmail && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs whitespace-nowrap bg-white px-3 py-2 rounded">
          katong [at] uw [dot] edu
        </span>
      )}
    </span>
  );
}

function SocialLinks({ className = '' }) {
  return (
    <div className={`flex flex-row flex-wrap gap-[25px] text-sm ${className}`}>
      <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="no-underline text-black">
        linkedin
      </a>
      <EmailLink />
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="no-underline text-black">
        github
      </a>
    </div>
  );
}

function HomeTitleBlock({ titleClassName = 'text-[26px]' }) {
  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <h1 className={`font-semibold text-[#222] ${titleClassName}`}>katreeya ong</h1>
      <PronunciationLine />
    </div>
  );
}

function HomeBio({ className = '' }) {
  return (
    <p className={`text-sm font-light text-black leading-normal ${className}`}>
      avid explorer of rabbit holes, currently studying computer science, linguistics, and informatics @ university of washington
    </p>
  );
}

const HomeView = () => {
  const graphWrapperRef = useRef(null);

  return (
    <div className="min-h-screen bg-[#f3f3f3] max-md:bg-white font-gantari">
      {/* Desktop — side-by-side at lg+ */}
      <div className="hidden lg:flex min-h-screen items-center justify-center px-6 lg:px-[65px] py-10">
        <div className="flex w-full max-w-[1150px] flex-row items-stretch justify-between gap-8 min-h-[560px]">
          <div className="flex flex-1 items-center justify-center w-full min-h-0">
            <div className="flex flex-col gap-[75px] items-start w-full max-w-[400px]">
              <HomeTitleBlock />
              <HomeBio />
              <SocialLinks />
            </div>
          </div>
          <div
            ref={graphWrapperRef}
            className="flex flex-1 items-center justify-center w-full min-h-[560px] max-w-[575px]"
            aria-label="graph outer wrapping"
          >
            <Graph variant="home" boundaryRef={graphWrapperRef} />
          </div>
        </div>
      </div>

      {/* Medium — stacked: title, graph, bio + socials */}
      <div className="hidden md:flex lg:hidden min-h-screen flex-col items-center justify-center px-6 py-10 gap-8">
        <div className="w-full max-w-[480px]">
          <HomeTitleBlock />
        </div>
        <div className="w-full max-w-[480px] flex justify-center">
          <Graph variant="home-mobile" />
        </div>
        <div className="w-full max-w-[480px] flex flex-col gap-[50px] items-start">
          <HomeBio />
          <SocialLinks />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-[#f3f3f3] flex min-h-screen flex-col items-center justify-between px-[42px] py-[46px] gap-8">
        <div className="w-full max-w-[310px]">
          <HomeTitleBlock titleClassName="text-lg" />
        </div>

        <div className="w-full max-w-[310px] flex justify-center">
          <Graph variant="home-mobile" />
        </div>

        <div className="w-full max-w-[310px] flex flex-col gap-[50px] items-end text-sm text-black">
          <div className="text-right font-light leading-normal">
            <p>avid explorer of rabbit holes</p>
            <p>currently studying computer science, linguistics, and informatics @ university of washington</p>
          </div>
          <SocialLinks className="justify-end" />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
