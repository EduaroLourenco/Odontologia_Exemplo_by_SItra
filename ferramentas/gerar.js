/* Gerador das páginas estáticas da Lume Odontologia.
   Uso (na pasta do site):  node ferramentas/gerar.js
   Sem dependências. Cabeçalho, rodapé, navegação e painéis ficam aqui uma vez só;
   o conteúdo de cada página fica na função page() correspondente.
   Os dados trocáveis (nome, contatos, horários) continuam em assets/js/config.js. */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "..");
const DOM = "https://www.exemplo.com.br/";

/* ---------------- Ícones (traço único, mesmo estilo) ---------------- */
const svg = (d, extra = "") => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"${extra}>${d}</svg>`;
const I = {
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  mais: svg('<path d="M5 12h14"/><path class="v" d="M12 5v14"/>'),
  tel: svg('<path d="M6 3.5h3l1.8 4.6-2.3 1.4a11 11 0 0 0 6 6l1.4-2.3 4.6 1.8v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4 5.5a2 2 0 0 1 2-2z"/>'),
  pino: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  chat: svg('<path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H8.5L4 19.5z"/>'),
  cal: svg('<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  cadeado: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>'),
  info: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>'),
  casa: svg('<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z"/>'),
  grade: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>'),
  usuario: svg('<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/>'),
  dente: svg('<path d="M8 3.8c-2.7 0-4.6 2.3-4.6 5.4 0 3.5 1.8 5.5 2.7 8.9.5 2 1.2 4.1 2.6 4.1s1.8-2.6 2.2-4.6c.3-1.3.8-2 2.1-2s1.8.7 2.1 2c.4 2 .8 4.6 2.2 4.6s2.1-2.1 2.6-4.1c.9-3.4 2.7-5.4 2.7-8.9 0-3.1-1.9-5.4-4.6-5.4-1.9 0-2.7.9-4.4.9S9.9 3.8 8 3.8z"/>'),
  implante: svg('<path d="M7.5 3.5h9l-.9 4.5H8.4z"/><path d="M9.2 8l1.4 12.5h2.8L14.8 8M9.6 11h4.8M10 14h4M10.4 17h3.2"/>'),
  alinhador: svg('<path d="M3.5 9.5c2.5 3.5 14.5 3.5 17 0"/><path d="M3.5 9.5c0 5 3.5 9 8.5 9s8.5-4 8.5-9"/><path d="M7 11.4v2.2M12 12.3v2.2M17 11.4v2.2"/>'),
  brilho: svg('<path d="M12 3.5l1.9 5.2 5.1 1.9-5.1 1.9L12 17.7l-1.9-5.2L5 10.6l5.1-1.9z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
  faceta: svg('<rect x="6" y="3.5" width="12" height="17" rx="6"/><path d="M9 8.5c1.8-1 4.2-1 6 0"/>'),
  escova: svg('<path d="M5 20 14.5 10.5"/><rect x="13.2" y="3.4" width="5" height="9" rx="1.5" transform="rotate(45 15.7 7.9)"/><path d="M15 5.5l2.8 2.8M13.6 6.9l2.8 2.8"/>'),
  alerta: svg('<path d="M12 3.5 21 19.5H3z"/><path d="M12 10v4.5M12 17v.2"/>'),
  relogio: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  escudo: svg('<path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.7-7 9-4.1-1.3-7-4.7-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),
  acesso: svg('<circle cx="12" cy="4.8" r="1.8"/><path d="M5 8.5c2.3.7 4.6 1 7 1s4.7-.3 7-1M12 9.5v5M12 14.5 9 21M12 14.5 15 21"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  coracao: svg('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>'),
  folha: svg('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9"/>'),
  doc: svg('<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5V8h4M9.5 12h5M9.5 15.5h5"/>'),
  seta: svg('<path d="M9.5 6l6 6-6 6"/>'),
  esq: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg>',
  dir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>',
  celular: svg('<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>'),
  crianca: svg('<circle cx="12" cy="7" r="3"/><path d="M7 21v-5a5 5 0 0 1 10 0v5M9.5 7h.01M14.5 7h.01"/>'),
  copo: svg('<path d="M7 4h10l-1.3 15a1.5 1.5 0 0 1-1.5 1.4H9.8a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M7.5 9h9"/>'),
};
const SIMB = `<svg class="simbolo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--cor-ancora)"/><path d="M8 16c3 7.5 13 7.5 16 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="22" cy="9.2" r="2.8" fill="#F2C14E"/></svg>`;
const bolha = (ico, extra = "") => `<span class="ico-bolha${extra}">${I[ico]}</span>`;

const img = (nome, tams, w, h, alt, sizes, extra = "") =>
  `<img src="assets/img/${nome}-${tams[0]}.webp" srcset="${tams.map(t => `assets/img/${nome}-${t}.webp ${t}w`).join(", ")}" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" ${extra || 'loading="lazy" decoding="async"'}>`;
const erro = id => `<p class="erro" id="erro-${id}" hidden>${I.mais}<span></span></p>`;
const marca = `<a class="marca" href="index.html">${SIMB}<span class="nome-marca"><b data-c="marca">Lume</b><span class="comp" data-c="complemento">Odontologia</span></span></a>`;
const ag = (esp, label, waTexto, waMsg, origem, cls = "link") =>
  `<a class="${cls}" href="agendamento.html?esp=${esp}" data-wa="${waMsg}" data-wa-texto="${waTexto}" data-origem="${origem}">${label}</a>`;
const btnAgendar = (origem, texto = "Agendar avaliação", esp = "", extra = "") =>
  `<a class="btn ${extra}" href="agendamento.html${esp ? "?esp=" + esp : ""}" data-evento="clique_agendar" data-origem="${origem}">${I.cal}${texto}</a>`;
const migalhas = itens => `<nav class="migalhas" aria-label="Você está em"><ol>${itens.map(([n, u], i) => i === itens.length - 1 ? `<li aria-current="page">${n}</li>` : `<li><a href="${u}">${n}</a></li>`).join("")}</ol></nav>`;
const carrossel = (titulo, itens, cls = "") => `
        <div class="carrossel-box" data-carrossel>
          <div class="carrossel ${cls}" role="list" aria-label="${titulo}">${itens.map(i => `<div role="listitem">${i}</div>`).join("")}</div>
          <div class="pontos" aria-hidden="true"></div>
        </div>`;
const ctrl = `<div class="carrossel-ctrl"><button type="button" data-ant aria-label="Anterior">${I.esq}</button><button type="button" data-prox aria-label="Próximo">${I.dir}</button></div>`;
/* Carrossel com controles no topo da seção: o box precisa envolver os botões */
const secaoCarrossel = (id, sobre, titulo, desc, linkTxt, linkHref, itens, cls = "", tour = "") => `
      <div class="wrap" data-carrossel${tour}>
        <div class="secao-topo">
          <div>${sobre ? `<p class="sobretitulo">${sobre}</p>` : ""}<h2 id="${id}">${titulo}</h2>${desc ? `<p>${desc}</p>` : ""}</div>
          <div class="carrossel-ctrl">${linkTxt ? `<a class="ver-todos" href="${linkHref}">${linkTxt}</a>` : ""}<button type="button" data-ant aria-label="Anterior">${I.esq}</button><button type="button" data-prox aria-label="Próximo">${I.dir}</button></div>
        </div>
        <div class="carrossel ${cls}" role="list" aria-labelledby="${id}">${itens.map(i => `<div role="listitem">${i}</div>`).join("")}</div>
        <div class="pontos" aria-hidden="true"></div>
      </div>`;

function faqHtml(id, itens) {
  return `<div class="faq">${itens.map(([q, a], i) => `
          <div class="faq-item">
            <h3><button type="button" aria-expanded="false" aria-controls="${id}-${i}">${q}${I.mais}</button></h3>
            <div class="faq-painel" id="${id}-${i}"><p>${a}</p></div>
          </div>`).join("")}
        </div>`;
}
const faqLd = itens => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: itens.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const crumbLd = itens => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: itens.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: DOM + u })) });

/* ---------------- Dados dos tratamentos ---------------- */
const TRAT = [
  { id: "implantes", nome: "Implantes dentários", curto: "Implantes", ico: "implante", foto: "raio-x", cat: "reabilitacao", resumo: "Reposição de dentes ausentes com planejamento digital e acompanhamento depois da cirurgia." },
  { id: "ortodontia", nome: "Ortodontia e alinhadores", curto: "Ortodontia", ico: "alinhador", foto: "alinhador", cat: "estetica criancas", resumo: "Aparelho fixo ou alinhadores transparentes, conforme o que a avaliação indicar." },
  { id: "clareamento", nome: "Clareamento dental", curto: "Clareamento", ico: "brilho", foto: "clareamento", cat: "estetica", resumo: "No consultório ou em casa com supervisão, depois de avaliar dentes e gengivas." },
  { id: "lentes", nome: "Lentes e facetas", curto: "Lentes e facetas", ico: "faceta", foto: "lentes", cat: "estetica", resumo: "Ajustes de forma, cor e alinhamento quando há indicação clínica, com ensaio antes." },
  { id: "prevencao", nome: "Prevenção e limpeza", curto: "Prevenção", ico: "escova", foto: "escovas", cat: "prevencao criancas", resumo: "Revisões, limpeza profissional e orientação de higiene para toda a família." },
  { id: "urgencia", nome: "Urgência odontológica", curto: "Urgência", ico: "alerta", foto: "urgencia", cat: "urgencia", resumo: "Dor, dente quebrado ou inchaço. Veja o que fazer agora e fale com a recepção." },
];
const cartaoTrat = (t, lazy = true) => `<a class="cartao-trat" href="${t.id}.html">
            <span class="foto">${img(t.foto, [640, 1200], 1200, 900, "", "(min-width: 1024px) 400px, 80vw", lazy ? "" : 'decoding="async"').replace('alt=""', 'alt="" style="view-transition-name: vt-' + t.id + '"')}${bolha(t.ico)}</span>
            <span class="corpo"><h3>${t.nome}</h3><p>${t.resumo}</p><span class="mais">Ver tratamento ${I.seta}</span></span>
          </a>`;

