import { z } from 'zod';

const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const UserSchema = z.object({
    name: z.string().min(3, 'Name Minimum 3 Character').max(100, 'Name Maximum 100 Character'),
    email: z.string().email('Invalid Format Email'),
    telp: z.string().trim().min(1, 'No telp is Required').regex(phoneRegex, {
        message: 'Invalid Indonesia Number. (example: 0821xxx or 622xxxx)',
    }),
    password: z.string().min(8, 'Password Minimum 8 Character'),
    roleId: z.string().min(1, 'RoleId Required'),
});

export type UserInput = z.infer<typeof UserSchema>;
