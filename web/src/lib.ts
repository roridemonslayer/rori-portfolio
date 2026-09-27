// localStorage can throw (private windows, blocked site data), so every access is guarded
export const store = {
  get(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
