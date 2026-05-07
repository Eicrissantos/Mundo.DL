import { Header } from "../components/Header"
import { ProductGrid } from "../components/ProductGrid"
import { Product } from "../types/product"

type HomePageProps = {
  products: Product[]
  categories: string[]
  cartCount: number
  search: string
  sort: string
  activeCategory: string
}

export function HomePage({ products, categories, cartCount, search, sort, activeCategory }: HomePageProps) {
  return `
    ${Header(cartCount)}
    <main id="top">
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Sexy shop premium</p>
          <h1>Mundo Delas</h1>
          <p>Produtos intimos, cosmeticos sensuais e acessorios selecionados com compra segura, atendimento humano e entrega discreta.</p>
          <div class="hero-actions">
            <a class="primary-button" href="#products">Ver produtos</a>
            <button class="secondary-button" data-open-cart type="button">Abrir carrinho</button>
          </div>
        </div>
        <div class="trust-strip">
          <span>Entrega discreta</span>
          <span>Atendimento no WhatsApp</span>
          <span>Compra segura</span>
        </div>
      </section>

      <section class="toolbar-section" id="products">
        <div>
          <p class="eyebrow">Vitrine</p>
          <h2>Escolhas em destaque</h2>
        </div>
        <div class="filters">
          <input data-search type="search" placeholder="Buscar produto..." value="${search}" />
          <select data-sort>
            <option value="popular" ${sort === "popular" ? "selected" : ""}>Popularidade</option>
            <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Menor preco</option>
            <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Maior preco</option>
          </select>
        </div>
      </section>

      <section class="category-row" aria-label="Filtro por categoria">
        ${categories.map(category => `
          <button class="${category === activeCategory ? "chip active" : "chip"}" data-category="${category}">
            ${category}
          </button>
        `).join("")}
      </section>

      <section class="products-shell">
        ${ProductGrid(products)}
      </section>
    </main>
  `
}
