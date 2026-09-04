import { GAMES } from "./games.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;

/* ---------------- shelf ---------------- */

function card(g, i) {
  const live = g.status === "live";
  const tags = g.tags.map(t => `<li>${t}</li>`).join("");

  // A live card is one big link. A "soon" card has nowhere to go, so it is an
  // inert div rather than a disabled anchor — nothing to tab onto by mistake.
  const open = live
    ? `<a class="card" href="${g.href}" aria-label="Play ${g.title}">`
    : `<div class="card is-soon" aria-disabled="true">`;
  const close = live ? `</a>` : `</div>`;

  return `
    <article class="slot" style="--tilt:${g.tilt}deg;--i:${i}">
      ${open}
        <span class="art art--${g.slug}">
          <svg class="art-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"
               role="img" aria-label="${g.title} cover art">${g.art}</svg>
        </span>
        <span class="body">
          <span class="title-row">
            <h3>${g.title}</h3>
            <span class="badge${live ? "" : " badge-soon"}">${live ? "PLAY" : "SOON"}</span>
          </span>
          <p>${g.blurb}</p>
          <ul class="tags">${tags}</ul>
        </span>
      ${close}
    </article>`;
}

const shelf = document.getElementById("shelf");
shelf.innerHTML = GAMES.map(card).join("");

/* ---------------- pointer parallax ----------------
   Each card reports where the cursor is inside it as two -1..1 numbers.
   The art layers read those from CSS custom properties and shift by
   different amounts, so the cover art gains depth without a library and
   without a per-frame layout read. Pointer-coarse and reduced-motion
   users never get listeners attached at all. */
if (fine && !reduced) {
  for (const el of shelf.querySelectorAll(".card")) {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    }, { passive: true });

    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--px", 0);
      el.style.setProperty("--py", 0);
    }, { passive: true });
  }
}

/* ---------------- cursor blob ----------------
   Eased toward the pointer each frame so it trails rather than snaps.
   The loop only ever starts on a device that has a cursor to follow. */
if (fine && !reduced) {
  const blob = document.getElementById("blob");
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty;

  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

  (function frame() {
    x += (tx - x) * 0.06;
    y += (ty - y) * 0.06;
    blob.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(frame);
  })();

  blob.hidden = false;
}
