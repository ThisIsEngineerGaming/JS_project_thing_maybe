export default class Customer {
  constructor(id, firstName, lastName, email, phone) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }

  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
