export function nextScrollTop(
  key: string,
  top: number,
  viewport: number,
  max: number,
  line = 40,
): number | null {
  let n: number;
  switch (key) {
    case "ArrowDown":
      n = top + line;
      break;
    case "ArrowUp":
      n = top - line;
      break;
    case "PageDown":
      n = top + viewport * 0.9;
      break;
    case "PageUp":
      n = top - viewport * 0.9;
      break;
    case "Home":
      n = 0;
      break;
    case "End":
      n = max;
      break;
    default:
      return null;
  }
  return Math.max(0, Math.min(max, Math.round(n)));
}
export const scrollPercent = (top: number, max: number) =>
  max <= 0 ? 100 : Math.round((top / max) * 100);
