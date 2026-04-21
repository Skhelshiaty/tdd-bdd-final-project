const { Product, Category } = require('../../src/models/product');
const { sequelize } = require('../../src/database/connection');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {


  
  describe('Product Creation', () => {
    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };
      
      const product = new Product(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toBeNull(); // Not saved yet
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });
    
    test('should add a product to the database', async () => {
      // Check database is empty
      const products = await Product.findAll();
      expect(products).toEqual([]);
      
      // Create product using factory
      const productData = ProductFactory.build();
      delete productData.id; // Remove ID so database assigns one
      
      const product = await Product.create(productData);
      
      // Assert that it was assigned an id and shows up in the database
      expect(product.id).toBeDefined();
      
      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);
      
      // Check that it matches the original product
      const newProduct = allProducts[0];
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(productData.price);
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });
  });
  
  //
  // ADD YOUR TEST CASES HERE
  //
  describe('Product Read', () => {
  test('should read a product from the database', async () => {
    const productData = ProductFactory.build();
    delete productData.id;

    const createdProduct = await Product.create(productData);
    const foundProduct = await Product.findByPk(createdProduct.id);

    expect(foundProduct).toBeDefined();
    expect(foundProduct.id).toEqual(createdProduct.id);
    expect(foundProduct.name).toEqual(createdProduct.name);
    expect(foundProduct.description).toEqual(createdProduct.description);
    expect(parseFloat(foundProduct.price)).toEqual(parseFloat(createdProduct.price));
    expect(foundProduct.available).toEqual(createdProduct.available);
    expect(foundProduct.category).toEqual(createdProduct.category);
  });
});

describe('Product Update', () => {
  test('should update a product in the database', async () => {
    const productData = ProductFactory.build();
    delete productData.id;

    const product = await Product.create(productData);
    product.name = 'Updated Name';
    product.description = 'Updated Description';
    product.price = 99.99;
    product.available = false;
    product.category = Category.FOOD;
    await product.save();

    const updatedProduct = await Product.findByPk(product.id);

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toEqual('Updated Name');
    expect(updatedProduct.description).toEqual('Updated Description');
    expect(parseFloat(updatedProduct.price)).toEqual(99.99);
    expect(updatedProduct.available).toEqual(false);
    expect(updatedProduct.category).toEqual(Category.FOOD);
  });
});

describe('Product Delete', () => {
  test('should delete a product from the database', async () => {
    const productData = ProductFactory.build();
    delete productData.id;

    const product = await Product.create(productData);
    await product.destroy();

    const deletedProduct = await Product.findByPk(product.id);
    expect(deletedProduct).toBeNull();
  });
});

describe('Product List', () => {
  test('should list all products in the database', async () => {
    const product1 = ProductFactory.build();
    const product2 = ProductFactory.build();
    delete product1.id;
    delete product2.id;

    await Product.create(product1);
    await Product.create(product2);

    const products = await Product.findAll();
    expect(products.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Product Finders', () => {
  test('should find products by name', async () => {
    const productData = ProductFactory.build();
    productData.name = 'Unique Product Name';
    delete productData.id;

    await Product.create(productData);
    const products = await Product.findByName('Unique Product Name');

    expect(products.length).toBeGreaterThan(0);
    expect(products[0].name).toEqual('Unique Product Name');
  });

  test('should find products by category', async () => {
    const productData = ProductFactory.build();
    productData.category = Category.TOOLS;
    delete productData.id;

    await Product.create(productData);
    const products = await Product.findByCategory(Category.TOOLS);

    expect(products.length).toBeGreaterThan(0);
    expect(products[0].category).toEqual(Category.TOOLS);
  });

  test('should find products by availability', async () => {
    const productData = ProductFactory.build();
    productData.available = true;
    delete productData.id;

    await Product.create(productData);
    const products = await Product.findByAvailability(true);

    expect(products.length).toBeGreaterThan(0);
    expect(products[0].available).toEqual(true);
  });
});
  
  
});
