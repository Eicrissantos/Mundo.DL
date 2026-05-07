import { sequelize } from "../database/connection.js"
import { Customer, Order, OrderItem, Product } from "../models/index.js"

type OrderItemPayload = {
  productId: number
  quantity: number
}

type CreateOrderPayload = {
  customerId?: number
  items: OrderItemPayload[]
}

function normalizeCreateInput(input: CreateOrderPayload | OrderItemPayload[]): CreateOrderPayload {
  if(Array.isArray(input)) {
    return { items: input }
  }

  return input
}

function validateItems(items: OrderItemPayload[]) {
  if(items.length === 0) {
    throw new Error("Pedido sem itens.")
  }

  items.forEach(item => {
    if(!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new Error("Produto invalido no pedido.")
    }

    if(!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantidade invalida no pedido.")
    }
  })
}

export const orderService = {
  async create(input: CreateOrderPayload | OrderItemPayload[]) {
    const payload = normalizeCreateInput(input)
    const items = payload.items ?? []
    validateItems(items)

    return sequelize.transaction(async transaction => {
      if(payload.customerId) {
        const customer = await Customer.findByPk(payload.customerId, { transaction })

        if(!customer) {
          throw new Error("Cliente nao encontrado.")
        }
      }

      const productIds = items.map(item => item.productId)
      const products = await Product.findAll({
        where: { id: productIds },
        transaction
      })

      if(products.length !== productIds.length) {
        throw new Error("Um ou mais produtos nao foram encontrados.")
      }

      let total = 0
      const orderItems = items.map(item => {
        const product = products.find(current => current.id === item.productId)

        if(!product) {
          throw new Error("Produto invalido.")
        }

        if(product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}.`)
        }

        const price = Number(product.price)
        total += price * item.quantity

        return {
          product,
          quantity: item.quantity,
          price
        }
      })

      const order = await Order.create(
        {
          customerId: payload.customerId ?? null,
          total,
          status: "pending",
          trackingCode: null,
          trackingMessage: "Pedido recebido e aguardando confirmacao."
        },
        { transaction }
      )

      await Promise.all(
        orderItems.map(item =>
          OrderItem.create(
            {
              orderId: Number(order.id),
              productId: Number(item.product.id),
              quantity: item.quantity,
              price: item.price
            },
            { transaction }
          )
        )
      )

      await Promise.all(
        orderItems.map(item =>
          item.product.decrement("stock", {
            by: item.quantity,
            transaction
          })
        )
      )

      return Order.findByPk(order.id, {
        include: [
          { model: Customer, as: "customer" },
          { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }
        ],
        transaction
      })
    })
  },

  async findById(id: number) {
    return Order.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }
      ]
    })
  },

  async track(identifier: string) {
    const trimmed = identifier.trim()
    const numericId = Number(trimmed.replace("#", ""))

    if(Number.isInteger(numericId) && numericId > 0) {
      return this.findById(numericId)
    }

    return Order.findOne({
      where: { trackingCode: trimmed },
      include: [
        { model: Customer, as: "customer" },
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }
      ]
    })
  }
}
