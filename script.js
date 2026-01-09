// ================== CARRINHO ==================
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsConteiner = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addrressIpunt = document.getElementById("address");
const addrressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir carrinho
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "flex";
  });
}

// Fechar carrinho
if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
  });
}

// Adicionar item
if (menu) {
  menu.addEventListener("click", (event) => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (!parentButton) return;

    const name = parentButton.dataset.name;
    const price = parseFloat(parentButton.dataset.price);
    addToCart(name, price);
  });
}

function addToCart(name, price) {
  const item = cart.find((i) => i.name === name);

  if (item) item.quantity++;
  else cart.push({ name, price, quantity: 1 });

  updateCartModal();
}

function updateCartModal() {
  cartItemsConteiner.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "flex justify-between mb-4 flex-col";
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Quantidade (${item.quantity})</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn text-red-500" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;
    cartItemsConteiner.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.textContent = cart.length;
}

if (cartItemsConteiner) {
  cartItemsConteiner.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-from-cart-btn")) {
      removeItemCart(e.target.dataset.name);
    }
  });
}

function removeItemCart(name) {
  const index = cart.findIndex((i) => i.name === name);
  if (index === -1) return;

  if (cart[index].quantity > 1) cart[index].quantity--;
  else cart.splice(index, 1);

  updateCartModal();
}

// Endereço
if (addrressIpunt) {
  addrressIpunt.addEventListener("input", () => {
    addrressIpunt.classList.remove("border-red-500");
    addrressWarn.classList.add("hidden");
  });
}

// Finalizar pedido
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!checkoutRestaurantOpen()) {
      Toastify({
        text: "Ops o restaurante está fechado!",
        duration: 3000,
        style: { background: "#ef4444" },
      }).showToast();
      return;
    }

    if (!cart.length) return;

    if (!addrressIpunt.value) {
      addrressWarn.classList.remove("hidden");
      addrressIpunt.classList.add("border-red-500");
      return;
    }

    const message = encodeURIComponent(
      cart.map((i) => `${i.name} (${i.quantity})`).join(" | ")
    );

    window.open(
      `https://wa.me/85992871308?text=${message} Endereço: ${addrressIpunt.value}`,
      "_blank"
    );

    cart = [];
    updateCartModal();
  });
}

// Horário funcionamento
function checkoutRestaurantOpen() {
  const h = new Date().getHours();
  return h >= 18 && h < 22;
}

const spanItem = document.getElementById("date-span");
if (spanItem) {
  spanItem.classList.toggle("bg-green-600", checkoutRestaurantOpen());
  spanItem.classList.toggle("bg-red-500", !checkoutRestaurantOpen());
}

// ================== MENU LATERAL ==================
const menuBtn = document.getElementById("menuBtn");
const menuModal = document.getElementById("menu-modal");
const closeMenu = document.getElementById("close-menu");

if (menuModal) menuModal.classList.add("hidden");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    menuModal.classList.remove("hidden");
  });
}

if (menuModal) {
  menuModal.addEventListener("click", (e) => {
    if (e.target === menuModal) menuModal.classList.add("hidden");
  });
}

if (closeMenu) {
  closeMenu.addEventListener("click", () => {
    menuModal.classList.add("hidden");
  });
}

// ================== LOGIN / ADMIN ==================
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const painelMenu = document.getElementById("admin-painel-menu");

function mostrarPainel() {
  if (painelMenu) painelMenu.classList.remove("hidden");
}

function esconderPainel() {
  if (painelMenu) painelMenu.classList.add("hidden");
}

// Login
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        senha: passwordInput.value,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        localStorage.setItem("token", data.token);
        mostrarPainel();
        alert("Acesso liberado 😎");
      })
      .catch((err) => {
        localStorage.removeItem("token");
        esconderPainel();
        alert(err.message || "Acesso negado");
      });
  });
}

// Manter login após refresh
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return esconderPainel();

  fetch("http://localhost:3000/admin", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      mostrarPainel();
    })
    .catch(() => {
      localStorage.removeItem("token");
      esconderPainel();
    });
});
