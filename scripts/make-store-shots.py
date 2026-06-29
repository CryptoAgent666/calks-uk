#!/usr/bin/env python3
"""Generate App Store promo screenshots: brand background + headline caption +
the app screen as a rounded card with a soft shadow.

iPhone 6.5"/6.7" → 1284x2778   |   iPad 13" → 2048x2732
Run: python3 scripts/make-store-shots.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IPHONE = os.path.join(ROOT, "app-store-assets", "screenshots-ios")  # 1320x2868 app-mode caps
OUT_IPHONE = os.path.join(ROOT, "app-store-assets", "store-iphone-6.5")
OUT_IPAD   = os.path.join(ROOT, "app-store-assets", "store-ipad-13")
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
NAVY = (0x1e, 0x3a, 0x5f)
NAVY2 = (0x0f, 0x1f, 0x36)
WHITE = (255, 255, 255)

def gradient(w, h):
    col = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / (h - 1)
        col.putpixel((0, y), tuple(int(NAVY[i] + (NAVY2[i] - NAVY[i]) * t) for i in range(3)))
    return col.resize((w, h)).convert("RGBA")

def rounded(im, rad):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0]-1, im.size[1]-1], radius=rad, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out

def shadow(size, rad, blur, alpha=150):
    w, h = size
    pad = blur * 3
    sh = Image.new("RGBA", (w + pad*2, h + pad*2), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([pad, pad, pad+w-1, pad+h-1], radius=rad, fill=(0, 0, 0, alpha))
    return sh.filter(ImageFilter.GaussianBlur(blur)), pad

def caption(canvas, lines, font_size, top):
    d = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(FONT, font_size)
    W = canvas.size[0]
    asc, desc = font.getmetrics()
    lh = int((asc + desc) * 1.06)
    for i, line in enumerate(lines):
        b = d.textbbox((0, 0), line, font=font)
        x = (W - (b[2]-b[0])) // 2 - b[0]
        d.text((x, top + i*lh), line, font=font, fill=WHITE)

def make(out, screen, lines, size, font_size, cap_top, scr_w_frac, scr_top, rad):
    W, H = size
    canvas = gradient(W, H)
    caption(canvas, lines, font_size, cap_top)
    src = Image.open(screen).convert("RGB")
    sw = int(W * scr_w_frac)
    sh = int(sw * src.size[1] / src.size[0])
    src = rounded(src.resize((sw, sh), Image.LANCZOS), rad)
    shimg, pad = shadow((sw, sh), rad, 38, 150)
    x = (W - sw) // 2
    canvas.alpha_composite(shimg, (x - pad, scr_top - pad + 14))
    canvas.alpha_composite(src, (x, scr_top))
    canvas.convert("RGB").save(out)
    print("✓", os.path.relpath(out, ROOT), f"{W}x{H}")

os.makedirs(OUT_IPHONE, exist_ok=True)
os.makedirs(OUT_IPAD, exist_ok=True)

IPH = (1284, 2778)
iphone = [
    ("01-home.png",         ["331 UK calculators", "in your pocket"]),
    ("02-income-tax.png",   ["Income Tax,", "sorted for 2026/27"]),
    ("03-take-home-pay.png",["Know your real", "take-home pay"]),
    ("04-stamp-duty.png",   ["Stamp Duty", "in seconds"]),
    ("05-dark-mode.png",    ["Stunning in", "dark mode"]),
]
for fn, lines in iphone:
    make(os.path.join(OUT_IPHONE, fn), os.path.join(SRC_IPHONE, fn), lines,
         IPH, 96, 132, 0.82, 470, 46)

# iPhone 6.9" (1320x2868) — same promo style, same source caps + captions
OUT_IPHONE69 = os.path.join(ROOT, "app-store-assets", "store-iphone-6.9")
os.makedirs(OUT_IPHONE69, exist_ok=True)
IPH69 = (1320, 2868)
for fn, lines in iphone:
    make(os.path.join(OUT_IPHONE69, fn), os.path.join(SRC_IPHONE, fn), lines,
         IPH69, 98, 140, 0.80, 500, 46)

IPD = (2048, 2732)
ipad = [
    ("01-home.png",        "/tmp/ipad-01-home.png",        ["331 UK calculators, offline"]),
    ("02-income-tax.png",  "/tmp/ipad-02-income-tax.png",  ["Income Tax for 2026/27"]),
    ("03-take-home-pay.png","/tmp/ipad-03-take-home.png",  ["Your real take-home pay"]),
]
for fn, src, lines in ipad:
    if not os.path.exists(src):
        print("skip ipad (no source, re-capture needed):", src)
        continue
    make(os.path.join(OUT_IPAD, fn), src, lines, IPD, 118, 150, 0.80, 480, 40)

print("done")
