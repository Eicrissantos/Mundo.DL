// Função para inicializar quando o DOM estiver pronto
function initPage() {
  console.log('Inicializando página...')
  console.log('Produtos disponíveis:', products ? products.length : 0)
  console.log('CartManager disponível:', typeof CartManager !== 'undefined')
  
  const container = document.getElementById('products')
  if(container && products && products.length > 0) {
    renderProducts(products)
    updateCart()
    console.log('Página inicializada com sucesso')
  } else {
    console.error('Erro: Elementos ou dados não disponíveis')
  }
}

function renderProducts(list){
  const container = document.getElementById("products")
  if(!container) {
    console.error('Container #products não encontrado')
    return
  }
  container.innerHTML = ""

  list.forEach(product => {
    let stars = "⭐".repeat(product.rating)

    container.innerHTML += `
      <div class="product-card">
        ${product.promo ? "<span>🔥 Promoção</span>" : ""}
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${stars}</p>
        <p>R$ ${product.price.toFixed(2)}</p>
        <input type="number" value="1" min="1" id="qty-${product.id}">
        <button onclick="addToCart(${product.id})">Comprar</button>
      </div>
    `
  })
}

function searchProduct(){
  const value = document.getElementById("search").value.toLowerCase()
  const filtered = products.filter(p => p.name.toLowerCase().includes(value))
  renderProducts(filtered)
}

function filterCategory(category){
  const filtered = products.filter(p => p.category === category)
  renderProducts(filtered)
}

function addToCart(id){
  console.log('Adicionando produto ao carrinho:', id)
  
  const qtyInput = document.getElementById(`qty-${id}`)
  const qty = qtyInput ? Number(qtyInput.value) : 1

  const product = products.find(p => p.id === id)
  if(!product) {
    ToastService.error("Produto não encontrado")
    console.error('Produto não encontrado:', id)
    return
  }

  console.log('Produto encontrado:', product.name)
  CartManager.addItem(product, qty)
  updateCart()
  ToastService.success("Produto adicionado ao carrinho 🛒")
}

function updateCart(){
  const cartCount = document.getElementById("cart-count")
  if(cartCount) {
    cartCount.innerText = CartManager.getTotal()
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage)
} else {
  // DOM já está pronto
  setTimeout(initPage, 100)
}

window.addEventListener('load', initPage)
