/* floating controls (top-right), no nav bar: the hero runs full screen */
export default function Controls({ night, onToggleNight, onChat, onGame }: { night: boolean; onToggleNight: () => void; onChat: () => void; onGame: () => void }) {
  return (
    <div className="controls mono" role="toolbar" aria-label="Site controls">
      <button className="pill" type="button" onClick={onChat} aria-controls="chat">💬<span className="pill-text"> chat</span></button>
      <button className="pill" type="button" onClick={onGame} aria-controls="game">🎮<span className="pill-text"> play</span></button>
      <button className="pill strong" type="button" onClick={onToggleNight}>
        <span className="knob" /><span className="pill-text">{night ? "night_mode" : "day_mode"}</span>
      </button>
    </div>
  );
}
