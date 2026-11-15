/* Lume Odontologia: comportamento comum a todas as páginas. */
(function () {
  "use strict";
  var C = window.CLINICA || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var ICONE_CHAT = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H8.5L4 19.5z"/></svg>';
  var temWA = /^\d{12,13}$/.test(C.whatsapp || "");
  var temTel = !!(C.telefone && C.telefoneLink);
  var temEmail = /@/.test(C.email || "") && !/\.example$/.test(C.email);

  function wa(numero, msg) {
    return "https://wa.me/" + numero + (msg ? "?text=" + encodeURIComponent(msg.replace(/\{nome\}/g, C.nome)) : "");
  }

  /* Data e hora atuais no fuso da clínica (America/Sao_Paulo), independente do aparelho */
  function agoraClinica() {
    var p = {};
    new Intl.DateTimeFormat("en-CA", {
      timeZone: C.fusoHorario || "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { ano: +p.year, mes: +p.month, dia: +p.day, hora: +p.hour, minuto: +p.minute };
  }
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  /* Datas "civis" (sem hora) como objetos Date em UTC, para não sofrer com fuso do aparelho */
  function dataCivil(a, m, d) { return new Date(Date.UTC(a, m - 1, d)); }
  function hojeCivil() { var n = agoraClinica(); return dataCivil(n.ano, n.mes, n.dia); }
  function somaDias(dt, n) { return new Date(dt.getTime() + n * 864e5); }
  function dataExtenso(dt, comSemana) {
    var s = dt.getUTCDate() + " de " + MESES[dt.getUTCMonth()] + " de " + dt.getUTCFullYear();
    return comSemana ? SEMANA[dt.getUTCDay()] + ", " + s : s;
  }
  function dataCurta(dt) {
    return ("0" + dt.getUTCDate()).slice(-2) + "/" + ("0" + (dt.getUTCMonth() + 1)).slice(-2) + "/" + dt.getUTCFullYear();
  }

  /* Máscara de telefone tolerante a colagem e correção. A validação usa só os dígitos. */
  function mascaraTel(input) {
    input.addEventListener("input", function () {
      var d = input.value.replace(/\D/g, "");
      if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
      d = d.slice(0, 11);
      input.value = d.length > 6 ? "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4)
        : d.length > 2 ? "(" + d.slice(0, 2) + ") " + d.slice(2) : d;
    });
  }
  function digitos(v) { return (v || "").replace(/\D/g, ""); }

  /* Mostra ou limpa o erro de um campo (texto + ícone + aria-invalid) */
  function erroCampo(el, msg) {
    var err = document.getElementById("erro-" + (el.id || el.name));
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) { err.hidden = !msg; var s = $("span", err); if (s) s.textContent = msg || ""; }
    return !msg;
  }

  window.Lume = {
    C: C, $: $, $$: $$, wa: wa, temWA: temWA, temTel: temTel, agoraClinica: agoraClinica,
    dataCivil: dataCivil, hojeCivil: hojeCivil, somaDias: somaDias, dataExtenso: dataExtenso,
    dataCurta: dataCurta, MESES: MESES, SEMANA: SEMANA, mascaraTel: mascaraTel, digitos: digitos,
    erroCampo: erroCampo, ICONE_CHAT: ICONE_CHAT
  };

  /* 1. Textos vindos do config */
  $$("[data-c]").forEach(function (el) {
    var v = C[el.getAttribute("data-c")];
    if (typeof v === "string" && v) el.textContent = v;
  });

  /* 2. Contatos: só viram link quando o valor real existe */
  $$("[data-contato]").forEach(function (a) {
    var tipo = a.getAttribute("data-contato"), rotulo = $(".valor", a) || a;
    if (tipo === "telefone") {
      if (temTel) { a.href = "tel:" + C.telefoneLink; rotulo.textContent = C.telefone; }
      else { a.removeAttribute("href"); a.classList.add("inativo"); rotulo.textContent = C.telefoneExemplo + " (exemplo, sem ligação)"; }
    } else if (tipo === "email") {
      if (temEmail) { a.href = "mailto:" + C.email; rotulo.textContent = C.email; }
      else { a.removeAttribute("href"); a.classList.add("inativo"); rotulo.textContent = C.emailExemplo + " (exemplo)"; }
    } else if (tipo === "whatsapp") {
      if (temWA) { a.href = wa(C.whatsapp, "Olá, gostaria de falar com a {nome}."); rotulo.textContent = "WhatsApp"; }
      else { a.removeAttribute("href"); a.classList.add("inativo"); rotulo.textContent = "WhatsApp não configurado (demonstração)"; }
    }
  });

  /* 3. Chamadas que viram WhatsApp quando há número; sem número, seguem para o link do HTML */
  $$("[data-wa]").forEach(function (a) {
    if (!temWA) return;
    a.href = wa(C.whatsapp, a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
    var t = a.getAttribute("data-wa-texto");
    if (t && a.firstChild && a.firstChild.nodeType === 3) a.firstChild.nodeValue = t;
    if (a.classList.contains("btn") && !a.querySelector("svg")) a.insertAdjacentHTML("afterbegin", ICONE_CHAT);
    a.setAttribute("data-evento", "clique_whatsapp");
  });
  $$("[data-so-wa]").forEach(function (el) { el.hidden = !temWA; });
  $$("[data-sem-wa]").forEach(function (el) { el.hidden = temWA; });

  /* 4. Mapa e rota */
  $$("[data-rota]").forEach(function (a) {
    if (C.rotaDestino) { a.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(C.rotaDestino); a.hidden = false; }
    else a.hidden = true;
  });
  $$("[data-mapa]").forEach(function (box) {
    if (!/^https:\/\/www\.google\.com\/maps\/embed/.test(C.mapaEmbedUrl || "")) return;
    box.innerHTML = '<iframe src="' + C.mapaEmbedUrl + '" title="Mapa de localização da ' + C.nome + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    box.classList.add("com-mapa");
  });

  /* 5. Faixa de demonstração, crédito da agência e redes sociais */
  if (C.mostrarFaixaDemo) {
    var faixa = $("[data-faixa-demo]");
    if (faixa) faixa.hidden = false;
  }
  /* Crédito da agência ("By Sitra"): aparece sempre que mostrarCreditoAgencia for true */
  var temAgencia = /^\d{12,13}$/.test(C.whatsappAgencia || "");
  if (C.mostrarCreditoAgencia && C.nomeAgencia) {
    var site = /^https:\/\//.test(C.siteAgencia || "");
    var destino = site ? C.siteAgencia : temAgencia ? wa(C.whatsappAgencia, "Olá, vi o site de demonstração da Lume e quero um site assim.") : "";
    $$("[data-agencia]").forEach(function (el) {
      el.hidden = false;
      el.innerHTML = (destino ? '<a target="_blank" rel="noopener" data-evento="clique_agencia" data-origem="credito"></a>' : "<span></span>");
      el.firstChild.innerHTML = "<span class=\"by\">By</span> <b></b>" + (C.sloganAgencia ? "<small></small>" : "");
      el.firstChild.querySelector("b").textContent = C.nomeAgencia;
      if (C.sloganAgencia) el.firstChild.querySelector("small").textContent = C.sloganAgencia;
      if (destino) el.firstChild.href = destino;
    });
  } else $$("[data-agencia], [data-agencia-curto]").forEach(function (el) { el.hidden = true; });
  $$("[data-agencia-link]").forEach(function (a) {
    if (temAgencia) { a.href = wa(C.whatsappAgencia, "Olá, vi o site de demonstração da Lume e quero saber mais."); a.hidden = false; a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-agencia-sem]").forEach(function (el) { el.hidden = temAgencia; });
  var redes = $("[data-redes]");
  if (redes && C.redes) {
    var nomes = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
    var html = Object.keys(nomes).filter(function (k) { return /^https:\/\//.test(C.redes[k] || ""); })
      .map(function (k) { return '<li><a href="' + C.redes[k] + '" rel="noopener" target="_blank">' + nomes[k] + "</a></li>"; }).join("");
    if (html) { redes.innerHTML = html; redes.hidden = false; }
  }

  /* 6. JSON-LD Dentist só com dados reais (endereço e telefone configurados) */
  if (C.enderecoReal && temTel) {
    var e = C.enderecoPartes || {};
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Dentist", name: C.nome, telephone: C.telefoneLink,
      address: { "@type": "PostalAddress", streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, postalCode: e.cep, addressCountry: "BR" },
      openingHours: C.horarioSchema
    });
    document.head.appendChild(ld);
  }

  /* 7. Medição: só registra no dataLayer; scripts externos apenas após o aceite de cookies */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-evento]");
    if (a) window.dataLayer.push({ event: a.getAttribute("data-evento"), origem: a.getAttribute("data-origem") });
  });

  /* 8. Menu mobile: abre, fecha, Esc, foco preso no painel, rolagem bloqueada */
  var abrir = $(".menu-btn[aria-controls]"), painel = $("#menu");
  function menu(aberto) {
    painel.hidden = !aberto;
    abrir.setAttribute("aria-expanded", aberto);
    document.body.classList.toggle("travado", aberto);
    (aberto ? $(".menu-btn", painel) : abrir).focus();
  }
  if (abrir && painel) {
    abrir.addEventListener("click", function () { menu(true); });
    $(".menu-btn", painel).addEventListener("click", function () { menu(false); });
    painel.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") return menu(false);
      if (ev.key !== "Tab") return;
      var f = $$("a[href], button:not([disabled])", painel), primeiro = f[0], ultimo = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
    });
    $$("a", painel).forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
    matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches && !painel.hidden) menu(false); });
  }

  /* 9. Barra fixa do celular: segunda ação depende do que estiver configurado */
  var barra = $(".mbar");
  if (barra) {
    var b2 = $("[data-mbar2]", barra);
    if (b2) {
      if (temTel) { b2.href = "tel:" + C.telefoneLink; $(".valor", b2).textContent = "Ligar"; }
      else if (temWA) { b2.href = wa(C.whatsapp, "Olá, gostaria de falar com a {nome}."); $(".valor", b2).textContent = "WhatsApp"; }
    }
    var alvo = $(".hero, .cabeca"), passou = !alvo, digitando = false;
    var atualiza = function () { barra.classList.toggle("on", passou && !digitando); };
    if (alvo && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { passou = !en[0].isIntersecting; atualiza(); }).observe(alvo);
    } else { passou = true; }
    document.addEventListener("focusin", function (ev) {
      if (ev.target.matches("input:not([type=checkbox]):not([type=radio]), textarea, select")) { digitando = true; atualiza(); }
    });
    document.addEventListener("focusout", function () { digitando = false; atualiza(); });
    atualiza();
  }

  /* 10. Acordeão */
  $$(".faq button[aria-controls]").forEach(function (b) {
    var p = document.getElementById(b.getAttribute("aria-controls"));
    p.hidden = true;
    b.addEventListener("click", function () {
      var abre = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", abre);
      if (abre) p.hidden = false;
      var h = p.scrollHeight;
      p.style.height = (abre ? 0 : h) + "px";
      p.offsetHeight; /* força o recálculo antes da transição */
      p.style.height = (abre ? h : 0) + "px";
      var fim = function () { p.style.height = ""; if (!abre) p.hidden = true; p.removeEventListener("transitionend", fim); };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) fim();
      else p.addEventListener("transitionend", fim);
    });
  });

  /* 11. Contadores de caracteres */
  $$("textarea[maxlength][data-contador]").forEach(function (t) {
    var c = document.getElementById(t.getAttribute("data-contador"));
    var max = t.getAttribute("maxlength");
    var up = function () { c.textContent = t.value.length + " de " + max + " caracteres"; };
    t.addEventListener("input", up); up();
  });

  /* 12. Formulário de contato */
  var form = $("#form-contato");
  if (form) {
    mascaraTel(form.whatsapp);
    var regras = {
      nome: function (el) { return el.value.trim().length >= 2 ? "" : "Informe o seu nome."; },
      whatsapp: function (el) { var n = digitos(el.value).length; return n === 10 || n === 11 ? "" : "Informe o WhatsApp com DDD, por exemplo (16) 91234-5678."; },
      assunto: function (el) { return el.value ? "" : "Escolha um assunto."; },
      consentimento: function (el) { return el.checked ? "" : "Marque a concordância para podermos responder."; }
    };
    var valida = function (n) { return erroCampo(form[n], regras[n](form[n])); };
    Object.keys(regras).forEach(function (n) {
      form[n].addEventListener(/consentimento|assunto/.test(n) ? "change" : "blur", function () {
        if (form[n].getAttribute("aria-invalid")) valida(n);
      });
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var status = $("#status"), botao = $("button[type=submit]", form);
      var invalidos = Object.keys(regras).filter(function (n) { return !valida(n); });
      if (invalidos.length) {
        status.className = "status erro-geral"; status.hidden = false;
        status.textContent = invalidos.length === 1 ? "Falta corrigir 1 campo." : "Falta corrigir " + invalidos.length + " campos.";
        form[invalidos[0]].focus(); return;
      }
      var periodo = $("input[name=periodo]:checked", form);
      var texto = "Olá, vim pelo site da " + C.nome + ".\nNome: " + form.nome.value.trim() +
        "\nWhatsApp: " + form.whatsapp.value + "\nAssunto: " + form.assunto.value +
        "\nMelhor período para retorno: " + (periodo ? periodo.value : "qualquer") +
        (form.mensagem.value.trim() ? "\nMensagem: " + form.mensagem.value.trim() : "");
      botao.disabled = true; botao.setAttribute("aria-busy", "true");
      status.className = "status"; status.hidden = false; status.textContent = "Preparando a mensagem…";
      setTimeout(function () {
        botao.disabled = false; botao.removeAttribute("aria-busy");
        if (temWA) {
          var url = wa(C.whatsapp, texto);
          window.dataLayer.push({ event: "clique_whatsapp", origem: "formulario-contato" });
          status.className = "status sucesso";
          status.innerHTML = 'Abrimos o WhatsApp com a sua mensagem em outra aba. Se não abriu, <a href="' + url + '" target="_blank" rel="noopener">toque aqui para enviar</a>.';
          window.open(url, "_blank", "noopener");
        } else {
          status.className = "status sucesso";
          status.innerHTML = "<strong>Envio simulado.</strong> Esta é uma demonstração: a mensagem não foi enviada a ninguém e nenhum dado foi guardado. Quando o WhatsApp da clínica for configurado, este botão abre a conversa com o texto pronto.";
        }
        status.focus();
      }, 600);
    });
  }

  /* 13. Cookies (LGPD): só a escolha é guardada; medição só depois do aceite */
  var chave = "lume-cookies", escolha = null;
  try { escolha = localStorage.getItem(chave); } catch (x) {}
  function medir() {
    /* Cole aqui o snippet do GTM ou GA4 do cliente. Só roda depois do aceite. */
  }
  if (escolha === "aceito") medir();
  var aviso = $(".cookies");
  if (aviso) {
    aviso.hidden = !!escolha;
    $$("[data-cookie]", aviso).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-cookie");
        try { localStorage.setItem(chave, v); } catch (x) {}
        aviso.hidden = true;
        if (v === "aceito") medir();
      });
    });
  }
  $$("[data-rever-cookies]").forEach(function (b) {
    b.addEventListener("click", function () {
      try { localStorage.removeItem(chave); } catch (x) {}
      if (aviso) { aviso.hidden = false; $("button", aviso).focus(); }
    });
  });
})();

