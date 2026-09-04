export type Shape =
  | "explosion"
  | "plasma"
  | "starfield"
  | "galaxy"
  | "solarSystem"
  | "planet"
  | "ocean"
  | "cambrian"
  | "land"
  | "dinosaur"
  | "impact"
  | "mammal"
  | "human"
  | "civilization"
  | "now";

export type Era = {
  id: string;
  title: string;
  yearsAgo: string;
  yearsAgoNumeric: number; // precise value used for proportion math
  cosmicDate: string;
  description: string;
  shape: Shape;
  colors: string[];
};

const TOTAL_AGE_YEARS = 13_800_000_000;
export { TOTAL_AGE_YEARS };

// Sagan's "Cosmic Calendar" compresses the universe's ~13.8 billion
// year history into a single year for scale — Jan 1 00:00:00 = Big
// Bang, Dec 31 23:59:59 = right now. Dates below are the commonly
// cited approximations from that framework; like all Cosmic Calendar
// dates, the further back an event is, the fuzzier its exact
// placement really is.
export const TIMELINE: Era[] = [
  {
    id: "big-bang",
    title: "The Big Bang",
    yearsAgo: "13.8 billion years ago",
    yearsAgoNumeric: 13800000000,
    cosmicDate: "Jan 1, 12:00:00 AM",
    description:
      "Everything — all matter, energy, space, and time — begins expanding from a single point. Not an explosion into space; space itself starts expanding.",
    shape: "explosion",
    colors: ["#FFFFFF", "#CFE8FF", "#8AB4FF"],
  },
  {
    id: "first-atoms",
    title: "First Atoms Form",
    yearsAgo: "13.8 billion years ago (380,000 years after the Bang)",
    yearsAgoNumeric: 13799620000,
    cosmicDate: "Jan 1, ~12:14 AM",
    description:
      "The universe cools enough for electrons to bind to nuclei, forming the first hydrogen and helium atoms. Light can finally travel freely — this afterglow is still detectable today as the Cosmic Microwave Background.",
    shape: "plasma",
    colors: ["#FFD9A0", "#FF9E5E", "#FFFFFF"],
  },
  {
    id: "first-stars",
    title: "First Stars Ignite",
    yearsAgo: "~13.6 billion years ago",
    yearsAgoNumeric: 13600000000,
    cosmicDate: "Mid-January",
    description:
      "After a long, dark stretch with no light sources at all, gravity pulls hydrogen into dense enough clumps to ignite nuclear fusion. The universe's first stars switch on.",
    shape: "starfield",
    colors: ["#CFE8FF", "#FFFFFF", "#A8C8FF"],
  },
  {
    id: "first-galaxies",
    title: "First Galaxies Form",
    yearsAgo: "~13.2 billion years ago",
    yearsAgoNumeric: 13200000000,
    cosmicDate: "March",
    description:
      "Stars, gas, and dark matter clump together under gravity into the first galaxies — the beginning of the large-scale structure that fills the universe today.",
    shape: "galaxy",
    colors: ["#B5A8FF", "#FFFFFF", "#7C6FE0"],
  },
  {
    id: "milky-way",
    title: "The Milky Way Begins",
    yearsAgo: "~13.6 billion years ago",
    yearsAgoNumeric: 13600000000,
    cosmicDate: "May",
    description:
      "Our own galaxy starts taking shape — a slow, ongoing assembly of stars, gas, and dust into the spiral disk that, billions of years later, would host our solar system.",
    shape: "galaxy",
    colors: ["#F0D9A0", "#FFFFFF", "#B5A8FF"],
  },
  {
    id: "solar-system",
    title: "The Sun & Solar System Form",
    yearsAgo: "4.6 billion years ago",
    yearsAgoNumeric: 4600000000,
    cosmicDate: "Sept 2",
    description:
      "A cloud of gas and dust collapses under its own gravity. Most of it becomes the Sun; the leftover disk of debris starts clumping into planets.",
    shape: "solarSystem",
    colors: ["#FFD27F", "#FFFFFF", "#8AB4FF"],
  },
  {
    id: "earth-forms",
    title: "Earth Forms",
    yearsAgo: "4.54 billion years ago",
    yearsAgoNumeric: 4540000000,
    cosmicDate: "Sept 6",
    description:
      "Rocky debris in the young solar system collides and merges. Earth forms molten and hostile — no atmosphere worth breathing, no oceans yet, no life.",
    shape: "planet",
    colors: ["#FF6B4A", "#3A2010", "#FFB380"],
  },
  {
    id: "first-life",
    title: "First Life on Earth",
    yearsAgo: "~3.8–4.1 billion years ago",
    yearsAgoNumeric: 3900000000,
    cosmicDate: "Sept 21",
    description:
      "The earliest single-celled microbes appear — astonishingly, quite soon after Earth cools enough to be survivable at all. Life, whatever it took to start, wasn't slow to show up.",
    shape: "ocean",
    colors: ["#4FE0C0", "#0A2E3A", "#8AFFDC"],
  },
  {
    id: "multicellular",
    title: "Complex, Multicellular Life",
    yearsAgo: "~1.5–2.1 billion years ago",
    yearsAgoNumeric: 1800000000,
    cosmicDate: "~Dec 5",
    description:
      "For billions of years, life stayed single-celled. Then cells began cooperating — specializing, sticking together, forming the first genuinely multicellular organisms.",
    shape: "ocean",
    colors: ["#7FE08A", "#0A2E3A", "#C8FFAA"],
  },
  {
    id: "cambrian",
    title: "The Cambrian Explosion",
    yearsAgo: "541 million years ago",
    yearsAgoNumeric: 541000000,
    cosmicDate: "Dec 17",
    description:
      "In a geological blink, most major animal body plans appear in the fossil record — eyes, shells, legs, spines. The ocean goes from mostly simple life to genuinely strange and diverse.",
    shape: "cambrian",
    colors: ["#FF9E5E", "#4FE0C0", "#B5A8FF"],
  },
  {
    id: "land",
    title: "Life Moves Onto Land",
    yearsAgo: "~470 million years ago",
    yearsAgoNumeric: 470000000,
    cosmicDate: "Dec 20",
    description:
      "Plants colonize land first, followed by early arthropods and eventually vertebrates. Earth's surface starts turning green.",
    shape: "land",
    colors: ["#7FE08A", "#3A6B2E", "#C8FFAA"],
  },
  {
    id: "dinosaurs",
    title: "Dinosaurs Rule the Earth",
    yearsAgo: "~230 million years ago",
    yearsAgoNumeric: 230000000,
    cosmicDate: "Dec 25",
    description:
      "Dinosaurs emerge and go on to dominate land ecosystems for roughly 165 million years — more than a thousand times longer than humans have existed so far.",
    shape: "dinosaur",
    colors: ["#B5854A", "#3A6B2E", "#FFD27F"],
  },
  {
    id: "extinction",
    title: "The Asteroid Hits",
    yearsAgo: "66 million years ago",
    yearsAgoNumeric: 66000000,
    cosmicDate: "Dec 30",
    description:
      "A roughly 10-kilometer asteroid strikes what's now Mexico. The impact and its aftermath wipe out the non-avian dinosaurs and about three-quarters of all species — clearing the way for mammals.",
    shape: "impact",
    colors: ["#FF6B4A", "#FFFFFF", "#3A2010"],
  },
  {
    id: "mammals",
    title: "Mammals Diversify",
    yearsAgo: "66 million years ago onward",
    yearsAgoNumeric: 60000000,
    cosmicDate: "Dec 30, evening",
    description:
      "With the dinosaurs gone, mammals — until then mostly small and nocturnal — rapidly diversify into the ecological space left behind.",
    shape: "mammal",
    colors: ["#C8A87F", "#7FE08A", "#FFD27F"],
  },
  {
    id: "humans",
    title: "The First Humans",
    yearsAgo: "~2.8 million years ago",
    yearsAgoNumeric: 2800000,
    cosmicDate: "Dec 31, ~10:30 PM",
    description:
      "The genus Homo appears in Africa. We're not talking modern humans yet — but the lineage that leads to us has begun.",
    shape: "human",
    colors: ["#FFD9A0", "#FF9E5E", "#FFFFFF"],
  },
  {
    id: "homo-sapiens",
    title: "Homo Sapiens",
    yearsAgo: "~300,000 years ago",
    yearsAgoNumeric: 300000,
    cosmicDate: "Dec 31, ~11:52 PM",
    description:
      "Anatomically modern humans appear. Everyone who has ever lived as a fully modern human fits inside the last eight minutes of the entire cosmic year.",
    shape: "human",
    colors: ["#FFFFFF", "#FFD9A0", "#8AB4FF"],
  },
  {
    id: "civilization",
    title: "Agriculture & Civilization",
    yearsAgo: "~12,000 years ago",
    yearsAgoNumeric: 12000,
    cosmicDate: "Dec 31, 11:59:20 PM",
    description:
      "Farming begins. Permanent settlements follow, then writing, cities, and everything we'd recognize as civilization — all within the final 40 seconds of the cosmic year.",
    shape: "civilization",
    colors: ["#F0D9A0", "#7FE08A", "#FFFFFF"],
  },
  {
    id: "now",
    title: "Right Now",
    yearsAgo: "today",
    yearsAgoNumeric: 0,
    cosmicDate: "Dec 31, 11:59:59 PM",
    description:
      "Every war, empire, invention, and person you've ever heard of happened in the final second of the cosmic year. You are reading this in the very last sliver of that second.",
    shape: "now",
    colors: ["#8AB4FF", "#FFFFFF", "#4FE0C0"],
  },
];
