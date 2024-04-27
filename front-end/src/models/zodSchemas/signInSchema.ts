import { z } from 'zod';

export const signInSchema = z.object({
    username: z
        .string()
        .min(2, 'Имя пользователя должно содержать не менее 2 символов'),
    password: z.string().min(2, 'Пароль должен содержать не менее 2 символов'),
});
