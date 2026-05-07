export type OrderPayload = {
  items: Array<{
    productId: number
    quantity: number
  }>
}
