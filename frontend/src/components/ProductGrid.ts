import { ProductCard } from "./ProductCard"
import { Product } from "../types/product"

export function ProductGrid(products: Product[]) {
  if(products.length === 0) {
    return `<p class="empty-state">Nenhum produto encontrado.</p>`
  }

  return `
    <div class="product-grid">
      ${products.map(ProductCard).join("")}
    </div>
  `
}
