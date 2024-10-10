import { z } from 'zod';

export const judgeFeedbackSchema = z.object({
    accepted: z.enum(['accept', 'not-accept'], { message: 'Ошибка статуса' }),
    points: z
        .string()
        .min(0, { message: 'dasdas' })
        .refine(
            (value) => {
                if (value) {
                    return /^\d+$/.test(value);
                } else {
                    return false;
                }
            },
            {
                message: 'Ожидалось число', // Сообщение об ошибке, если введенное значение не является числом
            },
        ),
    comment: z.string().nullable(),
});
