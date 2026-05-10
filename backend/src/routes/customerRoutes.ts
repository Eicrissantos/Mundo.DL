import { Router } from "express"
import { customerController } from "../controllers/customerController.js"

export const customerRoutes = Router()

customerRoutes.get("/", customerController.list)
customerRoutes.get("/:id/orders", customerController.orders)
customerRoutes.get("/:id", customerController.show)
customerRoutes.post("/", customerController.create)
customerRoutes.post("/login", customerController.login)
