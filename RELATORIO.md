# Relatório honesto

## Funcional (de verdade, no navegador)

- Navegação completa, menu mobile acessível, FAQ, aviso de cookies com preferência reversível.
- Pré-agendamento: calendário no fuso de São Paulo com regras reais de bloqueio, horários de preferência por dia, validação inline, máscara tolerante, resumo revisável, estados de envio.
- Comparador antes/depois com input range (mouse, toque e teclado).
- Anamnese por etapas: validação, campos condicionais, voltar sem perder dados, revisão editável.
- Portal: filtros e expansão do histórico, documentos fictícios visualizáveis e imprimíveis, "Sair" que encerra a sessão demonstrativa.
- Com `whatsapp` configurado: links `wa.me` com mensagem de contexto e envio do formulário de contato e do pré-agendamento pelo WhatsApp.
- Com `rotaDestino` e `mapaEmbedUrl`: botão de rota e mapa incorporado.

## Simulado (e rotulado na tela)

- Envio do pré-agendamento: protocolo fictício, "solicitação de pré-agendamento simulada", nenhuma consulta marcada.
- Envio do contato sem WhatsApp configurado: "envio simulado".
- Login: não verifica senha; o acesso demonstrativo usa uma marca em `sessionStorage`. **Isso não é autenticação.**
- Dados de Maria Oliveira, histórico, orçamentos, recibos e mensagens: gerados no navegador, com datas relativas a hoje.
- Envio da anamnese: nada é enviado nem guardado.
- Avaliações, equipe, CRO, CNPJ, convênios, endereço, telefone e e-mail: exemplos marcados.

## Depende de integração externa

Agenda real (disponibilidade e reserva sem conflito), autenticação, prontuário e anamnese segura, arquivos de exames, envio de confirmações, mapa e contatos reais. Nenhum back-end foi criado; o contrato proposto está em `PENDENCIAS-PRODUCAO.md`.

## Comparação com as 8 telas de referência

As telas são mockups com dados inconsistentes. Mantive a composição e corrigi as inconsistências a favor do documento original e do prompt mestre.

| Referência | Página | O que segui | O que mudei e por quê |
|---|---|---|---|
| 01 Home | `index.html` | Faixa demo, hero com foto à direita, tratamentos em filetes, atendimento sem pressa, primeira consulta, Dra. Helena, galeria, casos reservados, avaliações, FAQ, como chegar, rodapé escuro | Sem círculos numerados nem cartões com ícones (documento original). Avaliações sem nome de cidade e marcadas como fictícias. Mapa como espaço reservado, sem endereço inventado. CRO de exemplo |
| 02 Agendamento | `agendamento.html` | Quatro etapas na mesma página, chips de especialidade, calendário mensal, horários, dados, convênio, observações, "Como funciona" | Calendário no mês corrente (a tela mostrava setembro de 2025). "Horário de preferência" em vez de "horário disponível". Checkbox LGPD e resumo adicionados. Protocolo simulado |
| 03 Implantes | `implantes.html` | Hero com foto de planejamento, indicação, etapas, comparador com rótulos Antes/Depois, guia, cuidados, FAQ, chamada final | Comparador com ilustrações desenhadas (a tela usava foto de boca real, que exigiria consentimento). Guia sem prazos numéricos. Esquema do implante em vez de foto de modelo |
| 04 Primeira consulta | `primeira-consulta.html` | Seções antes, na consulta, depois, o que levar, acompanhante e acessibilidade, foto alta lateral, bloco de pré-atendimento digital | Sem ícones em cada item. O texto deixa claro que a anamnese não substitui a avaliação |
| 05 Equipe | `sobre.html` | Equipe em layout alternado, protocolos com foto de esterilização, estrutura, chamada final | Sem foto de grupo com logotipo (seria uma clínica de terceiros apresentada como Lume). Nomes conforme o prompt (Rafael Mota, Camila Nogueira). Formação sem universidades inventadas |
| 06 Contato | `contato.html` | Hero, painel "Onde estamos" com endereço, acessibilidade, estacionamento, horário, telefone, convênios, mapa, formulário com período de retorno e aviso sobre dados de saúde | Convênios fictícios (a tela usava marcas reais). Sem avaliação 4,8 no mapa. Telefone e e-mail de exemplo sem link |
| 07 Anamnese | `anamnese.html` | Etapas Dados, Saúde, Hábitos, Revisão com barra de progresso, perguntas condicionais, coluna lateral de ajuda e privacidade | Paciente Maria Oliveira (a tela usava outra). Sem CPF. Uma etapa por vez em vez de tudo aberto. Nada é salvo |
| 08 Portal | `paciente.html` | Saudação, ações rápidas, próxima consulta em destaque, histórico, exames, orçamentos com status, recibos, mensagens | Datas atuais em vez de 2024. Sem "ambiente seguro" (não há segurança real). Exames de imagem sem arquivo marcados como exemplo. Cadastro editável adicionado |

