import { CartItem } from "../types/cart"
import { Product } from "../types/product"
import { storage } from "../utils/storage"

const cartKey = "mundo-delas-cart"

export const cartService = {
  getItems(): CartItem[] {
    return storage.get<CartItem[]>(cartKey, [])
  },

  add(product: Product, quantity = 1) {
    const items = this.getItems()
    const existing = items.find(item => item.product.id === product.id)

    if(existing) {
      existing.quantity += quantity
    } else {
      items.push({ product, quantity })
    }

    storage.set(cartKey, items)
    return items
  },

  update(productId: number, quantity: number) {
    const items = this.getItems()
      .map(item => item.product.id === productId ? { ...item, quantity } : item)
      .filter(item => item.quantity > 0)

    storage.set(cartKey, items)
    return items
  },

  remove(productId: number) {
    const items = this.getItems().filter(item => item.product.id !== productId)
    storage.set(cartKey, items)
    return items
  },

  clear() {
    storage.remove(cartKey)
  },

  count() {
    return this.getItems().reduce((total, item) => total + item.quantity, 0)
  },

  total() {
    return this.getItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  }
}
