import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';

const router = Router();

// Order Route
router.post('/order', authentication, authorization('waiter', 'cashier'), createOrder);

export default router;
