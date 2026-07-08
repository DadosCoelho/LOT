// gerenciar.js — página de gerenciamento da configuração dos jogos.
// Login Google → checa allowlist autorizados/{email} → editor VISUAL
// (formulários: cartela de dezenas, jogadores/cotas, concursos, bolão…)
// que salva no Firestore (config/principal) via LotConfig.
// O JSON completo continua disponível como "editor avançado" (escape hatch).
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const telaLogin = $("tela-login");
  const telaSemPermissao = $("tela-sem-permissao");
  const telaEditor = $("tela-editor");
  const txt = $("json");

  // Estado em edição: o objeto config completo. Os inputs escrevem direto
  // nele; "Salvar" envia ao Firestore. Nunca é null depois do login.
  let estado = null;

  // Guarda quais seções estão abertas para sobreviver aos re-renders.
  const aberturas = {};

  // Regras por modalidade: intervalo do volante e tamanho da aposta.
  const MODALIDADES = {
    lotofacil: { rotulo: "Lotofácil",  maxNumero: 25, minDezenas: 15, maxDezenas: 20 },
    megasena:  { rotulo: "Mega Sena",  maxNumero: 60, minDezenas: 6,  maxDezenas: 20 },
    duplasena: { rotulo: "Dupla Sena", maxNumero: 50, minDezenas: 6,  maxDezenas: 15 }
  };

  // ── Toast ──────────────────────────────────────────────────────────────
  let toastTimer = null;
  function toast(msg, erro) {
    const t = $("toast");
    t.textContent = msg;
    t.className = "toast show" + (erro ? " err" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = "toast"; }, 3200);
  }

  function mostrar(tela) {
    [telaLogin, telaSemPermissao, telaEditor].forEach((el) => el.classList.add("hidden"));
    tela.classList.remove("hidden");
  }

  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const pad2 = (n) => String(n).padStart(2, "0");

  // ── Fábrica de elementos ────────────────────────────────────────────────
  function el(tag, cls, texto) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function botao(rotulo, cls, onclick) {
    const b = el("button", cls, rotulo);
    b.type = "button";
    b.addEventListener("click", onclick);
    return b;
  }

  function campo(rotulo, controle) {
    const c = el("div", "campo");
    const lb = el("label", null, rotulo);
    c.appendChild(lb);
    c.appendChild(controle);
    return c;
  }

  function inputTexto(valor, aoMudar, placeholder) {
    const i = document.createElement("input");
    i.type = "text";
    i.value = valor == null ? "" : valor;
    if (placeholder) i.placeholder = placeholder;
    i.addEventListener("input", () => aoMudar(i.value));
    return i;
  }

  // aoMudar recebe Number ou null (campo vazio).
  function inputNumero(valor, aoMudar, opts) {
    opts = opts || {};
    const i = document.createElement("input");
    i.type = "number";
    if (opts.passo) i.step = String(opts.passo);
    if (opts.min != null) i.min = String(opts.min);
    if (opts.placeholder) i.placeholder = opts.placeholder;
    i.value = valor == null ? "" : String(valor);
    i.addEventListener("input", () => {
      const v = i.value.trim();
      aoMudar(v === "" ? null : Number(v));
    });
    return i;
  }

  // Datas ficam no config como "DD/MM/AAAA"; o input date usa "AAAA-MM-DD".
  function inputData(valorBR, aoMudar) {
    const i = document.createElement("input");
    i.type = "date";
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valorBR || "");
    if (m) i.value = m[3] + "-" + m[2] + "-" + m[1];
    i.addEventListener("change", () => {
      const p = i.value.split("-");
      aoMudar(p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : "");
    });
    return i;
  }

  function selectOpcoes(valor, opcoes, aoMudar) {
    const s = document.createElement("select");
    opcoes.forEach((op) => {
      const o = document.createElement("option");
      o.value = op.v;
      o.textContent = op.r;
      s.appendChild(o);
    });
    s.value = valor;
    s.addEventListener("change", () => aoMudar(s.value));
    return s;
  }

  function checkboxRotulado(marcado, rotulo, aoMudar) {
    const wrap = el("label", "toggle");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!marcado;
    cb.addEventListener("change", () => aoMudar(cb.checked));
    wrap.appendChild(cb);
    wrap.appendChild(el("span", null, rotulo));
    return wrap;
  }

  // ── Componentes ────────────────────────────────────────────────────────

  // Cartela de dezenas clicável. `dono` é o objeto que tem o array `dezenas`.
  function gridDezenas(dono, spec) {
    if (!Array.isArray(dono.dezenas)) dono.dezenas = [];
    const box = el("div");
    const cont = el("div", "contador");
    const grade = el("div", "dezenas");

    function atualiza() {
      const n = dono.dezenas.length;
      const ok = n >= spec.minDezenas && n <= spec.maxDezenas;
      cont.textContent = n + " de " + spec.minDezenas + " dezenas" +
        (n > spec.minDezenas ? " (aposta com " + n + ")" : "");
      cont.className = "contador " + (ok ? "ok" : "err");
    }

    for (let num = 1; num <= spec.maxNumero; num++) {
      const d = pad2(num);
      const b = el("button", "dez" + (dono.dezenas.indexOf(d) >= 0 ? " sel" : ""), d);
      b.type = "button";
      b.addEventListener("click", () => {
        const ix = dono.dezenas.indexOf(d);
        if (ix >= 0) {
          dono.dezenas.splice(ix, 1);
          b.classList.remove("sel");
        } else {
          if (dono.dezenas.length >= spec.maxDezenas) {
            toast("Máximo de " + spec.maxDezenas + " dezenas — desmarque uma antes.", true);
            return;
          }
          dono.dezenas.push(d);
          dono.dezenas.sort();
          b.classList.add("sel");
        }
        atualiza();
      });
      grade.appendChild(b);
    }
    atualiza();
    box.appendChild(cont);
    box.appendChild(grade);
    return box;
  }

  // Tabela nome + valor numérico (cotas ou saldo), com adicionar/remover.
  function tabelaPessoas(lista, campoNum, rotuloNum, opts) {
    opts = opts || {};
    const box = el("div");
    const grade = el("div", "pessoas");

    function refazer() {
      grade.innerHTML = "";
      const cab = el("div", "pessoa-cab");
      cab.appendChild(el("span", null, "Nome"));
      cab.appendChild(el("span", null, rotuloNum));
      cab.appendChild(el("span", null, ""));
      grade.appendChild(cab);
      lista.forEach((p, ix) => {
        const r = el("div", "pessoa");
        r.appendChild(inputTexto(p.nome, (v) => { p.nome = v; }, "Nome"));
        r.appendChild(inputNumero(p[campoNum], (v) => { p[campoNum] = v == null ? 0 : v; },
          { passo: opts.passo || 1, min: 0 }));
        r.appendChild(botao("×", "btn-mini", () => { lista.splice(ix, 1); refazer(); }));
        grade.appendChild(r);
      });
    }
    refazer();
    box.appendChild(grade);
    box.appendChild(botao("+ Adicionar jogador", "btn-ghost btn-add", () => {
      const novo = { nome: "" };
      novo[campoNum] = 0;
      lista.push(novo);
      refazer();
    }));
    return box;
  }

  // Casca da seção: <details> com summary (título + badge visível + resumo).
  function cascaSecao(chave, titulo, visivel, resumo) {
    const card = el("details", "card secao");
    card.dataset.chave = chave;
    if (aberturas[chave]) card.open = true;
    card.addEventListener("toggle", () => { aberturas[chave] = card.open; });

    const sum = el("summary");
    sum.appendChild(el("span", null, titulo));
    sum.appendChild(el("span", "badge " + (visivel ? "on" : "off"), visivel ? "Visível" : "Oculto"));
    if (resumo) sum.appendChild(el("span", "sec-resumo", resumo));
    card.appendChild(sum);

    const corpo = el("div", "secao-corpo");
    card.appendChild(corpo);
    return { card, corpo };
  }

  function proximoId(jogos) {
    let max = 0;
    jogos.forEach((j) => { if (typeof j.id === "number" && j.id > max) max = j.id; });
    return max + 1;
  }

  // ── Seções ─────────────────────────────────────────────────────────────

  // Lotofácil / Mega Sena / Dupla de Páscoa: mesmo formato de seção.
  function secaoJogoSimples(chave, titulo, modKey, temBolao) {
    const sec = estado[chave];
    const spec = MODALIDADES[modKey];
    const casca = cascaSecao(chave, titulo, sec.visivel,
      sec.JOGOS.length + (sec.JOGOS.length === 1 ? " jogo" : " jogos"));
    const corpo = casca.corpo;

    corpo.appendChild(checkboxRotulado(sec.visivel, "Mostrar card na página inicial",
      (v) => { sec.visivel = v; renderSecao(chave); }));

    const grid = el("div", "campos-grid");
    grid.appendChild(campo("Concurso (vazio = último automaticamente)",
      inputNumero(sec.CONCURSO, (v) => { sec.CONCURSO = v; }, { placeholder: "automático" })));
    if (temBolao) {
      const boloes = el("div", "campo");
      boloes.appendChild(el("label", null, "Bolão"));
      boloes.appendChild(checkboxRotulado(sec.bolao, "As apostas são cotas de bolão",
        (v) => { sec.bolao = v; renderSecao(chave); }));
      grid.appendChild(boloes);
      if (sec.bolao) {
        grid.appendChild(campo("Cota do bolão — numerador",
          inputNumero(sec.cotaBolaoNumerador, (v) => { sec.cotaBolaoNumerador = v == null ? 1 : v; }, { min: 1 })));
        grid.appendChild(campo("Cota do bolão — denominador",
          inputNumero(sec.cotaBalaoDenominador, (v) => { sec.cotaBalaoDenominador = v == null ? 1 : v; }, { min: 1 })));
      }
    }
    corpo.appendChild(grid);

    corpo.appendChild(el("div", "subtitulo", "Jogadores e cotas"));
    corpo.appendChild(tabelaPessoas(sec.JOGADORES, "cotas", "Cotas"));

    corpo.appendChild(el("div", "subtitulo", "Jogos apostados"));
    sec.JOGOS.forEach((jogo, ix) => {
      const jc = el("div", "jogo-card");
      const cab = el("div", "jogo-cab");
      cab.appendChild(inputTexto(jogo.nome, (v) => { jogo.nome = v; }, "Nome do jogo"));
      cab.appendChild(botao("×", "btn-mini", () => {
        if (!confirm('Remover o jogo "' + (jogo.nome || "sem nome") + '"?')) return;
        sec.JOGOS.splice(ix, 1);
        renderSecao(chave);
      }));
      jc.appendChild(cab);
      jc.appendChild(gridDezenas(jogo, spec));
      corpo.appendChild(jc);
    });
    corpo.appendChild(botao("+ Adicionar jogo", "btn-ghost btn-add", () => {
      const id = proximoId(sec.JOGOS);
      sec.JOGOS.push({ id: id, nome: titulo + " " + id, dezenas: [] });
      renderSecao(chave);
    }));

    return casca.card;
  }

  // Teimosinha: lista de grupos, cada um com concurso inicial, quantidade,
  // dezenas e jogadores próprios.
  function secaoTeimosinha() {
    const chave = "lotofacilTeimosinha";
    const sec = estado[chave];
    const spec = MODALIDADES.lotofacil;
    const casca = cascaSecao(chave, "Lotofácil — Teimosinha", sec.visivel,
      sec.JOGOS.length + (sec.JOGOS.length === 1 ? " grupo" : " grupos"));
    const corpo = casca.corpo;

    corpo.appendChild(checkboxRotulado(sec.visivel, "Mostrar card na página inicial",
      (v) => { sec.visivel = v; renderSecao(chave); }));

    sec.JOGOS.forEach((grupo, ix) => {
      const jc = el("div", "jogo-card");
      const cab = el("div", "jogo-cab");
      cab.appendChild(inputTexto(grupo.nomeGrupo, (v) => { grupo.nomeGrupo = v; }, "Nome do grupo"));
      cab.appendChild(botao("×", "btn-mini", () => {
        if (!confirm('Remover a teimosinha "' + (grupo.nomeGrupo || "sem nome") + '"?')) return;
        sec.JOGOS.splice(ix, 1);
        renderSecao(chave);
      }));
      jc.appendChild(cab);

      const grid = el("div", "campos-grid");
      grid.appendChild(campo("Concurso inicial",
        inputNumero(grupo.concursoInicial, (v) => { grupo.concursoInicial = v; })));
      grid.appendChild(campo("Quantidade de concursos",
        inputNumero(grupo.quantidadeTeimosinha, (v) => { grupo.quantidadeTeimosinha = v == null ? 1 : v; }, { min: 1 })));
      jc.appendChild(grid);

      jc.appendChild(el("div", "subtitulo", "Dezenas"));
      jc.appendChild(gridDezenas(grupo, spec));

      jc.appendChild(el("div", "subtitulo", "Jogadores e cotas"));
      jc.appendChild(tabelaPessoas(grupo.jogadores, "cotas", "Cotas"));

      corpo.appendChild(jc);
    });

    corpo.appendChild(botao("+ Adicionar teimosinha", "btn-ghost btn-add", () => {
      const anterior = sec.JOGOS[sec.JOGOS.length - 1];
      sec.JOGOS.push({
        id: proximoId(sec.JOGOS),
        nomeGrupo: "Lotofácil",
        modalidade: "lotofacil",
        concursoInicial: null,
        quantidadeTeimosinha: 12,
        dezenas: [],
        // Reaproveita a lista de jogadores do grupo anterior, se houver.
        jogadores: anterior ? clone(anterior.jogadores) : []
      });
      renderSecao(chave);
    }));

    return casca.card;
  }

  // Próximos jogos: cards informativos do index.
  function secaoProximos() {
    const chave = "proximosJogos";
    const lista = estado[chave];
    const nVisiveis = lista.filter((pj) => pj.visivel).length;
    const casca = cascaSecao(chave, "Próximos jogos", nVisiveis > 0,
      lista.length + (lista.length === 1 ? " cadastrado" : " cadastrados"));
    const corpo = casca.corpo;

    lista.forEach((pj, ix) => {
      const jc = el("div", "jogo-card");
      const cab = el("div", "jogo-cab");
      cab.appendChild(inputTexto(pj.nomeJogo, (v) => { pj.nomeJogo = v; }, "Nome do jogo"));
      cab.appendChild(botao("×", "btn-mini", () => {
        if (!confirm('Remover o próximo jogo "' + (pj.nomeJogo || "sem nome") + '"?')) return;
        lista.splice(ix, 1);
        renderSecao(chave);
      }));
      jc.appendChild(cab);

      jc.appendChild(checkboxRotulado(pj.visivel, "Mostrar card na página inicial",
        (v) => { pj.visivel = v; renderSecao(chave); }));

      const grid = el("div", "campos-grid");
      grid.appendChild(campo("Modalidade", selectOpcoes(pj.modalidade, [
        { v: "lotofacil", r: "Lotofácil" },
        { v: "megasena", r: "Mega Sena" },
        { v: "duplasena", r: "Dupla Sena" }
      ], (v) => { pj.modalidade = v; })));
      grid.appendChild(campo("Data do sorteio", inputData(pj.dataRealizacao,
        (v) => { pj.dataRealizacao = v; })));
      grid.appendChild(campo("Valor total pago (R$)",
        inputNumero(pj.valorTotal, (v) => { pj.valorTotal = v == null ? 0 : v; }, { passo: 0.01, min: 0 })));
      grid.appendChild(campo("Quantidade de cotas",
        inputNumero(pj.quantidadeCotas, (v) => { pj.quantidadeCotas = v == null ? 1 : v; }, { min: 1 })));
      grid.appendChild(campo("Tipo", selectOpcoes(pj.tipo, [
        { v: "simples", r: "Simples (um concurso)" },
        { v: "teimosinha", r: "Teimosinha (vários concursos)" }
      ], (v) => { pj.tipo = v; renderSecao(chave); })));
      if (pj.tipo === "teimosinha") {
        grid.appendChild(campo("Número de concursos",
          inputNumero(pj.quantidadeConcursos, (v) => { pj.quantidadeConcursos = v == null ? 0 : v; }, { min: 0 })));
      }
      grid.appendChild(campo("Prêmio estimado (R$, vazio = não exibir)",
        inputNumero(pj.premioEstimado, (v) => { pj.premioEstimado = v; }, { passo: 0.01, min: 0, placeholder: "não exibir" })));

      const boloes = el("div", "campo");
      boloes.appendChild(el("label", null, "Bolão"));
      boloes.appendChild(checkboxRotulado(pj.bolao, "É cota de bolão",
        (v) => { pj.bolao = v; renderSecao(chave); }));
      grid.appendChild(boloes);
      if (pj.bolao) {
        grid.appendChild(campo("Cota do bolão — numerador",
          inputNumero(pj.cotaBolaoNumerador, (v) => { pj.cotaBolaoNumerador = v == null ? 1 : v; }, { min: 1 })));
        grid.appendChild(campo("Cota do bolão — denominador",
          inputNumero(pj.cotaBalaoDenominador, (v) => { pj.cotaBalaoDenominador = v == null ? 1 : v; }, { min: 1 })));
      }
      jc.appendChild(grid);
      corpo.appendChild(jc);
    });

    corpo.appendChild(botao("+ Adicionar próximo jogo", "btn-ghost btn-add", () => {
      lista.push({
        visivel: true,
        nomeJogo: "Lotofácil",
        modalidade: "lotofacil",
        dataRealizacao: "",
        valorTotal: 0,
        quantidadeCotas: 10,
        tipo: "simples",
        quantidadeConcursos: 0,
        bolao: false,
        cotaBolaoNumerador: 1,
        cotaBalaoDenominador: 1,
        premioEstimado: null
      });
      renderSecao(chave);
    }));

    return casca.card;
  }

  function secaoSaldos() {
    const chave = "saldos";
    const sec = estado[chave];
    const casca = cascaSecao(chave, "Saldos dos jogadores", sec.visivel,
      sec.jogadores.length + (sec.jogadores.length === 1 ? " jogador" : " jogadores"));
    const corpo = casca.corpo;

    corpo.appendChild(checkboxRotulado(sec.visivel, "Mostrar card na página inicial",
      (v) => { sec.visivel = v; renderSecao(chave); }));
    corpo.appendChild(el("div", "subtitulo", "Saldos (R$)"));
    corpo.appendChild(tabelaPessoas(sec.jogadores, "saldo", "Saldo (R$)", { passo: 0.01 }));

    return casca.card;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  const SECOES = [
    { chave: "lotofacilTeimosinha", build: secaoTeimosinha },
    { chave: "lotofacil", build: () => secaoJogoSimples("lotofacil", "Lotofácil", "lotofacil", true) },
    { chave: "megaSena", build: () => secaoJogoSimples("megaSena", "Mega Sena", "megasena", true) },
    { chave: "duplaPascoa", build: () => secaoJogoSimples("duplaPascoa", "Dupla de Páscoa", "duplasena", false) },
    { chave: "proximosJogos", build: secaoProximos },
    { chave: "saldos", build: secaoSaldos }
  ];

  function renderSecoes() {
    const c = $("secoes");
    c.innerHTML = "";
    SECOES.forEach((s) => c.appendChild(s.build()));
  }

  // Re-renderiza só uma seção (após mudança estrutural: add/remove/toggle).
  function renderSecao(chave) {
    const atual = document.querySelector('.secao[data-chave="' + chave + '"]');
    const s = SECOES.filter((x) => x.chave === chave)[0];
    if (atual && s) atual.parentNode.replaceChild(s.build(), atual);
  }

  // Garante que todas as seções existem no estado (config vinda do Firestore
  // pode estar incompleta). Preenche com estruturas vazias, não com o seed,
  // para não ressuscitar jogos antigos.
  function garantirEstrutura(cfg) {
    cfg.lotofacilTeimosinha = cfg.lotofacilTeimosinha || { visivel: false, JOGOS: [] };
    cfg.lotofacilTeimosinha.JOGOS = cfg.lotofacilTeimosinha.JOGOS || [];
    cfg.lotofacilTeimosinha.JOGOS.forEach((g) => { g.jogadores = g.jogadores || []; });

    ["lotofacil", "megaSena", "duplaPascoa"].forEach((k) => {
      cfg[k] = cfg[k] || {};
      const s = cfg[k];
      if (s.visivel == null) s.visivel = false;
      if (s.CONCURSO === undefined) s.CONCURSO = null;
      s.JOGADORES = s.JOGADORES || [];
      s.JOGOS = s.JOGOS || [];
      if (k !== "duplaPascoa") {
        if (s.bolao == null) s.bolao = false;
        if (s.cotaBolaoNumerador == null) s.cotaBolaoNumerador = 1;
        if (s.cotaBalaoDenominador == null) s.cotaBalaoDenominador = 1;
      }
    });

    cfg.proximosJogos = cfg.proximosJogos || [];
    cfg.saldos = cfg.saldos || { visivel: false, jogadores: [] };
    cfg.saldos.jogadores = cfg.saldos.jogadores || [];
    return cfg;
  }

  // ── Validação (avisos não bloqueantes) ─────────────────────────────────
  function validar() {
    const avisos = [];
    const simples = [
      ["lotofacil", "Lotofácil", MODALIDADES.lotofacil],
      ["megaSena", "Mega Sena", MODALIDADES.megasena],
      ["duplaPascoa", "Dupla de Páscoa", MODALIDADES.duplasena]
    ];
    simples.forEach((par) => {
      const sec = estado[par[0]];
      if (!sec.visivel) return;
      sec.JOGOS.forEach((j) => {
        if (j.dezenas.length < par[2].minDezenas) {
          avisos.push(par[1] + ': "' + (j.nome || "sem nome") + '" tem ' + j.dezenas.length +
            " dezenas (mínimo " + par[2].minDezenas + ").");
        }
      });
      if (sec.JOGOS.length && !sec.JOGADORES.some((p) => p.cotas > 0)) {
        avisos.push(par[1] + ": nenhum jogador tem cotas — a tabela de rateio não será exibida.");
      }
    });

    const tei = estado.lotofacilTeimosinha;
    if (tei.visivel) {
      tei.JOGOS.forEach((g) => {
        if (g.dezenas.length < 15) {
          avisos.push('Teimosinha "' + (g.nomeGrupo || "sem nome") + '" tem ' +
            g.dezenas.length + " dezenas (mínimo 15).");
        }
        if (g.concursoInicial == null) {
          avisos.push('Teimosinha "' + (g.nomeGrupo || "sem nome") + '" está sem concurso inicial.');
        }
        if (!g.jogadores.some((p) => p.cotas > 0)) {
          avisos.push('Teimosinha "' + (g.nomeGrupo || "sem nome") + '": nenhum jogador tem cotas.');
        }
      });
    }

    estado.proximosJogos.forEach((pj) => {
      if (pj.visivel && !pj.dataRealizacao) {
        avisos.push('Próximo jogo "' + (pj.nomeJogo || "sem nome") + '" está sem data do sorteio.');
      }
    });
    return avisos;
  }

  function mostrarAvisos(avisos) {
    const box = $("avisos");
    if (!avisos.length) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    box.classList.remove("hidden");
    box.innerHTML = "<strong>⚠️ Atenção:</strong>";
    const ul = document.createElement("ul");
    avisos.forEach((a) => ul.appendChild(el("li", null, a)));
    box.appendChild(ul);
  }

  // ── Editor avançado (JSON) ─────────────────────────────────────────────
  const detJson = $("det-json");
  detJson.addEventListener("toggle", () => {
    if (detJson.open && estado) txt.value = JSON.stringify(estado, null, 2);
  });
  $("btn-aplicar-json").addEventListener("click", () => {
    let obj;
    try {
      obj = JSON.parse(txt.value);
      if (!obj || typeof obj !== "object") throw new Error("precisa ser um objeto.");
    } catch (e) {
      toast("JSON inválido: " + e.message, true);
      return;
    }
    estado = garantirEstrutura(obj);
    renderSecoes();
    toast("JSON aplicado ao formulário — clique em Salvar para publicar.");
  });

  // ── Carga / gravação ──────────────────────────────────────────────────
  function carregarConfigNoEditor() {
    LotConfig.carregar().then((cfg) => {
      estado = garantirEstrutura(clone(cfg));
      renderSecoes();
      mostrarAvisos([]);
    }).catch(() => {
      estado = garantirEstrutura(clone(window.CONFIG_SEED || {}));
      renderSecoes();
    });
  }

  function salvar() {
    if (!estado) return;
    const avisos = validar();
    mostrarAvisos(avisos);
    LotConfig.salvar(estado).then(() => {
      toast(avisos.length ? "Salvo — mas veja os avisos acima." : "Salvo no Firestore ✓", avisos.length > 0);
    }).catch((e) => {
      toast("Erro ao salvar: " + e.message, true);
    });
  }

  // ── Botões ────────────────────────────────────────────────────────────
  $("btn-salvar").addEventListener("click", salvar);
  $("btn-recarregar").addEventListener("click", carregarConfigNoEditor);
  $("btn-seed").addEventListener("click", () => {
    if (!confirm("Substituir tudo pelo conteúdo do config.js (seed)? As edições não salvas serão perdidas.")) return;
    estado = garantirEstrutura(clone(window.CONFIG_SEED || {}));
    renderSecoes();
    toast("Seed carregado — clique em Salvar para publicar.");
  });

  // ── Autenticação ──────────────────────────────────────────────────────
  function sair() {
    if (window.fbAuth) { window.fbAuth.signOut().catch(() => {}); }
  }
  $("btn-sair-1").addEventListener("click", sair);
  $("btn-sair-2").addEventListener("click", sair);

  $("btn-login").addEventListener("click", () => {
    if (!window.fbAuth) {
      toast("Firebase não configurado — preencha firebase-config.js.", true);
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    window.fbAuth.signInWithPopup(provider).catch((e) => {
      toast("Falha no login: " + (e && e.message ? e.message : e), true);
    });
  });

  // Verifica se o e-mail logado está na allowlist autorizados/{email}.
  function checarAutorizacao(user) {
    return window.fbDb.collection("autorizados").doc(user.email).get()
      .then((snap) => snap.exists)
      .catch(() => false);
  }

  function iniciar() {
    // Sem Firebase configurado: mostra login com aviso (não há como autenticar).
    if (!window.fbAuth || !window.fbDb) {
      mostrar(telaLogin);
      $("login-aviso").textContent =
        "Firebase ainda não configurado (firebase-config.js com placeholders). " +
        "O site público funciona normalmente; o gerenciamento exige o Firebase.";
      return;
    }

    window.fbAuth.onAuthStateChanged((user) => {
      if (!user) { mostrar(telaLogin); return; }
      checarAutorizacao(user).then((ok) => {
        if (ok) {
          $("email-editor").textContent = user.email;
          $("status-firebase").textContent = "Conectado ao Firestore.";
          mostrar(telaEditor);
          carregarConfigNoEditor();
        } else {
          $("email-sem-permissao").textContent = user.email;
          mostrar(telaSemPermissao);
        }
      });
    });
  }

  iniciar();
})();
