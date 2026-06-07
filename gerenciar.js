// gerenciar.js — página de gerenciamento da configuração dos jogos.
// Login Google → checa allowlist autorizados/{email} → editor (toggles + JSON)
// que salva no Firestore (config/principal) via LotConfig.
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  var telaLogin = $("tela-login");
  var telaSemPermissao = $("tela-sem-permissao");
  var telaEditor = $("tela-editor");
  var txt = $("json");

  // ── Toast ──────────────────────────────────────────────────────────────
  var toastTimer = null;
  function toast(msg, erro) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast show" + (erro ? " err" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = "toast"; }, 3200);
  }

  function mostrar(tela) {
    [telaLogin, telaSemPermissao, telaEditor].forEach(function (el) {
      el.classList.add("hidden");
    });
    tela.classList.remove("hidden");
  }

  // ── JSON helpers ─────────────────────────────────────────────────────────
  function setText(obj) { txt.value = JSON.stringify(obj, null, 2); }
  function getConfig() {
    var obj = JSON.parse(txt.value); // pode lançar — tratado por quem chama
    if (!obj || typeof obj !== "object") throw new Error("Config inválida.");
    return obj;
  }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  // ── Toggles de "visivel" ──────────────────────────────────────────────────
  // Descreve onde estão as flags `visivel` dentro do config.
  function descritoresVisivel(cfg) {
    var lista = [];
    var simples = [
      ["lotofacilTeimosinha", "Lotofácil – Teimosinha"],
      ["lotofacil", "Lotofácil"],
      ["megaSena", "Mega Sena"],
      ["duplaPascoa", "Dupla de Páscoa"]
    ];
    simples.forEach(function (par) {
      if (cfg[par[0]]) lista.push({ rotulo: par[1], get: mk(par[0]), set: mkset(par[0]) });
    });
    if (cfg.saldos) {
      lista.push({ rotulo: "Saldos dos jogadores", get: mk("saldos"), set: mkset("saldos") });
    }
    if (Array.isArray(cfg.proximosJogos)) {
      cfg.proximosJogos.forEach(function (pj, i) {
        var nome = (pj && (pj.nomeJogo || pj.modalidade)) || ("Próximo jogo " + (i + 1));
        lista.push({
          rotulo: "Próximo jogo: " + nome,
          get: function (c) { return !!(c.proximosJogos[i] && c.proximosJogos[i].visivel); },
          set: function (c, v) { c.proximosJogos[i].visivel = v; }
        });
      });
    }
    return lista;

    function mk(k) { return function (c) { return !!(c[k] && c[k].visivel); }; }
    function mkset(k) { return function (c, v) { c[k].visivel = v; }; }
  }

  function renderToggles() {
    var cont = $("toggles");
    cont.innerHTML = "";
    var cfg;
    try { cfg = getConfig(); }
    catch (e) {
      cont.innerHTML = '<div class="hint" style="color:#b91c1c">JSON inválido — corrija no editor abaixo para reativar os toggles.</div>';
      return;
    }
    var descs = descritoresVisivel(cfg);
    descs.forEach(function (d, idx) {
      var wrap = document.createElement("div");
      wrap.className = "toggle";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "tg-" + idx;
      cb.checked = d.get(cfg);
      var lb = document.createElement("label");
      lb.htmlFor = cb.id;
      lb.textContent = d.rotulo;
      cb.addEventListener("change", function () {
        var atual;
        try { atual = getConfig(); } catch (e) { toast("Corrija o JSON antes.", true); cb.checked = !cb.checked; return; }
        d.set(atual, cb.checked);
        setText(atual);
      });
      wrap.appendChild(cb);
      wrap.appendChild(lb);
      cont.appendChild(wrap);
    });
  }

  // Reaplica os toggles quando o usuário edita o JSON à mão.
  txt.addEventListener("blur", renderToggles);

  // ── Carga / gravação ──────────────────────────────────────────────────────
  function carregarConfigNoEditor() {
    LotConfig.carregar().then(function (cfg) {
      setText(cfg);
      renderToggles();
    }).catch(function () {
      setText(window.CONFIG_SEED || {});
      renderToggles();
    });
  }

  function salvar() {
    var cfg;
    try { cfg = getConfig(); }
    catch (e) { toast("JSON inválido: " + e.message, true); return; }
    LotConfig.salvar(cfg).then(function () {
      toast("Salvo no Firestore ✓");
    }).catch(function (e) {
      toast("Erro ao salvar: " + e.message, true);
    });
  }

  // ── Botões ────────────────────────────────────────────────────────────────
  $("btn-salvar").addEventListener("click", salvar);
  $("btn-recarregar").addEventListener("click", carregarConfigNoEditor);
  $("btn-seed").addEventListener("click", function () {
    setText(clone(window.CONFIG_SEED || {}));
    renderToggles();
    toast("Seed carregado — clique em Salvar para enviar ao Firestore.");
  });

  // ── Autenticação ──────────────────────────────────────────────────────────
  function sair() {
    if (window.fbAuth) { window.fbAuth.signOut().catch(function () {}); }
  }
  $("btn-sair-1").addEventListener("click", sair);
  $("btn-sair-2").addEventListener("click", sair);

  $("btn-login").addEventListener("click", function () {
    if (!window.fbAuth) {
      toast("Firebase não configurado — preencha firebase-config.js.", true);
      return;
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    window.fbAuth.signInWithPopup(provider).catch(function (e) {
      toast("Falha no login: " + (e && e.message ? e.message : e), true);
    });
  });

  // Verifica se o e-mail logado está na allowlist autorizados/{email}.
  function checarAutorizacao(user) {
    return window.fbDb.collection("autorizados").doc(user.email).get()
      .then(function (snap) { return snap.exists; })
      .catch(function () { return false; });
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

    window.fbAuth.onAuthStateChanged(function (user) {
      if (!user) { mostrar(telaLogin); return; }
      checarAutorizacao(user).then(function (ok) {
        if (ok) {
          $("email-editor").textContent = user.email;
          var st = $("status-firebase");
          st.textContent = window.fbDb ? "Conectado ao Firestore." : "";
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
