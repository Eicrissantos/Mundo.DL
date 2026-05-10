import { storeConfig } from "../config/store"
import { OrderPayload, OrderResponse } from "../types/order"

export const orderService = {
  async create(payload: OrderPayload): Promise<OrderResponse> {
    const response = await fetch(`${storeConfig.apiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Não foi possível criar o pedido.")
    }

    return response.json()
  },

  async track(identifier: string): Promise<OrderResponse> {
    const response = await fetch(`${storeConfig.apiUrl}/orders/track/${encodeURIComponent(identifier)}`)

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Pedido não encontrado.")
    }

    return response.json()
  }
}
