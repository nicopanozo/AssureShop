import { Router } from 'express';
import productController from '../controllers/product.controller';
import { isAdmin } from '../../middlewares/isAdmin';

const router = Router();

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// ADMIN Actions
router.post('/', isAdmin, productController.createProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

export default router;
