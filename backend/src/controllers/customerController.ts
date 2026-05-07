import { Request, Response } from "express"
import { customerService } from "../services/customerService.js"

export const customerController = {
  async create(request: Request, response: Response) {
    try {
      const customer = await customerService.create(request.body)
      const result = customer.toJSON() as Record<string, unknown>
      delete result.passwordHash
      response.status(201).json(result)
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Nao foi possivel cadastrar cliente."
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
      response.status(404).json({ message: "Cliente nao encontrado." })
      return
    }

    response.json(customer)
  }
}
