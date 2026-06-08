function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const [key, ...val] = v.split('=');
    return key === name ? decodeURIComponent(val.join('=')) : r;
  }, '');
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

const CART_COOKIE = 'mailabom_cart';
const CART_DAYS   = 7;

function loadCart() {
  try {
    const raw = getCookie(CART_COOKIE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  setCookie(CART_COOKIE, JSON.stringify(cart), CART_DAYS);
}

function addToCart(item) {
  const cart     = loadCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += item.qty ?? 1;
  } else {
    cart.push({ qty: 1, ...item });
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQty(id, delta) {
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  deleteCookie(CART_COOKIE);
  renderCart();
}

function renderCart() {
  const list  = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  if (!list) return;

  const cart = loadCart();
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    if (total) total.textContent = '0.00';
    return;
  }

  let sum = 0;
  cart.forEach(item => {
    sum += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <span class="cart-name">${item.name}</span>
      <span class="cart-price">$${(item.price * item.qty).toFixed(2)}</span>
      <div class="cart-qty">
        <button onclick="window.updateQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="window.updateQty(${item.id}, +1)">+</button>
      </div>
      <button class="cart-remove" onclick="window.removeFromCart(${item.id})">✕</button>
    `;
    list.appendChild(row);
  });

  if (total) total.textContent = sum.toFixed(2);
}

function handleOrder(e) {
  e.preventDefault();

  const cart = loadCart();
  if (cart.length === 0) {
    alert('Your cart is empty — add some items before ordering.');
    return;
  }

  const form = e.target;
  const order = {
    name:         form.querySelector('input[type="text"]').value,
    phone:        form.querySelector('input[type="tel"]').value,
    instructions: form.querySelectorAll('input[type="text"]')[1]?.value || '',
    delivery:     form.querySelector('select').value,
    address:      form.querySelectorAll('input[type="text"]')[2]?.value || '',
    payment:      form.querySelector('input[name="payment"]:checked')?.value,
    register:     form.querySelector('input[name="register"]').checked,
    no_call:      form.querySelector('input[name="no_call"]').checked,
    items:        cart,
  };

  console.log('Order submitted:', order);
  alert('Order sent! Thank you.');
  clearCart();
  form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const form = document.querySelector('form');
  if (form) form.addEventListener('submit', handleOrder);
});

window.addToCart      = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty      = updateQty;
window.clearCart      = clearCart;
export default { addToCart, removeFromCart, updateQty, clearCart, loadCart, saveCart, renderCart };
