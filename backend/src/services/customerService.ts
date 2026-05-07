import { Customer } from "../models/index.js"

type CustomerPayload = {
  name: string
  email: string
  phone: string
  password?: string
  passwordHash?: string
}

function validateCustomer(payload: CustomerPayload) {
  if(!payload.name || payload.name.trim().length < 2) {
    throw new Error("Nome do cliente e obrigatorio.")
  }

  if(!payload.email || !payload.email.includes("@")) {
    throw new Error("Email invalido.")
  }

  if(!payload.phone || payload.phone.replace(/\D/g, "").length < 10) {
    throw new Error("Telefone invalido.")
  }
}

function createPreparedHash(payload: CustomerPayload) {
  const source = payload.passwordHash ?? payload.password ?? "auth-pendente"
  return `prepared:${source}`
}

export const customerService = {
  async create(payload: CustomerPayload) {
    validateCustomer(payload)

    const email = payload.email.trim().toLowerCase()
    const existing = await Customer.findOne({ where: { email } })

    if(existing) {
      throw new Error("Ja existe um cliente cadastrado com este email.")
    }

    return Customer.create({
      name: payload.name.trim(),
      email,
      phone: payload.phone.trim(),
      passwordHash: createPreparedHash(payload)
    })
  },

  async list() {
    return Customer.findAll({ order: [["createdAt", "DESC"]] })
  },

  async findById(id: number) {
    return Customer.findByPk(id)
  }
}
