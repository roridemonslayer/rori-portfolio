import { useState } from "react";

/* fit pics: drop fit1.jpg / fit2.jpg / fit3.jpg into public/assets/ */
function Polaroid({ file, label, tilt }: { file: string; label: string; tilt: number }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="polaroid" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="slot">
        <img src={`/assets/${file}`} alt="" onLoad={() => setOk(true)} style={ok ? undefined : { display: "none" }} />
        {!ok && label}
      </div>
    </div>
  );
}

export default function Story() {
  return (
    <section id="story" className="section story" aria-labelledby="story-t">
      <figure>
        <div className="painting"><img src="/assets/painter-hill.gif" alt="A painter at an easel on a grassy hill" /></div>
        <figcaption className="mono">the view from the workshop window</figcaption>
      </figure>
      <div className="story-text">
        <div className="sec-head"><span className="num">03</span><h2 id="story-t">My story</h2></div>
        <p>I'm Rori — a builder at heart. I fell for software the way you fall into a good story: all at once, and then deeper every chapter. I love working with agents, building things that scale, and most of all making software that actually lands in someone's life and makes it lighter.</p>
        <p>By day I'm a CS junior at NYIT (AI minor), NSBE chapter president, and a serial intern — insurance platforms, civic tech, quantum computing, teaching Python, and next up, Datadog. The throughline: I want to help as many people as I possibly can, one shipped thing at a time.</p>
        <div>
          <div className="fits-label mono">// off the clock — fits &amp; other passions</div>
          <div className="fits">
            <Polaroid file="fit1.jpg" label="fit pic 01" tilt={-2} />
            <Polaroid file="fit2.jpg" label="fit pic 02" tilt={1.5} />
            <Polaroid file="fit3.jpg" label="fit pic 03" tilt={-1} />
          </div>
        </div>
      </div>
    </section>
  );
}
