export function AgeModal(show: boolean) {
  if(!show) {
    return ""
  }

  return `
    <div class="age-modal" data-age-modal>
      <section class="age-card" role="dialog" aria-modal="true" aria-labelledby="age-title">
        <p class="eyebrow">Conteúdo adulto</p>
        <h2 id="age-title">Você tem 18 anos ou mais?</h2>
        <p>Esta loja é destinada exclusivamente a pessoas maiores de idade. A navegação continua somente após a confirmação.</p>
        <div class="age-actions">
          <button class="primary-button" data-confirm-age type="button">Tenho 18+</button>
          <a class="ghost-link" href="https://www.google.com">Sair</a>
        </div>
      </section>
    </div>
  `
}
