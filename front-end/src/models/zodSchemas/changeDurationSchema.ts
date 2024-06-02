import { z } from 'zod';

export const changeDurationSchema = z.object({
    duration: z
        .string()
        .regex(
            /^\d{2}:\d{2}$/,
            'Строка не соответствует формату времени (00:00).',
        ),
});
