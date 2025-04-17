import productRepository from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ProductFilters } from '../models/product.model';
import logger from '../utils/logger';

class ProductService {
  // Get all products, with optional filters
  async getAllProducts(filters?: ProductFilters) {
    try {
      const products = await productRepository.findAll(filters);
      return products;
    } catch (error) {
      logger.error(`Error getting products: ${error}`);
      throw new Error('Failed to get products');
    }
  }

  // Get a product by ID
  async getProductById(id: number) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      logger.error(`Error getting product with ID ${id}: ${error}`);
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData: CreateProductDto) {
    try {
      const newProduct = await productRepository.create(productData);
      logger.info(`Product created with ID: ${newProduct.product_id}`);
      return newProduct;
    } catch (error) {
      logger.error(`Error creating product: ${error}`);
      throw new Error('Failed to create product');
    }
  }

  // Update a product completely (PUT)
  async updateProduct(id: number, productData: UpdateProductDto) {
    try {
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const updatedProduct = await productRepository.update(id, productData);
      logger.info(`Product updated with ID: ${updatedProduct.product_id}`);
      return updatedProduct;
    } catch (error) {
      logger.error(`Error updating product with ID ${id}: ${error}`);
      throw error;
    }
  }

  // Partially update a product (PATCH)
  async updatePartialProduct(id: number, productData: Partial<UpdateProductDto>) {
    try {
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const updatedProduct = await productRepository.update(id, productData);
      logger.info(`Product partially updated with ID: ${updatedProduct.product_id}`);
      return updatedProduct;
    } catch (error) {
      logger.error(`Error partially updating product with ID ${id}: ${error}`);
      throw error;
    }
  }

  // Hard delete a product (permanent)
  async deleteProduct(id: number) {
    try {
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }

      await productRepository.delete(id);
      logger.info(`Product deleted with ID: ${id}`);
      return { message: `Product with ID ${id} successfully deleted` };
    } catch (error) {
      logger.error(`Error deleting product with ID ${id}: ${error}`);
      throw error;
    }
  }
  // PATCH
  async updatePartialProduct(id: number, productData: Partial<UpdateProductDto>) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) throw new Error(`Product with ID ${id} not found`);

    const updatedProduct = await productRepository.update(id, productData);
    return updatedProduct;
  }

// Soft DELETE
  async softDeleteProduct(id: number) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) throw new Error(`Product with ID ${id} not found`);

    const updatedProduct = await productRepository.update(id, { isActive: false });
    return { message: `Product with ID ${id} successfully deactivated` };
  }
}

export default new ProductService();
