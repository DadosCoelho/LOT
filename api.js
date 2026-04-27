(function (global) {
  const BASE_URL = "https://servicebus2.caixa.gov.br/portaldeloterias/api/";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function obterRetryAfterMs(resp) {
    const retryAfter = resp.headers.get("Retry-After");
    if (!retryAfter) return 1500;

    const segundos = Number(retryAfter);
    if (!Number.isNaN(segundos)) return segundos * 1000;

    const data = Date.parse(retryAfter);
    if (!Number.isNaN(data)) return Math.max(0, data - Date.now());

    return 1500;
  }

  async function buscarComRetry(url, maxTentativas = 3) {
    let ultimoErro = null;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        const resp = await fetch(url);

        if (resp.status === 404) {
          return { status: "notfound" };
        }

        if (resp.status === 429) {
          if (tentativa === maxTentativas) {
            throw new Error("HTTP 429");
          }

          const backoff = 500 * Math.pow(2, tentativa - 1);
          await sleep(backoff + obterRetryAfterMs(resp));
          continue;
        }

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        return await resp.json();
      } catch (erro) {
        ultimoErro = erro;

        if (tentativa === maxTentativas) {
          throw ultimoErro;
        }

        const backoff = 500 * Math.pow(2, tentativa - 1);
        await sleep(backoff);
      }
    }

    throw ultimoErro || new Error("Falha ao consultar a API da Caixa");
  }

  function montarUrlConcurso(modalidade, numero) {
    if (numero === null || numero === undefined) {
      return `${BASE_URL}${modalidade}/`;
    }

    return `${BASE_URL}${modalidade}/${numero}`;
  }

  function buscarUltimoConcurso(modalidade, maxTentativas = 3) {
    return buscarComRetry(montarUrlConcurso(modalidade, null), maxTentativas);
  }

  function buscarConcurso(modalidade, numero, maxTentativas = 3) {
    return buscarComRetry(montarUrlConcurso(modalidade, numero), maxTentativas);
  }

  global.ApiCaixa = {
    BASE_URL,
    sleep,
    obterRetryAfterMs,
    buscarComRetry,
    buscarUltimoConcurso,
    buscarConcurso
  };
})(window);
