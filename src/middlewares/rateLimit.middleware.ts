import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 menit
    limit: 100, // max 100 per request,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'to many request, please wait..',
    },
});

export const authRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 menit
    limit: 5, // max 5 per request,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'to many request, please wait..',
    },
});
