import { useEffect, useRef, useState } from "react";
import Graph from "./Graph.jsx";
import { useNavigate } from "react-router";

const EMAIL = "hello@example.com";

const EmailLink = ({ className }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`${className} cursor-pointer border-none bg-transparent p-0`}
            >
                email
            </button>
            {open && (
                <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#E9E9E9] bg-white px-3 py-2 shadow-md">
                    <a
                        href={`mailto:${EMAIL}`}
                        className="font-fragment text-[0.6em] text-[#222222] no-underline"
                    >
                        {EMAIL}
                    </a>
                </div>
            )}
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full overflow-hidden md:overflow-visible flex justify-center md:items-center">

            {/* mobile — fills viewport content area, no page scroll */}
            <div
                className="flex h-full min-h-0 flex-col md:hidden"
                style={{
                    width: '82vw',
                    maxWidth: '310px',
                    fontSize: 'clamp(0.85rem, 0.6rem + 1.2vw, 1rem)',
                }}
            >
                <div className="w-full shrink-0">
                    <h1 className="font-diphylleia text-[#222222] text-[1.625rem]">katreeya ong</h1>
                    <p className="font-gantari text-[#222222] text-[0.75em]">/ kat / キャット / แคทรียา</p>
                </div>
                <div className="w-full min-h-0 flex-1">
                    <Graph onNavigate={navigate} />
                </div>
                <div className="flex shrink-0 flex-col w-full gap-[1.25em] items-end">
                    <p className="text-[0.75em] text-[#5C5C5C] font-light">cs + linguistics / university of washington</p>
                    <div className="flex flex-row w-full gap-[1.5625em] justify-end">
                        <a href="https://www.linkedin.com/in/katreeya-ong" target="_blank" rel="noreferrer"
                            className="font-fragment text-[0.6em] text-[#222222] no-underline">linkedin</a>
                        <EmailLink className="font-fragment text-[0.6em] text-[#222222] no-underline" />
                        <a href="https://github.com/kiyatto" target="_blank" rel="noreferrer"
                            className="font-fragment text-[0.6em] text-[#222222] no-underline">github</a>
                    </div>
                </div>
            </div>


            {/* desktop */}
            <div className="hidden md:flex justify-center items-center mx-auto"
                style={{
                    width: '80vw',
                    maxWidth: '1150px',
                    height: 'min(560px, 70vh)',
                    fontSize: 'clamp(1rem, 0.7rem + 0.6vw, 1.15rem)',
                }}>
                {/* left */}
                <div className="flex w-1/2 min-w-0 h-full justify-center items-center">
                    <div className="flex flex-col gap-[3.5em]">
                        <div>
                            <h1 className="font-diphylleia text-[#222222] text-[1.625em]">katreeya ong</h1>
                            <p>
                                <span className="font-gantari font-light text-[#222222] text-[0.75em]">/ kat /</span>
                                <span className="font-gantari font-light text-[#222222] text-[0.65em]"> キャット /</span>
                                <span className="font-athiti text-[#222222] text-[0.75em]"> แคทรียา</span>
                            </p>
                        </div>
                        <p className="text-[0.75em] text-[#5C5C5C] font-light">cs + linguistics / university of washington</p>
                        <div className="flex flex-row w-full gap-[1.6em]">
                            <a href="https://www.linkedin.com/in/katreeya-ong" target="_blank" rel="noreferrer"
                                className="font-fragment text-[0.6em] text-[#222222] no-underline">linkedin</a>
                            <EmailLink className="font-fragment text-[0.6em] text-[#222222] no-underline" />
                            <a href="https://github.com/kiyatto" target="_blank" rel="noreferrer"
                                className="font-fragment text-[0.6em] text-[#222222] no-underline">github</a>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="flex w-1/2 min-w-0 h-full justify-center items-center">
                    <div className="w-full h-full">
                        <Graph onNavigate={navigate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;