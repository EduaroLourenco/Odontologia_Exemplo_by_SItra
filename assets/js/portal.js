/* Área do paciente em MODO DEMONSTRAÇÃO.
   - Sessão: só uma marca em sessionStorage ("lume-demo-sessao"). Não é autenticação.
   - Dados: paciente fictícia, gerados em memória com datas relativas a hoje.
   - Em produção, tudo isto vem de uma API autenticada (ver PENDENCIAS-PRODUCAO.md). */
(function () {
  "use strict";
  var L = window.Lume, C = L.C, $ = L.$, $$ = L.$$;
  var CHAVE = "lume-demo-sessao";
  var pagina = document.body.getAttribute("data-pagina");
  var destinosPermitidos = ["paciente.html", "anamnese.html", "documento.html"];

  function sessao() { try { return sessionStorage.getItem(CHAVE); } catch (x) { return null; } }

  /* ---------- Login demonstrativo ---------- */
  if (pagina === "login") {
    var p = new URLSearchParams(location.search);
    var volta = p.get("volta") || "paciente.html";
    if (destinosPermitidos.indexOf(volta.split("?")[0]) < 0) volta = "paciente.html";
    if (p.get("saiu")) { var s0 = $("#login-status"); s0.hidden = false; s0.className = "status sucesso"; s0.textContent = "Você saiu da área do paciente de demonstração."; }
    $("#entrar-demo").addEventListener("click", function () {
      try { sessionStorage.setItem(CHAVE, "maria-oliveira"); } catch (x) {}
      location.href = volta;
    });
    var f = $("#form-login");
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var st = $("#login-status");
      var okId = L.erroCampo(f.usuario, f.usuario.value.trim() ? "" : "Informe o e-mail ou CPF.");
      var okSenha = L.erroCampo(f.senha, f.senha.value ? "" : "Informe a senha.");
      if (!okId || !okSenha) { (okId ? f.senha : f.usuario).focus(); return; }
      st.hidden = false; st.className = "status erro-geral";
      st.textContent = "Não foi possível entrar: esta demonstração não tem servidor de autenticação, então nenhuma senha é verificada. Use o botão de acesso demonstrativo.";
      f.senha.value = "";
      st.focus();
    });
    return;
  }

  /* ---------- Páginas privadas: exige a sessão demonstrativa ---------- */
  if (!sessao()) {
    location.replace("login.html?volta=" + encodeURIComponent(location.pathname.split("/").pop() + location.search));
    return;
  }
  $$("[data-sair]").forEach(function (b) {
    b.addEventListener("click", function () {
      try { sessionStorage.removeItem(CHAVE); } catch (x) {}
      location.href = "login.html?saiu=1";
    });
  });
  $$("[data-paciente]").forEach(function (el) { el.textContent = C.pacienteDemo; });
  $$("[data-paciente-primeiro]").forEach(function (el) { el.textContent = C.pacienteDemo.split(" ")[0]; });

  /* ---------- Dados fictícios, relativos à data de hoje ---------- */
  var hoje = L.hojeCivil();
  function dia(n) { var d = L.somaDias(hoje, n); if (d.getUTCDay() === 0) d = L.somaDias(d, n < 0 ? -1 : 1); return d; }
  /* Dia útil (segunda a sexta), para horários da tarde que o sábado não tem */
  function diaUtil(n) { var d = L.somaDias(hoje, n); while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d = L.somaDias(d, 1); return d; }
  var D = {
    proxima: { data: diaUtil(9), hora: "14h00", prof: "Dra. Helena Prado", motivo: "Moldagem para a coroa sobre o implante" },
    historico: [
      { d: dia(-20), tipo: "Consulta", titulo: "Avaliação ortodôntica", prof: "Dr. Rafael Mota" },
      { d: dia(-45), tipo: "Procedimento", titulo: "Limpeza profissional", prof: "Dra. Helena Prado" },
      { d: dia(-88), tipo: "Consulta", titulo: "Revisão depois da cirurgia", prof: "Dra. Helena Prado" },
      { d: dia(-98), tipo: "Procedimento", titulo: "Cirurgia de implante, região do dente 36", prof: "Dra. Helena Prado" },
      { d: dia(-112), tipo: "Exame", titulo: "Tomografia para planejamento", prof: "Dra. Helena Prado" },
      { d: dia(-120), tipo: "Consulta", titulo: "Avaliação inicial e plano de tratamento", prof: "Dra. Helena Prado" }
    ],
    arquivos: [
      { nome: "Plano de tratamento", d: dia(-118), doc: "plano" },
      { nome: "Orientações depois da cirurgia", d: dia(-98), doc: "orientacoes" },
      { nome: "Tomografia (CBCT)", d: dia(-112), doc: "" },
      { nome: "Radiografia panorâmica", d: dia(-120), doc: "" }
    ],
    orcamentos: [
      { id: "ORC-DEMO-0187", titulo: "Alinhadores transparentes", d: dia(-18), status: "Em análise", valor: "R$ 7.200,00", itens: [["Alinhadores transparentes, tratamento completo", "R$ 6.600,00"], ["Documentação ortodôntica", "R$ 600,00"]] },
      { id: "ORC-DEMO-0141", titulo: "Implante e coroa, região do dente 36", d: dia(-118), status: "Aprovado", valor: "R$ 4.800,00", itens: [["Implante dentário", "R$ 2.400,00"], ["Pilar e coroa em cerâmica", "R$ 2.050,00"], ["Tomografia", "R$ 350,00"]] }
    ],
    recibos: [
      { id: "REC-DEMO-0412", d: dia(-98), ref: "Cirurgia de implante", valor: "R$ 2.400,00" },
      { id: "REC-DEMO-0398", d: dia(-112), ref: "Tomografia", valor: "R$ 350,00" },
      { id: "REC-DEMO-0377", d: dia(-120), ref: "Avaliação inicial", valor: "R$ 250,00" }
    ],
    mensagens: [
      { d: dia(-2), titulo: "Orientações para a próxima consulta", texto: "Olá, Maria! Para a moldagem do dia " + L.dataCurta(diaUtil(9)) + ", mantenha a sua rotina de higiene e chegue 10 minutos antes. Se precisar remarcar, avise a recepção." },
      { d: dia(-40), titulo: "Higiene ao redor do implante", texto: "Use a escova interdental indicada na consulta uma vez por dia e mantenha as revisões. Em caso de dor ou sangramento, fale com a clínica." }
    ],
    cadastro: { nome: C.pacienteDemo, nascimento: "1987-05-14", whatsapp: "(16) 90000-0000", email: "maria.oliveira@paciente.example" }
  };
  window.LumeDemo = D;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- Painel ---------- */
  if (pagina === "paciente") {
    $("#prox-data").textContent = L.dataExtenso(D.proxima.data, true);
    $("#prox-hora").textContent = D.proxima.hora;
    $("#prox-prof").textContent = D.proxima.prof;
    $("#prox-motivo").textContent = D.proxima.motivo;
    $("#prox-faltam").textContent = "Faltam " + Math.round((D.proxima.data - hoje) / 864e5) + " dias";

    var listaHist = $("#hist-lista"), filtro = $("#hist-filtro"), mais = $("#hist-mais"), todos = false;
    function desenharHist() {
      var f = filtro.value;
      var itens = D.historico.filter(function (h) { return !f || h.tipo === f; });
      var vis = todos ? itens : itens.slice(0, 3);
      listaHist.innerHTML = vis.length ? vis.map(function (h) {
        return '<li><time datetime="' + h.d.toISOString().slice(0, 10) + '">' + L.dataExtenso(h.d) + "</time><b>" + esc(h.titulo) + "</b><span>" + h.tipo + " · " + h.prof + "</span></li>";
      }).join("") : '<li class="vazio">Nenhum atendimento deste tipo.</li>';
      mais.hidden = itens.length <= 3;
      mais.textContent = todos ? "Mostrar só os 3 mais recentes" : "Ver histórico completo (" + itens.length + ")";
      mais.setAttribute("aria-expanded", todos);
    }
    filtro.addEventListener("change", desenharHist);
    mais.addEventListener("click", function () { todos = !todos; desenharHist(); });
    desenharHist();

    $("#arq-lista").innerHTML = D.arquivos.map(function (a) {
      var acao = a.doc
        ? '<a class="btn btn-contorno btn-p" href="documento.html?tipo=' + a.doc + '">Abrir<span class="sr"> ' + esc(a.nome) + "</span></a>"
        : '<span class="sem-doc">Exemplo sem documento</span>';
      return "<li><div><b>" + esc(a.nome) + "</b><span>" + L.dataExtenso(a.d) + "</span></div>" + acao + "</li>";
    }).join("");

    $("#orc-lista").innerHTML = D.orcamentos.map(function (o) {
      return '<li><div><b>' + esc(o.titulo) + "</b><span>" + o.id + " · " + L.dataExtenso(o.d) + '</span></div><div class="lado"><span class="selo ' + (o.status === "Aprovado" ? "ok" : "analise") + '">' + o.status + "</span><strong>" + o.valor + '</strong><a href="documento.html?tipo=orcamento&amp;id=' + o.id + '">Abrir<span class="sr"> orçamento ' + o.id + "</span></a></div></li>";
    }).join("");

    $("#rec-lista").innerHTML = D.recibos.map(function (r) {
      return '<li><div><b>' + r.id + "</b><span>" + L.dataExtenso(r.d) + " · " + esc(r.ref) + '</span></div><div class="lado"><strong>' + r.valor + '</strong><a href="documento.html?tipo=recibo&amp;id=' + r.id + '">Abrir<span class="sr"> recibo ' + r.id + "</span></a></div></li>";
    }).join("");

    $("#msg-lista").innerHTML = D.mensagens.map(function (m) {
      return '<div class="bolha-msg"><b>' + esc(m.titulo) + "</b>" + esc(m.texto) + "<time>" + C.nome + " · " + L.dataExtenso(m.d) + "</time></div>";
    }).join("");

    /* Saudação pelo horário de Brasília */
    var agora = L.agoraClinica();
    var sauda = agora.hora < 12 ? "Bom dia" : agora.hora < 18 ? "Boa tarde" : "Boa noite";
    $$("[data-saudacao]").forEach(function (el) { el.textContent = sauda; });

    /* Contagem regressiva até a próxima consulta (14h, horário de Brasília) */
    function contagem() {
      var n = L.agoraClinica();
      var agoraMin = (L.dataCivil(n.ano, n.mes, n.dia) - hoje) / 6e4 + n.hora * 60 + n.minuto;
      var alvoMin = (D.proxima.data - hoje) / 6e4 + 14 * 60;
      var falta = Math.max(0, alvoMin - agoraMin);
      $("#cd-dias").textContent = Math.floor(falta / 1440);
      $("#cd-horas").textContent = Math.floor((falta % 1440) / 60);
      $("#cd-min").textContent = Math.floor(falta % 60);
    }
    contagem(); setInterval(contagem, 30000);
    $("#prox-ics").addEventListener("click", function () {
      L.baixarIcs({ data: D.proxima.data, hora: 14, minuto: 0, duracao: 50, arquivo: "consulta-lume-exemplo",
        titulo: "Consulta (exemplo): " + D.proxima.motivo, descricao: "Consulta fictícia da área do paciente de demonstração da " + C.nome + "." });
      L.toast && L.toast("Arquivo de calendário baixado. É um evento de exemplo.");
    });

    /* Plano de tratamento com progresso */
    var plano = [["Avaliação e tomografia", "feito"], ["Cirurgia do implante", "feito"], ["Cicatrização", "feito"], ["Moldagem e coroa", "atual"], ["Revisões periódicas", ""]];
    $("#plano-trilho").innerHTML = plano.map(function (p) { return '<span class="' + p[1] + '"></span>'; }).join("");
    $("#plano-etapas").innerHTML = plano.map(function (p) {
      return '<li class="' + p[1] + '"><span class="marca-e" aria-hidden="true"></span><span><b>' + p[0] + "</b>" + (p[1] === "feito" ? " · concluída" : p[1] === "atual" ? " · próxima etapa" : "") + "</span></li>";
    }).join("");

    /* Meus dados: alterações ficam só na memória desta página */
    var fc = $("#form-cadastro");
    fc.nome.value = D.cadastro.nome; fc.nascimento.value = D.cadastro.nascimento;
    fc.whatsapp.value = D.cadastro.whatsapp; fc.email.value = D.cadastro.email;
    L.mascaraTel(fc.whatsapp);
    fc.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = L.erroCampo(fc.nome, fc.nome.value.trim().length >= 2 ? "" : "Informe o nome completo.");
      var n = L.digitos(fc.whatsapp.value).length;
      ok = L.erroCampo(fc.whatsapp, n === 10 || n === 11 ? "" : "Informe o WhatsApp com DDD.") && ok;
      ok = L.erroCampo(fc.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fc.email.value) ? "" : "Informe um e-mail válido.") && ok;
      var st = $("#cad-status");
      st.hidden = false;
      if (!ok) { st.className = "status erro-geral"; st.textContent = "Revise os campos marcados."; return; }
      D.cadastro.nome = fc.nome.value.trim();
      st.className = "status sucesso";
      st.textContent = "Alterações aplicadas apenas nesta tela. Na demonstração nada é enviado nem salvo; ao recarregar, os dados fictícios voltam.";
      st.focus();
    });
  }

  /* ---------- Documento fictício (visualizar / imprimir) ---------- */
  if (pagina === "documento") {
    var q = new URLSearchParams(location.search), tipo = q.get("tipo"), id = q.get("id");
    var corpo = $("#doc-corpo"), tit = $("#doc-titulo"), html = "";
    var cab = function (data) {
      return '<dl class="doc-dados"><div><dt>Paciente</dt><dd>' + esc(C.pacienteDemo) + " (fictícia)</dd></div><div><dt>Data</dt><dd>" + L.dataCurta(data) +
        "</dd></div><div><dt>Profissional</dt><dd>" + C.responsavel + ", " + C.cro + "</dd></div></dl>";
    };
    if (tipo === "plano") {
      tit.textContent = "Plano de tratamento";
      html = cab(dia(-118)) + "<h2>Diagnóstico resumido</h2><p>Ausência do dente 36. Gengiva saudável e osso suficiente na tomografia para receber um implante.</p>" +
        "<h2>Etapas previstas</h2><ol><li>Cirurgia de implante com anestesia local.</li><li>Período de cicatrização, com revisão depois da cirurgia.</li><li>Moldagem e instalação da coroa.</li><li>Revisões periódicas.</li></ol>" +
        "<p>Prazos dependem da cicatrização e são confirmados a cada consulta.</p>";
    } else if (tipo === "orientacoes") {
      tit.textContent = "Orientações depois da cirurgia";
      html = cab(dia(-98)) + "<ul><li>Siga a medicação indicada pela dentista.</li><li>Evite esforço físico no primeiro dia.</li><li>Prefira alimentos frios ou mornos e macios nas primeiras horas.</li><li>Não faça bochechos vigorosos no primeiro dia.</li><li>Avise a clínica em caso de dor intensa, inchaço que aumenta ou sangramento que não para.</li></ul>";
    } else if (tipo === "recibo") {
      var r = D.recibos.filter(function (x) { return x.id === id; })[0];
      if (r) { tit.textContent = "Recibo " + r.id; html = cab(r.d) + "<p>Recebemos de " + esc(C.pacienteDemo) + " o valor de <strong>" + r.valor + "</strong> referente a: " + esc(r.ref) + ".</p><p>" + C.nome + ", CNPJ " + C.cnpj + ".</p>"; }
    } else if (tipo === "orcamento") {
      var o = D.orcamentos.filter(function (x) { return x.id === id; })[0];
      if (o) {
        tit.textContent = "Orçamento " + o.id;
        html = cab(o.d) + "<h2>" + esc(o.titulo) + "</h2><table><thead><tr><th scope=col>Item</th><th scope=col>Valor</th></tr></thead><tbody>" +
          o.itens.map(function (i) { return "<tr><td>" + esc(i[0]) + "</td><td>" + i[1] + "</td></tr>"; }).join("") +
          "</tbody><tfoot><tr><th scope=row>Total</th><td>" + o.valor + "</td></tr></tfoot></table><p>Situação: " + o.status + ".</p>";
      }
    }
    if (!html) { tit.textContent = "Documento não encontrado"; html = '<p>Este documento de exemplo não existe. <a href="paciente.html">Voltar para a área do paciente</a>.</p>'; $("#doc-imprimir").hidden = true; }
    corpo.innerHTML = html;
    document.title = tit.textContent + " (exemplo) | Área do paciente | " + C.nome;
    $("#doc-imprimir").addEventListener("click", function () { window.print(); });
  }
})();
