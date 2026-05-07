export function HomePage() {
  return `
    <main>
      <section class="hero-section institutional-hero">
        <div class="hero-copy">
          <p class="eyebrow">Mundo Delas</p>
          <h1>Beleza, autocuidado e produtos selecionados para voce</h1>
          <p>Uma experiencia de compra discreta, acolhedora e elegante para quem busca cosmeticos, acessorios e itens intimos com curadoria cuidadosa.</p>
          <div class="hero-actions">
            <a class="primary-button" href="#/products">Ver produtos</a>
            <button class="secondary-button" data-store-whatsapp type="button">Falar no WhatsApp</button>
            <a class="ghost-link" href="#about-store">Conheca a loja</a>
          </div>
        </div>
        <div class="trust-strip">
          <span>Entrega discreta</span>
          <span>Atendimento humano</span>
          <span>Curadoria premium</span>
        </div>
      </section>

      <section class="about-section" id="about-store">
        <div>
          <p class="eyebrow">Sobre a loja</p>
          <h2>Uma vitrine pensada para compra segura e sem constrangimento.</h2>
        </div>
        <p>A Mundo Delas combina beleza, autocuidado e produtos selecionados com atendimento proximo pelo WhatsApp. A loja nasce para tornar a jornada mais simples: voce escolhe, monta seu carrinho e recebe orientacao personalizada para finalizar com seguranca.</p>
      </section>

      <section class="feature-band">
        <article>
          <strong>01</strong>
          <h3>Produtos selecionados</h3>
          <p>Itens organizados por categoria, popularidade e disponibilidade.</p>
        </article>
        <article>
          <strong>02</strong>
          <h3>Compra discreta</h3>
          <p>Fluxo preparado para atendimento reservado e confirmacao pelo WhatsApp.</p>
        </article>
        <article>
          <strong>03</strong>
          <h3>Pedido acompanhado</h3>
          <p>Base pronta para status, rastreio e historico do cliente.</p>
        </article>
      </section>

      <section class="location-section">
        <div class="location-card">
          <p class="eyebrow">Localizacao</p>
          <h2>Juquitiba - SP</h2>
          <p>Atendimento regional com suporte online e encaminhamento discreto dos pedidos.</p>
          <button class="secondary-button" data-location type="button">Ver localizacao</button>
          <div class="mini-map" aria-hidden="true">
            <span></span>
            <strong>Juquitiba</strong>
          </div>
        </div>
      </section>
    </main>
  `
}
