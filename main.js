/**
 * @fileoverview Script principal do EducaDin.
 * Responsável pelo toggle de tema claro/escuro e pelo
 * carregamento/renderização da seção de notícias financeiras.
 *
 * @module main
 */

/* ============================================================
   TOGGLE DE TEMA
   ============================================================ */

/**
 * Chave usada para persistir a preferência de tema no localStorage.
 * @constant {string}
 */
const STORAGE_KEY_TEMA = "educadin-tema";

/**
 * Inicializa o tema da página.
 * Verifica, na ordem: localStorage → preferência do sistema operacional.
 * Aplica o tema no atributo `data-theme` do elemento `<html>`.
 *
 * @returns {void}
 */
function inicializarTema() {
  const temaSalvo = localStorage.getItem(STORAGE_KEY_TEMA);
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const temaInicial = temaSalvo ?? (prefereEscuro ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", temaInicial);
}

/**
 * Alterna o tema entre "dark" e "light".
 * Persiste a escolha no localStorage para visitas futuras.
 *
 * @returns {void}
 */
function alternarTema() {
  const temaAtual = document.documentElement.getAttribute("data-theme");
  const novoTema = temaAtual === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", novoTema);
  localStorage.setItem(STORAGE_KEY_TEMA, novoTema);
}

/**
 * Registra o evento de clique no botão de toggle de tema.
 *
 * @returns {void}
 */
function registrarToggleTema() {
  const botao = document.getElementById("themeToggle");
  if (!botao) return;

  botao.addEventListener("click", alternarTema);
}

/* ============================================================
   MÓDULO DE NOTÍCIAS
   ============================================================ */

/**
 * @typedef {Object} Noticia
 * @property {string} titulo      - Título da notícia.
 * @property {string} resumo      - Breve descrição ou lead.
 * @property {string} fonte       - Nome do veículo de comunicação.
 * @property {string} data        - Data de publicação formatada (ex: "31 mar. de 2025").
 * @property {string} categoria   - Categoria: "investimentos" | "economia" | "acoes" | "outros".
 * @property {string} url         - URL da notícia completa.
 */

/**
 * Mapeamento de categorias para rótulos exibíveis e emojis.
 * @type {Object<string, {label: string, emoji: string}>}
 */
const CATEGORIAS = {
  investimentos: { label: "Investimentos", emoji: "📈" },
  economia:      { label: "Economia",      emoji: "🏛️" },
  acoes:         { label: "Ações",         emoji: "📊" },
  outros:        { label: "Mercado",       emoji: "💡" },
};

/* ============================================================
   INTEGRAÇÃO: NEWSDATA.IO
   Como configurar:
     1. Crie uma conta gratuita em https://newsdata.io
     2. Copie sua API Key no painel (Account → API Key)
     3. Substitua o valor de NEWSDATA_API_KEY abaixo pela sua chave
   Plano gratuito: 200 créditos/dia, sem necessidade de cartão.
   Documentação:   https://newsdata.io/documentation
   ============================================================ */

/**
 * Sua chave de API da NewsData.io.
 * @constant {string}
 */
const NEWSDATA_API_KEY = "pub_35297de19e22447d8d07b7831e1c165e";

/** @constant {string} Endpoint da API de últimas notícias */
const NEWSDATA_ENDPOINT = "https://newsdata.io/api/1/latest";

/**
 * Mapeamento das categorias retornadas pela NewsData.io
 * para as categorias internas do EducaDin.
 * @type {Object<string, string>}
 */
const MAPA_CATEGORIAS_API = {
  business:  "investimentos",
  finance:   "investimentos",
  economy:   "economia",
  politics:  "economia",
  top:       "outros",
};

/**
 * Converte o array de categorias da API para a categoria interna do EducaDin.
 *
 * @param {string[]|null} categoriasApi - Categorias retornadas pela NewsData.io.
 * @returns {string} Categoria interna correspondente.
 */
function mapearCategoria(categoriasApi) {
  if (!Array.isArray(categoriasApi) || categoriasApi.length === 0) return "outros";
  for (const cat of categoriasApi) {
    const mapeada = MAPA_CATEGORIAS_API[cat.toLowerCase()];
    if (mapeada) return mapeada;
  }
  return "outros";
}

/**
 * Formata uma data ISO retornada pela API para exibição em pt-BR.
 * Também aceita strings já formatadas (usadas nos dados mock).
 *
 * @param {string} dataStr - Data ISO (ex: "2025-03-31 14:22:00") ou texto livre.
 * @returns {string} Data formatada (ex: "31 de mar. de 2025").
 */
function formatarData(dataStr) {
  if (!dataStr) return "Data não disponível";
  // Se não tiver formato ISO, retorna como está (strings dos mocks)
  if (!/\d{4}-\d{2}-\d{2}/.test(dataStr)) return dataStr;
  try {
    return new Date(dataStr).toLocaleDateString("pt-BR", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  } catch {
    return dataStr;
  }
}

/**
 * Notícias de fallback usadas no modo de demonstração
 * (sem API Key configurada) ou quando a API não retorna resultados.
 *
 * @returns {Promise<Noticia[]>}
 */
async function buscarNoticiasMock() {
  // Simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

  /** @type {Noticia[]} */
  return [
    {
      titulo: "Copom mantém Selic em 10,5% ao ano pela segunda reunião consecutiva",
      resumo: "O Comitê de Política Monetária do Banco Central decidiu manter a taxa básica de juros estável, sinalizando cautela diante da inflação ainda acima do centro da meta.",
      fonte: "Valor Econômico",
      data: "31 mar 2025",
      categoria: "economia",
      url: "#",
    },
    {
      titulo: "Tesouro Direto: títulos IPCA+ voltam a atrair investidores com taxas acima de 6%",
      resumo: "Com a inflação mostrando sinais de desaceleração, os títulos indexados ao IPCA voltaram ao radar dos investidores de longo prazo em busca de proteção real.",
      fonte: "InfoMoney",
      data: "30 mar 2025",
      categoria: "investimentos",
      url: "#",
    },
    {
      titulo: "Ibovespa supera 130.000 pontos impulsionado por commodities e bancos",
      resumo: "O principal índice da bolsa brasileira encerrou a semana em alta, puxado pela valorização das ações de mineradoras e grandes bancos nacionais.",
      fonte: "B3 News",
      data: "29 mar 2025",
      categoria: "acoes",
      url: "#",
    },
    {
      titulo: "Dólar recua para R$ 5,10 com melhora do cenário externo",
      resumo: "A moeda americana fechou em queda frente ao real após dados positivos da economia dos EUA aliviarem as preocupações com novos aumentos dos juros americanos.",
      fonte: "Reuters Brasil",
      data: "28 mar 2025",
      categoria: "economia",
      url: "#",
    },
    {
      titulo: "CDB de bancos médios ainda oferece retornos superiores a 115% do CDI",
      resumo: "Levantamento aponta que instituições financeiras de médio porte continuam sendo competitivas no segmento de renda fixa, com liquidez diária em alguns produtos.",
      fonte: "InfoMoney",
      data: "27 mar 2025",
      categoria: "investimentos",
      url: "#",
    },
    {
      titulo: "Fundos imobiliários distribuem R$ 1,2 bilhão em dividendos no mês",
      resumo: "O setor de FIIs manteve o ritmo de distribuição de rendimentos, com os fundos de papel se destacando em meio ao ambiente de juros elevados.",
      fonte: "Suno Research",
      data: "26 mar 2025",
      categoria: "acoes",
      url: "#",
    },
  ];
}

/**
 * Busca notícias financeiras reais via NewsData.io.
 *
 * Parâmetros utilizados na requisição:
 *   - language=pt    → Apenas artigos em português
 *   - country=br     → Prioriza fontes brasileiras
 *   - category=business,economy → Mercado financeiro e economia
 *   - size=10        → Máximo de resultados por chamada (limite do plano gratuito)
 *
 * Comportamento de fallback:
 *   - Se NEWSDATA_API_KEY não estiver configurada → usa dados mock (modo demo)
 *   - Se a API retornar 0 resultados              → usa dados mock
 *   - Se a requisição falhar (rede/HTTP)           → propaga o erro para `carregarNoticias`
 *
 * @returns {Promise<Noticia[]>}
 */
async function buscarNoticias() {
  // Chave não configurada → modo demonstração com dados mock
  if (!NEWSDATA_API_KEY || NEWSDATA_API_KEY === "SUA_API_KEY_AQUI") {
    console.warn("[EducaDin] NEWSDATA_API_KEY não configurada. Exibindo dados de exemplo.");
    return buscarNoticiasMock();
  }

  const params = new URLSearchParams({
    apikey:   NEWSDATA_API_KEY,
    language: "pt",
    country:  "br",
    category: "business,economy",
    size:     "10",
  });

  const resposta = await fetch(`${NEWSDATA_ENDPOINT}?${params}`);

  if (!resposta.ok) {
    // Tenta extrair mensagem de erro da API antes de lançar
    const corpo = await resposta.json().catch(() => ({}));
    const mensagem = corpo?.results?.message ?? `HTTP ${resposta.status}`;
    throw new Error(`[NewsData.io] ${mensagem}`);
  }

  const dados = await resposta.json();

  if (dados.status !== "success" || !Array.isArray(dados.results)) {
    throw new Error("[NewsData.io] Formato de resposta inesperado.");
  }

  /** @type {Noticia[]} */
  const noticias = dados.results
    .filter((item) => item.title && item.link) // descarta itens sem título ou URL
    .map((item) => ({
      titulo:    item.title,
      resumo:    item.description
                   ?? item.content?.slice(0, 200)
                   ?? "Clique para ler a notícia completa.",
      fonte:     item.source_name ?? item.source_id ?? "Fonte desconhecida",
      data:      formatarData(item.pubDate) || "Data não disponível",
      categoria: mapearCategoria(item.category),
      url:       item.link,
    }));

  // API retornou lista vazia → fallback silencioso para dados mock
  if (noticias.length === 0) {
    console.warn("[EducaDin] API retornou 0 notícias. Exibindo dados de exemplo.");
    return buscarNoticiasMock();
  }

  return noticias;
}

/**
 * Filtra a lista de notícias de acordo com a categoria selecionada.
 *
 * @param {Noticia[]} noticias  - Lista completa de notícias.
 * @param {string}    filtro    - Categoria a filtrar. "todos" retorna todas.
 * @returns {Noticia[]} Lista filtrada.
 */
function filtrarNoticias(noticias, filtro) {
  if (filtro === "todos") return noticias;
  return noticias.filter((n) => n.categoria === filtro);
}

/**
 * Cria o elemento HTML de um card de notícia.
 *
 * @param {Noticia} noticia - Objeto com os dados da notícia.
 * @returns {HTMLAnchorElement} Elemento `<a>` estilizado como card.
 */
function criarCardNoticia(noticia) {
  const config = CATEGORIAS[noticia.categoria] ?? CATEGORIAS.outros;

  const card = document.createElement("a");
  card.href = noticia.url;
  card.className = "news-card";
  card.setAttribute("target", "_blank");
  card.setAttribute("rel", "noopener noreferrer");
  card.setAttribute("aria-label", `Ler notícia: ${noticia.titulo}`);

  card.innerHTML = `
    <div class="news-card__category news-card__category--${noticia.categoria}">
      <span>${config.emoji}</span>
      <span>${config.label}</span>
    </div>
    <h3 class="news-card__title">${noticia.titulo}</h3>
    <p class="news-card__excerpt">${noticia.resumo}</p>
    <div class="news-card__meta">
      <span class="news-card__source">${noticia.fonte}</span>
      <span class="news-card__date">${noticia.data}</span>
    </div>
    <span class="news-card__read-more">Ler mais <span>→</span></span>
  `;

  return card;
}

/**
 * Renderiza a lista de notícias no grid da seção.
 * Limpa o conteúdo anterior antes de inserir os novos cards.
 *
 * @param {Noticia[]} noticias - Lista de notícias a exibir.
 * @returns {void}
 */
function renderizarNoticias(noticias) {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (noticias.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <div style="font-size: 2rem; margin-bottom: 0.75rem;">🔍</div>
        <p>Nenhuma notícia encontrada nessa categoria.</p>
      </div>
    `;
    return;
  }

  const fragmento = document.createDocumentFragment();
  noticias.forEach((noticia) => {
    fragmento.appendChild(criarCardNoticia(noticia));
  });

  grid.appendChild(fragmento);
}

/**
 * Exibe o estado de carregamento (skeleton) e oculta os demais estados.
 *
 * @returns {void}
 */
function mostrarCarregando() {
  document.getElementById("newsLoading").hidden = false;
  document.getElementById("newsGrid").hidden = true;
  document.getElementById("newsError").hidden = true;
}

/**
 * Exibe o grid de notícias e oculta os demais estados.
 *
 * @returns {void}
 */
function mostrarGrid() {
  document.getElementById("newsLoading").hidden = true;
  document.getElementById("newsGrid").hidden = false;
  document.getElementById("newsError").hidden = true;
}

/**
 * Exibe o estado de erro e oculta os demais estados.
 *
 * @returns {void}
 */
function mostrarErro() {
  document.getElementById("newsLoading").hidden = true;
  document.getElementById("newsGrid").hidden = true;
  document.getElementById("newsError").hidden = false;
}

/**
 * Categoria de filtro atualmente selecionada.
 * @type {string}
 */
let filtroAtivo = "todos";

/**
 * Cache das notícias carregadas para permitir re-filtragem sem nova requisição.
 * @type {Noticia[]}
 */
let cacheNoticias = [];

/**
 * Carrega as notícias da fonte de dados e as renderiza na seção.
 * Gerencia os estados de carregamento, sucesso e erro.
 *
 * @param {boolean} [forcar=false] - Se true, ignora o cache e busca novamente.
 * @returns {Promise<void>}
 */
async function carregarNoticias(forcar = false) {
  const botaoAtualizar = document.getElementById("newsRefreshBtn");

  mostrarCarregando();
  botaoAtualizar?.classList.add("loading");

  try {
    if (forcar || cacheNoticias.length === 0) {
      cacheNoticias = await buscarNoticias();
    }

    const noticiasFiltradas = filtrarNoticias(cacheNoticias, filtroAtivo);
    renderizarNoticias(noticiasFiltradas);
    mostrarGrid();
  } catch (erro) {
    console.error("[EducaDin] Falha ao carregar notícias:", erro);
    mostrarErro();
  } finally {
    botaoAtualizar?.classList.remove("loading");
  }
}

/**
 * Registra os eventos de interação da seção de notícias:
 * - Filtros de categoria
 * - Botão de atualizar
 * - Botão de tentar novamente (estado de erro)
 *
 * @returns {void}
 */
function registrarEventosNoticias() {
  // Filtros de categoria
  const tabsContainer = document.getElementById("newsFilterTabs");
  tabsContainer?.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".news-filter-btn");
    if (!botao) return;

    const filtro = botao.dataset.filter;
    if (!filtro || filtro === filtroAtivo) return;

    // Atualiza visual dos botões
    tabsContainer.querySelectorAll(".news-filter-btn").forEach((b) => {
      b.classList.toggle("active", b === botao);
    });

    filtroAtivo = filtro;

    // Re-filtra usando o cache (sem nova requisição)
    const noticiasFiltradas = filtrarNoticias(cacheNoticias, filtroAtivo);
    renderizarNoticias(noticiasFiltradas);
  });

  // Botão atualizar
  document.getElementById("newsRefreshBtn")?.addEventListener("click", () => {
    carregarNoticias(true);
  });

  // Botão tentar novamente (estado de erro)
  document.getElementById("newsRetryBtn")?.addEventListener("click", () => {
    carregarNoticias(true);
  });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

/**
 * Ponto de entrada principal.
 * Chamado quando o DOM está completamente carregado.
 *
 * @returns {void}
 */
function inicializar() {
  inicializarTema();
  registrarToggleTema();
  registrarEventosNoticias();
  carregarNoticias();
}

// Aguarda o DOM estar pronto antes de inicializar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializar);
} else {
  inicializar();
}