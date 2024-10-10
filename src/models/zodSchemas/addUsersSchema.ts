import { z } from 'zod';

export const addUsersSchema = z
    .object({
        participantCount: z.coerce.number({ message: 'Ожидалось число' }),
        judgeCount: z.coerce.number({ message: 'Ожидалось число' }),
    })
    .refine((data) => data.participantCount || data.judgeCount);
