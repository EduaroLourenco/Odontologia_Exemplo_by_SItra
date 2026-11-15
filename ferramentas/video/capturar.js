// Captura as telas mobile (390x844 @2x) com interações reais, para os vídeos.
// uso: node cenas.js <saida>
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "lume-cena-"));
const proc = spawn(CHROME, ["--headless=new", "--remote-debugging-port=9335", "--user-data-dir=" + perfil, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BASE = "http://localhost:5500/";
const rolar = sel => `(function(){var e=document.querySelector(${JSON.stringify(sel)});document.documentElement.style.scrollBehavior="auto";if(e){var y=e.getBoundingClientRect().top+scrollY-70;scrollTo(0,y);}document.querySelector(".topo")&&document.querySelector(".topo").classList.remove("oculto");document.querySelectorAll("[data-revelar]").forEach(function(x){x.classList.add("visivel")});return 1})()`;
const clicar = sel => `(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)throw new Error("sem "+${JSON.stringify(sel)});e.click();return 1})()`;
const valor = (sel, v) => `(function(){var e=document.querySelector(${JSON.stringify(sel)});e.value=${JSON.stringify(v)};e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));return 1})()`;

// [nomeArquivo, url|null, [js...], esperaMs]
const CENAS = [
  ["p01-home", "index.html", [], 1800],
  ["p02-atalhos", null, [rolar(".rapidas")], 900],
  ["p03-implante", "implantes.html", [rolar(".palco")], 1400],
  ["p04-ag-esp", "agendamento.html", [], 1500],
  ["p05-ag-dia", null, [clicar("#opcoes-esp input[name=especialidade]"), clicar('[data-passo="proximo"]'), clicar("#faixa-dias button:not([disabled]):nth-of-type(2)")], 900],
  ["p06-ag-hora", null, [clicar('[data-passo="proximo"]'), clicar("#opcoes-hora input[name=hora]")], 900],
  ["p07-ag-dados", null, [clicar('[data-passo="proximo"]'), valor("#ag-nome", "Maria Oliveira"), valor("#ag-whatsapp", "(16) 91234-5678"), clicar("#ag-consentimento")], 900],
  ["p08-ag-ok", null, [clicar(".enviar-final")], 2600],
  ["p09-login", "login.html", [], 1400],
  ["p10-paciente", "paciente.html", [], 1800],
  ["p11-plano", null, [rolar("#plano")], 900],
  ["p12-mensagens", null, [rolar("#mensagens")], 900],
  ["p13-docs", null, [rolar("#arquivos")], 900],
  ["p14-anamnese", "anamnese.html", [], 1500],
  ["p15-urgencia", "urgencia.html", [], 1400],
  ["d01-para", "para-dentistas.html", [], 1600],
  ["d02-telas", null, [rolar(".telas-demo")], 900],
  ["d03-tour", "index.html", [clicar("[data-tour-iniciar]")], 1400],
  ["d04-demo", "index.html", [clicar('[data-abrir-sheet="sheet-demo"]')], 1200],
  ["d05-personalizar", "index.html", [clicar('[data-abrir-sheet="sheet-personalizar"]'), valor("#p-nome", "Sorriso Leve"), valor("#p-cidade", "Campinas, SP"), clicar('input[name=paleta][value="vinho"]')], 1200],
  ["d06-home-perso", null, [clicar("#form-personalizar button[type=submit]")], 3600],
  ["d07-trat-perso", null, [rolar("#t-trat")], 900],
  ["d08-ag-perso", "agendamento.html", [], 1500],
  ["d09-pac-perso", "paciente.html", [], 1800],
  ["d10-sitra", "para-dentistas.html", [rolar("#t-falar")], 1400],
];

(async () => {
  let ws;
  for (let i = 0; i < 40; i++) { try { const l = await (await fetch("http://127.0.0.1:9335/json/list")).json(); const p = l.find(x => x.type === "page"); if (p) { ws = new WebSocket(p.webSocketDebuggerUrl); break; } } catch (e) {} await sleep(250); }
  await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {};
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
  const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception.description); };
  await cmd("Page.enable");
  await cmd("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cmd("Emulation.setTouchEmulationEnabled", { enabled: true });
  await cmd("Page.navigate", { url: BASE + "index.html" }); await sleep(800);
  await ev(`localStorage.clear();localStorage.setItem("lume-cookies","recusado");localStorage.setItem("lume-tour-visto","1");sessionStorage.setItem("lume-demo-sessao","maria-oliveira");sessionStorage.setItem("lume-demo-fechada","1");1`);
  for (const [nome, url, js, espera] of CENAS) {
    if (url) { await cmd("Page.navigate", { url: BASE + url }); await sleep(1300); }
    for (const j of js) { await ev(j); await sleep(350); }
    await sleep(espera);
    const s = await cmd("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    fs.writeFileSync(path.join(OUT, nome + ".jpg"), Buffer.from(s.result.data, "base64"));
    console.log("ok", nome);
  }
  await ev(`localStorage.removeItem("lume-personalizado");1`);
  ws.close(); proc.kill(); process.exit(0);
})().catch(e => { console.error(e); proc.kill(); process.exit(1); });
