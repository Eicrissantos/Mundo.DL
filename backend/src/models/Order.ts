import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "../database/connection.js"

export const orderStatuses = ["pending", "confirmed", "preparing", "shipped", "delivered", "canceled"] as const
export type OrderStatus = typeof orderStatuses[number]

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id?: number
  declare customerId?: number | null
  declare total: number
  declare status: OrderStatus
  declare trackingCode?: string | null
  declare trackingMessage?: string | null
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "customer_id"
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...orderStatuses),
      allowNull: false,
      defaultValue: "pending"
    },
    trackingCode: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: "tracking_code"
    },
    trackingMessage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "tracking_message"
    }
  },
  {
    sequelize,
    tableName: "orders",
    underscored: true,
    createdAt: "created_at",
    updatedAt: false
  }
)
