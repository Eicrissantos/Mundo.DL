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
import { CustomerSession, customerService } from "./services/customerService"
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
const sessionKey = "mundo-delas-customer-session"
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
  session: CustomerSession | null
  customerOrders: OrderResponse[]
  selectedProductId: number | null
}

const state: State = {
  products: [],
  search: "",
  sort: "popular",
  activeCategory: "Todos",
  cartOpen: false,
  route: getRoute(),
  trackQuery: "",
  trackResult: null,
  session: storage.get<CustomerSession | null>(sessionKey, null),
  customerOrders: [],
  selectedProductId: null
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
      wishedIds,
      selectedProduct: state.products.find(product => product.id === state.selectedProductId) ?? null
    })
  }

  if(state.route === "account") {
    return AccountPage({ session: state.session, orders: state.customerOrders })
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
      activeRoute: state.route,
      products: state.products
    })}
    ${getPage()}
    ${Footer()}
    <button class="floating-whatsapp" data-store-whatsapp type="button" aria-label="Falar no WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.1 4.9A9.8 9.8 0 0 0 3.7 16.7L2.4 22l5.4-1.4A9.8 9.8 0 0 0 19.1 4.9Zm-7.3 14.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3a8 8 0 1 1 7.1 4Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.2-.5-.3Z"/></svg>
    </button>
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
        toastService.error("Produto não encontrado.")
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
        toastService.error("Produto não encontrado.")
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

  document.querySelectorAll<HTMLButtonElement>("[data-view-product]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedProductId = Number(button.dataset.viewProduct)
      state.route = "products"
      window.location.hash = "#/products"
      render()
      document.querySelector("#product-detail")?.scrollIntoView({ behavior: "smooth", block: "start" })
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
      toastService.error("Seu carrinho está vazio.")
      return
    }

    const whatsappWindow = window.open("about:blank", "_blank")

    try {
      const order = await orderService.create({
        customerId: state.session?.customer.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      })

      toastService.info(`Pedido #${order.id} criado. Redirecionando para o WhatsApp...`)
      cartService.clear()
      state.cartOpen = false
      setTimeout(() => {
        whatsappService.redirect(items, order.id, whatsappWindow)
        render()
      }, 500)
    } catch (error) {
      whatsappWindow?.close()
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

  document.querySelectorAll<HTMLButtonElement>("[data-menu-product]").forEach(button => {
    button.addEventListener("click", () => {
      const product = state.products.find(item => item.id === Number(button.dataset.menuProduct))

      if(!product) {
        return
      }

      state.route = "products"
      state.activeCategory = "Todos"
      state.search = product.name
      state.selectedProductId = product.id
      window.location.hash = "#/products"
      render()
      document.querySelector("#product-detail")?.scrollIntoView({ behavior: "smooth", block: "start" })
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
      const payload = {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        deliveryAddress: String(data.get("deliveryAddress") ?? ""),
        location: String(data.get("location") ?? ""),
        paymentPreference: String(data.get("paymentPreference") ?? ""),
        password: String(data.get("password") ?? "")
      }

      await customerService.create(payload)
      state.session = await customerService.login({
        email: payload.email,
        password: payload.password
      })
      storage.set(sessionKey, state.session)
      state.customerOrders = await loadCustomerOrders()
      toastService.success("Cadastro criado. Você já está conectado.")
      form.reset()
      render()
    } catch (error) {
      toastService.error(error instanceof Error ? error.message : "Não foi possível cadastrar.")
    }
  })

  document.querySelector<HTMLFormElement>("[data-login-form]")?.addEventListener("submit", async event => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)

    try {
      state.session = await customerService.login({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? "")
      })
      storage.set(sessionKey, state.session)
      state.customerOrders = await loadCustomerOrders()
      toastService.success("Login realizado com sucesso.")
      form.reset()
      render()
    } catch (error) {
      toastService.error(error instanceof Error ? error.message : "Não foi possível entrar.")
    }
  })

  document.querySelector<HTMLButtonElement>("[data-logout]")?.addEventListener("click", () => {
    state.session = null
    state.customerOrders = []
    storage.remove(sessionKey)
    toastService.info("Você saiu da conta.")
    render()
  })

  document.querySelector<HTMLFormElement>("[data-track-form]")?.addEventListener("submit", async event => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)
    const identifier = String(data.get("identifier") ?? "").trim()

    if(!identifier) {
      toastService.error("Informe o número do pedido.")
      return
    }

    try {
      state.trackQuery = identifier
      state.trackResult = await orderService.track(identifier)
      toastService.success("Pedido localizado.")
      render()
    } catch (error) {
      state.trackResult = null
      toastService.error(error instanceof Error ? error.message : "Pedido não encontrado.")
      render()
    }
  })

  document.querySelector<HTMLButtonElement>("[data-track-whatsapp]")?.addEventListener("click", () => {
    const input = document.querySelector<HTMLInputElement>("[name='identifier']")
    const identifier = input?.value.trim() || state.trackResult?.id || "não informado"
    whatsappService.trackOrder(identifier)
  })

  document.querySelector<HTMLButtonElement>("[data-confirm-age]")?.addEventListener("click", () => {
    storage.set(ageKey, true)
    render()
  })

  document.querySelectorAll<HTMLButtonElement>("[data-social-login]").forEach(button => {
    button.addEventListener("click", () => {
      toastService.info(`Login com ${button.dataset.socialLogin} preparado para integração futura.`)
    })
  })
}

function bindEvents() {
  bindProductEvents()
  bindCartEvents()
  bindPageEvents()
}

async function loadCustomerOrders() {
  if(!state.session) {
    return []
  }

  try {
    return await customerService.orders(state.session.customer.id)
  } catch {
    return []
  }
}

async function bootstrap() {
  if(!app) {
    return
  }

  app.innerHTML = `<main class="loading-screen"><p class="eyebrow">Mundo Delas</p><h1>Carregando experiência...</h1></main>`

  try {
    state.products = await productService.list()
    state.customerOrders = await loadCustomerOrders()
  } catch (error) {
    toastService.error(error instanceof Error ? error.message : "Erro ao carregar produtos.")
  } finally {
    render()
  }
}

window.addEventListener("hashchange", () => {
  state.route = getRoute()
  state.cartOpen = false
  if(state.route !== "products") {
    state.selectedProductId = null
  }
  render()
})

if(!window.location.hash) {
  window.location.hash = "#/home"
}

void bootstrap()
