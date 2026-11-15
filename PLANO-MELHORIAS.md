# Lume Odontologia: plano para uma entrega mais impactante

13/11/2026 · Objetivo: o dentista abrir o link no celular e sentir, em 3 segundos, "isso parece um aplicativo de clínica de verdade, e eu quero um assim".

> **Status: executado nas 3 fases em 13/11/2026.** Decisões tomadas: símbolo "ponto de luz + sorriso"; HTML puro com gerador em `ferramentas/gerar.js` (não Astro); vídeos como espaços com capa. Não atingido: home com até 8 telas no celular (ficou em cerca de 11). Detalhes em `RELATORIO.md`, seção "Versão 3".

---

## 1. Diagnóstico: por que o site parece simples

O site atual cumpre as regras e funciona, mas foi desenhado para **não parecer feito por IA**, e exagerou na contenção. O resultado é sóbrio demais para quem precisa se encantar em poucos segundos.

| Problema | O que acontece hoje | Efeito no dentista |
|---|---|---|
| Primeira tela no celular sem imagem | Faixa demo de 3 linhas, cabeçalho, título em 5 linhas e um parágrafo. A foto só aparece depois de rolar mais de uma tela | Parece documento, não produto |
| Pouca imagem | Home com cerca de 11.700 px no celular (14 telas) e só 7 fotos, uma a cada 2 telas | Cansativo, "texto demais" |
| Marca fraca | Só o nome "Lume" escrito, uma cor, nada que lembre dente, sorriso ou saúde | Não fica na memória, não parece clínica |
| Sem cara de app | Não tem navegação inferior, cartões deslizantes, gestos, transições nem ícones | Parece site antigo no celular |
| Sem movimento | Nenhuma animação, além do acordeão | Frio e parado |
| Os melhores recursos estão escondidos | Agendamento, portal e anamnese (o que mais impressiona) aparecem como links pequenos | O dentista não descobre o que o site faz |
| Fotos genéricas e desencontradas | Recepção azul-turquesa, salas de estilos diferentes, pessoas diferentes em cada seção | Não parece uma clínica só |
| Seções repetitivas | Quase tudo é "título + parágrafo + lista com filetes" | Monótono |

**Conclusão:** a base técnica (dados num arquivo só, agendamento, portal, honestidade da demo, regras do CFO) está boa e fica. O que precisa mudar é a **camada de experiência**: visual, mídia, movimento e o celular.

---

## 2. Nova direção criativa: "clínica-app"

Conceito: **calma, luminosa e viva**. Um app de saúde bem-feito, como os de bancos digitais e de academias premium: muita foto, cartões arredondados, navegação pelo polegar, pequenas animações que respondem ao toque.

| Fica como está | Muda | Continua proibido |
|---|---|---|
| Verde-petróleo como cor principal | Entra um **símbolo de marca** e uma **paleta de apoio** (menta, areia, ponto de luz) | Gradiente roxo ou neon, glassmorphism, blobs |
| Newsreader + Hanken Grotesk | Cartões com cantos de 16 a 20 px no celular, sombras suaves e neutras em elementos flutuantes | Estatística inventada ("+5.000 pacientes", "nota 4,9") |
| Dados centralizados no `config.js` | **Conjunto de ícones** de linha consistente (cerca de 24, mesmo traço) | Preço, promoção, "grátis", parcelamento |
| Regras do CFO e LGPD | **Animações com propósito** nas seções principais e transições entre páginas | Depoimento falso apresentado como real |
| Rótulos de demonstração | **Foto e mídia como protagonistas**: hero em tela cheia, carrosséis, vídeo | Fotos de pessoas geradas por IA |
| Acessibilidade e foco visível | Títulos mais curtos e mais blocos visuais, menos parágrafos | Animação em loop chamativa, autoplay com som |

---

## 3. Celular com cara de aplicativo (prioridade máxima)

### 3.1 Estrutura de app
- **Barra de navegação inferior fixa**, no lugar da barra de 2 botões: Início · Tratamentos · **Agendar** (botão central destacado, maior, em verde) · Paciente · Contato. Ícone com rótulo, 64 px mais a área segura do iPhone, item ativo destacado.
- **Cabeçalho compacto de 56 px**, que se esconde ao rolar para baixo e volta ao rolar para cima.
- **Faixa de demonstração em uma linha**, com botão de fechar (lembra a escolha), ou um chip "Demo" discreto no canto do cabeçalho.
- **Transições entre páginas** (View Transitions API): a foto do tratamento "cresce" e vira o topo da página seguinte, como num app. Sem suporte no navegador, a navegação continua normal.

