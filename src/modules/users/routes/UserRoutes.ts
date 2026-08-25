import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/user.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';

const router = Router();

router.get('/admin/users', authentication, authorization('admin'), getUsers);
router.post('/admin/user', authentication, authorization('admin'), createUser);
router.put('/admin/user/:userId', authentication, authorization('admin'), updateUser);
router.delete('/admin/user/:userId', authentication, authorization('admin'), deleteUser);

export default router;
