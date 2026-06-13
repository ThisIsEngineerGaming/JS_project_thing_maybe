import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

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
const saveStatus     = document.getElementById("saveStatus");

// Populates the category and manufacturer dropdowns in the add-product form
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

// Validates credentials and shows the panel on success
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

// Allow logging in by pressing Enter in either field
[usernameInput, passwordInput].forEach(el => {
  el.addEventListener("keydown", e => {
    if (e.key === "Enter") loginBtn.click();
  });
});

// Clears the login fields and returns to the login screen
logoutBtn.addEventListener("click", () => {
  usernameInput.value = "";
  passwordInput.value = "";
  showLogin();
});

// Fetches all products from the Firestore "products" collection,
// stores them in the products array, seeds the next ID counter, and renders the table
function loadProducts() {
  setStatus("Loading...", "saving");
  getDocs(collection(db, "products"))
    .then(snapshot => {
      products = snapshot.docs.map(d => d.data());
      window._nextId = products.reduce((m, p) => Math.max(m, p.id), -1) + 1;
      renderTable();
      saveStatus.style.display = "none";
    })
    .catch(err => {
      setStatus("✗ Could not load from Firestore: " + err.message, "error");
    });
}

// Clears and rebuilds the product table from the current products array
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
    const categoryName     = CATEGORIES[p.categoryId]        || `ID ${p.categoryId}`;
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

// Handles clicks on "Remove" buttons via event delegation;
// deletes the product from Firestore and re-renders the table
tableBody.addEventListener("click", e => {
  const btn = e.target.closest(".btn-remove");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!confirm(`Remove product #${id}?`)) return;

  setStatus("Deleting...", "saving");
  deleteDoc(doc(db, "products", String(id)))
    .then(() => {
      products = products.filter(p => p.id !== id);
      renderTable();
      setStatus("✓ Product deleted.", "ok");
    })
    .catch(err => {
      setStatus("✗ Delete failed: " + err.message, "error");
    });
});

// Handles the add-product form submission: validates fields, saves the new product to Firestore,
// and re-renders the table
addForm.addEventListener("submit", e => {
  e.preventDefault();

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

  setStatus("Saving...", "saving");
  setDoc(doc(db, "products", String(newProduct.id)), newProduct)
    .then(() => {
      products.push(newProduct);
      renderTable();
      addForm.reset();
      setStatus("✓ Product added to Firestore.", "ok");
      document.getElementById("productTable").scrollIntoView({ behavior: "smooth" });
    })
    .catch(err => {
      setStatus("✗ Save failed: " + err.message, "error");
    });
});

// Displays an error message inside the add-product form
function showAddError(msg) {
  addError.textContent = msg;
  addError.style.display = "block";
}

// Updates the save-status indicator; auto-hides after 4 seconds for "ok" status
function setStatus(msg, type) {
  saveStatus.textContent = msg;
  saveStatus.className   = "save-status save-status--" + type;
  saveStatus.style.display = "block";

  if (type === "ok") {
    setTimeout(() => { saveStatus.style.display = "none"; }, 4000);
  }
}

// Escapes special HTML characters to prevent XSS when injecting into innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

populateDropdowns();
