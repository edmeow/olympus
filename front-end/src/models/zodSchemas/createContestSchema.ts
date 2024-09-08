import { z } from 'zod';

export const createContestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Название олимпиады должно содержать не менее 2 символов')
        .max(256),
    participantCount: z.coerce
        .string()
        .min(1, { message: 'Количество жюри должно быть не менее 1' })
        .pipe(
            z.coerce.number({
                message: 'Количество участников должно быть не менее 1',
            }),
        ),

    judgeCount: z.coerce
        .string()
        .min(1, { message: 'Количество жюри должно быть не менее 1' })
        .pipe(
            z.coerce.number({
                message: 'Количество жюри должно быть не менее 1',
            }),
        ),
    usernamePrefix: z
        .string()
        .trim()
        .min(2, 'Длина префикса должна содержать не менее 2 символов')
        .max(256),
    duration: z
        .string({ message: 'Строка не соответствует формату времени (00:00)' })
        .regex(
            /^\d{2}:\d{2}$/,
            'Строка не соответствует формату времени (00:00)',
        ),
    //duration: z.string().time({ precision: 3 }),
    //problemInfos: z.array(ProblemModel),
});
