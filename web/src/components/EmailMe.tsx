import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LINKS } from "../data";

/* email_me: a letter you write right on the page; send delivers it straight to my inbox through FormSubmit
   (no account needed: the very first message sends me a one-time "activate this form" email to click).
   If FormSubmit can't take it, the letter opens in Gmail instead, already written, so it still gets sent. */
type Status = "writing" | "sending" | "sent" | "gmail" | "error";

export default function EmailMe({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("writing");
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStatus((s) => (s === "sent" ? "writing" : s));
    first.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const subject = `hello from ${name.trim() || "your site"}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${LINKS.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `${message.trim()}\n\n— ${name.trim()}${from.trim() ? ` (${from.trim()})` : ""}`)}`;
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honey = (e.currentTarget.elements.namedItem("_honey") as HTMLInputElement).value;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${LINKS.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email: from, message, _subject: subject, _replyto: from, _template: "box", _captcha: "false", _honey: honey }),
      });
      const data = await res.json();
      if (String(data.success) !== "true") throw new Error(data.message);
      setStatus("sent");
      setName(""); setFrom(""); setMessage("");
    } catch {
      // still inside the click's few-second window, so the browser lets this tab open; if it's blocked, show a link
      setStatus(window.open(gmail, "_blank") ? "gmail" : "error");
    }
  };

  return createPortal(
    <div className="mail-modal" role="dialog" aria-modal="true" aria-labelledby="mail-t" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mail-sheet">
        <button type="button" className="mail-close" aria-label="Close" onClick={onClose}>✕</button>
        {status === "sent" ? (
          <div className="mail-sent" role="status">
            <img className="mail-soot" src="/assets/soot-loader.png" alt="" />
            <h3 id="mail-t">it's on its way!</h3>
            <p>a soot sprite is carrying your letter over. I'll write back to you soon.</p>
            <button type="button" className="mail-send" onClick={onClose}>back to the site</button>
          </div>
        ) : (
          <form onSubmit={send}>
            <div className="mail-kicker mono">write me a letter</div>
            <h3 id="mail-t">dear rori,</h3>
            <label className="mail-field">
              <span className="mono">your name</span>
              <input ref={first} required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
            </label>
            <label className="mail-field">
              <span className="mono">your email, so I can write back</span>
              <input required type="email" value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="email" maxLength={120} />
            </label>
            <label className="mail-field">
              <span className="mono">message</span>
              <textarea required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={4000} />
            </label>
            {/* bots fill in hidden boxes; people never see this one */}
            <input type="text" name="_honey" className="mail-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {status === "gmail" && (
              <p className="mail-note" role="status">
                your letter opened in gmail, all written. just hit send there ✦ (didn't open? <a href={gmail} target="_blank" rel="noopener">click here</a>)
              </p>
            )}
            {status === "error" && (
              <p className="mail-err" role="alert">
                that didn't go through. <a href={gmail} target="_blank" rel="noopener">send it through gmail instead</a>, or email me at <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
              </p>
            )}
            <div className="mail-foot">
              <span className="mono mail-to">to: {LINKS.email}</span>
              <button type="submit" className="mail-send" disabled={status === "sending"}>
                {status === "sending" ? "sending…" : "send ✦"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
