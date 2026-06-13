import Product from "./entities/Product.js";
import Category from "./entities/Category.js";
import Manufacturer from "./entities/Manufacturer.js";
import Customer from "./entities/Customer.js";
import Order from "./entities/Order.js";
import "./entities/Scroller.js";
import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

// Static data — category and manufacturer lookup maps keyed by ID
const categories = {
  1: new Category(1, "Food",      "Food products",  100, true),
  2: new Category(2, "Dairy",     "Dairy products",  40, true),
  3: new Category(3, "Beverages", "Drinks & juices", 30, false),
  4: new Category(4, "Snacks",    "Snacks & sweets", 50, false),
};

const manufacturers = {
  1: new Manufacturer(1, "Oil Company",     "USA",     2000, "https://oil.com"),
  2: new Manufacturer(2, "Dairy Fresh Co.", "Germany", 1995, "https://dairyfresh.com"),
  3: new Manufacturer(3, "Nature's Best",   "France",  2005, "https://naturesbest.com"),
  4: new Manufacturer(4, "Pantry Staples",  "Italy",   1988, "https://pantrystaples.com"),
  5: new Manufacturer(5, "Gourmet Picks",   "Belgium", 2010, "https://gourmetpicks.com"),
};

const customer = new Customer(1, "Jonkler", "Carlick", "john@gmail.com", "+123456789");

// Converts a raw product data object into a full Product instance,
// resolving its category and manufacturer from the lookup maps
function createProductInstance(item) {
  const category     = categories[item.categoryId]        ?? categories[1];
  const manufacturer = manufacturers[item.manufacturerId] ?? manufacturers[1];
  return new Product(
    item.id, item.imageUrl, item.name, item.rating,
    item.price, item.discountedPrice, category, manufacturer
  );
}

// Fetches all products from the Firestore "products" collection and returns them as plain objects
function fetchProducts() {
  return getDocs(collection(db, "products")).then(snapshot => {
    return snapshot.docs.map(d => d.data());
  });
}


// ── INDEX PAGE ──────────────────────────────────────────────────────────────
const homepageContainer = (() => {
  const el = document.getElementById("products");
  return el && !document.getElementById("productsContainer") ? el : null;
})();

if (homepageContainer) {
  const grid = document.createElement("div");
  grid.style.display = "flex";
  grid.style.flexWrap = "wrap";
  grid.style.justifyContent = "center";
  grid.style.gap = "20px";
  homepageContainer.appendChild(grid);

  // Fetch products from Firestore and render the first 8 as a preview grid
  fetchProducts().then(data => {
    const preview = data.slice(0, 8);
    const instances = preview.map(item => {
      const p = createProductInstance(item);
      p.createCard(grid);
      return p;
    });

    const order = new Order(1, customer, instances, "Created", new Date());
    console.log(categories[1].getInfo());
    console.log(manufacturers[1].getCompanyAge());
    console.log(customer.getFullName());
    console.log(order.status);
    order.changeStatus("Delivered");
    console.log(order.status);
  });
}


// ── PRODUCTS PAGE ────────────────────────────────────────────────────────────
const productsContainer = document.getElementById("productsContainer");

if (productsContainer) {
  let allProducts = [];

  let activeCategory     = "all";
  let activeManufacturer = "all";
  let activeRating       = "all";
  let searchQuery        = "";

  const searchInput      = document.getElementById("searchInput");
  const clearBtn         = document.getElementById("clearSearch");
  const noResults        = document.getElementById("noResults");
  const resultsCount     = document.getElementById("resultsCount");
  const categoryList     = document.getElementById("categoryList");
  const manufacturerList = document.getElementById("manufacturerList");
  const ratingList       = document.getElementById("ratingList");

  // Reads unique category and manufacturer IDs from the product data and
  // injects a filter item for each into the sidebar lists
  function populateSidebar(data) {
    const catIds = [...new Set(data.map(p => p.categoryId))];
    catIds.forEach(id => {
      if (!categories[id]) return;
      const li = document.createElement("li");
      li.className = "filter-item";
      li.dataset.category = id;
      li.textContent = categories[id].name;
      categoryList.appendChild(li);
    });

    const mfrIds = [...new Set(data.map(p => p.manufacturerId))];
    mfrIds.forEach(id => {
      if (!manufacturers[id]) return;
      const li = document.createElement("li");
      li.className = "filter-item";
      li.dataset.manufacturer = id;
      li.textContent = manufacturers[id].name;
      manufacturerList.appendChild(li);
    });
  }

  // Filters allProducts against the current search/category/manufacturer/rating state
  // and re-renders matching products into productsContainer
  function applyFilters() {
    const query = searchQuery.toLowerCase().trim();

    const filtered = allProducts.filter(item => {
      const matchSearch = !query || item.name.toLowerCase().includes(query);
      const matchCat    = activeCategory     === "all" || String(item.categoryId)     === String(activeCategory);
      const matchMfr    = activeManufacturer === "all" || String(item.manufacturerId) === String(activeManufacturer);
      const matchRating = activeRating       === "all" || item.rating >= Number(activeRating);
      return matchSearch && matchCat && matchMfr && matchRating;
    });

    productsContainer.innerHTML = "";

    if (filtered.length === 0) {
      noResults.style.display = "block";
      resultsCount.textContent = "";
      return;
    }

    noResults.style.display = "none";
    resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`;

    filtered.forEach(item => {
      const p = createProductInstance(item);
      p.createCard(productsContainer);
    });
  }

  // Attaches a click handler to a sidebar filter list and calls onSelect with the clicked item's data value
  function bindFilterList(listEl, dataKey, onSelect) {
    listEl.addEventListener("click", e => {
      const item = e.target.closest(".filter-item");
      if (!item) return;
      listEl.querySelectorAll(".filter-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      onSelect(item.dataset[dataKey]);
    });
  }

  // Update searchQuery and re-filter on every keystroke
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    clearBtn.style.display = searchQuery ? "flex" : "none";
    applyFilters();
  });

  // Clear the search field and re-filter when the X button is clicked
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearBtn.style.display = "none";
    searchInput.focus();
    applyFilters();
  });

  // Wire up the three sidebar filter lists
  bindFilterList(categoryList,     "category",     val => { activeCategory     = val; applyFilters(); });
  bindFilterList(manufacturerList, "manufacturer", val => { activeManufacturer = val; applyFilters(); });
  bindFilterList(ratingList,       "rating",       val => { activeRating       = val; applyFilters(); });

  // Fetch all products from Firestore, populate the sidebar, then render the initial product grid
  fetchProducts().then(data => {
    allProducts = data;
    populateSidebar(data);
    applyFilters();
  });
}
