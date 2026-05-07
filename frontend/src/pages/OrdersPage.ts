export function OrdersPage() {
  return `
    <main>
      <section class="page-hero compact-hero">
        <p class="eyebrow">Historico</p>
        <h1>Meus pedidos</h1>
        <p>Area preparada para exibir pedidos vinculados ao cliente quando o login for ativado.</p>
      </section>

      <section class="empty-panel">
        <p class="eyebrow">Nenhum cliente logado</p>
        <h2>Entre ou crie sua conta para acompanhar seus pedidos.</h2>
        <p>Enquanto a autenticacao completa nao esta ativa, voce pode consultar um pedido especifico pela pagina de rastreamento.</p>
        <div class="hero-actions">
          <a class="primary-button" href="#/account">Minha conta</a>
          <a class="secondary-button" href="#/track">Rastrear pedido</a>
        </div>
      </section>
    </main>
  `
}
