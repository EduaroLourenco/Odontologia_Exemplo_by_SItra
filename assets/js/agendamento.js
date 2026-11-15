/* Pré-agendamento demonstrativo: especialidade, dia, horário preferido e dados.
   Não reserva vagas: sem integração com agenda, tudo é "preferência" a confirmar. */
(function () {
  "use strict";
  var L = window.Lume, C = L.C, $ = L.$, $$ = L.$$;
  var form = $("#form-agenda");
  if (!form) return;

  var estado = { esp: "", dia: null, hora: "" };
  var hoje = L.hojeCivil();
  var limite = L.somaDias(hoje, C.antecedenciaMaximaDias || 60);
  var mesVisivel = L.dataCivil(hoje.getUTCFullYear(), hoje.getUTCMonth() + 1, 1);
  var params = new URLSearchParams(location.search);

  /* ---------- Etapa 1: especialidade ---------- */
  var boxEsp = $("#opcoes-esp");
  var ICO = {
    avaliacao: '<path d="M8.5 4.5c-2.6 0-4.5 2.2-4.5 5.2 0 3.4 1.7 5.3 2.6 8.6.5 2 1.2 4.2 2.6 4.2s1.8-2.6 2.2-4.6c.3-1.3.8-2 2.1-2s1.8.7 2.1 2c.4 2 .8 4.6 2.2 4.6s2.1-2.2 2.6-4.2c.9-3.3 2.6-5.2 2.6-8.6 0-3-1.9-5.2-4.5-5.2-1.8 0-2.6.9-4.3.9s-2.4-.9-4.3-.9z" transform="translate(-1 -1) scale(.95)"/>',
    implantes: '<path d="M8 3.5h8l-.8 4.5H8.8z"/><path d="M9.2 8h5.6M9.6 11h4.8M10 14h4M10.4 17h3.2"/><path d="M9.2 8l1.4 12.5h2.8L14.8 8"/>',
    ortodontia: '<path d="M3.5 9.5c2.5 3.5 14.5 3.5 17 0"/><path d="M3.5 9.5c0 5 3.5 9 8.5 9s8.5-4 8.5-9"/><path d="M7 11.4v2.2M12 12.3v2.2M17 11.4v2.2M5 12.7h14"/>',
    clareamento: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    lentes: '<rect x="6" y="3.5" width="12" height="17" rx="6"/><path d="M9 8.5c1.8-1 4.2-1 6 0"/>',
    prevencao: '<path d="M5 20 14.5 10.5"/><rect x="13.2" y="3.4" width="5" height="9" rx="1.5" transform="rotate(45 15.7 7.9)"/><path d="M15 5.5l2.8 2.8M13.6 6.9l2.8 2.8"/>',
    urgencia: '<path d="M12 3.5 21 19.5H3z"/><path d="M12 10v4.5M12 17v.2"/>'
  };
  boxEsp.innerHTML = C.especialidades.map(function (e) {
    return '<label class="chip"><input type="radio" name="especialidade" value="' + e.id + '" data-nome="' + e.nome + '"><span><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICO[e.id] || ICO.avaliacao) + "</svg>" + e.nome + "</span></label>";
  }).join("");
  form.addEventListener("change", function (ev) {
    if (ev.target.name === "especialidade") { estado.esp = ev.target.getAttribute("data-nome"); limparErro("especialidade"); }
    if (ev.target.name === "hora") { estado.hora = ev.target.value; limparErro("hora"); }
    atualizar();
  });
  var pre = params.get("esp");
  if (pre) { var r = $('input[name=especialidade][value="' + pre + '"]', form); if (r) { r.checked = true; estado.esp = r.getAttribute("data-nome"); } }

  /* ---------- Etapa 2: calendário ---------- */
  var grade = $("#cal-dias"), titulo = $("#cal-titulo");
  var btnAnt = $("#cal-ant"), btnProx = $("#cal-prox");
  function motivoIndisponivel(dt) {
    if (dt < hoje) return "data passada";
    if (dt > limite) return "fora do período de " + (C.antecedenciaMaximaDias || 60) + " dias";
    if (C.diasAbertos.indexOf(dt.getUTCDay()) < 0) return "clínica fechada";
    if (dt.getTime() === hoje.getTime() && horariosDoDia(dt).length === 0) return "sem horários restantes hoje";
    return "";
  }
  function desenharCalendario() {
    var ano = mesVisivel.getUTCFullYear(), mes = mesVisivel.getUTCMonth();
    titulo.textContent = L.MESES[mes].charAt(0).toUpperCase() + L.MESES[mes].slice(1) + " de " + ano;
    var primeiroDiaSemana = mesVisivel.getUTCDay();
    var diasNoMes = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
    var html = "";
    for (var i = 0; i < primeiroDiaSemana; i++) html += '<span class="cal-vazio" aria-hidden="true"></span>';
    for (var d = 1; d <= diasNoMes; d++) {
      var dt = L.dataCivil(ano, mes + 1, d), motivo = motivoIndisponivel(dt);
      var sel = estado.dia && estado.dia.getTime() === dt.getTime();
      var eHoje = dt.getTime() === hoje.getTime();
      html += '<button type="button" class="cal-dia' + (eHoje ? " hoje" : "") + '" data-t="' + dt.getTime() + '"' +
        ' aria-pressed="' + sel + '"' + (motivo ? " disabled" : "") +
        ' aria-label="' + L.dataExtenso(dt, true) + (eHoje ? ", hoje" : "") + (motivo ? ", indisponível: " + motivo : "") + '"' +
        (motivo ? ' title="Indisponível: ' + motivo + '"' : "") + ">" + d + "</button>";
    }
    grade.innerHTML = html;
    btnAnt.disabled = ano === hoje.getUTCFullYear() && mes === hoje.getUTCMonth();
    var proxMes = L.dataCivil(ano, mes + 2, 1);
    btnProx.disabled = proxMes > limite;
  }
  btnAnt.addEventListener("click", function () { mesVisivel = L.dataCivil(mesVisivel.getUTCFullYear(), mesVisivel.getUTCMonth(), 1); desenharCalendario(); });
  btnProx.addEventListener("click", function () { mesVisivel = L.dataCivil(mesVisivel.getUTCFullYear(), mesVisivel.getUTCMonth() + 2, 1); desenharCalendario(); });
  function escolherDia(t, origem) {
    estado.dia = new Date(t);
    estado.hora = "";
    mesVisivel = L.dataCivil(estado.dia.getUTCFullYear(), estado.dia.getUTCMonth() + 1, 1);
    desenharCalendario(); desenharFaixa();
    var alvo = (origem === "faixa" ? faixaDias : grade).querySelector('[data-t="' + t + '"]');
    if (alvo) alvo.focus();
    limparErro("dia");
    desenharHorarios();
    atualizar();
  }
  grade.addEventListener("click", function (ev) {
    var b = ev.target.closest(".cal-dia");
    if (!b || b.disabled) return;
    escolherDia(+b.getAttribute("data-t"), "grade");
  });

  /* Faixa horizontal de dias (celular): próximos dias de atendimento */
  var faixaDias = $("#faixa-dias");
  function desenharFaixa() {
    if (!faixaDias) return;
    var html = "", d = hoje, n = 0;
    while (n < 21 && d <= limite) {
      if (!motivoIndisponivel(d)) {
        var sel = estado.dia && estado.dia.getTime() === d.getTime();
        html += '<button type="button" data-t="' + d.getTime() + '" aria-pressed="' + sel + '" aria-label="' + L.dataExtenso(d, true) + '"><small>' +
          L.SEMANA[d.getUTCDay()].slice(0, 3) + "</small><b>" + d.getUTCDate() + "</b><small>" + L.MESES[d.getUTCMonth()].slice(0, 3) + "</small></button>";
        n++;
      }
      d = L.somaDias(d, 1);
    }
    faixaDias.innerHTML = html;
  }
  if (faixaDias) faixaDias.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (b) escolherDia(+b.getAttribute("data-t"), "faixa");
  });
  var alternar = $("#cal-alternar"), calWrap = $("#cal-wrap");
  if (alternar) alternar.addEventListener("click", function () {
    calWrap.hidden = !calWrap.hidden;
    alternar.setAttribute("aria-expanded", !calWrap.hidden);
    alternar.textContent = calWrap.hidden ? "Ver o calendário do mês" : "Esconder o calendário";
  });
  /* Setas do teclado entre os dias */
  grade.addEventListener("keydown", function (ev) {
    var passos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(ev.key in passos)) return;
    var dias = $$(".cal-dia", grade), i = dias.indexOf(document.activeElement);
    if (i < 0) return;
    ev.preventDefault();
    for (var j = i + passos[ev.key]; j >= 0 && j < dias.length; j += passos[ev.key]) {
      if (!dias[j].disabled) { dias[j].focus(); break; }
    }
  });

  /* ---------- Etapa 3: horário preferido ---------- */
  function horariosDoDia(dt) {
    var lista = dt.getUTCDay() === 6 ? C.horariosPreferidos.sabado : C.horariosPreferidos.semana;
    if (dt.getTime() !== hoje.getTime()) return lista;
    var n = L.agoraClinica(), agora = n.hora * 60 + n.minuto + 60; /* pelo menos 1h de antecedência */
    return lista.filter(function (h) { var p = h.split(":"); return +p[0] * 60 + +p[1] >= agora; });
  }
  var boxHora = $("#opcoes-hora");
  function desenharHorarios() {
    if (!estado.dia) { boxHora.innerHTML = '<p class="vazio">Escolha um dia no calendário para ver os horários.</p>'; return; }
    var lista = horariosDoDia(estado.dia);
    var grupo = function (rot, hs) {
      return hs.length ? '<div class="grupo-hora" role="group" aria-label="' + rot + '"><h4>' + rot + '</h4><div class="chips">' + hs.map(function (h) {
        return '<label class="chip"><input type="radio" name="hora" value="' + h + '"' + (h === estado.hora ? " checked" : "") + "><span>" + h.replace(":", "h") + "</span></label>";
      }).join("") + "</div></div>" : "";
    };
    boxHora.innerHTML = '<p class="dica-dia">' + L.dataExtenso(estado.dia, true) + "</p>" +
      grupo("Manhã", lista.filter(function (h) { return +h.slice(0, 2) < 12; })) +
      grupo("Tarde", lista.filter(function (h) { return +h.slice(0, 2) >= 12; }));
  }

  /* ---------- Etapa 4: dados ---------- */
  L.mascaraTel(form.whatsapp);
  var conv = form.convenio;
  conv.innerHTML = '<option value="">Particular ou não sei</option>' +
    C.convenios.map(function (c) { return "<option>" + c + "</option>"; }).join("") + '<option value="Outro">Outro convênio</option>';
  var sessao = null;
  try { sessao = sessionStorage.getItem("lume-demo-sessao"); } catch (x) {}
  if (params.get("retorno") && sessao) {
    form.nome.value = C.pacienteDemo;
    var r2 = $('input[name=especialidade][value="avaliacao"]', form);
    $("#aviso-retorno").hidden = false;
    if (r2 && !estado.esp) { r2.checked = true; estado.esp = r2.getAttribute("data-nome"); }
  }

  var regras = {
    nome: function () { return form.nome.value.trim().length >= 2 ? "" : "Informe o seu nome completo."; },
    whatsapp: function () { var n = L.digitos(form.whatsapp.value).length; return n === 10 || n === 11 ? "" : "Informe o WhatsApp com DDD, por exemplo (16) 91234-5678."; },
    consentimento: function () { return form.consentimento.checked ? "" : "Marque a concordância para enviarmos a solicitação."; }
  };
  Object.keys(regras).forEach(function (n) {
    var el = form[n];
    el.addEventListener(n === "consentimento" ? "change" : "blur", function () {
      if (el.getAttribute("aria-invalid")) L.erroCampo(el, regras[n]());
      atualizar();
    });
    el.addEventListener("input", atualizar);
  });
  function erroGrupo(nome, msg) {
    var e = document.getElementById("erro-" + nome);
    e.hidden = !msg; $("span", e).textContent = msg || "";
  }
  function limparErro(nome) { erroGrupo(nome, ""); }

  /* ---------- Progresso e resumo ---------- */
  var etapas = $$(".progresso li"), barra = $("#barra-prog"), progTxt = $("#prog-texto");
  function dadosOk() { return !regras.nome() && !regras.whatsapp() && !regras.consentimento(); }
  function atualizar() {
    var feitos = [!!estado.esp, !!estado.dia, !!estado.hora, dadosOk()];
    var n = feitos.filter(Boolean).length;
    etapas.forEach(function (li, i) {
      li.classList.toggle("feito", feitos[i]);
      $(".estado", li).textContent = feitos[i] ? ", concluída" : ", pendente";
    });
    barra.style.width = (n / 4 * 100) + "%";
    progTxt.textContent = n + " de 4 etapas concluídas";
    $("#r-esp").textContent = estado.esp || "Não escolhida";
    $("#r-dia").textContent = estado.dia ? L.dataExtenso(estado.dia, true) : "Não escolhido";
    $("#r-hora").textContent = estado.hora ? estado.hora.replace(":", "h") + " (preferência)" : "Não escolhido";
    $("#r-conv").textContent = conv.value || "Particular ou não sei";
  }

  /* ---------- Envio ---------- */
  var ok = $("#agenda-ok");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var primeiro = null;
    if (!estado.esp) { erroGrupo("especialidade", "Escolha uma especialidade."); primeiro = primeiro || $("input[name=especialidade]", form); }
    if (!estado.dia) { erroGrupo("dia", "Escolha um dia de preferência."); primeiro = primeiro || $(".cal-dia:not([disabled])", grade); }
    if (!estado.hora) { erroGrupo("hora", estado.dia ? "Escolha um horário de preferência." : "Escolha primeiro o dia e depois o horário."); primeiro = primeiro || $("input[name=hora]", form) || $(".cal-dia:not([disabled])", grade); }
    Object.keys(regras).forEach(function (n) { if (!L.erroCampo(form[n], regras[n]())) primeiro = primeiro || form[n]; });
    var status = $("#agenda-status");
    if (primeiro) {
      status.hidden = false; status.className = "status erro-geral";
      status.textContent = "Revise os campos marcados antes de enviar.";
      primeiro.focus(); return;
    }
    var botao = $("button[type=submit]", form);
    botao.disabled = true; botao.setAttribute("aria-busy", "true");
    status.hidden = false; status.className = "status"; status.textContent = "Registrando a solicitação simulada…";
    setTimeout(function () {
      var n = L.agoraClinica();
      var protocolo = "LUME-DEMO-" + n.ano + ("0" + n.mes).slice(-2) + ("0" + n.dia).slice(-2) + "-" + String(Math.floor(1000 + Math.random() * 9000));
      $("#ok-protocolo").textContent = protocolo;
      $("#ok-resumo").innerHTML =
        "<div><dt>Especialidade</dt><dd>" + estado.esp + "</dd></div>" +
        "<div><dt>Dia de preferência</dt><dd>" + L.dataExtenso(estado.dia, true) + "</dd></div>" +
        "<div><dt>Horário de preferência</dt><dd>" + estado.hora.replace(":", "h") + "</dd></div>" +
        "<div><dt>Nome</dt><dd></dd></div><div><dt>WhatsApp</dt><dd></dd></div>";
      var dds = $$("#ok-resumo dd");
      dds[3].textContent = form.nome.value.trim(); dds[4].textContent = form.whatsapp.value;
      var envio = $("#ok-wa");
      if (L.temWA) {
        envio.hidden = false;
        envio.href = L.wa(C.whatsapp, "Olá! Solicitação de pré-agendamento pelo site da {nome}.\nProtocolo: " + protocolo +
          "\nEspecialidade: " + estado.esp + "\nDia de preferência: " + L.dataCurta(estado.dia) + "\nHorário de preferência: " + estado.hora +
          "\nNome: " + form.nome.value.trim() + "\nConvênio: " + (conv.value || "particular ou não sei") +
          (form.observacoes.value.trim() ? "\nObservações: " + form.observacoes.value.trim() : ""));
      }
      var hm = estado.hora.split(":");
      $("#ok-ics").onclick = function () {
        L.baixarIcs({ data: estado.dia, hora: +hm[0], minuto: +hm[1], duracao: 50, arquivo: "pre-agendamento-lume",
          titulo: "Pré-agendamento (a confirmar): " + C.nome,
          descricao: "Preferência enviada pelo site. A consulta só está marcada depois da confirmação da recepção. Protocolo de demonstração: " + protocolo });
      };
      form.hidden = true; ok.hidden = false; ok.focus();
      ok.scrollIntoView({ block: "start" });
      window.dataLayer.push({ event: "pre_agendamento_simulado", especialidade: estado.esp });
      botao.disabled = false; botao.removeAttribute("aria-busy"); status.hidden = true;
    }, 700);
  });
  $("#ok-nova").addEventListener("click", function () {
    form.reset(); estado = { esp: "", dia: null, hora: "" };
    $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
    $$(".erro", form).forEach(function (e) { e.hidden = true; });
    desenharCalendario(); desenharFaixa(); desenharHorarios(); atualizar(); irEtapa(0);
    ok.hidden = true; form.hidden = false; $("input[name=especialidade]", form).focus();
  });

  /* ---------- Celular: uma etapa por tela ---------- */
  var etapasF = $$(".etapa", form), etapaAtual = 0, mqPassos = matchMedia("(max-width: 767px)");
  var navP = $(".passos-nav", form), btnVolta = $('[data-passo="voltar"]', form), btnSegue = $('[data-passo="proximo"]', form);
  function irEtapa(i) {
    etapaAtual = i;
    etapasF.forEach(function (f, j) { f.classList.toggle("atual", j === i); f.classList.toggle("ultima", j === etapasF.length - 1); });
    if (btnVolta) btnVolta.hidden = i === 0;
    if (btnSegue) btnSegue.hidden = i === etapasF.length - 1;
    if (mqPassos.matches) {
      $("#prog-texto").textContent = "Etapa " + (i + 1) + " de 4";
      var leg = $("legend", etapasF[i]); if (leg) { leg.setAttribute("tabindex", "-1"); }
    }
  }
  function modoPassos() { form.classList.toggle("modo-passos", mqPassos.matches); irEtapa(etapaAtual); }
  mqPassos.addEventListener("change", modoPassos);
  if (btnSegue) btnSegue.addEventListener("click", function () {
    var ok1 = [!!estado.esp, !!estado.dia, !!estado.hora][etapaAtual];
    if (!ok1) {
      var msgs = ["Escolha uma especialidade.", "Escolha um dia de preferência.", "Escolha um horário de preferência."];
      erroGrupo(["especialidade", "dia", "hora"][etapaAtual], msgs[etapaAtual]);
      return;
    }
    irEtapa(etapaAtual + 1);
    form.scrollIntoView({ block: "start", behavior: "smooth" });
  });
  if (btnVolta) btnVolta.addEventListener("click", function () { irEtapa(Math.max(0, etapaAtual - 1)); form.scrollIntoView({ block: "start" }); });

  desenharCalendario(); desenharFaixa(); desenharHorarios(); atualizar(); modoPassos();
})();
