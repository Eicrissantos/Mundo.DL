import dotenv from "dotenv"
import { app } from "./app.js"
import { sequelize } from "./database/connection.js"
import { ensureDatabase } from "./database/ensureDatabase.js"
import { seedProducts } from "./database/seed.js"
import "./models/index.js"

dotenv.config()

const port = Number(process.env.PORT ?? 3000)

async function bootstrap() {
  await ensureDatabase()
  await sequelize.authenticate()
  await sequelize.sync()
  await seedProducts()

  app.listen(port, () => {
    console.log(`API Mundo Delas rodando em http://localhost:${port}`)
  })
}

bootstrap().catch(error => {
  console.error("Erro ao iniciar API:", error)
  process.exit(1)
})
