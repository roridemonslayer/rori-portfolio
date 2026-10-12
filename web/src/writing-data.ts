// Published articles. Each one is a list of blocks so the page can render it without a markdown library.

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; text: string }
  | { kind: "img"; src: string; alt: string; caption: string }
  | { kind: "table"; head: string[]; rows: string[][]; highlight?: number }; // highlight = index of the row to emphasize

export type Article = {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  status?: string; // e.g. "work in progress", shown next to the date
  summary: string;
  links: { label: string; href: string }[];
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "kestrel",
    title: "ndcg@10 and other things i'm still figuring out",
    date: "october 12, 2026",
    minutes: 5,
    status: "work in progress",
    summary:
      "my first article, and a work in progress: what kestrel is, why i'm building a report card for search engines, what it does, and what i'm adding right now.",
    links: [], // repo links stay off until the project is further along
    blocks: [
      { kind: "p", text: "hi, hello, welcome! if you're reading this, thank you for being here. this is my first time ever writing an article, so bear with me 🌱" },

      { kind: "h", text: "so what is it" },
      {
        kind: "p",
        text: "kestrel is a test bench for search. you give it a set of questions and a pile of documents, it runs every question through a few different search methods, and it scores which one puts the right answers at the top. think of it as a report card for search engines.",
      },
      { kind: "img", src: "/writing/kestrel/leaderboard.jpg", alt: "kestrel leaderboard comparing search methods", caption: "the leaderboard: every search method, scored on the same 300 questions." },

      { kind: "h", text: "why i'm building it" },
      {
        kind: "p",
        text: "lately i've been really into search and retrieval, and i want to understand it at its core, not just use it. this summer at liberty mutual i built rag and hybrid search, and one question kept bugging me: how do you actually know one search method is better than another? not \"it feels better.\" better, with a number. kestrel is me trying to answer that.",
      },

      { kind: "h", text: "what it does" },
      { kind: "p", text: "right now it compares three ways of searching:" },
      {
        kind: "list",
        items: [
          "bm25: classic keyword search. matches the words you typed, weighting rare words more.",
          "embeddings: turns text into numbers so it can match meaning, even with zero words in common.",
          "hybrid: both at once, blended by rank.",
        ],
      },
      {
        kind: "p",
        text: "and it grades them with the same metrics researchers use. the one in the title, ndcg@10, gives a result more points the higher it ranks, then scales it so a perfect ranking scores exactly 1.0. i wrote the metrics in plain python so i could actually see how they work step by step.",
      },
      {
        kind: "p",
        text: "my favorite example is the claim \"activator-inhibitor pairs are provided dorsally by admpchordin.\" keyword search scored 0 because the paper writes \"admp\" and \"chordin\" as two separate words. embeddings found it at #1 anyway, because they match meaning, not spelling.",
      },
      { kind: "img", src: "/writing/kestrel/explorer.jpg", alt: "query explorer: keyword search misses a paper that embeddings rank first", caption: "the query explorer: same claim, three search methods. the highlighted result is the paper a human marked as the answer." },

      { kind: "h", text: "what i'm doing right now" },
      {
        kind: "p",
        text: "right now kestrel only runs on scifact, about 5,000 science abstracts and 300 claims that real people labeled with the right answers. so for now it's really only good at science questions.",
      },
      {
        kind: "p",
        text: "so i'm adding more data. i'm planning to pull more datasets from hugging face, which hosts a whole collection of these (finance questions, covid research, quora questions, and more), each with its own human answer key so the scores stay real. i've already started testing on nutrition and medicine questions, where every method scores way lower, and i want to figure out why.",
      },

      { kind: "h", text: "the scoreboard (so far)" },
      { kind: "p", text: "on scifact's 300 claims, top 10 results each. higher is better for the scores, lower is better for time:" },
      {
        kind: "table",
        head: ["search method", "recall@10", "mrr@10", "ndcg@10", "ms per search"],
        highlight: 0,
        rows: [
          ["hybrid + reranker", "0.822", "0.657", "0.691", "1467"],
          ["hybrid", "0.815", "0.655", "0.689", "40"],
          ["keyword (bm25)", "0.786", "0.635", "0.665", "17"],
          ["embeddings", "0.790", "0.606", "0.648", "13"],
          ["my from-scratch hnsw", "0.773", "0.596", "0.637", "43"],
        ],
      },
      {
        kind: "p",
        text: "the reranker (a model that re-reads the top 50 results) barely helped and made every search about 45x slower, probably because it was trained on web searches, not science. still figuring that one out.",
      },
      { kind: "p", text: "and here's my from-scratch engine before and after fixing its search, on random test vectors (recall = how many of the true top 5 it finds, compared to checking every single vector):" },
      {
        kind: "table",
        head: ["version", "vectors", "recall@5", "ms per search", "check-everything ms"],
        highlight: 1,
        rows: [
          ["before the fix", "1,000", "3.2%", "0.2", "—"],
          ["after (ef=50)", "1,000", "97.6%", "2.4", "4.9"],
          ["after (ef=100)", "5,000", "95.2%", "6.9", "30.5"],
        ],
      },
      { kind: "code", text: "# the fix: instead of following one path through the graph,\n# keep the best `ef` candidates and explore from all of them\nfound = search_layer(graph, query, [entry], ef=100, layer_num=0, layers=layers)" },

      { kind: "h", text: "improvements so far (and next)" },
      {
        kind: "list",
        items: [
          "hybrid search wins so far: 0.689 ndcg@10, vs 0.665 for keyword search and 0.648 for embeddings alone. they fail on different questions, so together they cover each other.",
          "my keyword search scored exactly what the published benchmark reports, which is how i knew my setup was right before trusting anything else.",
          "i plugged in the vector search engine i built from scratch this summer, and fixed how it searches its graph. it went from finding 3% of the right answers to 97.6%, and on real papers it now gets 98% of exact search's score.",
          "next: more datasets, making my engine faster, and eventually fine-tuning the embedding model on some of that new data.",
        ],
      },
      {
        kind: "p",
        text: "it's very much a work in progress, and i'm still figuring a lot of this out. if you're into search and retrieval too, or you see something i got wrong, i'd genuinely love to hear from you. i'll keep writing as i go ✨",
      },
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
