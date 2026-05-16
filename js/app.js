import Product from "./entities/Product.js";
import Category from "./entities/Category.js";
import Manufacturer from "./entities/Manufacturer.js";
import Cart from "./entities/Cart.js";
import Customer from "./entities/Customer.js";
import Order from "./entities/Order.js";

document.body.style.backgroundColor = "#f5f5f5";
document.body.style.margin = "0";

let container = document.createElement("div");

container.style.display = "grid";
container.style.gridTemplateColumns = "20% 20% 20% 20% 20%";
container.style.gap = "20px";
container.style.padding = "20px";

document.body.appendChild(container);

let category = new Category(1, "Food", "Food products", 100, true);

let manufacturer = new Manufacturer(1, "Oil Company", "USA", 2000, "https://oil.com");

let customer = new Customer(1, "Jonkler", "Carlick", "john@gmail.com", "+123456789");

let cart = new Cart(1, customer, [], 0, false);

let products = [];

for(let i = 0; i < 25; i++) {

  let product = new Product(i + 1, "https://www.smart-tbk.com/wp-content/uploads/2025/06/Cooking-Oil-Industrial-Packed-Products.jpg", "Oil", 4, 120, 89, category, manufacturer);

  products.push(product);

  cart.addProduct(product);

  product.createCard(container);
}

let order = new Order(1, customer, products, "Created", new Date());

console.log(category.getInfo());
console.log(manufacturer.getCompanyAge());
console.log(customer.getFullName());
console.log(cart.totalPrice);
console.log(order.status);

order.changeStatus("Delivered");

console.log(order.status);