### 3.2 Primeira tela
- **Foto em tela cheia** (cerca de 70% da altura), com o título curto em até 3 linhas sobre um bloco sólido verde-petróleo, sem gradiente.
- Botão grande "Agendar avaliação" ocupando a largura, e logo abaixo um link "Sou paciente".
- **Ações rápidas** em grade 2×2, logo abaixo do hero: Agendar · Urgência · Primeira consulta · Área do paciente. Cada uma com ícone ilustrado e cor de fundo suave.

### 3.3 Padrões de app
- **Carrosséis horizontais com encaixe (scroll-snap)** para tratamentos (cartão com foto e ícone), equipe, ambientes, avaliações e dicas. Indicador de página e "espiada" do próximo cartão para convidar a deslizar.
- **Painéis que sobem de baixo (bottom sheets)** para conteúdos curtos: horários, convênios, detalhes rápidos de tratamento, "o que fazer na urgência". Fecham arrastando para baixo.
- **Toque com resposta**: o cartão encolhe levemente ao toque (escala 0,98) e há estado de pressionado em todos os botões.
- **Avisos curtos (toasts)** para confirmações, por exemplo "Horário de preferência salvo".
- **Telas de carregamento em esqueleto** no portal, no lugar de tela branca.

### 3.4 Agendamento no celular
- **Uma etapa por tela**, com barra de progresso no topo e botão "Continuar" fixo embaixo.
- Especialidades como **cartões grandes com ícone**, não como chips de texto.
- No celular, **faixa horizontal de 14 dias** (Seg 16, Ter 17...) que desliza, no lugar da grade mensal. O mês completo abre num painel, se a pessoa quiser.
- Horários em grade de botões grandes, separados em Manhã e Tarde.
- **Animação de sucesso** ao final (um "check" sendo desenhado) e botão "Adicionar ao calendário", que gera um arquivo .ics real, marcado como pré-agendamento.

### 3.5 Instalável (PWA)
- `manifest.json`, ícones do app (192 e 512), cor de tema e tela de abertura com o símbolo.
- Service worker com cache das páginas públicas, para abrir mesmo sem internet.
- Convite discreto "Adicione a Lume à tela inicial" na área do paciente. **Isso impressiona muito numa demonstração:** o dentista instala e o site aparece como um app no celular dele.

### 3.6 Área do paciente com cara de app
- Abas inferiores próprias: Início · Consultas · Documentos · Mensagens · Perfil.
- Cartão da próxima consulta com **contagem regressiva**, botão "Adicionar ao calendário" e "Como chegar".
- **Plano de tratamento como linha do tempo com progresso** ("Etapa 3 de 5: moldagem da coroa").
- Mensagens no formato de conversa, simulada e rotulada.
- Avatar, saudação pelo horário ("Bom dia, Maria") e lembrete de revisão.

---

## 4. Marca e presença de saúde bucal

### 4.1 Símbolo
"Lume" significa luz. Três caminhos para desenhar em SVG, e escolher um:
1. **Ponto de luz + sorriso:** uma curva de sorriso com um pequeno círculo de luz acima. É simples e funciona como ícone de app.
2. **Dente com brilho:** um dente estilizado em traço único, com um raio de luz. Leitura imediata de "dentista".
3. **Monograma L:** a letra L se curva e forma a borda de um dente.

Entregáveis: versão horizontal (símbolo + Lume Odontologia), vertical, ícone do app, favicon, versões clara e escura, e imagem de compartilhamento nova.

### 4.2 Paleta ampliada (validar contraste AA)
| Papel | Cor sugerida | Uso |
|---|---|---|
| Âncora | #0F4A4E | Botões, navegação, títulos de destaque |
| Âncora escura | #0A3639 | Rodapé, blocos sobre foto |
| Menta clara | #DDEFEA | Fundos de seções e cartões de ação rápida |
| Areia | #F4EEE6 | Calor nas seções de "sobre" e "primeira consulta" |
| Ponto de luz | #F2C14E | Só detalhes pequenos: símbolo, marcadores, estado ativo. Nunca texto em fundo claro |
| Fundo | #F6F7F6 | Igual ao atual |

