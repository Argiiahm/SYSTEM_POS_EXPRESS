import { z } from 'zod';

export const AuthSchemaLogin = z.object({
    email: z.string().email('Invalid Format Email'),
    password: z.string().min(8, 'Password Minimum 8 Character'),
});

export type AuthInputLogin = z.infer<typeof AuthSchemaLogin>;