/* ---------------- Partes compartilhadas ---------------- */
const navPublica = [["tratamentos.html", "Tratamentos", "tratamentos"], ["primeira-consulta.html", "Primeira consulta", "primeira"], ["sobre.html", "A clínica", "sobre"], ["contato.html", "Contato", "contato"]];
const cabecalhoPublico = atual => `
  <header class="topo">
    <div class="wrap">
      ${marca}
      <nav class="nav" aria-label="Principal">
        <ul>${navPublica.map(([h, t, k]) => `<li><a href="${h}"${k === atual ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}<li><a class="area" href="login.html"${atual === "paciente" ? ' aria-current="page"' : ""} data-tour="4" data-tour-titulo="Área do paciente" data-tour-texto="O paciente acompanha consultas, documentos e preenche a anamnese antes de vir. Entre com a paciente fictícia para ver.">Área do paciente</a></li><li>${btnAgendar("cabecalho", "Agendar", "", "").replace('class="btn "', 'class="btn" data-tour="2" data-tour-titulo="Agendamento em 4 passos" data-tour-texto="Especialidade, dia, horário e dados. O paciente envia a preferência e a recepção confirma."')}</li></ul>
      </nav>
      <a class="btn topo-cta" href="agendamento.html" data-evento="clique_agendar" data-origem="cabecalho-tablet">${I.cal}Agendar</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="sr">Abrir menu</span>${I.menu}</button>
    </div>
  </header>
  <div class="painel" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <div class="painel-topo">${marca}<button class="menu-btn" type="button"><span class="sr">Fechar menu</span>${I.mais}</button></div>
    <ul>
      <li><a href="index.html">Início</a></li>
      <li><a href="tratamentos.html">Tratamentos</a></li>
      <li><a href="primeira-consulta.html">Primeira consulta</a></li>
      <li><a href="urgencia.html">Urgência</a></li>
      <li><a href="cuidados.html">Cuide do seu sorriso</a></li>
      <li><a href="sobre.html">A clínica e a equipe</a></li>
      <li><a href="contato.html">Contato</a></li>
      <li><a href="login.html">Área do paciente</a></li>
    </ul>
    ${btnAgendar("menu", "Agendar avaliação")}
  </div>`;

const appnavPublica = atual => {
  const it = [["index.html", "casa", "Início", "inicio"], ["tratamentos.html", "grade", "Tratamentos", "tratamentos"], null, ["login.html", "usuario", "Paciente", "paciente"], ["contato.html", "chat", "Contato", "contato"]];
  return `
  <nav class="appnav" aria-label="Navegação rápida">
    <ul>${it.map(x => x === null
    ? `<li class="central"><a href="agendamento.html"${atual === "agendamento" ? ' aria-current="page"' : ""} data-evento="clique_agendar" data-origem="appnav" data-tour="2" data-tour-titulo="Agendar em 4 passos" data-tour-texto="O botão central abre o pré-agendamento: especialidade, dia, horário e dados. A recepção confirma depois."><span class="bolha">${I.cal}</span>Agendar</a></li>`
    : `<li><a href="${x[0]}"${atual === x[3] ? ' aria-current="page"' : ""}${x[3] === "paciente" ? ' data-tour="4" data-tour-titulo="Área do paciente" data-tour-texto="Consultas, documentos, plano de tratamento e anamnese digital, com uma paciente fictícia."' : ""}>${I[x[1]]}${x[2]}</a></li>`).join("")}</ul>
  </nav>`;
};
const appnavPortal = atual => `
  <nav class="appnav portalnav" aria-label="Área do paciente">
    <ul>
      <li><a href="paciente.html#inicio"${atual === "inicio" ? ' aria-current="page"' : ""}>${I.casa}Início</a></li>
      <li><a href="paciente.html#atendimentos">${I.relogio}Consultas</a></li>
      <li class="central"><a href="agendamento.html?retorno=1"><span class="bolha">${I.cal}</span>Agendar</a></li>
      <li><a href="paciente.html#arquivos"${atual === "docs" ? ' aria-current="page"' : ""}>${I.doc}Documentos</a></li>
      <li><a href="anamnese.html"${atual === "anamnese" ? ' aria-current="page"' : ""}>${I.escudo}Anamnese</a></li>
    </ul>
  </nav>`;

const subnavItens = [["paciente.html#inicio", "Início"], ["paciente.html#atendimentos", "Consultas"], ["paciente.html#plano", "Plano"], ["paciente.html#arquivos", "Documentos"], ["paciente.html#orcamentos", "Orçamentos"], ["paciente.html#recibos", "Recibos"], ["paciente.html#mensagens", "Mensagens"], ["paciente.html#cadastro", "Meus dados"], ["anamnese.html", "Anamnese"]];
const cabecalhoPortal = atual => `
  <header class="topo topo-portal">
    <div class="wrap">
      <div class="esq">${marca}<span class="portal-id">Área do paciente</span></div>
      <div class="dir">
        <span class="avatar" aria-hidden="true">MO</span><span class="ola-nome">Olá, <span data-paciente-primeiro>Maria</span></span>
        <button class="btn btn-contorno btn-p" type="button" data-sair>Sair</button>
      </div>
    </div>
  </header>
  <nav class="subnav" aria-label="Seções da área do paciente">
    <div class="wrap"><ul>${subnavItens.map(([h, t]) => `<li><a href="${h}"${h === atual ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul></div>
  </nav>`;

const rodape = `
  <footer class="rodape">
    <div class="wrap">
      <div class="colunas">
        <div>
          ${marca}
          <p>Responsável técnica: <span data-c="responsavel">Dra. Helena Prado</span>, <span data-c="cro">CRO-SP 00000 (exemplo, não válido)</span>, <span data-c="especialidade">Implantodontia</span>.</p>
          <p>Profissionais, avaliações, pacientes e imagens deste site são ilustrativos.</p>
          <ul class="redes" data-redes hidden></ul>
        </div>
        <nav aria-label="Rodapé">
          <h2>Navegação</h2>
          <ul>
            <li><a href="tratamentos.html">Tratamentos</a></li>
            <li><a href="primeira-consulta.html">Primeira consulta</a></li>
            <li><a href="urgencia.html">Urgência</a></li>
            <li><a href="cuidados.html">Cuide do seu sorriso</a></li>
            <li><a href="sobre.html">A clínica</a></li>
            <li><a href="agendamento.html">Agendamento</a></li>
            <li><a href="login.html">Área do paciente</a></li>
          </ul>
        </nav>
        <div>
          <h2>Atendimento</h2>
          <p>Segunda a sexta: 8h às 19h</p>
          <p>Sábado: 8h às 13h</p>
          <p>Domingo e feriados: fechado</p>
        </div>
        <div>
          <h2>Contato</h2>
          <p data-c="endereco">Endereço demonstrativo, Ribeirão Preto, SP</p>
          <ul>
            <li><a data-contato="telefone" data-evento="clique_telefone" data-origem="rodape"><span class="valor">(16) 0000-0000 (exemplo, sem ligação)</span></a></li>
            <li><a data-contato="whatsapp" data-origem="rodape"><span class="valor">WhatsApp não configurado (demonstração)</span></a></li>
            <li><a data-contato="email"><span class="valor">contato@lume.example (exemplo)</span></a></li>
            <li><a href="contato.html">Página de contato</a></li>
          </ul>
        </div>
      </div>
      <div class="legal">
        <p>CNPJ <span data-c="cnpj">00.000.000/0000-00 (exemplo, não válido)</span>. Site de demonstração com conteúdo fictício.</p>
        <p class="credito-agencia" data-agencia hidden></p>
        <p class="links-legais"><a href="privacidade.html">Política de privacidade</a><button type="button" data-rever-cookies>Preferências de cookies</button><a href="para-dentistas.html">Para dentistas</a></p>
      </div>
    </div>
  </footer>`;

const cookies = `
  <div class="cookies" role="region" aria-label="Aviso de cookies" hidden>
    <p>Usamos cookies essenciais e, com a sua autorização, cookies de medição de audiência. Saiba mais na <a href="privacidade.html">Política de privacidade</a>.</p>
    <div><button class="btn btn-contorno" type="button" data-cookie="aceito">Aceitar</button><button class="btn btn-contorno" type="button" data-cookie="recusado">Recusar</button></div>
  </div>`;

const sheet = (id, titulo, corpo) => `
  <dialog class="sheet" id="${id}" aria-labelledby="${id}-t">
    <button class="sheet-alca" type="button" aria-label="Fechar painel"><span></span></button>
    <div class="sheet-topo"><h2 id="${id}-t">${titulo}</h2><button class="sheet-fechar" type="button" data-fechar aria-label="Fechar">${I.mais}</button></div>
    <div class="sheet-corpo">${corpo}</div>
  </dialog>`;
const paletas = [["petroleo", "#0F4A4E", "Petróleo"], ["marinho", "#1F3A5F", "Marinho"], ["salvia", "#3D5C48", "Sálvia"], ["vinho", "#6B2737", "Vinho"], ["grafite", "#2F3A40", "Grafite"]];
const sheetsComuns = `
  ${sheet("sheet-demo", "Este é um site de demonstração", `
      <p class="credito-agencia nota-sheet" data-agencia hidden></p>
      <p>A Lume Odontologia é uma clínica fictícia criada pela <b data-c="nomeAgencia">Sitra</b> (<span data-c="sloganAgencia">Digitalização de negócios</span>). Profissionais, pacientes, avaliações e contatos são exemplos, e as fotos são de banco de imagens.</p>
      <p>O site mostra a um dentista como ficaria o site do consultório dele: agendamento pelo celular, área do paciente, anamnese digital e páginas de tratamento.</p>
      <div class="campos-form nota">
        <button class="btn" type="button" data-abrir-sheet="sheet-personalizar">Ver com a minha clínica</button>
        <button class="btn btn-contorno" type="button" data-tour-iniciar>Fazer o tour de 30 segundos</button>
        <a class="btn btn-contorno" href="para-dentistas.html">O que o dentista recebe</a>
        <a class="btn btn-contorno" href="#" data-agencia-link hidden>Falar com a <span data-c="nomeAgencia">Sitra</span></a>
        <button class="btn btn-contorno" type="button" data-instalar hidden>${I.celular}Instalar como app</button>
      </div>`)}
  ${sheet("sheet-personalizar", "Ver com a minha clínica", `
      <p>Digite o nome do consultório e escolha uma cor. O site inteiro muda na hora. Fica salvo só neste navegador.</p>
      <form id="form-personalizar" class="campos-form">
        <div class="campos-2">
          <div class="campo"><label for="p-nome">Nome da clínica</label><input id="p-nome" name="nome" type="text" maxlength="40" placeholder="Ex.: Sorriso Leve" autocomplete="organization"></div>
          <div class="campo"><label for="p-comp">Complemento <span class="opc">(opcional)</span></label><input id="p-comp" name="complemento" type="text" maxlength="30" value="Odontologia"></div>
        </div>
        <div class="campo"><label for="p-cidade">Cidade <span class="opc">(opcional)</span></label><input id="p-cidade" name="cidade" type="text" maxlength="40" placeholder="Ex.: Campinas, SP"></div>
        <fieldset class="periodos"><legend>Cor principal</legend>
          <div class="paletas">${paletas.map(([v, c, n], i) => `<label><input type="radio" name="paleta" value="${v}"${i === 0 ? " checked" : ""}><span class="amostra" style="background:${c}"></span><small>${n}</small></label>`).join("")}</div>
        </fieldset>
        <button class="btn" type="submit">Aplicar no site</button>
        <button class="link-btn" type="button" id="restaurar-demo">Voltar para a Lume (demonstração)</button>
      </form>`)}`;

const cabecaHead = (title, desc, url) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <!-- REMOVER em site real: impede o Google de indexar o conteúdo fictício da demonstração -->
  <meta name="robots" content="noindex, nofollow">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${url}">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#0F4A4E">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Lume Odontologia">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${DOM}assets/img/og-lume.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Lume">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/newsreader/v26/cY9AfjOCX1hbuyalUrK4397yjA.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="assets/css/style.css">
  <script>/* antes de pintar: animações e paleta personalizada */(function(d){var h=d.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches)h.classList.add("js-anim");try{var p=JSON.parse(localStorage.getItem("lume-personalizado"));var c={marinho:["#1F3A5F","#152A45","#E1E8F2"],salvia:["#3D5C48","#2B4334","#E2ECE4"],vinho:["#6B2737","#4E1B27","#F3E4E7"],grafite:["#2F3A40","#1F272B","#E6EAEC"]}[p&&p.paleta];if(c){h.style.setProperty("--cor-ancora",c[0]);h.style.setProperty("--cor-ancora-escura",c[1]);h.style.setProperty("--cor-menta",c[2]);}}catch(e){}})(document);</script>
  <!-- GTM/GA4 do cliente: colar dentro da função medir() em assets/js/main.js (só roda após o aceite de cookies) -->`;

function page({ file, title, desc, atual = "", body, ld = [], scripts = [], portal = false, pagina = "", faixa, semNav = false }) {
  const url = DOM + (file === "index.html" ? "" : file);
  const textoFaixa = faixa || "Conteúdo fictício. Veja como ficaria o site do seu consultório.";
  const html = `${cabecaHead(title, desc, url)}
${ld.map(o => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body${pagina ? ` data-pagina="${pagina}"` : ""}${semNav ? ' class="sem-appnav"' : ""}>
  <a class="pular" href="#conteudo">Pular para o conteúdo</a>
  <div class="demo" data-faixa-demo hidden><div class="wrap"><p><span class="chip-demo">Demo</span>${textoFaixa}<span data-agencia-curto> · By <b data-c="nomeAgencia">Sitra</b></span></p><div class="demo-acoes"><button type="button" data-abrir-sheet="sheet-demo" data-tour="5" data-tour-titulo="Veja com a sua clínica" data-tour-texto="Aqui o dentista digita o nome do consultório e escolhe a cor. O site inteiro muda na hora.">Saiba mais</button><button type="button" class="fechar-demo" aria-label="Fechar aviso de demonstração">×</button></div></div></div>
${portal ? cabecalhoPortal(atual) : cabecalhoPublico(atual)}

  <main id="conteudo">
${body}
  </main>
${rodape}
${semNav ? "" : portal ? appnavPortal(pagina === "anamnese" ? "anamnese" : pagina === "documento" ? "docs" : "inicio") : appnavPublica(atual || pagina)}
  <button class="botao-flutuante" type="button" data-abrir-sheet="sheet-personalizar" data-tour="5" data-tour-titulo="Veja com a sua clínica" data-tour-texto="O dentista digita o nome do consultório e escolhe a cor. O site inteiro muda na hora.">Ver com a minha clínica</button>
${sheetsComuns}
${cookies}
  <script src="assets/js/config.js" defer></script>
  <script src="assets/js/main.js" defer></script>
${scripts.map(s => `  <script src="assets/js/${s}" defer></script>`).join("\n")}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, file), html);
}

/* ---------------- Ilustrações ---------------- */
function sorriso(comDente) {
  const sup = [[250, 40, 50], [300, 44, 56], [348, 50, 64], [400, 56, 72], [452, 50, 64], [500, 44, 56], [550, 40, 50]];
  const inf = [[300, 38], [342, 40], [382, 40], [422, 40], [462, 40], [504, 38]];
  const topoSup = x => 222 + 24 * Math.pow((x - 400) / 210, 2);
  const topoInf = x => 296 + 14 * Math.pow((x - 400) / 200, 2);
  const dentesInf = inf.map(([x, w]) => `<rect x="${x - w / 2}" y="${topoInf(x).toFixed(1)}" width="${w}" height="42" rx="9" fill="#EFE8DC" stroke="#D3C7B5"/>`).join("");
  const dentesSup = sup.map(([x, w, h], i) => (i === 1 && !comDente) ? "" :
    `<rect x="${x - w / 2}" y="${(topoSup(x) - 12).toFixed(1)}" width="${w}" height="${h + 12}" rx="11" fill="#FAF6EF" stroke="#D3C7B5"/><rect x="${x - w / 2 + 6}" y="${(topoSup(x) + 2).toFixed(1)}" width="${Math.round(w * .28)}" height="${Math.round(h * .55)}" rx="5" fill="#fff" opacity=".7"/>`).join("");
  return `<svg viewBox="0 0 800 500" role="img" aria-label="${comDente ? "Ilustração de sorriso com todos os dentes superiores" : "Ilustração de sorriso com um dente superior ausente"}" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="500" fill="#EAD7C8"/>
          <ellipse cx="400" cy="262" rx="300" ry="150" fill="#E3CDBD"/>
          <path d="M175 252 Q400 172 625 252 Q400 375 175 252 Z" fill="#3D2427"/>
          ${dentesInf}${dentesSup}
          <path d="M188 240 Q400 176 612 240 L612 252 Q400 202 188 254 Z" fill="#D48A88"/>
          <path d="M130 252 Q250 138 400 170 Q550 138 670 252 Q400 166 130 252 Z" fill="#BF7F76"/>
          <path d="M130 252 Q400 372 670 252 Q560 398 400 404 Q240 398 130 252 Z" fill="#B3706A"/>
          <path d="M290 356 Q400 378 510 356" fill="none" stroke="#CB8F86" stroke-width="7" stroke-linecap="round"/>
          <text x="772" y="40" text-anchor="end" font-family="Hanken Grotesk, system-ui, sans-serif" font-size="18" fill="#6B5244">Ilustração</text>
        </svg>`;
}
/* Implante em 4 camadas, controladas por data-etapa no contêiner */
const implanteEtapas = `<svg viewBox="0 0 400 360" role="img" aria-label="Ilustração do implante, etapa por etapa" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="190" width="360" height="160" rx="10" fill="#EFE3CF"/>
            <g fill="#E2D2B8">${Array.from({ length: 30 }, (_, i) => `<circle cx="${40 + (i % 10) * 34 + (Math.floor(i / 10) % 2) * 17}" cy="${225 + Math.floor(i / 10) * 40}" r="4"/>`).join("")}</g>
            <rect x="34" y="120" width="70" height="80" rx="22" fill="#FAF6EF" stroke="#D3C7B5" stroke-width="2"/>
            <rect x="296" y="120" width="70" height="80" rx="22" fill="#FAF6EF" stroke="#D3C7B5" stroke-width="2"/>
            <path d="M20 200 Q110 178 200 190 Q290 178 380 200 L380 216 Q290 196 200 206 Q110 196 20 216 Z" fill="#E4A29E"/>
            <g class="camada e2"><path d="M182 200 L218 200 L213 330 Q200 344 187 330 Z" fill="#9AA6AC"/><g stroke="#6E7A80" stroke-width="2">${[216, 236, 256, 276, 296, 316].map(y => `<path d="M184 ${y + 4} L216 ${y - 4}"/>`).join("")}</g></g>
            <g class="camada e3"><rect x="188" y="182" width="24" height="18" rx="4" fill="#BCC6CA"/></g>
            <g class="camada e4"><rect x="187" y="166" width="26" height="36" rx="3" fill="#BCC6CA"/><path d="M152 172 Q144 112 162 88 Q200 64 238 88 Q256 112 248 172 Q200 184 152 172 Z" fill="#FFFCF7" stroke="#CDC3B4" stroke-width="2"/></g>
          </svg>`;

/* ================= INDEX ================= */
const faqHome = [
  ["Quanto tempo dura a primeira consulta?", "Em geral, cerca de 50 minutos. Se houver urgência, o atendimento é adaptado."],
  ["Preciso levar exames?", "Se você tiver radiografias ou exames recentes, leve no dia. Se não tiver, a dentista avalia o que precisa ser solicitado."],
  ["Vocês atendem convênios? Quais as formas de pagamento?", "A lista de convênios está na página de contato e deve ser confirmada com a recepção. Formas de pagamento são informadas diretamente pela recepção."],
  ["Implante dói?", "O procedimento é feito com anestesia. Depois, algum desconforto pode acontecer e a dentista orienta como controlá-lo. A experiência varia de pessoa para pessoa."],
  ["Posso ir com acompanhante?", "Sim. Pode ficar na recepção ou, se preferir e o procedimento permitir, na sala."],
  ["Atendem urgência?", "Sim, dentro do horário de funcionamento. Veja a página de urgência ou faça a solicitação marcando Urgência."],
];
const mapa = `<div class="reservado mapa" data-mapa>Localização ilustrativa, configurar endereço. Nenhum mapa real foi associado à clínica nesta demonstração.</div>`;
const canais = origem => `
          <div class="canais">
            <a class="canal" href="agendamento.html" data-evento="clique_agendar" data-origem="${origem}">${bolha("cal")}<b>Agendar</b><small>Pré-agendamento em 4 passos</small></a>
            <a class="canal" data-contato="telefone" data-evento="clique_telefone" data-origem="${origem}">${bolha("tel")}<b>Ligar</b><small class="valor">(16) 0000-0000 (exemplo, sem ligação)</small></a>
            <a class="canal" data-contato="whatsapp" data-origem="${origem}">${bolha("chat")}<b>WhatsApp</b><small class="valor">WhatsApp não configurado (demonstração)</small></a>
            <a class="canal" href="contato.html">${bolha("pino")}<b>Como chegar</b><small>Endereço, horário e mapa</small></a>
          </div>`;
const dicas = [
  ["escovacao", "escova", "Escovação em 2 minutos", "A ordem que ajuda a não esquecer nenhum dente."],
  ["fio", "dente", "Fio dental todo dia", "Onde a escova não chega, o fio resolve."],
  ["alimentacao", "copo", "Alimentação e cáries", "Não é só o açúcar: é a frequência."],
  ["sensibilidade", "brilho", "Sensibilidade", "O que pode causar e quando procurar ajuda."],
];

