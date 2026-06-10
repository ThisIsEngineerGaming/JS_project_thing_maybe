export default class Manufacturer {
  // Creates a manufacturer with its basic company info
  constructor(id, name, country, foundedYear, website) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.foundedYear = foundedYear;
    this.website = website;
  }

  // Returns how many years ago the company was founded (hardcoded to 2026)
  getCompanyAge() {
    return 2026 - this.foundedYear;
  }
}
