import { Product } from "../types/product"
import { formatCurrency } from "../utils/currency"

export function ProductCard(product: Product) {
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="stock-badge">${product.stock > 0 ? "Disponivel" : "Sem estoque"}</span>
      </div>
      <div class="product-content">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <strong>${formatCurrency(product.price)}</strong>
          <span>Popularidade ${product.popularity}/10</span>
        </div>
        <button class="primary-button" data-add-cart="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
          Adicionar
        </button>
      </div>
    </article>
  `
}
