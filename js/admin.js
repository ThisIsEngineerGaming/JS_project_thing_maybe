const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const LS_KEY = "adminProducts";

const CATEGORIES = {
  1: "Food",
  2: "Dairy",
  3: "Beverages",
  4: "Snacks",
};

const MANUFACTURERS = {
  1: "Oil Company",
  2: "Dairy Fresh Co.",
  3: "Nature's Best",
  4: "Pantry Staples",
  5: "Gourmet Picks",
};

let products = [];

const loginScreen    = document.getElementById("loginScreen");
const adminPanel     = document.getElementById("adminPanel");
const loginError     = document.getElementById("loginError");
const usernameInput  = document.getElementById("usernameInput");
const passwordInput  = document.getElementById("passwordInput");
const loginBtn       = document.getElementById("loginBtn");
const logoutBtn      = document.getElementById("logoutBtn");
const addForm        = document.getElementById("addForm");
const addError       = document.getElementById("addError");
const tableBody      = document.getElementById("productTableBody");
const productCount   = document.getElementById("productCount");
const saveBtn        = document.getElementById("saveBtn");
const saveStatus     = document.getElementById("saveStatus");

// Populates the category and manufacturer <select> dropdowns in the add-product form
// using the CATEGORIES and MANUFACTURERS lookup objects
function populateDropdowns() {
  const catSelect = document.getElementById("f-category");
  const mfrSelect = document.getElementById("f-manufacturer");

  Object.entries(CATEGORIES).forEach(([id, name]) => {
    const opt = document.createElement("option");
    opt.value       = id;
    opt.textContent = name;
    catSelect.appendChild(opt);
  });

  Object.entries(MANUFACTURERS).forEach(([id, name]) => {
    const opt = document.createElement("option");
    opt.value       = id;
    opt.textContent = name;
    mfrSelect.appendChild(opt);
  });
}

// Hides the login screen and shows the admin panel
function showPanel() {
  loginScreen.style.display = "none";
  adminPanel.style.display  = "block";
}

// Hides the admin panel and shows the login screen
function showLogin() {
  loginScreen.style.display = "flex";
  adminPanel.style.display  = "none";
}

// Checks entered credentials against the hardcoded admin user/pass;
// shows the panel and loads products on success, or shows an error on failure
loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    loginError.style.display = "none";
    showPanel();
    loadProducts();
  } else {
    loginError.style.display = "block";
    passwordInput.value = "";
  }
});

// Allow logging in by pressing Enter in either the username or password field
[usernameInput, passwordInput].forEach(el => {
  el.addEventListener("keydown", e => {
    if (e.key === "Enter") loginBtn.click();
  });
});

// Clears the login fields and returns to the login screen on logout
logoutBtn.addEventListener("click", () => {
  usernameInput.value = "";
  passwordInput.value = "";
  showLogin();
});

// Fetches the product list from the API (falls back to products.json if the server is down),
// stores it in the products array, seeds the next ID counter, and renders the table
function loadProducts() {
  fetch("/api/products")
    .then(r => r.json())
    .then(data => {
      products = data;
      localStorage.removeItem(LS_KEY);
      window._nextId = products.reduce((m, p) => Math.max(m, p.id), -1) + 1;
      renderTable();
    })
    .catch(() => {
      fetch("/json/products.json")
        .then(r => r.json())
        .then(data => {
          products = data;
          window._nextId = products.reduce((m, p) => Math.max(m, p.id), -1) + 1;
          renderTable();
          setStatus("⚠ API server not running. Changes won't be saved to file.", "warn");
        });
    });
}

