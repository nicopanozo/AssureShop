// Definimos las interfaces para los productos

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    sku?: string;
    weight?: number;
    dimensions?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    sku?: string;
    weight?: number;
    dimensions?: string;
    isActive?: boolean;
  }
  
  export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    imageUrl?: string;
    sku?: string;
    weight?: number;
    dimensions?: string;
    isActive?: boolean;
  }
  
  export interface ProductFilters {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isActive?: boolean;
  }