### 4.3 Ilustrações próprias de saúde bucal
Uma série de 10 a 12 ícones ilustrados no mesmo traço e na mesma paleta: dente, implante, alinhador, escova, fio dental, clareamento, gengiva, raio-x, criança, urgência, calendário, escudo de biossegurança. Eles aparecem nos cartões de tratamento, nas ações rápidas e na seção educativa. É isso que dá **"presença de saúde do dente"** sem depender de foto.

### 4.4 Elementos gráficos recorrentes
- O **ponto de luz** como marcador de seção, de etapa e de item ativo.
- **Fotos com máscara arredondada assimétrica** (um canto mais curvo), recorrente em todo o site.
- Selo "Atendimento com hora marcada" e selo "Biossegurança": descritivos, sem número inventado.

### 4.5 Tom de voz
Caloroso e direto, em segunda pessoa, com frases curtas. Exemplos: "Seu sorriso, no seu tempo." · "Medo de dentista? A gente vai devagar." · "Pronto. Agora é só esperar a confirmação." Sem superlativos nem promessas.

---

## 5. Fotos, vídeo e mídia

### 5.1 Mais espaço para imagem
Meta: **uma foto ou mídia a cada tela de rolagem no celular**. Hero em tela cheia, cartões de tratamento com foto, carrossel de ambientes, retratos grandes da equipe e blocos de foto inteira entre as seções (respiros visuais).

### 5.2 Curadoria nova para a demonstração (cerca de 20 imagens)
- Procurar **séries do mesmo ensaio** no Unsplash e no Pexels: a mesma dentista em várias situações (atendendo, explicando, sorrindo na recepção). Isso resolve o problema de "cada seção com uma pessoa diferente".
- Mesma estética em todas: madeira clara, branco, verde, luz natural.
- Tipos: hero, 3 retratos da equipe, 4 ambientes, 3 detalhes (mãos, instrumentos, escova), 3 de pacientes de idades diferentes (criança, adulto, idoso), 2 de tecnologia (scanner intraoral, tomografia).
- Descartar a recepção azul-turquesa e qualquer foto com marca visível.

### 5.3 Briefing de ensaio para o cliente real
Um roteiro de fotos para entregar ao dentista quando fechar o contrato: fachada, recepção, cada sala, esterilização, equipe trabalhando, retratos individuais, detalhes, e 3 vídeos curtos. Isso vira um entregável da agência e eleva o valor percebido.

### 5.4 Vídeo
- **Hero com vídeo curto em loop**: 6 a 10 segundos, mudo, 720p, até 1,5 MB, com imagem de capa. Não toca em modo de economia de dados nem com "reduzir movimento"; aí fica a foto.
- **Tour da clínica** em vídeo vertical (estilo Reels) na página "A clínica".
- **Vídeo de apresentação da dentista** (30 a 60 s), com legenda. Na demo, um espaço reservado bonito com a capa.
- Bloco "Siga no Instagram" com grade de 6 posts. Na demo são imagens estáticas rotuladas; em produção, conecta ao perfil.

### 5.5 Mídia educativa
- **Animação do implante passo a passo**, que avança conforme a rolagem: dente ausente, implante, cicatrização, coroa. Feita em SVG animado, leve e sem biblioteca.
- **Comparador antes/depois** com ilustração mais refinada (sombras suaves, gengiva e lábios mais naturais), além dos espaços para casos reais com consentimento.
- Mini-infográficos: "Como escovar em 2 minutos", "Fio dental em 4 passos".

### 5.6 Galeria
Grade de miniaturas que abre em tela cheia com deslizar entre as fotos (lightbox com gesto), legenda e contador ("3 de 12").

---

## 6. Movimento e interação

**Princípio:** animar para guiar e dar resposta, nunca para enfeitar. Duração de 200 a 400 ms, desaceleração suave, e tudo desliga com "reduzir movimento".

| Onde | Animação |
|---|---|
| Hero | Foto entra com leve zoom-out (1,05 → 1) e o título sobe 12 px, uma única vez |
| Seções principais (4 ou 5, não todas) | Aparecem com fade e deslocamento curto ao entrar na tela |
| Cartões e botões | Leve encolhida ao toque e elevação no hover do desktop |
| Navegação inferior | O ícone ativo ganha o ponto de luz com transição |
| Cabeçalho | Encolhe e se esconde ao rolar para baixo |
| Entre páginas | View Transitions: a foto do cartão vira o topo da página seguinte |
| Linha do tempo do implante e do plano | Preenche conforme a rolagem ou o progresso |
| Agendamento | Transição lateral entre etapas e "check" animado no final |
| Portal | Esqueleto de carregamento e contagem regressiva |
| Números do portal | Contagem animada só em dados da paciente fictícia, nunca em estatística da clínica |

