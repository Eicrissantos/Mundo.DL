import { Request, Response } from "express"
import { orderService } from "../services/orderService.js"

export const orderController = {
  async create(request: Request, response: Response) {
    try {
      const order = await orderService.create({
        customerId: request.body.customerId,
        items: request.body.items ?? []
      })
      response.status(201).json(order)
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Nao foi possivel criar o pedido."
      })
    }
  },

  async show(request: Request, response: Response) {
    const order = await orderService.findById(Number(request.params.id))

    if(!order) {
      response.status(404).json({ message: "Pedido nao encontrado." })
      return
    }

    response.json(order)
  },

  async track(request: Request, response: Response) {
    const identifier = String(request.params.identifier ?? "")
    const order = await orderService.track(identifier)

    if(!order) {
      response.status(404).json({ message: "Pedido nao encontrado." })
      return
    }

    response.json(order)
  }
}