page({
  file: "index.html", pagina: "inicio",
  title: "Lume Odontologia | Dentista em Ribeirão Preto, SP",
  desc: "Consultório odontológico em Ribeirão Preto, SP: implantes, ortodontia, clareamento e prevenção, com diagnóstico explicado e agendamento pelo celular.",
  ld: [faqLd(faqHome)],
  body: `
    <section class="hero3" aria-labelledby="t-hero">
      <figure class="hero3-foto">
        <img src="assets/img/hero-atendimento-m2-800.webp" srcset="assets/img/hero-atendimento-640.webp 640w, assets/img/hero-atendimento-m2-800.webp 800w, assets/img/hero-atendimento-1200.webp 1200w" sizes="(min-width: 1024px) 50vw, 100vw" width="800" height="1000" alt="Dentista conversando com paciente idosa antes do atendimento, imagem ilustrativa" fetchpriority="high">
        <span class="selo-flutuante">Atendimento com hora marcada</span>
        <div class="cartao-flutuante" aria-hidden="true">${bolha("doc", " luz")}<span><b>Plano por escrito</b><small>Você entende antes de decidir</small></span></div>
      </figure>
      <div class="hero3-cartao">
        <p class="sobretitulo">Odontologia em <span data-c="cidade">Ribeirão Preto, SP</span></p>
        <h1 id="t-hero">Seu sorriso, <em>no seu tempo.</em></h1>
        <p>Consulta sem pressa, diagnóstico explicado e plano por escrito. Você entende cada etapa antes de decidir.</p>
        <div class="hero3-acoes">
          ${btnAgendar("hero", "Agendar avaliação", "", "btn-grande")}
          <a class="btn btn-contorno btn-grande" href="login.html">${I.usuario}Sou paciente</a>
        </div>
        <p class="hero3-linha"><span>${I.relogio}<span data-c="horarioCurto">Seg a sex, 8h às 19h · Sáb, 8h às 13h</span></span><span>${I.escudo}<span><span data-c="responsavel">Dra. Helena Prado</span>, <span data-c="cro">CRO-SP 00000 (exemplo, não válido)</span></span></span></p>
      </div>
    </section>

    <section class="s3" aria-label="Atalhos">
      <div class="wrap">
        <div class="rapidas" data-tour="1" data-tour-titulo="Atalhos como num app" data-tour-texto="O paciente resolve o que precisa com um toque: agendar, urgência, primeira consulta ou área do paciente.">
          <a class="rapida destaque" href="agendamento.html" data-evento="clique_agendar" data-origem="atalho">${bolha("cal")}<span><b>Agendar</b><small>Em 4 passos, pelo celular</small></span></a>
          <a class="rapida" href="urgencia.html">${bolha("alerta", " luz")}<span><b>Urgência</b><small>O que fazer agora</small></span></a>
          <a class="rapida" href="primeira-consulta.html">${bolha("coracao")}<span><b>Primeira consulta</b><small>Como funciona</small></span></a>
          <a class="rapida" href="login.html">${bolha("usuario")}<span><b>Área do paciente</b><small>Consultas e documentos</small></span></a>
        </div>
      </div>
    </section>

    <section class="s3" aria-labelledby="t-trat" data-revelar>
      ${secaoCarrossel("t-trat", "Tratamentos", "O que cuidamos por aqui", "Cada indicação depende de uma avaliação clínica.", "Ver todos", "tratamentos.html", TRAT.map(t => cartaoTrat(t)), "", ' data-tour="3" data-tour-titulo="Tratamentos com foto" data-tour-texto="Cartões que deslizam, como num app. Cada tratamento tem a própria página, boa para o Google e para o paciente."')}
    </section>

    <section class="s3-g" aria-labelledby="t-dif">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Por que a Lume</p><h2 id="t-dif">Feito para você entender e ficar tranquilo</h2></div></div>
        <div class="diferenciais" data-revelar>
          <div class="dif dif-foto">${img("sala-atendimento", [480, 900], 900, 1200, "Sala de atendimento com janela e luz natural", "(min-width: 1024px) 480px, 100vw")}<span class="legenda-foto">Salas com luz natural. Imagem ilustrativa.</span></div>
          <div class="dif">${bolha("relogio")}<h3>Hora marcada de verdade</h3><p>Consultas com tempo reservado para conversar. Sem sala de espera cheia.</p></div>
          <div class="dif">${bolha("doc")}<h3>Plano por escrito</h3><p>Você leva o diagnóstico, as opções e as etapas, no papel e na área do paciente.</p></div>
          <div class="dif">${bolha("usuario")}<h3>A mesma equipe</h3><p>Quem avalia é quem acompanha o tratamento até o fim.</p></div>
          <div class="dif">${bolha("acesso")}<h3>Acesso sem degraus</h3><p>Entrada no nível da rua e banheiro adaptado (dado de exemplo).</p></div>
        </div>
      </div>
    </section>

    <section class="faixa-cor s3-g" aria-labelledby="t-medo">
      <div class="wrap medo" data-revelar>
        <figure>${img("helena-2", [640, 1200], 1200, 900, "Dentista mostrando o espelho para a paciente durante o atendimento, imagem ilustrativa", "(min-width: 1024px) 560px, 100vw")}</figure>
        <div>
          <p class="sobretitulo">Atendimento sem pressa</p>
          <h2 id="t-medo">Tem medo de dentista? A gente vai devagar.</h2>
          <p>Muita gente adia a consulta por medo ou por já ter passado por um atendimento corrido. Aqui a primeira consulta serve para ouvir você.</p>
          <ul>
            <li>${I.check}<span>Explicamos cada etapa antes de começar.</span></li>
            <li>${I.check}<span>Você pode pedir uma pausa a qualquer momento.</span></li>
            <li>${I.check}<span>Falamos sobre o que te deixa inseguro antes do primeiro procedimento.</span></li>
          </ul>
          <a class="btn btn-luz btn-grande" href="primeira-consulta.html">Ver como é a primeira consulta</a>
        </div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-equipe" data-revelar>
      ${secaoCarrossel("t-equipe", "Equipe", "Quem vai cuidar de você", "Personagens fictícios desta demonstração.", "Conhecer a clínica", "sobre.html", [
        `<a class="cartao-pessoa" href="sobre.html">${img("doutora-helena", [480, 960], 960, 1200, "Dentista em atendimento, imagem que representa a Dra. Helena Prado", "(min-width: 1024px) 300px, 64vw")}<span class="legenda"><b>Dra. Helena Prado</b><small>Implantodontia · CRO de exemplo</small></span></a>`,
        `<a class="cartao-pessoa" href="sobre.html">${img("doutor-rafael", [480, 960], 960, 1200, "Dentista explicando o tratamento a uma paciente, imagem que representa o Dr. Rafael Mota", "(min-width: 1024px) 300px, 64vw")}<span class="legenda"><b>Dr. Rafael Mota</b><small>Ortodontia · CRO de exemplo</small></span></a>`,
        `<a class="cartao-pessoa" href="sobre.html">${img("recepcao-v", [480, 900], 900, 1200, "Recepção da clínica", "(min-width: 1024px) 300px, 64vw")}<span class="legenda"><b>Camila Nogueira</b><small>Recepção e agendamentos</small></span></a>`,
        `<a class="cartao-pessoa" href="sobre.html">${img("crianca", [640, 1200], 1200, 900, "Dentista atendendo uma criança na cadeira, imagem ilustrativa", "(min-width: 1024px) 300px, 64vw")}<span class="legenda"><b>Crianças</b><small>Atendimento a partir dos primeiros dentes</small></span></a>`,
      ], "estreito")}
    </section>

    <section class="faixa-areia s3-g" aria-labelledby="t-tour">
      <div class="wrap duas c5-7" data-revelar>
        <div>
          <p class="sobretitulo">Conheça antes de vir</p>
          <h2 id="t-tour">Um minuto dentro da clínica</h2>
          <p>Recepção, salas e esterilização. No site real, este espaço mostra um vídeo curto gravado no consultório.</p>
          <div class="acoes"><a class="link" href="sobre.html">Ver a clínica e a equipe</a></div>
        </div>
        <button class="video-capa" type="button" data-abrir-sheet="sheet-video">
          ${img("sala-2", [480, 900], 900, 1200, "", "(min-width: 1024px) 700px, 100vw")}
          <span class="play" aria-hidden="true"><span><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg></span></span>
          <span class="rotulo-video">Tour pela clínica<small>Espaço para o vídeo real · 1 min</small></span>
        </button>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-consulta">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Primeira consulta</p><h2 id="t-consulta">Sem surpresa, do começo ao fim</h2></div><a class="ver-todos" href="primeira-consulta.html">Ver detalhes</a></div>
        <div class="passos-visual" data-revelar>
          <div class="passo-v">${bolha("chat")}<p class="quando nota">Antes</p><h3>Você conta o que precisa</h3><p>Pelo pré-agendamento ou com a recepção. Separe exames recentes, se tiver.</p></div>
          <div class="passo-v">${bolha("relogio")}<p class="quando nota">Na consulta, cerca de 50 min</p><h3>Conversa e exame</h3><p>Radiografias se forem necessárias. Sem procedimento no primeiro dia, salvo urgência.</p></div>
          <div class="passo-v">${bolha("doc")}<p class="quando nota">Depois</p><h3>Plano explicado</h3><p>Diagnóstico e opções por escrito. Você decide no seu tempo.</p></div>
        </div>
      </div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-clinica">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Estrutura</p><h2 id="t-clinica">Um consultório claro e tranquilo</h2><p>Toque para ver em tela cheia. Imagens ilustrativas.</p></div></div>
        <div class="mosaico" data-revelar>
          <button type="button" class="g1" data-lb="0" aria-label="Ampliar: sala de atendimento">${img("sala-atendimento", [480, 900], 900, 1200, "", "(min-width: 1024px) 620px, 100vw")}<span class="rot">Sala de atendimento</span></button>
          <button type="button" data-lb="1" aria-label="Ampliar: recepção">${img("recepcao", [640, 1200], 1200, 800, "", "(min-width: 1024px) 300px, 50vw")}<span class="rot">Recepção</span></button>
          <button type="button" data-lb="2" aria-label="Ampliar: esterilização">${img("esterilizacao", [640, 1200], 1200, 800, "", "(min-width: 1024px) 300px, 50vw")}<span class="rot">Esterilização</span></button>
          <button type="button" data-lb="3" aria-label="Ampliar: consultório">${img("sala-2", [480, 900], 900, 1200, "", "(min-width: 1024px) 300px, 50vw")}<span class="rot">Consultório</span></button>
          <button type="button" data-lb="4" aria-label="Ampliar: planejamento">${img("raio-x", [640, 1200], 1200, 900, "", "(min-width: 1024px) 300px, 50vw")}<span class="rot">Planejamento</span></button>
        </div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-dicas" data-revelar>
      ${secaoCarrossel("t-dicas", "Cuide do seu sorriso", "Dicas para o dia a dia", "", "Ver todas", "cuidados.html", dicas.map(([id, ico, t, d]) => `<a class="dica-cartao" href="cuidados.html#${id}">${bolha(ico)}<b>${t}</b><span>${d}</span><span class="mais">Ler ${I.seta}</span></a>`), "estreito")}
    </section>

    <section class="s3" aria-labelledby="t-aval" data-revelar>
      ${secaoCarrossel("t-aval", "Avaliações", "O que dizem os pacientes", "Exemplos fictícios. No site real, entram as avaliações do Google.", "", "", [
        ["Luíza", "Fui com medo e saí tranquila. Ela explicou tudo antes de encostar em mim."],
        ["Otávio", "O consultório é silencioso e a recepção respondeu minhas dúvidas no mesmo dia."],
        ["Bernadete", "Gostei de receber o diagnóstico explicado, sem pressão para decidir."],
        ["Caio", "Agendei pelo celular em dois minutos e recebi a confirmação da recepção."],
      ].map(([n, t]) => `<figure class="aval3"><span class="etiqueta-demo">Exemplo de avaliação</span><blockquote>${t}</blockquote><figcaption class="quem"><span class="ini" aria-hidden="true">${n[0]}</span><span>${n}, paciente (exemplo)</span></figcaption></figure>`))}
    </section>

    <section class="s3" aria-labelledby="t-casos">
      <div class="wrap duas c5-7">
        <div><h2 id="t-casos">Casos clínicos</h2><p>Casos acompanhados pela clínica entram aqui somente com termo de consentimento do paciente, como determina o Conselho Federal de Odontologia. Os resultados variam de pessoa para pessoa.</p></div>
        <div class="casos" style="margin-top:0"><div class="reservado">Espaço para caso real, com consentimento</div><div class="reservado">Espaço para caso real, com consentimento</div></div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-faq">
      <div class="wrap duas c4-8">
        <div><p class="sobretitulo">Dúvidas</p><h2 id="t-faq">Perguntas frequentes</h2></div>
        ${faqHtml("faq", faqHome)}
      </div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-chegar">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Contato</p><h2 id="t-chegar">Fale com a gente</h2><p><span data-c="endereco">Endereço demonstrativo, Ribeirão Preto, SP</span> · <span data-c="horarioCurto">Seg a sex, 8h às 19h · Sáb, 8h às 13h</span></p></div></div>
        ${canais("home")}
      </div>
    </section>

    <dialog class="lightbox" id="lightbox" aria-label="Galeria da clínica">
      <div class="lb-barra"><span class="lb-cont">1 de 5</span><button type="button" data-fechar aria-label="Fechar galeria">${I.mais}</button></div>
      <div class="lb-trilho">${[["sala-atendimento-900", "Sala de atendimento"], ["recepcao-1200", "Recepção"], ["esterilizacao-1200", "Bancada de esterilização"], ["sala-2-900", "Consultório"], ["raio-x-1200", "Planejamento com tomografia"]].map(([f, c]) => `<figure class="lb-item"><img src="assets/img/${f}.webp" alt="${c}, imagem ilustrativa" loading="lazy"><figcaption>${c}. Imagem ilustrativa.</figcaption></figure>`).join("")}</div>
      <button type="button" class="lb-nav ant" aria-label="Foto anterior">${I.esq}</button><button type="button" class="lb-nav prox" aria-label="Próxima foto">${I.dir}</button>
    </dialog>
    ${sheet("sheet-video", "Tour pela clínica", `<p>Aqui entra um vídeo curto (cerca de 1 minuto) gravado no consultório real: recepção, salas, esterilização e a equipe trabalhando.</p><p>Nesta demonstração não há vídeo: preferimos não usar imagens de outra clínica como se fossem da Lume.</p><p><a href="sobre.html">Ver fotos da estrutura e a equipe</a></p>`)}`,
});

