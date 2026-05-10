import { storeConfig } from "../config/store"
import { OrderResponse } from "../types/order"

export type CustomerPayload = {
  name: string
  email: string
  phone: string
  deliveryAddress: string
  location: string
  paymentPreference: string
  password: string
}

export type Customer = {
  id: number
  name: string
  email: string
  phone: string
  deliveryAddress?: string | null
  location?: string | null
  paymentPreference?: string | null
}

export type LoginPayload = {
  email: string
  password: string
}

export type CustomerSession = {
  customer: Customer
  token: string
}

export const customerService = {
  async create(payload: CustomerPayload): Promise<Customer> {
    const response = await fetch(`${storeConfig.apiUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Não foi possível cadastrar cliente.")
    }

    return response.json()
  },

  async login(payload: LoginPayload): Promise<CustomerSession> {
    const response = await fetch(`${storeConfig.apiUrl}/customers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Não foi possível entrar.")
    }

    return response.json()
  },

  async orders(customerId: number): Promise<OrderResponse[]> {
    const response = await fetch(`${storeConfig.apiUrl}/customers/${customerId}/orders`)

    if(!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? "Não foi possível carregar os pedidos.")
    }

    return response.json()
  }
}
