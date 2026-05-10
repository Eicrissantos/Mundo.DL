import { Product } from "../types/product"
import { escapeHtml } from "../utils/html"

type HeaderProps = {
  cartCount: number
  wishlistCount: number
  activeRoute: string
  products: Product[]
}

function navClass(route: string, activeRoute: string) {
  return route === activeRoute ? "nav-link active" : "nav-link"
}

export function Header({ cartCount, wishlistCount, activeRoute, products }: HeaderProps) {
  return `
    <header class="site-header">
      <a class="brand" href="#/home" aria-label="Mundo Delas">
        <span class="brand-mark">
          <img src="/assets/brand/logo.jpeg" alt="" />
        </span>
        <span>
          <strong>Mundo Delas</strong>
          <small>Prazer com discrição</small>
        </span>
      </a>

      <nav class="header-nav" aria-label="Navegação principal">
        <a class="${navClass("home", activeRoute)}" href="#/home">Início</a>
        <div class="nav-products-wrap">
          <a class="${navClass("products", activeRoute)}" href="#/products">Produtos</a>
          <div class="products-menu" aria-label="Produtos disponíveis">
            <p class="eyebrow">Produtos disponíveis</p>
            ${products.length ? products.map(product => `
              <button type="button" data-menu-product="${product.id}">
                ${escapeHtml(product.name)}
              </button>
            `).join("") : `<span>Nenhum produto carregado</span>`}
          </div>
        </div>
        <a class="${navClass("account", activeRoute)}" href="#/account">Minha conta</a>
        <a class="${navClass("track", activeRoute)}" href="#/track">Rastrear pedido</a>
        <a class="${navClass("wishlist", activeRoute)}" href="#/wishlist">Desejos ${wishlistCount > 0 ? `<strong>${wishlistCount}</strong>` : ""}</a>
      </nav>

      <button class="cart-button" data-open-cart type="button">
        <span>Carrinho</span>
        <strong data-cart-count>${cartCount}</strong>
      </button>
    </header>
  `
}
