// Configuração do Firebase (cliente). NÃO é segredo — esses valores são
// identificadores públicos; a segurança vem das regras do Firestore
// (firestore.rules).
//
// ┌──────────────────────────────────────────────────────────────────┐
// │ COMO PREENCHER:                                                    │
// │ 1. Console do Firebase → crie um projeto novo (só pro LOT).        │
// │ 2. Authentication → Sign-in method → ative "Google".              │
// │ 3. Firestore Database → crie o banco (modo produção).             │
// │ 4. Project settings → Seus apps → Web → registre um app web e     │
// │    cole abaixo os valores do objeto firebaseConfig.               │
// │ 5. Publique as regras de firestore.rules.                         │
// └──────────────────────────────────────────────────────────────────┘
//
// Enquanto estiver com os placeholders abaixo, o app funciona normalmente
// lendo do config.js local (fallback). O Firebase "liga" sozinho assim que
// os valores reais forem colados aqui.
const firebaseConfig = {
  apiKey: "AIzaSyA2UVRBDMkdAPKW4ifVwz2BtgdHpsIkuB8",
  authDomain: "lot-dados.firebaseapp.com",
  projectId: "lot-dados",
  storageBucket: "lot-dados.firebasestorage.app",
  messagingSenderId: "222863796645",
  appId: "1:222863796645:web:1254ecb2d41f580a78e04c"
};
