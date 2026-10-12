import { articleBySlug, type Block } from "../writing-data";

function Piece({ block }: { block: Block }) {
  switch (block.kind) {
    case "h":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "code":
      return <pre className="mono"><code>{block.text}</code></pre>;
    case "list":
      return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case "img":
      return (
        <figure>
          <img src={block.src} alt={block.alt} loading="lazy" />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead><tr>{block.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{block.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
  }
}

export default function Article({ slug }: { slug: string }) {
  const article = articleBySlug(slug);
  if (!article) {
    return (
      <main className="about-page">
        <a className="back-home mono" href="/">← back to the main page</a>
        <section className="sheet-lite"><p>couldn't find that post.</p></section>
      </main>
    );
  }
  return (
    <main className="about-page article-page">
      <a className="back-home mono" href="/">← back to the main page</a>
      <article className="sheet-lite article">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>WRITING</div>
        <h1>{article.title}</h1>
        <div className="article-meta mono">{article.date} · {article.minutes} min read{article.status && <span className="wip"> · {article.status}</span>}</div>
        {article.blocks.map((block, i) => <Piece key={i} block={block} />)}
        {article.links.length > 0 && (
          <div className="article-links">
            {article.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>)}
          </div>
        )}
      </article>
    </main>
  );
}
