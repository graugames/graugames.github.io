/* ===============================================================
   The shelf. This is the only file you edit to add a game.

   Each entry renders one card. `art` is inline SVG drawn on a
   320x200 canvas — no image files, so a card costs nothing to load
   and stays crisp at any size. Give art layers the classes
   `l-back` / `l-mid` / `l-fg` and they parallax on hover for free.
   =============================================================== */

/* A pointy starburst, used behind cover art to lift a subject off its
   background. Generated rather than hand-written so the point count is
   a knob instead of a wall of coordinates. */
function burst(cx, cy, rOuter, rInner, points, attrs) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? rInner : rOuter;
    const a = (Math.PI * i) / points - Math.PI / 2;
    d += (i ? "L" : "M") + (cx + Math.cos(a) * r).toFixed(1) +
         " " + (cy + Math.sin(a) * r).toFixed(1);
  }
  return `<path d="${d}Z" ${attrs}/>`;
}

/* Evenly spaced diagonal bands, for backgrounds that need motion
   without another colour in the palette. */
function bands(fill, count, width, gap, angle) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `<rect x="-80" y="${i * (width + gap) - 40}" width="480" height="${width}" fill="${fill}"/>`;
  }
  return `<g transform="rotate(${angle} 160 100)">${out}</g>`;
}

/* One accent colour keeps the shelf lively without turning every cover into
   a separate visual alarm. Paper, stone and ink do the rest of the work. */
const ACCENT = "#b6674f";
const PAPER = "#e3ddd1";

/* Half a watermelon, flat side up, centred on its own origin. Rind, pith
   and flesh are separate rings so the cut face reads as a cut face. */
const MELON = `
  <path d="M-58 0A58 58 0 0 0 58 0Z" fill="#c4bca9" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-47 0A47 47 0 0 0 47 0Z" fill="${PAPER}" stroke="#000" stroke-width="5"/>
  <path d="M-39 0A39 39 0 0 0 39 0Z" fill="${ACCENT}" stroke="#000" stroke-width="5"/>
  <g fill="#000">
    <circle cx="-18" cy="12" r="3.6"/><circle cx="3" cy="18" r="3.6"/>
    <circle cx="21" cy="9" r="3.6"/><circle cx="-3" cy="30" r="3.6"/>
  </g>`;

const GLOVE = `
  <path d="M-28 20 L-26-28 Q-25-42-14-42 Q-6-42-6-30 L-5-12 L1-48 Q3-59 12-57 Q20-55 18-44 L13-13 L20-39 Q23-49 31-45 Q38-42 35-31 L26 13 Q22 32 5 38 L-10 41 Q-24 40-28 20Z" fill="#58e7ff" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;

export const GAMES = [
  {
    slug: "grau-ninja",
    title: "GrauNinja",
    blurb: "Slice fruit with your bare hands. Your webcam tracks your index finger and turns it into the blade — no mouse, no controller.",
    tags: ["Hand tracking", "Webcam", "Arcade"],
    href: "https://graugames.github.io/grau-ninja/",
    status: "live",
    tilt: -1.6,
    art: `
      <rect width="320" height="200" fill="${ACCENT}"/>
      <g class="l-back">
        <g opacity=".18">${bands("#000", 7, 13, 24, -24)}</g>
      </g>
      <g class="l-mid">
        <g class="melon-a">${MELON}</g>
        <g class="melon-b">${MELON}</g>
      </g>
      <g class="l-fg">
        <path class="slash slash-bg" d="M2 178 C 96 136, 178 104, 318 28" fill="none" stroke="#000" stroke-width="17" stroke-linecap="round"/>
        <path class="slash" d="M2 178 C 96 136, 178 104, 318 28" fill="none" stroke="#f5f0e6" stroke-width="8" stroke-linecap="round"/>
        <g fill="${ACCENT}" stroke="#000" stroke-width="4">
          <circle cx="168" cy="44" r="7"/><circle cx="126" cy="168" r="6"/>
          <circle cx="205" cy="30" r="4.5"/><circle cx="92" cy="150" r="4.5"/>
        </g>
      </g>`
  },
  {
    slug: "graufence",
    title: "Grau Battle",
    blurb: "Box in a low-poly arena. Throw punches with your gloves, block the incoming line, and slip with your hips — webcam or keyboard.",
    tags: ["Boxing", "Pose tracking", "1v1"],
    href: "https://graugames.github.io/graufence/",
    status: "live",
    tilt: 1.1,
    art: `
      <rect width="320" height="200" fill="${ACCENT}"/>
      <g class="l-back">
        <g opacity=".18">${bands("#000", 8, 11, 18, 26)}</g>
        ${burst(160, 100, 112, 78, 12, 'fill="#d1c8b7" stroke="#000" stroke-width="5"')}
      </g>
      <g class="l-mid">
        <g transform="translate(118 112) rotate(-22)">${GLOVE}</g>
        <g transform="translate(204 91) rotate(18) scale(.92)">${GLOVE.replaceAll('#58e7ff', '#ff5cc8')}</g>
      </g>
      <g class="l-fg" fill="${PAPER}" stroke="#000" stroke-width="4">
        <path d="M18 164 L112 122" stroke="#000" stroke-width="13" stroke-linecap="round"/>
        <path d="M18 164 L112 122" stroke="${PAPER}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="58" cy="44" r="8"/><circle cx="270" cy="158" r="10"/><circle cx="258" cy="38" r="5"/>
      </g>`
  }
];
