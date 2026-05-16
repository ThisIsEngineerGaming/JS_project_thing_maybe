export default class Cart {
  constructor(id, customer, products, totalPrice, isPaid) {
    this.id = id;
    this.customer = customer;
    this.products = products;
    this.totalPrice = totalPrice;
    this.isPaid = isPaid;
  }

  addProduct(product) {
    this.products.push(product);
    this.totalPrice += product.discountedPrice;
  }

  removeProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId);
  }
}
