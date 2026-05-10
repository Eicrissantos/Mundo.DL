export function OrdersPage() {
  return `
    <main>
      <section class="page-hero compact-hero">
        <div class="hero-copy">
          <p class="eyebrow">Histórico</p>
          <h1>Meus pedidos</h1>
          <p>Área preparada para exibir pedidos vinculados ao cliente quando o login for ativado.</p>
        </div>
        <figure class="hero-logo hero-logo-small" aria-label="Logo Mundo Delas">
          <img src="/assets/brand/logo.jpeg" alt="Mundo Delas" />
        </figure>
      </section>

      <section class="empty-panel">
        <p class="eyebrow">Nenhum cliente logado</p>
        <h2>Entre ou crie sua conta para acompanhar seus pedidos.</h2>
        <p>Enquanto a autenticação completa não está ativa, você pode consultar um pedido específico pela página de rastreamento.</p>
        <div class="hero-actions">
          <a class="primary-button" href="#/account">Minha conta</a>
          <a class="secondary-button" href="#/track">Rastrear pedido</a>
        </div>
      </section>
    </main>
  `
}
