# Lume Odontologia: site demonstrativo com cara de aplicativo

Site de demonstração para apresentar a dentistas como ficaria o site do consultório, com navegação de aplicativo no celular, agendamento, área do paciente e anamnese digital. Desenvolvido por **Sitra · Digitalização de negócios** (crédito "By Sitra" no rodapé).

**Todos os dados são fictícios**: a clínica, a Dra. Helena Prado, o Dr. Rafael Mota, Camila Nogueira, a paciente Maria Oliveira, as avaliações, os orçamentos e os recibos são exemplos. As fotos são de banco de imagens (Unsplash) e não mostram a equipe nem a clínica.

## Como executar

Sem instalação. As páginas são HTML estático.

- **Direto do arquivo:** abra `index.html`. As páginas públicas funcionam por `file://` (o app instalável e o modo offline só funcionam em servidor).
- **Servidor local (recomendado):**

```bash
npx serve .
```

```bash
python -m http.server 5500
```

Depois abra http://localhost:5500. No celular, na mesma rede, use o IP do computador.

## Publicar na Vercel

1. Na Vercel, "Add New → Project" e importe este repositório.
2. Framework Preset: **Other**. Build Command: vazio. Output Directory: `.` (raiz).
3. Deploy. Cada envio para a branch `main` publica uma nova versão.

O `vercel.json` define cabeçalhos de segurança, impede que o `sw.js` fique preso em cache (atualizações chegam na hora) e guarda as imagens por 7 dias. Ele também envia `X-Robots-Tag: noindex` porque o conteúdo é fictício: **remova essa linha** quando o site for de uma clínica real. O `.vercelignore` deixa `capturas/`, `ferramentas/` e os documentos `.md` fora do site publicado.

## Editar as páginas

O cabeçalho, o rodapé, a navegação inferior e os painéis são iguais em todas as páginas, então ficam num gerador, em vez de copiados 20 vezes:

```bash
node ferramentas/gerar.js
```

- Textos e estrutura: `ferramentas/gerar.js` (uma função `page()` por página; os tratamentos ficam nos objetos `TRAT` e `GEN`).
- Dados trocáveis (nome, contatos, horários, convênios, crédito da agência): `assets/js/config.js`. Não precisa rodar o gerador para isso.
- Estilos: `assets/css/style.css`. Para trocar a paleta, edite as primeiras variáveis do `:root`.
- Requer Node 18 ou mais novo. O site publicado não depende de Node.

## Páginas

| Página | O que faz |
|---|---|
| `index.html` | Home de app: foto em tela cheia, atalhos, carrossel de tratamentos, diferenciais, bloco sobre medo de dentista, equipe, vídeo (espaço reservado), primeira consulta, galeria em tela cheia, dicas, avaliações de exemplo, casos (reservado), FAQ, canais |
| `tratamentos.html` | Índice com filtro (Estética, Reabilitação, Prevenção, Crianças, Urgência) |
| `implantes.html` | Passo a passo animado com a rolagem, comparador antes/depois em ilustração, guia, cuidados, FAQ |
| `ortodontia.html`, `clareamento.html`, `lentes.html`, `prevencao.html` | Modelo de página de tratamento: indicação, passo a passo, opções, FAQ, relacionados |
| `urgencia.html` | O que fazer agora (dor, dente quebrado, dente que saiu, inchaço) e contato a um toque |
| `agendamento.html` | Pré-agendamento: no celular, uma etapa por tela, com faixa de dias; sucesso animado e arquivo de calendário (.ics) |
| `primeira-consulta.html` | Linha do tempo, checklist do que levar, acessibilidade, anamnese digital |
| `sobre.html` | Equipe, vídeo da dentista (espaço reservado), biossegurança em 4 passos |
| `contato.html` | Canais, mapa (reservado), convênios, formulário |
| `cuidados.html` | 6 dicas de saúde bucal |
| `para-dentistas.html` | Página de venda: telas no celular, o que vem no site, contato com a Sitra |
| `login.html`, `paciente.html`, `anamnese.html`, `documento.html` | Área do paciente de demonstração (sessão fictícia) |
| `privacidade.html`, `offline.html` | Política modelo e página sem internet |

## Recursos de demonstração para a venda

- **"Ver com a minha clínica"**: botão flutuante no desktop ou "Saiba mais" na faixa de demonstração. O dentista digita o nome do consultório, a cidade e escolhe uma de 5 cores; o site inteiro muda. Fica salvo só no navegador dele, e há um botão para voltar à Lume.
- **Tour guiado** de 5 passos: aparece como convite na primeira visita à home, e também em "Saiba mais" e na página "Para dentistas".
- **Instalar como app** (PWA): manifest, ícones e service worker. No Android aparece "Instalar"; no iPhone, Compartilhar > Adicionar à Tela de Início.

## Configuração (`assets/js/config.js`)

| Campo | Efeito |
|---|---|
| `whatsapp` | Vazio: botões levam ao pré-agendamento, sem link `wa.me` falso. Preenchido (55 + DDD + número): botões abrem o WhatsApp com mensagem de cada contexto |
| `telefone` + `telefoneLink`, `email` | Vazios: aparece o exemplo, sem link |
| `rotaDestino`, `mapaEmbedUrl` | Ativam "Traçar rota" e o mapa |
| `enderecoReal` | `true` com telefone: gera os dados estruturados `Dentist` |
| `horariosPreferidos`, `diasAbertos`, `antecedenciaMaximaDias` | Regras do calendário |
| `convenios`, `redes` | Listas exibidas no site |
| `mostrarFaixaDemo` | Faixa "Demo" no topo |
| `mostrarCreditoAgencia`, `nomeAgencia`, `sloganAgencia`, `siteAgencia` | Crédito "By Sitra · Digitalização de negócios" no rodapé (com link se `siteAgencia` for preenchido) |
| `whatsappAgencia` | Ativa os botões "Falar com a Sitra" |

## O que é real e o que é simulado

- **Funciona de verdade:** navegação, carrosséis, painéis, galeria, tour, personalizador, calendário, validações, comparador, animação do implante, filtros, .ics, impressão de documentos, sessão demonstrativa com "Sair", instalação como app e modo offline das páginas públicas.
- **Simulado e rotulado:** envio do pré-agendamento e da anamnese, login, dados da paciente, orçamentos, recibos, avaliações, vídeos (espaços com capa).
- **Depende de integração:** agenda real, autenticação, prontuário, arquivos de exames, contatos e mapa reais. Ver `PENDENCIAS-PRODUCAO.md`.

## Documentos

`PLANO-MELHORIAS.md` (plano e o que foi feito), `RELATORIO.md`, `CHECKLIST-TESTES.md`, `PENDENCIAS-PRODUCAO.md`, `design-notes.md`, `assets/img/CREDITOS.txt`, capturas em `capturas/` (20 páginas em 390 e 1280 px).
