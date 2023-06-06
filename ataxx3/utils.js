export function distance(x1, y1, x2, y2) {
  return Math.max(x1 - x2, x2 - x1, y1 - y2, y2 - y1);
}