// Clears and rebuilds the product table from the current products array;
// shows a placeholder row when there are no products
function renderTable() {
  tableBody.innerHTML = "";
  productCount.textContent = products.length;

  if (products.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="9" style="text-align:center;color:#aaa;padding:24px;">No products yet.</td>`;
    tableBody.appendChild(tr);
    return;
  }

  products.forEach(p => {
    const categoryName     = CATEGORIES[p.categoryId]     || `ID ${p.categoryId}`;
    const manufacturerName = MANUFACTURERS[p.manufacturerId] || `ID ${p.manufacturerId}`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img class="thumb" src="${escHtml(p.imageUrl)}" alt="" onerror="this.src='https://placehold.co/48x48?text=?'" /></td>
      <td>${escHtml(p.name)}</td>
      <td>${p.price}</td>
      <td>${p.discountedPrice}</td>
      <td>${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)}</td>
      <td>${escHtml(categoryName)}</td>
      <td>${escHtml(manufacturerName)}</td>
      <td><button class="btn-remove" data-id="${p.id}">Remove</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// Handles clicks on any "Remove" button in the table via event delegation;
// confirms with the user, removes the product from the array, re-renders, and saves to the server
tableBody.addEventListener("click", e => {
  const btn = e.target.closest(".btn-remove");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!confirm(`Remove product #${id}?`)) return;

  products = products.filter(p => p.id !== id);
  renderTable();
  saveToServer();
});

// Handles the add-product form submission: validates all fields, builds a new product object,
// pushes it to the products array, re-renders the table, and saves to the server
addForm.addEventListener("submit", () => {
  const name           = document.getElementById("f-name").value.trim();
  const imageUrl       = document.getElementById("f-image").value.trim();
  const price          = parseFloat(document.getElementById("f-price").value);
  const discounted     = parseFloat(document.getElementById("f-discounted").value);
  const rating         = parseInt(document.getElementById("f-rating").value, 10);
  const categoryId     = parseInt(document.getElementById("f-category").value, 10);
  const manufacturerId = parseInt(document.getElementById("f-manufacturer").value, 10);

  if (!name || !imageUrl) {
    showAddError("Name and Image URL are required.");
    return;
  }
  if (isNaN(price) || isNaN(discounted) || isNaN(rating)) {
    showAddError("Please fill in all numeric fields correctly.");
    return;
  }
  if (rating < 1 || rating > 5) {
    showAddError("Rating must be between 1 and 5.");
    return;
  }
  if (discounted > price) {
    showAddError("Discounted price cannot be higher than the original price.");
    return;
  }

  addError.style.display = "none";

  const newProduct = {
    id: window._nextId++,
    imageUrl,
    name,
    rating,
    price,
    discountedPrice: discounted,
    categoryId,
    manufacturerId,
  };

  products.push(newProduct);
  renderTable();
  addForm.reset();
  saveToServer();

  document.getElementById("productTable").scrollIntoView({ behavior: "smooth" });
});

// Displays an error message inside the add-product form
function showAddError(msg) {
  addError.textContent = msg;
  addError.style.display = "block";
}

// POSTs the full products array to /api/products to overwrite products.json on the server,
// then updates the save-status indicator based on the result
function saveToServer() {
  setStatus("Saving...", "saving");

  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setStatus(`✓ Saved — ${data.count} products written to products.json`, "ok");
      } else {
        setStatus("✗ Server returned an error: " + (data.error || "unknown"), "error");
      }
    })
    .catch(() => {
      setStatus("✗ Could not reach the API server. Is it running? (npm run server)", "error");
    });
}

// Trigger a manual save when the Save button is clicked
saveBtn.addEventListener("click", saveToServer);

// Updates the #saveStatus element with a message and a CSS modifier class;
// auto-hides the element after 4 seconds for "ok" status
function setStatus(msg, type) {
  saveStatus.textContent = msg;
  saveStatus.className   = "save-status save-status--" + type;
  saveStatus.style.display = "block";

  if (type === "ok") {
    setTimeout(() => { saveStatus.style.display = "none"; }, 4000);
  }
}

// Escapes special HTML characters in a string to prevent XSS when injecting into innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

populateDropdowns();
