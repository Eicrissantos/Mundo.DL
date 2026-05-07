import { CartItem } from "./CartItem"
import { CartItem as CartItemType } from "../types/cart"
import { formatCurrency } from "../utils/currency"

export function CartSummary(items: CartItemType[]) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return `
    <aside class="cart-drawer" data-cart-drawer aria-hidden="true">
      <div class="cart-backdrop" data-close-cart></div>
      <section class="cart-panel">
        <header>
          <div>
            <p class="eyebrow">Pedido discreto</p>
            <h2>Seu carrinho</h2>
          </div>
          <button class="icon-button" data-close-cart type="button" aria-label="Fechar carrinho">x</button>
        </header>

        <div class="cart-items">
          ${items.length ? items.map(CartItem).join("") : `<p class="empty-state">Seu carrinho esta vazio.</p>`}
        </div>

        <footer class="cart-footer">
          <div>
            <span>Total</span>
            <strong>${formatCurrency(total)}</strong>
          </div>
          <button class="primary-button" data-checkout type="button" ${items.length === 0 ? "disabled" : ""}>
            Finalizar no WhatsApp
          </button>
        </footer>
      </section>
    </aside>
  `
}
