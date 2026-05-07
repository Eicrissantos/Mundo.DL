import { Customer } from "./Customer.js"
import { Order } from "./Order.js"
import { OrderItem } from "./OrderItem.js"
import { Product } from "./Product.js"

Customer.hasMany(Order, {
  foreignKey: "customerId",
  as: "orders"
})

Order.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer"
})

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items"
})

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order"
})

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems"
})

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
})

export { Customer, Order, OrderItem, Product }
