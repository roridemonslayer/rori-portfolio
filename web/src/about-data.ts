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
  { key: "sierra", name: "Sierra", who: "my girlfriend", photo: "/people/sierra.jpg" },
  { key: "mo", name: "Mo", who: "my best friend", photo: "/people/mo.jpg" },
  { key: "jj", name: "JJ", who: "my homeboy", photo: "/people/jj.jpg" },
  { key: "dahi", name: "Dahi", who: "friend", photo: "/people/dahi.jpg" },
  { key: "abel", name: "Abel", who: "friend", photo: "/people/abel.jpg" },
  { key: "janaya", name: "Janaya", who: "friend", photo: "/people/janaya.jpg" },
  { key: "kisa", name: "Kisa", who: "friend", photo: "/people/kisa.jpg" },
];

// "my story" on the About page. lowercase on purpose, in Rori's own words. no em dashes.
export const STORY: { label: string; paras: string[] }[] = [
  { label: "where it started", paras: [
    "i was born in new york, but i was raised in nigeria. my family is from lagos. i spent a few years there and came back to new york when i was 7. christian, american, nigerian.",
    "my earliest memory is watching power rangers in the living room of our old house. i was obsessed. my season was dino thunder.",
    "after that i grew up on staten island and pretty much stayed put.",
  ]},
  { label: "little me", paras: [
    "as a kid i was fun and adventurous, but also really shy and awkward. i was into a lot of things at once. i loved artists who inspired me, and my favorite was selena gomez. i was very passionate about her.",
  ]},
  { label: "growing up", paras: [
    "somewhere in there i figured out that if you want something, you have to try your best to get it. if you want to be ambitious, find the people who are just as ambitious as you and watch what they do to get there. i still live by that.",
  ]},
  { label: "why fashion", paras: [
    "i used to get bullied, and i was really insecure about the way i looked. fashion became the way i could show up as who i wanted to be.",
    "i started early in high school but didn't get good until the end of senior year going into freshman year of college. since then i've been posting content, and recently i got to be part of new york fashion week.",
  ]},
  { label: "college at 16", paras: [
    "i started college at 16. most people around me were 18 or 19, so there was a gap, and for a while i didn't really have peers my age. i had to grow up fast.",
    "once i got past that first hurdle, it turned into something i'm still passionate about.",
  ]},
  { label: "how i feel right now", paras: [
    "ambitious. i want to get better and keep growing. i want to explore the world, travel, be outside, get to know people, love people and hold people.",
    "the thing i'm most proud of isn't on my resume. life has thrown a lot of challenges at me, and i've kept going anyway. i always find the will to grow and move forward.",
  ]},
  { label: "my people", paras: [
    "my girlfriend sierra. i love her to the moon and back.",
    "my homeboy jj, one of my closest friends. my best friend mo. and dahi, abel, janaya and kisa. whenever i'm down, they're who i lean on.",
  ]},
  { label: "things i'm a nerd about", paras: [
    "marvel and superheroes, all of it. my friends tease me about being a nerd and they're right.",
    "my favorite characters are wanda and loki. i love anti-heroes. wanda is a powerhouse. she did some evil things after losing her husband and her kids, but she still grew from it and tried to find her way back to being good. that means a lot to me.",
    "studio ghibli has always been my safe space when things get hard. i love the vibe, the closeness, and how every story is its own little tale with a lesson in it.",
  ]},
  { label: "the plan", paras: [
    "20s: be a software engineer or machine learning engineer building things that make people's lives better, at a company i really like. late 20s, start my own fashion company.",
    "30s: live and work in another country for a good while. paris, spain, norway, anywhere. start planting the seeds for the rest of my life.",
    "40s: i want a boat. i don't know why. i just want to get on it and chill on the ocean.",
    "50s: retire off what i built in my 20s and 30s, and explore the world with my family and my kids.",
    "60s, 70s, 80s: retired. literally just sleeping.",
    "90s: upbeat and happy. i just want to have a good life.",
  ]},
];
