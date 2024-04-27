import { z } from 'zod';

export const createContestSchema = z.object({
    nameContest: z
        .string()
        .min(2, 'Название олимпиады должно содержать не менее 2 символов'),
    participantCount: z
        .string()
        .min(1, 'Количество участников должно быть не менее 1'),
    judgeCount: z.string().min(1, 'Количество жюри должно быть не менее 1'),
    prefix: z
        .string()
        .min(2, 'Длина префикса должна содержать не менее 2 символов'),
    duration: z
        .string()
        .regex(
            /^\d{2}:\d{2}$/,
            'Строка не соответствует формату времени (00:00).',
        ),
    problems: z
        .array(z.string())
        .min(1, 'Массив проблем должен содержать хотя бы 1 элемент'),
});
