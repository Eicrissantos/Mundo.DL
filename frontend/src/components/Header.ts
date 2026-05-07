export function Header(cartCount: number) {
  return `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Mundo Delas">
        <span class="brand-mark">
          <img src="/assets/brand/logo.jpeg" alt="" />
        </span>
        <span>
          <strong>Mundo Delas</strong>
          <small>Prazer com discricao</small>
        </span>
      </a>

      <nav class="header-nav" aria-label="Categorias principais">
        <button class="nav-link" data-category="Todos">Todos</button>
        <button class="nav-link" data-category="Vibradores">Vibradores</button>
        <button class="nav-link" data-category="Lubrificantes">Lubrificantes</button>
        <button class="nav-link" data-category="Acessorios">Acessorios</button>
      </nav>

      <button class="cart-button" data-open-cart type="button">
        <span>Carrinho</span>
        <strong data-cart-count>${cartCount}</strong>
      </button>
    </header>
  `
}
