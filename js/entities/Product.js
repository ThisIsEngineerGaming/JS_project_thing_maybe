export default class Product {
  constructor(id, imageUrl, name, rating, price, discountedPrice, category, manufacturer) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.name = name;
    this.rating = rating;
    this.price = price;
    this.discountedPrice = discountedPrice;
    this.category = category;
    this.manufacturer = manufacturer;
  }

  getDiscountPercent() {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }

  createCard(container) {
    let card = document.createElement("div");

    card.style.backgroundColor = "white";
    card.style.borderRadius = "15px";
    card.style.padding = "15px";
    card.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.15)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.gap = "10px";

    let img = document.createElement("img");

    img.src = this.imageUrl;
    img.alt = this.name;
    img.style.width = "100%";
    img.style.height = "180px";
    img.style.objectFit = "contain";

    let title = document.createElement("p");

    title.textContent = this.name;
    title.style.fontSize = "20px";
    title.style.fontWeight = "bold";
    title.style.margin = "0";

    let rating = document.createElement("div");

    let stars = "";

    for(let i = 0; i < this.rating; i++) {
      stars += "\u2605"; // https://www.compart.com/en/unicode/search?q=star#characters
    }

    for(let i = this.rating; i < 5; i++) {
      stars += "\u2606";
    }

    rating.textContent = stars;
    rating.style.color = "gold";
    rating.style.fontSize = "22px";

    let oldPrice = document.createElement("p");

    oldPrice.textContent = this.price + " $";
    oldPrice.style.textDecoration = "line-through";
    oldPrice.style.margin = "0";

    let newPrice = document.createElement("p");

    newPrice.textContent = this.discountedPrice + " $";
    newPrice.style.color = "red";
    newPrice.style.fontWeight = "bold";
    newPrice.style.margin = "0";

    let button = document.createElement("button");

    button.textContent = "Add to cart";
    button.style.padding = "10px";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "10px";

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(oldPrice);
    card.appendChild(newPrice);
    card.appendChild(button);

    container.appendChild(card);
  }
}
