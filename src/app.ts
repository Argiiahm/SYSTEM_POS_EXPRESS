import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';

import AuthRouter from './modules/auth/routes/authRoutes.js';
import UserRouter from './modules/users/routes/UserRoutes.js';
import CategoryRouter from './modules/categories/routes/CategoryRoutes.js';
import ProductRouter from './modules/products/routes/ProductRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', AuthRouter);
app.use('/api/v1', UserRouter);
app.use('/api/v1', CategoryRouter);
app.use('/api/v1', ProductRouter);

app.use(errorHandler);
export default app;
