import { z } from 'zod';

export const CategorySchema = z.object({
    name: z.string().min(1, 'CategoryName Required').max(100, 'CategoryName Maximum 100 Character'),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
