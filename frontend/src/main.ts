import { AgeModal } from "./components/AgeModal"
import { CartSummary } from "./components/CartSummary"
import { HomePage } from "./pages/HomePage"
import { cartService } from "./services/cartService"
import { orderService } from "./services/orderService"
import { productService } from "./services/productService"
import { toastService } from "./services/toastService"
import { whatsappService } from "./services/whatsappService"
import { Product } from "./types/product"
import { storage } from "./utils/storage"
import "./styles/global.css"

const app = document.querySelector<HTMLDivElement>("#app")
const ageKey = "mundo-delas-age-confirmed"

type State = {
  products: Product[]
  search: string
  sort: string
  activeCategory: string
  cartOpen: boolean
}

const state: State = {
  products: [],
  search: "",
  sort: "popular",
  activeCategory: "Todos",
  cartOpen: false
}

function getFilteredProducts() {
  const search = state.search.trim().toLowerCase()

  return state.products
    .filter(product => state.activeCategory === "Todos" || product.category === state.activeCategory)
    .filter(product => product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search))
    .sort((a, b) => {
      if(state.sort === "price-asc") {
        return a.price - b.price
      }

      if(state.sort === "price-desc") {
        return b.price - a.price
      }

      return b.popularity - a.popularity
    })
}

function render() {
  if(!app) {
    return
  }

  const categories = ["Todos", ...new Set(state.products.map(product => product.category))]
  const cartItems = cartService.getItems()
  const showAgeModal = !storage.get(ageKey, false)

  app.innerHTML = `
    ${HomePage({
      products: getFilteredProducts(),
      categories,
      cartCount: cartService.count(),
      search: state.search,
      sort: state.sort,
      activeCategory: state.activeCategory
    })}
    ${CartSummary(cartItems)}
    ${AgeModal(showAgeModal)}
  `

  const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]")
  drawer?.setAttribute("aria-hidden", String(!state.cartOpen))
  drawer?.classList.toggle("open", state.cartOpen)
  bindEvents()
}

function bindEvents() {
  document.querySelectorAll<HTMLElement>("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category ?? "Todos"
      render()
    })
  })

  document.querySelector<HTMLInputElement>("[data-search]")?.addEventListener("input", event => {
    state.search = (event.target as HTMLInputElement).value
    render()
  })

  document.querySelector<HTMLSelectElement>("[data-sort]")?.addEventListener("change", event => {
    state.sort = (event.target as HTMLSelectElement).value
    render()
  })

  document.querySelectorAll<HTMLElement>("[data-open-cart]").forEach(button => {
    button.addEventListener("click", () => {
      state.cartOpen = true
      render()
    })
  })

  document.querySelectorAll<HTMLElement>("[data-close-cart]").forEach(button => {
    button.addEventListener("click", () => {
      state.cartOpen = false
      render()
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-add-cart]").forEach(button => {
    button.addEventListener("click", () => {
      const product = state.products.find(item => item.id === Number(button.dataset.addCart))

      if(!product) {
        toastService.error("Produto nao encontrado.")
        return
      }

      cartService.add(product)
      toastService.success("Produto adicionado ao carrinho")
      render()
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-increase]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.increase)
      const item = cartService.getItems().find(current => current.product.id === productId)

      if(item) {
        cartService.update(productId, item.quantity + 1)
        render()
      }
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-decrease]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.decrease)
      const item = cartService.getItems().find(current => current.product.id === productId)

      if(item) {
        cartService.update(productId, item.quantity - 1)
        render()
      }
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-remove-cart]").forEach(button => {
    button.addEventListener("click", () => {
      cartService.remove(Number(button.dataset.removeCart))
      toastService.info("Produto removido do carrinho")
      render()
    })
  })

  document.querySelector<HTMLButtonElement>("[data-checkout]")?.addEventListener("click", async () => {
    const items = cartService.getItems()

    if(items.length === 0) {
      toastService.error("Seu carrinho esta vazio.")
      return
    }

    try {
      await orderService.create({
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      })

      toastService.info("Redirecionando para o WhatsApp...")
      setTimeout(() => {
        whatsappService.redirect(items)
        cartService.clear()
      }, 500)
    } catch (error) {
      toastService.error(error instanceof Error ? error.message : "Falha ao finalizar pedido.")
    }
  })

  document.querySelector<HTMLButtonElement>("[data-confirm-age]")?.addEventListener("click", () => {
    storage.set(ageKey, true)
    render()
  })
}

async function bootstrap() {
  if(!app) {
    return
  }

  app.innerHTML = `<main class="loading-screen"><p class="eyebrow">Mundo Delas</p><h1>Carregando vitrine...</h1></main>`

  try {
    state.products = await productService.list()
  } catch (error) {
    toastService.error(error instanceof Error ? error.message : "Erro ao carregar produtos.")
  } finally {
    render()
  }
}

void bootstrap()
