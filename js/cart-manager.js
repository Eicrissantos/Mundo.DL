// Gerenciador centralizado do carrinho
const CartManager = {
  getCart() {
    return JSON.parse(localStorage.getItem("cart")) || []
  },

  setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
  },

  addItem(product, qty = 1) {
    const cart = this.getCart()
    const existing = cart.find(p => p.id === product.id)

    if(existing) {
      existing.qty += qty
    } else {
      cart.push({...product, qty})
    }

    this.setCart(cart)
    return cart
  },

  removeItem(index) {
    const cart = this.getCart()
    cart.splice(index, 1)
    this.setCart(cart)
    return cart
  },

  clearCart() {
    localStorage.removeItem("cart")
  },

  getTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.qty, 0)
  },

  getTotalPrice() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + (item.price * item.qty), 0)
  }
}
