/* =====================================================================
   LUME ODONTOLOGIA: CONFIGURAÇÃO ÚNICA DO SITE
   Todos os dados abaixo são FICTÍCIOS (demonstração). Troque aqui e o
   site inteiro é atualizado. Campos vazios ("") desativam o recurso:
   nenhum link falso é criado.
   Objeto global (window.CLINICA) para o site abrir direto do arquivo.
   ===================================================================== */
window.CLINICA = {
  nome: "Lume Odontologia",
  marca: "Lume",
  complemento: "Odontologia",
  cidade: "Ribeirão Preto, SP",

  /* Endereço: enquanto não houver endereço real autorizado, fica o texto demonstrativo */
  endereco: "Endereço demonstrativo, Ribeirão Preto, SP",
  enderecoReal: false,
  enderecoPartes: { rua: "", bairro: "", cidade: "Ribeirão Preto", uf: "SP", cep: "" },
  /* Rota no Google Maps: preencha com o endereço real (ex.: "Rua X, 100, Ribeirão Preto, SP") */
  rotaDestino: "",
  /* URL de incorporação do mapa (src do iframe do Google Maps da clínica real) */
  mapaEmbedUrl: "",

  horario: "Segunda a sexta, 8h às 19h. Sábado, 8h às 13h.",
  horarioCurto: "Seg a sex, 8h às 19h · Sáb, 8h às 13h",
  horarioDetalhe: ["Segunda a sexta: 8h às 19h", "Sábado: 8h às 13h", "Domingo e feriados: fechado"],
  horarioSchema: ["Mo-Fr 08:00-19:00", "Sa 08:00-13:00"],
  /* Horários exibidos como "preferência" no pré-agendamento (não são vagas) */
  horariosPreferidos: {
    semana: ["08:00", "09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30", "17:30"],
    sabado: ["08:00", "09:00", "10:00", "11:00", "12:00"]
  },
  diasAbertos: [1, 2, 3, 4, 5, 6],         /* 0 = domingo */
  antecedenciaMaximaDias: 60,
  fusoHorario: "America/Sao_Paulo",

  responsavel: "Dra. Helena Prado",
  cro: "CRO-SP 00000 (exemplo)",
  especialidade: "Implantodontia",
  equipe: [
    { nome: "Dra. Helena Prado", funcao: "Cirurgiã-dentista, Implantodontia", registro: "CRO-SP 00000 (exemplo, não válido)" },
    { nome: "Dr. Rafael Mota", funcao: "Cirurgião-dentista, Ortodontia", registro: "CRO-SP 00000 (exemplo, não válido)" },
    { nome: "Camila Nogueira", funcao: "Coordenação e recepção", registro: "" }
  ],
  cnpj: "00.000.000/0000-00 (exemplo, não válido)",

  /* Contatos REAIS: deixe vazio até ter números autorizados. */
  telefone: "",          /* ex.: "(16) 3000-0000" */
  telefoneLink: "",      /* ex.: "+551630000000" */
  whatsapp: "",          /* só números, com 55 e DDD. ex.: "5516900000000" */
  email: "",             /* ex.: "contato@dominio.com.br" */
  /* Texto exibido enquanto os contatos reais não existem */
  telefoneExemplo: "(16) 0000-0000",
  emailExemplo: "contato@lume.example",

  convenios: [
    "Odonto Exemplo",
    "Plano Sorriso Demonstração",
    "Dental Modelo",
    "Saúde Bucal Fictícia"
  ],
  conveniosAviso: "Lista demonstrativa. Confirme com a clínica.",

  especialidades: [
    { id: "avaliacao", nome: "Avaliação inicial" },
    { id: "implantes", nome: "Implantes" },
    { id: "ortodontia", nome: "Ortodontia" },
    { id: "clareamento", nome: "Clareamento" },
    { id: "lentes", nome: "Lentes e facetas" },
    { id: "prevencao", nome: "Prevenção e limpeza" },
    { id: "urgencia", nome: "Urgência" }
  ],

  /* Redes sociais: só aparecem se preenchidas */
  redes: { instagram: "", facebook: "", linkedin: "" },

  /* Demonstração */
  mostrarFaixaDemo: true,
  pacienteDemo: "Maria Oliveira",
  whatsappAgencia: "5516994447044",   /* WhatsApp da Sitra (16) 99444-7044; vazio esconde os botões */

  /* Crédito de quem desenvolveu o site ("By Sitra" no rodapé) */
  mostrarCreditoAgencia: true,
  nomeAgencia: "Sitra",
  sloganAgencia: "Digitalização de negócios",
  siteAgencia: ""        /* ex.: "https://www.sitra.com.br" (vazio = sem link) */
};
