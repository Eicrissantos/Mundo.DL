type ToastType = "success" | "error" | "info"

const autoClose = 2200

function getContainer() {
  let container = document.querySelector<HTMLDivElement>("[data-toast-container]")

  if(!container) {
    container = document.createElement("div")
    container.dataset.toastContainer = "true"
    container.className = "toast-container"
    document.body.appendChild(container)
  }

  return container
}

function show(message: string, type: ToastType) {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message

  getContainer().appendChild(toast)

  setTimeout(() => {
    toast.classList.add("toast-leaving")
    toast.addEventListener("transitionend", () => toast.remove(), { once: true })
  }, autoClose)
}

export const toastService = {
  success: (message: string) => show(message, "success"),
  error: (message: string) => show(message, "error"),
  info: (message: string) => show(message, "info")
}
