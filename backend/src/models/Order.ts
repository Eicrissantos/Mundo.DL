import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "../database/connection.js"

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id?: number
  declare total: number
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
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
