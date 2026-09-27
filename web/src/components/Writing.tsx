import { POSTS } from "../data";

export default function Writing() {
  return (
    <section id="writing" className="section" aria-labelledby="writing-t">
      <div className="sec-head" style={{ marginBottom: 8 }}>
        <span className="num">05</span>
        <h2 id="writing-t">Writing</h2>
        <span className="aside">notes on tech &amp; things i'm learning</span>
      </div>
      <div className="rows">
        {POSTS.map((t) => <div className="post" key={t}><span className="title">{t}</span><span className="status mono">draft — coming soon</span></div>)}
      </div>
    </section>
  );
}
