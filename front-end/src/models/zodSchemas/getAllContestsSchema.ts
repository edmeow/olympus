import { z } from 'zod';
import { ContestsStatesEnum } from '../constants/ContestsStatesEnum';

export const getAllContestsSchema = z.array(
    z.object({
        name: z.string(),
        session: z.number(),
        contestState: z.nativeEnum(ContestsStatesEnum),
    }),
);
