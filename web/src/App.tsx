import { useCallback, useRef } from "react";
import AboutTeaser from "./components/AboutTeaser";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import FittingRoom from "./components/FittingRoom";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Shell from "./components/Shell";
import Stack from "./components/Stack";
import Writing from "./components/Writing";

export default function App() {
  const chat = useRef<() => void>(() => {});
  const onChatReady = useCallback((open: () => void) => { chat.current = open; }, []);
  return (
    <Shell loader onChatReady={onChatReady}>
      <Hero />
      <Stack />
      <Experience />
      <Projects />
      {/* about → writing share one frosted sheet, so text stays readable over the painting */}
      <div className="sheet">
        <AboutTeaser />
        <FittingRoom />
        <Writing />
      </div>
      <Contact onChat={() => chat.current()} />
    </Shell>
  );
}
