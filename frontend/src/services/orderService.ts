import { storeConfig } from "../config/store"
import { OrderPayload } from "../types/order"

export const orderService = {
  async create(payload: OrderPayload) {
    const response = await fetch(`${storeConfig.apiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Nao foi possivel criar o pedido.")
    }

    return response.json()
  }
}
