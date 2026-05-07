import { CartItem as CartItemType } from "../types/cart"
import { formatCurrency } from "../utils/currency"

export function CartItem(item: CartItemType) {
  return `
    <article class="cart-item">
      <img src="${item.product.image}" alt="${item.product.name}" />
      <div>
        <h3>${item.product.name}</h3>
        <p>${formatCurrency(item.product.price)}</p>
        <div class="quantity-control">
          <button data-decrease="${item.product.id}" type="button">-</button>
          <span>${item.quantity}</span>
          <button data-increase="${item.product.id}" type="button">+</button>
        </div>
      </div>
      <button class="ghost-button" data-remove-cart="${item.product.id}" type="button">Remover</button>
    </article>
  `
}
