import { z } from 'zod';

export const addPersonalSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  surname: z.string().min(2, 'Фамилия должна содержать не менее 2 символов'),
  email: z.string().email('Неверный формат почты'),
});
