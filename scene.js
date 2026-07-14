// ============================================================
// Carnes Hildebrandt — Escena cinemática bajo el hero
// ------------------------------------------------------------
// Un video real (rib eye sazonado en cámara lenta) se reproduce
// solo, en bucle y sin sonido; tres frases aparecen sincronizadas
// con el momento del video. Sin librerías.
//
// Material: Pexels #3128759 (licencia Pexels, uso libre).
// ============================================================

(function () {
  "use strict";

  var RATE = 0.8; // un toque extra de cámara lenta

  var wrap = document.getElementById("experiencia");
  var video = document.getElementById("scene-video");
  if (!wrap || !video) return;

  var barEl = document.getElementById("scene-bar");
  var textEls = Array.prototype.slice.call(wrap.querySelectorAll(".scene-text"));
  var phases = textEls.map(function (el) {
    return { el: el, c: parseFloat(el.getAttribute("data-center")) };
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var running = false;

  video.muted = true; // por si el atributo se pierde al manipular el DOM
  video.defaultPlaybackRate = RATE;
  video.playbackRate = RATE;

  function updateOverlay(p) {
    for (var i = 0; i < phases.length; i++) {
      var d = Math.abs(p - phases[i].c);
      var op = 1 - (d - 0.07) / 0.14;
      op = op < 0 ? 0 : (op > 1 ? 1 : op);
      phases[i].el.style.opacity = op.toFixed(3);
      phases[i].el.style.transform = "translateY(" + ((1 - op) * 22 * (p < phases[i].c ? 1 : -1)).toFixed(1) + "px)";
      phases[i].el.style.pointerEvents = op > 0.5 ? "auto" : "none";
    }
    if (barEl) barEl.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  function tick() {
    if (!running) return;
    var p = video.duration ? video.currentTime / video.duration : 0;
    updateOverlay(p);
    requestAnimationFrame(tick);
  }

  // --- Movimiento reducido: fotograma fijo + texto estático ----
  if (reduceMotion) {
    wrap.classList.add("scene--static");
    video.removeAttribute("autoplay");
    video.preload = "none";
    video.pause();
    // Sin reproducción, el elemento muestra el póster de su
    // background CSS: un fotograma fijo, sin descargar el video.
    var mid = phases[1] || phases[0];
    if (mid) mid.el.classList.add("scene-static-show");
    return;
  }

  // --- Reproduce solo mientras la sección está a la vista ------
  function play() {
    video.playbackRate = RATE;
    var pr = video.play();
    if (pr && pr.catch) pr.catch(function () { /* autoplay bloqueado: queda el póster */ });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function pause() {
    video.pause();
    running = false;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) play();
      else pause();
    }, { rootMargin: "10% 0px" }).observe(wrap);
  } else {
    play();
  }

  // Gancho de prueba: CHScene.seek(0..1) salta a un punto del
  // video (útil para ajustar los tiempos de los textos).
  window.CHScene = {
    seek: function (p) {
      p = Math.max(0, Math.min(1, p));
      pause();
      var apply = function () {
        video.currentTime = p * video.duration;
        updateOverlay(p);
      };
      if (video.duration) apply();
      else video.addEventListener("loadedmetadata", apply, { once: true });
    },
    play: play
  };
})();
