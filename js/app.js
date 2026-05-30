import Product from "./entities/Product.js";
import Category from "./entities/Category.js";
import Manufacturer from "./entities/Manufacturer.js";
import Cart from "/js/entities/Cart.js";
import { addToCart } from "/js/entities/Cart.js";
import Customer from "./entities/Customer.js";
import Order from "./entities/Order.js";


document.body.style.backgroundColor = "#f5f5f5";
document.body.style.margin = "0";

let container = document.createElement("div");
container.style.display = "flex";
container.style.flexWrap = "wrap";
container.style.justifyContent = "center";
container.style.gap = "20px";
document.getElementById("products").appendChild(container);

let category = new Category(1, "Food", "Food products", 100, true);

let manufacturers = {
  1: new Manufacturer(1, "Oil Company",     "USA",     2000, "https://oil.com"),
  2: new Manufacturer(2, "Dairy Fresh Co.", "Germany", 1995, "https://dairyfresh.com"),
  3: new Manufacturer(3, "Nature's Best",   "France",  2005, "https://naturesbest.com"),
  4: new Manufacturer(4, "Pantry Staples",  "Italy",   1988, "https://pantrystaples.com"),
  5: new Manufacturer(5, "Gourmet Picks",   "Belgium", 2010, "https://gourmetpicks.com"),
};

let customer = new Customer(1, "Jonkler", "Carlick", "john@gmail.com", "+123456789");

function renderProducts(fromId, toId) {
  fetch("/json/products.json")
    .then(response => response.json())
    .then(data => {
      let products = [];

      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.id < fromId || item.id > toId) continue;

        let manufacturer = manufacturers[item.manufacturerId] ?? manufacturers[1];

        let product = new Product(
          item.id,
          item.imageUrl,
          item.name,
          item.rating,
          item.price,
          item.discountedPrice,
          category,
          manufacturer
        );

        products.push(product);
        product.createCard(container); // addToCart is handled inside createCard on click
      }

      let order = new Order(1, customer, products, "Created", new Date());

      console.log(category.getInfo());
      console.log(manufacturers[1].getCompanyAge());
      console.log(customer.getFullName());
      console.log(order.status);

      order.changeStatus("Delivered");
      console.log(order.status);
    });
}

renderProducts(0, 19);
