import { Router } from 'express';
import { completedOrder, createOrder, getOrders } from '../controllers/order.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';

const router = Router();

// Order Route
router.get('/orders', authentication, authorization('cashier', 'admin'), getOrders);
router.post('/order/:orderId', authentication, authorization('cashier'), completedOrder);
router.post('/order', authentication, authorization('waiter', 'cashier'), createOrder);

export default router;
