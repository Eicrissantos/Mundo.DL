export type OrderPayload = {
  customerId?: number
  items: Array<{
    productId: number
    quantity: number
  }>
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "canceled"

export type OrderResponse = {
  id: number
  total: number
  status: OrderStatus
  trackingCode: string | null
  trackingMessage: string | null
  createdAt?: string
  created_at?: string
  items?: Array<{
    id: number
    quantity: number
    price: number
    product?: {
      id: number
      name: string
      image: string
    }
  }>
}
