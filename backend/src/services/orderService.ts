import { sequelize } from "../database/connection.js"
import { Order, OrderItem, Product } from "../models/index.js"

type OrderItemPayload = {
  productId: number
  quantity: number
}

export const orderService = {
  async create(items: OrderItemPayload[]) {
    if(items.length === 0) {
      throw new Error("Pedido sem itens.")
    }

    return sequelize.transaction(async transaction => {
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

      const order = await Order.create({ total }, { transaction })

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
        include: [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }],
        transaction
      })
    })
  }
}
