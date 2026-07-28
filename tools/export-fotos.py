#!/usr/bin/env python3
"""Build fotos/ (the web-sized set the site loads) from Photos/Edited/.

Every output is one edited photo resized to one of the shapes the site
uses and saved as a progressive JPEG. Most are cropped to that shape;
the FULL ones keep the photo's own proportion and stay whole.
"""
import os, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "Photos/Edited")
OUT = os.path.join(ROOT, "fotos")

SQ, PORT, WIDE, OG = (1, 860), (3 / 4, 760), (3 / 2, 1400), (16 / 9, 1900)

# Sin proporción fija: la foto sale entera, con la del archivo. Se usa
# donde la imagen tiene que verse completa y el hueco se adapta a ella,
# así no hay recorte ni franjas arriba o a los lados. El número sigue
# siendo el ancho de salida; los anclajes y el zoom se ignoran.
FULL_W, FULL_P = (None, 1400), (None, 900)

# out name -> (source photo, shape, anchor x, anchor y[, zoom])
# anchor 0 = left/top, 0.5 = centred, 1 = right/bottom
# zoom  1 = the biggest crop that fits, below 1 = tighter (and upscaled)
M = {
    # ---------- product cards & sheets: square, no crop needed ----------
    "sal-parrillera":            ("Products/sal-parrillera-frasco", SQ, .5, .5),
    "sal-parrillera-bolsa":      ("Products/sal-parrillera-bolsa", SQ, .5, .5),
    "sweet-bbq-rub":             ("Products/sweet-bbq-rub-frasco", SQ, .5, .5),
    "sweet-bbq-rub-bolsa":       ("Products/sweet-bbq-rub-bolsa", SQ, .5, .5),
    "brisket-rub":               ("Products/brisket-rub-frasco", SQ, .5, .5),
    "brisket-rub-bolsa":         ("Products/brisket-rub-bolsa", SQ, .5, .5),
    "sal-ahumada":               ("Products/sal-ahumada-frasco", SQ, .5, .5),
    "salt-pepper":               ("Products/salt-pepper-frasco", SQ, .5, .5),

    "yerba-verdeflor-menta":     ("Products/yerba-verdeflor-menta", SQ, .5, .5),
    "yerba-verdeflor-manzanilla": ("Products/yerba-verdeflor-manzanilla", SQ, .5, .5),
    "yerba-verdeflor-naranja":   ("Products/yerba-verdeflor-naranja", SQ, .5, .5),
    "yerba-verdeflor-serranas":  ("Products/yerba-verdeflor-serranas", SQ, .5, .5),
    "yerba-verdeflor-jengibre":  ("Products/yerba-verdeflor-jengibre", SQ, .5, .5),
    "yerba-campesino-clasica":   ("Products/yerba-campesino-clasica", SQ, .5, .5),
    "yerba-campesino-burrito":   ("Products/yerba-campesino-burrito", SQ, .5, .5),

    "cuchillo-bulledge-carnicero": ("Products/cuchillo-bulledge-carnicero", SQ, .5, .5),
    "cuchillo-bulledge-damasco":   ("Products/cuchillo-bulledge-carnicero-damasco", SQ, .5, .5),
    "cuchillo-bulledge-santoku":   ("Products/cuchillo-bulledge-santoku", SQ, .5, .5),
    "cuchillo-bulledge-hacha":     ("Products/cuchillo-bulledge-hacha", SQ, .5, .5),
    "cuchillo-bulledge-exhibidor": ("Display/display-cuchillos-bulledge", SQ, .5, .5),

    "mandil-cafe":        ("Products/mandil-cafe", SQ, .5, .5),
    "mandil-negro":       ("Products/mandil-negro", SQ, .5, .5),
    "mandil-negro-cafe":  ("Products/mandil-negro-cafe", SQ, .5, .5),
    "mandil-negro-camel": ("Products/mandil-negro-camel", SQ, .5, .5),
    "mandil-vino":        ("Products/mandil-vino", SQ, .5, .5),
    "mandil-camel":       ("Products/mandil-camel", SQ, .5, .5),
    "mandil-pelo-vaca":   ("Products/mandil-pelo-vaca", SQ, .5, .5),

    "mate-guampa-negro":     ("Products/mate-guampa-negro", SQ, .5, .5),
    "mate-guampa-gris":      ("Products/mate-guampa-gris", SQ, .5, .5),
    "mate-guampa-terracota": ("Products/mate-guampa-terracota", SQ, .5, .5),
    "mate-termico-negro":    ("Products/mate-termico-negro", SQ, .5, .5),
    "mate-termico-madera":   ("Products/mate-termico-madera", SQ, .5, .5),

    "molcajete":          ("Products/molcajete-redondo", SQ, .5, .5),
    "molcajete-cuadrado": ("Products/molcajete-cuadrado", SQ, .5, .5),
    "turbo-fan":          ("Products/turbo-fan-caja", SQ, .5, .5),
    "turbo-fan-player":   ("Products/turbo-fan-player", SQ, .5, .5),

    # ---------- the shop, portrait 3:4 (home strip, hero rotator) ----------
    "local-entrada":    ("Store/local-fachada-entrada", PORT, .62, .50),
    "local-vitrinas":   ("Store/local-vitrinas", PORT, .50, .55),
    "local-corte":      ("Store/local-mostrador-corte", PORT, 1.0, .45, .62),
    "local-mostrador":  ("Store/local-mostrador-corte", PORT, .00, .50),
    "local-cuchillos":  ("Store/local-cuchillos-salsas", PORT, .50, .33),
    "local-yerba":      ("Store/local-yerba", PORT, .50, .38),
    "local-sal":        ("Store/local-sazonadores", PORT, .50, .28),
    "local-tablas":     ("Store/local-tablas", PORT, .55, .50),
    "local-parrilla":   ("Store/local-parrilla", PORT, .45, .55),
    "local-caja":       ("Store/local-caja", PORT, .50, .50),
    "local-poster":     ("Store/local-poster-cortes", PORT, .47, .50),
    "local-angus":      ("Store/local-angus-rebanadora", PORT, .50, .00),
    "local-rebanadora": ("Store/local-angus-rebanadora", PORT, .50, .62, .80),

    # ---------- the shop, square: the meat sheets in the store ----------
    # Los cortes son los únicos productos cuya foto sale del local y no del
    # set de producto. En la ficha todas las fotos van en un cuadro 1:1, así
    # que estas necesitan su propio recorte cuadrado; con el 3:4 quedaban
    # dos franjas a los lados. Mismos anclajes que la versión vertical.
    "local-corte-sq":      ("Store/local-mostrador-corte", SQ, 1.0, .45, .62),
    "local-mostrador-sq":  ("Store/local-mostrador-corte", SQ, .00, .50),
    "local-poster-sq":     ("Store/local-poster-cortes", SQ, .47, .50),
    "local-vitrinas-sq":   ("Store/local-vitrinas", SQ, .50, .55),
    "local-angus-sq":      ("Store/local-angus-rebanadora", SQ, .50, .00),
    "local-rebanadora-sq": ("Store/local-angus-rebanadora", SQ, .50, .62, .80),

    # ---------- the shop, wide 3:2 (category tiles, page headers) ----------
    "local-sazon-w":      ("Store/local-sazonadores", WIDE, .50, .32),
    "local-salsas-w":     ("Store/local-cuchillos-salsas", WIDE, .50, .95),
    "local-yerba-w":      ("Store/local-yerba", WIDE, .50, .38),
    "local-cuchillos-w":  ("Store/local-tramontina", WIDE, .50, .50),
    "local-bulledge-w":   ("Display/display-cuchillos-bulledge", WIDE, .50, .50),
    "local-tablas-w":     ("Display/display-tablas-holz", WIDE, .50, .50),
    "local-parrilla-w":   ("Store/local-cuchilleria", WIDE, .50, .50),
    "local-carbon-w":     ("Store/local-parrilla", WIDE, .15, .75),
    "local-mostrador-w":  ("Store/local-mostrador-corte", WIDE, .20, .42),
    "local-corte-w":      ("Store/local-mostrador-corte", WIDE, 1.0, .45, .78),
    "local-rebanadora-w": ("Store/local-angus-rebanadora", WIDE, .50, .58),
    "local-angus-w":      ("Store/local-angus-rebanadora", WIDE, .50, .12),
    "local-vitrinas-w":   ("Store/local-vitrinas", WIDE, .50, .50),
    "local-caja-w":       ("Store/local-caja", WIDE, .50, .45),
    "local-poster-w":     ("Store/local-poster-cortes", WIDE, .50, .50),
    "local-entrada-w":    ("Store/local-fachada-entrada", WIDE, .55, .50),
    "local-fachada-w":    ("Store/local-fachada-lateral", WIDE, .50, .50),

    # ---------- enteras: la página de nosotros las muestra sin recortar ----
    # La aérea recortada a 3:2 perdía media playa de estacionamiento y el
    # tablero de valores a 3:4 se quedaba a media lista de valores.
    "local-aerea-full":   ("Store/local-aerea", FULL_W, .50, .50),
    "local-valores-full": ("Store/local-valores", FULL_P, .50, .50),

    # ---------- the storefront shot used as og:image, 16:9 ----------
    "local-fachada": ("Store/local-fachada-entrada", OG, .50, .50),
}


