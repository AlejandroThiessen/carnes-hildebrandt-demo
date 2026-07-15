// ============================================================
// Carnes Hildebrandt — interacciones de la maqueta
// ============================================================

(function () {
  "use strict";

  // --- Enlaces viejos: el sitio antes era una sola página -----
  // Anclas guardadas (p. ej. /#tienda) llevan a su nueva página.
  var LEGACY = {
    nosotros: "nosotros.html",
    cortes: "cortes.html",
    wagyu: "cortes.html#wagyu",
    tienda: "tienda.html",
    pedidos: "envios.html",
    visitanos: "contacto.html"
  };
  if (document.body.getAttribute("data-page") === "inicio" && location.hash) {
    var legacyDest = LEGACY[location.hash.slice(1)];
    if (legacyDest) location.replace(legacyDest);
  }

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  // --- Header: fondo sólido al hacer scroll -----------------
  // (en la página 404 el header siempre lleva fondo sólido)
  var alwaysSolid = document.body.hasAttribute("data-header-solid");
  function onScroll() {
    header.classList.toggle("scrolled", alwaysSolid || window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Menú móvil --------------------------------------------
  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  // Cierra el menú al elegir una sección
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // --- Animaciones de entrada (reveal) -----------------------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- Año en el pie ------------------------------------------
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // --- Aviso de maqueta ---------------------------------------
  var ribbon = document.getElementById("demo-ribbon");
  var ribbonClose = document.getElementById("demo-ribbon-close");
  if (ribbon && ribbonClose) {
    ribbonClose.addEventListener("click", function () {
      ribbon.classList.add("hidden");
    });
  }
})();
