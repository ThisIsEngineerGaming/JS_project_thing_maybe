export default class Cart {
  constructor(id, customer, products = [], totalPrice = 0, isCheckedOut = false) {
    this.id           = id;
    this.customer     = customer;
    this.products     = products;
    this.totalPrice   = totalPrice;
    this.isCheckedOut = isCheckedOut;
  }

  addProduct(product) {
    this.products.push(product);
    this.totalPrice += product.discountedPrice ?? product.price;
  }

  removeProduct(productId) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) return;
    this.totalPrice -= this.products[index].discountedPrice ?? this.products[index].price;
    this.products.splice(index, 1);
  }

  checkout() {
    this.isCheckedOut = true;
  }

  getInfo() {
    return `Cart #${this.id} | Customer: ${this.customer.getFullName()} | Items: ${this.products.length} | Total: $${this.totalPrice.toFixed(2)} | Checked out: ${this.isCheckedOut}`;
  }
}
