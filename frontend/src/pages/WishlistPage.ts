import { Product } from "../types/product"
import { formatCurrency } from "../utils/currency"
import { escapeHtml } from "../utils/html"

type WishlistPageProps = {
  products: Product[]
}

export function WishlistPage({ products }: WishlistPageProps) {
  return `
    <main>
      <section class="page-hero compact-hero">
        <div class="hero-copy">
          <p class="eyebrow">Favoritos</p>
          <h1>Lista de desejos</h1>
          <p>Salve produtos para comparar depois ou adicionar ao carrinho quando quiser.</p>
        </div>
        <figure class="hero-logo hero-logo-small" aria-label="Logo Mundo Delas">
          <img src="/assets/brand/logo.jpeg" alt="Mundo Delas" />
        </figure>
      </section>

      <section class="products-shell">
        ${products.length === 0 ? `
          <div class="empty-panel">
            <p class="eyebrow">Sem favoritos</p>
            <h2>Sua lista de desejos está vazia.</h2>
            <a class="primary-button" href="#/products">Ver produtos</a>
          </div>
        ` : `
          <div class="wishlist-grid">
            ${products.map(product => `
              <article class="wishlist-card">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />
                <div>
                  <p class="eyebrow">${escapeHtml(product.category)}</p>
                  <h2>${escapeHtml(product.name)}</h2>
                  <strong>${formatCurrency(product.price)}</strong>
                  <div class="hero-actions">
                    <button class="primary-button" data-add-cart="${product.id}" type="button">Adicionar ao carrinho</button>
                    <button class="secondary-button" data-remove-wishlist="${product.id}" type="button">Remover</button>
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
        `}
      </section>
    </main>
  `
}
