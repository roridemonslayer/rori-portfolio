import { LINKS } from "../data";

export default function Contact({ onChat }: { onChat: () => void }) {
  return (
    <>
      <section id="contact" className="section" aria-labelledby="contact-t" style={{ paddingBottom: 0 }}>
        <div className="contact-card">
          <div className="kicker mono">06 — say hello</div>
          <h2 id="contact-t">The door opens to a different place every time<span style={{ color: "var(--ember)" }}>.</span> Knock anyway.</h2>
          <div className="contact-links">
            <button type="button" className="text-me" onClick={onChat}>💬 text_me</button>
            <a className="email-me" href={`mailto:${LINKS.email}`}>email_me</a>
            <a href={LINKS.github} target="_blank" rel="noopener">github</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener">linkedin</a>
            <a href={LINKS.spotify} target="_blank" rel="noopener"><span className="green-dot" />what i'm listening to</a>
          </div>
          <div className="email-line mono">or copy it: <code>{LINKS.email}</code></div>
        </div>
      </section>
      <footer className="foot mono">
        <span>© {new Date().getFullYear()} rori olaniyi — made with a little magic</span>
        <span>nyc ✦ somewhere above the waste</span>
      </footer>
    </>
  );
}
