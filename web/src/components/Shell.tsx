import { useCallback, useEffect, useState, type ReactNode } from "react";
import { prefersReducedMotion, store } from "../lib";
import Backdrop from "./Backdrop";
import Chat from "./Chat";
import Controls from "./Controls";
import Loader from "./Loader";
import Music from "./Music";
import SootGame from "./SootGame";

/* sections slide up and settle in, staggered by their data-reveal index */
function useReveals() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.setProperty("--reveal-delay", (Number(el.dataset.reveal) || 0) * 0.14 + "s");
        el.classList.add("revealed");
        io.unobserve(el);
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* everything both pages share: painted backdrop, day/night, music, chat and the soot climb game */
export default function Shell({ children, loader = false, onChatReady }: { children: ReactNode; loader?: boolean; onChatReady?: (open: () => void) => void }) {
  const [night, setNight] = useState(() => store.get("rori-mode") === "night");
  const [chatOpen, setChatOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  useReveals();

  useEffect(() => { document.body.classList.toggle("night", night); }, [night]);
  const toggleNight = () => setNight((n) => { store.set("rori-mode", n ? "day" : "night"); return !n; });
  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const openGame = useCallback(() => { setChatOpen(false); setGameOpen(true); }, []);
  const closeGame = useCallback(() => setGameOpen(false), []);
  useEffect(() => { onChatReady?.(openChat); }, [onChatReady, openChat]);

  return (
    <>
      {loader && <Loader />}
      <div className="page">
        <Backdrop />
        <Controls night={night} onToggleNight={toggleNight} onChat={openChat} onGame={openGame} />
        {children}
      </div>
      <Music />
      <SootGame open={gameOpen} onClose={closeGame} />
      <Chat open={chatOpen} onClose={closeChat} />
    </>
  );
}
