import { z } from 'zod';
import { getAllContestsSchema } from '../zodSchemas/getAllContestsSchema';

export type IChangeDurationResponse = z.infer<typeof getAllContestsSchema>;