/* ================= TRATAMENTOS (índice) ================= */
page({
  file: "tratamentos.html", atual: "tratamentos",
  title: "Tratamentos odontológicos em Ribeirão Preto | Lume Odontologia",
  desc: "Implantes, ortodontia, clareamento, lentes, prevenção e urgência na Lume Odontologia, em Ribeirão Preto. Conheça cada tratamento e agende uma avaliação.",
  ld: [crumbLd([["Início", ""], ["Tratamentos", "tratamentos.html"]])],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-tr">
      ${migalhas([["Início", "index.html"], ["Tratamentos", ""]])}
      <h1 id="t-tr">Tratamentos</h1>
      <p>Toda indicação nasce de uma avaliação. Escolha um tratamento para ver como funciona, para quem é indicado e as perguntas mais comuns.</p>
    </section>
    <section class="wrap s3" aria-label="Lista de tratamentos">
      <div class="filtros" role="group" aria-label="Filtrar tratamentos">
        <button type="button" data-filtro="todos" aria-pressed="true">Todos</button>
        <button type="button" data-filtro="estetica" aria-pressed="false">Estética</button>
        <button type="button" data-filtro="reabilitacao" aria-pressed="false">Reabilitação</button>
        <button type="button" data-filtro="prevencao" aria-pressed="false">Prevenção</button>
        <button type="button" data-filtro="criancas" aria-pressed="false">Crianças</button>
        <button type="button" data-filtro="urgencia" aria-pressed="false">Urgência</button>
      </div>
      <div class="grade-trat" aria-live="polite">${TRAT.map((t, i) => `<div data-cat="${t.cat}">${cartaoTrat(t, i > 2)}</div>`).join("")}</div>
    </section>
    <section class="faixa-cor s3-g" aria-labelledby="t-nao">
      <div class="wrap duas c7-5">
        <div><h2 id="t-nao">Não sabe por onde começar?</h2><p>Marque uma avaliação inicial. A dentista examina, explica o que encontrou e indica o caminho, sem compromisso de iniciar nada no dia.</p></div>
        <div class="acoes" style="margin:0">${btnAgendar("tratamentos-fim", "Agendar avaliação inicial", "avaliacao", "btn-luz btn-grande")}</div>
      </div>
    </section>`,
});

/* ================= IMPLANTES ================= */
const faqImpl = [
  ["Preciso ter osso suficiente?", "O implante precisa de osso para ficar firme. Quando falta osso, pode ser possível fazer um enxerto antes. A dentista avalia o seu caso na consulta."],
  ["Quanto tempo leva o tratamento inteiro?", "Depende da cicatrização de cada pessoa e de etapas extras, como enxerto. O prazo aparece no plano por escrito. A dentista avalia o seu caso na consulta."],
  ["Posso ficar sem dente durante o processo?", "Em muitos casos é possível usar uma prótese provisória enquanto o osso cicatriza. Isso depende da região e da condição do osso. A dentista avalia o seu caso na consulta."],
  ["Fumar atrapalha?", "O cigarro prejudica a cicatrização e aumenta o risco de complicações. Se você fuma, conte na consulta para planejar os cuidados. A dentista avalia o seu caso na consulta."],
];
const heroTrat = (t, titulo, intro, cta) => `
    <section class="hero hero-int" aria-labelledby="t-h">
      <div class="hero-texto wrap">
        ${migalhas([["Início", "index.html"], ["Tratamentos", "tratamentos.html"], [titulo, ""]])}
        <p class="sobretitulo">Tratamento</p>
        <h1 id="t-h">${titulo}</h1>
        <p>${intro}</p>
        <div class="acoes">${cta}</div>
      </div>
      <figure class="hero-foto">
        ${img(t.foto, [640, 1200], 1200, 900, "", "(min-width: 1024px) 50vw, 100vw", 'fetchpriority="high"').replace('alt=""', 'alt="" style="view-transition-name: vt-' + t.id + '"')}
        <figcaption class="wrap">Imagem ilustrativa.</figcaption>
      </figure>
    </section>`;
const relacionados = atual => `
    <section class="s3-g" aria-labelledby="t-rel" data-revelar>
      ${secaoCarrossel("t-rel", "", "Outros tratamentos", "", "Ver todos", "tratamentos.html", TRAT.filter(t => t.id !== atual).map(t => cartaoTrat(t)))}
    </section>`;
const fechoTrat = (esp, msg, rotulo = "Agendar avaliação") => `
    <section class="faixa-cor s3-g" aria-labelledby="t-fecho">
      <div class="wrap duas c7-5">
        <div><h2 id="t-fecho">Quer conversar sobre o seu caso?</h2><p>Na avaliação, a dentista examina, explica as opções e entrega o plano por escrito.</p></div>
        <div class="acoes" style="margin:0">${ag(esp, rotulo, "Perguntar pelo WhatsApp", msg, esp + "-fechamento", "btn btn-luz btn-grande")}</div>
      </div>
    </section>`;

page({
  file: "implantes.html", atual: "tratamentos",
  title: "Implantes dentários em Ribeirão Preto, SP | Lume Odontologia",
  desc: "Como funciona o implante dentário na Lume, em Ribeirão Preto: avaliação do osso, planejamento por escrito, cirurgia com anestesia local e manutenção.",
  ld: [crumbLd([["Início", ""], ["Tratamentos", "tratamentos.html"], ["Implantes dentários", "implantes.html"]]), faqLd(faqImpl)],
  scripts: ["comparador.js"],
  body: `${heroTrat(TRAT[0], "Implantes dentários", "O implante é um pino de titânio colocado no osso para sustentar uma prótese no lugar de um dente ausente. Antes de qualquer indicação, a dentista examina, avalia o osso e explica as opções.", ag("implantes", "Agendar avaliação", "Perguntar sobre implantes no WhatsApp", "Olá, gostaria de saber mais sobre implantes dentários.", "implantes-topo", "btn btn-grande"))}

    <section class="s3" aria-labelledby="t-ind">
      <div class="wrap duas c4-8">
        <h2 id="t-ind">Para quem pode ser indicado</h2>
        <div>
          <p>Para quem perdeu um ou mais dentes e tem gengiva saudável e osso suficiente, ou que possam ser tratados antes. A indicação sai da avaliação, não de uma regra geral.</p>
          <ul class="filetes"><li>Repõe um dente sem desgastar os vizinhos.</li><li>Pode sustentar uma coroa, uma ponte ou uma prótese maior.</li><li>Exige cuidado diário e revisões, como um dente natural.</li></ul>
        </div>
      </div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-palco">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Passo a passo</p><h2 id="t-palco">Como o implante é feito</h2><p>Role a página ou toque em cada etapa.</p></div></div>
        <div class="palco">
          <figure class="palco-fig" data-etapa="1">${implanteEtapas}<figcaption class="rotulo-etapa" aria-live="polite">Avaliação e planejamento</figcaption></figure>
          <div class="palco-passos">
            <div class="palco-passo ativo" data-etapa="1"><span class="n">1</span><h3>Avaliação e planejamento</h3><p>Exame clínico, radiografias e, quando necessário, tomografia. A dentista define posição e tipo do implante e explica o plano por escrito.</p></div>
            <div class="palco-passo" data-etapa="2"><span class="n">2</span><h3>Cirurgia</h3><p>Com anestesia local, o implante é colocado no osso. A duração depende do caso.</p></div>
            <div class="palco-passo" data-etapa="3"><span class="n">3</span><h3>Cicatrização</h3><p>O osso se integra ao implante. O tempo varia e é definido pela dentista, com revisões no caminho.</p></div>
            <div class="palco-passo" data-etapa="4"><span class="n">4</span><h3>Coroa e manutenção</h3><p>Depois da cicatrização entra a coroa definitiva. Higiene diária e revisões mantêm o implante saudável.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-cmp">
      <div class="wrap duas c4-8">
        <div>
          <p class="sobretitulo">Comparador</p>
          <h2 id="t-cmp">Antes e depois, em ilustração</h2>
          <p>Arraste a divisória para comparar um sorriso com um dente ausente e o mesmo sorriso com o espaço preenchido.</p>
          <p class="nota-demo">${I.info}<span><strong>Exemplo ilustrativo.</strong> Desenho criado para explicar o tratamento. Não é um caso real nem promessa de resultado.</span></p>
        </div>
        <div>
          <div class="comparador" data-comparador>
            <div class="cmp-img cmp-depois">${sorriso(true)}</div>
            <div class="cmp-img cmp-antes" aria-hidden="true">${sorriso(false)}</div>
            <div class="cmp-linha" aria-hidden="true"><span class="cmp-alca"><svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5M15 7l5 5-5 5"/></svg></span></div>
            <span class="cmp-rotulo esq" aria-hidden="true">Antes</span><span class="cmp-rotulo dir" aria-hidden="true">Depois</span>
            <input type="range" min="0" max="100" value="50" aria-label="Divisória do comparador: arraste ou use as setas para ver antes e depois">
          </div>
          <p class="cmp-legenda">Casos reais só são exibidos com termo de consentimento do paciente e responsabilidade da cirurgiã-dentista.</p>
        </div>
      </div>
    </section>

    <section class="faixa-areia s3-g" aria-labelledby="t-guia">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Guia</p><h2 id="t-guia">O que esperar</h2></div></div>
        <div class="diferenciais">
          <div class="dif">${bolha("relogio")}<h3>Duração da cirurgia</h3><p>Varia com o número de implantes e a condição do osso. A estimativa é dada no planejamento.</p></div>
          <div class="dif">${bolha("escudo")}<h3>Anestesia</h3><p>Local, na região tratada. Você fica acordado e pode pedir pausa.</p></div>
          <div class="dif">${bolha("cal")}<h3>Retorno</h3><p>Uma revisão é marcada depois da cirurgia para acompanhar a cicatrização.</p></div>
          <div class="dif">${bolha("escova")}<h3>Manutenção</h3><p>Higiene diária com escova e fio ou escova interdental, e revisões periódicas.</p></div>
        </div>
        <div class="duas c4-8 nota" style="margin-top:40px">
          <h2 style="font-size:1.625rem">Cuidados depois da cirurgia</h2>
          <div><ul class="filetes"><li>Seguir a medicação indicada.</li><li>Evitar esforço no primeiro dia.</li><li>Manter a higiene como orientado.</li><li>Avisar a clínica em caso de dor intensa, inchaço que aumenta ou sangramento que não para.</li></ul><p class="pequeno nota">Orientações gerais. Siga sempre a orientação do seu cirurgião-dentista.</p></div>
        </div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-fimp">
      <div class="wrap duas c4-8"><h2 id="t-fimp">Perguntas sobre implantes</h2>${faqHtml("fimp", faqImpl)}</div>
    </section>
${relacionados("implantes")}
${fechoTrat("implantes", "Olá, gostaria de saber mais sobre implantes dentários.")}`,
});

/* ================= Tratamentos genéricos ================= */
const GEN = {
  ortodontia: {
    titulo: "Ortodontia e alinhadores", intro: "Aparelho fixo ou alinhadores transparentes corrigem a posição dos dentes e a mordida. O tipo de aparelho e o tempo de tratamento dependem da avaliação com o Dr. Rafael Mota.",
    para: ["Dentes tortos, apinhados ou com espaços.", "Mordida que não encaixa bem.", "Adultos que nunca trataram ou que voltaram a ter desalinhamento.", "Crianças a partir dos 7 anos, para avaliação preventiva."],
    passos: [["chat", "Avaliação", "Fotos, radiografias e escaneamento dos dentes."], ["doc", "Plano", "Opções explicadas com modelos na mão, com prós e contras de cada uma."], ["alinhador", "Início", "Instalação do aparelho ou entrega dos alinhadores, com orientação de uso."], ["cal", "Acompanhamento", "Manutenções periódicas e, no final, contenção para manter o resultado."]],
    opcoes: { titulo: "Fixo ou alinhador?", foto: ["aparelhos", "Modelos de arcada com aparelho fixo e com dentes alinhados"], itens: [["Aparelho fixo", "Braquetes colados nos dentes e ajustados nas manutenções. Atende a maioria dos casos."], ["Alinhadores transparentes", "Placas removíveis trocadas em sequência. Precisam ser usadas a maior parte do dia para funcionar."]] },
    faq: [["Qual a idade certa para a primeira avaliação?", "Por volta dos 7 anos, para acompanhar o crescimento. Adultos também podem tratar em qualquer idade."], ["Alinhador serve para todos os casos?", "Nem todos. A avaliação mostra se o alinhador resolve o seu caso ou se o aparelho fixo é mais indicado."], ["O aparelho incomoda?", "Pode haver desconforto nos primeiros dias e depois de ajustes, que costuma passar. Se continuar, avise a clínica."]],
    msg: "Olá, gostaria de saber mais sobre ortodontia.",
  },
  clareamento: {
    titulo: "Clareamento dental", intro: "O clareamento deixa a cor dos dentes naturais mais clara com gel de uso odontológico. Antes, a dentista avalia dentes e gengivas e registra a cor inicial.",
    para: ["Dentes amarelados pelo tempo, café, chá ou vinho.", "Quem tem dentes e gengivas saudáveis, ou tratados antes.", "Restaurações, coroas e lentes não mudam de cor: isso é avaliado antes.", "Gestantes e lactantes devem aguardar."],
    passos: [["chat", "Avaliação", "Exame, limpeza se necessária e registro da cor inicial."], ["brilho", "Clareamento", "No consultório, em sessões, ou em casa com moldeira feita para você."], ["relogio", "Acompanhamento", "Revisão da cor e ajuste do tratamento, se preciso."]],
    opcoes: { titulo: "No consultório ou em casa?", foto: ["clareamento", "Dentista examinando paciente na cadeira, imagem ilustrativa"], itens: [["No consultório", "Sessões na clínica, com a dentista aplicando e acompanhando o gel."], ["Em casa, supervisionado", "Moldeira personalizada e gel em casa, com orientação e revisões."]] },
    faq: [["O clareamento estraga o esmalte?", "Feito com indicação e acompanhamento, segue protocolos que respeitam o esmalte. A dentista explica os cuidados antes de começar."], ["Dá sensibilidade?", "Pode dar sensibilidade temporária durante o tratamento. Avise a clínica para ajustar."], ["Quanto tempo dura?", "Varia com hábitos como café, vinho e cigarro. A dentista orienta sobre manutenção."]],
    msg: "Olá, gostaria de saber mais sobre clareamento dental.",
  },
  lentes: {
    titulo: "Lentes e facetas", intro: "Lâminas finas de cerâmica ou resina coladas na frente dos dentes para ajustar forma, cor ou pequenos desalinhamentos, quando há indicação clínica.",
    para: ["Dentes com forma ou tamanho desiguais.", "Manchas que o clareamento não resolve.", "Pequenos espaços entre os dentes.", "Quem tem gengiva saudável e não range os dentes sem proteção."],
    passos: [["chat", "Avaliação", "Fotos, escaneamento e conversa sobre o que você quer mudar."], ["faceta", "Ensaio", "Um ensaio em resina aplicado provisoriamente para você ver antes de decidir."], ["doc", "Confecção", "Preparo, quando necessário, e moldagem ou escaneamento."], ["check", "Cimentação", "As lentes são coladas e ajustadas. Depois, revisões periódicas."]],
    opcoes: { titulo: "Cerâmica ou resina?", foto: ["lentes", "Dentes artificiais usados como referência de forma e cor"], itens: [["Cerâmica", "Feita em laboratório, a partir de moldagem ou escaneamento."], ["Resina", "Aplicada direto no consultório, camada por camada."]] },
    faq: [["Precisa desgastar o dente?", "Depende do caso. Às vezes o desgaste é mínimo ou nenhum. A dentista explica antes de qualquer decisão."], ["Posso ver como fica antes?", "Sim, com o ensaio em resina aplicado provisoriamente na boca."], ["Quanto tempo duram?", "Dependem de cuidados e hábitos. Revisões periódicas ajudam a manter."]],
    msg: "Olá, gostaria de saber mais sobre lentes e facetas.",
  },
  prevencao: {
    titulo: "Prevenção e limpeza", intro: "Revisões, limpeza profissional e orientação de higiene para evitar cáries e problemas de gengiva antes que causem dor.",
    para: ["Todas as idades, em revisões periódicas.", "Crianças, desde o nascimento dos primeiros dentes.", "Quem usa aparelho, implante ou prótese.", "Gestantes, com acompanhamento durante a gravidez."],
    passos: [["chat", "Conversa e exame", "Como está a sua rotina e o que mudou desde a última visita."], ["escova", "Limpeza", "Remoção de placa e tártaro e polimento."], ["folha", "Orientação", "Escovação e fio do jeito certo para a sua boca."], ["cal", "Próxima revisão", "O intervalo é definido pela dentista conforme o seu caso."]],
    opcoes: { titulo: "Crianças também", foto: ["crianca", "Dentista atendendo uma criança na cadeira, imagem ilustrativa"], itens: [["Primeira visita", "A partir do nascimento dos primeiros dentes, para orientar a família."], ["Acompanhamento", "Revisões periódicas, orientação de escovação e alimentação."]] },
    faq: [["De quanto em quanto tempo devo ir?", "Em geral a cada 6 meses, mas a dentista define o intervalo conforme o seu caso."], ["A limpeza dói?", "Costuma ser tranquila. Se houver sensibilidade, avise para ajustar."], ["Criança precisa ir ao dentista mesmo sem sentir nada?", "Sim. As visitas de rotina ajudam a prevenir problemas e acostumam a criança com o consultório."]],
    msg: "Olá, gostaria de agendar uma limpeza e revisão.",
  },
};
Object.keys(GEN).forEach(id => {
  const g = GEN[id], t = TRAT.find(x => x.id === id);
  page({
    file: id + ".html", atual: "tratamentos",
    title: `${g.titulo} em Ribeirão Preto | Lume Odontologia`,
    desc: `${g.titulo} na Lume Odontologia, em Ribeirão Preto: para quem é indicado, como funciona, perguntas frequentes e pré-agendamento pelo celular.`.slice(0, 158),
    ld: [crumbLd([["Início", ""], ["Tratamentos", "tratamentos.html"], [g.titulo, id + ".html"]]), faqLd(g.faq)],
    body: `${heroTrat(t, g.titulo, g.intro, ag(id, "Agendar avaliação", "Perguntar pelo WhatsApp", g.msg, id + "-topo", "btn btn-grande"))}

    <section class="s3" aria-labelledby="t-para">
      <div class="wrap duas c4-8"><h2 id="t-para">Para quem é indicado</h2><ul class="filetes">${g.para.map(p => `<li>${p}</li>`).join("")}</ul></div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-como">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Passo a passo</p><h2 id="t-como">Como funciona</h2></div></div>
        <div class="passos-visual" data-revelar style="${g.passos.length === 4 ? "--n:4" : ""}">${g.passos.map(([ico, h, p], i) => `<div class="passo-v">${bolha(ico)}<p class="quando nota">Etapa ${i + 1}</p><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-op">
      <div class="wrap medo" data-revelar>
        <figure>${img(g.opcoes.foto[0], [640, 1200], 1200, 900, g.opcoes.foto[1] + ", imagem ilustrativa", "(min-width: 1024px) 560px, 100vw")}</figure>
        <div><h2 id="t-op">${g.opcoes.titulo}</h2><dl class="guia" style="grid-template-columns:1fr">${g.opcoes.itens.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join("")}</dl><p class="pequeno nota">A escolha é feita com a dentista, depois da avaliação.</p></div>
      </div>
    </section>

    <section class="faixa-areia s3-g" aria-labelledby="t-faqg">
      <div class="wrap duas c4-8"><h2 id="t-faqg">Perguntas frequentes</h2>${faqHtml("fq-" + id, g.faq)}</div>
    </section>
${relacionados(id)}
${fechoTrat(id, g.msg)}`,
  });
});

