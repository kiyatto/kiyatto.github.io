import Graph from "./Graph.jsx";
import PixelTrail from "./PixelTrail.jsx";
import { useNavigate } from "react-router";

const BOOKS = [
  "Martyr! - Kaveh Akbar",
  "Flux - Jinwoo Chang",
  "Intermezzo - Sally Rooney",
  "Land of Milk and Honey - C. Pam Zhang",
  "Sea of Tranquility - Emily St. John Mandel",
  "The Secret History - Donna Tartt",
  "Normal People - Sally Rooney",
  "Cloud Cuckoo Land - Anthony Doerr",
  "Tomorrow and Tomorrow and Tomorrow - Gabrielle Zevin",
  "Atonement - Ian McEwan",
  "The Age of Innocence - Edith Wharton",
];

const FILMS = [
  "Pulp Fiction",
  "La La Land",
  "Inception",
  "Interstellar",
  "Challengers",
  "Atonement",
  "Pride and Prejudice (2005)",
  "Blade Runner 2049",
  "Arrival",
  "Aftersun",
  "Dune Pt. Two",
];

const ListSection = ({ title, items }) => (
  <section className="flex shrink-0 flex-col gap-5">
    <h2 className="m-0 font-fragment text-[18px] font-normal leading-normal text-black">
      {title}
    </h2>
    <ul className="m-0 flex list-none flex-col gap-[13px] p-0 font-gantari text-[14px] font-normal leading-normal text-black">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);

/**
 * Library layout mirrors Figma node 1611:2999 —
 * books + films lists on the left, graph on the right.
 */
const LibraryView = () => {
  const navigate = useNavigate();

  return (
    <>
      <PixelTrail />
      <div className="relative z-[1] flex min-h-full w-full flex-col items-center justify-center gap-2.5 px-10 md:h-full md:overflow-hidden">
        <div className="flex w-full flex-col gap-10 py-20 md:min-h-0 md:flex-1 md:flex-row md:items-stretch md:gap-[clamp(2.5rem,6vw,5rem)]">
          {/* lists — page scrolls on mobile; column scrolls on desktop */}
          <div className="flex w-full min-w-0 flex-col justify-between gap-10 text-black md:min-h-0 md:flex-1 md:overflow-x-clip md:overflow-y-auto">
            <ListSection
              title="a non-comprehensive list of books i’ve enjoyed"
              items={BOOKS}
            />
            <ListSection
              title="good films from someone who rarely watches movies"
              items={FILMS}
            />
          </div>

          {/* graph */}
          <div className="hidden h-full w-[min(400px,38vw)] shrink-0 items-center justify-center md:flex">
            <div className="h-full w-full max-h-[342px]">
              <Graph onNavigate={navigate} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryView;
