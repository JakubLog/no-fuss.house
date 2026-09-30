/**
 * Trasa Drużyny Pierścienia na mapie pod hero 404 (`FellowshipMap`).
 *
 * Daty z Kroniki Lat („Władca Pierścieni”, Dodatek B), kalendarz Shire'u: miesiące po 30 dni,
 * między 30.12 a 1.01 dwa dni Jul. `day` liczy dni od wymarszu (23.09.3018 = 0), `until` to dzień
 * wyjścia z miejsca postoju. Nazwy wg przekładu Marii Skibniewskiej. `x` / `y` w milach od Hobbitonu
 * (x na wschód, y na południe), odczytane z ogólnej mapy Śródziemia z dokładnością do kilkunastu mil;
 * rzutowanie na `viewBox` robi `FellowshipMap/route.ts`.
 */
export interface FellowshipStop {
  id: string;
  name: string;
  /** Data do wyświetlenia, np. „20.10 – 25.12.3018”. */
  date: string;
  day: number;
  /** Dzień wyjścia, jeśli Drużyna została tu dłużej niż dzień. */
  until?: number;
  x: number;
  y: number;
  /** Co się działo. */
  what: string;
  /** Jak to wygląda u nas. */
  nofuss: string;
}

/** Punkt trasy bez przystanku (zakręt drogi). */
export interface FellowshipVia {
  x: number;
  y: number;
}

export type FellowshipPoint = { stop: FellowshipStop } | { via: FellowshipVia };

export const FELLOWSHIP_STOPS = [
  {
    id: "hobbiton",
    name: "Hobbiton",
    date: "23.09.3018",
    day: 0,
    x: 0,
    y: 0,
    what: "Frodo wychodzi z Worka Endu z Pierścieniem w kieszeni. Plan sięga na razie do Bree.",
    nofuss: "Plan sięga do końca. I mieści się na jednej stronie.",
  },
  {
    id: "bree",
    name: "Bree",
    date: "29.09.3018",
    day: 6,
    x: 125,
    y: 5,
    what: "Gandalf miał tu czekać i go nie ma. Jest za to nieznajomy w kącie gospody.",
    nofuss: "Umówione spotkanie się odbywa. Z agendą.",
  },
  {
    id: "wichrowy-czub",
    name: "Wichrowy Czub",
    date: "06.10.3018",
    day: 13,
    x: 215,
    y: -10,
    what: "Nocny atak Czarnych Jeźdźców. Frodo ranny morgulowym ostrzem.",
    nofuss: "Ryzyka wypisujemy na starcie, a nie odkrywamy nocą na szczycie.",
  },
  {
    id: "rivendell",
    name: "Rivendell",
    date: "20.10 – 25.12.3018",
    day: 27,
    until: 92,
    x: 390,
    y: -5,
    what: "Rada u Elronda. Od przybycia do wymarszu mijają dwa miesiące.",
    nofuss: "Decyzja zapada na spotkaniu, na którym o niej rozmawiamy.",
  },
  {
    id: "caradhras",
    name: "Caradhras",
    date: "11–12.01.3019",
    day: 110,
    until: 111,
    x: 382,
    y: 245,
    what: "Przełęcz pod Czerwonym Rogiem zasypana śniegiem. Drużyna zawraca.",
    nofuss: "Drogę sprawdzamy, zanim w nią wejdziemy.",
  },
  {
    id: "moria",
    name: "Moria",
    date: "13–15.01.3019",
    day: 112,
    until: 114,
    x: 398,
    y: 280,
    what: "Skrót przez kopalnie krasnoludów. Balrog, most, Gandalf spada w ciemność.",
    nofuss: "Skrót jest skrótem, kiedy ktoś już nim przeszedł.",
  },
  {
    id: "lorien",
    name: "Lothlórien",
    date: "17.01 – 16.02.3019",
    day: 116,
    until: 145,
    x: 460,
    y: 305,
    what: "Miesiąc odpoczynku u Galadrieli. Na mapie nic się nie rusza.",
    nofuss: "Odpoczynek planujemy po wdrożeniu, nie w połowie drogi.",
  },
  {
    id: "amon-hen",
    name: "Amon Hen",
    date: "26.02.3019",
    day: 155,
    x: 578,
    y: 530,
    what: "Boromir sięga po Pierścień, Drużyna się rozpada. Frodo i Sam idą dalej sami.",
    nofuss: "Skład się nie zmienia w połowie projektu. Te same dwie osoby od początku do końca.",
  },
  {
    id: "martwe-bagna",
    name: "Martwe Bagna",
    date: "01–02.03.3019",
    day: 160,
    until: 161,
    x: 670,
    y: 525,
    what: "Od 29.02 prowadzi ich Gollum. Przez bagna, bo podobno zna drogę.",
    nofuss: "Nawigacji nie oddajemy nikomu, kto ma własny interes w wyniku.",
  },
  {
    id: "morannon",
    name: "Morannon",
    date: "05.03.3019",
    day: 164,
    x: 718,
    y: 555,
    what: "Czarna Brama zamknięta i pilnowana. Trzeba szukać innego wejścia.",
    nofuss: "Wejście sprawdzamy na etapie discovery, nie pod bramą.",
  },
  {
    id: "henneth-annun",
    name: "Henneth Annûn",
    date: "07–08.03.3019",
    day: 166,
    until: 167,
    x: 690,
    y: 612,
    what: "Faramir zatrzymuje ich w kryjówce za wodospadem.",
    nofuss: "Punkty kontrolne mają terminy, nie wodospady.",
  },
  {
    id: "cirith-ungol",
    name: "Cirith Ungol",
    date: "12–14.03.3019",
    day: 171,
    until: 173,
    x: 726,
    y: 676,
    what: "Szeloba, orkowie, wieża. Sam odbija Froda z niewoli.",
    nofuss: "Nikt nie zostaje sam z problemem. Od tego jest druga osoba w zespole.",
  },
  {
    id: "gora-przeznaczenia",
    name: "Góra Przeznaczenia",
    date: "25.03.3019",
    day: 184,
    x: 820,
    y: 650,
    what: "Pierścień wpada w ogień. Po 184 dniach drogi.",
    nofuss: "Wdrożenie. Bez zamieszania.",
  },
] as const satisfies readonly FellowshipStop[];

