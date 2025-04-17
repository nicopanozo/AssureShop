import productService from '../services/product.service';
import productRepository from '../repositories/product.repository';
import { Prisma, Product } from '@prisma/client';

jest.mock('../repositories/product.repository');

const mockRepo = productRepository as jest.Mocked<typeof productRepository>;

// Helper to generate full mock Product including category
const generateMockProduct = (overrides: Partial<Product & { category?: any }> = {}): any => ({
  product_id: 1,
  name: 'Sample Product',
  description: null,
  price: new Prisma.Decimal(99.99),
  category_id: 1,
  image_url: null,
  sku: null,
  weight: null,
  dimensions: null,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
  category: {
    category_id: 1,
    name: 'Electronics',
    description: null,
    parent_category_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  ...overrides,
});

// createProduct
describe('ProductService - createProduct', () => {
  it('should create and return a new product', async () => {
    const mockData = {
      name: 'Test Product',
      price: 100,
      categoryId: 1,
      isActive: true,
    };

    const mockCreatedProduct = generateMockProduct({ name: 'Test Product' });
    mockRepo.create.mockResolvedValue(mockCreatedProduct);

    const result = await productService.createProduct(mockData);
    expect(result).toEqual(mockCreatedProduct);
    expect(mockRepo.create).toHaveBeenCalledWith(mockData);
  });

  it('should throw error if creation fails', async () => {
    mockRepo.create.mockRejectedValue(new Error('DB Error'));

    await expect(
      productService.createProduct({ name: '', price: 0, categoryId: 1 })
    ).rejects.toThrow('Failed to create product');
  });
});

// getAllProducts
describe('ProductService - getAllProducts', () => {
  it('should return a list of products', async () => {
    const mockProducts = [generateMockProduct()];
    mockRepo.findAll.mockResolvedValue(mockProducts);

    const result = await productService.getAllProducts();
    expect(result).toEqual(mockProducts);
  });

  it('should throw error on failure', async () => {
    mockRepo.findAll.mockRejectedValue(new Error('DB down'));

    await expect(productService.getAllProducts()).rejects.toThrow(
      'Failed to get products'
    );
  });
});

// getProductById
describe('ProductService - getProductById', () => {
  it('should return a product by ID', async () => {
    const product = generateMockProduct({ product_id: 1 });
    mockRepo.findById.mockResolvedValue(product);

    const result = await productService.getProductById(1);
    expect(result).toEqual(product);
  });

  it('should throw error if not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(productService.getProductById(99)).rejects.toThrow(
      'Product with ID 99 not found'
    );
  });
});

// updateProduct
describe('ProductService - updateProduct', () => {
  it('should update product if it exists', async () => {
    const id = 1;
    const updates = { name: 'Updated' };

    const existing = generateMockProduct({ product_id: id });
    const updated = generateMockProduct({ product_id: id, name: 'Updated' });

    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await productService.updateProduct(id, updates);
    expect(result).toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith(id, updates);
  });

  it('should throw error if product not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(productService.updateProduct(999, {})).rejects.toThrow(
      'Product with ID 999 not found'
    );
  });
});

// updatePartialProduct
describe('ProductService - updatePartialProduct', () => {
  it('should partially update product', async () => {
    const id = 2;
    const partialUpdate = { price: 200 };

    const existing = generateMockProduct({ product_id: id });
    const updated = generateMockProduct({
      product_id: id,
      price: new Prisma.Decimal(200),
    });

    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await productService.updatePartialProduct(id, partialUpdate);
    expect(result).toEqual(updated);
  });

  it('should throw error if product not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(productService.updatePartialProduct(2, {})).rejects.toThrow(
      'Product with ID 2 not found'
    );
  });
});

// softDeleteProduct
describe('ProductService - softDeleteProduct', () => {
  it('should deactivate product', async () => {
    const id = 3;
    const product = generateMockProduct({ product_id: id });
    const updated = generateMockProduct({ product_id: id, is_active: false });

    mockRepo.findById.mockResolvedValue(product);
    mockRepo.update.mockResolvedValue(updated);

    const result = await productService.softDeleteProduct(id);
    expect(result).toEqual({
      message: `Product with ID ${id} successfully deactivated`,
    });
  });

  it('should throw error if product not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(productService.softDeleteProduct(3)).rejects.toThrow(
      'Product with ID 3 not found'
    );
  });
});

// deleteProduct
describe('ProductService - deleteProduct', () => {
  it('should permanently delete product', async () => {
    const id = 4;
    const existing = generateMockProduct({ product_id: id });

    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.findById.mockResolvedValue(generateMockProduct());
    const result = await productService.deleteProduct(id);
    expect(result).toEqual({
      message: `Product with ID ${id} successfully deleted`,
    });
  });

  it('should throw error if product not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(productService.deleteProduct(4)).rejects.toThrow(
      'Product with ID 4 not found'
    );
  });
});
