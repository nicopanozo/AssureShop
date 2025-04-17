import prisma from '../config/database';
import { CreateProductDto, UpdateProductDto, ProductFilters } from '../models/product.model';

class ProductRepository {
  // Get all products with filters
  async findAll(filters?: ProductFilters) {
    const where: any = {};

    if (filters) {
      if (filters.categoryId !== undefined) {
        where.category_id = filters.categoryId;
      }

      if (filters.isActive !== undefined) {
        where.is_active = filters.isActive;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  // Get product by ID
  async findById(id: number) {
    return await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        category: true,
        inventory: true,
        reviews: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });
  }

  // Create product
  async create(product: CreateProductDto) {
    return await prisma.product.create({
      data: {
        name: product.name,
        description: product.description ?? null,
        price: product.price,
        category_id: product.categoryId,
        image_url: product.imageUrl ?? null,
        sku: product.sku ?? null,
        weight: product.weight ?? null,
        dimensions: product.dimensions ?? null,
        is_active: product.isActive ?? true,
      },
      include: {
        category: true,
      },
    });
  }

  // Update product
  async update(id: number, data: UpdateProductDto) {
    return await prisma.product.update({
      where: { product_id: id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.categoryId,
        image_url: data.imageUrl,
        sku: data.sku,
        weight: data.weight,
        dimensions: data.dimensions,
        is_active: data.isActive,
      },
      include: {
        category: true,
      },
    });
  }

  // Delete product
  async delete(id: number) {
    return await prisma.product.delete({
      where: { product_id: id },
    });
  }
}

export default new ProductRepository();
