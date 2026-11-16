/* Motor das animações (1080x1920, 30 fps). Tudo é função do tempo: render(t) desenha o quadro t.
   Cada vídeo define window.ROTEIRO = { dur, cenas: [...] } antes de carregar este arquivo. */
(function () {
  "use strict";
  var R = window.ROTEIRO, cenas = R.cenas;
  var clamp = function (x, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, x)); };
  var pr = function (t, a, d) { return clamp((t - a) / d); };
  var eOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var eIO = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var eBack = function (x) { var c = 1.9, c3 = c + 1; return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  var el = function (tag, cls, html, pai) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; (pai || document.getElementById("palco")).appendChild(e); return e; };
  var hex = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); };
  var mix = function (a, b, k) { var x = hex(a), y = hex(b); return "rgb(" + x.map(function (v, i) { return Math.round(v + (y[i] - v) * k); }).join(",") + ")"; };
  var semente = 7; var rnd = function () { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };

  var palco = document.getElementById("palco");

  /* Fundo: bolhas e ícones flutuando */
  var bolhas = [[120, 300, 260], [930, 520, 320], [80, 1350, 300], [980, 1600, 240], [560, 120, 180], [540, 1800, 200]].map(function (b, i) {
    var e = el("div", "bolha"); e.style.width = e.style.height = b[2] + "px"; return { e: e, x: b[0], y: b[1], r: b[2], f: .35 + i * .07 };
  });
  var ICONES = {
    dente: '<svg viewBox="0 0 64 64"><path d="M20 6c-8 0-14 7-13 16 1 7 4 11 5 19 1 9 3 17 8 17 4 0 4-9 6-14 1-3 3-4 6-4s5 1 6 4c2 5 2 14 6 14 5 0 7-8 8-17 1-8 4-12 5-19 1-9-5-16-13-16-6 0-8 3-12 3S26 6 20 6z"/></svg>',
    brilho: '<svg viewBox="0 0 64 64"><path d="M32 4l6 20 20 8-20 8-6 20-6-20-20-8 20-8z"/></svg>',
    coracao: '<svg viewBox="0 0 64 64"><path d="M32 56S6 40 6 22c0-8 6-14 14-14 5 0 9 3 12 7 3-4 7-7 12-7 8 0 14 6 14 14 0 18-26 34-26 34z"/></svg>'
  };
  var flutuantes = [["dente", 70, 560, 70, -8], ["brilho", 960, 420, 56, 0], ["coracao", 990, 1180, 54, 10], ["brilho", 60, 1120, 44, 0], ["dente", 950, 1500, 62, 12], ["brilho", 120, 1640, 50, 0], ["coracao", 150, 220, 40, -10], ["brilho", 880, 250, 36, 0]].map(function (f, i) {
    var e = el("div", "flut " + f[0], ICONES[f[0]]); e.style.width = e.style.height = f[3] + "px"; return { e: e, x: f[1], y: f[2], rot: f[4], fase: i * 1.3 };
  });

  /* Barra de progresso estilo stories */
  var barra = el("div", "stories");
  var segs = cenas.map(function () { var s = el("span", "", "<i></i>", barra); return s.firstChild; });

  /* Legendas por cena */
  cenas.forEach(function (c) {
    if (c.tipo !== "celular" && c.tipo !== "lista") return;
    c.legEl = el("div", "legenda");
    if (c.passo) el("span", "passo", c.passo, c.legEl);
    var h = el("h2", "", "", c.legEl);
    c.palavras = c.titulo.split(" ").map(function (w) { var s = el("span", "", w, h); h.appendChild(document.createTextNode(" ")); return s; });
    if (c.sub) c.subEl = el("p", "", c.sub, c.legEl);
  });

  /* Celular */
  var cel = el("div", "celular", '<div class="tela"><div class="status"><b>9:41</b><span>▂▄▆ ᯤ ▮</span></div></div><div class="ilha"></div>');
  var tela = cel.querySelector(".tela");
  var tiros = [];
  cenas.forEach(function (c) {
    (c.telas || []).forEach(function (s) {
      var wrap = el("div", "tiro", '<img src="telas/' + s.img + '.jpg" alt="">', tela);
      if (s.trans === "onda") { wrap.classList.add("onda"); }
      s.e = wrap; s.cena = c; tiros.push(s);
      if (s.digitar) { s.dig = el("div", "digitar", "", tela); }
    });
  });
  var toques = [];
  tiros.forEach(function (s) { (s.toques || []).forEach(function (tq) { toques.push({ x: tq[0], y: tq[1], at: tq[2], e: el("div", "toque", "<i></i>", tela) }); }); });

  /* Adesivos ao lado do celular */
  var adesivos = [];
  cenas.forEach(function (c) { (c.adesivos || []).forEach(function (a, i) {
    var e = el("div", "adesivo " + (a.lado || "dir"), '<b>' + (a.emoji || "") + '</b><span>' + a.texto + '</span>');
    adesivos.push({ e: e, at: a.at, ate: a.ate || c.b - .25, y: a.y, lado: a.lado || "dir" });
  }); });

  /* Confete */
  var CORES = ["#C9A97A", "#0E2E30", "#A8875A", "#E8DCC8", "#5A1F2B", "#ffffff"];
  var confetes = [];
  cenas.forEach(function (c) { (c.telas || []).forEach(function (s) { if (!s.confete) return;
    for (var i = 0; i < 70; i++) {
      var e = el("div", "confete"); e.style.background = CORES[i % CORES.length];
      var ang = -Math.PI / 2 + (rnd() - .5) * 2.2, v = 900 + rnd() * 900;
      confetes.push({ e: e, at: s.confete, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, giro: (rnd() - .5) * 1400, w: 12 + rnd() * 14, h: 8 + rnd() * 10 });
    }
  }); });

  /* Lista (como testar) */
  cenas.forEach(function (c) { if (c.tipo !== "lista") return;
    c.itensEl = c.itens.map(function (it, i) { return el("div", "item-lista", '<span class="n">' + (i + 1) + '</span><span>' + it + '</span>'); });
  });

  /* Abertura e fechamento */
  cenas.forEach(function (c) {
    if (c.tipo === "abertura") {
      c.box = el("div", "abertura");
      c.k = el("span", "chip", c.chip, c.box);
      var h = el("h1", "", "", c.box);
      c.palavras = c.titulo.split(" ").map(function (w) { var s = el("span", "", w, h); h.appendChild(document.createTextNode(" ")); return s; });
      c.subEl = el("p", "", c.sub, c.box);
      c.icones = [].slice.call(el("div", "icones", (c.icones || ["📅", "🦷", "📲"]).map(function (x) { return "<span>" + x + "</span>"; }).join(""), c.box).children);
    }
    if (c.tipo === "fechamento") {
      c.box = el("div", "fechamento");
      c.h = el("h2", "", c.titulo, c.box);
      c.subEl = el("p", "", c.sub, c.box);
      c.card = el("div", "cartao-logo", '<img src="marca/sitra-logo.png" alt="Sitra">', c.box);
      c.cta = el("div", "cta", c.cta || "💬 Fale com a Sitra", c.box);
      c.linhas = (c.linhas || []).map(function (l) { return el("p", "linha", l, c.box); });
    }
  });

  /* Marca d'água */
  var marca = el("div", "marca-dagua", '<img src="marca/sitra-simbolo.png" alt=""><span>By <b>Sitra</b></span>');

  function cenaEm(t) { for (var i = 0; i < cenas.length; i++) if (t < cenas[i].b) return i; return cenas.length - 1; }
  var CEL_W = 600, CEL_TOP = 470;

  window.render = function (t) {
    var ic = cenaEm(t), c = cenas[ic], ant = cenas[ic - 1];
    /* fundo */
    var k = ant ? eIO(pr(t, c.a, .6)) : 1;
    palco.style.background = ant ? mix(ant.fundo, c.fundo, k) : c.fundo;
    bolhas.forEach(function (b, i) {
      b.e.style.transform = "translate(" + (b.x - b.r / 2 + Math.sin(t * b.f + i) * 40) + "px," + (b.y - b.r / 2 + Math.cos(t * b.f * .8 + i) * 50) + "px)";
      b.e.style.background = c.bolha || "rgba(255,255,255,.45)";
    });
    flutuantes.forEach(function (f) {
      f.e.style.transform = "translate(" + f.x + "px," + (f.y + Math.sin(t * 1.6 + f.fase) * 22) + "px) rotate(" + (f.rot + Math.sin(t * 1.2 + f.fase) * 12) + "deg) scale(" + (.9 + Math.sin(t * 2 + f.fase) * .1) + ")";
    });
    /* stories */
    segs.forEach(function (s, i) { s.style.width = (clamp((t - cenas[i].a) / (cenas[i].b - cenas[i].a)) * 100) + "%"; });

    /* legendas */
    cenas.forEach(function (cc, j) {
      if (!cc.legEl) return;
      var vis = t >= cc.a - .05 && t < cc.b;
      cc.legEl.style.display = vis ? "" : "none"; if (!vis) return;
      var sai = pr(t, cc.b - .3, .3);
      cc.legEl.style.opacity = 1 - sai;
      cc.legEl.style.transform = "translateY(" + (-sai * 40) + "px)";
      var passo = cc.legEl.querySelector(".passo");
      if (passo) { var pp = eBack(pr(t, cc.a, .45)); passo.style.transform = "scale(" + pp + ") rotate(" + ((1 - pp) * -30) + "deg)"; }
      cc.palavras.forEach(function (w, i) { var q = pr(t, cc.a + .12 + i * .07, .4); w.style.opacity = clamp(q * 2); w.style.transform = "translateY(" + ((1 - eBack(q)) * 50) + "px) scale(" + (.7 + .3 * eBack(q)) + ")"; });
      if (cc.subEl) { var q2 = eOut(pr(t, cc.a + .45, .5)); cc.subEl.style.opacity = q2; cc.subEl.style.transform = "translateY(" + ((1 - q2) * 24) + "px)"; }
    });

    /* celular: entra na primeira cena com telas, sai antes do fechamento */
    var primeira = cenas.find(function (x) { return x.telas; }), fech = cenas.find(function (x) { return x.tipo === "fechamento"; });
    var entra = eBack(pr(t, primeira.a - .2, .8)), sai = fech ? eIO(pr(t, fech.a - .1, .6)) : 0;
    var lista = c.tipo === "lista" ? eIO(pr(t, c.a, .5)) * (1 - eIO(pr(t, c.b - .5, .5))) : 0;
    var pulso = 0; tiros.forEach(function (s) { var q = pr(t, s.at, .35); if (q > 0 && q < 1) pulso = Math.max(pulso, Math.sin(q * Math.PI)); });
    var ty = (1 - entra) * 1500 + sai * 1600 + lista * 1500;
    cel.style.transform = "translate(" + ((1080 - CEL_W - 36) / 2) + "px," + (CEL_TOP + ty + Math.sin(t * 1.4) * 8) + "px) rotate(" + (Math.sin(t * .9) * 1.4 + (1 - entra) * 8) + "deg) scale(" + (1 - pulso * .025) + ")";

    /* telas */
    tiros.forEach(function (s, i) {
      var prox = tiros[i + 1];
      var e = pr(t, s.at, s.trans === "rolar" ? .7 : .55);
      var vis = t >= s.at && !(prox && t > prox.at + .8);
      s.e.style.display = vis ? "" : "none";
      if (!vis) { if (s.dig) s.dig.style.display = "none"; return; }
      var tr = "", op = 1, clip = "none";
      if (s.trans === "deslizar") tr = "translateX(" + (1 - eOut(e)) * 100 + "%)";
      else if (s.trans === "rolar") tr = "translateY(" + (1 - eIO(e)) * 100 + "%)";
      else if (s.trans === "onda") { clip = "circle(" + (eOut(e) * 160) + "% at " + (s.origem || [50, 50])[0] + "% " + (s.origem || [50, 50])[1] + "%)"; }
      else { var q = eBack(e); tr = "scale(" + (.85 + .15 * q) + ")"; op = clamp(e * 2); }
      if (prox && t >= prox.at) {
        var pe = pr(t, prox.at, prox.trans === "rolar" ? .7 : .55);
        if (prox.trans === "rolar") tr = "translateY(" + (-eIO(pe) * 100) + "%)";
        else if (prox.trans === "deslizar") { tr = "translateX(" + (-eOut(pe) * 35) + "%)"; op = 1 - pe * .5; }
      }
      s.e.style.transform = tr; s.e.style.opacity = op; s.e.style.clipPath = clip; s.e.style.zIndex = i + 1;
      if (s.dig) {
        var txt = s.digitar[0], q3 = pr(t, s.digitar[1], txt.length * .09);
        s.dig.style.display = t >= s.digitar[1] - .3 && t < (prox ? prox.at : 999) ? "" : "none";
        s.dig.style.zIndex = 50; s.dig.style.left = s.digitar[2] + "%"; s.dig.style.top = s.digitar[3] + "%";
        s.dig.innerHTML = txt.slice(0, Math.round(q3 * txt.length)) + (Math.floor(t * 3) % 2 ? "|" : "&nbsp;");
      }
    });
    toques.forEach(function (tq) {
      var q = pr(t, tq.at - .25, 1.0);
      tq.e.style.display = q > 0 && q < 1 ? "" : "none"; if (q <= 0 || q >= 1) return;
      tq.e.style.left = tq.x * 100 + "%"; tq.e.style.top = tq.y * 100 + "%";
      var dedo = q < .25 ? eOut(q / .25) : 1, onda = pr(q, .25, .6);
      tq.e.style.opacity = q > .8 ? (1 - q) / .2 : 1;
      tq.e.style.transform = "translate(-50%,-50%) scale(" + (q < .3 ? .6 + .4 * dedo : 1 - Math.sin(clamp((q - .25) / .15) * Math.PI) * .2) + ")";
      tq.e.firstChild.style.transform = "scale(" + (1 + onda * 1.8) + ")"; tq.e.firstChild.style.opacity = 1 - onda;
      tq.e.style.zIndex = 60;
    });
    /* adesivos */
    adesivos.forEach(function (a) {
      var q = pr(t, a.at, .5), s2 = pr(t, a.ate - .25, .25);
      var vis = q > 0 && s2 < 1; a.e.style.display = vis ? "" : "none"; if (!vis) return;
      var sc = eBack(q) * (1 - eIO(s2));
      a.e.style.top = a.y + "px";
      a.e.style.transform = "scale(" + sc + ") rotate(" + ((a.lado === "esq" ? -4 : 4) + Math.sin(t * 3) * 2) + "deg)";
    });
    /* confete */
    confetes.forEach(function (p) {
      var d = t - p.at; var vis = d > 0 && d < 2.6; p.e.style.display = vis ? "" : "none"; if (!vis) return;
      var x = 540 + p.vx * d * .55, y = 1100 + p.vy * d * .55 + 900 * d * d;
      p.e.style.width = p.w + "px"; p.e.style.height = p.h + "px";
      p.e.style.transform = "translate(" + x + "px," + y + "px) rotate(" + p.giro * d + "deg)"; p.e.style.opacity = d > 2 ? (2.6 - d) / .6 : 1;
    });
    /* lista */
    cenas.forEach(function (cc) { if (!cc.itensEl) return;
      cc.itensEl.forEach(function (it, i) {
        var q = pr(t, cc.a + .5 + i * .45, .55), s3 = pr(t, cc.b - .4, .35);
        var vis = t >= cc.a && t < cc.b; it.style.display = vis ? "" : "none";
        it.style.top = (720 + i * 230) + "px";
        it.style.opacity = clamp(q * 2) * (1 - s3);
        it.style.transform = "translateX(" + ((1 - eBack(q)) * (i % 2 ? 300 : -300)) + "px) rotate(" + ((1 - q) * (i % 2 ? 6 : -6)) + "deg)";
      });
    });
    /* abertura / fechamento */
    cenas.forEach(function (cc) {
      if (!cc.box) return;
      var vis = t >= cc.a - .05 && t < cc.b + .4; cc.box.style.display = vis ? "" : "none"; if (!vis) return;
      var sai = cc.tipo === "abertura" ? eIO(pr(t, cc.b - .35, .4)) : 0;
      cc.box.style.opacity = 1 - sai; cc.box.style.transform = "translateY(" + (-sai * 160) + "px)";
      if (cc.tipo === "abertura") {
        var qk = eBack(pr(t, cc.a + .1, .5)); cc.k.style.transform = "scale(" + qk + ")";
        cc.palavras.forEach(function (w, i) { var q = pr(t, cc.a + .35 + i * .12, .5); w.style.opacity = clamp(q * 2); w.style.transform = "translateY(" + ((1 - eBack(q)) * 80) + "px) rotate(" + ((1 - q) * (i % 2 ? 8 : -8)) + "deg)"; });
        var qs = eOut(pr(t, cc.a + 1.2, .5)); cc.subEl.style.opacity = qs; cc.subEl.style.transform = "translateY(" + ((1 - qs) * 30) + "px)";
        cc.icones.forEach(function (ic, i) { var q = eBack(pr(t, cc.a + 1.5 + i * .18, .5)); ic.style.transform = "translateY(" + (Math.sin(t * 4 + i * 1.2) * 18) + "px) scale(" + q + ") rotate(" + (Math.sin(t * 3 + i) * 8) + "deg)"; });
      } else {
        var qh = eBack(pr(t, cc.a + .2, .5)); cc.h.style.transform = "scale(" + qh + ")"; cc.h.style.opacity = clamp(qh);
        var qs2 = eOut(pr(t, cc.a + .5, .5)); cc.subEl.style.opacity = qs2;
        var qc = eBack(pr(t, cc.a + .8, .7)); cc.card.style.transform = "scale(" + qc + ") rotate(" + ((1 - qc) * -12 + Math.sin(t * 2) * 1.5) + "deg)";
        var qa = eBack(pr(t, cc.a + 1.3, .5)); cc.cta.style.transform = "scale(" + (qa * (1 + Math.sin(t * 6) * .04)) + ")";
        cc.linhas.forEach(function (l, i) { var q = eOut(pr(t, cc.a + 1.8 + i * .25, .5)); l.style.opacity = q; l.style.transform = "translateY(" + ((1 - q) * 30) + "px)"; });
      }
    });
    marca.style.opacity = c.tipo === "fechamento" ? 1 - pr(t, c.a, .4) : .95;
  };
  window.DURACAO = R.dur;
  render(0);
})();
