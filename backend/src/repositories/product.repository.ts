import prisma from '../config/database';
import { CreateProductDto, UpdateProductDto, ProductFilters } from '../models/product.model';

class ProductRepository {
  // Obtener todos los productos
  async findAll(filters?: ProductFilters) {
    const where: any = {};
    
    if (filters) {
      // Aplicar filtros si existen
      if (filters.categoryId !== undefined) {
        where.categoryId = filters.categoryId;
      }
      
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
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

  // Obtener un producto por ID
  async findById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  // Crear un nuevo producto
  async create(data: CreateProductDto) {
    return await prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  // Actualizar un producto existente
  async update(id: number, data: UpdateProductDto) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  // Eliminar un producto
  async delete(id: number) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}

export default new ProductRepository();