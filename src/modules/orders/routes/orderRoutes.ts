import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';
import { getOrderItemByAssignedRole } from '../controllers/orderItem.controller.js';

const router = Router();

// Order Route
router.post('/order', authentication, authorization('waiter'), createOrder);

// OrderItem Route
router.get(
    '/order-items',
    authentication,
    authorization('foodKitchen', 'beverageStation'),
    getOrderItemByAssignedRole
);

export default router;
