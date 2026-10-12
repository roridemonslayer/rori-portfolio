// Published articles. Each one is a list of blocks so the page can render it without a markdown library.

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; text: string }
  | { kind: "img"; src: string; alt: string; caption: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export type Article = {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  summary: string;
  links: { label: string; href: string }[];
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "kestrel",
    title: "what 'admpchordin' taught me about search",
    date: "october 12, 2026",
    minutes: 6,
    summary:
      "my first article! i built a test bench that grades search engines on real research papers, learned what recall, mrr and ndcg actually measure, and watched my own from-scratch hnsw engine hold up at 98% of exact search.",
    links: [
      { label: "kestrel on github", href: "https://github.com/roridemonslayer/kestrel" },
      { label: "my vector search engine", href: "https://github.com/roridemonslayer/vector-search-engine" },
    ],
    blocks: [
      { kind: "p", text: "hi, hello, welcome! if you're reading this, thank you for being here. this is my first time ever writing an article, so bear with me 🌱" },
      { kind: "p", text: "lately i've been really into search and retrieval. not just using it, but how it actually works under the hood." },
      {
        kind: "p",
        text: "this summer at liberty mutual i built rag and hybrid search over thousands of filings, and the whole time there was a question in the back of my head i couldn't answer well: how do you actually know one search method is better than another? not \"it feels better.\" better, with a number.",
      },
      {
        kind: "p",
        text: "so i built kestrel. it's a test bench for search. you pick a dataset, run every query through a few different retrievers, and see which one puts the right answers at the top, measured with the same metrics researchers use.",
      },
      { kind: "img", src: "/writing/kestrel/leaderboard.jpg", alt: "kestrel leaderboard comparing retrievers", caption: "the leaderboard: every retriever, scored on the same 300 queries." },

      { kind: "h", text: "the setup" },
      {
        kind: "p",
        text: "i used scifact, a public dataset of about 5,000 scientific abstracts and 300 claims like \"vitamin d deficiency is linked to depression.\" for each claim, real people marked which papers actually support or refute it. those human judgments are the answer key, and they're what make real scoring possible.",
      },
      { kind: "p", text: "then i compared three ways of searching:" },
      {
        kind: "list",
        items: [
          "bm25: classic keyword search. it scores documents by how many query words they share, giving more weight to rare words. fast, old, and still really hard to beat.",
          "dense: embeddings. a model (all-minilm-l6-v2) turns every text into 384 numbers so that texts with similar meaning end up close together, even with zero words in common.",
          "hybrid: both at once, combined with reciprocal rank fusion. instead of adding up scores that live on different scales, it only looks at positions: a document gets 1 / (60 + its rank) from each list, and the points add up. if both methods like a document, it rises.",
        ],
      },

      { kind: "h", text: "the metrics (the part i actually wanted to understand)" },
      { kind: "p", text: "every metric asks the same question in a slightly different way: did the retriever put the relevant papers near the top?" },
      {
        kind: "list",
        items: [
          "recall@10: of all the papers a human marked relevant, how many showed up anywhere in the top 10. it doesn't care about order inside those 10.",
          "mrr: 1 divided by the position of the first relevant result. first place = 1.0, second = 0.5, third = 0.33. it rewards getting one good answer right at the top.",
          "ndcg@10: relevant results earn points, but the points shrink the lower they're ranked (divided by log2 of the position + 1). then it's divided by the best possible score, so a perfect ranking is exactly 1.0.",
        ],
      },
      {
        kind: "p",
        text: "i wrote all three in plain python with no libraries, with tiny examples you can check by hand, because writing ndcg out step by step is what finally made it click for me.",
      },
      { kind: "code", text: "dcg  = 0 + 1/log2(3) + 1/log2(4) = 1.131   # relevant docs at ranks 2 and 3\nidcg = 1/log2(2) + 1/log2(3)     = 1.631   # same docs at ranks 1 and 2\nndcg = 1.131 / 1.631             = 0.693" },

      { kind: "h", text: "results" },
      {
        kind: "table",
        head: ["retriever", "recall@10", "mrr@10", "ndcg@10"],
        rows: [
          ["hybrid", "0.815", "0.655", "0.689"],
          ["bm25", "0.786", "0.635", "0.665"],
          ["dense (embeddings)", "0.790", "0.606", "0.648"],
        ],
      },
      {
        kind: "p",
        text: "my favorite moment: bm25 scored exactly 0.665 ndcg@10, the same number the beir benchmark paper reports. that's how i knew my data loading and my metric math were right before trusting anything else.",
      },
      {
        kind: "p",
        text: "hybrid wins on every quality metric, and the reason is the most interesting thing i learned. keyword search and embeddings fail on different queries, so combining them covers each other's blind spots.",
      },

      { kind: "h", text: "where keyword search breaks" },
      {
        kind: "p",
        text: "kestrel has a query explorer that finds the queries where one method wins and another fails. one of the best examples:",
      },
      { kind: "quote", text: "\"activator-inhibitor pairs are provided dorsally by admpchordin.\"" },
      {
        kind: "p",
        text: "bm25 scored 0 on this one. the query squashes two protein names into one word, \"admpchordin,\" while the paper writes \"admp\" and \"chordin\" separately, so keyword matching finds nothing. embeddings put the right paper at #1 anyway, because they match meaning instead of exact words. seeing that side by side taught me more than any explanation of embeddings ever did.",
      },
      { kind: "img", src: "/writing/kestrel/explorer.jpg", alt: "query explorer showing bm25 missing a paper that dense search ranks first", caption: "same query, three retrievers. the highlighted result is the paper a human marked relevant." },

      { kind: "h", text: "a result that surprised me" },
      {
        kind: "p",
        text: "i also tried reranking: taking hybrid's top 50 and re-scoring them with a cross-encoder, a model that reads the query and each paper together. everyone says this is how you get the best quality.",
      },
      {
        kind: "p",
        text: "here it barely helped (0.689 → 0.691) and made every search about 45 times slower. the model was trained on web search questions, not scientific claims, so it mostly agreed with what hybrid already had. i'm keeping that result in, because \"the popular technique didn't help on my data\" is a real finding too.",
      },

      { kind: "h", text: "plugging in my own engine" },
      {
        kind: "p",
        text: "this summer i built a vector search engine from scratch in pure python, with no numpy and no faiss, to understand what vector databases do. it uses hnsw, the layered graph index that a lot of vector databases are built on. its weak spot was recall: it found only about 3% of the true top 5.",
      },
      {
        kind: "p",
        text: "the problem was that search followed one greedy path through the graph and returned only the few nodes it passed on the way. the original hnsw paper keeps a \"beam\" of the best candidates on the bottom layer and explores from all of them, and it links each new node to more neighbors. after adding both, recall went from 3.2% to 97.6%, and on 5,000 vectors it's still 4–20x faster than checking everything.",
      },
      {
        kind: "p",
        text: "then i plugged it into kestrel as a retriever, on real research papers. it scored 0.637 ndcg@10 against 0.648 for exact search on the same embeddings. that's 98% of exact quality from an index i wrote line by line. it's slower than numpy here because it's pure python, but seeing my own graph hold up on real data was the best part of this whole project.",
      },

      { kind: "h", text: "what i took away" },
      {
        kind: "list",
        items: [
          "you can't improve search you can't measure. a fixed dataset with human judgments turns \"this feels better\" into a number.",
          "the old method is a strong baseline. bm25 beat plain embeddings on this dataset.",
          "different methods fail differently, and that's exactly why hybrid works.",
          "check your setup against a known number before you trust any result.",
        ],
      },
      {
        kind: "p",
        text: "kestrel is also the start of a bigger shared retrieval layer. next i want to build an image search demo and a voice agent on top of the same code. if you're into search and retrieval too, i'd love to talk about it.",
      },
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
