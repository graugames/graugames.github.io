# graugames.github.io

The landing page for [Grau Games](https://graugames.github.io) — a shelf of small
browser games that run instantly, with no install and no signup.

This repo is **only the shelf**. Each game lives in its own repo under the
`graugames` org and is published from that repo's own GitHub Pages build, so a
broken game can never take the front page down with it.

```
graugames.github.io/            <- this repo (the shelf)
graugames.github.io/grau-ninja/ <- repo: graugames/grau-ninja
```

## Files

| file | what it is |
| --- | --- |
| `games.js` | **the shelf** — the game list and each game's cover art. The only file you edit to add a game. |
| `main.js` | renders the cards and wires up the pointer effects |
| `styles.css` | the whole design system |
| `index.html` | markup shell |
| `404.html` | not-found page, same styling |

There is no build step. Pages serves these files exactly as they are.

## Adding a game

1. Push the game to a new repo under the `graugames` org, with an `index.html`
   at the repo root and an empty `.nojekyll` file beside it.
2. In that repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
   It will come up at `https://graugames.github.io/<repo-name>/`.
3. Append one entry to the `GAMES` array in `games.js`:

   ```js
   {
     slug:  "repo-name",
     title: "Display Name",
     blurb: "One sentence on what the player actually does.",
     tags:  ["Genre", "Notable thing"],
     href:  "https://graugames.github.io/repo-name/",
     status: "live",     // or "soon"
     tilt:  -1.6,        // degrees the card sits at on the shelf
     art: `...`          // inline SVG, see below
   }
   ```

4. Commit and push.

`status: "soon"` renders a card that is inert — no link, not tabbable, and it
does not press under the cursor, because pressing is a promise of clickability.
Leave `href` off entirely for those.

## Cover art

`art` is inline SVG drawn on a **320 × 200** canvas. No image files, so a card
costs nothing to load and stays sharp at any size. Two helpers in `games.js`
save you writing coordinates by hand:

- `burst(cx, cy, rOuter, rInner, points, attrs)` — a spiky starburst
- `bands(fill, count, width, gap, angle)` — evenly spaced diagonal stripes

Group your shapes into three layers and they parallax against the cursor for
free, back to front:

```html
<g class="l-back">...</g>   <!-- moves against the cursor, slowly -->
<g class="l-mid">...</g>    <!-- the subject -->
<g class="l-fg">...</g>     <!-- moves most -->
```

**Watch out:** a CSS `transform` on an SVG element *replaces* its `transform`
attribute rather than composing with it. Anything you animate from CSS must
therefore have its resting position declared in CSS too, in full — see
`.melon-a` / `.sword-a` in `styles.css`. Leave it in the SVG attribute only and
the element will snap to the origin the moment it animates.

## Look and feel

Neobrutalist, and deliberately unrelated to any individual game's art direction:
flat saturated colour, 4px black outlines, hard *unblurred* offset shadows,
everything sitting at a slight angle. Hovering a live card slides it into its own
shadow. Keep new additions inside that vocabulary — no gradients on chrome, no
soft shadows, no rounded corners.

The page is also deliberately bare: wordmark, then games. No tagline, no section
heading, no marquee, no per-card source button, no footer — the games are the
content. Resist adding chrome back.

Every animation is disabled under `prefers-reduced-motion`, and the cursor blob
and card parallax never even attach their listeners on a device without a
cursor. Preserve both when editing.

## Local preview

Plain HTML, CSS and ES modules, so any static server works — but it does need to
be a server, since ES modules will not load over `file://`:

```bash
python -m http.server 8000
```

## Game repo requirements

Games must be **fully static** — no server, no build step at request time.
Anything needing a backend does not belong on Pages. Paths inside a game must be
relative (`./src/main.js`, not `/src/main.js`), because the game is served from a
subdirectory rather than the domain root.
