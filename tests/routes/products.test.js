const request = require('supertest');
const app = require('../../src/app');
const { Product } = require('../../src/models/product');
const { ProductFactory } = require('../factories');
const BASE_URL = '/api/products';

describe('Product Routes', () => {

  
  /**
   * Utility function to bulk create products
   */
  async function createProducts(count = 1) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);
      products.push(product);
    }
    return products;
  }
  
  /**
   * Utility function to get product count
   */
  async function getProductCount() {
    const response = await request(app)
      .get(BASE_URL)
      .expect(200);
    return response.body.length;
  }
  
  describe('Basic Endpoints', () => {
    test('should return the index page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Product Catalog Administration');
    });
    
    test('should be healthy', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/health`)
        .expect(200);
      
      expect(response.body.message).toBe('OK');
    });
  });

  
  
  describe('CREATE Product', () => {
    test('should create a new product', async () => {
      const testProduct = ProductFactory.build();

      
      const response = await request(app)
        .post(BASE_URL)
        .send(testProduct)
        .expect(201);
      
      // Make sure location header is set
      expect(response.headers.location).toBeDefined();
      
      // Check the data is correct
      const newProduct = response.body;
      expect(newProduct.name).toBe(testProduct.name);
      expect(newProduct.description).toBe(testProduct.description);
      expect(newProduct.price).toBe(testProduct.price);
      expect(newProduct.available).toBe(testProduct.available);
      expect(newProduct.category).toBe(testProduct.category);
      
      
      
      
    });
    
    test('should not create a product without a name', async () => {
      const productData = ProductFactory.build();
      delete productData.name;
      

      
      const response = await request(app)
        .post(BASE_URL)
        .send(productData)
        .expect(400);
      
      expect(response.body.error).toBe('Validation Error');
    });
    
    test('should not create a product with no Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .send('bad data')
        .expect(415);
    });
    
    test('should not create a product with wrong Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'text/plain')
        .send('some plain text data')
        .expect(415);
    });

    test('should proceed if content type is correct but has extra parameters', async () => {
      const productData = ProductFactory.build();
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(productData);

      // We expect a 201, not a 415, because the base type is correct.
      expect(response.status).toBe(201);
    });
  });


  // ADD TEST HERE
  describe('Read / Update / Delete', () => {
  test('should read a product', async () => {
    const productData = ProductFactory.build();
    const createResponse = await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    expect(createResponse.status).toBe(201);
    const productId = createResponse.body.id;

    const response = await request(app).get(`${BASE_URL}/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe(productData.name);
  });

  test('should update a product', async () => {
    const productData = ProductFactory.build();
    const createResponse = await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    expect(createResponse.status).toBe(201);
    const productId = createResponse.body.id;

    const updateData = {
      ...createResponse.body,
      name: 'Updated Product Name',
      description: 'Updated Description',
      price: 55.55,
      available: false,
      category: 'FOOD',
    };

    const response = await request(app)
      .put(`${BASE_URL}/${productId}`)
      .set('Content-Type', 'application/json')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe('Updated Product Name');
    expect(response.body.description).toBe('Updated Description');
    expect(parseFloat(response.body.price)).toBe(55.55);
    expect(response.body.available).toBe(false);
    expect(response.body.category).toBe('FOOD');
  });

  test('should delete a product', async () => {
    const productData = ProductFactory.build();
    const createResponse = await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    expect(createResponse.status).toBe(201);
    const productId = createResponse.body.id;

    const response = await request(app).delete(`${BASE_URL}/${productId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(app).get(`${BASE_URL}/${productId}`);
    expect(getResponse.status).toBe(404);
  });
});

describe('List and Query Products', () => {
  test('should list all products', async () => {
    const response = await request(app).get(BASE_URL);
    expect(response.status).toBe(200);
  });

  test('should list products by name', async () => {
    const productData = ProductFactory.build();
    productData.name = 'Special Product';
    await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    const response = await request(app).get(`${BASE_URL}?name=Special Product`);

    expect(response.status).toBe(200);
  });

  test('should list products by category', async () => {
    const productData = ProductFactory.build();
    productData.category = 'TOOLS';
    await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    const response = await request(app).get(`${BASE_URL}?category=TOOLS`);

    expect(response.status).toBe(200);
  });

  test('should list products by availability', async () => {
    const productData = ProductFactory.build();
    productData.available = true;
    await request(app)
      .post(BASE_URL)
      .set('Content-Type', 'application/json')
      .send(productData);

    const response = await request(app).get(`${BASE_URL}?available=true`);

    expect(response.status).toBe(200);
  });
});
  
  
});
