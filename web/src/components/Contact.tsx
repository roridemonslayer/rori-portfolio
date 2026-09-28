import { useCallback, useState } from "react";
import { LINKS } from "../data";
import EmailMe from "./EmailMe";

export default function Contact({ onChat }: { onChat: () => void }) {
  const [mailOpen, setMailOpen] = useState(false);
  const closeMail = useCallback(() => setMailOpen(false), []);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(LINKS.email); } catch {
      // older browsers: select the address so a ⌘C / long-press copies it
      const r = document.createRange(); r.selectNodeContents(document.getElementById("email-addr")!);
      getSelection()?.removeAllRanges(); getSelection()?.addRange(r); return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <>
      <section id="contact" className="section" aria-labelledby="contact-t" style={{ paddingBottom: 0 }}>
        <div className="contact-card">
          <div className="kicker mono">06 — say hello</div>
          <h2 id="contact-t">The door opens to a different place every time<span style={{ color: "var(--ember)" }}>.</span> Knock anyway.</h2>
          <div className="contact-links">
            <button type="button" className="text-me" onClick={onChat}>💬 text_me</button>
            <button type="button" className="email-me" onClick={() => setMailOpen(true)}>✉ email_me</button>
            <a href={LINKS.github} target="_blank" rel="noopener">github</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener">linkedin</a>
            <a href={LINKS.spotify} target="_blank" rel="noopener"><span className="green-dot" />what i'm listening to</a>
          </div>
          <div className="email-line mono">
            or copy it:{" "}
            <button type="button" className="copy-email" onClick={copy} title="click to copy">
              <code id="email-addr">{LINKS.email}</code>
              <span className="copy-tag" aria-live="polite">{copied ? "copied ✓" : "copy"}</span>
            </button>
          </div>
        </div>
        <EmailMe open={mailOpen} onClose={closeMail} />
      </section>
      <footer className="foot mono">
        <span>© {new Date().getFullYear()} rori olaniyi — made with a little magic</span>
        <span>nyc ✦ somewhere above the waste</span>
      </footer>
    </>
  );
}
