// ============================================================
// Carnes Hildebrandt — Capa de efectos y movimiento
// ------------------------------------------------------------
// Acompaña a fx.css. Todo lo de aquí es decorativo: si este
// archivo no carga, el sitio sigue completo y se puede comprar
// igual. Nada se dibuja desde aquí que sea contenido esencial,
// salvo la calculadora de parrillada, que avisa por sí sola
// cuando no hay JavaScript.
//
// Se respeta "prefers-reduced-motion": con esa preferencia
// activa todo queda visible pero quieto.
// ============================================================

(function () {
  "use strict";

  var CALM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOUSE = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var doc = document;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  // Un solo IntersectionObserver para todo lo que entra en pantalla.
  // Además de lo que entra, se descubre lo que ya quedó ARRIBA de la
  // pantalla: si alguien recarga a media página o llega con un enlace
  // con ancla, ese contenido nunca "entraría" y se quedaría invisible.
  var pending = [];

  function show(el) {
    el.classList.add("fx-in");
    if (seen) seen.unobserve(el);
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
  }

  var seen = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) show(e.target);
        });
      }, { threshold: .15, rootMargin: "0px 0px -60px 0px" })
    : null;

  function watch(el) {
    if (!seen) { el.classList.add("fx-in"); return; }
    pending.push(el);
    seen.observe(el);
  }

  // Repaso manual: nada se queda escondido tras un salto de scroll
  var sweeps = [];
  function sweep() {
    var vh = window.innerHeight;
    pending.slice().forEach(function (el) {
      if (el.getBoundingClientRect().top < vh - 40) show(el);
    });
    sweeps.slice().forEach(function (fn) { fn(vh); });
  }
  window.addEventListener("load", sweep);
  window.addEventListener("hashchange", sweep);

  // ==========================================================
  // 1 · CORTINA DE BIENVENIDA (una vez por sesión)
  // ==========================================================
  (function preload() {
    if (CALM) return;
    try { if (sessionStorage.getItem("ch_intro")) return; } catch (e) { return; }

    var el = doc.createElement("div");
    el.className = "fx-preload";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="fx-pl-panel fx-pl-top"></div>' +
      '<div class="fx-pl-panel fx-pl-bot"></div>' +
      '<div class="fx-pl-mark">' +
        '<svg viewBox="0 0 24 24"><path d="M3 5h12v9H6a3 3 0 0 1-3-3V5z"/><circle cx="6.3" cy="7.3" r="1.05"/><rect x="15.6" y="6.1" width="6.4" height="2.7" rx="1.35"/></svg>' +
        '<span class="fx-pl-name">Carnes Hildebrandt</span>' +
        '<span class="fx-pl-bar"><i></i></span>' +
      "</div>";

    doc.documentElement.classList.add("fx-loading");
    (doc.body || doc.documentElement).appendChild(el);
    try { sessionStorage.setItem("ch_intro", "1"); } catch (e) { /* modo privado */ }

    requestAnimationFrame(function () { el.classList.add("fill"); });

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      el.classList.add("done");
      doc.documentElement.classList.remove("fx-loading");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }
    // Se va cuando la página está lista, pero nunca tarda más de 1.8 s
    setTimeout(finish, doc.readyState === "complete" ? 700 : 1000);
    setTimeout(finish, 1800);
  })();

  // ==========================================================
  // 2 · BARRA DE PROGRESO DE LECTURA
  // ==========================================================
  var progress = doc.createElement("div");
  progress.className = "fx-progress";
  progress.setAttribute("aria-hidden", "true");
  doc.body.appendChild(progress);

  // ==========================================================
  // 3 · TÍTULOS PALABRA POR PALABRA
  // ----------------------------------------------------------
  // Se respeta el marcado interno (<em>, <br>) recorriendo los
  // nodos en lugar de reescribir el HTML.
  // ==========================================================
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          // Se parte solo en espacios "normales": el &nbsp; mantiene
          // unidas las palabras que no deben separarse.
          n.nodeValue.split(/([ \t\n\r]+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^[ \t\n\r]+$/.test(tok)) { frag.appendChild(doc.createTextNode(tok)); return; }
            var outer = doc.createElement("span");
            outer.className = "fx-w";
            var inner = doc.createElement("span");
            inner.className = "fx-wi";
            inner.textContent = tok;
            inner.style.transitionDelay = (i * 42) + "ms";
            i++;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains("fx-w")) {
          walk(n);
        }
      });
    })(el);
  }

  $$("main h1, main h2").forEach(function (h) {
    if (!h.textContent.trim()) return;
    h.classList.remove("reveal", "delay-1", "delay-2", "delay-3");
    h.classList.add("fx-split");
    if (!CALM) splitWords(h);
    watch(h);
  });

  // La rayita del "eyebrow" se dibuja al entrar
  $$(".eyebrow").forEach(function (e) {
    e.classList.remove("reveal", "delay-1", "delay-2");
    e.classList.add("fx-split-eyebrow");
    watch(e);
  });

  // ==========================================================
  // 4 · ENTRADAS ESCALONADAS
  // ----------------------------------------------------------
  // Las rejillas entraban en bloque; ahora sus piezas entran una
  // tras otra. Se le quita el .reveal al contenedor para que no
  // haya dos animaciones peleando.
  // ==========================================================
  // `.walk-grid` sí entra aquí. Mientras fue una tira que se deslizaba
  // de lado no podía: el `translateY` de entrada le agregaba juego
  // vertical al contenedor y, al deslizar rápido en el celular, se veía
  // un hueco en blanco mientras cada foto terminaba de aparecer. Ya
  // como mosaico quieto, las fotos entran escalonadas como las demás.
  var GRIDS = ".cat-tiles, .store-grid, .cards-grid, .quote-grid, .steps, .perks, " +
              ".brands-grid, .social-grid, .badges-grid, .timeline, .feature-list, " +
              ".footer-links, .walk-grid";

  $$(GRIDS).forEach(function (grid) {
    grid.classList.remove("reveal", "delay-1", "delay-2");
    Array.prototype.slice.call(grid.children).forEach(function (child, i) {
      child.classList.remove("reveal", "delay-1", "delay-2", "delay-3");
      child.classList.add("fx-stag");
      child.style.transitionDelay = (i * 75) + "ms";
      watch(child);
    });
  });

  // Cortinilla en las fotos con marco: la foto sube desde abajo
  // dentro de un envoltorio que recorta.
  //
  // El recorte va en el envoltorio y NO en el .frame a propósito: un
  // elemento recortado a cero deja de "verse" para IntersectionObserver
  // y nunca se enteraría de que le toca aparecer. Además así el marco
  // decorativo (.frame::after) puede seguir sobresaliendo y el zoom de
  // entrada no ensancha la página.
  $$(".frame").forEach(function (f) {
    var im = f.querySelector(":scope > img");
    if (!im) return;
    f.classList.remove("reveal", "delay-1");
    var box = doc.createElement("span");
    box.className = "fx-clip";
    im.parentNode.insertBefore(box, im);
    box.appendChild(im);
    watch(f);
  });

  // El mapa y la tabla entran con el mismo desvanecido que las rejillas
  $$(".map-frame, .table-wrap").forEach(function (f) {
    f.classList.remove("reveal", "delay-1");
    f.classList.add("fx-stag");
    watch(f);
  });

  // ==========================================================
  // 5 · PARALAJE
  // ==========================================================
  var parY = [], parX = [], parVar = [];
  function par(sel, factor, axis) {
    $$(sel).forEach(function (el) {
      (axis === "x" ? parX : axis === "var" ? parVar : parY).push({ el: el, f: factor });
    });
  }
  if (!CALM) {
    par(".hero-stack", .07);
    par(".cta-band-word", .22, "x");
    par(".wagyu-word", -.18, "x");
    // Las fotos de las categorías se mueven dentro de su mosaico. Va por
    // variable CSS y no por transform para no pisar el zoom del hover.
    par(".cat-tile img", .07, "var");
  }

  // ==========================================================
  // 6 · HERO — la foto principal se va turnando
  // ==========================================================
  (function heroStack() {
    var stack = $("#hero-stack");
    if (!stack) return;
    var imgs = $$("img", stack);
    if (imgs.length < 2) return;
    var n = 0;
    setInterval(function () {
      if (doc.hidden) return;
      imgs[n].classList.remove("is-on");
      n = (n + 1) % imgs.length;
      imgs[n].classList.add("is-on");
    }, CALM ? 9000 : 5200);
  })();

  // ==========================================================
  // 7 · CURSOR (aro que sigue al ratón, solo en escritorio)
  // ==========================================================
  var cursor = null, cx = 0, cy = 0, tx = 0, ty = 0;
  if (MOUSE && !CALM) {
    cursor = doc.createElement("div");
    cursor.className = "fx-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="fx-cursor-label"></span>';
    doc.body.appendChild(cursor);
    var cLabel = $(".fx-cursor-label", cursor);

    var HOT = "a, button, .p-card, .cat-tile, .card, input, select, summary, label, .calc-chip";
    doc.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("on");
      var hot = e.target.closest ? e.target.closest(HOT) : null;
      cursor.classList.toggle("hot", !!hot);
      cLabel.textContent = hot && (hot.classList.contains("p-card") || hot.classList.contains("cat-tile")) ? "Ver" : "";
    }, { passive: true });
    doc.addEventListener("pointerdown", function () { cursor.classList.add("press"); });
    doc.addEventListener("pointerup", function () { cursor.classList.remove("press"); });
    doc.addEventListener("mouseleave", function () { cursor.classList.remove("on"); });
  }

  // ==========================================================
  // 8 · TARJETAS: inclinación 3D + destello que sigue al ratón
  // ----------------------------------------------------------
  // Va por delegación porque la tienda vuelve a dibujar sus
  // tarjetas cada vez que se filtra o se busca.
  // ==========================================================
  var TILT = ".p-card, .cat-tile, .card, .brand-card, .social-card";
  var tilted = null;

  if (MOUSE && !CALM) {
    doc.addEventListener("pointermove", function (e) {
      var card = e.target.closest ? e.target.closest(TILT) : null;
      if (card !== tilted && tilted) {
        tilted.style.transform = "";
        tilted = null;
      }
      if (!card) return;
      tilted = card;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100) + "%");
      card.style.setProperty("--my", (py * 100) + "%");
      card.style.transform =
        "perspective(900px) rotateX(" + ((.5 - py) * 7).toFixed(2) + "deg) rotateY(" +
        ((px - .5) * 9).toFixed(2) + "deg) translateY(-6px) scale(1.012)";
    }, { passive: true });

    doc.addEventListener("mouseleave", function () {
      if (tilted) { tilted.style.transform = ""; tilted = null; }
    });
  }

  // ==========================================================
  // 9 · BOTONES IMANTADOS
  // ----------------------------------------------------------
  // El botón se estira un poco hacia el puntero cuando pasa
  // cerca y regresa a su sitio al salir.
  // ==========================================================
  if (MOUSE && !CALM) {
    var magnet = null;
    doc.addEventListener("pointermove", function (e) {
      var btn = e.target.closest ? e.target.closest(".btn, .p-add, .nav-cta") : null;
      if (magnet && magnet !== btn) {
        magnet.classList.remove("fx-mag");
        magnet.style.transform = "";
        magnet = null;
      }
      if (!btn) return;
      magnet = btn;
      btn.classList.add("fx-mag");
      var r = btn.getBoundingClientRect();
      btn.style.transform =
        "translate(" + ((e.clientX - (r.left + r.width / 2)) * .2).toFixed(1) + "px," +
        ((e.clientY - (r.top + r.height / 2)) * .28 - 2).toFixed(1) + "px)";
    }, { passive: true });
  }

  // ==========================================================
  // 10 · BRASAS EN LA BANDA ROJA
  // ==========================================================
  (function embers() {
    var band = $(".cta-band");
    if (!band || CALM) return;

    var canvas = doc.createElement("canvas");
    canvas.className = "fx-embers";
    canvas.setAttribute("aria-hidden", "true");
    band.insertBefore(canvas, band.firstChild);

    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, live = false, parts = [];

    function size() {
      w = band.offsetWidth; h = band.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spark(fresh) {
      return {
        x: Math.random() * w,
        y: fresh ? Math.random() * h : h + 10,
        r: 1 + Math.random() * 2.4,
        vy: .25 + Math.random() * .85,
        drift: (Math.random() - .5) * .5,
        phase: Math.random() * 6.3,
        life: 0,
        max: 160 + Math.random() * 200
      };
    }

    function frame() {
      if (!live) return;
      requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.life++;
        p.y -= p.vy;
        p.phase += .03;
        p.x += p.drift + Math.sin(p.phase) * .45;
        if (p.life > p.max || p.y < -10) { parts[i] = spark(false); continue; }
        var t = p.life / p.max;
        var a = Math.sin(Math.PI * t) * .85;
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, "rgba(255,236,196," + a.toFixed(3) + ")");
        g.addColorStop(.35, "rgba(255,168,74," + (a * .55).toFixed(3) + ")");
        g.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, 6.2832);
        ctx.fill();
      }
    }

    size();
    parts = [];
    var count = clamp(Math.round(w / 16), 26, 80);
    for (var i = 0; i < count; i++) parts.push(spark(true));

    window.addEventListener("resize", size, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !live) { live = true; frame(); } else if (!vis) { live = false; }
      }, { threshold: 0 }).observe(band);
    } else { live = true; frame(); }
  })();

  // ==========================================================
  // 11 · CONTADORES
  // ==========================================================
  function tween(from, to, ms, step, end) {
    var t0 = performance.now();
    (function run(now) {
      var k = clamp((now - t0) / ms, 0, 1);
      var e = 1 - Math.pow(1 - k, 3);         // desaceleración suave
      step(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(run); else if (end) end();
    })(t0);
  }

  $$("[data-count]").forEach(function (el) {
    var to = parseFloat(el.getAttribute("data-count"));
    if (isNaN(to)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var done = false;

    function run(instant) {
      if (done) return;
      done = true;
      if (instant) { el.textContent = to + suffix; return; }
      tween(0, to, 1500, function (v) { el.textContent = Math.round(v) + suffix; });
    }
    if (CALM || !seen) { run(true); return; }

    el.textContent = "0" + suffix;
    var one = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { one.disconnect(); run(false); }
      else if (en[0].boundingClientRect.bottom < 0) { one.disconnect(); run(true); }
    }, { threshold: .5 });
    one.observe(el);

    // Una cifra en cero sería un dato falso: si el contador nunca se
    // cruza (saltos de scroll), se muestra igual.
    sweeps.push(function (vh) {
      if (done) return;
      if (el.getBoundingClientRect().top < vh) { one.disconnect(); run(false); }
    });
  });

  // ==========================================================
  // 12 · LISTÓN DE CORTES REACTIVO AL SCROLL
  // ==========================================================
  var marquee = (function () {
    var m = $(".marquee");
    if (!m || CALM) return null;
    var track = $(".marquee-track", m);
    if (!track) return null;
    m.classList.add("fx-js");
    var state = { x: 0, boost: 0, hover: 1, half: 0 };
    function measure() { state.half = track.offsetWidth / 2; }
    measure();
    window.addEventListener("resize", measure, { passive: true });
    m.addEventListener("mouseenter", function () { state.hover = .18; });
    m.addEventListener("mouseleave", function () { state.hover = 1; });
    state.track = track;
    return state;
  })();

  // ==========================================================
  // 13 · UN SOLO BUCLE DE ANIMACIÓN
  // ==========================================================
  var lastY = window.scrollY || 0;
  var vel = 0;

  function loop() {
    requestAnimationFrame(loop);

    var y = window.scrollY || window.pageYOffset || 0;
    vel = vel * .88 + (y - lastY) * .12;
    lastY = y;

    // Barra de progreso
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";

    // Cursor
    if (cursor) {
      cx += (tx - cx) * .22;
      cy += (ty - cy) * .22;
      cursor.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
    }

    // Paralaje
    var vh = window.innerHeight;
    var i, p, r, off;
    for (i = 0; i < parY.length; i++) {
      p = parY[i];
      r = p.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      off = (r.top + r.height / 2 - vh / 2) * p.f;
      p.el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
    }
    for (i = 0; i < parX.length; i++) {
      p = parX[i];
      r = p.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      // Con topes: la palabra gigante se mueve, pero no se escapa
      off = clamp((r.top + r.height / 2 - vh / 2) * p.f, -140, 140);
      p.el.style.transform = "translate(calc(-50% + " + off.toFixed(1) + "px), " +
        (p.el.classList.contains("cta-band-word") ? "-50%" : "0") + ")";
    }
    for (i = 0; i < parVar.length; i++) {
      p = parVar[i];
      r = p.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      off = clamp((r.top + r.height / 2 - vh / 2) * p.f, -14, 14);
      p.el.style.setProperty("--py", off.toFixed(1) + "px");
    }

    // Listón: velocidad base + empujón del scroll
    if (marquee && marquee.half) {
      marquee.x -= (.55 * marquee.hover) + vel * .35;
      if (marquee.x <= -marquee.half) marquee.x += marquee.half;
      if (marquee.x > 0) marquee.x -= marquee.half;
      marquee.track.style.transform = "translate3d(" + marquee.x.toFixed(1) + "px,0,0)";
    }
  }
  requestAnimationFrame(loop);

  // ==========================================================
  // 14 · AVISO FLOTANTE (toast)
  // ==========================================================
  // En celular el aviso tapaba media tarjeta: el nombre largo lo partía
  // en dos renglones y con el borde de 999px salía un óvalo de 350×67.
  // Por eso cada aviso trae dos redacciones —`text` y `brief`— y el CSS
  // elige; en pantalla chica también dura menos, porque la tarjeta ya
  // dice "✓ Agregado" y la foto vuela al carrito.
  var NARROW = window.matchMedia ? window.matchMedia("(max-width: 640px)") : null;
  var toast = null, toastTimer = null;

  function say(o) {
    if (!toast) {
      toast = doc.createElement("div");
      toast.className = "fx-toast";
      toast.setAttribute("role", "status");
      doc.body.appendChild(toast);
    }
    toast.innerHTML = '<span class="tk">✓</span>' +
      '<span class="tt">' + o.text + "</span>" +
      '<span class="tb">' + (o.brief || o.text) + "</span>" +
      (o.action
        ? '<button type="button"><span class="al">' + o.action + "</span>" +
          '<span class="ab">' + (o.actionBrief || o.action) + "</span></button>"
        : "");
    var btn = $("button", toast);
    if (btn) {
      btn.addEventListener("click", function () {
        if (window.CHStore) window.CHStore.open();
        hideToast();
      });
    }
    requestAnimationFrame(function () { toast.classList.add("on"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, NARROW && NARROW.matches ? 2600 : 4200);
  }
  function hideToast() {
    if (toast) toast.classList.remove("on");
  }

  // ==========================================================
  // 15 · LA FOTO VUELA AL CARRITO
  // ==========================================================
  var cartBtn = $("#cart-btn");

  function flyToCart(fromEl) {
    if (!cartBtn) return;
    cartBtn.classList.remove("jolt");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("jolt");
    if (CALM || !fromEl || !fromEl.src || !fromEl.animate) return;

    var a = fromEl.getBoundingClientRect();
    var b = cartBtn.getBoundingClientRect();
    var ghost = doc.createElement("img");
    ghost.src = fromEl.src;
    ghost.alt = "";
    ghost.className = "fx-fly";
    ghost.style.left = a.left + "px";
    ghost.style.top = a.top + "px";
    ghost.style.width = a.width + "px";
    ghost.style.height = a.height + "px";
    doc.body.appendChild(ghost);

    var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    var dy = (b.top + b.height / 2) - (a.top + a.height / 2);

    ghost.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1, borderRadius: "10px" },
      { transform: "translate(" + (dx * .45) + "px," + (dy * .45 - 90) + "px) scale(.55) rotate(-9deg)",
        opacity: .95, offset: .55 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.06) rotate(6deg)", opacity: .2, borderRadius: "50%" }
    ], { duration: 850, easing: "cubic-bezier(.5,0,.6,1)" }).onfinish = function () {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    };
  }

  // El botón "Agregar", venga de una tarjeta o de la ficha de producto.
  // En captura (tercer argumento) porque store.js cierra la ficha al
  // agregar: si esperáramos al burbujeo, la foto que debe volar ya no
  // estaría en pantalla.
  doc.addEventListener("click", function (e) {
    var add = e.target.closest ? e.target.closest(".p-add") : null;
    if (!add) return;
    var card = add.closest(".p-card");
    var sheet = add.closest(".pv");
    var src = card ? $("img", card) : (sheet ? $("#pv-img") : null);
    var name = card ? $("h3", card) : (sheet ? $("#pv-title") : null);
    var qty = card ? $(".qs-value", card) : (sheet ? $(".qs-value", sheet) : null);
    if (!card && !sheet) return;
    flyToCart(src);
    say({
      text: "<b>" + (name ? name.textContent : "Producto") + "</b>" +
            (qty ? " · " + qty.textContent : "") + " en tu pedido",
      brief: "<b>Agregado</b>" + (qty ? " · " + qty.textContent : ""),
      action: "Ver carrito",
      actionBrief: "Ver"
    });
  }, true);

  // --- Barra de la tienda pegada bajo el encabezado ------------
  (function stickyToolbar() {
    var bar = $(".store-toolbar");
    if (!bar) return;
    bar.classList.add("is-sticky");
    window.addEventListener("scroll", function () {
      bar.classList.toggle("stuck", bar.getBoundingClientRect().top <= 63);
    }, { passive: true });
  })();

  // ==========================================================
  // 16 · CALCULADORA DE PARRILLADA
  // ----------------------------------------------------------
  // La sección existe en el HTML solo como contenedor vacío; si
  // este archivo no carga, ahí queda el aviso de respaldo.
  // ==========================================================
  (function grillCalc() {
    var host = $("#grill-calc");
    if (!host || !window.CHStore || !window.CHStore.products) return;

    var money = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", maximumFractionDigits: 0
    });
    var byId = window.CHStore.byId;

    // kg de carne por persona
    var HUNGER = [
      ["ligero", "Van ligeros", .28],
      ["normal", "Buen diente", .38],
      ["bestia", "Nivel concurso", .55]
    ];

    // Cada estilo reparte el peso total entre cortes (que hoy se piden
    // en el mostrador, por eso son texto y no productos) y sugiere los
    // sazonadores que sí se pueden pedir en línea.
    //
    // `items` SOLO puede traer ids que existan en PRODUCTS: los que no
    // existen se caen en silencio y el carrito sugerido sale vacío. El
    // carbón y la leña vivían aquí y salieron del catálogo al quedarse
    // sin foto de estudio; en cuanto se fotografíen, basta con volver a
    // ponerlos en estas listas (PER8 ya les calcula las bolsas).
    var STYLES = [
      ["norteno", "Clásico norteño",
        { cortes: [["Arrachera", .4], ["Rib eye", .3], ["Costilla de cerdo", .3]],
          items: ["sal-parrillera", "sweet-bbq-rub"] },
        "Fuego de dos zonas y sal de grano. La arrachera al final, cuando ya todos están alrededor del asador."],
      ["premium", "Noche premium",
        { cortes: [["Rib eye", .45], ["New York", .35], ["Wagyu", .2]],
          items: ["salt-pepper", "sal-parrillera"] },
        "Cortes gruesos (3–4 cm), término medio rojo y 6 minutos de reposo. El Wagyu, rebanado delgado para compartir al final."],
      ["ahumado", "Low &amp; slow",
        { cortes: [["Brisket", .6], ["Costillar de cerdo", .4]],
          items: ["brisket-rub", "sweet-bbq-rub", "sal-ahumada"] },
        "Calcula 1 hora de ahumado por cada 500 g de brisket a 110 °C. Empieza temprano — y ten paciencia con la meseta."],
      ["mixto", "De todo un poco",
        { cortes: [["Rib eye", .3], ["Arrachera", .25], ["Costilla de cerdo", .25], ["Chuleta de cerdo", .2]],
          items: ["sal-parrillera", "sweet-bbq-rub", "salt-pepper"] },
        "La apuesta segura cuando hay niños, abuelos y cuñados con opiniones. Empieza por el cerdo y cierra con la res."]
    ];

    // Consumibles que se piden por número de comensales, no de a uno.
    // Hoy ninguno está en el catálogo; la regla se queda lista para el
    // carbón, que es el caso para el que se escribió.
    var PER8 = ["carbon"];

    var people = 8, hunger = 1, style = 0, lastKg = 0, lastTotal = 0;

    host.innerHTML =
      '<div class="calc">' +
        '<div class="calc-controls">' +
          '<div class="calc-field">' +
            '<label for="calc-people">¿Cuántos van a comer?</label>' +
            '<div class="calc-people"><strong id="calc-people-n">8</strong> <span>personas</span></div>' +
            '<input class="calc-range" type="range" id="calc-people" min="2" max="30" step="1" value="8">' +
          "</div>" +
          '<div class="calc-field">' +
            '<span class="calc-legend" id="calc-hunger-l">Qué tan parrilleros son</span>' +
            '<div class="calc-chips" id="calc-hunger" role="group" aria-labelledby="calc-hunger-l">' +
              HUNGER.map(function (h, i) {
                return '<button type="button" class="calc-chip' + (i === hunger ? " on" : "") +
                  '" data-i="' + i + '" aria-pressed="' + (i === hunger) + '">' + h[1] + "</button>";
              }).join("") +
            "</div>" +
          "</div>" +
          '<div class="calc-field">' +
            '<span class="calc-legend" id="calc-style-l">Estilo del asado</span>' +
            '<div class="calc-chips" id="calc-style" role="group" aria-labelledby="calc-style-l">' +
              STYLES.map(function (s, i) {
                return '<button type="button" class="calc-chip' + (i === style ? " on" : "") +
                  '" data-i="' + i + '" aria-pressed="' + (i === style) + '">' + s[1] + "</button>";
              }).join("") +
            "</div>" +
          "</div>" +
          '<p class="calc-tip" id="calc-tip"></p>' +
        "</div>" +
        '<div class="calc-out">' +
          '<div class="calc-kg"><strong id="calc-kg">0</strong> <span>kg de carne, aproximadamente</span></div>' +
          '<p class="calc-sub">La lista para el mostrador</p>' +
          '<ul class="calc-list calc-cuts" id="calc-cuts"></ul>' +
          '<a class="calc-wa" id="calc-wa" href="#" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.8 8.4c-.3.9-.1 2.1.9 3.4 1 1.3 2.2 2.2 3.6 2.6.6.2 1.3-.1 1.6-.7l.3-.6-1.9-1-.7.7c-.8-.4-1.5-1-2-1.8l.6-.8-1.2-1.8-.6.2c-.3.1-.5.4-.6.8z" fill="currentColor" stroke="none"/></svg>' +
            "Apartar los cortes por WhatsApp</a>" +
          '<p class="calc-sub">Y esto sí lo pides en línea</p>' +
          '<ul class="calc-list" id="calc-list"></ul>' +
          '<div class="calc-total"><span>Tu carrito quedaría en</span><b id="calc-total">$0</b></div>' +
          '<button type="button" class="btn btn-solid" id="calc-add">Agregar todo al carrito</button>' +
          '<p class="calc-fine">Cálculo orientativo con precios de demostración: sobre 380 g de carne por persona ' +
          'para un diente normal. La carne todavía se despacha en el mostrador — nosotros la pesamos y ' +
          'confirmamos el total por WhatsApp.</p>' +
        "</div>" +
      "</div>";

    var elPeople = $("#calc-people", host);
    var elPeopleN = $("#calc-people-n", host);
    var elKg = $("#calc-kg", host);
    var elCuts = $("#calc-cuts", host);
    var elWa = $("#calc-wa", host);
    var elList = $("#calc-list", host);
    var elTotal = $("#calc-total", host);
    var elTip = $("#calc-tip", host);

    function kgText(q) { return (q % 1 === 0 ? q : q.toFixed(1)) + " kg"; }

    // Convierte la mezcla del estilo elegido en cantidades reales.
    // `cuts` son los cortes (se apartan por WhatsApp) y `rows` lo que
    // sí entra al carrito hoy: los sazonadores de la casa.
    function basket() {
      var kg = people * HUNGER[hunger][2];
      var mix = STYLES[style][2];

      var cuts = mix.cortes.map(function (m) {
        return { name: m[0], qty: clamp(Math.round(kg * m[1] * 2) / 2, .5, 40) };
      });

      var rows = [];
      mix.items.forEach(function (id) {
        var p = byId(id);
        if (!p || p.soon) return;
        // De lo que se consume por comensal sale una bolsa por cada ocho; de lo demás, una
        var q = PER8.indexOf(id) > -1 ? clamp(Math.ceil(people / 8), 1, 4) : 1;
        rows.push({ p: p, qty: q, total: p.price * q });
      });

      return { kg: kg, cuts: cuts, rows: rows };
    }

    function qtyText(row) {
      if (row.p.unit === "kg") return kgText(row.qty);
      return row.qty === 1 ? "1 pieza" : row.qty + " piezas";
    }

    function render(animate) {
      var b = basket();
      var total = 0;

      elCuts.innerHTML = b.cuts.map(function (c, i) {
        return '<li style="animation-delay:' + (i * 55) + 'ms"><span><b>' + c.name +
          "</b> <em>" + kgText(c.qty) + "</em></span><i>mostrador</i></li>";
      }).join("");

      var msg = "Hola Carnes Hildebrandt 👋\nSomos " + people + " personas para un asado " +
        STYLES[style][1].replace("&amp;", "&").toLowerCase() + ". La calculadora del sitio me sugiere:\n\n" +
        b.cuts.map(function (c) { return "• " + c.name + " — " + kgText(c.qty); }).join("\n") +
        "\n\n¿Me lo apartan?";
      elWa.href = window.CHStore.wa ? window.CHStore.wa(msg) :
        "https://wa.me/526251507388?text=" + encodeURIComponent(msg);

      elList.innerHTML = b.rows.map(function (r, i) {
        total += r.total;
        return '<li style="animation-delay:' + (i * 55) + 'ms"><span><b>' + r.p.name +
          "</b> <em>" + qtyText(r) + "</em></span><i>" + money.format(r.total) + "</i></li>";
      }).join("");
      elTip.innerHTML = "<strong>Consejo del carnicero:</strong> " + STYLES[style][3];

      if (CALM || !animate) {
        elKg.textContent = b.kg.toFixed(1);
        elTotal.textContent = money.format(total);
      } else {
        tween(lastKg, b.kg, 500, function (v) { elKg.textContent = v.toFixed(1); });
        tween(lastTotal, total, 500, function (v) { elTotal.textContent = money.format(v); });
      }
      lastKg = b.kg;
      lastTotal = total;
    }

    function fill() {
      elPeople.style.setProperty("--fill",
        ((people - elPeople.min) / (elPeople.max - elPeople.min) * 100) + "%");
    }

    elPeople.addEventListener("input", function () {
      people = parseInt(elPeople.value, 10) || 2;
      elPeopleN.textContent = people;
      fill();
      render(true);
    });

    function chips(id, set) {
      $(id, host).addEventListener("click", function (e) {
        var b = e.target.closest(".calc-chip");
        if (!b) return;
        $$(".calc-chip", this).forEach(function (o) {
          o.classList.toggle("on", o === b);
          o.setAttribute("aria-pressed", o === b);
        });
        set(parseInt(b.getAttribute("data-i"), 10));
        render(true);
      });
    }
    chips("#calc-hunger", function (i) { hunger = i; });
    chips("#calc-style", function (i) { style = i; });

    $("#calc-add", host).addEventListener("click", function () {
      var b = basket();
      b.rows.forEach(function (r) { window.CHStore.add(r.p.id, r.qty); });
      flyToCart(null);
      say({
        text: "<b>" + b.rows.length + " productos</b> para " + people + " personas en tu pedido",
        brief: "<b>" + b.rows.length + " productos</b> agregados",
        action: "Ver carrito",
        actionBrief: "Ver"
      });
      window.CHStore.open();
    });

    // El botón de WhatsApp es un enlace normal: solo se le pone el
    // mensaje al vuelo en cada render.

    fill();
    render(false);
  })();
})();
