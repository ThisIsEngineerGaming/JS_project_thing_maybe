 // constructor of the user's specific cart
export default class Cart {
  constructor(id, customer, products = [], totalPrice = 0, isCheckedOut = false) {
    this.id           = id;
    this.customer     = customer;
    this.products     = products;
    this.totalPrice   = totalPrice;
    this.isCheckedOut = isCheckedOut;
  }
   // adds a product to the cart and updates the total
   // uses discountedPrice if available
  addProduct(product) {
    this.products.push(product);
    this.totalPrice += product.discountedPrice ?? product.price;
  }
  // removes a product by ID and subtracts its price from the total
  // does nothing if the product is not found
  removeProduct(productId) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) return;
    this.totalPrice -= this.products[index].discountedPrice ?? this.products[index].price;
    this.products.splice(index, 1);
  }
  // marks the cart as checked out
  checkout() {
    this.isCheckedOut = true;
  }
  // returns a summary string for this cart
  getInfo() {
    return `Cart #${this.id} | Customer: ${this.customer.getFullName()} | Items: ${this.products.length} | Total: $${this.totalPrice.toFixed(2)} | Checked out: ${this.isCheckedOut}`;
  }
}
