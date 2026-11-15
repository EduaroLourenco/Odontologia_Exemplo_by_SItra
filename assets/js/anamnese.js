/* Anamnese digital em MODO DEMONSTRAÇÃO.
   As respostas ficam só na memória desta página: nada vai para localStorage,
   sessionStorage, servidor ou WhatsApp. Ao recarregar, tudo é apagado. */
(function () {
  "use strict";
  var L = window.Lume, C = L.C, $ = L.$, $$ = L.$$;
  var form = $("#form-anamnese");
  if (!form) return;

  var passos = $$(".passo", form), atual = 0;
  var itensProg = $$(".progresso li"), barra = $("#barra-prog"), progTxt = $("#prog-texto");
  var btnVoltar = $("#btn-voltar"), btnAvancar = $("#btn-avancar"), btnEnviar = $("#btn-enviar");

  /* Dados pessoais fictícios da paciente de demonstração */
  form.nome.value = C.pacienteDemo;
  form.nascimento.value = "1987-05-14";
  form.telefone.value = "(16) 90000-0000";
  L.mascaraTel(form.telefone);

  /* Campos condicionais: "Sim" mostra e exige o detalhe */
  function condicionais() {
    $$("[data-se]", form).forEach(function (box) {
      var p = box.getAttribute("data-se").split("="), marcado = $('input[name="' + p[0] + '"]:checked', form);
      var mostra = !!marcado && marcado.value === p[1];
      box.hidden = !mostra;
      $$("input, textarea", box).forEach(function (i) { i.disabled = !mostra; if (!mostra) L.erroCampo(i, ""); });
    });
  }
  form.addEventListener("change", function (ev) {
    condicionais();
    if (ev.target.type === "radio" || ev.target.type === "checkbox") erroGrupo(ev.target.name, "");
  });
  condicionais();

  function erroGrupo(nome, msg) {
    var e = document.getElementById("erro-" + nome);
    if (!e) return !msg;
    e.hidden = !msg; $("span", e).textContent = msg || "";
    var fs = e.closest("fieldset"); if (fs) fs.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  var marcado = function (n) { return !!$('input[name="' + n + '"]:checked', form); };

  /* Regras por etapa: devolvem o primeiro campo com problema */
  var regras = [
    function () {
      var p = null;
      if (!L.erroCampo(form.nome, form.nome.value.trim().length >= 2 ? "" : "Informe o nome completo.")) p = p || form.nome;
      var nasc = form.nascimento.value, hoje = L.hojeCivil().toISOString().slice(0, 10);
      if (!L.erroCampo(form.nascimento, nasc && nasc < hoje && nasc > "1900-01-01" ? "" : "Informe uma data de nascimento válida.")) p = p || form.nascimento;
      var n = L.digitos(form.telefone.value).length;
      if (!L.erroCampo(form.telefone, n === 10 || n === 11 ? "" : "Informe o telefone com DDD.")) p = p || form.telefone;
      return p;
    },
    function () {
      var p = null;
      if (!erroGrupo("motivo", marcado("motivo") ? "" : "Marque pelo menos um motivo.")) p = p || $("input[name=motivo]", form);
      [["alergia", "alergiaQual", "Conte qual alergia."], ["medicamento", "medicamentoQual", "Conte quais medicamentos."], ["cronica", "cronicaQual", "Conte qual condição."]].forEach(function (x) {
        if (!erroGrupo(x[0], marcado(x[0]) ? "" : "Escolha uma opção.")) p = p || $('input[name="' + x[0] + '"]', form);
        var det = form[x[1]];
        if (!det.disabled && !L.erroCampo(det, det.value.trim() ? "" : x[2])) p = p || det;
      });
      if (!erroGrupo("gravidez", marcado("gravidez") ? "" : "Escolha uma opção.")) p = p || $("input[name=gravidez]", form);
      if (!L.erroCampo(form.ultima, form.ultima.value ? "" : "Escolha uma opção.")) p = p || form.ultima;
      return p;
    },
    function () {
      var p = null;
      ["fuma", "bruxismo", "sensibilidade"].forEach(function (n) {
        if (!erroGrupo(n, marcado(n) ? "" : "Escolha uma opção.")) p = p || $('input[name="' + n + '"]', form);
      });
      return p;
    },
    function () {
      return erroGrupo("consentimento", form.consentimento.checked ? "" : "Para enviar, é preciso autorizar o uso dos dados.") ? null : form.consentimento;
    }
  ];

  function valor(n) {
    var els = $$('[name="' + n + '"]', form);
    if (!els.length) return "";
    if (els[0].type === "radio") { var m = els.filter(function (e) { return e.checked; })[0]; return m ? m.value : "Não respondido"; }
    if (els[0].type === "checkbox") return els.filter(function (e) { return e.checked; }).map(function (e) { return e.value; }).join(", ") || "Não respondido";
    return els[0].value.trim() || "Não informado";
  }
  function comDetalhe(n, det) { var v = valor(n); return v === "Sim" ? "Sim: " + valor(det) : v; }
  function resumo() {
    var nasc = form.nascimento.value ? form.nascimento.value.split("-").reverse().join("/") : "Não informado";
    var blocos = [
      ["Dados", 0, [["Nome", valor("nome")], ["Nascimento", nasc], ["Telefone", valor("telefone")]]],
      ["Saúde", 1, [["Motivo", valor("motivo")], ["Descrição", valor("descricao")], ["Alergias", comDetalhe("alergia", "alergiaQual")],
        ["Medicamentos", comDetalhe("medicamento", "medicamentoQual")], ["Gravidez", valor("gravidez")],
        ["Condição crônica", comDetalhe("cronica", "cronicaQual")], ["Última consulta", valor("ultima")]]],
      ["Hábitos", 2, [["Fuma", valor("fuma")], ["Bruxismo", valor("bruxismo")], ["Sensibilidade", valor("sensibilidade")], ["Observações", valor("observacao")]]]
    ];
    var box = $("#resumo");
    box.innerHTML = blocos.map(function (b) {
      return '<section class="resumo-bloco"><div class="resumo-topo"><h3>' + b[0] + '</h3><button type="button" class="link-btn" data-ir="' + b[1] + '">Editar<span class="sr"> ' + b[0].toLowerCase() + "</span></button></div><dl>" +
        b[2].map(function () { return "<div><dt></dt><dd></dd></div>"; }).join("") + "</dl></section>";
    }).join("");
    /* textContent evita injetar HTML digitado pela pessoa */
    var dts = $$("dt", box), dds = $$("dd", box), i = 0;
    blocos.forEach(function (b) { b[2].forEach(function (par) { dts[i].textContent = par[0]; dds[i].textContent = par[1]; i++; }); });
  }
  $("#resumo").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-ir]"); if (b) ir(+b.getAttribute("data-ir"));
  });

  function ir(n) {
    atual = n;
    passos.forEach(function (p, i) { p.hidden = i !== n; });
    itensProg.forEach(function (li, i) {
      li.classList.toggle("feito", i < n);
      li.classList.toggle("atual", i === n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    barra.style.width = ((n + 1) / passos.length * 100) + "%";
    progTxt.textContent = "Etapa " + (n + 1) + " de " + passos.length + ": " + $("legend, h2", passos[n]).textContent.trim();
    btnVoltar.hidden = n === 0;
    btnAvancar.hidden = n === passos.length - 1;
    btnEnviar.hidden = n !== passos.length - 1;
    if (n === passos.length - 1) resumo();
    var h = $("h2", passos[n]); h.setAttribute("tabindex", "-1"); h.focus();
  }
  btnAvancar.addEventListener("click", function () {
    var problema = regras[atual]();
    if (problema) { problema.focus(); return; }
    ir(atual + 1);
  });
  btnVoltar.addEventListener("click", function () { ir(atual - 1); });

  $("#preencher-exemplo").addEventListener("click", function () {
    ["Revisão", "Implante"].forEach(function (v) { $('input[name=motivo][value="' + v + '"]', form).checked = true; });
    $('input[name=alergia][value="Não"]', form).checked = true;
    $('input[name=medicamento][value="Sim"]', form).checked = true;
    $('input[name=gravidez][value="Não"]', form).checked = true;
    $('input[name=cronica][value="Sim"]', form).checked = true;
    condicionais();
    form.medicamentoQual.value = "Remédio de uso contínuo (exemplo fictício)";
    form.cronicaQual.value = "Pressão alta controlada (exemplo fictício)";
    form.ultima.value = "Entre 6 meses e 1 ano";
    $$(".erro", passos[1]).forEach(function (e) { e.hidden = true; });
    $("#preencher-status").textContent = "Respostas fictícias preenchidas. Revise e continue.";
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var problema = regras[3]();
    if (problema) { problema.focus(); return; }
    btnEnviar.disabled = true; btnEnviar.setAttribute("aria-busy", "true");
    var st = $("#anamnese-status");
    st.hidden = false; st.className = "status"; st.textContent = "Enviando (simulado)…";
    setTimeout(function () {
      form.reset();
      form.hidden = true;
      $(".progresso-box").hidden = true;
      var ok = $("#anamnese-ok"); ok.hidden = false; ok.focus();
    }, 800);
  });

  ir(0);
  /* O foco inicial fica no topo da página, não no título da etapa */
  document.activeElement.blur();
})();
