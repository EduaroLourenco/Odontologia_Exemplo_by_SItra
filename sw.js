/* Service worker: permite instalar o site como app e abrir as páginas públicas sem internet.
   Páginas da área do paciente nunca vão para o cache. Ao publicar mudanças, troque VERSAO. */
var VERSAO = "lume-v4-1";
var BASICO = [
  "./", "index.html", "tratamentos.html", "implantes.html", "ortodontia.html", "clareamento.html",
  "lentes.html", "prevencao.html", "urgencia.html", "primeira-consulta.html", "sobre.html",
  "contato.html", "agendamento.html", "cuidados.html", "privacidade.html", "offline.html",
  "assets/css/style.css", "assets/js/config.js", "assets/js/main.js", "assets/js/agendamento.js",
  "assets/js/comparador.js", "assets/img/favicon.svg", "assets/img/icone-192.png"
];
var PRIVADAS = /(login|paciente|anamnese|documento)\.html/;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(BASICO); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSAO; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (PRIVADAS.test(url.pathname) || /\.mp4$/.test(url.pathname)) return; /* sempre da rede (vídeos usam pedidos parciais) */
  if (req.mode === "navigate" || /\.(css|js|webmanifest)$/.test(url.pathname)) {
    /* Páginas, CSS e JS: rede primeiro, cache como reserva, offline.html por último */
    e.respondWith(fetch(req).then(function (r) {
      var copia = r.clone(); caches.open(VERSAO).then(function (c) { c.put(req, copia); }); return r;
    }).catch(function () {
      return caches.match(req).then(function (r) { return r || (req.mode === "navigate" ? caches.match("offline.html") : Response.error()); });
    }));
    return;
  }
  /* Imagens: cache primeiro, depois rede */
  e.respondWith(caches.match(req).then(function (r) {
    return r || fetch(req).then(function (resp) {
      if (resp.ok && /\.(webp|png|jpg|svg|css|js)$/.test(url.pathname)) {
        var copia = resp.clone(); caches.open(VERSAO).then(function (c) { c.put(req, copia); });
      }
      return resp;
    });
  }));
});
