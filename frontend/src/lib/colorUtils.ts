/** t = weight of hex2 (0..1) */
export function blendHex(hex1: string, hex2: string, t: number): string {
  const parse = (hex: string) => {
    const n = hex.replace("#", "");
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round((1 - t) * r1 + t * r2);
  const g = Math.round((1 - t) * g1 + t * g2);
  const b = Math.round((1 - t) * b1 + t * b2);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export const themeAccent = {
  color: "#4e878c",
  blend: 0.25,
};

export function tintWithAccent(
  hex: string,
  options?: { accent?: string; blend?: number }
): string {
  const accent = options?.accent ?? themeAccent.color;
  const blend = options?.blend ?? themeAccent.blend;
  return blendHex(hex, accent, blend);
}
