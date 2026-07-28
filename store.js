// ============================================================
// Carnes Hildebrandt — Tienda en línea (maqueta)
// ------------------------------------------------------------
// Carrito 100% en el navegador + "checkout" por WhatsApp:
// el pedido llega itemizado al WhatsApp del negocio, sin
// plataformas ni comisiones de por medio.
//
// La tienda arranca con lo que se empaca y se envía fácil —
// sazonadores de la casa, yerba y tereré, cuchillería, mandiles
// y mesa. La carne lleva `soon: true`: aparece con su ficha y su
// foto, pero manda a WhatsApp en vez de al carrito, hasta que
// estén resueltos empaque y envío en frío.
//
// AQUÍ SOLO ENTRA LO QUE TIENE FOTO DE ESTUDIO. Lo demás (yerbas
// CBSé/Amanda/Kurupí/Playadito, Tramontina, tablas HOLZ, carbón,
// Lodge, kits) se vende en el mostrador y está listado a mano en
// "También en el mostrador", al final de tienda.html. Cuando se
// fotografíe algo, súbelo aquí y bórralo de esa lista.
//
// PRECIOS de demostración: edita la lista PRODUCTS de abajo.
// ============================================================

(function () {
  "use strict";

  var WA_NUMBER = "526251507388"; // confirmado: viene impreso en el frasco

  function f(name) { return "fotos/" + name + ".jpg"; }

  // --- Catálogo ----------------------------------------------
  // unit: "kg" se vende por peso (pasos de 0.5 kg)
  //       "pieza" se vende por unidad
  //
  // Campos de la ficha (la ventana de detalle):
  //   desc  — qué es el producto
  //   cook  — cómo se usa (la etiqueta cambia según la categoría, ver TIPS)
  //   imgs  — OPCIONAL: varias fotos; la ficha saca sola la tira de
  //           miniaturas. Sin este campo usa `img`.
  //   from  — OPCIONAL: el precio es "desde" (varía por modelo/tamaño)
  //   soon  — OPCIONAL: todavía no se vende en línea. La tarjeta sale
  //           marcada "Próximamente" y manda a WhatsApp en vez de al
  //           carrito. Es lo que hoy pasa con la carne: se despacha en
  //           el mostrador mientras resolvemos empaque y envío en frío.
  var PRODUCTS = [
    // ================= SAZONADORES DE LA CASA =================
    { id: "sal-parrillera", name: "Sal Parrillera", cat: "sazon", price: 195, unit: "pieza", approx: "frasco 420 g",
      img: f("sal-parrillera"), imgs: [f("sal-parrillera"), f("sal-parrillera-bolsa")],
      alt: "Frasco de Sal Parrillera de Carnes Hildebrandt",
      desc: "El primer sazonador de la casa. Isaac y Abram empezaron a buscarlo a mediados de 2020: querían una sal pensada para carne de res y salieron meses después con esta mezcla de sal Himalaya, pimienta molida, chile cascabel, ajo y especias. Se elabora artesanalmente aquí, en los campos menonitas de Cuauhtémoc.",
      cook: "Espolvorea parejo unos 20 minutos antes del fuego, para que la sal alcance a trabajar la superficie del corte. También la tenemos en bolsa de recarga de 1.5 kg." },

    { id: "sal-parrillera-bolsa", name: "Sal Parrillera — recarga 1.5 kg", cat: "sazon", price: 690, unit: "pieza", approx: "bolsa 1.5 kg",
      img: f("sal-parrillera-bolsa"), imgs: [f("sal-parrillera-bolsa"), f("sal-parrillera")],
      alt: "Bolsa de recarga de 1.5 kg de Sal Parrillera",
      desc: "La misma Sal Parrillera del frasco, en bolsa de 1.5 kg. Para quien ya no quiere quedarse a media parrillada — o para quien cocina para mucha gente.",
      cook: "Rellena el frasco y guarda la bolsa cerrada, en seco y lejos del calor de la estufa." },

    { id: "sweet-bbq-rub", name: "Sweet BBQ Rub", cat: "sazon", price: 210, unit: "pieza", approx: "frasco 370 g",
      img: f("sweet-bbq-rub"), imgs: [f("sweet-bbq-rub"), f("sweet-bbq-rub-bolsa")],
      alt: "Frasco de Sweet BBQ Rub de Carnes Hildebrandt",
      desc: "Después de unos años con la Sal Parrillera, David quiso un rub enfocado en cerdo: el sabor de unas sweet baby back ribs o de unas alitas. Salió el pork rub que hoy se llama Sweet BBQ Rub — dulce, adictivo y con poca sal, así que es difícil pasarse de sazón.",
      cook: "Cubre la pieza sin miedo y déjala tomar color en calor indirecto. Como lleva azúcar, barniza y sella al final para que no se queme." },

    { id: "sweet-bbq-rub-bolsa", name: "Sweet BBQ Rub — recarga 1.35 kg", cat: "sazon", price: 720, unit: "pieza", approx: "bolsa 1.35 kg",
      img: f("sweet-bbq-rub-bolsa"), imgs: [f("sweet-bbq-rub-bolsa"), f("sweet-bbq-rub")],
      alt: "Bolsa de recarga de 1.35 kg de Sweet BBQ Rub",
      desc: "El Sweet BBQ Rub en bolsa de 1.35 kg, para ahumadas largas y para quien ya lo adoptó como sazonador de diario.",
      cook: "Rellena el frasco y guarda la bolsa cerrada, en seco y lejos del calor." },

    { id: "brisket-rub", name: "Brisket Rub", cat: "sazon", price: 210, unit: "pieza", approx: "frasco",
      img: f("brisket-rub"), imgs: [f("brisket-rub"), f("brisket-rub-bolsa")],
      alt: "Frasco de Brisket Rub de Carnes Hildebrandt",
      desc: "El tercero de la familia, hecho para las piezas que pasan horas en el ahumador. Grano grueso, mucha pimienta y el perfil clásico de Texas — sal y pimienta bien puestas, sin tapar el sabor de la carne.",
      cook: "Cubre el brisket la noche anterior y déjalo en frío. Al día siguiente, ahumador a 110 °C y paciencia con la meseta de temperatura." },

    { id: "brisket-rub-bolsa", name: "Brisket Rub — bolsa de recarga", cat: "sazon", price: 720, unit: "pieza", approx: "bolsa",
      img: f("brisket-rub-bolsa"), imgs: [f("brisket-rub-bolsa"), f("brisket-rub")],
      alt: "Bolsa de recarga de Brisket Rub",
      desc: "Brisket Rub en bolsa de recarga. Un brisket entero se lleva buena parte de un frasco, así que esta es la presentación de quien ahúma en serio.",
      cook: "Rellena el frasco y guarda la bolsa cerrada, en seco y lejos del calor." },

    { id: "sal-ahumada", name: "Sal Ahumada", cat: "sazon", price: 185, unit: "pieza", approx: "frasco",
      img: f("sal-ahumada"), alt: "Frasco de Sal Ahumada — smoked salt",
      desc: "Sal ahumada de grano, para dar humo sin prender el ahumador. Es el atajo cuando se antoja ese sabor y la parrillada es entre semana.",
      cook: "Úsala al final, ya fuera del fuego: el humo se nota más cuando no se cocina encima. También levanta verduras asadas y papas al horno." },

    { id: "salt-pepper", name: "Salt & Pepper", cat: "sazon", price: 175, unit: "pieza", approx: "frasco",
      img: f("salt-pepper"), alt: "Frasco de Salt & Pepper — sal de mar y pimienta fresca",
      desc: "Sal de mar y pimienta molida fresca, en la proporción que usamos en el mostrador. El sazonador de todos los días — el que no falla con nada.",
      cook: "Para un corte grueso, sazona por los dos lados y por el canto de grasa. Y si vas a rebanar, un poco más al servir." },

    // ================= TERERÉ Y YERBA MATE ====================
    { id: "yerba-verdeflor", name: "Yerba Verdeflor 500 g", cat: "terere", price: 165, unit: "pieza", approx: "5 sabores",
      img: f("yerba-verdeflor-menta"),
      imgs: [f("yerba-verdeflor-menta"), f("yerba-verdeflor-manzanilla"), f("yerba-verdeflor-naranja"),
             f("yerba-verdeflor-serranas"), f("yerba-verdeflor-jengibre")],
      alt: "Paquetes de yerba mate Verdeflor en sus cinco sabores",
      desc: "Yerba argentina elaborada con palo, compuesta con hierbas. La tenemos en Menta, Manzanilla, Naranja, Hierbas Serranas y Menta con Jengibre — suave y aromática, la puerta de entrada para quien apenas empieza con el mate.",
      cook: "Dinos el sabor al confirmar el pedido por WhatsApp. Para tereré, agua bien fría y hielo; para mate, agua a 70–80 °C, nunca hirviendo." },

    { id: "yerba-campesino", name: "Yerba Campesino", cat: "terere", price: 185, unit: "pieza", approx: "500 g y 1 kg",
      img: f("yerba-campesino-clasica"),
      imgs: [f("yerba-campesino-clasica"), f("yerba-campesino-burrito")],
      alt: "Paquetes de yerba mate Campesino de Paraguay",
      desc: "Yerba paraguaya, la de sabor más franco del estante. La Clásica viene en 1 kg; las compuestas en 500 g — Burrito y Té Verde, Menta Limón y Cedrón, Refrescante con extra menta, y la Mezcla Maestra con burrito y moringa.",
      cook: "La Clásica pide tereré bien helado. Dinos cuál quieres al confirmar por WhatsApp y te decimos qué hay en el mostrador ese día." },

    { id: "mate-guampa", name: "Mate con virola labrada", cat: "terere", price: 890, unit: "pieza", from: true,
      img: f("mate-guampa-negro"),
      imgs: [f("mate-guampa-negro"), f("mate-guampa-gris"), f("mate-guampa-terracota")],
      alt: "Mates con textura de cuero y virola metálica labrada, en negro, gris y terracota",
      desc: "Interior de acero, exterior texturizado y una virola metálica labrada en la boca. Los tenemos en negro, gris y terracota — el mate para presumir en la mesa.",
      cook: "Lávalo a mano, sin detergentes fuertes, y sécalo boca abajo. Si guardas la yerba dentro, se pone rancia: mejor vacío." },

    { id: "mate-termico", name: "Mate térmico con bombilla", cat: "terere", price: 490, unit: "pieza",
      img: f("mate-termico-negro"),
      imgs: [f("mate-termico-negro"), f("mate-termico-madera")],
      alt: "Mates térmicos de acero con bombilla y cepillo de limpieza",
      desc: "Doble pared de acero, así que el tereré sigue helado y el mate caliente. Viene con bombilla y cepillo de limpieza. En la foto van el negro y el de acabado madera; en el mostrador hay más colores.",
      cook: "Enjuaga la bombilla apenas termines — es lo único que de verdad se tapa. Dinos el color al confirmar tu pedido." },

    // ================= CUCHILLERÍA ============================
    { id: "cuchillo-bulledge", name: "Cuchillos Bull-Edge", cat: "cuchillos", price: 850, unit: "pieza", from: true,
      img: f("cuchillo-bulledge-carnicero"),
      imgs: [f("cuchillo-bulledge-carnicero"), f("cuchillo-bulledge-damasco"),
             f("cuchillo-bulledge-santoku"), f("cuchillo-bulledge-hacha"), f("cuchillo-bulledge-exhibidor")],
      alt: "Cuchillos Bull-Edge de acero damasco con mango de madera de olivo",
      desc: "La pared de cuchillos de la boutique: hoja de acero damasco y mango de madera de olivo, cada pieza con su propio dibujo en el acero. Hay carnicero, santoku y hacha de cocina, y los precios cambian según la pieza.",
      cook: "Nunca al lavavajillas y nunca sobre vidrio o mármol: madera o plástico. Un asentador cada tanto y no vuelves a afilar en años." },

    // ================= MANDILES Y MESA ========================
    { id: "mandil-piel", name: "Mandil de piel", cat: "asado", price: 2200, unit: "pieza", approx: "7 colores",
      img: f("mandil-cafe"),
      imgs: [f("mandil-cafe"), f("mandil-negro"), f("mandil-vino"), f("mandil-camel"),
             f("mandil-negro-cafe"), f("mandil-negro-camel"), f("mandil-pelo-vaca")],
      alt: "Mandiles de piel con bolsas, portacuchillos y correas ajustables",
      desc: "Mandil de piel con bolsas al frente, portacuchillos y argolla para el trapo. Correas ajustables. Hay en café, negro, vino y camel, dos combinados en negro con café y con camel, y uno con las bolsas en pelo de vaca — la piel se va marcando con el uso y cada uno acaba siendo distinto.",
      cook: "Límpialo con un trapo húmedo y déjalo secar al aire, lejos del calor directo. Una crema para piel de vez en cuando y listo." },

    { id: "molcajete", name: "Molcajete de piedra volcánica", cat: "asado", price: 890, unit: "pieza", from: true,
      img: f("molcajete"), imgs: [f("molcajete"), f("molcajete-cuadrado")],
      alt: "Molcajetes de piedra volcánica, redondo y cuadrado",
      desc: "Piedra volcánica labrada, en redondo y en cuadrado. Para la salsa que acompaña el asado — y porque una salsa molcajeteada sabe distinto, no hay vuelta.",
      cook: "Cúralo antes de estrenarlo: muele arroz crudo hasta que salga blanco, dos o tres tandas. Después, solo agua y cepillo — nada de jabón." },

    { id: "turbo-fan", name: "Encendedor turbo para brasas", cat: "asado", price: 690, unit: "pieza",
      img: f("turbo-fan"), imgs: [f("turbo-fan"), f("turbo-fan-player")],
      alt: "Ventilador turbo portátil para encender carbón, en su caja",
      desc: "Ventilador de mano recargable: apuntas al carbón y en un par de minutos tienes brasa. Se acabó el cartón, el periódico y el soplar hasta marearse.",
      cook: "Ráfagas cortas y a distancia — si lo dejas fijo, levanta ceniza. Cárgalo antes de salir al rancho." },

    // ================= CORTES (PRÓXIMAMENTE) ==================
    { id: "cortes-res", name: "Cortes de res", cat: "carnes", soon: true,
      img: f("local-corte"), imgs: [f("local-corte"), f("local-mostrador"), f("local-poster")],
      alt: "Corte de carne preparado detrás del mostrador",
      desc: "Rib eye, New York, tomahawk, T-bone, picaña, arrachera — USDA Prime y Choice, Certified Angus Beef y res nacional. Todo eso sigue en el mostrador, todos los días.",
      cook: "Todavía no en línea: la carne pide empaque y cadena de frío distintos a lo demás, y preferimos abrirlo bien a abrirlo rápido. Mientras tanto, apártala por WhatsApp y la dejamos lista." },

    { id: "cortes-wagyu", name: "Wagyu japonés y australiano", cat: "carnes", soon: true,
      img: f("local-vitrinas"), imgs: [f("local-vitrinas"), f("local-angus")],
      alt: "Vitrinas refrigeradas de la boutique",
      desc: "Un refrigerador dedicado a Wagyu, con disponibilidad limitada y rotación constante. Es la vitrina frente a la que todo mundo se detiene.",
      cook: "Todavía no en línea. Escríbenos por WhatsApp y te decimos qué piezas hay esta semana antes de que se vayan." },

    { id: "cortes-cerdo", name: "Cerdo y piezas para ahumar", cat: "carnes", soon: true,
      img: f("local-rebanadora"), imgs: [f("local-rebanadora"), f("local-corte")],
      alt: "Rebanadora y área de preparación junto a las vitrinas",
      desc: "Costillar, chuleta, baby back ribs y las piezas grandes para ahumador: brisket, pecho y costilla. Lo que se cocina despacio y sale a la mesa el domingo.",
      cook: "Todavía no en línea. Pídelo por WhatsApp con un día de anticipación y lo dejamos preparado y porcionado." },

    { id: "paquetes-parrilleros", name: "Paquetes parrilleros", cat: "carnes", soon: true,
      img: f("local-angus"), imgs: [f("local-angus"), f("local-poster")],
      alt: "Cartel de Certified Angus Beef dentro de la boutique",
      desc: "Surtidos armados por nosotros para que no tengas que decidir: cortes de res, algo de cerdo y acompañamientos, calculados por número de personas.",
      cook: "Todavía no en línea. Dinos cuántos son por WhatsApp y te armamos el paquete — la calculadora de aquí abajo te da el punto de partida." }
  ];

  // Fotos de la ficha: varias si el producto trae `imgs`, si no la suya
  function gallery(p) {
    return (p.imgs && p.imgs.length) ? p.imgs : [p.img];
  }

  var CATS = [
    ["todos", "Todos"],
    ["sazon", "Sazonadores"],
    ["terere", "Tereré y yerba"],
    ["cuchillos", "Cuchillería"],
    ["asado", "Mandiles y mesa"],
    ["carnes", "Cortes"]
  ];

  // El encabezado del consejo en la ficha: "Cuidados" solo tiene sentido
  // para un cuchillo o un mandil, no para una yerba o un sazonador.
  var TIPS = {
    sazon: "Cómo usarlo",
    terere: "Cómo prepararlo",
    cuchillos: "Cuidados",
    asado: "Cuidados",
    carnes: "Mientras tanto"
  };

  function tipLabel(p) { return TIPS[p.cat] || "Cómo usarlo"; }

  // Mensaje de WhatsApp para lo que todavía no se vende en línea
  function waLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }
  function soonLink(p) {
    return waLink("Hola Carnes Hildebrandt 👋 Vi \"" + p.name +
      "\" en el sitio y dice que todavía no está en línea. ¿Me apartan?");
  }

  function validCat(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === key) return true;
    return false;
  }

  var KG = { step: 0.5, min: 0.5, max: 12, start: 1 };
  var PZ = { step: 1, min: 1, max: 6, start: 1 };

  // --- Estado -------------------------------------------------
  var STORAGE_KEY = "ch_cart_v1";
  var cart = {};              // { productId: qty }
  var delivery = "pickup";    // "pickup" | "delivery"
  var activeCat = "todos";
  var query = "";             // búsqueda por nombre (solo en la tienda)

  var fmt = new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", maximumFractionDigits: 0
  });

  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function rules(p) { return p.unit === "kg" ? KG : PZ; }
  function qtyLabel(p, q) {
    if (p.unit === "kg") return (q % 1 === 0 ? String(q) : q.toFixed(1)) + " kg";
    return q === 1 ? "1 pieza" : q + " piezas";
  }
  function priceLabel(p) {
    return p.unit === "kg" ? "/ kg" : "/ pieza" + (p.approx ? " · " + p.approx : "");
  }
  function priceHTML(p) {
    return (p.from ? "desde " : "") + fmt.format(p.price) + " <span>" + priceLabel(p) + "</span>";
  }
  function clampQty(p, q) {
    var r = rules(p);
    q = Math.round(q * 2) / 2;
    return Math.min(r.max, Math.max(r.min, q));
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart, delivery: delivery }));
    } catch (e) { /* modo privado, etc. */ }
  }
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      delivery = raw.delivery === "delivery" ? "delivery" : "pickup";
      var items = raw.items || {};
      for (var id in items) {
        var p = byId(id);
        var q = parseFloat(items[id]);
        if (p && q > 0) cart[id] = clampQty(p, q);
      }
    } catch (e) { cart = {}; }
  }

  // --- Elementos ----------------------------------------------
  var grid = document.getElementById("store-grid");
  var filters = document.getElementById("store-filters");
  var cartBtn = document.getElementById("cart-btn");
  var cartCount = document.getElementById("cart-count");
  var drawer = document.getElementById("cart-drawer");
  var overlay = document.getElementById("cart-overlay");
  var closeBtn = document.getElementById("cart-close");
  var itemsEl = document.getElementById("cart-items");
  var emptyEl = document.getElementById("cart-empty");
  var footEl = document.getElementById("cart-foot");
  var subtotalEl = document.getElementById("cart-subtotal");
  var submitBtn = document.getElementById("cart-submit");
  var emptyLink = document.getElementById("cart-empty-link");
  var featuredEl = document.getElementById("store-featured");
  var searchEl = document.getElementById("store-search");
  var countEl = document.getElementById("store-count");
  var noResultsEl = document.getElementById("store-empty");
  var resetEl = document.getElementById("store-reset");
  var soonEl = document.getElementById("store-soon");

  // El carrito vive en todas las páginas; la cuadrícula completa
  // solo existe en la tienda y los destacados solo en el inicio.
  if (!drawer || !cartBtn) return;

  // --- Tienda: filtros y productos ----------------------------
  function stepperHTML(p, q, small) {
    return (
      '<div class="qty-stepper' + (small ? " qty-small" : "") + '" data-id="' + p.id + '">' +
        '<button type="button" class="qs-minus" aria-label="Reducir cantidad">−</button>' +
        '<span class="qs-value" data-qty="' + q + '">' + qtyLabel(p, q) + "</span>" +
        '<button type="button" class="qs-plus" aria-label="Aumentar cantidad">+</button>' +
      "</div>"
    );
  }

  function renderFilters() {
    filters.innerHTML = CATS.map(function (c) {
      return '<button type="button" class="filter-btn' + (c[0] === activeCat ? " active" : "") +
        '" data-cat="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
  }

  function catName(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === key) return CATS[i][1];
    return key;
  }

  var WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.8 8.4c-.3.9-.1 2.1.9 3.4 1 1.3 2.2 2.2 3.6 2.6.6.2 1.3-.1 1.6-.7l.3-.6-1.9-1-.7.7c-.8-.4-1.5-1-2-1.8l.6-.8-1.2-1.8-.6.2c-.3.1-.5.4-.6.8z" fill="currentColor" stroke="none"/></svg>';

  function productCardHTML(p) {
    var r = rules(p);
    var media =
      '<div class="p-media"><img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">' +
        '<span class="p-tag">' + catName(p.cat) + "</span>" +
        (p.soon ? '<span class="p-soon">Próximamente en línea</span>' : "") +
        '<button type="button" class="p-view" data-id="' + p.id + '" aria-label="Ver detalle de ' + p.name + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.5 15.5L21 21M10.5 7.6v5.8M7.6 10.5h5.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' +
          "<span>Ver detalle</span>" +
        "</button></div>";

    // Lo que aún no se vende en línea no lleva precio ni carrito:
    // la tarjeta lleva directo a WhatsApp para apartarlo.
    var body = p.soon
      ? '<div class="p-body">' +
          "<h3>" + p.name + "</h3>" +
          '<p class="p-price p-price-soon">En el mostrador <span>· por WhatsApp</span></p>' +
          '<div class="p-actions">' +
            '<a class="p-ask" href="' + soonLink(p) + '" target="_blank" rel="noopener">' +
              WA_ICON + "Apartar por WhatsApp</a>" +
          "</div>" +
        "</div>"
      : '<div class="p-body">' +
          "<h3>" + p.name + "</h3>" +
          '<p class="p-price">' + priceHTML(p) + "</p>" +
          '<div class="p-actions">' +
            stepperHTML(p, r.start, false) +
            '<button type="button" class="p-add" data-id="' + p.id + '">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 10.3A2 2 0 0 0 9.45 16H17a2 2 0 0 0 1.95-1.55L20.8 7H6M12 8v5M9.5 10.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              "Agregar" +
            "</button>" +
          "</div>" +
        "</div>";

    return '<article class="p-card' + (p.soon ? " p-card-soon" : "") + '" data-id="' + p.id + '">' +
      media + body + "</article>";
  }

  // Búsqueda sin acentos: "picana" encuentra "Picaña"
  function norm(s) {
    s = String(s).toLowerCase();
    return s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s;
  }

  // `animate` en los cambios de filtro o búsqueda: las tarjetas
  // entran escalonadas en vez de aparecer de golpe. En el primer
  // dibujado no se anima — de esa entrada se encarga fx.js al hacer
  // scroll, y si no está fx.js las tarjetas salen visibles y ya.
  function renderStore(animate) {
    var q = norm(query.trim());
    var list = PRODUCTS.filter(function (p) {
      var okCat = activeCat === "todos" || p.cat === activeCat;
      return okCat && (!q || norm(p.name).indexOf(q) !== -1);
    });
    // Lo que sí se puede pedir hoy va primero; los cortes cierran la lista
    list.sort(function (a, b) { return (a.soon ? 1 : 0) - (b.soon ? 1 : 0); });
    grid.innerHTML = list.map(productCardHTML).join("");
    if (soonEl) soonEl.hidden = !list.some(function (p) { return p.soon; });
    if (animate) {
      var cards = grid.querySelectorAll(".p-card");
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.setProperty("--i", i);
        cards[i].classList.add("p-in");
      }
    }
    if (countEl) {
      countEl.textContent = list.length === 1 ? "1 producto" : list.length + " productos";
    }
    if (noResultsEl) noResultsEl.hidden = list.length > 0;
  }

  // Mantiene ?cat= en la URL para poder compartir/enlazar categorías
  function syncCatUrl() {
    if (!window.history || !history.replaceState) return;
    var url = location.pathname + (activeCat === "todos" ? "" : "?cat=" + activeCat) + location.hash;
    history.replaceState(null, "", url);
  }

  // Destacados de la página de inicio
  var FEATURED = ["sal-parrillera", "sweet-bbq-rub", "yerba-campesino", "tabla-holz"];
  function renderFeatured() {
    featuredEl.innerHTML = FEATURED.map(byId).filter(Boolean).map(productCardHTML).join("");
  }

  function adjustStepper(stepEl, dir) {
    var p = byId(stepEl.getAttribute("data-id"));
    if (!p) return;
    var valEl = stepEl.querySelector(".qs-value");
    var q = clampQty(p, parseFloat(valEl.getAttribute("data-qty")) + dir * rules(p).step);
    valEl.setAttribute("data-qty", q);
    valEl.textContent = qtyLabel(p, q);
  }

  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeCat = btn.getAttribute("data-cat");
      syncCatUrl();
      renderFilters();
      renderStore(true);
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      query = searchEl.value;
      renderStore(true);
    });
  }
  if (resetEl) {
    resetEl.addEventListener("click", function () {
      query = "";
      if (searchEl) searchEl.value = "";
      activeCat = "todos";
      syncCatUrl();
      renderFilters();
      renderStore(true);
    });
  }

  // ==========================================================
  // FICHA DEL PRODUCTO (ventana de detalle)
  // ----------------------------------------------------------
  // Se construye una sola vez, la primera vez que se abre, y se
  // reutiliza. Así no hay que repetir este bloque en las 8 páginas.
  // ==========================================================
  var pv = null, pvLastFocus = null, pvId = null;

  function buildQuickView() {
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="pv-overlay" id="pv-overlay"></div>' +
      '<aside class="pv" id="pv" role="dialog" aria-modal="true" aria-labelledby="pv-title" aria-hidden="true">' +
        '<button type="button" class="pv-close" id="pv-close" aria-label="Cerrar ficha">×</button>' +
        '<div class="pv-media">' +
          '<img id="pv-img" src="" alt="">' +
          '<div class="pv-thumbs" id="pv-thumbs"></div>' +
        "</div>" +
        '<div class="pv-info">' +
          '<span class="pv-tag" id="pv-tag"></span>' +
          '<h3 id="pv-title"></h3>' +
          '<p class="pv-price" id="pv-price"></p>' +
          '<p class="pv-desc" id="pv-desc"></p>' +
          '<div class="pv-cook"><strong id="pv-cook-l">Cómo usarlo</strong><span id="pv-cook"></span></div>' +
          '<div class="pv-actions" id="pv-actions"></div>' +
          '<p class="pv-fine" id="pv-fine"></p>' +
        "</div>" +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    pv = {
      panel: document.getElementById("pv"),
      overlay: document.getElementById("pv-overlay"),
      close: document.getElementById("pv-close"),
      img: document.getElementById("pv-img"),
      thumbs: document.getElementById("pv-thumbs"),
      tag: document.getElementById("pv-tag"),
      title: document.getElementById("pv-title"),
      price: document.getElementById("pv-price"),
      desc: document.getElementById("pv-desc"),
      cook: document.getElementById("pv-cook"),
      cookL: document.getElementById("pv-cook-l"),
      fine: document.getElementById("pv-fine"),
      actions: document.getElementById("pv-actions")
    };

    pv.close.addEventListener("click", closeQuickView);
    pv.overlay.addEventListener("click", closeQuickView);

    // Miniaturas: cambian la foto grande
    pv.thumbs.addEventListener("click", function (e) {
      var b = e.target.closest(".pv-thumb");
      if (!b) return;
      pv.img.src = b.getAttribute("data-src");
      var all = pv.thumbs.querySelectorAll(".pv-thumb");
      for (var i = 0; i < all.length; i++) all[i].classList.toggle("on", all[i] === b);
    });

    // El mismo par de controles que en la tarjeta
    pv.actions.addEventListener("click", function (e) {
      var minus = e.target.closest(".qs-minus");
      var plus = e.target.closest(".qs-plus");
      var add = e.target.closest(".p-add");
      if (minus || plus) {
        adjustStepper((minus || plus).closest(".qty-stepper"), minus ? -1 : 1);
      } else if (add) {
        var q = parseFloat(pv.actions.querySelector(".qs-value").getAttribute("data-qty"));
        addToCart(pvId, q);
        closeQuickView();
        openCart();
      }
    });
  }

  function openQuickView(id) {
    var p = byId(id);
    if (!p) return;
    if (!pv) buildQuickView();
    pvId = id;
    pvLastFocus = document.activeElement;

    var shots = gallery(p);
    pv.img.src = shots[0];
    pv.img.alt = p.alt;
    pv.thumbs.innerHTML = shots.length > 1 ? shots.map(function (s, i) {
      return '<button type="button" class="pv-thumb' + (i ? "" : " on") + '" data-src="' + s +
        '" aria-label="Foto ' + (i + 1) + '"><img src="' + s + '" alt=""></button>';
    }).join("") : "";
    pv.thumbs.hidden = shots.length < 2;

    pv.tag.textContent = catName(p.cat);
    pv.title.textContent = p.name;
    pv.desc.textContent = p.desc || "";
    pv.cook.textContent = p.cook || "";
    pv.cookL.textContent = tipLabel(p);

    if (p.soon) {
      pv.price.innerHTML = 'En el mostrador <span>· todavía no en línea</span>';
      pv.price.classList.add("p-price-soon");
      pv.actions.innerHTML = '<a class="p-ask" href="' + soonLink(p) + '" target="_blank" rel="noopener">' +
        WA_ICON + "Apartar por WhatsApp</a>";
      pv.fine.textContent = "Cuando la tienda en línea abra los cortes, este producto se podrá pedir aquí mismo.";
    } else {
      pv.price.innerHTML = priceHTML(p);
      pv.price.classList.remove("p-price-soon");
      pv.actions.innerHTML = stepperHTML(p, rules(p).start, false) +
        '<button type="button" class="p-add" data-id="' + p.id + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 10.3A2 2 0 0 0 9.45 16H17a2 2 0 0 0 1.95-1.55L20.8 7H6M12 8v5M9.5 10.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "Agregar al pedido</button>";
      pv.fine.textContent = "El total final se confirma por WhatsApp antes de cobrar. Precios de demostración.";
    }

    pv.panel.classList.add("open");
    pv.overlay.classList.add("open");
    pv.panel.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    pv.close.focus();
  }

  function closeQuickView() {
    if (!pv) return;
    pv.panel.classList.remove("open");
    pv.overlay.classList.remove("open");
    pv.panel.setAttribute("aria-hidden", "true");
    // El carrito puede seguir abierto: solo se libera el scroll si no lo está
    if (!drawer.classList.contains("open")) document.documentElement.style.overflow = "";
    if (pvLastFocus && pvLastFocus.focus) pvLastFocus.focus();
  }

  function onGridClick(e) {
    var minus = e.target.closest(".qs-minus");
    var plus = e.target.closest(".qs-plus");
    var add = e.target.closest(".p-add");
    var view = e.target.closest(".p-view, .p-media, .p-body h3");
    if (view && !minus && !plus && !add) {
      var card = view.closest(".p-card");
      if (card) { openQuickView(card.getAttribute("data-id")); return; }
    }
    if (minus || plus) {
      adjustStepper((minus || plus).closest(".qty-stepper"), minus ? -1 : 1);
    } else if (add) {
      var card = add.closest(".p-card");
      var q = parseFloat(card.querySelector(".qs-value").getAttribute("data-qty"));
      addToCart(add.getAttribute("data-id"), q);
      add.classList.add("added");
      var label = add.innerHTML;
      add.innerHTML = "✓ Agregado";
      setTimeout(function () { add.classList.remove("added"); add.innerHTML = label; }, 1300);
    }
  }
  if (grid) grid.addEventListener("click", onGridClick);
  if (featuredEl) featuredEl.addEventListener("click", onGridClick);

  // --- Carrito -------------------------------------------------
  function addToCart(id, qty) {
    var p = byId(id);
    if (!p || p.soon) return;   // lo que no está en línea no entra al carrito
    cart[id] = clampQty(p, (cart[id] || 0) + qty);
    save();
    renderCart();
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth; // reinicia la animación
    cartCount.classList.add("bump");
  }

  function cartLines() {
    var lines = [];
    for (var id in cart) {
      var p = byId(id);
      if (p) lines.push({ p: p, qty: cart[id], total: p.price * cart[id] });
    }
    return lines;
  }

  function renderCart() {
    var lines = cartLines();
    var count = lines.length;
    var total = 0;

    itemsEl.innerHTML = lines.map(function (l) {
      total += l.total;
      return (
        '<li class="cart-item" data-id="' + l.p.id + '">' +
          '<div class="ci-top"><strong>' + l.p.name + "</strong><span>" + fmt.format(l.total) + "</span></div>" +
          '<div class="ci-sub">' + fmt.format(l.p.price) + " " + priceLabel(l.p) + "</div>" +
          '<div class="ci-row">' +
            stepperHTML(l.p, l.qty, true) +
            '<button type="button" class="ci-remove" data-id="' + l.p.id + '">Quitar</button>' +
          "</div>" +
        "</li>"
      );
    }).join("");

    emptyEl.style.display = count ? "none" : "";
    footEl.style.display = count ? "" : "none";
    subtotalEl.textContent = fmt.format(total);
    submitBtn.disabled = !count;

    cartCount.textContent = String(count);
    cartCount.hidden = !count;
  }

  itemsEl.addEventListener("click", function (e) {
    var minus = e.target.closest(".qs-minus");
    var plus = e.target.closest(".qs-plus");
    var remove = e.target.closest(".ci-remove");
    if (minus || plus) {
      var stepEl = (minus || plus).closest(".qty-stepper");
      var p = byId(stepEl.getAttribute("data-id"));
      var q = clampQty(p, cart[p.id] + (minus ? -1 : 1) * rules(p).step);
      cart[p.id] = q;
      save();
      renderCart();
    } else if (remove) {
      delete cart[remove.getAttribute("data-id")];
      save();
      renderCart();
    }
  });

  drawer.addEventListener("change", function (e) {
    if (e.target.name === "delivery") {
      delivery = e.target.value;
      save();
    }
  });

  // --- Abrir / cerrar el panel ---------------------------------
  var lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  cartBtn.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  emptyLink.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    // La ficha se cierra primero: puede estar abierta sobre el carrito
    if (pv && pv.panel.classList.contains("open")) closeQuickView();
    else if (drawer.classList.contains("open")) closeCart();
  });

  // --- Checkout por WhatsApp -----------------------------------
  submitBtn.addEventListener("click", function () {
    var lines = cartLines();
    if (!lines.length) return;
    var total = 0;
    var msg = "Hola Carnes Hildebrandt 👋\nQuiero hacer un pedido desde el sitio web:\n\n";
    lines.forEach(function (l) {
      total += l.total;
      msg += "• " + l.p.name + " — " + qtyLabel(l.p, l.qty) + " — " + fmt.format(l.total) + "\n";
    });
    msg += "\nSubtotal estimado: " + fmt.format(total);
    msg += "\nEntrega: " + (delivery === "delivery" ? "Envío a domicilio" : "Recoger en tienda");
    msg += "\n\n(Pedido de demostración)";
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  // --- Init ----------------------------------------------------
  load();
  // Enlaces profundos a una categoría: tienda.html?cat=terere
  if (grid) {
    var catParam = location.search.match(/[?&]cat=([^&]+)/);
    if (catParam && validCat(decodeURIComponent(catParam[1]))) {
      activeCat = decodeURIComponent(catParam[1]);
    }
  }
  if (filters) renderFilters();
  if (grid) renderStore();
  if (featuredEl) renderFeatured();
  renderCart();
  var radios = drawer.querySelectorAll('input[name="delivery"]');
  for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === delivery;

  // Pequeña API para pruebas / demostraciones y para la
  // calculadora de parrillada de fx.js, que arma un carrito
  // sugerido a partir de este mismo catálogo.
  window.CHStore = {
    add: addToCart,
    open: openCart,
    close: closeCart,
    products: PRODUCTS,
    byId: byId,
    view: openQuickView,
    wa: waLink
  };
})();
