import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/user.controller.js';
import { authentication } from '../../../middlewares/authentication.middleware.js';
import { authorization } from '../../../middlewares/authorization.middleware.js';
import { getRoles } from '../controllers/role.controller.js';

const router = Router();

// end point users
router.get('/admin/users', authentication, authorization('admin'), getUsers);
router.post('/admin/user', authentication, authorization('admin'), createUser);
router.put('/admin/user/:userId', authentication, authorization('admin'), updateUser);
router.delete('/admin/user/:userId', authentication, authorization('admin'), deleteUser);

// endpoint get Roles
router.get('/roles', authentication, authorization('admin'), getRoles);

export default router;
