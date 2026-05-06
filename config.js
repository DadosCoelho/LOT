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
      dataRealizacao: "06/05/2026",

      // Valor total pago pelo jogo e quantidade de cotas disponíveis
      // O valor por cota será calculado automaticamente: valorTotal / quantidadeCotas
      valorTotal: 84.00,
      quantidadeCotas: 20,

      // "simples" = apenas um concurso | "teimosinha" = vários concursos seguidos
      tipo: "teimosinha",
      // Número de concursos (preenchido apenas quando tipo = "teimosinha")
      quantidadeConcursos: 24
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
      { nome: "Reinaldo", saldo: 1.40 },
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