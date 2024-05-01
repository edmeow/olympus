import { z } from 'zod';
import { addPersonalSchema } from '../zodSchemas/addPersonalSchema';

export type IAddPersonalDataRequest = z.infer<typeof addPersonalSchema>;
