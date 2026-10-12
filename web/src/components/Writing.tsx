import { ARTICLES } from "../writing-data";

export default function Writing() {
  return (
    <section id="writing" className="section" aria-labelledby="writing-t">
      <div className="sec-head" style={{ marginBottom: 8 }}>
        <span className="num">05</span>
        <h2 id="writing-t">Writing</h2>
        <span className="aside">notes on tech &amp; things i'm learning</span>
      </div>
      <div className="rows">
        {ARTICLES.map((a) => (
          <a className="post post-live" key={a.slug} href={`/writing/${a.slug}`}>
            <span className="title">{a.title}</span>
            <span className="status mono">{a.status ? `${a.status} · ` : ""}{a.date} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
