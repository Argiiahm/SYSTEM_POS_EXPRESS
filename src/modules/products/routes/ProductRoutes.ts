import { Router } from 'express';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.get('/products', authentication, getProducts);
router.get('/product/:productId', authentication, getProductById);

// Admin
router.post('/product', authentication, authorization('admin'), createProduct);
router.put('/product/:productId', authentication, authorization('admin'), updateProduct);
router.delete('/product/:productId', authentication, authorization('admin'), deleteProduct);

export default router;
