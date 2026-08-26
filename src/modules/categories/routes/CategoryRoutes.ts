import { Router } from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../controllers/category.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';

const router = Router();

router.get('/admin/categories', authentication, getCategories);
router.post('/admin/category', authentication, authorization('admin'), createCategory);
router.put('/admin/category/:categoryId', authentication, authorization('admin'), updateCategory);
router.delete(
    '/admin/category/:categoryId',
    authentication,
    authorization('admin'),
    deleteCategory
);

export default router;
