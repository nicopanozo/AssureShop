import { Test, TestingModule } from '@nestjs/testing';
import ProductService from '../../src/services/product.service';
import { ProductRepository } from '../../src/repositories/product.repository';
import { CreateProductDto, UpdateProductDto, Product } from '../../src/models/product.model';
import logger from '../../src/utils/logger';
import { jest } from '@jest/globals';
import { Category, Inventory, Review } from '../../src/models/product.model';

const mockProductRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as jest.Mocked<ProductRepository>;

jest.mock('../../src/utils/logger');

const createMockCategory = (): Category => ({
  category_id: 1,
  name: 'Test Category',
  description: null,
  parent_category_id: null,
  created_at: new Date(),
  updated_at: new Date(),
});

const createMockInventory = (): Inventory => ({
  inventory_id: 1,
  product_id: 1,
  stock_quantity: 100,
  low_stock_threshold: 10,
  last_stock_update: new Date(),
  next_restock_date: null,
  created_at: new Date(),
  updated_at: new Date(),
});

const createMockReview = (): Review => ({
  review_id: 1,
  product_id: 1,
  user_id: 1,
  rating: 5,
  comment: 'Great product',
  created_at: new Date(),
  updated_at: new Date(),
  user: { first_name: 'John', last_name: 'Doe' },
});

