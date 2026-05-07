import { AgeModal } from "./components/AgeModal"
import { CartSummary } from "./components/CartSummary"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { AccountPage } from "./pages/AccountPage"
import { HomePage } from "./pages/HomePage"
import { OrdersPage } from "./pages/OrdersPage"
import { ProductsPage } from "./pages/ProductsPage"
import { TrackPage } from "./pages/TrackPage"
import { WishlistPage } from "./pages/WishlistPage"
import { cartService } from "./services/cartService"
import { customerService } from "./services/customerService"
import { orderService } from "./services/orderService"
import { productService } from "./services/productService"
import { toastService } from "./services/toastService"
import { whatsappService } from "./services/whatsappService"
import { wishlistService } from "./services/wishlistService"
import { OrderResponse } from "./types/order"
import { Product } from "./types/product"
import { storage } from "./utils/storage"
import "./styles/global.css"

const app = document.querySelector<HTMLDivElement>("#app")
const ageKey = "mundo-delas-age-confirmed"
const validRoutes = new Set(["home", "products", "account", "orders", "track", "wishlist"])

type State = {
  products: Product[]
  search: string
  sort: string
  activeCategory: string
  cartOpen: boolean
  route: string
  trackQuery: string
  trackResult: OrderResponse | null
}

const state: State = {
  products: [],
  search: "",
  sort: "popular",
  activeCategory: "Todos",
  cartOpen: false,
  route: getRoute(),
  trackQuery: "",
  trackResult: null
}

function getRoute() {
  const route = window.location.hash.replace("#/", "").replace("#", "")
  return validRoutes.has(route) ? route : "home"
}

function getFilteredProducts() {
  const search = state.search.trim().toLowerCase()

  return [...state.products]
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

function getPage() {
  const wishedItems = wishlistService.getItems()
  const wishedIds = new Set(wishedItems.map(product => product.id))

  if(state.route === "products") {
    const categories = ["Todos", ...new Set(state.products.map(product => product.category))]

    return ProductsPage({
      products: getFilteredProducts(),
      categories,
      search: state.search,
      sort: state.sort,
      activeCategory: state.activeCategory,
      wishedIds
    })
  }

  if(state.route === "account") {
    return AccountPage()
  }

  if(state.route === "orders") {
    return OrdersPage()
  }

  if(state.route === "track") {
    return TrackPage({
      result: state.trackResult,
      query: state.trackQuery
    })
  }

  if(state.route === "wishlist") {
    return WishlistPage({ products: wishedItems })
  }

  return HomePage()
}

function render() {
  if(!app) {
    return
  }

  const cartItems = cartService.getItems()
  const wishlistCount = wishlistService.getItems().length
  const showAgeModal = !storage.get(ageKey, false)

  app.innerHTML = `
    ${Header({
      cartCount: cartService.count(),
      wishlistCount,
      activeRoute: state.route
    })}
    ${getPage()}
    ${Footer()}
    ${CartSummary(cartItems)}
    ${AgeModal(showAgeModal)}
  `

  const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]")
  drawer?.setAttribute("aria-hidden", String(!state.cartOpen))
  drawer?.classList.toggle("open", state.cartOpen)
  bindEvents()
}

function bindProductEvents() {
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

  document.querySelectorAll<HTMLButtonElement>("[data-toggle-wishlist]").forEach(button => {
    button.addEventListener("click", () => {
      const product = state.products.find(item => item.id === Number(button.dataset.toggleWishlist))

      if(!product) {
        toastService.error("Produto nao encontrado.")
        return
      }

      const wasWished = wishlistService.has(product.id)
      wishlistService.toggle(product)
      toastService.info(wasWished ? "Produto removido dos desejos" : "Produto salvo nos desejos")
      render()
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-remove-wishlist]").forEach(button => {
    button.addEventListener("click", () => {
      wishlistService.remove(Number(button.dataset.removeWishlist))
      toastService.info("Produto removido dos desejos")
      render()
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-product-whatsapp]").forEach(button => {
    button.addEventListener("click", () => {
      const product = state.products.find(item => item.id === Number(button.dataset.productWhatsapp))

      if(product) {
        whatsappService.productQuestion(product.name)
      }
    })
  })
}

function bindCartEvents() {
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
      const order = await orderService.create({
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      })

      toastService.info(`Pedido #${order.id} criado. Redirecionando para o WhatsApp...`)
      setTimeout(() => {
        whatsappService.redirect(items)
        cartService.clear()
      }, 500)
    } catch (error) {
      toastService.error(error instanceof Error ? error.message : "Falha ao finalizar pedido.")
    }
  })
}

function bindPageEvents() {
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

  document.querySelectorAll<HTMLElement>("[data-store-whatsapp]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault()
      whatsappService.storeContact()
    })
  })

  document.querySelector<HTMLButtonElement>("[data-location]")?.addEventListener("click", () => {
    window.open("https://www.google.com/maps/search/?api=1&query=Juquitiba%20SP", "_blank", "noopener")
  })

  document.querySelector<HTMLFormElement>("[data-customer-form]")?.addEventListener("submit", async event => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)

    try {
      await customerService.create({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        password: String(data.get("password") ?? "")
      })
      toastService.success("Cadastro preparado com sucesso.")
      form.reset()
    } catch (error) {
      toastService.error(error instanceof Error ? error.message : "Nao foi possivel cadastrar.")
    }
  })

  document.querySelector<HTMLFormElement>("[data-track-form]")?.addEventListener("submit", async event => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)
    const identifier = String(data.get("identifier") ?? "").trim()

    if(!identifier) {
      toastService.error("Informe o numero do pedido.")
      return
    }

    try {
      state.trackQuery = identifier
      state.trackResult = await orderService.track(identifier)
      toastService.success("Pedido localizado.")
      render()
    } catch (error) {
      state.trackResult = null
      toastService.error(error instanceof Error ? error.message : "Pedido nao encontrado.")
      render()
    }
  })

  document.querySelector<HTMLButtonElement>("[data-track-whatsapp]")?.addEventListener("click", () => {
    const input = document.querySelector<HTMLInputElement>("[name='identifier']")
    const identifier = input?.value.trim() || state.trackResult?.id || "nao informado"
    whatsappService.trackOrder(identifier)
  })

  document.querySelector<HTMLButtonElement>("[data-confirm-age]")?.addEventListener("click", () => {
    storage.set(ageKey, true)
    render()
  })
}

function bindEvents() {
  bindProductEvents()
  bindCartEvents()
  bindPageEvents()
}

async function bootstrap() {
  if(!app) {
    return
  }

  app.innerHTML = `<main class="loading-screen"><p class="eyebrow">Mundo Delas</p><h1>Carregando experiencia...</h1></main>`

  try {
    state.products = await productService.list()
  } catch (error) {
    toastService.error(error instanceof Error ? error.message : "Erro ao carregar produtos.")
  } finally {
    render()
  }
}

window.addEventListener("hashchange", () => {
  state.route = getRoute()
  state.cartOpen = false
  render()
})

if(!window.location.hash) {
  window.location.hash = "#/home"
}

void bootstrap()
