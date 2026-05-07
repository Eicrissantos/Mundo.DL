import dotenv from "dotenv"
import { Sequelize } from "sequelize"

dotenv.config()

export async function ensureDatabase() {
  const databaseName = process.env.DB_NAME ?? "mundo_delas"
  const serverConnection = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    logging: false
  })

  await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``)
  await serverConnection.close()
}