/* ================= URGÊNCIA ================= */
page({
  file: "urgencia.html", atual: "tratamentos",
  title: "Urgência odontológica em Ribeirão Preto | Lume Odontologia",
  desc: "Dor de dente, dente quebrado, dente que saiu ou inchaço: o que fazer agora e como falar com a Lume Odontologia, em Ribeirão Preto, no horário de atendimento.",
  ld: [crumbLd([["Início", ""], ["Tratamentos", "tratamentos.html"], ["Urgência", "urgencia.html"]])],
  body: `${heroTrat(TRAT[5], "Urgência odontológica", "Dor forte, dente quebrado ou inchaço? Fale com a recepção no horário de atendimento. Abaixo, o que fazer enquanto isso.", `${ag("urgencia", "Pedir atendimento de urgência", "Chamar no WhatsApp agora", "Olá, preciso de atendimento de urgência.", "urgencia-topo", "btn btn-grande")}<a class="btn btn-contorno btn-grande" data-contato="telefone" data-evento="clique_telefone" data-origem="urgencia">${I.tel}<span class="valor">(16) 0000-0000 (exemplo, sem ligação)</span></a>`)}

    <section class="s3" aria-label="Aviso">
      <div class="wrap"><p class="nota-demo">${I.alerta}<span><strong>Procure um pronto-socorro</strong> em caso de sangramento que não para, inchaço que dificulta respirar ou engolir, febre alta ou batida forte no rosto.</span></p></div>
    </section>

    <section class="s3" aria-labelledby="t-agora">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Primeiros cuidados</p><h2 id="t-agora">O que fazer agora</h2><p>Orientações gerais. Não substituem a avaliação.</p></div></div>
        <div class="urg-cartoes">
          <div class="urg"><h3>${bolha("alerta", " luz")}Dor de dente forte</h3><ol><li>Escove e passe fio com cuidado na região.</li><li>Evite alimentos muito quentes, gelados ou doces.</li><li>Não coloque remédio sobre o dente ou a gengiva.</li><li>Fale com a clínica para ser avaliado.</li></ol></div>
          <div class="urg"><h3>${bolha("dente")}Dente quebrado ou lascado</h3><ol><li>Guarde o pedaço, se encontrar.</li><li>Enxágue a boca com água.</li><li>Evite mastigar do lado afetado.</li><li>Procure atendimento no mesmo dia, se possível.</li></ol></div>
          <div class="urg"><h3>${bolha("relogio", " luz")}Dente que saiu da boca</h3><ol><li>Segure o dente pela coroa, sem tocar a raiz.</li><li>Não esfregue nem lave com sabão.</li><li>Guarde em leite ou soro fisiológico.</li><li>Procure atendimento imediatamente: o tempo faz diferença.</li></ol></div>
          <div class="urg"><h3>${bolha("coracao")}Inchaço no rosto ou na gengiva</h3><ol><li>Compressa fria por fora do rosto, em intervalos.</li><li>Não aplique calor.</li><li>Se o inchaço aumentar rápido ou houver febre, procure um pronto-socorro.</li><li>Fale com a clínica para avaliação.</li></ol></div>
        </div>
      </div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-urg-c">
      <div class="wrap"><div class="secao-topo"><div><h2 id="t-urg-c">Fale com a clínica</h2><p><span data-c="horarioCurto">Seg a sex, 8h às 19h · Sáb, 8h às 13h</span></p></div></div>${canais("urgencia")}</div>
    </section>`,
});

