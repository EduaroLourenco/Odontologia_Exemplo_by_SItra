# Checklist de testes funcionais

Testes feitos em 12/11/2026, Chrome (headless e painel do app), servidor local. "OK" = verificado; "Não verificado" = não foi possível testar aqui.

## Responsividade e erros

| Teste | Resultado |
|---|---|
| Todas as 11 páginas em 360, 390, 600, 768, 1024, 1280 e 1440 px sem rolagem horizontal | OK (o agendamento passava 16 px em 390; corrigido) |
| Nenhum erro de JavaScript no console em todas as páginas e larguras | OK |
| Um único h1 por página | OK |
| Cabeçalho com 5 links e botão cabe em 1024 px | OK (36 px de folga) |
| Capturas de todas as páginas em 390 e 1280 px | OK, pasta `capturas/` |
| iPhone e Android reais (área segura, teclado sobre a barra fixa) | Não verificado |

## Navegação e componentes

| Teste | Resultado |
|---|---|
| Todos os links internos apontam para páginas existentes | OK (busca automática, nenhum quebrado) |
| Menu mobile: abre, fecha, Esc, foco preso no painel, foco volta ao botão, rolagem bloqueada | OK |
| FAQ: aria-expanded, aria-controls, abre e fecha | OK |
| Barra fixa do celular aparece depois do topo e some com teclado | OK no código; teclado real não verificado |
| Cookies: só a escolha é salva; "Preferências de cookies" no rodapé reabre o aviso | OK |

## Pré-agendamento

| Teste | Resultado |
|---|---|
| `?esp=implantes` pré-seleciona a especialidade | OK |
| Calendário abre no mês atual (fuso de São Paulo), mês anterior desabilitado | OK |
| Passado e domingos desabilitados, com motivo no rótulo acessível | OK (15 dias desabilitados em novembro; 0 domingos habilitados) |
| Limite de 60 dias: avança até janeiro de 2027 e o botão "próximo" desabilita | OK |
| Hoje sem horários restantes fica desabilitado | OK |
| Setas do teclado entre os dias | OK no código |
| Envio vazio mostra 5 erros e leva o foco ao primeiro campo pendente | OK |
| Máscara aceita colagem "+55 16 91234 5678" e vira "(16) 91234-5678" | OK |
| Progresso chega a "4 de 4 etapas concluídas" | OK |
| Estado "enviando", depois confirmação com protocolo fictício e aviso de simulação | OK |
| Sem WhatsApp configurado: botão de envio pelo WhatsApp oculto | OK |
| Com WhatsApp configurado: botões viram `wa.me` com mensagem contextual; rota e "WhatsApp" na barra aparecem | OK (teste com número temporário, depois revertido) |
| "Fazer outra solicitação" limpa tudo | OK |

## Contato

| Teste | Resultado |
|---|---|
| Envio vazio: "Falta corrigir 4 campos." e foco no nome | OK |
| Contador de caracteres | OK |
| Estado enviando (botão desabilitado) e envio simulado com aviso | OK |
| Telefone sem número real: sem link `tel:` | OK |
| "Traçar rota" oculto sem endereço; aparece com `rotaDestino` | OK |

## Comparador

| Teste | Resultado |
|---|---|
| Mudar o valor do range move a divisória e o recorte (20% → `inset(0 80% 0 0)`) | OK |
| Texto acessível "20% mostrando antes, 80% mostrando depois" | OK |
| Mouse e toque (input range nativo cobrindo a imagem) | Mouse OK no painel; toque real não verificado |

## Área do paciente

| Teste | Resultado |
|---|---|
| Abrir `paciente.html` sem sessão redireciona para `login.html?volta=paciente.html` | OK |
| Login com e-mail e senha: erro explicando que não há servidor, senha apagada | OK |
| Acesso demonstrativo entra e volta para a página pedida | OK |
| Próxima consulta sempre em dia útil, com contagem de dias | OK (corrigido: antes podia cair num sábado às 14h) |
| Histórico: 3 itens, "ver completo" mostra 6, filtro "Exame" mostra 1 | OK |
| Exames de imagem marcados "Exemplo sem documento"; demais abrem documento fictício | OK |
| Documento inexistente mostra "Documento não encontrado" e esconde "Imprimir" | OK |
| "Sair" apaga a sessão e volta ao login com mensagem | OK |
| Meus dados: validação e aviso de que nada é salvo | OK no código |

## Anamnese

| Teste | Resultado |
|---|---|
| Etapa 1 pré-preenchida com Maria Oliveira | OK |
| Avançar com etapa 2 vazia mostra 6 erros | OK |
| "Sim" em alergia mostra o campo de detalhe; "Não" esconde | OK |
| "Preencher com respostas fictícias" | OK |
| Revisão com "Editar" volta à etapa sem perder respostas | OK |
| HTML digitado aparece como texto na revisão (sem injeção) | OK |
| Envio exige consentimento; depois mostra envio simulado e limpa o formulário | OK |
| Nenhum dado de saúde em localStorage ou sessionStorage | OK (só `lume-cookies` e `lume-demo-sessao`) |

## Conteúdo e regras

| Teste | Resultado |
|---|---|
| CSS sem gradiente, backdrop-filter ou blur | OK |
| Sem travessão, setas, lorem ipsum ou "Laica" | OK |
| Sem preço, "grátis", desconto, promoção, garantia ou "sem dor" nas páginas públicas | OK (valores só no portal, marcados como fictícios) |
| CRO marcado "exemplo, não válido" em todas as ocorrências | OK |
| Lighthouse | Não verificado (CSS 40 KB, JS ~52 KB sem bibliotecas, imagens WebP com srcset) |
| Leitor de tela real (NVDA, VoiceOver) | Não verificado |

---

## Versão 3 (13/11/2026)

| Teste | Resultado |
|---|---|
| 20 páginas em 360, 390, 768, 1024, 1280 e 1440 px sem rolagem horizontal | OK (a home passava em 1024; corrigido) |
| Nenhum erro de JavaScript em nenhuma página e largura | OK (havia um erro de seletor do crédito da agência; corrigido) |
| Links internos e imagens referenciadas existem | OK (busca automática) |
| Agendamento no celular: uma etapa por tela, bloqueio sem escolha, faixa de 21 dias, horários por período, envio e .ics | OK |
| Personalizador: nome, cidade e cor trocam em título, marca, textos e variáveis; "Restaurar" volta | OK |
| Tour: 5 passos, Esc e "Pular" encerram, foco volta | OK |
| Galeria em tela cheia: abre na foto certa, contador, setas, Esc | OK |
| Painéis (dialog): abrem, fecham por botão, fundo, Esc e arrastando a alça | OK no código; gesto de arrastar não testado em aparelho real |
| Crédito "By Sitra · Digitalização de negócios" no rodapé | OK |
| Service worker: CSS e JS vindos primeiro da rede (sem ficar preso em versão velha); offline mostra offline.html | OK no código; instalação real no celular não testada |
| CSS sem gradiente nem backdrop-filter; sem travessão, setas ou termos proibidos | OK |
| Lighthouse, leitores de tela e aparelhos reais | Não verificado |
