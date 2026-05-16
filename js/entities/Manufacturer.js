export default class Manufacturer {
  constructor(id, name, country, foundedYear, website) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.foundedYear = foundedYear;
    this.website = website;
  }

  getCompanyAge() {
    return 2026 - this.foundedYear;
  }
}
