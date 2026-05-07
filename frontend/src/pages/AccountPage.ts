export function AccountPage() {
  return `
    <main>
      <section class="page-hero compact-hero">
        <p class="eyebrow">Cliente</p>
        <h1>Minha conta</h1>
        <p>Base preparada para cadastro, login e futura autenticacao segura.</p>
      </section>

      <section class="account-layout">
        <form class="account-card" data-customer-form>
          <p class="eyebrow">Cadastro</p>
          <h2>Criar acesso</h2>
          <label>Nome completo<input name="name" required minlength="2" /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>WhatsApp<input name="phone" required /></label>
          <label>Senha<input name="password" type="password" required minlength="6" /></label>
          <button class="primary-button" type="submit">Cadastrar cliente</button>
        </form>

        <form class="account-card">
          <p class="eyebrow">Login futuro</p>
          <h2>Entrar</h2>
          <label>Email<input type="email" placeholder="seu@email.com" /></label>
          <label>Senha<input type="password" placeholder="••••••••" /></label>
          <button class="secondary-button" type="button">Estrutura preparada</button>
          <p class="muted-text">A autenticacao JWT ainda nao foi ativada, mas a tela e o backend de clientes ja estao prontos para evoluir.</p>
        </form>
      </section>
    </main>
  `
}
