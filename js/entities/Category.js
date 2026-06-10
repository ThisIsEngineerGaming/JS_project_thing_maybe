export default class Category {
  // Creates a category with its metadata and popularity flag
  constructor(id, name, description, productsCount, isPopular) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.productsCount = productsCount;
    this.isPopular = isPopular;
  }

  // Returns a short human-readable summary of this category
  getInfo() {
    return this.name + " - " + this.description;
  }
}
