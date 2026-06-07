# Arquivo de planos — evolução do LOT (Loterias)

Este arquivo documenta os planos de evolução do projeto, com detalhamento
técnico, decisões de design e acompanhamento da implementação.

**Status:** `[ ]` não iniciado · `[~]` em andamento · `[x]` concluído

> Referência de arquitetura: `C:\Users\daldo\Documents\GitHub\Financeiro-Pessoal`
> (mesmo padrão de Firebase + login Google usado aqui).

---

## Plano 01 — Banco de dados no Firebase + página de gerenciamento

- **Data de criação:** 07/06/2026
- **Última atualização:** 07/06/2026
- **Status geral:** `[~]` em andamento. Código das Etapas 0–6 implementado e
  funcionando em modo fallback (config.js local). Falta a parte que só você faz:
  criar o projeto no Firebase, colar o `firebaseConfig` real, publicar as regras
  e liberar seu e-mail em `autorizados`. Depois, Etapa 7 (deploy/verificação).

### Progresso (07/06/2026)

Arquivos criados/alterados:

- `firebase-config.js` — placeholders + instruções (cole os valores reais).
- `firebase-init.js` — inicializa o SDK; expõe `window.fbAuth`/`fbDb`; degrada
  para `null` enquanto houver placeholders.
- `firestore.rules` — leitura pública de `config`, escrita só e-mail autorizado.
- `config-store.js` — `LotConfig.carregar/salvar/sincronizarBackground`
  (Firestore ↔ cache em `localStorage` ↔ seed).
- `config.js` — virou **seed** (`CONFIG_SEED`); `CONFIG` resolve cache→seed.
- `gerenciar.html` + `gerenciar.js` — login Google, checagem de allowlist,
  toggles de ativar/desativar + editor JSON, salvar/recarregar/seed.
- `index.html` + 4 páginas de modalidade — incluem o Firebase e sincronizam o
  cache em background; rodapé do `index` agora linka para `gerenciar.html`.

**Comportamento das mudanças de config:** as páginas públicas leem do cache; uma
edição salva no Firestore aparece no **próximo carregamento** da página (o
background sync atualiza o cache). No navegador de quem salvou, o cache é
atualizado na hora.

### Visão geral

Hoje toda a configuração dos jogos vive no arquivo estático `config.js` (objeto
global `CONFIG`), editado à mão e versionado no git. As 5 páginas
(`index.html`, `lotofacil.html`, `lotofacil-teimosinha.html`, `mega-sena.html`,
`dupla-pascoa.html`) leem esse objeto direto.

A meta deste plano é:

1. **Mover a configuração para o Firestore** (Firebase), mantendo `config.js`
   como _seed_ inicial e _fallback_ offline.
2. **Criar uma página de gerenciamento** (`gerenciar.html`) acessível ao clicar
   no rodapé **"LOTERIAS · Projeto pessoal de acompanhamento de loterias"**.
3. **Login com conta Google** nessa página — só usuário aprovado edita.
4. Na página dá para **criar, editar, ativar e desativar** os mesmos itens que
   hoje se edita no `config.js` (modalidades, jogadores/cotas, dezenas,
   concurso, próximos jogos, saldos, e o flag `visivel` de cada card).

As páginas públicas (de visualização) **continuam públicas e sem login** — só
leem a configuração. O login protege apenas a escrita (gerenciamento).

### Decisões de arquitetura

**SDK e arquivos base (espelhando o Financeiro-Pessoal):**

- Firebase **compat SDK via CDN** (`firebase-app-compat`, `firebase-auth-compat`,
  `firebase-firestore-compat`) — sem build, mantém o projeto 100% estático.
- `firebase-config.js` → objeto `firebaseConfig` (valores **públicos**, não são
  segredo; a segurança vem das `firestore.rules`).
- `firebase-init.js` → inicializa e expõe `window.fbAuth` / `window.fbDb`,
  **degradando graciosamente** para `null` se o SDK/config faltarem (aí o app
  cai no `config.js` local).

**Modelo de dados no Firestore:**

- Documento único **`config/principal`** espelhando 1:1 o objeto `CONFIG` atual
  (chaves `lotofacilTeimosinha`, `lotofacil`, `megaSena`, `duplaPascoa`,
  `proximosJogos`, `saldos`). Simples, fiel ao formato já conhecido, e o
  "criar/editar/ativar/desativar" vira escrita nesse documento.
  - _Alternativa futura (não agora):_ normalizar em coleções (`jogos`,
    `proximosJogos`, `saldos`) se o volume crescer. Para um projeto pessoal, um
    documento basta e simplifica a leitura.
- Coleção **`autorizados/{email}`** — _allowlist_ de quem pode editar. O ID do
  documento é o e-mail (ex.: `daldocoelho@gmail.com`). Para liberar alguém,
  você cria o documento no console do Firebase; para revogar, apaga. O cliente
  **não** escreve nessa coleção (só o console). É isto que significa
  "e-mails aprovados no Firebase".

