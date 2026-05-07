import { storeConfig } from "../config/store"

export type CustomerPayload = {
  name: string
  email: string
  phone: string
  password: string
}

export const customerService = {
  async create(payload: CustomerPayload) {
    const response = await fetch(`${storeConfig.apiUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Nao foi possivel cadastrar cliente.")
    }

    return response.json()
  }
}
