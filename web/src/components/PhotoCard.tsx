import { useState } from "react";

/* a polaroid-style photo; until the file exists it shows a soft placeholder with the label */
/* srcNight (optional) swaps in for dark mode; focus is the object-position for cropping into the square */
export default function PhotoCard({ src, srcNight, focus, label, alt }: { src: string; srcNight?: string; focus?: string; label: string; alt: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="pc-photo">
      {missing ? (
        <div className="pc-empty" aria-hidden="true">
          <b>{label}</b>
          {import.meta.env.DEV && <small className="mono">add {src.replace(/^\//, "public/")}</small>}
        </div>
      ) : (
        <>
          <img className={srcNight ? "day-only" : undefined} src={src} alt={alt} loading="lazy" style={{ objectPosition: focus }} onError={() => setMissing(true)} />
          {srcNight && <img className="night-only" src={srcNight} alt={alt} loading="lazy" />}
        </>
      )}
    </div>
  );
}
