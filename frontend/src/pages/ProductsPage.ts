import { ProductGrid } from "../components/ProductGrid"
import { Product } from "../types/product"
import { escapeHtml } from "../utils/html"

type ProductsPageProps = {
  products: Product[]
  categories: string[]
  search: string
  sort: string
  activeCategory: string
  wishedIds: Set<number>
}

export function ProductsPage({ products, categories, search, sort, activeCategory, wishedIds }: ProductsPageProps) {
  return `
    <main>
      <section class="page-hero compact-hero">
        <p class="eyebrow">Vitrine</p>
        <h1>Produtos Mundo Delas</h1>
        <p>Busque por categoria, compare valores e salve seus favoritos antes de finalizar pelo WhatsApp.</p>
      </section>

      <section class="toolbar-section" id="products">
        <div>
          <p class="eyebrow">Catalogo</p>
          <h2>Escolhas em destaque</h2>
        </div>
        <div class="filters">
          <input data-search type="search" placeholder="Buscar produto..." value="${escapeHtml(search)}" />
          <select data-sort>
            <option value="popular" ${sort === "popular" ? "selected" : ""}>Popularidade</option>
            <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Menor preco</option>
            <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Maior preco</option>
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
        ${ProductGrid(products, wishedIds)}
      </section>
    </main>
  `
}
