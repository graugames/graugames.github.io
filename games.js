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

/* Half a watermelon, flat side up, centred on its own origin. Rind, pith
   and flesh are separate rings so the cut face reads as a cut face. */
const MELON = `
  <path d="M-58 0A58 58 0 0 0 58 0Z" fill="#39b54a" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-47 0A47 47 0 0 0 47 0Z" fill="#f6f1df" stroke="#000" stroke-width="5"/>
  <path d="M-39 0A39 39 0 0 0 39 0Z" fill="#ff2e63" stroke="#000" stroke-width="5"/>
  <g fill="#000">
    <circle cx="-18" cy="12" r="3.6"/><circle cx="3" cy="18" r="3.6"/>
    <circle cx="21" cy="9" r="3.6"/><circle cx="-3" cy="30" r="3.6"/>
  </g>`;

const SWORD = `
  <path d="M-10-66 L0-84 L10-66 L10 6 L-10 6Z" fill="#e8ecf6" stroke="#000" stroke-width="6" stroke-linejoin="round"/>
  <path d="M0-76 L0 2" stroke="#000" stroke-width="3" opacity=".3"/>
  <rect x="-31" y="5" width="62" height="15" rx="3" fill="#ffd400" stroke="#000" stroke-width="6"/>
  <rect x="-9" y="20" width="18" height="35" fill="#8b4a1f" stroke="#000" stroke-width="6"/>
  <circle cx="0" cy="61" r="11" fill="#ffd400" stroke="#000" stroke-width="6"/>`;

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
      <rect width="320" height="200" fill="#ff5c39"/>
      <g class="l-back">
        ${bands("#ec4726", 7, 13, 24, -24)}
      </g>
      <g class="l-mid">
        <g class="melon-a">${MELON}</g>
        <g class="melon-b">${MELON}</g>
      </g>
      <g class="l-fg">
        <path class="slash slash-bg" d="M2 178 C 96 136, 178 104, 318 28" fill="none" stroke="#000" stroke-width="17" stroke-linecap="round"/>
        <path class="slash" d="M2 178 C 96 136, 178 104, 318 28" fill="none" stroke="#fffdf5" stroke-width="8" stroke-linecap="round"/>
        <g fill="#ff2e63" stroke="#000" stroke-width="4">
          <circle cx="168" cy="44" r="7"/><circle cx="126" cy="168" r="6"/>
          <circle cx="205" cy="30" r="4.5"/><circle cx="92" cy="150" r="4.5"/>
        </g>
      </g>`
  },
  {
    slug: "graufence",
    title: "GrauFence",
    blurb: "Duel with a virtual blade. Your webcam tracks your stance and sword hand, or switch to keyboard controls for a fast practice round.",
    tags: ["Pose tracking", "1v1", "Webcam"],
    href: "https://graugames.github.io/graufence/",
    status: "live",
    tilt: 1.1,
    art: `
      <rect width="320" height="200" fill="#5b7cfa"/>
      <g class="l-back">
        ${bands("#4968d8", 8, 11, 18, 26)}
        ${burst(160, 100, 112, 78, 12, 'fill="#ffd400" stroke="#000" stroke-width="5"')}
      </g>
      <g class="l-mid">
        <g class="sword-a">${SWORD}</g>
        <g class="sword-b">${SWORD}</g>
      </g>
      <g class="l-fg" fill="#fffdf5" stroke="#000" stroke-width="4">
        <path d="M18 164 L112 122" stroke="#000" stroke-width="13" stroke-linecap="round"/>
        <path d="M18 164 L112 122" stroke="#fffdf5" stroke-width="6" stroke-linecap="round"/>
        <circle cx="58" cy="44" r="8"/><circle cx="270" cy="158" r="10"/><circle cx="258" cy="38" r="5"/>
      </g>`
  },
  {
    slug: "grau-battle",
    title: "Grau Battle",
    blurb: "In the workshop. Details land here once it is playable.",
    tags: ["Coming soon"],
    status: "soon",
    tilt: 1.4,
    art: `
      <rect width="320" height="200" fill="#5b7cfa"/>
      <g class="l-back">
        ${burst(160, 100, 120, 74, 16, 'fill="#fffdf5" stroke="#000" stroke-width="5"')}
        ${burst(160, 100, 72, 45, 16, 'fill="#ffd400" stroke="#000" stroke-width="5"')}
      </g>
      <g class="l-mid">
        <g class="sword-a">${SWORD}</g>
        <g class="sword-b">${SWORD}</g>
      </g>
      <g class="l-fg" fill="#fffdf5" stroke="#000" stroke-width="4">
        <circle cx="52" cy="38" r="8"/><circle cx="272" cy="156" r="10"/><circle cx="262" cy="42" r="6"/>
      </g>`
  }
];
