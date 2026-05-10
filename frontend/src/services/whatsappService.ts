import { storeConfig } from "../config/store"
import { CartItem } from "../types/cart"
import { formatCurrency } from "../utils/currency"

export const whatsappService = {
  buildMessage(items: CartItem[], orderId?: number) {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const lines = items.flatMap(item => [
      `- ${item.product.name}`,
      `  Qtd: ${item.quantity} x ${formatCurrency(item.product.price)} = ${formatCurrency(item.product.price * item.quantity)}`
    ])

    return [
      `NOVO PEDIDO - ${storeConfig.name}`,
      orderId ? `Pedido #${orderId}` : "",
      "",
      "Produtos:",
      ...lines,
      "",
      `Total: ${formatCurrency(total)}`,
      "",
      "Por favor, confirme disponibilidade, pagamento e entrega discreta."
    ].join("\n")
  },

  buildUrl(items: CartItem[], orderId?: number) {
    const message = encodeURIComponent(this.buildMessage(items, orderId))
    return `https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`
  },

  redirect(items: CartItem[], orderId?: number, targetWindow?: Window | null) {
    const url = this.buildUrl(items, orderId)

    if(targetWindow && !targetWindow.closed) {
      targetWindow.location.href = url
      return
    }

    window.location.href = url
  },

  productQuestion(productName: string) {
    const message = encodeURIComponent(`Olá! Tenho uma dúvida sobre o produto ${productName}. Poderia me ajudar?`)
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  },

  storeContact() {
    const message = encodeURIComponent("Olá! Gostaria de falar com a Mundo Delas e conhecer melhor a loja.")
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  },

  trackOrder(orderId: string | number) {
    const message = encodeURIComponent(`Olá! Gostaria de consultar o status do meu pedido número #${orderId}.`)
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  }
}