/* ================= AGENDAMENTO ================= */
page({
  file: "agendamento.html", atual: "agendamento",
  title: "Pré-agendamento de consulta | Lume Odontologia, Ribeirão Preto",
  desc: "Solicite um pré-agendamento na Lume Odontologia, em Ribeirão Preto: escolha especialidade, dia e horário de preferência. A recepção confirma depois.",
  ld: [crumbLd([["Início", ""], ["Pré-agendamento", "agendamento.html"]])],
  scripts: ["agendamento.js"],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-ag">
      ${migalhas([["Início", "index.html"], ["Pré-agendamento", ""]])}
      <h1 id="t-ag">Agendar avaliação</h1>
      <p>Escolha a especialidade, o dia e o horário que preferir. A recepção confirma depois: o envio não marca a consulta.</p>
    </section>

    <div class="wrap s3">
      <div class="agenda">
        <aside aria-labelledby="t-como">
          <h2 id="t-como">Como funciona</h2>
          <ol class="como-funciona">
            <li><b>Você envia a preferência</b><p>Especialidade, dia e horário que encaixam na sua rotina.</p></li>
            <li><b>A recepção confere a agenda</b><p>Se o horário não estiver livre, ela sugere outro próximo.</p></li>
            <li><b>Você recebe a confirmação</b><p>Só depois disso a consulta está marcada.</p></li>
          </ol>
          <p class="nota-demo nota">${I.info}<span><strong>Modo demonstração, sem agendamento confirmado.</strong> Este site não está ligado a uma agenda real. Nenhum horário é reservado e nenhum dado é enviado.</span></p>
        </aside>

        <form class="painel-form" id="form-agenda" novalidate aria-labelledby="t-form-ag">
          <h2 id="t-form-ag" class="sr">Formulário de pré-agendamento</h2>
          <div class="progresso-box">
            <ol class="progresso" aria-label="Etapas do pré-agendamento">
              <li><span class="num" aria-hidden="true">1</span><span class="txt">Especialidade</span><span class="sr estado">, pendente</span></li>
              <li><span class="num" aria-hidden="true">2</span><span class="txt">Dia</span><span class="sr estado">, pendente</span></li>
              <li><span class="num" aria-hidden="true">3</span><span class="txt">Horário</span><span class="sr estado">, pendente</span></li>
              <li><span class="num" aria-hidden="true">4</span><span class="txt">Seus dados</span><span class="sr estado">, pendente</span></li>
            </ol>
            <div class="trilho" aria-hidden="true"><span id="barra-prog"></span></div>
            <p class="prog-texto" id="prog-texto" aria-live="polite">0 de 4 etapas concluídas</p>
          </div>
          <p class="nota-demo" id="aviso-retorno" hidden>${I.info}<span>Solicitação de retorno a partir da área do paciente (demonstração).</span></p>

          <fieldset class="etapa">
            <legend><span class="num" aria-hidden="true">1</span>Especialidade</legend>
            <p class="dica">Qual o motivo da consulta?</p>
            <div class="chips esp-cartoes" id="opcoes-esp"></div>
            ${erro("especialidade")}
          </fieldset>

          <fieldset class="etapa">
            <legend><span class="num" aria-hidden="true">2</span>Dia de preferência</legend>
            <p class="dica">A escolha indica preferência e não reserva vaga.</p>
            <div class="faixa-dias" id="faixa-dias" role="group" aria-label="Próximos dias de atendimento"></div>
            <button type="button" class="link-btn cal-alternar" id="cal-alternar" aria-expanded="false" aria-controls="cal-wrap">Ver o calendário do mês</button>
            <div class="cal cal-wrap" id="cal-wrap" hidden>
              <div class="cal-topo">
                <button type="button" class="cal-nav" id="cal-ant" aria-label="Mês anterior">${I.esq}</button>
                <h3 id="cal-titulo" aria-live="polite"></h3>
                <button type="button" class="cal-nav" id="cal-prox" aria-label="Próximo mês">${I.dir}</button>
              </div>
              <div class="cal-semana" aria-hidden="true"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div>
              <div class="cal-dias" id="cal-dias" role="group" aria-labelledby="cal-titulo"></div>
              <p class="cal-legenda">Datas passadas, domingos e dias depois dos próximos 60 dias ficam indisponíveis. Feriados são confirmados pela recepção. Horário de Brasília.</p>
            </div>
            ${erro("dia")}
          </fieldset>

          <fieldset class="etapa">
            <legend><span class="num" aria-hidden="true">3</span>Horário de preferência</legend>
            <p class="dica">Dentro do horário de funcionamento. Depende de confirmação da recepção.</p>
            <div id="opcoes-hora" aria-live="polite"></div>
            ${erro("hora")}
          </fieldset>

          <fieldset class="etapa">
            <legend><span class="num" aria-hidden="true">4</span>Seus dados</legend>
            <p class="dica">Para a recepção entrar em contato e confirmar.</p>
            <div class="campos-form">
              <div class="campos-2">
                <div class="campo">
                  <label for="ag-nome">Nome completo</label>
                  <input id="ag-nome" name="nome" type="text" autocomplete="name" required aria-describedby="erro-ag-nome">
                  ${erro("ag-nome")}
                </div>
                <div class="campo">
                  <label for="ag-whatsapp">WhatsApp com DDD</label>
                  <input id="ag-whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" required aria-describedby="erro-ag-whatsapp" placeholder="(16) 91234-5678">
                  ${erro("ag-whatsapp")}
                </div>
              </div>
              <div class="campo">
                <label for="ag-convenio">Convênio <span class="opc">(opcional)</span></label>
                <select id="ag-convenio" name="convenio" aria-describedby="dica-conv"></select>
                <p class="dica-campo" id="dica-conv">Lista demonstrativa. A cobertura é sempre confirmada pela recepção.</p>
              </div>
              <div class="campo">
                <label for="ag-obs">Observações <span class="opc">(opcional)</span></label>
                <textarea id="ag-obs" name="observacoes" maxlength="300" data-contador="ag-contador" aria-describedby="ag-dica-obs ag-contador"></textarea>
                <p class="dica-campo" id="ag-dica-obs">Ex.: prefiro ser chamada à tarde. Não escreva informações de saúde aqui; elas são tratadas na consulta.</p>
                <span class="contador" id="ag-contador">0 de 300 caracteres</span>
              </div>
              <div class="resumo-box" aria-live="polite">
                <h3>Resumo da solicitação</h3>
                <dl>
                  <div><dt>Especialidade</dt><dd id="r-esp">Não escolhida</dd></div>
                  <div><dt>Dia</dt><dd id="r-dia">Não escolhido</dd></div>
                  <div><dt>Horário</dt><dd id="r-hora">Não escolhido</dd></div>
                  <div><dt>Convênio</dt><dd id="r-conv">Particular ou não sei</dd></div>
                </dl>
              </div>
              <div class="campo">
                <label class="check"><input type="checkbox" id="ag-consentimento" name="consentimento" required aria-describedby="erro-ag-consentimento"><span>Concordo com o uso dos meus dados para retorno desta solicitação, conforme a <a href="privacidade.html">Política de privacidade</a>.</span></label>
                ${erro("ag-consentimento")}
              </div>
              <button class="btn btn-grande enviar-final" type="submit">${I.cal}Enviar pré-agendamento</button>
              <p class="status" id="agenda-status" role="status" tabindex="-1" hidden></p>
            </div>
          </fieldset>
          <div class="passos-nav">
            <button class="btn btn-contorno" type="button" data-passo="voltar" hidden>Voltar</button>
            <button class="btn" type="button" data-passo="proximo">Continuar</button>
          </div>
        </form>

        <section class="painel-form confirmacao" id="agenda-ok" tabindex="-1" hidden aria-labelledby="t-ok">
          <svg class="check-anim" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="36"/><path d="M22 37l9 9 19-20"/></svg>
          <h2 id="t-ok">Pronto! Solicitação registrada</h2>
          <p class="nota-demo">${I.info}<span><strong>Solicitação de pré-agendamento simulada.</strong> Nenhuma consulta foi marcada e nenhum dado foi enviado.</span></p>
          <p class="nota">Protocolo fictício:</p>
          <p class="protocolo" id="ok-protocolo"></p>
          <dl class="ok-resumo" id="ok-resumo"></dl>
          <p>Em uso real, a recepção confere a agenda e confirma pelo WhatsApp. A consulta só fica marcada depois dessa confirmação.</p>
          <div class="acoes">
            <button class="btn btn-contorno" type="button" id="ok-ics">${I.cal}Adicionar ao calendário</button>
            <a class="btn" id="ok-wa" hidden target="_blank" rel="noopener" data-evento="clique_whatsapp" data-origem="agendamento-confirmacao">${I.chat}Enviar pelo WhatsApp</a>
            <button class="link-btn" type="button" id="ok-nova">Fazer outra solicitação</button>
          </div>
        </section>
      </div>
    </div>`,
});

/* ================= PRIMEIRA CONSULTA ================= */
page({
  file: "primeira-consulta.html", atual: "primeira",
  title: "Primeira consulta no dentista em Ribeirão Preto | Lume",
  desc: "O que acontece na primeira consulta da Lume Odontologia, em Ribeirão Preto: cerca de 50 minutos de conversa e exame, sem procedimento no primeiro dia.",
  ld: [crumbLd([["Início", ""], ["Primeira consulta", "primeira-consulta.html"]])],
  body: `
    <section class="hero hero-int" aria-labelledby="t-pc">
      <div class="hero-texto wrap">
        ${migalhas([["Início", "index.html"], ["Primeira consulta", ""]])}
        <h1 id="t-pc">Sua primeira consulta</h1>
        <p>Saber o que vai acontecer tira boa parte do medo. É assim que funciona na Lume.</p>
        <div class="acoes">${btnAgendar("primeira-topo", "Agendar a primeira consulta", "avaliacao", "btn-grande")}</div>
      </div>
      <figure class="hero-foto">${img("helena-2", [640, 1200], 1200, 900, "Dentista mostrando o espelho para a paciente, imagem ilustrativa", "(min-width: 1024px) 50vw, 100vw", 'fetchpriority="high"')}<figcaption class="wrap">Imagem ilustrativa.</figcaption></figure>
    </section>

    <section class="s3-g" aria-labelledby="t-linha">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Do começo ao fim</p><h2 id="t-linha">Antes, durante e depois</h2></div></div>
        <div class="passos-visual" data-revelar>
          <div class="passo-v">${bolha("chat")}<p class="quando nota">Antes de vir</p><h3>Prepare-se sem pressa</h3><p>Confirme o horário com a recepção, separe exames recentes e anote os medicamentos que usa.</p></div>
          <div class="passo-v">${bolha("relogio")}<p class="quando nota">Na consulta, cerca de 50 min</p><h3>Conversa e exame</h3><p>Começa com uma conversa. Depois, exame clínico e radiografias se necessárias. Se algo incomodar, é só avisar.</p></div>
          <div class="passo-v">${bolha("doc")}<p class="quando nota">Depois</p><h3>Plano e decisão</h3><p>A dentista apresenta o diagnóstico e as opções por escrito. Você decide no seu tempo.</p></div>
        </div>
      </div>
    </section>

    <section class="faixa-areia s3-g" aria-labelledby="t-levar">
      <div class="wrap duas c5-7">
        <div><h2 id="t-levar">O que levar</h2><p>Marque o que já separou. A lista não é salva.</p></div>
        <ul class="checklist">${["Documento com foto", "Exames e radiografias recentes, se tiver", "Lista de medicamentos em uso", "Carteirinha do convênio, se tiver"].map(x => `<li><label><input type="checkbox"><span>${x}</span></label></li>`).join("")}</ul>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-acomp">
      <div class="wrap">
        <div class="secao-topo"><div><h2 id="t-acomp">Para vir tranquilo</h2></div></div>
        <div class="diferenciais">
          <div class="dif">${bolha("usuario")}<h3>Acompanhante</h3><p>Você pode vir acompanhado. Se o procedimento permitir, a pessoa fica na sala.</p></div>
          <div class="dif">${bolha("crianca")}<h3>Crianças</h3><p>Avise ao agendar para organizarmos o melhor horário e uma conversa mais lúdica.</p></div>
          <div class="dif">${bolha("acesso")}<h3>Acessibilidade</h3><p>Entrada sem degraus e banheiro adaptado (dado de exemplo).</p></div>
          <div class="dif">${bolha("coracao")}<h3>Ansiedade</h3><p>Conte se tem medo. A consulta pode ir mais devagar, com pausas combinadas.</p></div>
        </div>
      </div>
    </section>

    <section class="faixa-cor s3-g" aria-labelledby="t-pre">
      <div class="wrap duas c7-5">
        <div>
          <p class="sobretitulo">Pré-atendimento digital</p>
          <h2 id="t-pre">Adiante a anamnese pelo celular</h2>
          <p>Depois do agendamento, a clínica pode enviar um link para você contar o seu histórico de saúde antes de vir. Ajuda a preparar a consulta, mas não substitui a avaliação presencial.</p>
        </div>
        <div class="acoes" style="margin:0"><a class="btn btn-luz btn-grande" href="login.html?volta=anamnese.html">${I.escudo}Ver a anamnese (demonstração)</a></div>
      </div>
    </section>`,
});

/* ================= SOBRE ================= */
page({
  file: "sobre.html", atual: "sobre",
  title: "A clínica e a equipe | Lume Odontologia, Ribeirão Preto",
  desc: "Conheça a Lume Odontologia em Ribeirão Preto: Dra. Helena Prado (Implantodontia), Dr. Rafael Mota (Ortodontia), Camila Nogueira e a biossegurança.",
  ld: [crumbLd([["Início", ""], ["A clínica", "sobre.html"]])],
  body: `
    <section class="hero hero-int" aria-labelledby="t-sobre">
      <div class="hero-texto wrap">
        ${migalhas([["Início", "index.html"], ["A clínica", ""]])}
        <h1 id="t-sobre">A clínica e a equipe</h1>
        <p>A Lume é um consultório pequeno de propósito. Poucos pacientes por dia significa tempo para explicar. A equipe é a mesma em todas as consultas.</p>
      </div>
      <figure class="hero-foto">${img("equipe", [640, 1200], 1200, 800, "Dois profissionais de máscara em um atendimento odontológico, imagem ilustrativa", "(min-width: 1024px) 50vw, 100vw", 'fetchpriority="high"')}<figcaption class="wrap">Imagem ilustrativa: as pessoas da foto não são a equipe da Lume.</figcaption></figure>
    </section>

    <section class="wrap s3-g" aria-labelledby="t-equipe">
      <div class="secao-topo"><div><p class="sobretitulo">Equipe</p><h2 id="t-equipe">Quem cuida de você</h2><p>Personagens fictícios desta demonstração. Registros profissionais marcados como exemplo.</p></div></div>
      <article class="pessoa" data-revelar>
        <figure>${img("doutora-helena", [480, 960], 960, 1200, "Dentista em atendimento, imagem que representa a Dra. Helena Prado", "(min-width: 1024px) 480px, 100vw")}</figure>
        <div>
          <h3>Dra. Helena Prado</h3>
          <p class="cargo">Responsável técnica. Cirurgiã-dentista, especialista em Implantodontia. <span data-c="cro">CRO-SP 00000 (exemplo, não válido)</span>.</p>
          <p>Escolhi a odontologia depois de acompanhar minha avó em um tratamento longo, em que ninguém explicava o que viria a seguir. Desde então, minha regra é simples: o paciente precisa entender o plano antes de aceitá-lo.</p>
          <p>Acompanho os casos de implante da avaliação às revisões depois da prótese.</p>
          <p class="pequeno">Formação e especializações: a preencher com os dados reais do profissional.</p>
        </div>
      </article>
      <article class="pessoa inv" data-revelar>
        <figure>${img("doutor-rafael", [480, 960], 960, 1200, "Dentista explicando o atendimento a uma paciente, imagem que representa o Dr. Rafael Mota", "(min-width: 1024px) 480px, 100vw")}</figure>
        <div>
          <h3>Dr. Rafael Mota</h3>
          <p class="cargo">Cirurgião-dentista, especialista em Ortodontia. CRO-SP 00000 (exemplo, não válido).</p>
          <p>Atende crianças a partir dos 7 anos, adolescentes e adultos. Explica as opções de aparelho com modelos na mão, para o paciente entender antes de escolher.</p>
          <p class="pequeno">Formação e especializações: a preencher com os dados reais do profissional.</p>
        </div>
      </article>
      <article class="pessoa" data-revelar>
        <figure class="larga">${img("recepcao", [640, 1200], 1200, 800, "Recepção da clínica com sofá e planta", "(min-width: 1024px) 600px, 100vw")}</figure>
        <div>
          <h3>Camila Nogueira</h3>
          <p class="cargo">Coordenação e recepção.</p>
          <p>Organiza horários, confirma os pré-agendamentos e acompanha os pacientes entre uma consulta e outra.</p>
        </div>
      </article>
    </section>

    <section class="faixa-areia s3-g" aria-labelledby="t-video">
      <div class="wrap duas c5-7">
        <div><p class="sobretitulo">Vídeo</p><h2 id="t-video">Conheça a Dra. Helena</h2><p>No site real, um vídeo curto com a dentista explicando como trabalha aumenta muito a confiança de quem nunca veio.</p></div>
        <button class="video-capa" type="button" data-abrir-sheet="sheet-video-dra">
          ${img("helena-2", [640, 1200], 1200, 900, "", "(min-width: 1024px) 700px, 100vw")}
          <span class="play" aria-hidden="true"><span><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg></span></span>
          <span class="rotulo-video">Apresentação da dentista<small>Espaço para o vídeo real · 1 min</small></span>
        </button>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-prot">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Biossegurança</p><h2 id="t-prot">Como cuidamos dos instrumentais</h2></div></div>
        <div class="medo" style="align-items:start">
          <figure>${img("esterilizacao", [640, 1200], 1200, 800, "Instrumentais sobre a bancada de esterilização, imagem ilustrativa", "(min-width: 1024px) 560px, 100vw")}</figure>
          <ol class="palco-passos">
            <li class="palco-passo" style="min-height:0"><span class="n">1</span><h3>Limpeza</h3><p>Os instrumentais são lavados e secos logo depois do uso.</p></li>
            <li class="palco-passo" style="min-height:0"><span class="n">2</span><h3>Embalagem</h3><p>Cada kit é embalado e identificado com data.</p></li>
            <li class="palco-passo" style="min-height:0"><span class="n">3</span><h3>Autoclave</h3><p>Esterilização em autoclave, com registro de cada ciclo.</p></li>
            <li class="palco-passo" style="min-height:0"><span class="n">4</span><h3>Abertura na sua frente</h3><p>O pacote é aberto na sala, diante do paciente.</p></li>
          </ol>
        </div>
      </div>
    </section>

    <section class="faixa-cor s3-g" aria-labelledby="t-fecho">
      <div class="wrap duas c7-5">
        <div><h2 id="t-fecho">Venha conhecer o consultório</h2><p>Agende uma avaliação e veja de perto como trabalhamos.</p></div>
        <div class="acoes" style="margin:0">${btnAgendar("sobre-fechamento", "Agendar avaliação", "", "btn-luz btn-grande")}</div>
      </div>
    </section>
    ${sheet("sheet-video-dra", "Apresentação da dentista", `<p>Aqui entra um vídeo de 30 a 60 segundos com a dentista real, com legenda, contando como conduz as consultas.</p><p>Nesta demonstração não há vídeo, porque a Dra. Helena Prado é uma personagem fictícia.</p>`)}`,
});

/* ================= CONTATO ================= */
const assuntos = ["Primeira consulta", "Implantes", "Ortodontia", "Clareamento", "Lentes e facetas", "Prevenção e limpeza", "Urgência", "Convênios", "Outro"];
page({
  file: "contato.html", atual: "contato",
  title: "Contato e como chegar | Lume Odontologia, Ribeirão Preto",
  desc: "Horário, convênios, acessibilidade e formulário de contato da Lume Odontologia em Ribeirão Preto, SP. Dados de demonstração, configuráveis em um só arquivo.",
  ld: [crumbLd([["Início", ""], ["Contato", "contato.html"]])],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-contato">
      ${migalhas([["Início", "index.html"], ["Contato", ""]])}
      <h1 id="t-contato">Contato</h1>
      <p>Escolha o canal. Para marcar uma consulta, o mais rápido é o pré-agendamento.</p>
    </section>
    <section class="wrap s3" aria-label="Canais">${canais("contato")}</section>

    <div class="wrap s3">
      <div class="duas c5-7">
        <section class="onde" aria-labelledby="t-onde">
          <h2 id="t-onde">Onde estamos</h2>
          <div class="nota">${mapa}</div>
          <p class="acoes"><a class="btn btn-contorno" data-rota hidden target="_blank" rel="noopener">${I.pino}Traçar rota</a></p>
          <dl class="info-lista">
            <div><dt>Endereço</dt><dd><span data-c="endereco">Endereço demonstrativo, Ribeirão Preto, SP</span></dd></div>
            <div><dt>Horário</dt><dd>Segunda a sexta: 8h às 19h<br>Sábado: 8h às 13h<br>Domingo e feriados: fechado</dd></div>
            <div><dt>Acessibilidade</dt><dd>Entrada sem degraus e banheiro adaptado (exemplo).</dd></div>
            <div><dt>Estacionamento</dt><dd>Estacionamento conveniado próximo (exemplo).</dd></div>
            <div><dt>E-mail</dt><dd><a data-contato="email"><span class="valor">contato@lume.example (exemplo)</span></a></dd></div>
            <div><dt>Convênios</dt><dd>
              <ul class="convenios"><li>Odonto Exemplo</li><li>Plano Sorriso Demonstração</li><li>Dental Modelo</li><li>Saúde Bucal Fictícia</li></ul>
              <span class="pequeno">Lista demonstrativa, sem parcerias reais. Confirme com a clínica.</span>
            </dd></div>
          </dl>
        </section>

        <section aria-labelledby="t-form">
          <form class="form" id="form-contato" novalidate>
            <div><h2 id="t-form">Mande uma mensagem</h2><p class="pequeno">A recepção responde no período que você escolher.</p></div>
            <div class="campo"><label for="nome">Nome</label><input id="nome" name="nome" type="text" autocomplete="name" required aria-describedby="erro-nome">${erro("nome")}</div>
            <div class="campo"><label for="whatsapp">WhatsApp com DDD</label><input id="whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" required aria-describedby="erro-whatsapp" placeholder="(16) 91234-5678">${erro("whatsapp")}</div>
            <div class="campo"><label for="assunto">Assunto</label><select id="assunto" name="assunto" required aria-describedby="erro-assunto"><option value="">Selecione</option>${assuntos.map(a => `<option>${a}</option>`).join("")}</select>${erro("assunto")}</div>
            <fieldset class="periodos">
              <legend>Melhor período para retorno <span class="opc">(opcional)</span></legend>
              <div class="chips">
                <label class="chip"><input type="radio" name="periodo" value="Manhã, 8h às 12h"><span>Manhã<small>8h às 12h</small></span></label>
                <label class="chip"><input type="radio" name="periodo" value="Tarde, 12h às 17h"><span>Tarde<small>12h às 17h</small></span></label>
                <label class="chip"><input type="radio" name="periodo" value="Fim da tarde, 17h às 19h"><span>Fim da tarde<small>17h às 19h</small></span></label>
              </div>
            </fieldset>
            <div class="campo"><label for="mensagem">Mensagem <span class="opc">(opcional)</span></label><textarea id="mensagem" name="mensagem" maxlength="300" data-contador="contador" aria-describedby="contador"></textarea><span class="contador" id="contador">0 de 300 caracteres</span></div>
            <div class="campo"><label class="check"><input type="checkbox" id="consentimento" name="consentimento" required aria-describedby="erro-consentimento"><span>Concordo com o uso dos meus dados para retorno do contato, conforme a <a href="privacidade.html">Política de privacidade</a>.</span></label>${erro("consentimento")}</div>
            <button class="btn btn-grande" type="submit">${I.chat}Enviar mensagem</button>
            <p class="nota-demo">${I.info}<span><strong>Atenção:</strong> não envie informações de saúde (exames, diagnósticos, medicamentos) por este formulário. Elas são tratadas na consulta.</span></p>
            <p class="status" id="status" role="status" tabindex="-1" hidden></p>
          </form>
        </section>
      </div>
    </div>`,
});

