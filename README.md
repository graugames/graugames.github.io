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

## Adding a game

1. Push the game to a new repo under the `graugames` org, with an `index.html`
   at the repo root and an empty `.nojekyll` file beside it.
2. In that repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
   It will come up at `https://graugames.github.io/<repo-name>/`.
3. Append one entry to the `GAMES` array near the bottom of `index.html`:

   ```js
   {
     title: "Display Name",
     blurb: "One sentence on what the player actually does.",
     tags:  ["Genre", "Notable thing"],
     href:  "https://graugames.github.io/repo-name/",
     status: "live",     // or "soon"
     color: "#ff5c39",   // flat block colour behind the cover art
     emoji: "🍉",
     tilt:  -1.6         // degrees the card sits at on the shelf
   }
   ```

4. Commit and push. There is no build step — Pages serves these files as-is.

`status: "soon"` renders a hatched, unclickable card with a blinking SOON
badge — the way to put a game on the shelf before it is ready to play. Leave
`href` off entirely for those.

## Look and feel

Neobrutalist, and deliberately unrelated to any individual game's art
direction: flat saturated colour, 4px black outlines, hard *unblurred* offset
shadows, everything sitting at a slight angle. Hovering a card slides it into
its own shadow. Keep new additions inside that vocabulary — no gradients on
chrome, no soft shadows.

The page is also deliberately bare: wordmark, games, footer. No tagline, no
section heading, no marquee, no per-card source button — the games are the
content. Resist adding chrome back.

Every animation is disabled under `prefers-reduced-motion`, and the cursor blob
also turns itself off on touch devices. Preserve both when editing.

## Local preview

Any static server works, since the page is plain HTML and CSS:

```bash
python -m http.server 8000
```

## Game repo requirements

Games must be **fully static** — no server, no build step at request time.
Anything needing a backend does not belong on Pages. Paths inside a game must be
relative (`./src/main.js`, not `/src/main.js`), because the game is served from a
subdirectory rather than the domain root.