const createMockProductWithRelations = (): Product => ({
  product_id: 1,
  name: 'Test Product',
  price: 10,
  categoryId: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: createMockCategory(),
  inventory: createMockInventory(),
  reviews: [createMockReview()],
});

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get(ProductRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products with relations', async () => {
      const mockProducts: Product[] = [createMockProductWithRelations(), createMockProductWithRelations()];
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts();
      expect(products).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAll with provided filters', async () => {
      const filters = { categoryId: 1, minPrice: 5 };
      await productService.getAllProducts(filters);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith(filters);
    });

    it('should throw an error if findAll fails', async () => {
      const errorMessage = 'Database error';
      mockProductRepository.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(productService.getAllProducts()).rejects.toThrow('Failed to get products');
      expect(logger.error).toHaveBeenCalledWith(`Error getting products: Error: ${errorMessage}`);
    });
  });

  describe('getProductById', () => {
    it('should return a product with relations if found', async () => {
      const mockProduct = createMockProductWithRelations();
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const product = await productService.getProductById(1);
      expect(product).toEqual(mockProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);
      const product = await productService.getProductById(1);
      expect(product).toBeNull();
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw the error if findById fails', async () => {
      const errorMessage = 'Database error';
      mockProductRepository.findById.mockRejectedValue(new Error(errorMessage));

      await expect(productService.getProductById(1)).rejects.toThrow(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(`Error getting product with ID 1: Error: ${errorMessage}`);
    });
  });

  describe('createProduct', () => {
    it('should create a new product and return it with relations', async () => {
      const createProductDto: CreateProductDto = { name: 'New Product', price: 25.00, categoryId: 3, isActive: true };
      const mockCreatedProduct = { ...createProductDto, product_id: 3, createdAt: new Date(), updatedAt: new Date(), category: createMockCategory(), inventory: null, reviews: [] } as Product;
      mockProductRepository.create.mockResolvedValue(mockCreatedProduct);

      const product = await productService.createProduct(createProductDto);
      expect(product).toEqual(mockCreatedProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(logger.info).toHaveBeenCalledWith(`Product created with ID: ${mockCreatedProduct.product_id}`);
    });

    it('should throw an error if create fails', async () => {
      const createProductDto: CreateProductDto = { name: 'New Product', price: 25.00, categoryId: 3, isActive: true };
      const errorMessage = 'Database error';
      mockProductRepository.create.mockRejectedValue(new Error(errorMessage));

      await expect(productService.createProduct(createProductDto)).rejects.toThrow('Failed to create product');
      expect(logger.error).toHaveBeenCalledWith(`Error creating product: Error: ${errorMessage}`);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product and return it with relations', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 30.00, categoryId: 1, isActive: false };
      const mockUpdatedProduct = { product_id: 1, ...updateProductDto, createdAt: new Date(), updatedAt: new Date(), category: createMockCategory(), inventory: createMockInventory(), reviews: [] } as Product;
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      mockProductRepository.update.mockResolvedValue(mockUpdatedProduct);

      const product = await productService.updateProduct(productId, updateProductDto);
      expect(product).toEqual(mockUpdatedProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updateProductDto);
      expect(logger.info).toHaveBeenCalledWith(`Product updated with ID: ${mockUpdatedProduct.product_id}`);
    });

    it('should throw an error if the product to update is not found', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.updateProduct(productId, updateProductDto)).rejects.toThrow(`Product with ID ${productId} not found`);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it('should throw the error if update fails', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      const errorMessage = 'Database error';
      mockProductRepository.update.mockRejectedValue(new Error(errorMessage));

      await expect(productService.updateProduct(productId, updateProductDto)).rejects.toThrow(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(`Error updating product with ID ${productId}: Error: ${errorMessage}`);
    });
  });

  describe('updatePartialProduct', () => {
    it('should partially update an existing product and return it with relations', async () => {
      const productId = 1;
      const updateProductDto: Partial<UpdateProductDto> = { price: 35.00 };
      const mockPartialUpdatedProduct = { ...createMockProductWithRelations(), ...updateProductDto, updatedAt: new Date() };
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      mockProductRepository.update.mockResolvedValue(mockPartialUpdatedProduct);

      const product = await productService.updatePartialProduct(productId, updateProductDto);
      expect(product).toEqual(mockPartialUpdatedProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updateProductDto);
      expect(logger.info).toHaveBeenCalledWith(`Product partially updated with ID: ${mockPartialUpdatedProduct.product_id}`);
    });

    it('should throw an error if the product to partially update is not found', async () => {
      const productId = 1;
      const updateProductDto: Partial<UpdateProductDto> = { price: 35.00 };
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.updatePartialProduct(productId, updateProductDto)).rejects.toThrow(`Product with ID ${productId} not found`);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it('should throw the error if partial update fails', async () => {
      const productId = 1;
      const updateProductDto: Partial<UpdateProductDto> = { price: 35.00 };
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      const errorMessage = 'Database error';
      mockProductRepository.update.mockRejectedValue(new Error(errorMessage));

      await expect(productService.updatePartialProduct(productId, updateProductDto)).rejects.toThrow(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(`Error partially updating product with ID ${productId}: Error: ${errorMessage}`);
    });
  });

  describe('softDeleteProduct', () => {
    it('should soft delete a product and return a success message', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      mockProductRepository.update.mockResolvedValue({ ...createMockProductWithRelations(), isActive: false });

      const result = await productService.softDeleteProduct(productId);
      expect(result).toEqual({ message: `Product with ID ${productId} successfully deactivated` });
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, { isActive: false });
      expect(logger.info).toHaveBeenCalledWith(`Product soft deleted with ID: 1`);
    });

    it('should throw an error if the product to soft delete is not found', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.softDeleteProduct(productId)).rejects.toThrow(`Product with ID ${productId} not found`);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it('should throw the error if soft delete fails', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      const errorMessage = 'Database error';
      mockProductRepository.update.mockRejectedValue(new Error(errorMessage));

      await expect(productService.softDeleteProduct(productId)).rejects.toThrow(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(`Error soft deleting product with ID ${productId}: Error: ${errorMessage}`);
    });
  });

  describe('deleteProduct', () => {
    it('should hard delete a product and return a success message', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      mockProductRepository.delete.mockResolvedValue(undefined);

      const result = await productService.deleteProduct(productId);
      expect(result).toEqual({ message: `Product with ID ${productId} successfully deleted` });
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
      expect(logger.info).toHaveBeenCalledWith(`Product deleted with ID: ${productId}`);
    });

    it('should throw an error if the product to delete is not found', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.deleteProduct(productId)).rejects.toThrow(`Product with ID ${productId} not found`);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw the error if delete fails', async () => {
      const productId = 1;
      mockProductRepository.findById.mockResolvedValue(createMockProductWithRelations());
      const errorMessage = 'Database error';
      mockProductRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(productService.deleteProduct(productId)).rejects.toThrow(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(`Error deleting product with ID ${productId}: Error: ${errorMessage}`);
    });
  });
});