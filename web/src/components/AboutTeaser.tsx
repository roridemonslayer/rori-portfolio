import { INTERESTS } from "../about-data";
import LightStrip from "./LightStrip";

/* main page: a short about blurb; the full version lives on /about/ */
export default function AboutTeaser() {
  const preview = INTERESTS.filter((i) => ["marvel", "ghibli", "books"].includes(i.key));
  return (
    <section id="about" className="section about-teaser" aria-labelledby="about-t">
      <div className="about-teaser-text">
        <div className="sec-head"><span className="num">03</span><h2 id="about-t">About me</h2></div>
        <p>I'm Rori, a CS student at NYIT with a minor in AI. I like building the backend and full-stack side of things.</p>
        <p>Outside of tech it's fashion, Marvel, Ghibli, collecting cards, traveling, music and a good book.</p>
        <a className="btn-main about-more" href="/about/">More about me →</a>
      </div>
      <LightStrip items={preview} compact />
    </section>
  );
}
