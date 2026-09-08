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

/* Covers for the one-page duel arcade. The individual entries still get
   their own card, route parameter, title, palette, and in-game UI. */
function duelArt(fill, bg, label, motif = "circle") {
  const subject = motif === "grid"
    ? `<path d="M24 32H296M24 68H296M24 104H296M24 140H296M24 176H296M56 18V182M104 18V182M152 18V182M200 18V182M248 18V182" stroke="#000" stroke-width="3" opacity=".35"/>`
    : motif === "bars"
      ? `<path d="M24 148V80M54 148V44M84 148V100M114 148V28M144 148V64M174 148V94M204 148V34M234 148V72M264 148V20" stroke="#000" stroke-width="16" stroke-linecap="square"/>`
      : `<circle cx="160" cy="100" r="72" fill="${bg}" stroke="#000" stroke-width="7"/>`;
  return `<rect width="320" height="200" fill="${fill}"/><g opacity=".18"><path d="M-20 180L140 -20M60 220L220 -20M140 220L300 -20" stroke="#000" stroke-width="18"/></g><g class="l-mid">${subject}</g><g class="l-fg"><text x="160" y="112" text-anchor="middle" fill="${ACCENT}" stroke="#000" stroke-width="5" paint-order="stroke" font-family="Arial Black,Impact,sans-serif" font-size="${label.length > 10 ? 25 : 32}" font-weight="900">${label}</text><path d="M28 174H292" stroke="#000" stroke-width="7"/><circle cx="36" cy="28" r="8" fill="${ACCENT}" stroke="#000" stroke-width="4"/><circle cx="286" cy="166" r="6" fill="${ACCENT}" stroke="#000" stroke-width="4"/></g>`;
}

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
  },
  {
    slug: "pong-duel", title: "Pong Duel",
    blurb: "The first classic remixed for two webcam paddles. Keep the ball alive and own the court.",
    tags: ["Pong", "1v1", "Camera"], href: "https://graugames.github.io/_duel/?game=pong", status: "live", tilt: -1.2,
    art: duelArt("#c9b8ff", "#17132d", "PONG", "bars")
  },
  {
    slug: "rope-snatch", title: "Rope Snatch",
    blurb: "A Cut the Rope-style candy race where your slice steals the drop from the other side.",
    tags: ["Slice", "Arcade", "1v1"], href: "https://graugames.github.io/_duel/?game=cut", status: "live", tilt: 1.4,
    art: duelArt("#ffb997", "#391b27", "ROPE", "circle")
  },
  {
    slug: "flappy-faceoff", title: "Flappy Face-Off",
    blurb: "A split-screen pipe race: flap on your half, miss one gap, and hand the win to your rival.",
    tags: ["Flappy", "Reflex", "1v1"], href: "https://graugames.github.io/_duel/?game=flappy", status: "live", tilt: -1.7,
    art: duelArt("#8bd8f1", "#12334a", "FLAP", "circle")
  },
  {
    slug: "lane-dash", title: "Lane Dash",
    blurb: "Subway-runner energy in a head-to-head lane switch. Dodge traffic and last longer.",
    tags: ["Runner", "Dodge", "Camera"], href: "https://graugames.github.io/_duel/?game=subway", status: "live", tilt: 1.1,
    art: duelArt("#f5d542", "#142b50", "DASH", "bars")
  },
  {
    slug: "bird-brawl", title: "Bird Brawl",
    blurb: "Load the Angry Birds-style sling, line up the piggies, and clear your side first.",
    tags: ["Aim", "Targets", "1v1"], href: "https://graugames.github.io/_duel/?game=angry", status: "live", tilt: -0.8,
    art: duelArt("#a7de9e", "#2a3b23", "BIRD", "circle")
  },
  {
    slug: "stack-attack", title: "Stack Attack",
    blurb: "Retro Tetris pressure with two boards. Clear lines faster and make the other player sweat.",
    tags: ["Tetris", "Retro", "Blocks"], href: "https://graugames.github.io/_duel/?game=tetris", status: "live", tilt: 1.8,
    art: duelArt("#727aa7", "#202438", "TETRIS", "grid")
  },
  {
    slug: "invader-duel", title: "Invader Duel",
    blurb: "Two ships, one fleet. Shoot your half of the Space Invaders formation before it reaches you.",
    tags: ["Shooter", "Retro", "1v1"], href: "https://graugames.github.io/_duel/?game=space", status: "live", tilt: -1.1,
    art: duelArt("#2a304c", "#090b16", "INVADERS", "grid")
  },
  {
    slug: "kart-clash", title: "Kart Clash",
    blurb: "Mario Kart-style split-screen sprinting with boosts, traffic, and a finish-line showdown.",
    tags: ["Racing", "Boost", "Arcade"], href: "https://graugames.github.io/_duel/?game=kart", status: "live", tilt: 1.5,
    art: duelArt("#a8c5ff", "#1d2a50", "KART", "bars")
  },
  {
    slug: "mole-mayhem", title: "Mole Mayhem",
    blurb: "Whack-a-Mole, but the golden targets are contested loot. React faster than your opponent.",
    tags: ["Reaction", "Targets", "Camera"], href: "https://graugames.github.io/_duel/?game=whack", status: "live", tilt: -1.9,
    art: duelArt("#b8e095", "#263b24", "WHACK", "circle")
  },
  {
    slug: "dot-duel", title: "Dot Duel",
    blurb: "A Pac-Man-inspired maze chomp where every dot counts and the ghosts do not play fair.",
    tags: ["Maze", "Chomp", "Retro"], href: "https://graugames.github.io/_duel/?game=pacman", status: "live", tilt: 1.3,
    art: duelArt("#252a5e", "#111533", "DOTS", "grid")
  },
  {
    slug: "doodle-drop", title: "Doodle Drop",
    blurb: "Doodle Jump-style vertical climbing with shared bragging rights and separate platforms.",
    tags: ["Jump", "Climb", "1v1"], href: "https://graugames.github.io/_duel/?game=doodle", status: "live", tilt: -1.4,
    art: duelArt("#9bdcff", "#203252", "DOODLE", "bars")
  },
  {
    slug: "crossy-clash", title: "Crossy Clash",
    blurb: "Crossy Road becomes a race: make five crossings, dodge cars, and do not become road paint.",
    tags: ["Runner", "Traffic", "Camera"], href: "https://graugames.github.io/_duel/?game=crossy", status: "live", tilt: 1.7,
    art: duelArt("#b5d39a", "#213b2b", "CROSS", "bars")
  },
  {
    slug: "stack-it", title: "Stack It",
    blurb: "The simple Stack timing game gets a second tower. Perfect drops build a lead.",
    tags: ["Timing", "Stack", "Arcade"], href: "https://graugames.github.io/_duel/?game=stack", status: "live", tilt: -0.7,
    art: duelArt("#ff7764", "#301b29", "STACK", "bars")
  },
  {
    slug: "geometry-rush", title: "Geometry Rush",
    blurb: "A Geometry Dash-style one-button runner. Jump the spikes and keep the beat alive.",
    tags: ["Runner", "Jump", "Retro"], href: "https://graugames.github.io/_duel/?game=geometry", status: "live", tilt: 1.0,
    art: duelArt("#202c42", "#101828", "RUSH", "grid")
  },
  {
    slug: "helix-fall", title: "Helix Fall",
    blurb: "Rotate around the Helix Jump gaps and drop deeper than the other player.",
    tags: ["Drop", "Timing", "1v1"], href: "https://graugames.github.io/_duel/?game=helix", status: "live", tilt: -1.6,
    art: duelArt("#8e5b9c", "#31204a", "HELIX", "circle")
  },
  {
    slug: "bomber-duel", title: "Bomber Duel",
    blurb: "Bomberman rules in a tiny grid: plant a bomb, find cover, and trap the other player.",
    tags: ["Grid", "Bombs", "1v1"], href: "https://graugames.github.io/_duel/?game=bomber", status: "live", tilt: 1.6,
    art: duelArt("#ef9c77", "#241724", "BOMB", "grid")
  },
  {
    slug: "four-in-a-row", title: "Four in a Row",
    blurb: "Connect Four, rebuilt for rapid-fire keyboard drops and two very competitive columns.",
    tags: ["Board", "Strategy", "Classic"], href: "https://graugames.github.io/_duel/?game=connect", status: "live", tilt: -1.0,
    art: duelArt("#79b9ed", "#13284d", "FOUR", "grid")
  },
  {
    slug: "brawl-shots", title: "Brawl Shots",
    blurb: "A tiny Brawl Stars-style arena: aim with your hand, dodge sideways, and land five hits.",
    tags: ["Shooter", "Arena", "Camera"], href: "https://graugames.github.io/_duel/?game=brawl", status: "live", tilt: 1.2,
    art: duelArt("#ffae47", "#271d3b", "BRAWL", "circle")
  },
  {
    slug: "party-mix", title: "Party Mix",
    blurb: "A Mario Party-style microgame mix: match targets, react fast, and win seven rounds.",
    tags: ["Minigames", "Party", "Camera"], href: "https://graugames.github.io/_duel/?game=party", status: "live", tilt: -1.5,
    art: duelArt("#f18fd0", "#321641", "PARTY", "circle")
  },
  {
    slug: "fight-night", title: "Fight Night",
    blurb: "Street Fighter-inspired footwork, blocks, and punches with webcam-ready two-player controls.",
    tags: ["Fighter", "Combat", "1v1"], href: "https://graugames.github.io/_duel/?game=street", status: "live", tilt: 1.4,
    art: duelArt("#343545", "#171821", "FIGHT", "bars")
  }
];
