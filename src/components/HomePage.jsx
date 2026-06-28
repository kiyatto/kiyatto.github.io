import Graph from "./Graph.jsx";
import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-full w-full flex justify-center items-center">

            {/* mobile */}
            <div className="flex flex-col md:hidden"
                style={{
                    width: '82vw',
                    maxWidth: '310px',
                    aspectRatio: '310 / 760',
                    fontSize: 'clamp(0.85rem, 0.6rem + 1.2vw, 1rem)',
                }}>
                <div className="w-full">
                    <h1 className="font-diphylleia text-[#222222] text-[1.625rem]">katreeya ong</h1>
                    <p className="font-gantari text-[#222222] text-[0.75em]">/ kat / キャット / แคทรียา</p>
                </div>
                <div className="w-full">
                    {/* graph */}
                </div>
                <div className="flex flex-col w-full gap-[1.25em] items-end">
                    <p className="text-[0.75em] text-[#5C5C5C] font-light">cs + linguistics / university of washington</p>
                    <div className="flex flex-row w-full gap-[1.5625em] justify-end">
                        <a href="https://www.linkedin.com/in/katreeya-ong" target="_blank" rel="noreferrer"
                            className="font-fragment text-[0.6em] text-[#222222] no-underline">linkedin</a>
                        <a className="font-fragment text-[0.6em] text-[#222222] no-underline">email</a>
                        <a href="https://github.com/kiyatto" target="_blank" rel="noreferrer"
                            className="font-fragment text-[0.6em] text-[#222222] no-underline">github</a>
                    </div>
                </div>
            </div>


            {/* desktop */}
            <div className="hidden md:flex flex justify-center items-center"
                style={{
                    width: '80vw',
                    aspectRatio: '1150 / 560',
                    fontSize: 'clamp(1rem, 0.7rem + 0.6vw, 1.15rem)',
                }}>
                {/* left */}
                <div className="flex w-full h-full justify-center items-center">
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
                            <a className="font-fragment text-[0.6em] text-[#222222] no-underline">email</a>
                            <a href="https://github.com/kiyatto" target="_blank" rel="noreferrer"
                                className="font-fragment text-[0.6em] text-[#222222] no-underline">github</a>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="flex w-full h-full justify-center items-center">
                    <div className="w-full h-full">
                        <Graph onNavigate={navigate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;