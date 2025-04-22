import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, Product, ProductFilters, Category, Inventory, Review } from '../models/product.model';
import logger from '../utils/logger';

@Injectable()
class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      logger.info('Getting all products');
      const productsWithRelations = await this.productRepository.findAll(filters);
      return productsWithRelations.map(p => this.mapProductWithRelationsToProduct(p));
    } catch (error) {
      logger.error(`Error getting products: ${error}`);
      throw new Error('Failed to get products');
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      logger.info(`Getting product with ID: ${id}`);
      const productWithRelations = await this.productRepository.findById(id);
      if (!productWithRelations) {
        return null;
      }
      return this.mapProductWithRelationsToProduct(productWithRelations);
    } catch (error) {
      logger.error(`Error getting product with ID ${id}: ${error}`);
      throw error;
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      logger.info('Creating new product');
      const newProductWithRelation = await this.productRepository.create(createProductDto);
      logger.info(`Product created with ID: ${newProductWithRelation.product_id}`);
      return this.mapProductWithRelationsToProduct(newProductWithRelation);
    } catch (error) {
      logger.error(`Error creating product: ${error}`);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      logger.info(`Updating product with ID: ${id}`);
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      const updatedProductWithRelation = await this.productRepository.update(id, updateProductDto);
      logger.info(`Product updated with ID: ${updatedProductWithRelation.product_id}`);
      return this.mapProductWithRelationsToProduct(updatedProductWithRelation);
    } catch (error) {
      logger.error(`Error updating product with ID ${id}: ${error}`);
      throw error;
    }
  }

  async updatePartialProduct(id: number, updateProductDto: Partial<UpdateProductDto>): Promise<Product> {
    try {
      logger.info(`Partially updating product with ID: ${id}`);
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      const updatedProductWithRelation = await this.productRepository.update(id, updateProductDto as UpdateProductDto);
      logger.info(`Product partially updated with ID: ${updatedProductWithRelation.product_id}`);
      return this.mapProductWithRelationsToProduct(updatedProductWithRelation);
    } catch (error) {
      logger.error(`Error partially updating product with ID ${id}: ${error}`);
      throw error;
    }
  }

  async softDeleteProduct(id: number): Promise<{ message: string }> {
    try {
      logger.info(`Soft deleting product with ID: ${id}`);
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await this.productRepository.update(id, { isActive: false });
      logger.info(`Product soft deleted with ID: ${id}`);
      return { message: `Product with ID ${id} successfully deactivated` };
    } catch (error) {
      logger.error(`Error soft deleting product with ID ${id}: ${error}`);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    try {
      logger.info(`Deleting product with ID: ${id}`);
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await this.productRepository.delete(id);
      logger.info(`Product deleted with ID: ${id}`);
      return { message: `Product with ID ${id} successfully deleted` };
    } catch (error) {
      logger.error(`Error deleting product with ID ${id}: ${error}`);
      throw error;
    }
  }

  private mapProductWithRelationsToProduct(productWithRelations: any): Product {
    return {
      product_id: productWithRelations.product_id,
      name: productWithRelations.name,
      description: productWithRelations.description,
      price: productWithRelations.price,
      categoryId: productWithRelations.category_id,
      imageUrl: productWithRelations.image_url,
      sku: productWithRelations.sku,
      weight: productWithRelations.weight,
      dimensions: productWithRelations.dimensions,
      isActive: productWithRelations.is_active,
      createdAt: productWithRelations.created_at,
      updatedAt: productWithRelations.updated_at,
      category: productWithRelations.category as Category,
      inventory: productWithRelations.inventory as Inventory | null,
      reviews: productWithRelations.reviews as Review[],
    };
  }
}

export default ProductService;