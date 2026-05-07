import { storeConfig } from "../config/store"
import { Product } from "../types/product"

export const productService = {
  async list(): Promise<Product[]> {
    const response = await fetch(`${storeConfig.apiUrl}/products`)

    if(!response.ok) {
      throw new Error("Nao foi possivel carregar os produtos.")
    }

    const products = await response.json() as Product[]
    return products.map(product => ({
      ...product,
      price: Number(product.price)
    }))
  }
}
