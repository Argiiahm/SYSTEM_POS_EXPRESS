import createHttpError from 'http-errors';
import { RoleList } from '../generated/prisma/client.js';
import type { Request, Response, NextFunction } from 'express';

export const authorization =
    (...roles: RoleList[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user?.role) {
            return next(createHttpError.Unauthorized('Unauthorization'));
        }

        if (!roles.includes(req.user.role)) {
            return next(createHttpError.Unauthorized('Access Denied'));
        }

        return next();
    };