**Regras do Firestore (`firestore.rules`):**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autorizado = está logado E existe um doc autorizados/<email-do-usuário>
    function autorizado() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/autorizados/$(request.auth.token.email));
    }
    // O próprio usuário pode checar se está liberado (para a UI da página de
    // gerenciamento). Escrita só pelo console do Firebase.
    match /autorizados/{email} {
      allow read:  if request.auth != null && request.auth.token.email == email;
      allow write: if false;
    }
    match /config/{doc} {
      allow read:  if true;            // páginas públicas leem sem login
      allow write: if autorizado();    // só e-mail aprovado escreve
    }
  }
}
```

**Camada de acesso (`config-store.js`):**

- Função única `carregarConfig()` que: tenta ler `config/principal` do Firestore;
  se indisponível (sem rede / sem Firebase), usa o `CONFIG` do `config.js` local.
- Mantém `window.CONFIG` preenchido **antes** de a página renderizar, para que o
  código de render existente das 5 páginas não precise mudar de lógica — só
  passa a esperar o carregamento assíncrono.

### Etapas

#### Etapa 0 — Projeto Firebase + arquivos base · `[~]`  (código pronto; falta criar o projeto no console)

- [ ] Criar projeto no console do Firebase (ou reaproveitar um existente) e
      ativar **Authentication → Google** e **Firestore**.
- [ ] Adicionar `firebase-config.js` com o `firebaseConfig` do projeto.
- [ ] Adicionar `firebase-init.js` (expõe `window.fbAuth`/`window.fbDb`, com
      fallback para `null`).
- [ ] Incluir os `<script>` do SDK compat + os dois arquivos acima nas páginas
      que precisarem (todas as públicas + a de gerenciamento).
- [ ] Garantir no `.gitignore` que nenhum segredo de _service account_ entre no
      repo (o `firebaseConfig` público pode ser versionado).

#### Etapa 1 — Modelo de dados + seed · `[~]`  (mecanismo de seed pronto no gerenciar; rodar com Firebase real)

- [ ] Definir o documento `config/principal` com o mesmo shape do `CONFIG`.
- [ ] Fazer o **seed inicial** a partir do `config.js` atual (uma vez), seja por
      script ou pela própria página de gerenciamento na primeira execução.
- [ ] Manter `config.js` no repo como _fallback_ e referência de formato.

#### Etapa 2 — Camada de acesso (`config-store.js`) · `[x]`

- [ ] Implementar `carregarConfig()` (Firestore → fallback `config.js`).
- [ ] Implementar `salvarConfig(novoConfig)` (escreve `config/principal`; usado
      só pela página de gerenciamento).
- [ ] Expor `window.CONFIG` já preenchido para o código de render existente.

#### Etapa 3 — Páginas públicas lendo do Firestore · `[x]`  (via cache + background sync)

- [ ] Ajustar `index.html` e as 4 páginas de modalidade para aguardar
      `carregarConfig()` antes de renderizar os cards.
- [ ] **Não alterar** a aparência nem a lógica de cálculo — só a origem do dado.
- [ ] Verificar que, offline ou sem Firebase, o app ainda funciona via fallback.

#### Etapa 4 — Login Google + controle de acesso · `[x]`  (depende do projeto Firebase real)

- [ ] Fluxo de login Google (`signInWithPopup`) na página de gerenciamento.
- [ ] Após o login, checar `autorizados/{email}` para saber se o usuário pode
      editar.
- [ ] Se **não** autorizado: tela "Seu e-mail (X) ainda não tem permissão —
      peça pra liberar no Firebase" + botão de sair (visualização segue livre).
- [ ] Se autorizado: libera a UI de edição.
- [ ] Publicar `firestore.rules` (leitura pública de `config`, escrita só
      e-mail autorizado).

#### Etapa 5 — Página de gerenciamento (`gerenciar.html` + `gerenciar.js`) · `[x]`

- [ ] Interface que espelha o `config.js`, seção por seção:
  - [ ] **Ativar/desativar** cada card (toggle do `visivel`).
  - [ ] **Editar** jogadores/cotas, dezenas, concurso, flags de bolão e frações.
  - [ ] **Criar** novos itens em `proximosJogos` e novos jogos nas modalidades.
  - [ ] **Editar** saldos dos jogadores.
- [ ] Botão **Salvar** → `salvarConfig()` grava em `config/principal`.
- [ ] Validar a entrada (ex.: nº de dezenas por modalidade, "pelo menos um
      jogador com cotas > 0") antes de salvar.

#### Etapa 6 — Link de acesso pelo rodapé · `[x]`

- [ ] Tornar o rodapé "LOTERIAS · Projeto pessoal…" do `index.html` clicável,
      abrindo `gerenciar.html`.
- [ ] (Opcional) Mesmo link discreto nas demais páginas.

#### Etapa 7 — Deploy e verificação · `[ ]`

- [ ] Publicar `firestore.rules`.
- [ ] `/claude:manual-verify`: login, criar/editar/ativar/desativar, e conferir
      que as páginas públicas refletem as mudanças.
- [ ] Registrar aprendizados com `/claude:learning`.

### Decisões tomadas (07/06/2026)

1. **Projeto Firebase:** criar um **novo projeto só pro LOT**.
2. **Leitura pública:** as páginas de visualização ficam **abertas a qualquer
   um** (somente leitura). Login só na página de gerenciamento.
3. **Hospedagem:** **Vercel** (mesmo padrão do `Financeiro-Pessoal`). Como tudo
   é estático, a escolha não afeta as Etapas 0–6; só entra na Etapa 7 (deploy).
4. **Quem edita:** **e-mails aprovados no Firebase** — allowlist em
   `autorizados/{email}`, gerenciada pelo console (cria/apaga o e-mail).
