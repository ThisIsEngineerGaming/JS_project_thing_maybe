export default class Category {
  constructor(id, name, description, productsCount, isPopular) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.productsCount = productsCount;
    this.isPopular = isPopular;
  }

  getInfo() {
    return this.name + " - " + this.description;
  }
}