## Divergências registradas

- **Rodapé:** o documento original pedia rodapé branco; as 8 referências usam verde-petróleo escuro. Adotei o escuro (`--cor-ancora-escura`) por ser consistente em todas as telas e não contrariar nenhuma regra.
- **Ícones e círculos numerados:** proibidos no site público pelo documento original. Usei números em círculo só nos fluxos de etapas (agendamento e anamnese), onde mostram estado, como o prompt permite.
- **Endereço, telefone e mapa:** as telas tinham cinco endereços e telefones diferentes. Usei um texto demonstrativo e campos vazios no config, sem links falsos.
- **Fotos:** não há fotos reais de uma equipe fictícia. Usei fotos de banco com legenda "imagem ilustrativa" e textos que não as apresentam como a equipe. A mesma pessoa não é usada como duas personagens diferentes.

## Limites conhecidos

- JS total ~52 KB e CSS ~40 KB, acima da meta da primeira versão (15 KB de JS) por causa do portal, da agenda e da anamnese. Continuam sem bibliotecas.
- Lighthouse, leitores de tela e aparelhos reais não foram testados.
- Feriados não são bloqueados no calendário.

---

## Versão 3 (13/11/2026): cara de aplicativo, marca e mídia

Executado a partir do `PLANO-MELHORIAS.md`, nas três fases.

### Feito
- Navegação inferior de app em todas as páginas no celular, com botão central "Agendar"; cabeçalho fixo que se esconde ao rolar.
- Home com foto em tela cheia e cartão que sobe por cima, atalhos 2×2, carrosséis com encaixe (tratamentos, equipe, dicas, avaliações), diferenciais, faixa "Tem medo de dentista?", galeria em tela cheia com deslizar.
- Símbolo da marca (sorriso com ponto de luz), paleta ampliada (menta, areia, luz), ícones ilustrados no mesmo traço, novos ícones de app e imagem de compartilhamento.
- 8 páginas novas: tratamentos, ortodontia, clareamento, lentes, prevenção, urgência, cuidados, para dentistas (mais offline).
- Implante passo a passo animado pela rolagem; comparador refinado.
- Agendamento no celular com uma etapa por tela, faixa de dias, horários por período, sucesso animado e .ics.
- Portal com saudação pelo horário, contagem regressiva, .ics da consulta, plano de tratamento com progresso, mensagens em conversa, navegação inferior própria e convite para instalar.
- Personalizador "Ver com a minha clínica", tour guiado, app instalável (PWA) com modo offline.
- Crédito "By Sitra · Digitalização de negócios" no rodapé, configurável.
- Gerador de páginas movido para `ferramentas/gerar.js`.

### Não feito ou diferente do plano
- **Astro:** mantive HTML puro, sem dependências. Para 20 páginas, o gerador em Node resolve, e o site continua abrindo direto do arquivo.
- **Vídeos:** espaços com capa e explicação, em vez de vídeos de banco, para não mostrar outra clínica como se fosse a Lume.
- **Altura da home no celular:** caiu de 11.700 px para 9.600 px (cerca de 11 telas). A meta do plano era 8; para chegar lá seria preciso tirar seções que o documento original exige (casos, FAQ, avaliações).
- **Feed do Instagram e widget do Google:** não incluídos; ficam para quando houver perfil real.
- **Animações:** o plano evitava gradiente, e o esqueleto de carregamento usa cor sólida pulsando.

### Divergências da regra original, conscientes
O documento original proibia símbolo de marca, cantos grandes, ícones em círculo colorido e animação de entrada. Essas regras foram flexibilizadas a pedido, para dar cara de aplicativo. Continuam proibidos: gradientes, glassmorphism, estatísticas inventadas, preços, promoções e depoimentos falsos apresentados como reais.
