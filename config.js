/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║               LOT — CONFIGURAÇÃO CENTRAL                    ║
 * ║  Edite este arquivo para atualizar jogos e jogadores.        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ──────────────────────────────────────────
     TEIMOSINHA — LOTOFÁCIL
  ────────────────────────────────────────── */
  lotofacilTeimosinha: {
    JOGOS: [
      {
        id: 2,
        nomeGrupo: "Lotofácil",
        modalidade: "lotofacil",
        concursoInicial: 3606,
        quantidadeTeimosinha: 24,
        dezenas: ["01","03","04","05","07","08","10","12","13","15","17","19","20","23","25"],
        jogadores: [
          { nome: "Reinaldo", cotas: 2 },
          { nome: "Rafael",   cotas: 2 },
          { nome: "Luno",     cotas: 1 },
          { nome: "Ana",      cotas: 1 },
          { nome: "Ricardo",  cotas: 1 },
          { nome: "Osmar",    cotas: 1 },
          { nome: "Vinicius", cotas: 1 },
          { nome: "Herika",   cotas: 1 }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────
     DUPLA DE PÁSCOA 2026
  ────────────────────────────────────────── */
  duplaPascoa: {

    // Número do concurso. Deixe null para buscar o último automaticamente.
    CONCURSO: null,

    // Jogadores e cotas (total = 10)
    JOGADORES: [
      { nome: "Reinaldo", cotas: 2 },
      { nome: "Rafael",   cotas: 2 },
      { nome: "Luno",     cotas: 1 },
      { nome: "Ana",      cotas: 1 },
      { nome: "Ricardo",  cotas: 1 },
      { nome: "Osmar",    cotas: 1 },
      { nome: "Vinicius", cotas: 1 },
      { nome: "Herika",   cotas: 1 }
    ],

    // Lista de jogos apostados.
    // Cada jogo tem 6 dezenas (Dupla Sena vai de 01 a 50).
    // Substitua pelas dezenas reais antes do sorteio!
    JOGOS: [
      { id: 1, nome: "Jogo 1", dezenas: ["03","07","12","18","24","30"] },
      { id: 2, nome: "Jogo 2", dezenas: ["02","09","11","17","22","28"] },
      { id: 3, nome: "Jogo 3", dezenas: ["05","08","14","20","26","36"] }
      // Para adicionar mais jogos, copie uma linha acima e incremente o id.
    ]
  }

};