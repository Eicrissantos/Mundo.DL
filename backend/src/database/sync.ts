import { sequelize } from "./connection.js"
import { ensureDatabase } from "./ensureDatabase.js"
import { seedProducts } from "./seed.js"
import "../models/index.js"

await ensureDatabase()
await sequelize.authenticate()
await sequelize.sync({ alter: true })
await seedProducts()

console.log("Banco sincronizado com sucesso.")
await sequelize.close()
