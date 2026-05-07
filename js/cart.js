function initCart() {
  console.log('Inicializando carrinho...')
  renderCart()
}

function renderCart(){
  const cartItems = document.getElementById("cart-items")
  const totalElement = document.getElementById("total")

  if(!cartItems || !totalElement) {
    console.error('Elementos do carrinho não encontrados')
    return
  }

  const cart = CartManager.getCart()
  console.log('Carrinho carregado:', cart.length, 'itens')
  
  cartItems.innerHTML = ""

  if(cart.length === 0){
    cartItems.innerHTML = "<p>Seu carrinho está vazio</p>"
    totalElement.innerText = ""
    return
  }

  let total = 0

  cart.forEach((item, index) => {
    total += item.price * item.qty

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" style="width:100px; height:100px; object-fit:cover;">
        <h3>${item.name}</h3>
        <p>Quantidade: ${item.qty}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
        <button onclick="removeItem(${index})">Remover</button>
      </div>
    `
  })

  totalElement.innerText = "Total: R$ " + total.toFixed(2)
}

function removeItem(index){
  if(confirm("Remover produto?")){
    CartManager.removeItem(index)
    renderCart()
  }
}

function checkout(){
  const cart = CartManager.getCart()
  if(cart.length === 0){
    ToastService.error("Seu carrinho está vazio")
    return
  }

  // Usar número do WhatsApp da configuração
  const whatsappNumber = LOJA_CONFIG.whatsapp

  // Montar mensagem com detalhes do pedido
  let mensagem = "🛍️ *NOVO PEDIDO - " + LOJA_CONFIG.nome + "*\n\n"
  mensagem += "📦 *Produtos:*\n"
  
  let total = 0
  cart.forEach((item) => {
    const subtotal = item.price * item.qty
    total += subtotal
    mensagem += `• ${item.name}\n`
    mensagem += `  Qtd: ${item.qty} x R$ ${item.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n\n`
  })
  
  mensagem += `💰 *Total: R$ ${total.toFixed(2)}*\n\n`
  mensagem += `📝 Por favor, confirmar disponibilidade e forma de pagamento.\n`
  mensagem += `📍 Obrigado por comprar conosco!`

  // Codificar mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem)
  
  // Limpar o carrinho
  CartManager.clearCart()
  
  // Redirecionar para WhatsApp
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`
  ToastService.info("Redirecionando para o WhatsApp...")
  setTimeout(() => {
    window.location.href = urlWhatsApp
  }, 500)
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart)
} else {
  setTimeout(initCart, 100)
}

window.addEventListener('load', initCart)
