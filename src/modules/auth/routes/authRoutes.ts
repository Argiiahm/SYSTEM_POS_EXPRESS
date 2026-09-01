import { Router } from 'express';
import { login, logout, refresh } from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

export default router;
