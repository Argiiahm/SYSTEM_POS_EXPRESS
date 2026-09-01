import { Router } from 'express';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';
import {
    getOrderItemByAssignedRole,
    updateStatusItem,
} from '../controllers/orderItem.controller.js';

const router = Router();

// OrderItem Route
router.get(
    '/order-items',
    authentication,
    authorization('foodKitchen', 'beverageStation'),
    getOrderItemByAssignedRole
);

// Update status item
router.patch(
    '/order-item/:itemId',
    authentication,
    authorization('foodKitchen', 'beverageStation'),
    updateStatusItem
);

export default router;
