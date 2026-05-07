import { storeConfig } from "../config/store"
import { CartItem } from "../types/cart"
import { formatCurrency } from "../utils/currency"

export const whatsappService = {
  buildMessage(items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const lines = items.flatMap(item => [
      `- ${item.product.name}`,
      `  Qtd: ${item.quantity} x ${formatCurrency(item.product.price)} = ${formatCurrency(item.product.price * item.quantity)}`
    ])

    return [
      `NOVO PEDIDO - ${storeConfig.name}`,
      "",
      "Produtos:",
      ...lines,
      "",
      `Total: ${formatCurrency(total)}`,
      "",
      "Por favor, confirme disponibilidade, pagamento e entrega discreta."
    ].join("\n")
  },

  redirect(items: CartItem[]) {
    const message = encodeURIComponent(this.buildMessage(items))
    window.location.href = `https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`
  },

  productQuestion(productName: string) {
    const message = encodeURIComponent(`Ola! Tenho uma duvida sobre o produto ${productName}. Poderia me ajudar?`)
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  },

  storeContact() {
    const message = encodeURIComponent("Ola! Gostaria de falar com a Mundo Delas e conhecer melhor a loja.")
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  },

  trackOrder(orderId: string | number) {
    const message = encodeURIComponent(`Ola! Gostaria de consultar o status do meu pedido numero #${orderId}.`)
    window.open(`https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${message}`, "_blank", "noopener")
  }
}
