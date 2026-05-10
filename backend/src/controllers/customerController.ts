import { Request, Response } from "express"
import { customerService } from "../services/customerService.js"

export const customerController = {
  async create(request: Request, response: Response) {
    try {
      const customer = await customerService.create(request.body)
      response.status(201).json(customer)
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Não foi possível cadastrar cliente."
      })
    }
  },

  async login(request: Request, response: Response) {
    try {
      const session = await customerService.login(request.body)
      response.json(session)
    } catch (error) {
      response.status(401).json({
        message: error instanceof Error ? error.message : "Não foi possível entrar."
      })
    }
  },

  async list(_request: Request, response: Response) {
    const customers = await customerService.list()
    response.json(customers)
  },

  async show(request: Request, response: Response) {
    const customer = await customerService.findById(Number(request.params.id))

    if(!customer) {
      response.status(404).json({ message: "Cliente não encontrado." })
      return
    }

    response.json(customer)
  },

  async orders(request: Request, response: Response) {
    const customer = await customerService.findById(Number(request.params.id))

    if(!customer) {
      response.status(404).json({ message: "Cliente não encontrado." })
      return
    }

    const orders = await customerService.listOrders(Number(request.params.id))
    response.json(orders)
  }
}