def crop_to(im, ratio, ax, ay, zoom=1.0):
    w, h = im.size
    if w / h > ratio:            # too wide -> trim the sides
        nw, nh = h * ratio, h
    else:                        # too tall -> trim top/bottom
        nw, nh = w, w / ratio
    nw, nh = int(round(nw * zoom)), int(round(nh * zoom))
    x = int(round((w - nw) * ax))
    y = int(round((h - nh) * ay))
    return im.crop((x, y, x + nw, y + nh))


if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

rows, total = [], 0
for name, spec in sorted(M.items()):
    rel, (ratio, width), ax, ay = spec[:4]
    zoom = spec[4] if len(spec) > 4 else 1.0
    src = os.path.join(SRC, rel + ".png")
    im = Image.open(src).convert("RGB")
    if ratio is None:
        ratio = im.width / im.height
    else:
        im = crop_to(im, ratio, ax, ay, zoom)
    scale = width / im.width
    im = im.resize((width, int(round(width / ratio))), Image.LANCZOS)
    dst = os.path.join(OUT, name + ".jpg")
    im.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
    kb = os.path.getsize(dst) // 1024
    total += kb
    rows.append((name, rel.split("/")[-1], "%dx%d" % im.size, "%.2fx" % scale, "%d KB" % kb))

for r in sorted(rows, key=lambda r: -float(r[3][:-1])):
    print("%-28s %-36s %-10s %-7s %s" % r)
print("\n%d files, %.1f MB total" % (len(rows), total / 1024))
