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
    // visivel: true  → mostra o card na página inicial
    // visivel: false → esconde o card
    visivel: true,
    JOGOS: [
      {
        id: 2,
        nomeGrupo: "Lotofácil",
        modalidade: "lotofacil",
        concursoInicial: 3678,
        quantidadeTeimosinha: 24,
        dezenas: ["02","03","05","06","07","09","10","12","14","18","19","20","22","23","25"],
        jogadores: [
          { nome: "Reinaldo", cotas: 20 },
          { nome: "Rafael",   cotas: 0 },
          { nome: "Luno",     cotas: 0 },
          { nome: "Ana",      cotas: 0 },
          { nome: "Ricardo",  cotas: 0 },
          { nome: "Osmar",    cotas: 0 },
          { nome: "Vinicius", cotas: 0 },
          { nome: "Herika",   cotas: 0 }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────
     LOTOFÁCIL — JOGO SIMPLES
  ────────────────────────────────────────── */
  lotofacil: {
    // visivel: true  → mostra o card na página inicial
    // visivel: false → esconde o card
    visivel: true,

    // Número do concurso. Deixe null para buscar o último automaticamente.
    CONCURSO: 3679,

    // Jogadores e cotas
    // ⚠️ IMPORTANTE: Pelo menos um jogador deve ter cotas > 0
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
    // Cada jogo tem 15 dezenas (Lotofácil vai de 01 a 25).
    JOGOS: [
      { id: 1, nome: "Lotofácil 1", dezenas: ["01","04","06","08","09","10","12","13","15","17","20","21","23","24","25"] },
      { id: 2, nome: "Lotofácil 2", dezenas: ["04","06","07","08","09","10","11","12","13","14","15","16","19","21","24"] },
      { id: 3, nome: "Lotofácil 3", dezenas: ["01","05","08","09","10","11","12","13","14","15","17","21","22","23","24"] },
      { id: 4, nome: "Lotofácil 4", dezenas: ["02","05","07","08","10","11","14","15","16","17","18","20","22","24","25"] },
      { id: 5, nome: "Lotofácil 5", dezenas: ["01","02","06","08","09","11","13","14","15","17","18","19","20","24","25"] },
      { id: 6, nome: "Lotofácil 6", dezenas: ["02","03","04","05","06","07","08","10","14","15","16","17","20","23","24"] },
      { id: 7, nome: "Lotofácil 7", dezenas: ["01","03","05","07","09","10","11","12","15","16","17","18","22","23","24"] },
      { id: 8, nome: "Lotofácil 8", dezenas: ["03","05","06","07","10","11","12","14","15","16","17","18","19","23","24"] },
      { id: 9, nome: "Lotofácil 9", dezenas: ["01","03","04","06","08","09","10","12","16","17","19","20","22","23","25"] }
      // Para adicionar mais jogos, copie uma linha acima e incremente o id.
    ]
  },

  /* ──────────────────────────────────────────
     MEGA SENA
  ────────────────────────────────────────── */
  megaSena: {
    // visivel: true  → mostra o card na página inicial
    // visivel: false → esconde o card
    visivel: false,

    // Número do concurso. Deixe null para buscar o último automaticamente.
    CONCURSO: null,

    // Jogadores e cotas
    // ⚠️ IMPORTANTE: Pelo menos um jogador deve ter cotas > 0
    JOGADORES: [
      { nome: "Reinaldo", cotas: 10 },
      { nome: "Rafael",   cotas: 0 },
      { nome: "Luno",     cotas: 0 },
      { nome: "Ana",      cotas: 0 },
      { nome: "Ricardo",  cotas: 0 },
      { nome: "Osmar",    cotas: 0 },
      { nome: "Vinicius", cotas: 0 },
      { nome: "Herika",   cotas: 0 }
    ],

    // Lista de jogos apostados.
    // Cada jogo tem 6 dezenas (Mega Sena vai de 01 a 60).
    JOGOS: [
      { id: 1, nome: "Mega Sena 1", dezenas: ["04","06","17","24","38","51"] }
      // Para adicionar mais jogos, copie uma linha acima e incremente o id.
    ]
  },

  /* ──────────────────────────────────────────
     DUPLA DE PÁSCOA 2026
  ────────────────────────────────────────── */
  duplaPascoa: {
    // visivel: true  → mostra o card na página inicial
    // visivel: false → esconde o card
    visivel: false,

    // Número do concurso. Deixe null para buscar o último automaticamente.
    CONCURSO: 2940,

    // Jogadores e cotas (total = 10)
    // ⚠️ IMPORTANTE: Pelo menos um jogador deve ter cotas > 0
    // Se todos tiverem cotas = 0, a tabela não será exibida e nenhum cálculo será feito.
    JOGADORES: [
      { nome: "Reinaldo", cotas: 10 },
      { nome: "Rafael",   cotas: 0 },
      { nome: "Luno",     cotas: 0 },
      { nome: "Ana",      cotas: 0 },
      { nome: "Ricardo",  cotas: 0 },
      { nome: "Osmar",    cotas: 0 },
      { nome: "Vinicius", cotas: 0 },
      { nome: "Herika",   cotas: 0 }
    ],

    // Lista de jogos apostados.
    // Cada jogo tem 6 dezenas (Dupla Sena vai de 01 a 50).
    // Substitua pelas dezenas reais antes do sorteio!
    JOGOS: [
      { id: 1, nome: "Dupla de Pascoa 1", dezenas: ["13","16","28","29","43","44"] },
      { id: 2, nome: "Dupla de Pascoa 2", dezenas: ["04","05","08","34","49","50"] },
      { id: 3, nome: "Dupla de Pascoa 3", dezenas: ["10","20","29","36","48","50"] },
      { id: 4, nome: "Dupla de Pascoa 4", dezenas: ["01","28","29","34","40","43"] },
      { id: 5, nome: "Dupla de Pascoa 5", dezenas: ["17","20","23","28","30","34"] },
      { id: 6, nome: "Dupla de Pascoa 6", dezenas: ["13","15","24","25","28","47"] },
      { id: 7, nome: "Dupla de Pascoa 7", dezenas: ["02","13","18","38","41","48"] },
      { id: 8, nome: "Dupla de Pascoa 8", dezenas: ["01","02","08","20","30","47"] },
      { id: 9, nome: "Dupla de Pascoa 9", dezenas: ["02","04","15","24","25","50"] },
      { id: 10, nome: "Dupla de Pascoa 10", dezenas: ["17","36","37","38","47","50"] }
      // Para adicionar mais jogos, copie uma linha acima e incremente o id.
    ]
  },

  /* ──────────────────────────────────────────
     PRÓXIMOS JOGOS — exibidos no index como cards informativos
     Cada item da lista é um card independente.
     visivel: true  → mostra o card na página inicial
     visivel: false → esconde o card
     Para adicionar um novo jogo, copie um bloco abaixo e ajuste os valores.
  ────────────────────────────────────────── */
  proximosJogos: [
    {
      visivel: true,

      // Qual jogo será realizado
      nomeJogo: "Lotofácil",
      modalidade: "lotofacil",

      // Data do sorteio (ou primeiro sorteio, para teimosinha) — formato DD/MM/AAAA
      dataRealizacao: "07/05/2026",

      // Valor total pago pelo jogo e quantidade de cotas disponíveis
      // O valor por cota será calculado automaticamente: valorTotal / quantidadeCotas
      valorTotal: 7.12,
      quantidadeCotas: 10,

      // "simples" = apenas um concurso | "teimosinha" = vários concursos seguidos
      tipo: "simples",
      // Número de concursos (preenchido apenas quando tipo = "teimosinha")
      quantidadeConcursos: 0,

      // bolao: true  → indica que é uma cota de bolão
      // bolao: false → jogo individual
      bolao: true,

      // Fração da cota do bolão que o grupo adquiriu.
      // Ex: numerador=1, denominador=6 → compramos 1/6 do bolão.
      // Ignorado quando bolao = false.
      cotaBolaoNumerador: 1,
      cotaBalaoDenominador: 6,

      // Prêmio estimado do concurso (R$). Deixe null para não exibir.
      premioEstimado: 2000000
    }
    // Para adicionar outro jogo, copie o bloco acima separado por vírgula.
  ],

  /* ──────────────────────────────────────────
     SALDOS DOS JOGADORES — prêmios de jogos anteriores
     visivel: true  → mostra o card na página inicial
     visivel: false → esconde o card
  ────────────────────────────────────────── */
  saldos: {
    visivel: true,
    jogadores: [
      { nome: "Rafael",   saldo: 1.40 },
      { nome: "Luno",     saldo: 0.70 },
      { nome: "Ana",      saldo: 0.70 },
      { nome: "Ricardo",  saldo: 0.70 },
      { nome: "Osmar",    saldo: 0.70 },
      { nome: "Vinicius", saldo: 0.70 },
      { nome: "Herika",   saldo: 0.70 }
    ]
  }

};