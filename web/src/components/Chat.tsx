import { useEffect, useRef, useState } from "react";
import { CANNED, CHAT_SYSTEM } from "../data";

type Msg = { who: "me" | "them"; text: string };
type Claude = { complete: (req: { system: string; messages: { role: string; content: string }[] }) => Promise<string> };

function cannedReply(text: string) {
  const t = text.toLowerCase();
  const hit = CANNED.find(([keys]) => keys.some((k) => new RegExp("\\b" + k).test(t)));
  return hit ? hit[1] : "ooh good question, the real rori would know better 🍂 email her at olaniyideborah63@gmail.com";
}

/* imessage chat: uses a model when the host provides one, otherwise answers from CANNED */
export default function Chat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ who: "them", text: "hey!! this is rori's bot 🍃 ask me anything about her projects, experience, or what she's building rn" }]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) { const id = setTimeout(() => input.current?.focus(), 350); return () => clearTimeout(id); } }, [open]);
  useEffect(() => { list.current?.scrollTo(0, list.current.scrollHeight); }, [msgs, typing]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = async (text: string) => {
    if (!text || typing) return;
    const next: Msg[] = [...msgs, { who: "me", text }];
    setMsgs(next);
    setTyping(true);
    let reply: string;
    try {
      const claude = (window as unknown as { claude?: Claude }).claude;
      if (!claude?.complete) throw new Error("no model");
      reply = await claude.complete({ system: CHAT_SYSTEM, messages: next.map((m) => ({ role: m.who === "me" ? "user" : "assistant", content: m.text })) });
    } catch {
      await new Promise((r) => setTimeout(r, 700));
      reply = cannedReply(text);
    }
    setMsgs((m) => [...m, { who: "them", text: reply }]);
    setTyping(false);
  };

  return (
    <aside className={"chat" + (open ? " open" : "")} id="chat" aria-label="Chat with rori's bot">
      <div className="chat-head">
        <div className="avatar" aria-hidden="true">R</div>
        <div className="chat-who"><b>rori (bot) 🍃</b><span>iMessage · usually replies instantly</span></div>
        <button className="chat-close" type="button" aria-label="Close chat" onClick={onClose}>×</button>
      </div>
      <div className="msgs" ref={list} aria-live="polite">
        {msgs.map((m, i) => <div key={i} className={"bubble " + m.who}>{m.text}</div>)}
        {typing && <div className="bubble them" style={{ color: "var(--chat-muted)" }}>•••</div>}
      </div>
      <form className="chat-form" onSubmit={(e) => { e.preventDefault(); const t = draft.trim(); setDraft(""); send(t); }}>
        <input ref={input} value={draft} onChange={(e) => setDraft(e.target.value)} autoComplete="off" placeholder="iMessage" aria-label="Message" />
        <button type="submit" aria-label="Send">↑</button>
      </form>
    </aside>
  );
}
