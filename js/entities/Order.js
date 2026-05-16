export default class Order {
  constructor(id, customer, products, status, createdAt) {
    this.id = id;
    this.customer = customer;
    this.products = products;
    this.status = status;
    this.createdAt = createdAt;
  }

  changeStatus(newStatus) {
    this.status = newStatus;
  }
}
