import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Shell from "./components/Shell";
import About from "./pages/About";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Shell>
      <About />
    </Shell>
  </StrictMode>,
);