---

## 7. Página por página

| Página | O que muda |
|---|---|
| **Home** | Hero em foto cheia + ações rápidas 2×2 + carrossel de tratamentos com foto e ícone + "Por que a Lume" (4 diferenciais concretos com foto) + bloco "Tem medo de dentista?" + equipe em carrossel + tour em vídeo + galeria com lightbox + educação ("Cuide em casa") + avaliações em carrossel (rotuladas) + FAQ + mapa e contato. Texto cortado pela metade |
| **Tratamentos (nova)** | Página-índice com cartões grandes por tratamento e filtro por chips (Estética, Reabilitação, Prevenção, Crianças) |
| **Implantes** | Hero com foto, animação do passo a passo por rolagem, comparador refinado, "É para mim?" com perguntas de sim ou não que **encaminham para avaliação, sem diagnosticar**, guia em cartões com ícone, FAQ, CTA fixo |
| **Ortodontia, Clareamento, Lentes, Prevenção (novas)** | Mesmo modelo de implantes, cada uma com foto e ilustração próprias |
| **Urgência (nova)** | Botão grande de ligação ou WhatsApp, "O que fazer agora" em cartões (dente quebrado, dor forte, inchaço, dente que caiu), horário de atendimento em destaque |
| **Agendamento** | Uma etapa por tela no celular, faixa de dias, cartões de especialidade com ícone, sucesso animado, .ics |
| **Primeira consulta** | Linha do tempo visual (antes, durante, depois) com fotos, checklist interativo "O que levar" (marcar itens), bloco de ansiedade |
| **A clínica** | Retratos grandes da equipe, vídeo da dentista, tour em vídeo, carrossel de ambientes, biossegurança em 4 passos ilustrados |
| **Contato** | Mapa grande em destaque, cartões de canal (ligar, WhatsApp, e-mail, rota), horários em painel, formulário mais curto |
| **Login** | Tela de app: símbolo grande, campos limpos, botão de demonstração em destaque |
| **Portal** | Abas inferiores, cartão de próxima consulta com contagem e .ics, plano com progresso, documentos em lista de app, mensagens em conversa |
| **Anamnese** | Uma pergunta-chave por bloco no celular, botões grandes Sim e Não, progresso no topo, salvamento local só de dados não sensíveis (nada de saúde) |

---

## 8. Recursos novos para criar

1. **Personalizador ao vivo para a venda** (o recurso de maior impacto comercial). Um botão "Ver com a minha clínica" abre um painel: o dentista digita o nome do consultório, a cidade e escolhe uma das 5 paletas. O site inteiro se atualiza na hora, e a escolha fica salva só no navegador dele. Ele vê "o site dele" na reunião.
2. **Tour guiado da demonstração**: dicas em balões ("Toque aqui para ver o agendamento", "Esta é a área do paciente") para o dentista explorar sozinho pelo link do WhatsApp.
3. **Página "O que você recebe"**, voltada ao dentista: lista do que vem no site, prints do celular e botão para falar com a agência.
4. **5 páginas de tratamento** e uma **página de urgência**.
5. **Seção educativa "Cuide do seu sorriso"** com 6 artigos curtos e ilustrados. Ajuda no SEO e mostra autoridade.
6. **Adicionar ao calendário (.ics)** no agendamento e no portal.
7. **PWA instalável**.
8. **Checklist interativo** da primeira consulta.
9. **Galeria com lightbox** e gestos.
10. **Espaço para o widget de avaliações do Google** e para o **feed do Instagram**, rotulados na demo.
11. **Acessibilidade em Libras** (VLibras, do governo), como opção para ativar em produção.

---

## 9. Conteúdo e conversão