/* =====================================================================
   VERSÃO 3: casca de aplicativo, mídia, movimento, personalizador e tour
   ===================================================================== */
(function () {
  "use strict";
  var L = window.Lume, C = L.C, $ = L.$, $$ = L.$$;
  var semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- Toast ---------- */
  var toastEl = document.createElement("div");
  toastEl.className = "toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  var toastTimer;
  L.toast = function (msg, acao, fn, ms) {
    toastEl.innerHTML = "<span></span>" + (acao ? "<button type=button></button>" : "");
    toastEl.firstChild.textContent = msg;
    if (acao) { var b = toastEl.querySelector("button"); b.textContent = acao; b.onclick = function () { toastEl.classList.remove("on"); fn(); }; }
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, ms || 5000);
  };

  /* ---------- Cabeçalho que se esconde ao rolar para baixo ---------- */
  var topo = $(".topo"), ultimoY = scrollY;
  if (topo) {
    addEventListener("scroll", function () {
      var y = scrollY;
      topo.classList.toggle("rolado", y > 4);
      var menuAberto = document.body.classList.contains("travado");
      if (!menuAberto && y > 160 && y > ultimoY + 6) topo.classList.add("oculto");
      else if (y < ultimoY - 6 || y < 160) topo.classList.remove("oculto");
      ultimoY = y;
    }, { passive: true });
    document.addEventListener("focusin", function (e) { if (topo.contains(e.target)) topo.classList.remove("oculto"); });
  }

  /* ---------- Entrada suave das seções principais ---------- */
  var revelar = $$("[data-revelar]");
  if (revelar.length && "IntersectionObserver" in window && !semMovimento) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    revelar.forEach(function (el) { io.observe(el); });
  } else revelar.forEach(function (el) { el.classList.add("visivel"); });

  /* ---------- Carrosséis (setas no desktop, pontos no celular) ---------- */
  $$("[data-carrossel]").forEach(function (box) {
    var trilho = $(".carrossel", box), itens = $$(".carrossel > *", box);
    var ant = $("[data-ant]", box), prox = $("[data-prox]", box), pontos = $(".pontos", box);
    if (pontos) pontos.innerHTML = itens.map(function () { return "<span></span>"; }).join("");
    function passo() { return itens[0] ? itens[0].getBoundingClientRect().width + 14 : 300; }
    function atualiza() {
      var max = trilho.scrollWidth - trilho.clientWidth - 4;
      if (ant) ant.disabled = trilho.scrollLeft <= 4;
      if (prox) prox.disabled = trilho.scrollLeft >= max;
      if (pontos) {
        var i = Math.round(trilho.scrollLeft / passo());
        $$("span", pontos).forEach(function (s, j) { s.classList.toggle("ativo", j === Math.min(i, itens.length - 1)); });
      }
    }
    if (ant) ant.addEventListener("click", function () { trilho.scrollBy({ left: -passo(), behavior: semMovimento ? "auto" : "smooth" }); });
    if (prox) prox.addEventListener("click", function () { trilho.scrollBy({ left: passo(), behavior: semMovimento ? "auto" : "smooth" }); });
    trilho.addEventListener("scroll", atualiza, { passive: true });
    addEventListener("resize", atualiza);
    atualiza();
  });

  /* ---------- Painéis que sobem (dialog nativo: Esc, foco e fundo) ---------- */
  function abrirSheet(id, origem) {
    var d = document.getElementById(id);
    if (!d || !d.showModal) return;
    d._origem = origem || document.activeElement;
    d.showModal();
    document.body.classList.add("travado");
  }
  L.abrirSheet = abrirSheet;
  $$("dialog.sheet, dialog.lightbox").forEach(function (d) {
    d.addEventListener("close", function () {
      document.body.classList.remove("travado");
      d.style.transform = "";
      if (d._origem && d._origem.focus) d._origem.focus();
    });
    d.addEventListener("click", function (e) { if (e.target === d && d.classList.contains("sheet")) d.close(); });
    $$("[data-fechar]", d).forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
    /* Arrastar a alça para baixo fecha */
    var alca = $(".sheet-alca", d), y0 = null;
    if (alca) {
      alca.addEventListener("pointerdown", function (e) { y0 = e.clientY; alca.setPointerCapture(e.pointerId); });
      alca.addEventListener("pointermove", function (e) { if (y0 === null) return; var dy = Math.max(0, e.clientY - y0); d.style.transform = "translateY(" + dy + "px)"; });
      alca.addEventListener("pointerup", function (e) { if (y0 === null) return; var dy = e.clientY - y0; y0 = null; if (dy > 90) d.close(); else d.style.transform = ""; });
      alca.addEventListener("click", function () { d.close(); });
    }
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-abrir-sheet]");
    if (b) { e.preventDefault(); abrirSheet(b.getAttribute("data-abrir-sheet"), b); }
  });

  /* ---------- Galeria em tela cheia com deslizar ---------- */
  var lb = $("#lightbox");
  if (lb) {
    var trilhoLb = $(".lb-trilho", lb), cont = $(".lb-cont", lb), itensLb = $$(".lb-item", lb);
    var irPara = function (i) { trilhoLb.scrollTo({ left: i * trilhoLb.clientWidth, behavior: "auto" }); };
    var atual = function () { return Math.round(trilhoLb.scrollLeft / trilhoLb.clientWidth); };
    trilhoLb.addEventListener("scroll", function () { cont.textContent = (atual() + 1) + " de " + itensLb.length; }, { passive: true });
    $$("[data-lb]").forEach(function (b) {
      b.addEventListener("click", function () { abrirSheet("lightbox", b); requestAnimationFrame(function () { irPara(+b.getAttribute("data-lb")); cont.textContent = (+b.getAttribute("data-lb") + 1) + " de " + itensLb.length; }); });
    });
    $(".lb-nav.ant", lb).addEventListener("click", function () { irPara(Math.max(0, atual() - 1)); });
    $(".lb-nav.prox", lb).addEventListener("click", function () { irPara(Math.min(itensLb.length - 1, atual() + 1)); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") irPara(Math.min(itensLb.length - 1, atual() + 1));
      if (e.key === "ArrowLeft") irPara(Math.max(0, atual() - 1));
    });
  }

  /* ---------- Filtro da página de tratamentos ---------- */
  var filtros = $$(".filtros button");
  filtros.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filtro");
      filtros.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      $$("[data-cat]").forEach(function (c) { c.hidden = f !== "todos" && c.getAttribute("data-cat").split(" ").indexOf(f) < 0; });
    });
  });

  /* ---------- Implante passo a passo (avança com a rolagem) ---------- */
  var palco = $(".palco-fig");
  if (palco && "IntersectionObserver" in window) {
    var rot = $(".rotulo-etapa", palco);
    var passosP = $$(".palco-passo");
    var ativa = function (p) {
      passosP.forEach(function (x) { x.classList.toggle("ativo", x === p); });
      palco.setAttribute("data-etapa", p.getAttribute("data-etapa"));
      if (rot) rot.textContent = $("h3", p).textContent;
    };
    var ioP = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) ativa(e.target); }); }, { rootMargin: "-45% 0px -45% 0px" });
    passosP.forEach(function (p) { ioP.observe(p); p.addEventListener("click", function () { ativa(p); }); });
  }

  /* ---------- Arquivo de calendário (.ics) ---------- */
  L.baixarIcs = function (o) {
    var p2 = function (n) { return ("0" + n).slice(-2); };
    var dt = function (d, h, m) { return d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate()) + "T" + p2(h) + p2(m) + "00"; };
    var fim = o.hora * 60 + o.minuto + (o.duracao || 50);
    var esc = function (s) { return String(s).replace(/[\\,;]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); };
    var txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lume Odontologia//Demo//PT-BR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@lume.example", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART;TZID=America/Sao_Paulo:" + dt(o.data, o.hora, o.minuto),
      "DTEND;TZID=America/Sao_Paulo:" + dt(o.data, Math.floor(fim / 60), fim % 60),
      "SUMMARY:" + esc(o.titulo), "DESCRIPTION:" + esc(o.descricao || ""), "LOCATION:" + esc(C.endereco),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar;charset=utf-8" }));
    a.download = (o.arquivo || "lume-consulta") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  };

  /* ---------- Faixa de demonstração: fechar e "saiba mais" ---------- */
  var faixa = $("[data-faixa-demo]");
  if (faixa) {
    try { if (sessionStorage.getItem("lume-demo-fechada")) faixa.hidden = true; } catch (e) {}
    var fechar = $(".fechar-demo", faixa);
    if (fechar) fechar.addEventListener("click", function () { faixa.hidden = true; try { sessionStorage.setItem("lume-demo-fechada", "1"); } catch (e) {} });
  }

  /* ---------- Personalizador: "Ver com a minha clínica" ---------- */
  var PALETAS = {
    petroleo: ["#0F4A4E", "#0A3639", "#DDEFEA"], marinho: ["#1F3A5F", "#152A45", "#E1E8F2"],
    salvia: ["#3D5C48", "#2B4334", "#E2ECE4"], vinho: ["#6B2737", "#4E1B27", "#F3E4E7"], grafite: ["#2F3A40", "#1F272B", "#E6EAEC"]
  };
  function aplicarPersonalizacao(p) {
    if (!p) return;
    var cores = PALETAS[p.paleta];
    if (cores) {
      var r = document.documentElement.style;
      r.setProperty("--cor-ancora", cores[0]); r.setProperty("--cor-ancora-escura", cores[1]); r.setProperty("--cor-menta", cores[2]);
    }
    var nome = (p.nome || "").trim(), comp = (p.complemento || "").trim(), cidade = (p.cidade || "").trim();
    if (!nome && !cidade) return;
    var trocas = [];
    if (nome) { trocas.push([/Lume Odontologia/g, nome + (comp ? " " + comp : "")]); trocas.push([/\bLume\b/g, nome]); }
    if (cidade) { trocas.push([/Ribeirão Preto, SP/g, cidade]); trocas.push([/Ribeirão Preto/g, cidade.split(",")[0]]); }
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentNode && /SCRIPT|STYLE|TEXTAREA/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n; while ((n = w.nextNode())) {
      var v = n.nodeValue, novo = v;
      trocas.forEach(function (t) { novo = novo.replace(t[0], t[1]); });
      if (novo !== v) n.nodeValue = novo;
    }
    $$(".marca span.comp").forEach(function (s) { s.textContent = comp; s.hidden = !comp; });
    trocas.forEach(function (t) { document.title = document.title.replace(t[0], t[1]); });
  }
  var salvo = null;
  try { salvo = JSON.parse(ls.get("lume-personalizado") || "null"); } catch (e) {}
  aplicarPersonalizacao(salvo);
  var fp = $("#form-personalizar");
  if (fp) {
    if (salvo) {
      fp.nome.value = salvo.nome || ""; fp.complemento.value = salvo.complemento || ""; fp.cidade.value = salvo.cidade || "";
      var rp = $('input[name=paleta][value="' + (salvo.paleta || "petroleo") + '"]', fp); if (rp) rp.checked = true;
    }
    fp.addEventListener("submit", function (e) {
      e.preventDefault();
      var pal = $("input[name=paleta]:checked", fp);
      var p = { nome: fp.nome.value.trim().slice(0, 40), complemento: fp.complemento.value.trim().slice(0, 30), cidade: fp.cidade.value.trim().slice(0, 40), paleta: pal ? pal.value : "petroleo" };
      ls.set("lume-personalizado", JSON.stringify(p));
      location.reload();
    });
    $("#restaurar-demo").addEventListener("click", function () { ls.del("lume-personalizado"); location.reload(); });
  }
  if (salvo && (salvo.nome || salvo.paleta !== "petroleo")) {
    setTimeout(function () { L.toast("Você está vendo a versão personalizada.", "Restaurar", function () { ls.del("lume-personalizado"); location.reload(); }, 4000); }, 900);
  }

  /* ---------- Tour guiado ---------- */
  function visivel(el) { var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; }
  function iniciarTour() {
    var alvos = {};
    $$("[data-tour]").forEach(function (el) {
      var k = +el.getAttribute("data-tour");
      if (!alvos[k] && visivel(el)) alvos[k] = el;
    });
    var passos = Object.keys(alvos).sort(function (a, b) { return a - b; }).map(function (k) { return alvos[k]; });
    if (!passos.length) return;
    var anel = document.createElement("div"); anel.className = "tour-anel";
    var cart = document.createElement("div"); cart.className = "tour-cartao"; cart.tabIndex = -1;
    cart.setAttribute("role", "dialog"); cart.setAttribute("aria-modal", "true"); cart.setAttribute("aria-labelledby", "tour-t");
    document.body.append(anel, cart);
    var i = 0, antesFoco = document.activeElement;
    function fim() { anel.remove(); cart.remove(); document.removeEventListener("keydown", tecla); ls.set("lume-tour-visto", "1"); if (antesFoco) antesFoco.focus(); }
    function tecla(e) { if (e.key === "Escape") fim(); }
    document.addEventListener("keydown", tecla);
    function mostra() {
      var el = passos[i];
      el.scrollIntoView({ block: "center", behavior: semMovimento ? "auto" : "smooth" });
      setTimeout(function () {
        var r = el.getBoundingClientRect(), m = 8;
        anel.style.cssText = "top:" + (r.top - m) + "px;left:" + (r.left - m) + "px;width:" + (r.width + m * 2) + "px;height:" + (r.height + m * 2) + "px";
        cart.innerHTML = '<p class="tour-n">' + (i + 1) + " de " + passos.length + '</p><h2 id="tour-t"></h2><p></p><div class="tour-rodape"><button type="button" class="link-btn" data-t="pular">Pular tour</button><button type="button" class="btn btn-p" data-t="prox">' + (i === passos.length - 1 ? "Concluir" : "Próximo") + "</button></div>";
        $("h2", cart).textContent = el.getAttribute("data-tour-titulo");
        $$("p", cart)[1].textContent = el.getAttribute("data-tour-texto");
        var abaixo = r.bottom + 200 < innerHeight;
        var top = abaixo ? r.bottom + 18 : Math.max(12, r.top - 18 - cart.offsetHeight);
        var left = Math.min(Math.max(16, r.left), innerWidth - cart.offsetWidth - 16);
        cart.style.top = top + "px"; cart.style.left = left + "px";
        $('[data-t="prox"]', cart).onclick = function () { if (++i >= passos.length) fim(); else mostra(); };
        $('[data-t="pular"]', cart).onclick = fim;
        $('[data-t="prox"]', cart).focus();
      }, semMovimento ? 0 : 380);
    }
    mostra();
  }
  L.iniciarTour = iniciarTour;
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tour-iniciar]");
    if (!b) return;
    var d = b.closest("dialog"); if (d) d.close();
    if (!$("[data-tour]")) { location.href = "index.html?tour=1"; return; }
    setTimeout(iniciarTour, 250);
  });
  if (/[?&]tour=1/.test(location.search)) setTimeout(iniciarTour, 600);
  else if (document.body.getAttribute("data-pagina") === "inicio" && !ls.get("lume-tour-visto") && C.mostrarFaixaDemo) {
    setTimeout(function () { L.toast("Primeira vez aqui? Conheça o site em 30 segundos.", "Fazer o tour", iniciarTour, 8000); ls.set("lume-tour-visto", "1"); }, 1800);
  }

  /* ---------- App instalável ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  var pedidoInstalar = null;
  addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); pedidoInstalar = e;
    $$("[data-instalar]").forEach(function (b) { b.hidden = false; });
    $$("[data-instalar-dica]").forEach(function (b) { b.hidden = true; });
  });
  $$("[data-instalar]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!pedidoInstalar) return;
      pedidoInstalar.prompt();
      pedidoInstalar.userChoice.then(function () { pedidoInstalar = null; b.hidden = true; });
    });
  });
  addEventListener("appinstalled", function () { L.toast("Pronto! A Lume está na tela inicial do seu celular."); });
})();
