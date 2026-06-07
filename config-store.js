// config-store.js — camada de acesso à configuração dos jogos.
//
// Fonte de verdade: documento `config/principal` no Firestore (campo `config`).
// Cache local: localStorage['lot_config_cache'] (mantém as páginas públicas
// rápidas e funcionando offline).
// Fallback final: window.CONFIG_SEED (o objeto embutido em config.js).
//
// As páginas públicas leem `CONFIG` de forma síncrona (config.js já resolve
// cache→seed no parse) e chamam sincronizarBackground() para atualizar o cache
// para o próximo carregamento. A página de gerenciamento usa carregar()/salvar().
(function () {
  var CACHE_KEY = "lot_config_cache";
  var COL = "config";
  var DOC = "principal";

  function lerCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function gravarCache(cfg) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cfg));
    } catch (e) {}
  }

  // Busca o config do Firestore; atualiza o cache; resolve com o config ou null.
  function buscarRemoto() {
    if (!window.fbDb) return Promise.resolve(null);
    return window.fbDb.collection(COL).doc(DOC).get()
      .then(function (snap) {
        if (!snap.exists) return null;
        var data = snap.data() || {};
        var cfg = data.config || null;
        if (cfg) gravarCache(cfg);
        return cfg;
      })
      .catch(function () { return null; });
  }

  // Carrega a config (remoto → cache → seed). Usada pela página de gerenciamento.
  function carregar() {
    return buscarRemoto().then(function (remoto) {
      if (remoto) return remoto;
      return lerCache() || window.CONFIG_SEED || window.CONFIG || {};
    });
  }

  // Salva no Firestore e atualiza o cache local imediatamente.
  function salvar(cfg) {
    gravarCache(cfg);
    if (!window.fbDb) {
      return Promise.reject(new Error("Firebase indisponível — preencha firebase-config.js."));
    }
    return window.fbDb.collection(COL).doc(DOC).set({
      config: cfg,
      atualizadoEm: new Date().toISOString()
    });
  }

  // Atualiza o cache a partir do Firestore (sem bloquear o render atual).
  function sincronizarBackground() {
    return buscarRemoto();
  }

  window.LotConfig = {
    carregar: carregar,
    salvar: salvar,
    sincronizarBackground: sincronizarBackground,
    lerCache: lerCache,
    gravarCache: gravarCache
  };
})();
