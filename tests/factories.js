const { faker } = require('@faker-js/faker');
const { Product, Category } = require('../src/models/product');

class ProductFactory {
  static data() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      available: faker.datatype.boolean(),
      category: faker.helpers.arrayElement(Object.values(Category)),
    };
  }

  static create() {
    return ProductFactory.data();
  }
}

module.exports = { ProductFactory };
