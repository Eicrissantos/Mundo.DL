import dotenv from "dotenv"
import { Sequelize } from "sequelize"

dotenv.config()

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "mundo_delas",
  logging: false
})
