# Notas de design (Lume Odontologia, versão 2)

1. Uma cor âncora (#0F4A4E) e neutros frios. Vermelho #A3261B só em erros e na marca d'água dos documentos fictícios. Selos de status do portal em tons neutros.
2. Newsreader nos títulos, Hanken Grotesk no texto e nos formulários. Só a Newsreader é pré-carregada.
3. Site público segue o documento original: grids assimétricos (7/5, 4/8, 5/7), filetes de 1px, sem cartões com ícone, sem círculos numerados, sem sombras.
4. Fluxos com etapas (agendamento, anamnese) usam números em círculo e barra de progresso, porque ali o número mostra estado. Portal usa cartões, porque cada bloco é um objeto (consulta, orçamento, recibo).
5. Rodapé verde-petróleo escuro, como nas 8 referências (o documento original pedia branco).
6. Heros internos com foto sangrando à direita em implantes e contato; páginas de formulário (agendamento, anamnese, login) começam direto no conteúdo.
7. Fotos distribuídas para não repetir a mesma pessoa em funções diferentes. Quem aparece no hero não é apresentada como a Dra. Helena.
8. Comparador e esquema do implante desenhados em SVG: explicam sem usar boca de paciente real e sem prometer resultado.
9. Dados num único arquivo (`config.js`). Contatos vazios desativam links: nenhum `tel:`, `mailto:` ou `wa.me` falso. Os botões de WhatsApp levam ao pré-agendamento até haver número.
10. Datas sempre calculadas a partir de hoje no fuso America/Sao_Paulo, inclusive no portal fictício.
11. Anamnese só em memória. Sessão demonstrativa em `sessionStorage` (uma marca, sem dado pessoal). Nada de saúde em armazenamento do navegador.
12. Cookies: "Aceitar" e "Recusar" com o mesmo peso; "Preferências de cookies" no rodapé reabre a escolha.
13. Dados estruturados `Dentist` só são gerados quando endereço e telefone reais estiverem configurados.
14. Peso: CSS ~40 KB, JS ~52 KB, sem bibliotecas. Imagens WebP com srcset; hero com fetchpriority.

## Versão 3
15. Casca de aplicativo no celular: navegação inferior com Agendar no centro, cabeçalho que se esconde, painéis (dialog nativo) que sobem de baixo.
16. Símbolo: sorriso com um ponto de luz (Lume = luz). Paleta de apoio: menta #DDEFEA, areia #F4EEE6, luz #F2C14E (só detalhes).
17. Cantos de 12 a 20 px e sombras neutras suaves em cartões e elementos flutuantes, para leitura de app. Sem gradiente.
18. Animações só com função: entrada das seções principais, zoom leve no hero, implante por etapas, sucesso do agendamento. Tudo desliga com reduzir movimento.
19. Personalizador e tour existem para a venda: o dentista vê o próprio nome e cor em segundos.
20. Crédito By Sitra no rodapé, configurável em config.js.
