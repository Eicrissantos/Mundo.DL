import { ProductGrid } from "../components/ProductGrid"
import { Product } from "../types/product"
import { formatCurrency } from "../utils/currency"
import { escapeHtml } from "../utils/html"

type ProductsPageProps = {
  products: Product[]
  categories: string[]
  search: string
  sort: string
  activeCategory: string
  wishedIds: Set<number>
  selectedProduct: Product | null
}

export function ProductsPage({ products, categories, search, sort, activeCategory, wishedIds, selectedProduct }: ProductsPageProps) {
  return `
    <main>
      <section class="page-hero compact-hero">
        <div class="hero-copy">
          <p class="eyebrow">Vitrine</p>
          <h1>Produtos Mundo Delas</h1>
          <p>Busque por categoria, compare valores e salve seus favoritos antes de finalizar pelo WhatsApp.</p>
        </div>
        <figure class="hero-logo hero-logo-small" aria-label="Logo Mundo Delas">
          <img src="/assets/brand/logo.jpeg" alt="Mundo Delas" />
        </figure>
      </section>

      <section class="toolbar-section" id="products">
        <div>
          <p class="eyebrow">Catálogo</p>
          <h2>Escolhas em destaque</h2>
        </div>
        <div class="filters">
          <input data-search type="search" placeholder="Buscar produto..." value="${escapeHtml(search)}" />
          <select data-sort>
            <option value="popular" ${sort === "popular" ? "selected" : ""}>Popularidade</option>
            <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Menor preço</option>
            <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Maior preço</option>
          </select>
        </div>
      </section>

      <section class="category-row" aria-label="Filtro por categoria">
        ${categories.map(category => `
          <button class="${category === activeCategory ? "chip active" : "chip"}" data-category="${escapeHtml(category)}">
            ${escapeHtml(category)}
          </button>
        `).join("")}
      </section>

      <section class="products-shell">
        ${selectedProduct ? `
          <article class="product-detail-panel" id="product-detail">
            <img src="${escapeHtml(selectedProduct.image)}" alt="${escapeHtml(selectedProduct.name)}" />
            <div>
              <p class="eyebrow">${escapeHtml(selectedProduct.category)}</p>
              <h2>${escapeHtml(selectedProduct.name)}</h2>
              <strong>${formatCurrency(selectedProduct.price)}</strong>
              <p>${escapeHtml(selectedProduct.description)}</p>
              <button class="primary-button" data-add-cart="${selectedProduct.id}" ${selectedProduct.stock <= 0 ? "disabled" : ""}>
                Comprar / adicionar ao carrinho
              </button>
            </div>
          </article>
        ` : ""}
        ${ProductGrid(products, wishedIds)}
      </section>
    </main>
  `
}
