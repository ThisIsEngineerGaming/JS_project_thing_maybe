export default class Order {
  // Creates an order linking a customer to their products, with a status and timestamp
  constructor(id, customer, products, status, createdAt) {
    this.id = id;
    this.customer = customer;
    this.products = products;
    this.status = status;
    this.createdAt = createdAt;
  }

  // Updates the order's status to the provided string (e.g. "Delivered", "Cancelled")
  changeStatus(newStatus) {
    this.status = newStatus;
  }
}
