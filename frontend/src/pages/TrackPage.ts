import { OrderResponse } from "../types/order"
import { formatCurrency } from "../utils/currency"
import { escapeHtml } from "../utils/html"

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Em preparacao",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado"
}

type TrackPageProps = {
  result: OrderResponse | null
  query: string
}

export function TrackPage({ result, query }: TrackPageProps) {
  return `
    <main>
      <section class="page-hero compact-hero">
        <p class="eyebrow">Rastreamento</p>
        <h1>Rastrear pedido</h1>
        <p>Informe o numero ou codigo do pedido para consultar o status atual.</p>
      </section>

      <section class="tracking-layout">
        <form class="tracking-card" data-track-form>
          <label>Numero ou codigo do pedido<input name="identifier" value="${escapeHtml(query)}" placeholder="Ex: 12 ou MD-2026-001" required /></label>
          <button class="primary-button" type="submit">Consultar pedido</button>
          <button class="secondary-button" data-track-whatsapp type="button">Consultar pelo WhatsApp</button>
        </form>

        <div class="tracking-card result-card">
          ${result ? `
            <p class="eyebrow">Pedido #${result.id}</p>
            <h2>${statusLabels[result.status] ?? result.status}</h2>
            <p>${escapeHtml(result.trackingMessage ?? "Pedido localizado.")}</p>
            <div class="status-steps" data-status="${result.status}">
              ${["pending", "confirmed", "preparing", "shipped", "delivered"].map(status => `<span class="${status === result.status ? "current" : ""}">${statusLabels[status]}</span>`).join("")}
            </div>
            <strong>${formatCurrency(Number(result.total))}</strong>
          ` : `
            <p class="eyebrow">Aguardando consulta</p>
            <h2>O status aparecera aqui.</h2>
            <p>Use o numero retornado na finalizacao do pedido ou consulte pelo WhatsApp.</p>
          `}
        </div>
      </section>
    </main>
  `
}
