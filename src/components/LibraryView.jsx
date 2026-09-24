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
  "Lost Lambs - Madeline Cash",
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
    <h2 className="m-0 font-museum font-museum text-2xl leading-normal text-black">
      {title}
    </h2>
    <ul className="m-0 flex list-none flex-col gap-2 p-0 font-stellar text-sm font-normal leading-normal text-black">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);

/**
 * Library lists — left column only.
 * Graph, PixelTrail, and the two-column chrome live in GraphLayout.
 */
const LibraryView = () => {
  return (
    <div className="flex w-full min-w-0 justify-center md:min-h-0 md:flex-1 md:self-stretch md:overflow-hidden md:justify-start md:pt-16">
      <div className="flex w-full min-w-0 flex-col gap-10 py-10 text-black md:min-h-0 md:h-full md:overflow-hidden">
        <div className="flex w-full flex-col gap-10 md:min-h-0 md:flex-1 md:overflow-x-clip md:overflow-y-auto">
          <ListSection
            title="a non-comprehensive list of books i’ve enjoyed"
            items={BOOKS}
          />
          <ListSection
            title="good films from someone who rarely watches movies"
            items={FILMS}
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
