import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "../database/connection.js"

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id?: number
  declare name: string
  declare description: string
  declare price: number
  declare image: string
  declare category: string
  declare stock: number
  declare popularity: number
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    popularity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    tableName: "products",
    underscored: true
  }
)