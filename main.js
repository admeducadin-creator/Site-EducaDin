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
 * @property {string} data        - Data de publicação formatada (ex: "31 mar 2025").
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

/**
 * Dados ilustrativos de notícias, utilizados enquanto a integração
 * real com a API de notícias não está disponível.
 * Substitua esta função por uma chamada à API real quando disponível.
 *
 * @returns {Promise<Noticia[]>} Promise que resolve com a lista de notícias.
 */
async function buscarNoticias() {
  // Simula latência de rede (entre 600ms e 1.2s)
  const latenciaSimulada = 600 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, latenciaSimulada));

  // TODO: Substituir pelo fetch real da API de notícias financeiras.
  // Exemplo de integração futura:
  

  /** @type {Noticia[]} */
  const noticiasMock = [
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
      fonte: "Infomoney",
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

  return noticiasMock;
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
 * Formata uma string de data para exibição amigável.
 * Caso a data já esteja formatada (texto), retorna como está.
 *
 * @param {string} dataStr - Data em texto ou formato ISO.
 * @returns {string} Data formatada.
 */
function formatarData(dataStr) {
  // Como estamos usando strings pré-formatadas nos mocks, retornamos direto.
  // Numa integração real, use: new Date(dataStr).toLocaleDateString("pt-BR", {...})
  return dataStr;
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
      <span class="news-card__date">${formatarData(noticia.data)}</span>
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