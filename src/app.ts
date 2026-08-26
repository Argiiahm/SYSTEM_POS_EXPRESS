import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRouter from './modules/auth/routes/authRoutes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import UserRouter from './modules/users/routes/UserRoutes.js';
import CategoryRoutes from './modules/categories/routes/CategoryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', AuthRouter);
app.use('/api/v1', UserRouter);
app.use('/api/v1', CategoryRoutes);

app.use(errorHandler);
export default app;
