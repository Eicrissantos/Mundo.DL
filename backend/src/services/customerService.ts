import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { Customer, Order, OrderItem, Product } from "../models/index.js"

type CustomerPayload = {
  name: string
  email: string
  phone: string
  deliveryAddress?: string
  location?: string
  paymentPreference?: string
  password?: string
  passwordHash?: string
}

type LoginPayload = {
  email: string
  password: string
}

function validateCustomer(payload: CustomerPayload) {
  if(!payload.name || payload.name.trim().length < 2) {
    throw new Error("Nome do cliente é obrigatório.")
  }

  if(!payload.email || !payload.email.includes("@")) {
    throw new Error("E-mail inválido.")
  }

  if(!payload.phone || payload.phone.replace(/\D/g, "").length < 10) {
    throw new Error("Telefone inválido.")
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `scrypt:${salt}:${hash}`
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":")

  if(algorithm === "scrypt" && salt && hash) {
    const hashBuffer = Buffer.from(hash, "hex")
    const inputBuffer = scryptSync(password, salt, 64)
    return hashBuffer.length === inputBuffer.length && timingSafeEqual(hashBuffer, inputBuffer)
  }

  if(algorithm === "prepared") {
    return storedHash === `prepared:${password}`
  }

  return false
}

function validatePassword(password?: string) {
  if(!password || password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.")
  }
}

function sanitizeCustomer(customer: Customer) {
  const result = customer.toJSON() as Record<string, unknown>
  delete result.passwordHash
  return result
}

function optionalText(value?: string) {
  const text = String(value ?? "").trim()
  return text.length > 0 ? text : null
}

export const customerService = {
  async create(payload: CustomerPayload) {
    validateCustomer(payload)
    validatePassword(payload.password)

    const email = payload.email.trim().toLowerCase()
    const existing = await Customer.findOne({ where: { email } })

    if(existing) {
      throw new Error("Já existe um cliente cadastrado com este e-mail.")
    }

    const customer = await Customer.create({
      name: payload.name.trim(),
      email,
      phone: payload.phone.trim(),
      deliveryAddress: optionalText(payload.deliveryAddress),
      location: optionalText(payload.location),
      paymentPreference: optionalText(payload.paymentPreference),
      passwordHash: hashPassword(payload.password ?? "")
    })

    return sanitizeCustomer(customer)
  },

  async login(payload: LoginPayload) {
    const email = String(payload.email ?? "").trim().toLowerCase()
    const password = String(payload.password ?? "")

    if(!email || !password) {
      throw new Error("Informe e-mail e senha.")
    }

    const customer = await Customer.unscoped().findOne({ where: { email } })

    if(!customer || !verifyPassword(password, customer.passwordHash)) {
      throw new Error("E-mail ou senha inválidos.")
    }

    if(customer.passwordHash.startsWith("prepared:")) {
      customer.passwordHash = hashPassword(password)
      await customer.save()
    }

    return {
      customer: sanitizeCustomer(customer),
      token: randomBytes(32).toString("hex")
    }
  },

  async list() {
    return Customer.findAll({ order: [["createdAt", "DESC"]] })
  },

  async findById(id: number) {
    return Customer.findByPk(id)
  },

  async listOrders(customerId: number) {
    return Order.findAll({
      where: { customerId },
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }
      ],
      order: [["created_at", "DESC"]]
    })
  }
}