/* ================= CUIDADOS ================= */
const artigos = [
  ["escovacao", "escova", "Escovação em 2 minutos", ["Escove pelo menos duas vezes por dia, sempre antes de dormir.", "Divida a boca em quatro partes e dedique cerca de 30 segundos a cada uma.", "Use escova macia e movimentos curtos, inclinando as cerdas para a gengiva.", "Escove a língua no final.", "Troque a escova quando as cerdas abrirem."]],
  ["fio", "dente", "Fio dental todo dia", ["Use uma vez por dia, de preferência à noite.", "Enrole o fio nos dedos e passe entre cada dente, abraçando a lateral.", "Quem usa aparelho ou implante pode precisar de passa-fio ou escova interdental.", "Sangramento leve nos primeiros dias é comum; se continuar, procure a clínica."]],
  ["alimentacao", "copo", "Alimentação e cáries", ["O que mais pesa é a frequência: beliscar doces o dia todo é pior do que comer de uma vez.", "Prefira água entre as refeições.", "Refrigerantes e sucos ácidos também desgastam o esmalte.", "Queijo, verduras e frutas firmes ajudam a limpar a boca."]],
  ["sensibilidade", "brilho", "Sensibilidade nos dentes", ["Pode ter várias causas: gengiva retraída, desgaste, cárie ou clareamento recente.", "Pastas para dentes sensíveis podem ajudar, com orientação.", "Evite escovar com força.", "Se a sensibilidade for forte ou durar, procure avaliação."]],
  ["aparelho", "alinhador", "Cuidados com aparelho e alinhador", ["Escove depois das refeições, com atenção aos braquetes.", "Alinhadores: tire para comer e escove os dentes antes de recolocar.", "Evite alimentos muito duros ou grudentos com aparelho fixo.", "Leve o estojo do alinhador quando sair de casa."]],
  ["quando", "cal", "Quando procurar o dentista", ["Em revisões de rotina, no intervalo combinado com a dentista.", "Se houver dor, sangramento frequente na gengiva ou mau hálito persistente.", "Se um dente quebrar, mudar de cor ou ficar mole.", "Em urgências, veja a página de urgência."]],
];
page({
  file: "cuidados.html", atual: "",
  title: "Cuide do seu sorriso: dicas de saúde bucal | Lume Odontologia",
  desc: "Dicas simples de escovação, fio dental, alimentação, sensibilidade e cuidados com aparelho, preparadas pela equipe da Lume Odontologia, em Ribeirão Preto.",
  ld: [crumbLd([["Início", ""], ["Cuide do seu sorriso", "cuidados.html"]])],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-cui">
      ${migalhas([["Início", "index.html"], ["Cuide do seu sorriso", ""]])}
      <h1 id="t-cui">Cuide do seu sorriso</h1>
      <p>Hábitos simples que fazem diferença entre uma consulta e outra. Orientações gerais, que não substituem a avaliação.</p>
    </section>
    <section class="wrap s3" aria-label="Índice">
      <div class="filtros" role="navigation" aria-label="Ir para o assunto">${artigos.map(([id, , t]) => `<a class="btn btn-contorno btn-p" href="#${id}">${t}</a>`).join("")}</div>
    </section>
    <div class="wrap s3">
      <div class="grade-trat">${artigos.map(([id, ico, t, itens]) => `
        <article class="dif" id="${id}" data-revelar>${bolha(ico)}<h2 style="font-size:1.5rem;margin:0">${t}</h2><ul class="filetes">${itens.map(i => `<li>${i}</li>`).join("")}</ul></article>`).join("")}
      </div>
    </div>
    <section class="faixa-cor s3-g" aria-labelledby="t-rev">
      <div class="wrap duas c7-5">
        <div><h2 id="t-rev">Está na hora da revisão?</h2><p>Limpeza e revisão periódicas evitam que pequenos problemas virem tratamentos maiores.</p></div>
        <div class="acoes" style="margin:0">${btnAgendar("cuidados", "Agendar limpeza e revisão", "prevencao", "btn-luz btn-grande")}</div>
      </div>
    </section>`,
});

/* ================= PARA DENTISTAS ================= */
page({
  file: "para-dentistas.html", atual: "",
  title: "O que o dentista recebe | Site com cara de aplicativo | Lume (demo)",
  desc: "O que vem no site para consultórios odontológicos: agendamento pelo celular, área do paciente, anamnese digital, páginas de tratamento e regras do CFO e da LGPD.",
  body: `
    <section class="cabeca wrap" aria-labelledby="t-pd">
      <p class="sobretitulo">Para dentistas</p>
      <h1 id="t-pd">Um site com cara de aplicativo para o seu consultório</h1>
      <p>A Lume é uma clínica fictícia criada para mostrar o que o seu site pode ter. Tudo o que você vê aqui é adaptado com o nome, as cores, as fotos e os contatos da sua clínica.</p>
      <div class="acoes"><button class="btn btn-grande" type="button" data-abrir-sheet="sheet-personalizar">Ver com a minha clínica</button><button class="btn btn-contorno btn-grande" type="button" data-tour-iniciar>Fazer o tour</button></div>
    </section>

    <section class="s3" aria-labelledby="t-telas">
      <div class="wrap">
        <h2 id="t-telas" class="sr">Telas no celular</h2>
        <div class="telas-demo">${[["inicio", "Início"], ["agendamento", "Agendamento"], ["implantes", "Tratamento"], ["paciente", "Área do paciente"], ["anamnese", "Anamnese"]].map(([f, c]) => `<figure class="tela-celular"><div class="moldura"><img src="assets/img/telas/${f}.jpg" width="390" height="844" alt="Tela do celular: ${c}" loading="lazy"></div><figcaption>${c}</figcaption></figure>`).join("")}</div>
      </div>
    </section>

    <section class="faixa-menta s3-g" aria-labelledby="t-inc">
      <div class="wrap">
        <div class="secao-topo"><div><p class="sobretitulo">Incluído</p><h2 id="t-inc">O que vem no site</h2></div></div>
        <ul class="inclui">
          <li>${bolha("celular")}<span><b>Cara de aplicativo</b><span>Navegação pelo polegar, cartões que deslizam e instalação na tela inicial.</span></span></li>
          <li>${bolha("cal")}<span><b>Agendamento em 4 passos</b><span>Especialidade, dia, horário e dados. Pronto para ligar à sua agenda ou ao WhatsApp.</span></span></li>
          <li>${bolha("usuario")}<span><b>Área do paciente</b><span>Consultas, plano de tratamento, documentos, orçamentos e mensagens.</span></span></li>
          <li>${bolha("escudo")}<span><b>Anamnese digital</b><span>O paciente conta o histórico antes de vir, com consentimento LGPD.</span></span></li>
          <li>${bolha("grade")}<span><b>Página para cada tratamento</b><span>Boa para o Google e para o paciente entender antes de agendar.</span></span></li>
          <li>${bolha("alerta", " luz")}<span><b>Página de urgência</b><span>O que fazer agora, com botão de contato a um toque.</span></span></li>
          <li>${bolha("folha")}<span><b>Conteúdo educativo</b><span>Dicas de cuidado que mostram autoridade e ajudam no SEO.</span></span></li>
          <li>${bolha("check")}<span><b>Dentro das regras</b><span>Sem preço, promoção ou promessa de resultado, seguindo as normas do CFO.</span></span></li>
          <li>${bolha("cadeado")}<span><b>LGPD</b><span>Consentimento nos formulários, aviso de cookies e política de privacidade.</span></span></li>
        </ul>
      </div>
    </section>

    <section class="s3-g" aria-labelledby="t-como-f">
      <div class="wrap">
        <div class="secao-topo"><div><h2 id="t-como-f">Como fica com a sua clínica</h2></div></div>
        <div class="passos-visual">
          <div class="passo-v">${bolha("chat")}<p class="quando nota">1</p><h3>Conversa rápida</h3><p>Nome, especialidades, horários, convênios e contatos.</p></div>
          <div class="passo-v">${bolha("folha")}<p class="quando nota">2</p><h3>Fotos e textos</h3><p>Um roteiro de fotos e vídeos da sua clínica e da equipe, e textos revisados.</p></div>
          <div class="passo-v">${bolha("celular")}<p class="quando nota">3</p><h3>No ar</h3><p>Domínio próprio, Google configurado e WhatsApp ligado aos botões.</p></div>
        </div>
      </div>
    </section>

    <section class="faixa-cor s3-g" aria-labelledby="t-falar">
      <div class="wrap duas c7-5">
        <div><h2 id="t-falar">Quer um site assim?</h2><p>Fale com a <span data-c="nomeAgencia">Sitra</span>, que desenvolveu esta demonstração: <span data-c="sloganAgencia">Digitalização de negócios</span>.</p></div>
        <div class="acoes" style="margin:0"><a class="btn btn-luz btn-grande" href="#" data-agencia-link hidden>${I.chat}Falar com a <span data-c="nomeAgencia">Sitra</span></a><span class="pequeno" data-agencia-sem>Configure o WhatsApp da agência em config.js (whatsappAgencia).</span></div>
      </div>
    </section>`,
});

/* ================= PRIVACIDADE ================= */
page({
  file: "privacidade.html", atual: "",
  title: "Política de privacidade | Lume Odontologia",
  desc: "Como a Lume Odontologia, em Ribeirão Preto, trataria os dados enviados pelo site: quais dados, para quê, por quanto tempo e como pedir acesso ou exclusão.",
  ld: [crumbLd([["Início", ""], ["Política de privacidade", "privacidade.html"]])],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-priv">
      ${migalhas([["Início", "index.html"], ["Política de privacidade", ""]])}
      <h1 id="t-priv">Política de privacidade</h1>
      <p>Este texto explica, em linguagem simples, o que acontece com os dados enviados pelo site.</p>
    </section>
    <div class="wrap py-b">
      <div class="texto">
        <p class="nota-demo">${I.info}<span><strong>Modelo para demonstração.</strong> Os trechos entre colchetes precisam ser preenchidos, e o texto deve ser revisado por um profissional jurídico antes da publicação.</span></p>
        <h2 class="nota">Quem é responsável pelos dados</h2>
        <p>[Razão social da clínica], CNPJ [número], com endereço em [endereço completo]. Contato do encarregado pelos dados: [nome], [e-mail].</p>
        <h2>Quais dados coletamos</h2>
        <p>No pré-agendamento: especialidade, dia e horário de preferência, nome, WhatsApp, convênio e observações opcionais. No formulário de contato: nome, WhatsApp, assunto, período de retorno e mensagem. O site público não pede informações de saúde.</p>
        <h2>Anamnese e área do paciente</h2>
        <p>Informações de saúde são dados pessoais sensíveis. Em produção, a anamnese e a área do paciente ficam atrás de login, com acesso restrito a cada paciente e à equipe autorizada, transporte por HTTPS e armazenamento em servidor protegido. [Descrever o fornecedor do sistema e as medidas adotadas.] Nesta demonstração, nenhuma resposta é armazenada ou enviada.</p>
        <h2>Para que usamos</h2>
        <p>Para responder ao seu contato, confirmar agendamentos e preparar o atendimento. Não enviamos propaganda sem a sua autorização.</p>
        <h2>Base legal</h2>
        <p>Consentimento, dado ao marcar a caixa de concordância (art. 7º, I, da Lei 13.709/2018). Para dados de saúde, consentimento específico e destacado ou tutela da saúde (art. 11). [Validar com o jurídico.]</p>
        <h2>Com quem compartilhamos</h2>
        <p>Com o serviço de mensagens usado para responder, quando você escolhe o WhatsApp, e com [listar hospedagem, sistema de agenda e prontuário]. Não vendemos dados.</p>
        <h2>Por quanto tempo guardamos</h2>
        <p>Dados de contato: [prazo, por exemplo até 12 meses depois do último contato]. Prontuário: pelo prazo exigido pelas normas do Conselho Federal de Odontologia.</p>
        <h2>Seus direitos</h2>
        <p>Você pode pedir acesso, correção ou exclusão dos seus dados e revogar o consentimento a qualquer momento, escrevendo para [e-mail do encarregado] ou falando com a recepção.</p>
        <h2>Cookies e armazenamento no navegador</h2>
        <p>Guardamos no seu navegador apenas: a sua escolha sobre cookies; se você já viu o tour; e, se usar o recurso "Ver com a minha clínica", o nome e a cor escolhidos. Cookies de medição de audiência [nome da ferramenta] só são ativados se você clicar em "Aceitar". Na área do paciente de demonstração, uma marca temporária de sessão fica no navegador até a aba ser fechada ou você clicar em "Sair". O site pode guardar cópias das páginas públicas para abrir sem internet.</p>
        <h2>Atualizações</h2>
        <p>Última atualização: [dd/mm/aaaa].</p>
      </div>
    </div>`,
});

/* ================= OFFLINE ================= */
page({
  file: "offline.html", atual: "", semNav: false,
  title: "Sem conexão | Lume Odontologia",
  desc: "Página exibida quando o aparelho está sem internet.",
  body: `
    <section class="cabeca wrap" aria-labelledby="t-off">
      <h1 id="t-off">Você está sem internet</h1>
      <p>As páginas que você já visitou continuam disponíveis. O agendamento e a área do paciente precisam de conexão.</p>
      <div class="acoes"><a class="btn" href="index.html">Voltar ao início</a></div>
    </section>`,
});

/* ================= LOGIN ================= */
page({
  file: "login.html", atual: "paciente",
  title: "Área do paciente: entrar | Lume Odontologia",
  desc: "Entrada da área do paciente da Lume Odontologia. Nesta demonstração, o acesso usa uma paciente fictícia e não há autenticação real.",
  pagina: "login", scripts: ["portal.js"],
  body: `
    <section class="cabeca wrap" aria-labelledby="t-login">
      ${migalhas([["Início", "index.html"], ["Área do paciente", ""]])}
      <h1 id="t-login">Área do paciente</h1>
      <p>Consultas, plano de tratamento, documentos e a anamnese digital, tudo no celular.</p>
    </section>
    <div class="wrap s3">
      <p class="status" id="login-status" role="status" tabindex="-1" hidden></p>
      <div class="login nota">
        <section class="painel-form acesso-demo" aria-labelledby="t-demo">
          ${bolha("usuario")}
          <h2 id="t-demo" class="nota">Entrar na demonstração</h2>
          <p>Veja a área do paciente com a paciente fictícia <strong data-c="pacienteDemo">Maria Oliveira</strong>. Nenhum dado real é exibido, coletado ou guardado.</p>
          <ul class="filetes">
            <li>Não existe verificação de senha nesta demonstração.</li>
            <li>A sessão é só uma marca temporária no navegador e termina ao clicar em "Sair" ou fechar a aba.</li>
          </ul>
          <div class="acoes"><button class="btn btn-grande" type="button" id="entrar-demo">Entrar como paciente fictícia</button></div>
        </section>
        <form class="painel-form" id="form-login" novalidate aria-labelledby="t-entrar">
          <h2 id="t-entrar">Entrar com a sua conta</h2>
          <p class="pequeno">Em produção, o login é validado no servidor da clínica, com sessão segura.</p>
          <div class="campos-form">
            <div class="campo"><label for="usuario">E-mail ou CPF</label><input id="usuario" name="usuario" type="text" autocomplete="username" aria-describedby="erro-usuario">${erro("usuario")}</div>
            <div class="campo"><label for="senha">Senha</label><input id="senha" name="senha" type="password" autocomplete="current-password" aria-describedby="erro-senha">${erro("senha")}</div>
            <button class="btn" type="submit">${I.cadeado}Entrar</button>
          </div>
        </form>
      </div>
    </div>`,
});

