// Everything the site says lives here: edit this file and the page updates.

export const LINKS = {
  github: "https://github.com/roridemonslayer",
  linkedin: "https://linkedin.com/in/deborah-olaniyi",
  spotify: "https://open.spotify.com",
  email: "olaniyideborah63@gmail.com",
};

export const ROLES = ["Software Engineer", "AI Engineer", "Machine Learning Engineer", "Search & Retrieval Engineer", "Full-Stack Engineer"];

export type Skill = { name: string; icon: string; darkLogo?: boolean };
export const SKILLS: Skill[] = [
  { name: "JavaScript", icon: "javascript.svg" },
  { name: "TypeScript", icon: "typescript.svg" },
  { name: "React", icon: "react.svg" },
  { name: "Next.js", icon: "nextdotjs.svg" },
  { name: "Tailwind CSS", icon: "tailwindcss.svg" },
  { name: "Git", icon: "git.svg" },
  { name: "Docker", icon: "docker.svg" },
  { name: "AWS", icon: "aws.svg", darkLogo: true },
  { name: "Python", icon: "python.svg" },
  { name: "FastAPI", icon: "fastapi.svg" },
  { name: "Node.js", icon: "nodedotjs.svg" },
  { name: "LangChain", icon: "langchain.svg", darkLogo: true },
  { name: "Qiskit", icon: "qiskit.svg" },
  { name: "PostgreSQL + pgvector", icon: "postgresql.svg" },
  { name: "MongoDB", icon: "mongodb.svg" },
];

export type Job = { when: string; role: string; company: string; logo: string; logoPad?: boolean; next?: boolean; bullets: string[]; tags: string[] };
export const JOBS: Job[] = [
  {
    when: "winter 2027", role: "Software Engineering Intern", company: "Datadog", logo: "datadog.svg", next: true,
    bullets: ["Next stop: joining Datadog, the observability platform engineering teams use to monitor their infrastructure and apps."], tags: [],
  },
  {
    when: "may — jul 2026", role: "Software Engineering Intern", company: "Liberty Mutual", logo: "libertymutual.png",
    bullets: [
      "Built RAG chat and hybrid search over 156 competitors' filings, taking analyst research from ~15 minutes to under 10 seconds.",
      "Inline citations link every answer to its source PDF.",
      "pgvector + HNSW over 40K+ filings cut vector lookups 30%.",
    ],
    tags: ["RAG", "hybrid search", "pgvector", "HNSW"],
  },
  {
    when: "jan — may 2026", role: "Software Engineer", company: "NYC Civic Engagement", logo: "nyc.gov.png",
    bullets: [
      "Map, timeline and chart views in React + TypeScript for ~2K residents exploring 3,900 proposals from NYC's $5M participatory budget.",
      "Shipped a 14-language switcher and raised Lighthouse accessibility 25%.",
    ],
    tags: ["React", "TypeScript", "i18n", "accessibility"],
  },
  {
    when: "jun — aug 2025", role: "Quantum Computing Researcher", company: "The Coding School", logo: "thecodingschool.png", logoPad: true,
    bullets: [
      "Qiskit optimization to find minimum-energy protein folds: scored 4,096 configurations.",
      "CVaR over the top 20% found folds 26 points more stable than plain averaging.",
    ],
    tags: ["Qiskit", "Python", "CVaR"],
  },
  {
    when: "apr — may 2025", role: "Section Leader · Python", company: "Stanford Code in Place", logo: "stanford.edu.png",
    bullets: [
      "Taught a weekly Python section to 20 students across time zones, from their first program to final projects.",
      "95% finished the course.",
    ],
    tags: ["Python", "teaching"],
  },
];
export const EXTRAS = ["✦ president — NSBE @ NYIT", "microsoft ECLSP fellow", "america on tech fellow", "break through tech · colorstack · code2040"];

