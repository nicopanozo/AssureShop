    import { Router } from 'express';
    import productRoutes from './product.routes';

    const router = Router();

    // Definir todas las rutas de la API
    router.use('/products', productRoutes);

    // Aquí puedes añadir más rutas en el futuro:
    // router.use('/users', userRoutes);
    // router.use('/orders', orderRoutes);
    // router.use('/categories', categoryRoutes);
    // etc.

    export default router;