import { Product } from "../types/product"
import { formatCurrency } from "../utils/currency"
import { escapeHtml } from "../utils/html"

type ProductCardProps = {
  product: Product
  wished: boolean
}

export function ProductCard({ product, wished }: ProductCardProps) {
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <span class="stock-badge">${product.stock > 0 ? "Disponivel" : "Sem estoque"}</span>
        <button class="${wished ? "wishlist-button active" : "wishlist-button"}" data-toggle-wishlist="${product.id}" type="button" aria-label="Adicionar aos desejos">
          ♥
        </button>
      </div>
      <div class="product-content">
        <p class="product-category">${escapeHtml(product.category)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-meta">
          <strong>${formatCurrency(product.price)}</strong>
          <span>Popularidade ${product.popularity}/10</span>
        </div>
        <button class="primary-button" data-add-cart="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
          Adicionar
        </button>
        <button class="whatsapp-product-link" data-product-whatsapp="${product.id}" type="button">
          Duvida? Chame no WhatsApp
        </button>
      </div>
    </article>
  `
}
