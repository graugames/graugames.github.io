"""Render og.png, the 1200x630 social preview card.

Run from the repo root:  python tools/make-og.py

Regenerate this whenever the wordmark changes. The output is committed, since
GitHub Pages has no build step to produce it on deploy.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
PAGE = (255, 212, 0)
GRID = (242, 200, 0)
CARD = (255, 253, 245)
INK = (0, 0, 0)

ROOT = Path(__file__).resolve().parent.parent

# Archivo Black is a webfont and will not be installed locally; Arial Black is
# the first fallback in the site's own font stack, so the render matches what a
# visitor without the webfont already sees.
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\ariblk.ttf",
    "/Library/Fonts/Arial Black.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    raise SystemExit("No heavy display font found; add one to FONT_CANDIDATES.")


def main():
    img = Image.new("RGB", (W, H), PAGE)
    d = ImageDraw.Draw(img)

    # graph paper, matching the 44px grid in styles.css
    for x in range(0, W, 44):
        d.rectangle([x, 0, x + 1, H], fill=GRID)
    for y in range(0, H, 44):
        d.rectangle([0, y, W, y + 1], fill=GRID)

    # Size the wordmark to the canvas rather than guessing: measure at a known
    # size, then scale so the block lands at ~78% of the width.
    probe = load_font(100)
    probe_w = d.textlength("GRAUGAMES", font=probe)
    size = int(100 * (W * 0.72) / probe_w)
    font = load_font(size)

    grau_w = d.textlength("GRAU", font=font)
    games_w = d.textlength("GAMES", font=font)
    text_w = grau_w + games_w
    asc, desc = font.getmetrics()
    text_h = asc + desc

    pad_x, pad_y = int(size * 0.26), int(size * 0.16)
    bw, bh = int(text_w + pad_x * 2), int(text_h + pad_y * 2)

    # Build the block on its own transparent layer so it can be rotated with
    # its hard shadow intact, the way the CSS does it.
    pad = 90
    layer = Image.new("RGBA", (bw + pad * 2, bh + pad * 2), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ox = oy = pad
    shadow = 18
    border = 8

    ld.rectangle([ox + shadow, oy + shadow, ox + bw + shadow, oy + bh + shadow], fill=INK)
    ld.rectangle([ox, oy, ox + bw, oy + bh], fill=CARD, outline=INK, width=border)

    tx, ty = ox + pad_x, oy + pad_y
    ld.text((tx, ty), "GRAU", font=font, fill=INK)
    # the second word is knocked out, stroked in ink — same as -webkit-text-stroke
    ld.text((tx + grau_w, ty), "GAMES", font=font, fill=CARD,
            stroke_width=max(3, size // 42), stroke_fill=INK)

    layer = layer.rotate(2, resample=Image.BICUBIC, expand=True)
    img.paste(layer, ((W - layer.width) // 2, (H - layer.height) // 2), layer)

    out = ROOT / "og.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
