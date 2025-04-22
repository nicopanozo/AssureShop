export interface Category {
  category_id: number;
  name: string;
  description: string | null;
  parent_category_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Inventory {
  inventory_id: number;
  product_id: number;
  stock_quantity: number;
  low_stock_threshold: number | null;
  last_stock_update: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  review_id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
  user?: { // Assuming you might want basic user info in reviews
    first_name: string;
    last_name: string;
  };
}

export interface Product {
  product_id: number;
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
  category?: Category; // Make it optional as it might not always be included
  inventory?: Inventory | null; // Make it optional and nullable
  reviews?: Review[]; // Make it optional
}

export interface CreateProductDto extends Omit<Product, 'product_id' | 'createdAt' | 'updatedAt' | 'category' | 'inventory' | 'reviews'> {}

export interface UpdateProductDto extends Partial<Omit<Product, 'product_id' | 'createdAt' | 'updatedAt' | 'category' | 'inventory' | 'reviews'>> {}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
}