- **Corte de texto:** cada seção com um título de até 6 palavras e no máximo 2 frases. O resto vai para painéis ("Saiba mais").
- **CTA principal único e repetido:** "Agendar avaliação". WhatsApp sempre a um toque quando estiver configurado.
- **"Por que a Lume"** com diferenciais verificáveis e sem números: hora marcada, plano por escrito, mesma equipe em todas as consultas, acesso sem degraus.
- **Bloco de ansiedade** ("Tem medo de dentista?"): é o maior motivo para adiar a consulta e conecta com o paciente.
- **Prova social honesta:** na demo, avaliações rotuladas; em produção, Google. Na demo também podem entrar selos descritivos (CRO, biossegurança), sem números.
- **Microcopy de app:** "Continuar", "Pronto!", "Você está quase lá".

---

## 10. Técnico

- **Recomendação: migrar para Astro**, que continua gerando HTML estático. Com 17 páginas ou mais, componentes (cartão, carrossel, painel, barra inferior) e otimização automática de imagens, o gerador manual atual não escala. O `config.js` vira `src/config.ts`, e a hospedagem continua estática. Se preferir manter HTML puro, dá, mas com mais retrabalho a cada página nova.
- **Componentes novos:** barra inferior, cabeçalho que se esconde, painel de baixo, carrossel com encaixe, lightbox, toast, esqueleto, faixa de dias, cartão de ação rápida, linha do tempo com progresso.
- **Imagens:** AVIF e WebP, `srcset`, lazy, máscara por CSS. **Vídeo** com `preload="none"`, capa e fallback para foto.
- **Desempenho:** meta Lighthouse mobile ≥ 90 (com vídeo e mais fotos, 95 fica irreal), LCP < 2,5 s em 4G.
- **PWA:** manifest e service worker.
- **Acessibilidade:** mantém o nível atual; carrosséis com botões e rótulos, painéis com foco preso, animações desligáveis.
- **Testes:** fluxos automatizados com Playwright e capturas automáticas em 360, 390, 768, 1280 e 1440 px a cada mudança.

---

## 11. Limites que continuam valendo

- **CFO:** sem preço, promoção, "grátis", garantia de resultado, "sem dor" ou superlativos. Antes e depois só com consentimento. O quiz "É para mim?" orienta a procurar avaliação e nunca diagnostica.
- **LGPD:** nada de dado de saúde guardado no navegador. Consentimento explícito. O personalizador salva só nome e cor da clínica.
- **Honestidade da demonstração:** tudo que é fictício continua rotulado, de forma mais elegante (chip "Demo" em vez de textos longos).
- **Imagens de IA:** não usar fotos de pessoas geradas por IA. Ilustrações vetoriais próprias podem.

---

## 12. Plano em fases

| Fase | Entregas | Esforço estimado |
|---|---|---|
| **1. Impacto imediato** | Casca de app no celular (barra inferior, cabeçalho compacto, hero em foto cheia, ações rápidas), símbolo e paleta nova, ícones ilustrados, nova curadoria de fotos, carrosséis de tratamentos e equipe, animações principais, faixa demo compacta | 2 a 3 dias |
| **2. Profundidade** | Página de tratamentos e 4 páginas novas, urgência, vídeo no hero e tour, galeria com lightbox, agendamento por etapas no celular com .ics, portal com abas e plano com progresso, PWA | 3 a 4 dias |
| **3. Arma de venda** | Personalizador ao vivo, tour guiado, página "O que você recebe", seção educativa, animação do implante, testes automatizados, capturas e revisão final | 2 a 3 dias |

### Critérios de aceite
1. A primeira tela no celular mostra foto, título curto e botão de agendar, sem precisar rolar.
2. Há uma foto ou mídia a cada tela de rolagem na home.
3. A home no celular tem no máximo 8 telas de altura (hoje são cerca de 14).
4. Navegação inferior em todas as páginas no celular; o site instala como app.
5. Lighthouse mobile ≥ 90; nenhuma rolagem horizontal; nenhum erro de console.
6. Teste dos 5 segundos com 3 dentistas: eles conseguem dizer o que a clínica faz e onde agendar.
7. Todas as regras do CFO e da LGPD continuam atendidas.

### Decisões em aberto (preciso da sua escolha)
1. **Símbolo:** ponto de luz + sorriso, dente com brilho ou monograma L?
2. **Tecnologia:** migrar para Astro (recomendado) ou continuar em HTML puro?
3. **Vídeo:** usar vídeos de banco gratuitos (Pexels) na demo ou deixar espaços reservados com capa?
4. **Ordem:** começar pela Fase 1 inteira, ou primeiro só a home no celular para você aprovar a direção?
