import { Request, Response } from "express"
import { orderService } from "../services/orderService.js"

export const orderController = {
  async create(request: Request, response: Response) {
    try {
      const order = await orderService.create(request.body.items ?? [])
      response.status(201).json(order)
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Nao foi possivel criar o pedido."
      })
    }
  }
}
