// ============================================================
// Carnes Hildebrandt — Escena scroll-scrub bajo el hero
// ------------------------------------------------------------
// Una secuencia de 96 fotogramas (video real de un rib eye
// siendo sazonado, en cámara lenta) se "reproduce" hacia
// adelante y hacia atrás siguiendo el scroll del visitante,
// con frases que aparecen por fases. Sin librerías.
//
// Material: Pexels #3128759 (licencia Pexels, uso libre).
// ============================================================

(function () {
  "use strict";

  var FRAME_COUNT = 96;
  var DIR = "frames/steak/";
  var FOCAL_X = 0.5, FOCAL_Y = 0.45; // punto de interés al recortar

  var wrap = document.getElementById("experiencia");
  var canvas = document.getElementById("scene-canvas");
  if (!wrap || !canvas) return;

  var ctx = canvas.getContext("2d", { alpha: false });
  var loadEl = document.getElementById("scene-load");
  var hintEl = document.getElementById("scene-hint");
  var barEl = document.getElementById("scene-bar");
  var textEls = Array.prototype.slice.call(wrap.querySelectorAll(".scene-text"));
  var phases = textEls.map(function (el) {
    return { el: el, c: parseFloat(el.getAttribute("data-center")) };
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var imgs = new Array(FRAME_COUNT);
  var ready = new Array(FRAME_COUNT);
  var started = false;
  var firstDrawn = false;
  var lastFrame = -1;
  var needRedraw = true;
  var active = false;

  function frameSrc(i) {
    var n = String(i + 1);
    while (n.length < 3) n = "0" + n;
    return DIR + "f" + n + ".jpg";
  }

  // Orden de carga: primero un barrido grueso (cada 8) para que
  // el scrub funcione pronto, después se rellenan los huecos.
  function loadOrder() {
    var order = [], seen = {}, i;
    for (i = 0; i < FRAME_COUNT; i += 8) { order.push(i); seen[i] = 1; }
    if (!seen[FRAME_COUNT - 1]) { order.push(FRAME_COUNT - 1); seen[FRAME_COUNT - 1] = 1; }
    for (i = 0; i < FRAME_COUNT; i++) if (!seen[i]) order.push(i);
    return order;
  }

  function startLoad() {
    if (started) return;
    started = true;
    var queue = loadOrder();
    var inFlight = 0, MAX = 8;
    (function next() {
      while (inFlight < MAX && queue.length) {
        (function (i) {
          inFlight++;
          var im = new Image();
          im.onload = function () {
            ready[i] = true;
            inFlight--;
            if (!firstDrawn) { needRedraw = true; drawIfIdle(); }
            next();
          };
          im.onerror = function () { inFlight--; next(); };
          im.src = frameSrc(i);
          imgs[i] = im;
        })(queue.shift());
      }
    })();
  }

  function nearestReady(i) {
    if (ready[i]) return i;
    for (var d = 1; d < FRAME_COUNT; d++) {
      if (i - d >= 0 && ready[i - d]) return i - d;
      if (i + d < FRAME_COUNT && ready[i + d]) return i + d;
    }
    return -1;
  }

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (bw > 1680) { bh = Math.round(bh * 1680 / bw); bw = 1680; }
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw; canvas.height = bh;
      needRedraw = true;
    }
  }

  function draw(i) {
    var idx = nearestReady(i);
    if (idx < 0) return;
    var im = imgs[idx];
    var cw = canvas.width, ch = canvas.height;
    var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    var dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    var dx = (cw - dw) * FOCAL_X, dy = (ch - dh) * FOCAL_Y;
    ctx.drawImage(im, dx, dy, dw, dh);
    if (!firstDrawn) {
      firstDrawn = true;
      if (loadEl) loadEl.classList.add("hidden");
    }
    lastFrame = i;
    needRedraw = false;
  }

  function drawIfIdle() {
    if (!active) { sizeCanvas(); draw(Math.max(lastFrame, 0)); }
  }

  function progress() {
    var rect = wrap.getBoundingClientRect();
    var vh = window.innerHeight;
    var denom = rect.height - vh;
    if (denom <= 0) return 0;
    var p = -rect.top / denom;
    return p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  function updateOverlay(p) {
    for (var i = 0; i < phases.length; i++) {
      var ph = phases[i];
      var op;
      if (i === phases.length - 1 && p >= ph.c) {
        op = 1;
      } else {
        var d = Math.abs(p - ph.c);
        op = 1 - (d - 0.06) / 0.13;
        op = op < 0 ? 0 : (op > 1 ? 1 : op);
      }
      ph.el.style.opacity = op.toFixed(3);
      ph.el.style.transform = "translateY(" + ((1 - op) * 26 * (p < ph.c ? 1 : -1)).toFixed(1) + "px)";
      ph.el.style.pointerEvents = op > 0.5 ? "auto" : "none";
    }
    if (barEl) barEl.style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (hintEl) hintEl.style.opacity = Math.max(0, 1 - p / 0.08).toFixed(3);
  }

  function tick() {
    if (!active) return;
    sizeCanvas();
    var p = progress();
    var frame = Math.round(p * (FRAME_COUNT - 1));
    if (frame !== lastFrame || needRedraw) draw(frame);
    updateOverlay(p);
    requestAnimationFrame(tick);
  }

  // --- Modo estático (prefiere movimiento reducido) -----------
  if (reduceMotion) {
    wrap.classList.add("scene--static");
    if (hintEl) hintEl.style.display = "none";
    var mid = phases[1] || phases[0];
    if (mid) mid.el.classList.add("scene-static-show");
    startLoad();
    var paint = function () {
      sizeCanvas();
      draw(Math.round(FRAME_COUNT * 0.55));
    };
    window.addEventListener("resize", paint);
    var wait = setInterval(function () {
      if (nearestReady(Math.round(FRAME_COUNT * 0.55)) >= 0) { paint(); clearInterval(wait); }
    }, 120);
    return;
  }

  // --- Activación por cercanía ---------------------------------
  if ("IntersectionObserver" in window) {
    // Empieza a descargar fotogramas mucho antes de llegar
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { startLoad(); obs.disconnect(); }
    }, { rootMargin: "250% 0px" }).observe(wrap);

    // Anima solo mientras la sección está cerca del viewport
    new IntersectionObserver(function (entries) {
      var was = active;
      active = entries[0].isIntersecting;
      if (active && !was) requestAnimationFrame(tick);
    }, { rootMargin: "25% 0px" }).observe(wrap);
  } else {
    startLoad();
    active = true;
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", function () {
    needRedraw = true;
    drawIfIdle();
  });

  // Gancho de prueba: CHScene.seek(0..1) pinta un punto exacto
  // de la secuencia (útil para ajustar textos y tiempos).
  window.CHScene = {
    seek: function (p) {
      startLoad();
      active = false;
      p = Math.max(0, Math.min(1, p));
      sizeCanvas();
      draw(Math.round(p * (FRAME_COUNT - 1)));
      updateOverlay(p);
    }
  };
})();
