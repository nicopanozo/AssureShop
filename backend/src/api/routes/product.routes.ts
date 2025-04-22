// product.routes.ts
import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.patch('/products/:id', productController.updatePartialProduct);
router.delete('/products/:id', productController.deleteProduct); // Hard delete
router.patch('/products/:id/soft-delete', productController.softDeleteProduct); // Soft delete

export default router;