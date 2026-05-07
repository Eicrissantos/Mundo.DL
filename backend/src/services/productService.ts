import { Product } from "../models/index.js"

type ProductPayload = {
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  popularity?: number
}

export const productService = {
  async list() {
    return Product.findAll({ order: [["createdAt", "DESC"]] })
  },

  async findById(id: number) {
    return Product.findByPk(id)
  },

  async create(payload: ProductPayload) {
    return Product.create({
      ...payload,
      popularity: payload.popularity ?? 1
    })
  },

  async update(id: number, payload: Partial<ProductPayload>) {
    const product = await Product.findByPk(id)

    if(!product) {
      return null
    }

    await product.update(payload)
    return product
  },

  async remove(id: number) {
    const product = await Product.findByPk(id)

    if(!product) {
      return false
    }

    await product.destroy()
    return true
  }
}