// Project art: drop an image at web/public/projects/<slug>.jpg (landscape, ~1600x1000 works best).
export type Project = { slug: string; kind: string; title: string; line: string; body: string; tags: string[]; link: string };
export const PROJECTS: Project[] = [
  {
    slug: "pathful", kind: "in progress", title: "Pathful", line: "Internships that usually live in insider networks, out in the open.",
    body: "Surfaces 500+ internships usually locked inside insider networks. A scheduled Playwright pipeline crawls and dedupes dozens of sources, and Claude API enrichment makes every listing searchable. Manual search time down 70%.",
    tags: ["python", "playwright", "claude api", "react"], link: LINKS.github,
  },
  {
    slug: "vector-search", kind: "from scratch", title: "Vector Search Engine", line: "Search by meaning, with an HNSW index written by hand.",
    body: "Search that matches text by meaning, not keywords. HNSW written by hand (probabilistic layers, greedy layered traversal) with no FAISS or Chroma. Lookups 3–4× faster than brute force: 0.4ms → 0.1ms.",
    tags: ["python", "numpy", "sentence-transformers"], link: "https://github.com/roridemonslayer/vector-search-engine",
  },
  {
    slug: "resume-auto-filler", kind: "open source", title: "Resume Auto-Filler", line: "One click fills the job application, EEO questions included.",
    body: "Free, open-source Chrome extension that fills job applications from your resume in one click, including the EEO self-identification questions most autofillers skip. Upload your resume once to the web app; the extension fills every field it recognizes, and you review and submit yourself. It also tracks the applications you send.",
    tags: ["typescript", "chrome extension", "python"], link: "https://github.com/roridemonslayer/resume-auto-filler",
  },
  {
    slug: "rori-sh", kind: "systems", title: "rori.sh", line: "A Unix shell, from scratch, in C.",
    body: "A Unix shell built from scratch in C with raw system calls: a REPL loop, fork/exec for any program, pipes, output redirection, built-in cd and exit, and Ctrl+C handling that kills the command, not the shell. Built to understand what a terminal is actually doing.",
    tags: ["c", "unix", "fork / exec", "pipes"], link: "https://github.com/roridemonslayer/rori.sh",
  },
  {
    slug: "outfit-mirror", kind: "computer vision", title: "Outfit Mirror", line: "A mirror, not a store.",
    body: "Real-time computer vision that reads your outfit's aesthetic, color harmony and proportion, hands-free.",
    tags: ["python", "computer vision"], link: "https://github.com/roridemonslayer/outfit-mirror",
  },
  {
    slug: "guitar-cv", kind: "game", title: "Guitar CV", line: "A guitar teacher that watches your hands and listens.",
    body: "A real-time guitar learning game that scores your playing with computer vision (MediaPipe hand tracking) plus audio pitch detection.",
    tags: ["python", "mediapipe", "pitch detection"], link: "https://github.com/roridemonslayer/guitar-CV-Project",
  },
  {
    slug: "esg", kind: "machine learning", title: "ESG Investment Recommender", line: "Portfolios that match what students care about.",
    body: "Helps student investors match portfolios to their values. Clusters 722 public companies on ESG ratings and returns with K-Means + PCA, built on 8 merged datasets (27K+ rows).",
    tags: ["python", "scikit-learn", "pandas"], link: "https://github.com/roridemonslayer/esg-financial-assistant",
  },
];

export const POSTS = [
  "what building an agent taught me about patience",
  "scraping 500+ hidden opportunities into the open",
  "a quantum summer: what protein folding felt like",
];

export const CHAT_SYSTEM =
  "You are the friendly chatbot on Rori Olaniyi's portfolio site, texting like a close friend over iMessage — lowercase, warm, brief (1-3 short sentences), occasional 🍃✨ emoji. Facts about Rori (legal name Deborah Olaniyi): CS major + AI minor at NYIT in Manhattan, GPA 3.65, graduating May 2028. Incoming software engineering intern at Datadog, starting winter 2027. Liberty Mutual SWE intern May–Jul 2026: built RAG chat and hybrid search over 156 competitors' filings (research went from ~15 min to under 10 s), inline citations to source PDFs for 55 analysts, pgvector + HNSW over 40K+ filings (30% faster lookups). NYC Civic Engagement software engineer Jan–May 2026: React/TypeScript map, timeline and chart views for 3,900 proposals from NYC's $5M participatory budget, 14-language switcher, accessibility up 25%. The Coding School (Qubit by Qubit) quantum computing researcher summer 2025: Qiskit protein-folding optimization, CVaR. Stanford Code in Place section leader spring 2025: taught 20 students Python, 95% completion. Projects: Pathful (Playwright + Claude API platform surfacing 500+ hidden internships), a vector search engine built from scratch with hand-written HNSW, Resume Auto-Filler (open-source Chrome extension that fills job applications from your resume, including EEO questions), rori.sh (a Unix shell written from scratch in C: fork/exec, pipes, redirection), Outfit Mirror (real-time computer vision that reads an outfit's aesthetic, color harmony and proportion), Guitar CV (a guitar learning game scored with MediaPipe hand tracking + pitch detection), and an ESG investment recommender (K-Means + PCA on 722 companies). President of NSBE @ NYIT; Microsoft ECLSP, America On Tech, Break Through Tech, ColorStack, Code2040. Loves building agents, search systems, and Studio Ghibli. Contact: olaniyideborah63@gmail.com. If asked something you don't know about her, say they should text/email the real rori.";

// on a plain web host there's no model to call, so the bot answers from these
export const CANNED: [string[], string][] = [
  [["datadog", "next", "incoming", "winter"], "i'm incoming at datadog!! ✨ joining as a software engineering intern this winter 🍃"],
  [["liberty", "intern", "work", "job", "experience"], "this summer i was a swe intern at liberty mutual 🍃 built rag chat + hybrid search over competitors' filings — research went from ~15 min to under 10 sec. next up: datadog this winter ✨"],
  [["project", "build", "pathful", "made"], "my baby is pathful ✨ it surfaces 500+ internships that usually live in insider networks. i also built a vector search engine from scratch (hand-written hnsw!), a unix shell in c, and a chrome extension that fills job apps 🍃"],
  [["school", "nyit", "study", "major", "college"], "cs major + ai minor at nyit in nyc 🍃"],
  [["nsbe", "club", "community", "lead"], "i'm president of nsbe @ nyit! community is a huge part of why i do this ✨"],
  [["ghibli", "howl", "totoro", "site", "design"], "studio ghibli forever 🍃 howl's moving castle is the whole vibe of this site"],
  [["hire", "hiring", "recruit", "open", "available", "2027"], "i'm headed to datadog this winter ✨ but always happy to chat — email me at olaniyideborah63@gmail.com"],
  [["email", "contact", "reach", "linkedin", "text"], "easiest is email: olaniyideborah63@gmail.com 🍃"],
  [["game", "play", "soot", "climb", "bored"], "hit the 🎮 play button up top!! help the soot sprite climb as high as you can 🍬"],
  [["hi", "hey", "hello", "yo", "sup"], "heyyy 🍃 what do you wanna know?"],
];
