# Pendências antes de produção

Este site é uma demonstração. Antes de entregar a uma clínica real, faça tudo abaixo.

## 1. Trocar os dados fictícios

1. Em `assets/js/config.js`: nome, responsável técnica, CRO real, CNPJ, endereço (`enderecoReal: true` e `enderecoPartes`), telefone, WhatsApp, e-mail, `rotaDestino`, `mapaEmbedUrl`, convênios confirmados, redes sociais. Desligue `mostrarFaixaDemo`.
2. Nos HTML: biografias e formação dos profissionais ("a preencher com os dados reais"), nomes da equipe (procure "Helena", "Rafael", "Camila"), descrição da estrutura e da acessibilidade (hoje marcadas como exemplo), textos de estacionamento.
3. Fotos: substitua os arquivos de `assets/img/` por fotos da própria clínica e da equipe real, com autorização de uso de imagem. Atualize `alt`, legendas e remova os avisos de "imagem ilustrativa".
4. Avaliações: troque os três exemplos pelas avaliações reais do Google, com link para o perfil oficial, ou remova a seção.
5. Casos clínicos e comparador: só publique antes e depois de pacientes reais com termo de consentimento específico, conforme as normas do CFO vigentes. O comparador atual usa ilustrações.
6. Remova `<meta name="robots" content="noindex, nofollow">` de todas as páginas públicas (mantenha nas privadas). Troque `www.exemplo.com.br` em canonical, og:url, og:image, `sitemap.xml` e `robots.txt`. Gere nova `og-lume.jpg`.
7. Preencha os colchetes de `privacidade.html` e peça revisão jurídica (LGPD e publicidade odontológica).
8. Cole o GTM/GA4 dentro de `medir()` em `assets/js/main.js` (só roda após o aceite de cookies).

## 2. O que NÃO pode ir para produção como está

| Recurso | Situação hoje | O que é preciso |
|---|---|---|
| Login | Formulário sem servidor + acesso demonstrativo por `sessionStorage` | Autenticação no servidor, senha com hash forte (Argon2/bcrypt), sessão em cookie `HttpOnly; Secure; SameSite=Lax`, bloqueio por tentativas, recuperação de senha, opção de segundo fator |
| Área do paciente | Dados fictícios gerados no navegador | API autenticada; autorização **por paciente** em toda leitura; logs de acesso; nunca confiar no navegador |
| Anamnese | Só memória da página | Envio por HTTPS para API autenticada, armazenamento criptografado, acesso restrito à equipe autorizada, consentimento registrado com data e versão do texto, política de retenção |
| Exames e arquivos | Documentos gerados por JS; exames de imagem sem arquivo | Armazenamento privado (fora da pasta pública), links temporários assinados, verificação de autorização a cada download |
| Pré-agendamento | Protocolo fictício, nada enviado | Integração com a agenda da clínica (ver contrato abaixo) ou envio para um canal de atendimento (WhatsApp configurado) |
| Formulário de contato | Envio simulado, ou WhatsApp se configurado | WhatsApp configurado ou API com proteção anti-spam e limite de taxa |

## 3. Segurança mínima do back-end

HTTPS em tudo; CSRF em formulários com cookie de sessão; validação e saneamento no servidor; cabeçalhos CSP, HSTS, X-Content-Type-Options e Referrer-Policy; limite de taxa em login e formulários; trilha de auditoria de acesso a dados de saúde; backups criptografados; acesso mínimo necessário para a equipe; política de retenção e descarte; registro das bases legais (LGPD art. 7º e 11).

## 4. Contrato de API esperado (proposta)

Todas as rotas sob `/api/v1`, JSON, HTTPS. Rotas `/me/*` exigem sessão; o servidor deriva o paciente da sessão (nunca de um id enviado pelo navegador).

### Agenda

```
GET  /api/v1/disponibilidade?especialidade=implantes&de=2026-11-12&ate=2026-12-12
200  { "dias": [ { "data": "2026-11-16", "horarios": ["09:00", "14:30"] } ], "fuso": "America/Sao_Paulo" }

POST /api/v1/pre-agendamentos
Headers: Idempotency-Key: <uuid gerado pelo navegador>
Body { "especialidade": "implantes", "data": "2026-11-16", "horario": "14:30",
       "nome": "...", "whatsapp": "5516...", "convenio": "...", "observacoes": "...",
       "consentimento": { "aceito": true, "versaoTexto": "2026-11" } }
201  { "protocolo": "LUME-20261116-0042", "status": "aguardando_confirmacao" }
409  { "erro": "horario_indisponivel", "alternativas": ["15:30", "16:30"] }
422  { "erro": "validacao", "campos": { "whatsapp": "..." } }
429  { "erro": "muitas_requisicoes" }
```

Regras: o servidor revalida a disponibilidade na hora do POST (bloqueio transacional ou reserva temporária com expiração) para evitar dupla reserva; a mesma `Idempotency-Key` devolve o mesmo resultado; a confirmação ao paciente só é enviada depois de gravar. Se a clínica não quiser reserva automática, mantenha o status `aguardando_confirmacao` e a recepção confirma.

### Sessão

```
POST /api/v1/sessao          { "usuario": "...", "senha": "..." }  -> 204 + Set-Cookie (HttpOnly, Secure, SameSite)
DELETE /api/v1/sessao        -> 204 (invalida no servidor)
```

### Área do paciente

```
GET /api/v1/me                      dados cadastrais
PATCH /api/v1/me                    atualização de cadastro (com auditoria)
GET /api/v1/me/consultas?status=futuras|passadas&tipo=consulta|procedimento|exame
GET /api/v1/me/arquivos             lista (sem URL pública)
GET /api/v1/me/arquivos/{id}/link   -> { "url": "<link assinado, expira em 5 min>" }
GET /api/v1/me/orcamentos
GET /api/v1/me/recibos
GET /api/v1/me/mensagens
POST /api/v1/me/anamneses           respostas + consentimento específico para dados de saúde
```

No front, troque a geração de dados em `assets/js/portal.js` (objeto `D`) por chamadas a essas rotas, e a marca de `sessionStorage` por uma chamada a `GET /api/v1/me` que redireciona para o login em caso de 401.

## 5. Feriados e agenda

O calendário bloqueia passado, domingos, dias além de 60 dias e horários já passados de hoje. Feriados não são bloqueados (dependem da agenda real); o texto avisa que a recepção confirma.
