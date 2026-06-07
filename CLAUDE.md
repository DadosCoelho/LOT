# Project Instructions

A **lightweight** Claude Code kit for quick / small projects — no PRD, no task
graph, no agent fleet. Just solid working conventions plus two self-contained
commands. (For a structured PRD → tasks → branch-per-task flow on a bigger
project, use the **`harness-full`** template instead.)

## Available commands

| Command | What it does |
|---|---|
| `/claude:learning [description]` | Records a lesson in `ai-docs/lessons.md` (date, context, root cause, how to avoid, tags). Use after any avoidable mistake. |
| `/claude:manual-verify [request]` | Runs a free-form verification you describe — browser checks, CLI checks, etc. — and reports anything that needs human action. |

> **Convenção de comandos:** todos os comandos do usuário usam o namespace
> `claude:` — ficam em `.claude/commands/claude/<nome>.md` e são chamados como
> `/claude:<nome>`. Ao criar um comando novo, coloque-o nessa subpasta. Assim,
> digitar `/claude` no chat já lista todos os comandos personalizados.

## How to work on this project

These are the defaults every change should follow:

- **Small, focused changes.** Do the thing asked; don't refactor unrelated code
  along the way unless asked.
- **Read before you write.** Match the surrounding code's style, naming, and
  patterns. Reuse existing helpers/types instead of inventing parallel ones.
- **Use official library types** — look in `node_modules/<lib>/**/*.d.ts` or the
  library's exports before declaring your own `interface`/`type`.
- **Validate external input** at the boundary (request bodies, query params,
  form data, webhook payloads). Never trust client data.
- **Handle errors on async/IO sites** — don't leave promises unhandled or
  swallow exceptions silently.
- **Never commit secrets.** Keys, tokens, service-account JSON → environment
  variables; keep `.env*` gitignored.
- **Confirm before destructive or outward-facing actions** (deleting data,
  pushing, opening PRs, sending email) unless told to proceed.
- **Record lessons.** After any avoidable mistake, run `/claude:learning` so
  `ai-docs/lessons.md` grows into a living guide for this project.

## Project-specific notes

> Fill this in once — it's the first context Claude reads each session.

- **Stack:** HTML/CSS/JS puro (vanilla), sem framework e sem build step. Páginas
  estáticas abertas direto no navegador. Usa Lottie Player via CDN para
  animações.
- **Backend / database:** nenhum backend próprio. Os dados de sorteios vêm da
  **API pública das Loterias da Caixa**
  (`https://servicebus2.caixa.gov.br/portaldeloterias/api/`), consumida no
  cliente por `api.js`. Configuração local em `config.js` (jogos, jogadores,
  cotas) e dados auxiliares em `luck.json`.
- **Package manager:** nenhum — não há `node_modules` nem `package.json`. Tudo é
  servido como arquivos estáticos.
- **Run / build / test:** não há build nem testes automatizados. Para rodar,
  abra os `.html` no navegador (ou sirva a pasta, ex.: `python -m http.server`).
  Verifique mudanças manualmente com `/claude:manual-verify` (Playwright MCP, se
  disponível).
- **Conventions:**
  - Páginas principais: `index.html` (hub), `lotofacil.html`,
    `lotofacil-teimosinha.html`, `mega-sena.html`, `dupla-pascoa.html`.
  - `config.js` expõe um objeto global `CONFIG` — é o **ponto central** para
    editar jogos, jogadores, cotas e visibilidade de cards (`visivel: true/false`).
  - `api.js` expõe utilitários no escopo global (IIFE) com retry/backoff para a
    API da Caixa (trata 429/500/404). Reuse `buscarComRetry` em vez de criar
    novos fetches.
  - Idioma do projeto e dos comentários: **português (pt-BR)**.
  - Documentação de referência: `LOT_documentacao.txt`.
