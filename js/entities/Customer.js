export default class Customer {
  // Creates a customer with their contact details
  constructor(id, firstName, lastName, email, phone) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }

  // Returns the customer's full name as a single string
  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
