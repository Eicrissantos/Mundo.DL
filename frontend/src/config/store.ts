import { StoreConfig } from "../types/store"

export const storeConfig: StoreConfig = {
  name: "Mundo Delas",
  whatsapp: "5511999999999",
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000"
}
