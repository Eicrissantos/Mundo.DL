const ToastService = (() => {
  let container = null

  function getContainer() {
    if(container) {
      return container
    }

    container = document.createElement("div")
    container.className = `toast-container ${TOAST_CONFIG.position} ${TOAST_CONFIG.theme}`
    container.setAttribute("aria-live", "polite")
    container.setAttribute("aria-atomic", "true")
    document.body.appendChild(container)

    return container
  }

  function show(message, type) {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    getContainer().appendChild(toast)

    setTimeout(() => {
      toast.classList.add("toast-leaving")
      toast.addEventListener("transitionend", () => toast.remove(), { once: true })
    }, TOAST_CONFIG.autoClose)
  }

  return {
    success(message) {
      show(message, "success")
    },

    error(message) {
      show(message, "error")
    },

    info(message) {
      show(message, "info")
    }
  }
})()
