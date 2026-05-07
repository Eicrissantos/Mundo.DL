type HeaderProps = {
  cartCount: number
  wishlistCount: number
  activeRoute: string
}

function navClass(route: string, activeRoute: string) {
  return route === activeRoute ? "nav-link active" : "nav-link"
}

export function Header({ cartCount, wishlistCount, activeRoute }: HeaderProps) {
  return `
    <header class="site-header">
      <a class="brand" href="#/home" aria-label="Mundo Delas">
        <span class="brand-mark">
          <img src="/assets/brand/logo.jpeg" alt="" />
        </span>
        <span>
          <strong>Mundo Delas</strong>
          <small>Prazer com discricao</small>
        </span>
      </a>

      <nav class="header-nav" aria-label="Navegacao principal">
        <a class="${navClass("home", activeRoute)}" href="#/home">Inicio</a>
        <a class="${navClass("products", activeRoute)}" href="#/products">Produtos</a>
        <a class="${navClass("account", activeRoute)}" href="#/account">Minha conta</a>
        <a class="${navClass("orders", activeRoute)}" href="#/orders">Meus pedidos</a>
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
