import { z } from 'zod';
import { getAllContestsSchema } from '../zodSchemas/getAllContestsSchema';

export type IGetContestsResponse = z.infer<typeof getAllContestsSchema>;
