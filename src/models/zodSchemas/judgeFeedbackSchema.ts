import { z } from 'zod';

export const judgeFeedbackSchema = (max: number) =>
    z.object({
        accepted: z.enum(['accept', 'not-accept'], {
            message: 'Ошибка статуса',
        }),
        points: z.coerce.number().lte(max, {
            message: `Оценка не должна выходить за пределы максимума (${max} баллов)`,
        }),
        comment: z
            .string()
            .trim()
            .min(2, { message: 'Строка должна быть минимум 2 символа' })
            .max(256, { message: 'Строка должна быть максимум 256 символов' })
            .or(z.string().trim().length(0))
            .nullable(),
    });

export type JudgeFeedbackRequestType = z.infer<
    ReturnType<typeof judgeFeedbackSchema>
>;
