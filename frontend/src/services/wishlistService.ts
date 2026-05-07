import { Product } from "../types/product"
import { storage } from "../utils/storage"

const wishlistKey = "mundo-delas-wishlist"

export const wishlistService = {
  getItems(): Product[] {
    return storage.get<Product[]>(wishlistKey, [])
  },

  has(productId: number) {
    return this.getItems().some(product => product.id === productId)
  },

  toggle(product: Product) {
    const items = this.getItems()
    const exists = items.some(item => item.id === product.id)
    const nextItems = exists ? items.filter(item => item.id !== product.id) : [...items, product]

    storage.set(wishlistKey, nextItems)
    return nextItems
  },

  remove(productId: number) {
    const items = this.getItems().filter(product => product.id !== productId)
    storage.set(wishlistKey, items)
    return items
  }
}
