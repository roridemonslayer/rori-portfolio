import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AboutTeaser from "./components/AboutTeaser";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Fits from "./components/Fits";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Shell from "./components/Shell";
import Stack from "./components/Stack";
import Writing from "./components/Writing";
import About from "./pages/About";

/* two pages, one app: moving between / and /about/ swaps the content in place instead of
   reloading, so the Shell (and the song playing in it) keeps going across the switch */
type Page = "home" | "about";
const pageOf = (path: string): Page => (path.replace(/\/+$/, "") === "/about" ? "about" : "home");
const TITLES: Record<Page, string> = { home: "Rori Olaniyi", about: "About · Rori Olaniyi" };

function Home({ onChat }: { onChat: () => void }) {
  return (
    <>
      <Hero />
      <Stack />
      <Experience />
      <Projects />
      {/* about → writing share one frosted sheet, so text stays readable over the painting */}
      <div className="sheet">
        <AboutTeaser />
        <Fits />
        <Writing />
      </div>
      <Contact onChat={onChat} />
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageOf(location.pathname));
  const firstPage = useRef(page); // the loading screen only belongs to a fresh visit to the main page
  const restoreTo = useRef<number | null>(null);
  const chat = useRef<() => void>(() => {});
  const onChatReady = useCallback((open: () => void) => { chat.current = open; }, []);

  useEffect(() => {
    history.scrollRestoration = "manual"; // we put the scroll back ourselves once the page has rendered
    // links to the other page navigate in place; new-tab clicks and everything else behave normally
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target || a.hasAttribute("download") || a.origin !== location.origin) return;
      if (a.pathname === location.pathname || (a.pathname !== "/" && pageOf(a.pathname) !== "about")) return;
      e.preventDefault();
      history.replaceState({ scroll: scrollY }, "");
      history.pushState({ scroll: 0 }, "", a.pathname);
      restoreTo.current = 0;
      setPage(pageOf(a.pathname));
    };
    const onPop = (e: PopStateEvent) => {
      restoreTo.current = e.state?.scroll ?? 0;
      setPage(pageOf(location.pathname));
    };
    addEventListener("click", onClick);
    addEventListener("popstate", onPop);
    return () => { removeEventListener("click", onClick); removeEventListener("popstate", onPop); };
  }, []);

  useLayoutEffect(() => {
    document.title = TITLES[page];
    if (restoreTo.current !== null) { scrollTo(0, restoreTo.current); restoreTo.current = null; }
  }, [page]);

  return (
    <Shell page={page} loader={firstPage.current === "home"} onChatReady={onChatReady}>
      {page === "about" ? <About /> : <Home onChat={() => chat.current()} />}
    </Shell>
  );
}
