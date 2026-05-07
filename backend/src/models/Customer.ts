import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "../database/connection.js"

export class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
  declare id?: number
  declare name: string
  declare email: string
  declare phone: string
  declare passwordHash: string
}

Customer.init(
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
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash"
    }
  },
  {
    sequelize,
    tableName: "customers",
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ["passwordHash"]
      }
    }
  }
)
