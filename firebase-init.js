// Inicializa o Firebase (SDK compat) e expõe auth/db globais.
// Degrada graciosamente se o SDK ou a config não estiverem presentes (ou se a
// config ainda estiver com placeholders) — nesse caso fbAuth/fbDb ficam null e
// o app segue funcionando em modo local (config.js).
(function () {
  try {
    if (typeof firebase === "undefined" ||
        typeof firebaseConfig === "undefined" ||
        !firebaseConfig.apiKey ||
        firebaseConfig.apiKey === "COLE_AQUI") {
      window.fbAuth = null;
      window.fbDb = null;
      return;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // auth só existe se o SDK de auth foi carregado (páginas públicas não o
    // carregam — só a de gerenciamento precisa de login).
    window.fbAuth = (typeof firebase.auth === "function") ? firebase.auth() : null;
    window.fbDb = firebase.firestore();
  } catch (e) {
    window.fbAuth = null;
    window.fbDb = null;
  }
})();