const stop = (id: (typeof FELLOWSHIP_STOPS)[number]["id"]): FellowshipPoint => ({
  stop: FELLOWSHIP_STOPS.find((s) => s.id === id) as FellowshipStop,
});
const via = (x: number, y: number): FellowshipPoint => ({ via: { x, y } });

/** Cała trasa w kolejności: przystanki i zakręty drogi między nimi. */
export const FELLOWSHIP_ROUTE: readonly FellowshipPoint[] = [
  stop("hobbiton"),
  via(45, 8), // Most na Brandywinie
  stop("bree"),
  via(170, 0),
  stop("wichrowy-czub"),
  via(310, -10), // Ostatni Most
  via(370, -2), // Bród na Bruinen
  stop("rivendell"),
  via(372, 70),
  via(358, 160),
  via(348, 228), // Hollin
  stop("caradhras"),
  via(356, 266), // Zachodnia Brama Morii
  stop("moria"),
  stop("lorien"),
  via(492, 326), // łodziami w dół Anduiny
  via(526, 386),
  via(558, 446),
  via(574, 500), // Argonath
  stop("amon-hen"),
  via(618, 518), // Emyn Muil, od 29.02 z Gollumem
  via(646, 532),
  stop("martwe-bagna"),
  via(705, 545),
  stop("morannon"),
  via(702, 580), // Ithilien
  stop("henneth-annun"),
  via(700, 690), // Rozstaje
  stop("cirith-ungol"),
  via(752, 688), // Morgai
  via(792, 668),
  stop("gora-przeznaczenia"),
];

/** Etykiety krain (mile jak wyżej). `wide`: widoczna dopiero od 768 px. */
export const FELLOWSHIP_REGIONS = [
  { name: "Shire", x: -40, y: -38, wide: false },
  { name: "Eriador", x: 190, y: 180, wide: true },
  { name: "Wielkie Morze", x: -110, y: 600, wide: true },
  { name: "Góry Mgliste", x: 468, y: 120, wide: true },
  { name: "Mroczna Puszcza", x: 690, y: 110, wide: true },
  { name: "Rohan", x: 480, y: 575, wide: true },
  { name: "Gondor", x: 520, y: 735, wide: true },
  { name: "Mordor", x: 960, y: 690, wide: false },
] as const;
