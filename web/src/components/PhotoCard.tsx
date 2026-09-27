import { useState } from "react";

/* a polaroid-style photo; until the file exists it shows a soft placeholder with the label */
export default function PhotoCard({ src, label, alt }: { src: string; label: string; alt: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="pc-photo">
      {missing ? (
        <div className="pc-empty" aria-hidden="true">
          <b>{label}</b>
          {import.meta.env.DEV && <small className="mono">add {src.replace(/^\//, "public/")}</small>}
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} />
      )}
    </div>
  );
}
