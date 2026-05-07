import { Request, Response } from "express"
import { productService } from "../services/productService.js"

export const productController = {
  async list(_request: Request, response: Response) {
    const products = await productService.list()
    response.json(products)
  },

  async show(request: Request, response: Response) {
    const product = await productService.findById(Number(request.params.id))

    if(!product) {
      response.status(404).json({ message: "Produto nao encontrado." })
      return
    }

    response.json(product)
  },

  async create(request: Request, response: Response) {
    const product = await productService.create(request.body)
    response.status(201).json(product)
  },

  async update(request: Request, response: Response) {
    const product = await productService.update(Number(request.params.id), request.body)

    if(!product) {
      response.status(404).json({ message: "Produto nao encontrado." })
      return
    }

    response.json(product)
  },

  async remove(request: Request, response: Response) {
    const removed = await productService.remove(Number(request.params.id))

    if(!removed) {
      response.status(404).json({ message: "Produto nao encontrado." })
      return
    }

    response.status(204).send()
  }
}
