import { CustomerSession } from "../services/customerService"
import { OrderResponse } from "../types/order"
import { formatCurrency } from "../utils/currency"
import { escapeHtml } from "../utils/html"

type AccountPageProps = {
  session: CustomerSession | null
  orders: OrderResponse[]
}

function emptyText(value?: string | null) {
  return value && value.trim() ? escapeHtml(value) : "Não informado"
}

function OrderSummary(orders: OrderResponse[]) {
  if(orders.length === 0) {
    return `<p class="muted-text">Nenhum pedido vinculado a esta conta até agora.</p>`
  }

  return `
    <div class="account-orders">
      ${orders.slice(0, 4).map(order => `
        <article>
          <span>Pedido #${order.id}</span>
          <strong>${formatCurrency(Number(order.total))}</strong>
          <small>${escapeHtml(order.status)}</small>
        </article>
      `).join("")}
    </div>
  `
}

export function AccountPage({ session, orders }: AccountPageProps) {
  return `
    <main>
      <section class="page-hero compact-hero">
        <div class="hero-copy">
          <p class="eyebrow">Cliente</p>
          <h1>Minha conta</h1>
          <p>Base preparada para cadastro, login e futura autenticação segura.</p>
        </div>
        <figure class="hero-logo hero-logo-small" aria-label="Logo Mundo Delas">
          <img src="/assets/brand/logo.jpeg" alt="Mundo Delas" />
        </figure>
      </section>

      <section class="account-layout">
        ${session ? `
          <div class="account-card account-status profile-card">
            <p class="eyebrow">Cliente conectado</p>
            <h2>Olá, ${escapeHtml(session.customer.name)}</h2>
            <dl class="profile-list">
              <div><dt>Nome</dt><dd>${escapeHtml(session.customer.name)}</dd></div>
              <div><dt>Email</dt><dd>${escapeHtml(session.customer.email)}</dd></div>
              <div><dt>WhatsApp</dt><dd>${escapeHtml(session.customer.phone)}</dd></div>
              <div><dt>Endereço de entrega</dt><dd>${emptyText(session.customer.deliveryAddress)}</dd></div>
              <div><dt>Localização</dt><dd>${emptyText(session.customer.location)}</dd></div>
              <div><dt>Forma de pagamento</dt><dd>${emptyText(session.customer.paymentPreference)}</dd></div>
            </dl>
            <div>
              <p class="eyebrow">Histórico de pedidos</p>
              ${OrderSummary(orders)}
            </div>
            <button class="secondary-button" data-logout type="button">Sair da conta</button>
          </div>
        ` : `
          <form class="account-card" data-customer-form>
            <p class="eyebrow">Cadastro</p>
            <h2>Criar acesso</h2>
            <label>Nome completo<input name="name" required minlength="2" /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>WhatsApp<input name="phone" required /></label>
            <label>Senha<input name="password" type="password" required minlength="6" /></label>
            <label>Endereço de entrega<input name="deliveryAddress" placeholder="Rua, número e complemento" /></label>
            <label>Localização/bairro/cidade<input name="location" placeholder="Bairro - Cidade" /></label>
            <label>Forma de pagamento preferida
              <select name="paymentPreference">
                <option value="">Selecione</option>
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="A combinar">A combinar</option>
              </select>
            </label>
            <button class="primary-button" type="submit">Cadastrar cliente</button>
          </form>

          <form class="account-card" data-login-form>
            <p class="eyebrow">Login</p>
            <h2>Entrar</h2>
            <label>Email<input name="email" type="email" placeholder="seu@email.com" required /></label>
            <label>Senha<input name="password" type="password" placeholder="••••••••" required minlength="6" /></label>
            <button class="secondary-button" type="submit">Entrar na conta</button>
            <div class="social-login" aria-label="Outras opções de login">
              <button type="button" data-social-login="Google">
                <span class="social-icon google-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M21.8 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.5c-.2 1.4-1 2.5-2.1 3.2v2.7h3.4c2-1.8 3-4.5 3-7.9Z"/><path d="M12 22c2.8 0 5.1-.9 6.8-2.5l-3.4-2.7c-.9.6-2.1 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H2.8v2.8C4.5 19.7 8 22 12 22Z"/><path d="M6.3 13.6c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7H2.8A10 10 0 0 0 2 11.7c0 1.7.4 3.3 1.2 4.7l3.1-2.8Z"/><path d="M12 5.8c1.5 0 2.9.5 4 1.6l3-3A10 10 0 0 0 12 2C8 2 4.5 4.3 2.8 7l3.5 2.8C7.1 7.6 9.4 5.8 12 5.8Z"/></svg>
                </span>
                Google/Gmail
              </button>
              <button type="button" data-social-login="Facebook">
                <span class="social-icon facebook-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M14.1 8.3V6.8c0-.7.5-.9.9-.9h2.3V2.2L14.1 2c-3.6 0-4.4 2.1-4.4 4.4v1.9H6.8v4.1h2.9V22h4.4v-9.6h3.2l.5-4.1h-3.7Z"/></svg>
                </span>
                Facebook
              </button>
              <button type="button" data-social-login="WhatsApp">
                <span class="social-icon whatsapp-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M19.1 4.9A9.8 9.8 0 0 0 3.7 16.7L2.4 22l5.4-1.4A9.8 9.8 0 0 0 19.1 4.9Zm-7.3 14.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3a8 8 0 1 1 7.1 4Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.2-.5-.3Z"/></svg>
                </span>
                WhatsApp
              </button>
            </div>
            <p class="muted-text">Use o mesmo e-mail e senha cadastrados para acessar sua conta. Os botões sociais estão preparados para integração futura.</p>
          </form>
        `}
      </section>
    </main>
  `
}
