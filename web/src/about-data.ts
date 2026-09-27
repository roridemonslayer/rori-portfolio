import { LINKS } from "./data";

// Everything on the About page lives here.
// Photos: drop them in web/public/about/ and web/public/people/ with the file names below.
// Until a photo exists, its card shows a soft placeholder instead.

export const OVERVIEW = [
  "I'm a full-time student at NYIT in Manhattan, majoring in computer science with a minor in AI. I graduate in May 2028.",
  "The work I love most is backend and full-stack: APIs, databases, search, the parts that make an app actually work. Lately that's meant RAG, vector search and agents.",
  "I care about building things people actually use. That's been true at every internship so far, and it's why I'm headed to Datadog this winter.",
  "Outside of tech, I'm really into fashion, and a lot of other things too. They're further down the page.",
];

// short, plain versions of each role for the About page (the main page has the full bullets)
export const DONE: { when: string; role: string; company: string; logo: string; line: string }[] = [
  { when: "winter 2027", role: "Software Engineering Intern", company: "Datadog", logo: "datadog.svg", line: "Incoming. Joining the observability platform engineering teams use to monitor their infrastructure and apps." },
  { when: "may — jul 2026", role: "Software Engineering Intern", company: "Liberty Mutual", logo: "libertymutual.png", line: "Built RAG chat and hybrid search over competitors' filings. Research that took about 15 minutes now takes under 10 seconds." },
  { when: "jan — may 2026", role: "Software Engineer", company: "NYC Civic Engagement", logo: "nyc.gov.png", line: "Built map, timeline and chart views in React + TypeScript so residents could explore 3,900 proposals from NYC's $5M participatory budget." },
  { when: "jun — aug 2025", role: "Quantum Computing Researcher", company: "The Coding School", logo: "thecodingschool.png", line: "Used Qiskit to search for minimum-energy protein folds." },
  { when: "apr — may 2025", role: "Section Leader", company: "Stanford Code in Place", logo: "stanford.edu.png", line: "Taught a weekly Python section to 20 students. 95% of them finished the course." },
];

export const BEYOND = [
  { title: "President, NSBE @ NYIT", line: "I lead my school's chapter of the National Society of Black Engineers." },
  { title: "Fellowships & programs", line: "Microsoft ECLSP, America On Tech, Break Through Tech, ColorStack and Code2040." },
];

export const FITS = ["fit1.jpg", "fit2.jpg", "fit3.jpg"]; // in web/public/assets/

export type Interest = { key: string; title: string; caption: string; photo: string; photoNight?: string; focus?: string; credit?: { text: string; href: string }; link?: { href: string; text: string } };
export const INTERESTS: Interest[] = [
  { key: "marvel", title: "Marvel", caption: "I'm really into Marvel. My favorite character is Wanda.", photo: "/about/marvel.jpg" },
  { key: "ghibli", title: "Studio Ghibli", caption: "Ghibli movies are my comfort watch. They're the reason this site looks like this.", photo: "/about/ghibli-day.gif", photoNight: "/about/ghibli-night.gif", focus: "50% 80%" },
  { key: "cards", title: "Card collecting", caption: "I collect cards in my free time.", photo: "/about/cards.jpg" },
  { key: "travel", title: "Travel", caption: "I really love to travel.", photo: "/about/travel.jpg" },
  { key: "music", title: "Music", caption: "I love music. This one's my \"Book writing.\" playlist.", photo: "/about/music.jpg", link: { href: LINKS.spotify, text: "my spotify →" } },
  { key: "books", title: "Books", caption: "My favorite book of all time is Call Me by Your Name.", photo: "/about/books.jpg" },
];

export type Person = { key: string; name: string; who: string; photo: string };
export const PEOPLE: Person[] = [
  { key: "dahi", name: "Dahi", who: "my girlfriend", photo: "/people/dahi.jpg" },
  { key: "best-friend", name: "", who: "my best friend", photo: "/people/best-friend.jpg" },
  { key: "friend-1", name: "", who: "friend", photo: "/people/friend-1.jpg" },
  { key: "friend-2", name: "", who: "friend", photo: "/people/friend-2.jpg" },
  { key: "friend-3", name: "", who: "friend", photo: "/people/friend-3.jpg" },
];
