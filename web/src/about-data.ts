import { LINKS } from "./data";

// Everything on the About page lives here.
// Photos: drop them in web/public/about/ and web/public/people/ with the file names below.
// Until a photo exists, its card shows a soft placeholder instead.

export const OVERVIEW = [
  "I'm a full-time student at NYIT in Manhattan, majoring in computer science with a minor in AI.",
  "The work I love most is backend and full-stack: APIs, databases, search, the parts that make an app actually work. This summer I was a software engineering intern at Liberty Mutual, building RAG chat and search over competitors' filings. Before that I built civic tech for NYC's participatory budget, did quantum computing research with The Coding School, and taught Python for Stanford's Code in Place. This winter I'm joining Datadog as a software engineering intern.",
  "I'm also president of NSBE at NYIT. Outside of tech, I'm really into fashion, and the rest of what I love is below.",
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
