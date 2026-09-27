import { useCallback, useEffect, useState } from "react";
import Backdrop from "./components/Backdrop";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import Controls from "./components/Controls";
import Experience from "./components/Experience";
import FittingRoom from "./components/FittingRoom";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Music from "./components/Music";
import Projects from "./components/Projects";
import SootGame from "./components/SootGame";
import Stack from "./components/Stack";
import Story from "./components/Story";
import Writing from "./components/Writing";
import { prefersReducedMotion, store } from "./lib";

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
    }, { threshold: 0.35, rootMargin: "0px 0px -15% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
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

  return (
    <>
      <Loader />
      <div className="page">
        <Backdrop />
        <Controls night={night} onToggleNight={toggleNight} onChat={openChat} onGame={openGame} />
        <Hero />
        <Stack />
        <Experience />
        <Projects />
        {/* story → writing share one frosted sheet, so text stays readable over the painting */}
        <div className="sheet">
          <Story />
          <FittingRoom />
          <Writing />
        </div>
        <Contact onChat={openChat} />
      </div>
      <Music />
      <SootGame open={gameOpen} onClose={closeGame} />
      <Chat open={chatOpen} onClose={closeChat} />
    </>
  );
}
