import { readLS } from "./storage";

let ctx: AudioContext | null = null;
export function click(freq = 880, dur = 0.06) {
  if (typeof window === "undefined" || !readLS("aihub.sound", true)) return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {
    /* audio unavailable */
  }
}
export const chime = () => {
  click(660, 0.12);
  setTimeout(() => click(990, 0.18), 120);
};
