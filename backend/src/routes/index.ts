import { Router } from "express"
import { orderRoutes } from "./orderRoutes.js"
import { productRoutes } from "./productRoutes.js"

export const routes = Router()

routes.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "mundo-delas-api" })
})

routes.use("/products", productRoutes)
routes.use("/orders", orderRoutes)