/* ================= PORTAL ================= */
page({
  file: "paciente.html", atual: "paciente.html#inicio",
  title: "Área do paciente | Lume Odontologia",
  desc: "Área do paciente de demonstração da Lume Odontologia: próxima consulta, plano de tratamento, documentos, orçamentos, recibos e mensagens de uma paciente fictícia.",
  portal: true, pagina: "paciente", scripts: ["portal.js"],
  faixa: "Área do paciente em modo demonstração: dados fictícios, sem autenticação real.",
  body: `
    <section class="saudacao wrap" id="inicio" aria-labelledby="t-ola">
      <p class="pequeno">Área do paciente</p>
      <h1 id="t-ola"><span data-saudacao>Olá</span>, <span data-paciente-primeiro>Maria</span></h1>
      <p>Tudo nesta tela é fictício: é assim que o paciente acompanha o tratamento pelo celular.</p>
      <div class="rapidas nota">
        <a class="rapida destaque" href="agendamento.html?retorno=1">${bolha("cal")}<span><b>Agendar retorno</b><small>Pedir um novo horário</small></span></a>
        <a class="rapida" href="anamnese.html">${bolha("escudo")}<span><b>Anamnese</b><small>Antes da consulta</small></span></a>
        <a class="rapida" href="#arquivos">${bolha("doc")}<span><b>Documentos</b><small>Plano, recibos e mais</small></span></a>
        <a class="rapida" href="#" data-so-wa hidden data-wa="Olá, sou paciente da {nome} e gostaria de falar com a recepção." data-origem="portal">${bolha("chat")}<span><b>WhatsApp</b><small>Falar com a recepção</small></span></a>
        <a class="rapida" href="#mensagens" data-sem-wa>${bolha("chat")}<span><b>Mensagens</b><small>Avisos da clínica</small></span></a>
      </div>
    </section>

    <div class="wrap dash">
      <section class="cartao proxima c5" aria-labelledby="t-prox">
        <h2 id="t-prox">Próxima consulta</h2>
        <p class="data" id="prox-data"></p>
        <div class="contagem" aria-label="Tempo até a consulta"><div><b id="cd-dias">0</b><small>dias</small></div><div><b id="cd-horas">0</b><small>horas</small></div><div><b id="cd-min">0</b><small>min</small></div></div>
        <p class="faltam" id="prox-faltam"></p>
        <dl>
          <div><dt>Horário</dt><dd id="prox-hora"></dd></div>
          <div><dt>Profissional</dt><dd id="prox-prof"></dd></div>
          <div><dt>Motivo</dt><dd id="prox-motivo"></dd></div>
        </dl>
        <div class="acoes-prox"><button class="btn" type="button" id="prox-ics">${I.cal}Adicionar ao calendário</button><a class="btn btn-contorno" href="contato.html">${I.pino}Como chegar</a></div>
      </section>

      <section class="cartao c7" id="plano" aria-labelledby="t-plano">
        <div class="cartao-topo"><div><h2 id="t-plano">Plano de tratamento</h2><p class="sub">Implante na região do dente 36 · etapa 4 de 5</p></div><a href="documento.html?tipo=plano">Ver plano</a></div>
        <div class="plano-trilho" id="plano-trilho" aria-hidden="true"></div>
        <ol class="plano-etapas" id="plano-etapas"></ol>
      </section>

      <section class="cartao c7" id="atendimentos" aria-labelledby="t-hist">
        <div class="cartao-topo">
          <div><h2 id="t-hist">Histórico de atendimentos</h2><p class="sub">Consultas e procedimentos anteriores.</p></div>
          <label class="filtro">Mostrar <select id="hist-filtro"><option value="">Todos</option><option>Consulta</option><option>Procedimento</option><option>Exame</option></select></label>
        </div>
        <ul class="hist" id="hist-lista" aria-live="polite"></ul>
        <button class="link-btn" type="button" id="hist-mais" aria-controls="hist-lista">Ver histórico completo</button>
      </section>

      <section class="cartao c5" id="mensagens" aria-labelledby="t-msg">
        <div class="cartao-topo"><div><h2 id="t-msg">Mensagens da clínica</h2><p class="sub">Orientações e avisos.</p></div></div>
        <div class="conversa" id="msg-lista"></div>
      </section>

      <section class="cartao c12" id="arquivos" aria-labelledby="t-arq">
        <div class="cartao-topo"><div><h2 id="t-arq">Documentos e exames</h2><p class="sub">Documentos de exemplo gerados por esta demonstração. Exames de imagem não têm arquivo.</p></div></div>
        <ul class="linhas" id="arq-lista"></ul>
      </section>

      <section class="cartao c6" id="orcamentos" aria-labelledby="t-orc">
        <div class="cartao-topo"><div><h2 id="t-orc">Orçamentos</h2><p class="sub">Acompanhe a situação de cada um.</p></div></div>
        <ul class="linhas" id="orc-lista"></ul>
        <p class="valores-nota">Valores fictícios de exemplo.</p>
      </section>

      <section class="cartao c6" id="recibos" aria-labelledby="t-rec">
        <div class="cartao-topo"><div><h2 id="t-rec">Recibos</h2><p class="sub">Pagamentos registrados.</p></div></div>
        <ul class="linhas" id="rec-lista"></ul>
        <p class="valores-nota">Valores fictícios de exemplo.</p>
      </section>

      <section class="cartao c7" id="cadastro" aria-labelledby="t-cad">
        <h2 id="t-cad">Meus dados</h2>
        <p class="sub">Cadastro fictício. Alterações não são salvas.</p>
        <form id="form-cadastro" class="campos-form nota" novalidate>
          <div class="campos-2">
            <div class="campo"><label for="cad-nome">Nome completo</label><input id="cad-nome" name="nome" type="text" autocomplete="off" aria-describedby="erro-cad-nome">${erro("cad-nome")}</div>
            <div class="campo"><label for="cad-nasc">Data de nascimento</label><input id="cad-nasc" name="nascimento" type="date" autocomplete="off"></div>
            <div class="campo"><label for="cad-whatsapp">WhatsApp</label><input id="cad-whatsapp" name="whatsapp" type="tel" autocomplete="off" aria-describedby="erro-cad-whatsapp">${erro("cad-whatsapp")}</div>
            <div class="campo"><label for="cad-email">E-mail</label><input id="cad-email" name="email" type="email" autocomplete="off" aria-describedby="erro-cad-email">${erro("cad-email")}</div>
          </div>
          <button class="btn" type="submit">Salvar alterações</button>
          <p class="status" id="cad-status" role="status" tabindex="-1" hidden></p>
        </form>
      </section>

      <section class="cartao c5" aria-labelledby="t-app">
        ${bolha("celular")}
        <h2 id="t-app" class="nota">Lume no seu celular</h2>
        <p class="sub">Instale a área do paciente na tela inicial, como um aplicativo.</p>
        <div class="acoes"><button class="btn" type="button" data-instalar hidden>${I.celular}Instalar o app</button><p class="pequeno" data-instalar-dica>No iPhone: toque em Compartilhar e depois em "Adicionar à Tela de Início". No Android, o navegador oferece "Instalar app" no menu.</p></div>
      </section>
    </div>`,
});

/* ================= DOCUMENTO ================= */
page({
  file: "documento.html", atual: "paciente.html#arquivos",
  title: "Documento de exemplo | Área do paciente | Lume Odontologia",
  desc: "Documento fictício da área do paciente de demonstração da Lume Odontologia.",
  portal: true, pagina: "documento", scripts: ["portal.js"],
  faixa: "Área do paciente em modo demonstração: dados fictícios, sem autenticação real.",
  body: `
    <div class="wrap py-a">
      ${migalhas([["Área do paciente", "paciente.html"], ["Documento", ""]])}
      <article class="documento" aria-labelledby="doc-titulo">
        <span class="marca-dagua">DOCUMENTO FICTÍCIO DE DEMONSTRAÇÃO, SEM VALIDADE</span>
        <p class="marca">${SIMB}<span class="nome-marca"><b>Lume</b><span class="comp">Odontologia</span></span></p>
        <h1 id="doc-titulo">Documento</h1>
        <div id="doc-corpo"></div>
      </article>
      <p class="doc-acoes"><button class="btn" type="button" id="doc-imprimir">Imprimir ou salvar em PDF</button><a class="link" href="paciente.html#arquivos">Voltar para a área do paciente</a></p>
    </div>`,
});

/* ================= ANAMNESE ================= */
const radios = (nome, opcoes, legenda, dica = "") => `
              <fieldset class="pergunta" aria-describedby="erro-${nome}">
                <legend>${legenda}</legend>${dica ? `<p class="dica-campo">${dica}</p>` : ""}
                <div class="radios">${opcoes.map(o => `<label><input type="radio" name="${nome}" value="${o}">${o}</label>`).join("")}</div>
                ${erro(nome)}
              </fieldset>`;
const detalhe = (pai, nome, rotulo) => `
              <div class="campo condicional" data-se="${pai}=Sim" hidden>
                <label for="an-${nome}">${rotulo}</label>
                <input id="an-${nome}" name="${nome}" type="text" maxlength="120" autocomplete="off" aria-describedby="erro-an-${nome}">
                ${erro("an-" + nome)}
              </div>`;
page({
  file: "anamnese.html", atual: "anamnese.html",
  title: "Anamnese digital pré-consulta | Área do paciente | Lume Odontologia",
  desc: "Anamnese digital de demonstração da Lume Odontologia em quatro etapas: dados, saúde, hábitos e revisão. Nenhuma resposta é armazenada.",
  portal: true, pagina: "anamnese", scripts: ["portal.js", "anamnese.js"],
  faixa: "Anamnese em modo demonstração: não digite informações reais de saúde. Nada é enviado nem salvo.",
  body: `
    <section class="cabeca wrap" aria-labelledby="t-an">
      ${migalhas([["Área do paciente", "paciente.html"], ["Anamnese digital", ""]])}
      <h1 id="t-an">Anamnese digital</h1>
      <p>Responda antes da visita. Assim a dentista já conhece o seu histórico e a consulta rende mais. O preenchimento não substitui a avaliação presencial.</p>
    </section>

    <div class="wrap py-a anamnese">
      <form class="painel-form" id="form-anamnese" novalidate aria-labelledby="t-an">
        <div class="progresso-box">
          <ol class="progresso" aria-label="Etapas da anamnese">
            <li><span class="num" aria-hidden="true">1</span><span class="txt">Dados</span></li>
            <li><span class="num" aria-hidden="true">2</span><span class="txt">Saúde</span></li>
            <li><span class="num" aria-hidden="true">3</span><span class="txt">Hábitos</span></li>
            <li><span class="num" aria-hidden="true">4</span><span class="txt">Revisão</span></li>
          </ol>
          <div class="trilho" aria-hidden="true"><span id="barra-prog"></span></div>
          <p class="prog-texto" id="prog-texto" aria-live="polite"></p>
        </div>

        <section class="passo" aria-labelledby="p1">
          <h2 id="p1">Dados pessoais</h2>
          <p class="dica">Confira os dados da paciente fictícia.</p>
          <div class="campos-form">
            <div class="campo"><label for="an-nome">Nome completo</label><input id="an-nome" name="nome" type="text" autocomplete="off" aria-describedby="erro-an-nome">${erro("an-nome")}</div>
            <div class="campos-2">
              <div class="campo"><label for="an-nascimento">Data de nascimento</label><input id="an-nascimento" name="nascimento" type="date" autocomplete="off" aria-describedby="erro-an-nascimento">${erro("an-nascimento")}</div>
              <div class="campo"><label for="an-telefone">Telefone com DDD</label><input id="an-telefone" name="telefone" type="tel" autocomplete="off" aria-describedby="erro-an-telefone">${erro("an-telefone")}</div>
            </div>
            <p class="dica-campo">O CPF não é pedido aqui: ele só é necessário no cadastro presencial.</p>
          </div>
        </section>

        <section class="passo" aria-labelledby="p2" hidden>
          <h2 id="p2">Saúde bucal e histórico</h2>
          <p class="dica">Conte o motivo da consulta e o que a dentista precisa saber para um atendimento seguro.</p>
          <p class="acoes"><button class="link-btn" type="button" id="preencher-exemplo">Preencher com respostas fictícias</button><span class="pequeno" id="preencher-status" role="status"></span></p>
          <div class="campos-form">
            <fieldset class="pergunta" aria-describedby="erro-motivo">
              <legend>Qual é o motivo da consulta? Marque um ou mais.</legend>
              <div class="caixas">${["Dor", "Revisão", "Implante", "Ortodontia", "Estética", "Urgência"].map(m => `<label><input type="checkbox" name="motivo" value="${m}">${m}</label>`).join("")}</div>
              ${erro("motivo")}
            </fieldset>
            <div class="campo">
              <label for="an-descricao">Descreva melhor o motivo <span class="opc">(opcional)</span></label>
              <textarea id="an-descricao" name="descricao" maxlength="300" data-contador="an-cont1" aria-describedby="an-cont1"></textarea>
              <span class="contador" id="an-cont1">0 de 300 caracteres</span>
            </div>
            ${radios("alergia", ["Não", "Sim"], "Você tem alguma alergia?")}${detalhe("alergia", "alergiaQual", "Qual alergia?")}
            ${radios("medicamento", ["Não", "Sim"], "Usa algum medicamento de forma contínua?")}${detalhe("medicamento", "medicamentoQual", "Quais medicamentos?")}
            ${radios("gravidez", ["Não", "Sim", "Prefiro não informar"], "Está grávida?", "Pergunta importante para radiografias e medicamentos.")}
            ${radios("cronica", ["Não", "Sim"], "Tem alguma condição de saúde crônica?", "Ex.: pressão alta, diabetes, problema cardíaco.")}${detalhe("cronica", "cronicaQual", "Qual condição?")}
            <div class="campo">
              <label for="an-ultima">Quando foi a sua última consulta odontológica?</label>
              <select id="an-ultima" name="ultima" aria-describedby="erro-an-ultima"><option value="">Selecione</option><option>Há menos de 6 meses</option><option>Entre 6 meses e 1 ano</option><option>Entre 1 e 2 anos</option><option>Há mais de 2 anos</option><option>Não lembro</option></select>
              ${erro("an-ultima")}
            </div>
          </div>
        </section>

        <section class="passo" aria-labelledby="p3" hidden>
          <h2 id="p3">Hábitos e observações</h2>
          <p class="dica">Alguns hábitos influenciam o tratamento. Não há resposta certa.</p>
          <div class="campos-form">
            ${radios("fuma", ["Não", "Sim", "Parei"], "Você fuma?")}
            ${radios("bruxismo", ["Não", "Sim", "Não sei"], "Range ou aperta os dentes (bruxismo)?")}
            ${radios("sensibilidade", ["Não", "Sim"], "Tem sensibilidade nos dentes?")}
            <div class="campo">
              <label for="an-observacao">Alguma observação? <span class="opc">(opcional)</span></label>
              <textarea id="an-observacao" name="observacao" maxlength="300" data-contador="an-cont2" aria-describedby="an-cont2"></textarea>
              <span class="contador" id="an-cont2">0 de 300 caracteres</span>
            </div>
          </div>
        </section>

        <section class="passo" aria-labelledby="p4" hidden>
          <h2 id="p4">Revisão</h2>
          <p class="dica">Confira as respostas. Use "Editar" para voltar a qualquer etapa sem perder o que já preencheu.</p>
          <div id="resumo"></div>
          <fieldset class="pergunta nota" aria-describedby="erro-consentimento">
            <legend class="sr">Consentimento</legend>
            <label class="check"><input type="checkbox" name="consentimento"><span>Declaro que as informações são verdadeiras e autorizo o uso dos meus dados de saúde pela Lume Odontologia para fins de atendimento, conforme a Lei 13.709/2018 e a <a href="privacidade.html">Política de privacidade</a>.</span></label>
            ${erro("consentimento")}
          </fieldset>
        </section>

        <div class="botoes-passo">
          <button class="btn btn-contorno" type="button" id="btn-voltar" hidden>Voltar</button>
          <div class="direita">
            <button class="btn" type="button" id="btn-avancar">Continuar</button>
            <button class="btn" type="submit" id="btn-enviar" hidden>Enviar (simulado)</button>
          </div>
        </div>
        <p class="status nota" id="anamnese-status" role="status" hidden></p>
      </form>

      <section class="painel-form confirmacao" id="anamnese-ok" tabindex="-1" hidden aria-labelledby="t-an-ok">
        <svg class="check-anim" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="36"/><path d="M22 37l9 9 19-20"/></svg>
        <h2 id="t-an-ok">Envio simulado concluído</h2>
        <p>Nenhuma informação foi enviada nem armazenada, e o formulário foi limpo. Em produção, as respostas seguem para o prontuário da clínica por conexão segura, com acesso só da equipe autorizada.</p>
        <div class="acoes"><a class="btn" href="paciente.html">Voltar para a área do paciente</a><a class="link" href="anamnese.html">Preencher de novo</a></div>
      </section>

      <aside aria-label="Ajuda">
        <section class="cartao lado-ajuda" aria-labelledby="t-aj">
          ${bolha("chat")}
          <h2 id="t-aj" class="nota">Precisa de ajuda?</h2>
          <p>A recepção ajuda com o preenchimento no horário de atendimento: <span data-c="horarioCurto">Seg a sex, 8h às 19h · Sáb, 8h às 13h</span>.</p>
          <p><a data-contato="telefone" data-origem="anamnese">${I.tel}<span class="valor">(16) 0000-0000 (exemplo, sem ligação)</span></a></p>
        </section>
        <section class="cartao lado-ajuda" aria-labelledby="t-priv">
          ${bolha("cadeado")}
          <h2 id="t-priv" class="nota">Sobre os seus dados</h2>
          <p>Informações de saúde são dados sensíveis pela LGPD. Nesta demonstração elas ficam só na memória desta página e somem ao recarregar.</p>
          <p><a href="privacidade.html">Ler a política de privacidade</a></p>
        </section>
      </aside>
    </div>`,
});

console.log("Páginas geradas em " + OUT);
