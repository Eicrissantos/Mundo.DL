import { Router } from "express"
import { orderController } from "../controllers/orderController.js"

export const orderRoutes = Router()

orderRoutes.post("/", orderController.create)
orderRoutes.get("/track/:identifier", orderController.track)
orderRoutes.get("/:id", orderController.show)
