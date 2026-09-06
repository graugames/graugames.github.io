import { GAMES } from "./games.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;

/* ---------------- shelf ---------------- */

function card(g, i) {
  const live = g.status === "live";
  const featured = live && i === 0;
  const number = String(i + 1).padStart(2, "0");
  const tags = g.tags.map(t => `<li>${t}</li>`).join("");

  // A live card is one big link. A "soon" card has nowhere to go, so it is an
  // inert div rather than a disabled anchor — nothing to tab onto by mistake.
  const open = live
    ? `<a class="card${featured ? " is-featured" : ""}" href="${g.href}" aria-label="Play ${g.title}">`
    : `<div class="card is-soon" aria-disabled="true">`;
  const close = live ? `</a>` : `</div>`;

  return `
    <article class="slot${featured ? " slot--featured" : ""}" style="--tilt:${g.tilt}deg;--i:${i}">
      ${open}
        <div class="art art--${g.slug}">
          <svg class="art-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"
               role="img" aria-label="${g.title} cover art">${g.art}</svg>
          <span class="art-index">${number} / ${live ? "LIVE" : "NEXT"}</span>
        </div>
        <div class="body">
          <span class="card-kicker">${live ? "NOW PLAYING" : "ON THE WAY"}</span>
          <div class="title-row">
            <h3>${g.title}</h3>
            <span class="badge${live ? "" : " badge-soon"}">${live ? "PLAY" : "SOON"}</span>
          </div>
          <p>${g.blurb}</p>
          <div class="card-footer">
            <ul class="tags">${tags}</ul>
            <span class="launch">${live ? "ENTER GAME ↗" : "IN DEVELOPMENT"}</span>
          </div>
        </div>
      ${close}
    </article>`;
}

const shelf = document.getElementById("shelf");
shelf.innerHTML = GAMES.map(card).join("");
document.getElementById("liveCount").textContent = GAMES.filter(g => g.status === "live").length;
document.getElementById("soonCount").textContent = GAMES.filter(g => g.status !== "live").length;

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

/* ---------------- cursor signal ----------------
   Keep this marker locked to the real pointer. There is no easing loop, so
   it never trails behind the hand that is actually choosing a game. */
if (fine && !reduced) {
  const blob = document.getElementById("blob");

  addEventListener("pointermove", e => {
    blob.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  blob.hidden = false;
}
