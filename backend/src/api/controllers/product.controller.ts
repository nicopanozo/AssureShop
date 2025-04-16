import { Request, Response } from 'express';
import productService from '../../services/product.service';
import logger from '../../utils/logger';

class ProductController {
  // GET /products - Obtener todos los productos
  async getAllProducts(req: Request, res: Response) {
    try {
      // Extraer parámetros de consulta para filtros
      const filters = {
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        search: req.query.search as string | undefined,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      };

      const products = await productService.getAllProducts(filters);
      res.status(200).json(products);
    } catch (error: any) {
      logger.error(`Error in getAllProducts: ${error.message}`);
      res.status(500).json({ error: 'Failed to get products' });
    }
  }

  // GET /products/:id - Obtener un producto por ID
  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error: any) {
      logger.error(`Error in getProductById: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to get product' });
      }
    }
  }

  // POST /products - Crear un nuevo producto
  async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error: any) {
      logger.error(`Error in createProduct: ${error.message}`);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  // PUT /products/:id - Actualizar un producto existente
  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedProduct = await productService.updateProduct(id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error: any) {
      logger.error(`Error in updateProduct: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update product' });
      }
    }
  }

  // DELETE /products/:id - Eliminar un producto
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await productService.deleteProduct(id);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error in deleteProduct: ${error.message}`);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete product' });
      }
    }
  }
}

export default new ProductController();